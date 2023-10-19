import { Avatar, AvatarImage } from '@/components/ui/avatar';

interface BotAvatarProps {
  imageUrl: string;
  style?: string;
}

const BotAvatar = ({ imageUrl, style }: BotAvatarProps) => {
  return (
    <Avatar className={style}>
      <AvatarImage src={imageUrl} className='object-cover' />
    </Avatar>
  );
};

export default BotAvatar;
