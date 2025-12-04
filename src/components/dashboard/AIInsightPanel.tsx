import { useState } from "react";
import { Bot, Send, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const sampleInsights = [
  "ISS Germany shows a rising delay trend of 12% MoM, driven by HVAC stockouts in Berlin. Recommending increased inventory pooling.",
  "CBRE UK has maintained Gold SLA for 8 consecutive months. Cost per job reduced by 15% through preventive maintenance optimization.",
  "EVTech Solutions has 3 EV charger failures predicted in the next 30 days at London Heathrow Hub. Schedule proactive maintenance.",
  "SPIE Netherlands shows 23% increase in repeat jobs for refrigeration units. Root cause analysis suggests training gaps.",
];

export function AIInsightPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI assistant for supplier performance analysis. I can help you understand trends, identify risks, and provide recommendations. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const response = sampleInsights[Math.floor(Math.random() * sampleInsights.length)];
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsLoading(false);
    }, 1500);
  };

  const quickPrompts = [
    "Top risk suppliers",
    "EV charger failures",
    "Cost overruns this month",
    "Safety incidents summary",
  ];

  return (
    <div className="bg-card rounded-xl border border-border/50 flex flex-col h-[500px]">
      {/* Header */}
      <div className="p-4 border-b border-border/50 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center">
          <Bot className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">AI Insights</h3>
          <p className="text-xs text-muted-foreground">Powered by BP Analytics Engine</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex gap-3 animate-fade-in",
              message.role === "user" && "flex-row-reverse"
            )}
          >
            {message.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
            )}
            <div
              className={cn(
                "rounded-lg px-4 py-2.5 max-w-[85%] text-sm",
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              )}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-primary animate-pulse-soft" />
            </div>
            <div className="bg-muted rounded-lg px-4 py-2.5">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      {/* Quick prompts */}
      <div className="px-4 py-2 flex gap-2 flex-wrap">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => setInput(prompt)}
            className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border/50">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about supplier performance..."
            className="bg-background"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
