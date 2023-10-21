'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useProModal } from '@/hooks/use-pro-modal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface SubscribeButtonProps {
  isPro: boolean;
}

const SubscribeButton = ({ isPro = false }: SubscribeButtonProps) => {
  const proModal = useProModal();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const onClick = async () => {
    try {
      setLoading(true);
      // if (!isPro) {
      //   proModal.open();
      // }
      const response = await fetch('/api/stripe', {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url;
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        description: 'Something went wrong.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={loading}
      size='sm'
      variant={isPro ? 'default' : 'premium'}
    >
      {isPro ? 'Manage subscription' : 'Upgrade to Pro'}
      {!isPro && <Sparkles className='h-4 w-4 ml-2 fill-white' />}
    </Button>
  );
};

export default SubscribeButton;
