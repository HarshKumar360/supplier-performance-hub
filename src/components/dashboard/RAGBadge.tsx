import { cn } from "@/lib/utils";

interface RAGBadgeProps {
  status: "red" | "amber" | "green";
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function RAGBadge({ status, label, size = "md" }: RAGBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-sm",
  };

  const statusClasses = {
    red: "bg-rag-red/15 text-rag-red border-rag-red/30",
    amber: "bg-rag-amber/15 text-rag-amber border-rag-amber/30",
    green: "bg-rag-green/15 text-rag-green border-rag-green/30",
  };

  const statusLabels = {
    red: "Critical",
    amber: "Warning",
    green: "Good",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        sizeClasses[size],
        statusClasses[status]
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          status === "red" && "bg-rag-red",
          status === "amber" && "bg-rag-amber",
          status === "green" && "bg-rag-green"
        )}
      />
      {label || statusLabels[status]}
    </span>
  );
}
