import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { useIsMobile } from '@/hooks/use-mobile';
import { queryClient } from '@/lib/queryClient';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ChatInput } from '@/components/chat/chat-input';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { Menu, Settings, Moon, Sun } from 'lucide-react';
import type { Conversation, Message, OpenRouterMessage } from '@shared/schema';

export default function Chat() {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  // Fetch conversations
  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ['/api/conversations'],
  });

  // Fetch messages for current conversation
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ['/api/conversations', conversationId, 'messages'],
    enabled: !!conversationId,
  });

  // Create conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: async (title: string) => {
      const response = await apiRequest('POST', '/api/conversations', {
        title,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
    },
  });

  // Create message mutation
  const createMessageMutation = useMutation({
    mutationFn: async (data: {
      conversationId: string;
      role: string;
      content: string;
    }) => {
      const response = await apiRequest('POST', '/api/messages', data);
      return response.json();
    },
    onSuccess: () => {
      if (conversationId) {
        queryClient.invalidateQueries({
          queryKey: ['/api/conversations', conversationId, 'messages'],
        });
      }
    },
  });

  // Chat completion mutation
  const chatCompletionMutation = useMutation({
    mutationFn: async (data: {
      messages: OpenRouterMessage[];
      conversationId?: string;
    }) => {
      const response = await apiRequest('POST', '/api/chat/completions', data);
      return response.json();
    },
    onSuccess: () => {
      if (conversationId) {
        queryClient.invalidateQueries({
          queryKey: ['/api/conversations', conversationId, 'messages'],
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to get AI response',
        variant: 'destructive',
      });
    },
  });

  const handleSendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      let currentConversationId = conversationId;

      // Create new conversation if none exists
      if (!currentConversationId) {
        const title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
        const newConversation = await createConversationMutation.mutateAsync(
          title
        );
        currentConversationId = newConversation.id;
        window.history.pushState({}, '', `/chat/${newConversation.id}`);
      }

      // Save user message
      await createMessageMutation.mutateAsync({
        conversationId: currentConversationId!,
        role: 'user',
        content,
      });

      // Prepare messages for OpenRouter API
      const conversationMessages: OpenRouterMessage[] = [
        ...messages.map((msg) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
        { role: 'user' as const, content },
      ];

      // Get AI response
      await chatCompletionMutation.mutateAsync({
        messages: conversationMessages,
        conversationId: currentConversationId,
      });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentConversation = conversations.find(
    (c) => c.id === conversationId
  );

  return (
    <div className='flex h-screen bg-background text-foreground'>
      {/* Sidebar */}
      <div
        className={`${
          isMobile ? (sidebarOpen ? 'flex' : 'hidden') : 'flex'
        } w-64 bg-primary/5 dark:bg-secondary/10 border-r border-border flex-col transition-all duration-300 ease-in-out`}
      >
        <ChatSidebar
          conversations={conversations}
          currentConversationId={conversationId}
          onClose={() => setSidebarOpen(false)}
          data-testid='chat-sidebar'
        />
      </div>

      {/* Main Chat Area */}
      <div className='flex-1 flex flex-col'>
        {/* Header */}
        <div className='p-4 border-b border-border bg-background/80 dark:bg-background/80 backdrop-blur-sm'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              {isMobile && (
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  data-testid='button-sidebar-toggle'
                >
                  <Menu className='h-5 w-5' />
                </Button>
              )}
              <div>
                <h2 className='font-semibold text-foreground dark:text-foreground'>
                  {currentConversation?.title || 'A.M.A. (Ask Me Anything)'}
                </h2>
                <p className='text-sm text-muted-foreground dark:text-muted-foreground'>
                  Super.ID - Groq - Llama
                </p>
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              <Button
                variant='ghost'
                size='icon'
                onClick={toggleTheme}
                data-testid='button-theme-toggle'
              >
                {theme === 'dark' ? (
                  <Sun className='h-5 w-5' />
                ) : (
                  <Moon className='h-5 w-5' />
                )}
              </Button>
              <Button variant='ghost' size='icon' data-testid='button-settings'>
                <Settings className='h-5 w-5' />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className='flex-1 overflow-x-hidden'>
          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            data-testid='chat-messages'
          />
        </div>

        {/* Input Area */}
        <div className='p-4 border-t border-border bg-background/80 dark:bg-background/80 backdrop-blur-sm'>
          <div className='max-w-4xl mx-auto'>
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={isLoading}
              data-testid='chat-input'
            />
            <div className='text-xs text-muted-foreground dark:text-muted-foreground text-center mt-2'>
              AI can make mistakes. Check important information.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
