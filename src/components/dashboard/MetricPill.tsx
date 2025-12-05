import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricPillProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  status?: "green" | "amber" | "red";
}

export function MetricPill({ label, value, icon: Icon, status }: MetricPillProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-card border border-border/40 transition-all hover:border-border/60 hover:shadow-sm">
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center",
          status === "red" && "bg-rag-red/10",
          status === "amber" && "bg-rag-amber/10",
          status === "green" && "bg-rag-green/10",
          !status && "bg-muted"
        )}
      >
        <Icon
          className={cn(
            "w-4 h-4",
            status === "red" && "text-rag-red",
            status === "amber" && "text-rag-amber",
            status === "green" && "text-rag-green",
            !status && "text-muted-foreground"
          )}
        />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-semibold text-foreground">{value}</span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}
