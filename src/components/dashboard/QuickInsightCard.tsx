import { cn } from "@/lib/utils";
import { Sparkles, ArrowRight } from "lucide-react";

interface QuickInsightCardProps {
  insight: string;
  supplier?: string;
  severity?: "info" | "warning" | "critical";
  onClick?: () => void;
}

export function QuickInsightCard({
  insight,
  supplier,
  severity = "info",
  onClick,
}: QuickInsightCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 rounded-xl border transition-all duration-200 hover:shadow-md group",
        severity === "critical" && "bg-rag-red/5 border-rag-red/20 hover:border-rag-red/40",
        severity === "warning" && "bg-rag-amber/5 border-rag-amber/20 hover:border-rag-amber/40",
        severity === "info" && "bg-primary/5 border-primary/20 hover:border-primary/40"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
            severity === "critical" && "bg-rag-red/10",
            severity === "warning" && "bg-rag-amber/10",
            severity === "info" && "bg-primary/10"
          )}
        >
          <Sparkles
            className={cn(
              "w-4 h-4",
              severity === "critical" && "text-rag-red",
              severity === "warning" && "text-rag-amber",
              severity === "info" && "text-primary"
            )}
          />
        </div>
        <div className="flex-1 min-w-0">
          {supplier && (
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {supplier}
            </span>
          )}
          <p className="text-sm text-foreground mt-0.5 line-clamp-2">{insight}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
      </div>
    </button>
  );
}
