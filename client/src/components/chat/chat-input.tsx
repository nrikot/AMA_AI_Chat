import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, ChevronRight, SendHorizonal } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 128) + 'px';
    }
  }, [message]);

  return (
    <form onSubmit={handleSubmit} className='relative'>
      <Textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='Chat here...'
        disabled={disabled}
        className='w-full resize-none rounded-xl border border-input bg-input dark:bg-input px-4 py-3 pr-12 text-sm placeholder:text-muted-foreground dark:placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:cursor-not-allowed disabled:opacity-20 max-h-32 min-h-[48px]'
        rows={1}
        data-testid='input-message'
      />
      <Button
        type='submit'
        disabled={!message.trim() || disabled}
        className='absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full disabled:cursor-not-allowed disabled:opacity-80'
        data-testid='button-send'
      >
        <SendHorizonal className='h-12 w-12' />
      </Button>
    </form>
  );
}
