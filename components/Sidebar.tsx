'use client';

import { cn } from '@/lib/utils';
import { Home, Plus, Settings } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const routes = [
    {
      icon: Home,
      href: '/',
      label: 'Home',
      pro: false,
    },
    {
      icon: Plus,
      href: '/companion/new',
      label: 'Create',
      pro: true,
    },
    {
      icon: Settings,
      href: '/settings',
      label: 'Settings',
      pro: false,
    },
  ];

  const onNavigate = (url: string, pro: boolean) => {
    return router.push(url);
  };

  return (
    <div className='flex flex-col space-y-4 h-full text-primary bg-secondary'>
      <div className='flex flex-1 justify-center p-3'>
        <div className='space-y-2'>
          {routes.map((route) => (
            <div
              key={route.label}
              onClick={() => onNavigate(route.href, route.pro)}
              className={cn(
                'text-muted-foreground text-xs group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition',
                pathname === route.href && 'bg-primary/10 text-primary'
              )}
            >
              <div className='flex flex-1 flex-col items-center gap-y-2'>
                <route.icon className='h-5 w-5' />
                {route.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
