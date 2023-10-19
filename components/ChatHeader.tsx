'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useToast } from '@/components/ui/use-toast';
import {
  ChevronLeft,
  Edit,
  MessagesSquare,
  MoreVertical,
  Trash,
} from 'lucide-react';
import { Companion, Message } from '@prisma/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import BotAvatar from '@/components/BotAvatar';

interface ChatHeaderProps {
  companion: Companion & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
}

const ChatHeader = ({ companion }: ChatHeaderProps) => {
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  const onDelete = async () => {
    try {
      const response = await fetch(`/api/companion/${companion.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Companion deleted.',
        });
        router.refresh();
        router.push('/');
      } else {
        toast({
          variant: 'destructive',
          description: 'Something went wrong.',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='w-full flex justify-between items-center border-b border-primary/10 pb-4'>
      <div className='flex items-center gap-x-2'>
        <Button onClick={() => router.back()} size='icon' variant='ghost'>
          <ChevronLeft className='w-6 h-6' />
        </Button>
        <div className='flex items-center gap-x-4'>
          <BotAvatar imageUrl={companion.imageUrl} style='w-12 h-12' />
          <div className='flex flex-col gap-y-1'>
            <div className='flex items-center gap-x-2'>
              <p className='text-sm'>{companion.name}</p>
              <div className='flex items-center text-xs text-muted-foreground gap-x-1'>
                <MessagesSquare className='w-4 h-4' />
                {companion._count.messages}
              </div>
            </div>
            <p className='text-xs text-muted-foreground'>
              by @{companion.creatorName.toLowerCase().replace(' ', '')}
            </p>
          </div>
        </div>
      </div>

      {user?.id === companion.creatorId && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size='icon' variant='ghost'>
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem
              className='cursor-pointer'
              onClick={() => router.push(`/companion/${companion.id}`)}
            >
              <Edit className='w-4 h-4 mr-2' />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className='cursor-pointer' onClick={onDelete}>
              <Trash className='w-4 h-4 mr-2' />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default ChatHeader;
