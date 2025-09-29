import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from '@/components/chat/message-bubble';
import { TypingIndicator } from '@/components/chat/typing-indicator';
import { LogoIcon } from '../ui/icons-logo';
import { Brain } from 'lucide-react';
import type { Message } from '@shared/schema';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  'data-testid'?: string;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className='flex-1 flex items-center justify-center p-6'>
        <div className='text-center'>
          <div className='w-16 h-16 bg-primary dark:bg-primary rounded-full flex items-center justify-center mx-auto mb-4'>
            <LogoIcon className='w-14 h-14 rotate-[0deg]' />
            {/* <Brain className='h-8 w-8 text-primary-foreground dark:text-primary-foreground' /> */}
          </div>
          <h3 className='text-xl font-semibold mb-2 text-foreground dark:text-foreground'>
            How can I help you today?
          </h3>
          <p className='text-muted-foreground dark:text-muted-foreground'>
            Chat with Super.ID AMA
            <br />
            <em className='font-size-xs'>(powered by Llama on Groq Cloud)</em>
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea ref={scrollAreaRef} className='flex-1'>
      <div className='max-w-4xl mx-auto p-6 space-y-6'>
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            data-testid={`message-${message.id}`}
          />
        ))}

        {isLoading && <TypingIndicator data-testid='typing-indicator' />}

        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
