import { currentUser } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';

const DAY_MS = 86_400_000;

export async function checkSubscription(): Promise<boolean> {
  const user = await currentUser();
  if (!user || !user.id || !user.firstName) return false;

  const userSubscription = await prismadb.subscription.findUnique({
    where: {
      userId: user?.id,
    },
    select: {
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      stripePriceId: true,
      stripeCurrentPeriodEnd: true,
    },
  });
  if (!userSubscription) return false;

  const isValid =
    userSubscription.stripePriceId &&
    userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_MS > Date.now();

  return !!isValid;
}
