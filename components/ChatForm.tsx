'use client';

import { ChangeEvent, FormEvent } from 'react';
import { ChatRequestOptions } from 'ai';
import { SendHorizonal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ChatFormProps {
  isLoading: boolean;
  input: string;
  handleInputChange: (
    e: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement>
  ) => void;
  onSubmit: (
    e: FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions | undefined
  ) => void;
}

const ChatForm = ({
  isLoading,
  input,
  handleInputChange,
  onSubmit,
}: ChatFormProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className='w-full relative flex items-center py-4 gap-x-2 border-t border-primary/10'
    >
      <Input
        disabled={isLoading}
        value={input}
        onChange={handleInputChange}
        placeholder='Write your message here...'
        className='rounded-lg bg-primary/10'
      />
      <Button
        disabled={isLoading}
        variant='ghost'
        className='absolute right-[-5px]'
      >
        <SendHorizonal className='w-4 h-4' />
      </Button>
    </form>
  );
};

export default ChatForm;
