import { TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface KPIMetric {
  label: string;
  value: number | string;
  previousValue?: number;
  suffix?: string;
  prefix?: string;
  target?: number;
  inverse?: boolean;
  description?: string;
}

interface DetailedKPIPanelProps {
  title: string;
  metrics: KPIMetric[];
}

export function DetailedKPIPanel({ title, metrics }: DetailedKPIPanelProps) {
  const getTrend = (current: number, previous: number, inverse?: boolean) => {
    const diff = inverse ? previous - current : current - previous;
    if (diff > 0) return { icon: TrendingUp, color: "text-rag-green", label: "up" };
    if (diff < 0) return { icon: TrendingDown, color: "text-rag-red", label: "down" };
    return { icon: Minus, color: "text-muted-foreground", label: "unchanged" };
  };

  const getTargetStatus = (value: number, target: number, inverse?: boolean) => {
    if (inverse) {
      return value <= target ? "text-rag-green" : "text-rag-red";
    }
    return value >= target ? "text-rag-green" : "text-rag-red";
  };

  return (
    <div className="bg-card rounded-xl border border-border/50 p-5">
      <h3 className="font-semibold text-foreground mb-4">{title}</h3>
      <div className="space-y-3">
        {metrics.map((metric, index) => {
          const numValue = typeof metric.value === "number" ? metric.value : parseFloat(String(metric.value));
          const trend = metric.previousValue !== undefined
            ? getTrend(numValue, metric.previousValue, metric.inverse)
            : null;
          const TrendIcon = trend?.icon || Minus;

          return (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{metric.label}</span>
                {metric.description && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3.5 h-3.5 text-muted-foreground/50" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-48">{metric.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <div className="flex items-center gap-3">
                {metric.target !== undefined && (
                  <span className="text-xs text-muted-foreground">
                    Target: {metric.prefix}{metric.target}{metric.suffix}
                  </span>
                )}
                <span
                  className={cn(
                    "font-semibold",
                    metric.target !== undefined && getTargetStatus(numValue, metric.target, metric.inverse)
                  )}
                >
                  {metric.prefix}{metric.value}{metric.suffix}
                </span>
                {trend && (
                  <TrendIcon className={cn("w-4 h-4", trend.color)} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
