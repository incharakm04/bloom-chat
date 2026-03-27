import { ArrowLeft } from "lucide-react";

interface ChatHeaderProps {
  title?: string;
  onBack?: () => void;
}

export function ChatHeader({ title = "PCOS Assistant"}: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-background">
      <div className="flex items-center gap-3 px-4 py-3">
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>
      <div className="h-0.5 w-full bg-chat-header-accent opacity-60" />
    </header>
  );
}
