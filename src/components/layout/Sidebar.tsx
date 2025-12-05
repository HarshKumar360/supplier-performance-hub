import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  MapPin,
  TrendingUp,
  FileText,
  Settings,
  Bot,
  Zap,
  ChevronLeft,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Suppliers", href: "/suppliers", icon: Building2 },
  { name: "Sites", href: "/sites", icon: MapPin },
  { name: "Predictions", href: "/predictive", icon: TrendingUp },
  { name: "Scorecards", href: "/scorecards", icon: FileText },
  { name: "AI Assistant", href: "/ai-assistant", icon: Bot },
];

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 flex flex-col",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex h-[72px] items-center border-b border-sidebar-border",
        collapsed ? "justify-center px-3" : "justify-between px-5"
      )}>
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-sidebar-foreground text-lg tracking-tight">BP Pulse</span>
              <p className="text-[10px] text-sidebar-foreground/50 uppercase tracking-wider">Dashboard</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex-1 overflow-y-auto scrollbar-thin",
        collapsed ? "p-2" : "p-4"
      )}>
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sidebar-foreground/60 hover:text-sidebar-foreground transition-all duration-200",
                  isActive && "bg-sidebar-accent text-sidebar-foreground font-medium shadow-sm",
                  !isActive && "hover:bg-sidebar-accent/50",
                  collapsed && "justify-center px-0"
                )}
                title={collapsed ? item.name : undefined}
              >
                <div className={cn(
                  "flex items-center justify-center",
                  collapsed ? "w-10 h-10 rounded-xl" : "w-8 h-8 rounded-lg",
                  isActive ? "bg-primary/20" : "bg-transparent"
                )}>
                  <item.icon className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-[18px] h-[18px]")} />
                </div>
                {!collapsed && <span className="text-sm">{item.name}</span>}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className={cn(
        "border-t border-sidebar-border",
        collapsed ? "p-2" : "p-4"
      )}>
        <NavLink
          to="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all",
            collapsed && "justify-center px-0"
          )}
          title={collapsed ? "Settings" : undefined}
        >
          <div className={cn(
            "flex items-center justify-center",
            collapsed ? "w-10 h-10 rounded-xl" : "w-8 h-8 rounded-lg"
          )}>
            <Settings className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-[18px] h-[18px]")} />
          </div>
          {!collapsed && <span className="text-sm">Settings</span>}
        </NavLink>
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sidebar-foreground/40 hover:text-sidebar-foreground/60 transition-all w-full mt-1",
            collapsed && "justify-center px-0"
          )}
        >
          <div className={cn(
            "flex items-center justify-center",
            collapsed ? "w-10 h-10 rounded-xl" : "w-8 h-8 rounded-lg"
          )}>
            {collapsed ? (
              <PanelLeft className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-[18px] h-[18px]")} />
            ) : (
              <PanelLeftClose className="w-[18px] h-[18px] flex-shrink-0" />
            )}
          </div>
          {!collapsed && <span className="text-xs">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
