import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { checkSubscription } from '@/lib/subscription';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isPro = await checkSubscription();

  return (
    <div className='h-full'>
      <Navbar isPro={isPro} />
      <div className='hidden md:flex flex-col mt-16 w-20 fixed inset-y-0 z-50'>
        <Sidebar isPro={isPro} />
      </div>
      <main className='md:pl-20 pt-16 h-full'>{children}</main>
    </div>
  );
}
