import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import prismadb from '@/lib/prismadb';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET! || ''
    );
  } catch (error) {
    console.error('[SUBSCRIPTION_POST]:', error);
    return new NextResponse('Webhook error.', { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );

  if (event.type === 'checkout.session.completed') {
    if (!session?.metadata?.userId) {
      return new NextResponse('User ID is required.', { status: 400 });
    }

    await prismadb.subscription.create({
      data: {
        userId: session.metadata.userId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  if (event.type === 'invoice.payment_succeeded') {
    await prismadb.subscription.update({
      where: {
        stripeCustomerId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}
