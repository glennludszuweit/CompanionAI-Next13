import { auth, currentUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { absoluteUrl } from '@/lib/utils';
import prismadb from '@/lib/prismadb';

const settingsUrl = absoluteUrl('/settings');

export async function GET() {
  try {
    const { userId } = auth();
    const user = await currentUser();
    if (!userId || !user) {
      return new NextResponse('Unauthorized.', { status: 401 });
    }

    const userSubscription = await prismadb.subscription.findUnique({
      where: {
        userId,
      },
    });
    if (userSubscription && userSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: settingsUrl,
      });
      return new NextResponse(JSON.stringify({ url: stripeSession.url }), {
        status: 201,
      });
    }

    const newCustomerStripeSession = await stripe.checkout.sessions.create({
      success_url: settingsUrl,
      cancel_url: settingsUrl,
      payment_method_types: ['card', 'paypal'],
      mode: 'subscription',
      billing_address_collection: 'auto',
      customer_email: user.emailAddresses[0].emailAddress,
      line_items: [
        {
          price_data: {
            currency: 'USD',
            product_data: {
              name: 'CompanionAI Pro',
              description: 'Create custom AI companions.',
            },
            unit_amount: 999,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
    });
    return new NextResponse(
      JSON.stringify({ url: newCustomerStripeSession.url }),
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error('[STRIPE_GET]:', error);
    return new NextResponse('Internal server error.', { status: 500 });
  }
}
