import { AlertTriangle, AlertCircle, Info, X } from "lucide-react";
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
    description: "SLA compliance dropped below 80% for 2 consecutive months. Immediate action required.",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    type: "critical",
    title: "EV Charger Outage - London Heathrow",
    description: "3 EV chargers offline for >12 hours. Revenue impact estimated at £4,500/day.",
    timestamp: "4 hours ago",
  },
  {
    id: "3",
    type: "warning",
    title: "Safety Incident - Vinci Civils",
    description: "Minor safety incident reported at Munich Autobahn site. RCA pending.",
    timestamp: "6 hours ago",
  },
  {
    id: "4",
    type: "warning",
    title: "Cost Overrun Alert - SPIE NL",
    description: "Month-to-date costs 18% over budget for engineering services.",
    timestamp: "1 day ago",
  },
  {
    id: "5",
    type: "info",
    title: "Contract Renewal Due",
    description: "Mitie UK contract expires in 90 days. Begin renewal discussions.",
    timestamp: "2 days ago",
  },
];

export function AlertsPanel() {
  const [alerts, setAlerts] = useState(initialAlerts);

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const getIcon = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return <AlertCircle className="w-5 h-5 text-rag-red" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-rag-amber" />;
      case "info":
        return <Info className="w-5 h-5 text-chart-3" />;
    }
  };

  const getBorderColor = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return "border-l-rag-red";
      case "warning":
        return "border-l-rag-amber";
      case "info":
        return "border-l-chart-3";
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border/50">
      <div className="p-5 border-b border-border/50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Active Alerts</h3>
          <span className="text-sm text-muted-foreground">{alerts.length} alerts</span>
        </div>
      </div>

      <div className="divide-y divide-border/50 max-h-[400px] overflow-y-auto scrollbar-thin">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={cn(
              "p-4 border-l-4 hover:bg-muted/30 transition-colors animate-fade-in",
              getBorderColor(alert.type)
            )}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">{getIcon(alert.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-medium text-sm text-foreground truncate">
                    {alert.title}
                  </h4>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="flex-shrink-0 p-1 hover:bg-muted rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                <span className="text-xs text-muted-foreground/70 mt-2 block">
                  {alert.timestamp}
                </span>
              </div>
            </div>
          </div>
        ))}

        {alerts.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No active alerts</p>
          </div>
        )}
      </div>
    </div>
  );
}
