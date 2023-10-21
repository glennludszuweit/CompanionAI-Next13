'use client';

import { ElementRef, useEffect, useRef, useState } from 'react';
import { Companion } from '@prisma/client';
import ChatMessage, { ChatMessageProps } from '@/components/ChatMessage';

interface ChatMessagesProps {
  companion: Companion;
  messages: ChatMessageProps[];
  isLoading: boolean;
}

const ChatMessages = ({
  companion,
  messages,
  isLoading,
}: ChatMessagesProps) => {
  const scrollRef = useRef<ElementRef<'div'>>(null);
  const [fakeIsLoading, setFakeIsLoading] = useState<boolean>(
    messages.length === 0 ? true : false
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFakeIsLoading(false);
    }, 2500);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div className='flex-1 overflow-y-auto pr-1'>
      <ChatMessage
        isLoading={fakeIsLoading}
        role='system'
        content={`Hello! My name is ${companion.name} – ${companion.description}`}
        imageUrl={companion.imageUrl}
      />

      {messages.map((message) => (
        <ChatMessage
          key={message.content}
          role={message.role}
          content={message.content}
          imageUrl={companion.imageUrl}
        />
      ))}

      {isLoading && (
        <ChatMessage role='system' imageUrl={companion.imageUrl} isLoading />
      )}

      <div ref={scrollRef} />
    </div>
  );
};

export default ChatMessages;
