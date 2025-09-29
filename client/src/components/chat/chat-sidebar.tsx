import { Button } from '@/components/ui/button';
import { LogoIcon } from '@/components/ui/icons-logo';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, MoreHorizontal, User } from 'lucide-react';
import { Link } from 'wouter';
import type { Conversation } from '@shared/schema';

interface ChatSidebarProps {
  conversations: Conversation[];
  currentConversationId?: string;
  onClose: () => void;
}

export function ChatSidebar({
  conversations,
  currentConversationId,
  onClose,
}: ChatSidebarProps) {
  return (
    <>
      {/* Sidebar Header */}
      <div className='p-4 border-b border-border'>
        <div className='flex items-center justify-between'>
          <Link href='/'>
            <h1 className='inline-flex items-center gap-2 text-lg text-center font-semibold text-foreground dark:text-foreground'>
              <LogoIcon className='w-6 h-6' />
              <span>SUPER.ID</span>
            </h1>
          </Link>
          <Button
            variant='ghost'
            size='icon'
            asChild
            data-testid='button-new-chat'
          >
            <Link href='/'>
              <Plus className='h-4 w-4' />
            </Link>
          </Button>
        </div>
      </div>

      {/* Chat History */}
      <ScrollArea className='flex-1 p-4'>
        <div className='space-y-2'>
          {conversations.map((conversation) => (
            <Link
              key={conversation.id}
              href={`/chat/${conversation.id}`}
              onClick={onClose}
            >
              <div
                className={`p-3 hover:bg-accent dark:hover:bg-accent rounded-lg cursor-pointer transition-colors group ${
                  currentConversationId === conversation.id
                    ? 'bg-accent dark:bg-accent'
                    : ''
                }`}
                data-testid={`conversation-${conversation.id}`}
              >
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-foreground dark:text-foreground truncate'>
                    {conversation.title}
                  </span>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6'
                    data-testid={`button-conversation-options-${conversation.id}`}
                  >
                    <MoreHorizontal className='h-3 w-3' />
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </ScrollArea>

      {/* Sidebar Footer */}
      <div className='p-4 border-t border-border'>
        <div className='flex items-center space-x-3'>
          <div className='w-8 h-8 bg-primary dark:bg-primary rounded-full flex items-center justify-center'>
            <User className='h-4 w-4 text-primary-foreground dark:text-primary-foreground' />
          </div>
          <span className='text-sm font-medium text-foreground dark:text-foreground'>
            User
          </span>
        </div>
      </div>
    </>
  );
}
