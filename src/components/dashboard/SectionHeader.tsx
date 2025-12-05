import { cn } from "@/lib/utils";
import { LucideIcon, ArrowUpRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  icon: Icon,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between mb-5", className)}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-4.5 h-4.5 text-primary" />
          </div>
        )}
        <div>
          <h2 className="text-lg font-semibold text-foreground tracking-tight">{title}</h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {action.label}
          <ArrowUpRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
