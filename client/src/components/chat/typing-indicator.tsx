import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex space-x-3 max-w-[80%]">
        <div className="w-8 h-8 bg-accent dark:bg-accent rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="h-4 w-4 text-accent-foreground dark:text-accent-foreground" />
        </div>
        <div className="bg-muted dark:bg-muted rounded-2xl rounded-bl-md px-4 py-3">
          <div className="flex space-x-1">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
