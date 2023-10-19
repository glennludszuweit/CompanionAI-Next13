import { useTheme } from 'next-themes';
import { useUser } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

const UserAvatar = () => {
  const { user } = useUser();
  const { theme } = useTheme();
  return (
    <Avatar
      className={cn(
        'w-8 h-8 border',
        theme === 'light' ? 'border-primary/10' : 'border-white'
      )}
    >
      <AvatarImage src={user?.imageUrl} className='object-cover' />
    </Avatar>
  );
};

export default UserAvatar;
