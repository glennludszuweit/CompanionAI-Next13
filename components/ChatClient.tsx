'use client';

import { FormEvent, useState } from 'react';
import { useCompletion } from 'ai/react';
import { useRouter } from 'next/navigation';
import { Companion, Message } from '@prisma/client';
import { ChatMessageProps } from '@/components/ChatMessage';
import ChatHeader from '@/components/ChatHeader';
import ChatForm from '@/components/ChatForm';
import ChatMessages from '@/components/ChatMessages';

interface ChatClientProps {
  companion: Companion & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
}

const ChatClient = ({ companion }: ChatClientProps) => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessageProps[]>(
    companion.messages
  );

  const { input, setInput, handleInputChange, isLoading, handleSubmit } =
    useCompletion({
      api: `/api/chat/${companion.id}`,
      onFinish(prompt, completion) {
        const systemMessage: ChatMessageProps = {
          role: 'system',
          content: completion,
        };

        setMessages((currentMsgs) => [...currentMsgs, systemMessage]);
        setInput('');

        router.refresh();
      },
    });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const userMessage: ChatMessageProps = {
      role: 'user',
      content: input,
    };

    setMessages((currentMsgs) => [...currentMsgs, userMessage]);
    handleSubmit(e);
    setInput('');
  };

  return (
    <div className='flex flex-col h-full p-4 space-y-2'>
      <ChatHeader companion={companion} />
      <ChatMessages
        companion={companion}
        messages={messages}
        isLoading={isLoading}
      />
      <ChatForm
        isLoading={isLoading}
        input={input}
        handleInputChange={handleInputChange}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default ChatClient;
