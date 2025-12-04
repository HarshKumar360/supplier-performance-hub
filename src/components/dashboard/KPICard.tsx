import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  suffix?: string;
  icon: LucideIcon;
  trend?: number;
  status?: "green" | "amber" | "red";
  className?: string;
}

export function KPICard({
  title,
  value,
  suffix = "",
  icon: Icon,
  trend,
  status,
  className,
}: KPICardProps) {
  const getTrendIcon = () => {
    if (!trend) return <Minus className="w-4 h-4" />;
    return trend > 0 ? (
      <TrendingUp className="w-4 h-4" />
    ) : (
      <TrendingDown className="w-4 h-4" />
    );
  };

  const getTrendColor = () => {
    if (!trend) return "text-muted-foreground";
    return trend > 0 ? "text-rag-green" : "text-rag-red";
  };

  return (
    <div className={cn("kpi-card group", className)}>
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105",
            status === "red" && "bg-rag-red/10",
            status === "amber" && "bg-rag-amber/10",
            status === "green" && "bg-rag-green/10",
            !status && "bg-primary/10"
          )}
        >
          <Icon
            className={cn(
              "w-5 h-5",
              status === "red" && "text-rag-red",
              status === "amber" && "text-rag-amber",
              status === "green" && "text-rag-green",
              !status && "text-primary"
            )}
          />
        </div>
        {status && (
          <span
            className={cn(
              "rag-indicator",
              status === "red" && "rag-red",
              status === "amber" && "rag-amber",
              status === "green" && "rag-green"
            )}
          />
        )}
      </div>

      <div className="space-y-1">
        <p className="stat-label">{title}</p>
        <div className="flex items-baseline gap-1">
          <span className="stat-value animate-count-up">{value}</span>
          {suffix && <span className="text-lg text-muted-foreground">{suffix}</span>}
        </div>
      </div>

      {trend !== undefined && (
        <div className={cn("flex items-center gap-1 mt-3 text-sm", getTrendColor())}>
          {getTrendIcon()}
          <span>{Math.abs(trend)}% vs last month</span>
        </div>
      )}
    </div>
  );
}
