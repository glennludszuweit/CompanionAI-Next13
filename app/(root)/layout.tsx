import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='h-full'>
      <Navbar />
      <div className='hidden md:flex flex-col mt-16 w-20 fixed inset-y-0 z-50'>
        <Sidebar />
      </div>
      <main className='md:pl-20 pt-16 h-full'>{children}</main>
    </div>
  );
};

export default RootLayout;
