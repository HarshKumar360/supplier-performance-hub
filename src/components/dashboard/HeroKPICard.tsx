import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface HeroKPICardProps {
  title: string;
  value: string | number;
  suffix?: string;
  icon: LucideIcon;
  trend?: number;
  status?: "green" | "amber" | "red";
  description?: string;
}

export function HeroKPICard({
  title,
  value,
  suffix = "",
  icon: Icon,
  trend,
  status,
  description,
}: HeroKPICardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-card border border-border/40 p-6 transition-all duration-300 hover:shadow-lg hover:border-border/60 group">
      {/* Subtle gradient overlay based on status */}
      <div
        className={cn(
          "absolute inset-0 opacity-[0.03] transition-opacity group-hover:opacity-[0.05]",
          status === "green" && "bg-gradient-to-br from-rag-green to-transparent",
          status === "amber" && "bg-gradient-to-br from-rag-amber to-transparent",
          status === "red" && "bg-gradient-to-br from-rag-red to-transparent",
          !status && "bg-gradient-to-br from-primary to-transparent"
        )}
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div
            className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105",
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
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "w-2.5 h-2.5 rounded-full animate-pulse",
                  status === "red" && "bg-rag-red",
                  status === "amber" && "bg-rag-amber",
                  status === "green" && "bg-rag-green"
                )}
              />
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-1">
          <span className="text-4xl font-bold tracking-tight text-foreground">
            {value}
          </span>
          {suffix && (
            <span className="text-2xl font-medium text-muted-foreground ml-0.5">
              {suffix}
            </span>
          )}
        </div>

        {/* Title & Description */}
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground/70">{description}</p>
        )}

        {/* Trend */}
        {trend !== undefined && (
          <div
            className={cn(
              "flex items-center gap-1.5 mt-3 text-sm font-medium",
              trend > 0 ? "text-rag-green" : "text-rag-red"
            )}
          >
            {trend > 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{Math.abs(trend)}% vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
}
