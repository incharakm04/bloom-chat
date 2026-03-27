import { useState, useRef, useEffect, useCallback } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage, Message } from "./ChatMessage";
import { ChatSuggestions } from "./ChatSuggestions";
import { ChatInput } from "./ChatInput";

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hi there! 👋 I'm your PCOS Assistant. I'm here to help you understand Polycystic Ovary Syndrome and support you on your health journey.",
  },
  {
    id: "2",
    role: "assistant",
    content:
      "**PCOS affects 1 in 10 women** of reproductive age, making it one of the most common hormonal disorders.\n\nWhile there's no cure, many women successfully manage symptoms through lifestyle changes, medications, and proper medical care.\n\n**Note:** I provide information only about PCOS/PCOD and cannot replace professional medical advice.",
  },
];

const SMART_SUGGESTIONS = [
  "What causes PCOS?",
  "Common PCOS symptoms",
  "Best diet for PCOS",
];

export function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(SMART_SUGGESTIONS);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setSuggestions([]);
    setIsLoading(true);

    try {
      // Call FastAPI backend
      const response = await fetch("https://bloom-chat-1yub.onrender.com/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Optional suggestions
      setSuggestions([
        "What are PCOS symptoms?",
        "How is PCOS diagnosed?",
        "PCOS treatment options",
      ]);
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "⚠️ Unable to connect to the PCOS AI assistant. Please make sure the backend server is running.",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleBack = () => {
    console.log("Navigate back");
  };

  return (
    <div className="flex h-screen max-h-screen flex-col bg-background">
      <ChatHeader title="PCOS Assistant" onBack={handleBack} />

      <main className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4 px-4 py-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-bubble rounded-bl-md bg-chat-assistant px-4 py-3 chat-bubble-shadow">
                <TypingIndicator />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="sticky bottom-0 border-t border-border bg-background">
        <ChatSuggestions
          suggestions={suggestions}
          onSelect={handleSuggestionSelect}
        />
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </footer>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1">
      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
    </div>
    
  );
}
