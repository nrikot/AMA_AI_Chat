import { Bot, User } from "lucide-react";
import type { Message } from "@shared/schema";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] bg-primary dark:bg-primary text-primary-foreground dark:text-primary-foreground rounded-2xl rounded-br-md px-4 py-3">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="flex space-x-3 max-w-[80%]">
        <div className="w-8 h-8 bg-accent dark:bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <Bot className="h-4 w-4 text-accent-foreground dark:text-accent-foreground" />
        </div>
        <div className="bg-muted dark:bg-muted rounded-2xl rounded-bl-md px-4 py-3">
          <p className="whitespace-pre-wrap text-muted-foreground dark:text-muted-foreground">
            {message.content}
          </p>
        </div>
      </div>
    </div>
  );
}
