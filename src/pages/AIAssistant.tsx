import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, Sparkles, Loader2, User, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const sampleResponses: Record<string, string> = {
  "downtime": "Based on the last quarter's data, **ISS Germany** caused the most downtime with 847 total hours across all sites. This was primarily driven by HVAC system failures in Berlin (42%) and delayed parts procurement for refrigeration units in Munich (31%). The average response time was 18.3 hours, compared to the regional benchmark of 8 hours.\n\n**Recommendation:** Implement local inventory pooling for critical HVAC components and establish secondary supplier agreements for refrigeration parts.",
  "high-risk": "Here are the **top 5 high-risk suppliers** globally based on our predictive model:\n\n1. **ISS Germany** - Risk Score: 78/100\n   - SLA breach probability: 45%\n   - Rising delay trend\n\n2. **Vinci Civils** - Risk Score: 65/100\n   - Recent safety incident\n   - Cost overruns of 23%\n\n3. **SPIE Netherlands** - Risk Score: 58/100\n   - High repeat job rate (19%)\n   - Engineering resource constraints\n\n4. **Sodexo South Africa** - Risk Score: 52/100\n   - Below-target SLA (82%)\n   - Limited local parts availability\n\n5. **ClimaTech ANZ** - Risk Score: 48/100\n   - HVAC seasonal demand surge predicted",
  "spie": "**SPIE Netherlands** SLA Breach Prediction for Next Month:\n\n📊 **Probability: 32%** (Medium Risk)\n\nKey contributing factors:\n- Current SLA compliance: 86% (trending down from 91%)\n- Increased work order volume (+15% MoM)\n- 2 key technicians on scheduled leave\n- Parts supply chain delays for ATG systems\n\n**Mitigating Actions:**\n1. Request temporary contractor support\n2. Pre-order critical ATG components\n3. Schedule non-critical maintenance postponement\n\nWith these actions, breach probability could reduce to ~18%.",
  "ev charger": "**Root Cause Analysis - EV Charger Repeated Failures:**\n\n🔌 Based on analysis of 234 EV charger-related work orders:\n\n**Top Root Causes:**\n1. **Connector wear** (28%) - High-usage sites exceeding connector lifespan\n2. **Software glitches** (23%) - Firmware compatibility issues with newer vehicle models\n3. **Power surge damage** (19%) - Inadequate surge protection at 12 sites\n4. **Environmental factors** (15%) - Water ingress in outdoor units\n5. **User damage** (10%) - Cable mishandling\n\n**Recommendations:**\n- Implement 6-month connector replacement schedule for high-traffic sites\n- Coordinate firmware update cycle with ChargePoint Services\n- Install industrial-grade surge protectors at flagged sites\n- Add weatherproofing to 8 identified outdoor locations",
  "default": "I can help you with supplier performance analysis, risk predictions, and recommendations. Here are some things you can ask me:\n\n• \"Which supplier caused the most downtime in Germany last quarter?\"\n• \"Show me the top 5 high-risk suppliers globally\"\n• \"What's the predicted SLA breach probability for SPIE next month?\"\n• \"Explain the root causes of repeated failures for EV chargers\"\n• \"Compare CBRE and Mitie performance in the UK\"\n• \"What are the cost trends for engineering services?\"\n\nFeel free to ask any questions about supplier metrics, KPIs, or predictive insights!",
};

const getAIResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  if (lowerQuery.includes("downtime") && lowerQuery.includes("germany")) {
    return sampleResponses["downtime"];
  }
  if (lowerQuery.includes("high-risk") || lowerQuery.includes("high risk") || lowerQuery.includes("top") && lowerQuery.includes("risk")) {
    return sampleResponses["high-risk"];
  }
  if (lowerQuery.includes("spie") && (lowerQuery.includes("sla") || lowerQuery.includes("breach") || lowerQuery.includes("predict"))) {
    return sampleResponses["spie"];
  }
  if (lowerQuery.includes("ev") && (lowerQuery.includes("charger") || lowerQuery.includes("failure") || lowerQuery.includes("root cause"))) {
    return sampleResponses["ev charger"];
  }
  return sampleResponses["default"];
};

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your BP Supplier Intelligence Assistant. I can help you analyze supplier performance, identify risks, and provide actionable recommendations. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI thinking
    setTimeout(() => {
      const response = getAIResponse(userMessage.content);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response,
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
    }, 1500);
  };

  const suggestedQueries = [
    "Which supplier caused most downtime in Germany last quarter?",
    "Show me the top 5 high-risk suppliers globally",
    "What's the predicted SLA breach probability for SPIE next month?",
    "Explain the root causes of repeated failures for EV chargers",
  ];

  const handleSuggestedQuery = (query: string) => {
    setInput(query);
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Chat cleared. How can I help you with supplier analysis today?",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <DashboardLayout
      title="AI Assistant"
      subtitle="Intelligent supplier performance analysis"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-xl border border-border/50 flex flex-col h-[calc(100vh-200px)]">
          {/* Header */}
          <div className="p-4 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">BP Intelligence Assistant</h3>
                <p className="text-xs text-muted-foreground">Powered by Advanced Analytics</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClearChat} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Clear Chat
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex gap-4 animate-fade-in",
                  message.role === "user" && "flex-row-reverse"
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
                    message.role === "assistant"
                      ? "bg-gradient-primary"
                      : "bg-muted"
                  )}
                >
                  {message.role === "assistant" ? (
                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                  ) : (
                    <User className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3 max-w-[80%]",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <div
                    className={cn(
                      "text-sm whitespace-pre-wrap",
                      message.role === "assistant" && "prose prose-sm dark:prose-invert max-w-none"
                    )}
                    dangerouslySetInnerHTML={{
                      __html: message.content
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/\n/g, "<br />"),
                    }}
                  />
                  <div
                    className={cn(
                      "text-xs mt-2 opacity-60",
                      message.role === "user" ? "text-right" : ""
                    )}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4 animate-fade-in">
                <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-primary-foreground animate-pulse-soft" />
                </div>
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Analyzing data...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Queries */}
          {messages.length <= 2 && (
            <div className="px-4 py-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQueries.map((query) => (
                  <button
                    key={query}
                    onClick={() => handleSuggestedQuery(query)}
                    className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors text-left"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-border/50">
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about supplier performance, risks, or recommendations..."
                className="bg-background"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
