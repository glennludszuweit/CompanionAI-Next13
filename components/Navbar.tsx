'use client';

import { UserButton } from '@clerk/nextjs';
import { Sparkles } from 'lucide-react';
import { Poppins } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ModeToggle } from './theme/theme-toggle';
import { useProModal } from '@/hooks/use-pro-modal';
import Link from 'next/link';
import MobileSidebar from './MobileSidebar';

interface NavbarProps {
  isPro: boolean;
}

const font = Poppins({
  weight: '600',
  subsets: ['latin'],
});

const Navbar = ({ isPro }: NavbarProps) => {
  const proModal = useProModal();

  return (
    <div className='fixed w-full h-16 z-10 flex justify-between items-center py-2 px-4 border-b border-primary/10 bg-secondary'>
      <div className='flex items-center'>
        <MobileSidebar isPro={isPro} />
        <Link href='/'>
          <h1
            className={cn(
              'hidden md:block text-xl md:text-3xl font-bold text-primary',
              font.className
            )}
          >
            companion.ai
          </h1>
        </Link>
      </div>
      <div className='flex items-center gap-x-3'>
        {!isPro && (
          <Button variant='premium' size='sm' onClick={proModal.open}>
            Upgrade
            <Sparkles className='h-4 w-4 fill-white ml-2' />
          </Button>
        )}
        <ModeToggle />
        <UserButton afterSignOutUrl='/' />
      </div>
    </div>
  );
};

export default Navbar;
