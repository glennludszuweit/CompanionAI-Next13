import SubscribeButton from '@/components/SubscribeButton';
import { checkSubscription } from '@/lib/subscription';

export default async function Settings() {
  const isPro = await checkSubscription();

  return (
    <div className='h-full p-4 space-y-2'>
      <h3 className='text-lg font-medium'>Settings</h3>
      <p className='text-muted-foreground text-sm'>
        {isPro
          ? 'You are subscribed to Pro. You can create as many companions as you like!'
          : 'You are not subscribed. Subscribe today to create your own companions!'}
      </p>

      <SubscribeButton isPro={isPro} />
    </div>
  );
}
