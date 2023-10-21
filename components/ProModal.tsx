'use client';

import { useState } from 'react';
import { useProModal } from '@/hooks/use-pro-modal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ProModal = () => {
  const proModal = useProModal();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const onSubscribe = async () => {
    try {
      setLoading(true);
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
    <Dialog open={proModal.isOpen} onOpenChange={proModal.close}>
      <DialogContent>
        <DialogHeader className='space-y-4'>
          <DialogTitle className='text-center'>Upgrade to Pro!</DialogTitle>
          <DialogDescription className='text-center space-y-2'>
            Create{' '}
            <span className='text-sky-500 mx-1 font-medium'>custom AI</span>
            companions!
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className='flex justify-between'>
          <p>
            $<span className='text-2xl font-medium'>9</span>
            <span className='text-sm'>.99 / mo</span>
          </p>
          <Button disabled={loading} onClick={onSubscribe} variant='premium'>
            Subscribe
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProModal;
