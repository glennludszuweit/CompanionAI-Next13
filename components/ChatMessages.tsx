'use client';

import { ElementRef, useEffect, useRef } from 'react';
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

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div className='flex-1 overflow-y-auto pr-1'>
      {messages.map((message) => (
        <ChatMessage
          key={message.content}
          role={message.role}
          content={message.content}
          imageUrl={message.imageUrl}
        />
      ))}

      {isLoading && (
        <ChatMessage role='system' imageUrl={companion.imageUrl} isLoading />
      )}

      <div ref={scrollRef}></div>
    </div>
  );
};

export default ChatMessages;
