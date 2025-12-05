import { AlertTriangle, AlertCircle, Info, X, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  description: string;
  timestamp: string;
}

const initialAlerts: Alert[] = [
  {
    id: "1",
    type: "critical",
    title: "SLA Breach Risk - ISS Germany",
    description: "SLA compliance dropped below 80% for 2 consecutive months.",
    timestamp: "2h ago",
  },
  {
    id: "2",
    type: "critical",
    title: "EV Charger Outage",
    description: "3 chargers offline at London Heathrow. £4,500/day impact.",
    timestamp: "4h ago",
  },
  {
    id: "3",
    type: "warning",
    title: "Safety Incident - Vinci",
    description: "Minor incident at Munich site. RCA pending.",
    timestamp: "6h ago",
  },
  {
    id: "4",
    type: "warning",
    title: "Cost Overrun - SPIE NL",
    description: "18% over budget for engineering services.",
    timestamp: "1d ago",
  },
];

export function AlertsPanel() {
  const [alerts, setAlerts] = useState(initialAlerts);

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const criticalCount = alerts.filter((a) => a.type === "critical").length;

  return (
    <div className="space-y-2">
      {/* Critical alert badge */}
      {criticalCount > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-rag-red/10 border border-rag-red/20">
          <Bell className="w-4 h-4 text-rag-red" />
          <span className="text-sm font-medium text-rag-red">
            {criticalCount} critical alert{criticalCount > 1 ? "s" : ""} require attention
          </span>
        </div>
      )}

      {/* Alert list */}
      <div className="space-y-2 max-h-[320px] overflow-y-auto scrollbar-thin pr-1">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={cn(
              "relative p-3.5 rounded-xl border transition-all duration-200 hover:shadow-sm group",
              alert.type === "critical" && "bg-rag-red/5 border-rag-red/20",
              alert.type === "warning" && "bg-rag-amber/5 border-rag-amber/20",
              alert.type === "info" && "bg-chart-3/5 border-chart-3/20"
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                  alert.type === "critical" && "bg-rag-red/10",
                  alert.type === "warning" && "bg-rag-amber/10",
                  alert.type === "info" && "bg-chart-3/10"
                )}
              >
                {alert.type === "critical" && <AlertCircle className="w-4 h-4 text-rag-red" />}
                {alert.type === "warning" && <AlertTriangle className="w-4 h-4 text-rag-amber" />}
                {alert.type === "info" && <Info className="w-4 h-4 text-chart-3" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-medium text-sm text-foreground leading-tight">
                    {alert.title}
                  </h4>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="flex-shrink-0 p-1 -mr-1 -mt-1 opacity-0 group-hover:opacity-100 hover:bg-muted rounded transition-all"
                  >
                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {alert.description}
                </p>
                <span className="text-[10px] text-muted-foreground/60 mt-1.5 block uppercase tracking-wide">
                  {alert.timestamp}
                </span>
              </div>
            </div>
          </div>
        ))}

        {alerts.length === 0 && (
          <div className="p-8 text-center text-muted-foreground rounded-xl bg-card border border-border/40">
            <Info className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">All clear — no active alerts</p>
          </div>
        )}
      </div>
    </div>
  );
}
