import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface BotAvatarProps {
  imageUrl: string;
}

const BotAvatar = ({ imageUrl }: BotAvatarProps) => {
  return (
    <Avatar className='w-12 h-12'>
      <AvatarImage src={imageUrl} />
    </Avatar>
  );
};

export default BotAvatar;
