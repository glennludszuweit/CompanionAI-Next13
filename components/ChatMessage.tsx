'use client';

import { useTheme } from 'next-themes';
import { BeatLoader } from 'react-spinners';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import BotAvatar from '@/components/BotAvatar';
import UserAvatar from '@/components/UserAvatar';
import { Copy } from 'lucide-react';
import { Message } from '@prisma/client';

export interface ChatMessageProps {
  role: 'system' | 'user';
  content?: string;
  imageUrl?: string | undefined;
  isLoading?: boolean;
}

const ChatMessage = ({
  role,
  content,
  imageUrl,
  isLoading,
}: ChatMessageProps) => {
  const { toast } = useToast();
  const { theme } = useTheme();

  const onCopy = () => {
    if (!content) return;

    navigator.clipboard.writeText(content);
    toast({
      description: 'Message copied to clipboard.',
    });
  };

  return (
    <div
      className={cn(
        'w-full group flex items-start gap-x-3 py-4',
        role === 'user' && 'justify-end'
      )}
    >
      {role !== 'user' && imageUrl && (
        <BotAvatar
          imageUrl={imageUrl}
          style={`w-8 h-8 border ${
            theme === 'light' ? 'border-primary/10' : 'border-white'
          }`}
        />
      )}
      <div className='flex relative'>
        <div className='rounded-md px-4 py-2 max-w-sm text-sm bg-primary/10'>
          {isLoading ? (
            <BeatLoader
              size={4}
              color={theme === 'light' ? 'black' : 'white'}
            />
          ) : (
            content
          )}
        </div>

        {!isLoading && role !== 'user' && (
          <Button
            onClick={onCopy}
            size='icon'
            variant='ghost'
            className={cn(
              'w-4 h-4 absolute opacity-0 group-hover:opacity-100 tansition',
              role === 'system' ? 'right-[-2em]' : 'left-[-2em]'
            )}
          >
            <Copy className='w-5 h-5' />
          </Button>
        )}
      </div>
      {role === 'user' && <UserAvatar />}
    </div>
  );
};

export default ChatMessage;
