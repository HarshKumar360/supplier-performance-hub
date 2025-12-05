import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-[260px] transition-all duration-300">
        <Header title={title} subtitle={subtitle} />
        <main className="p-8 max-w-[1800px]">{children}</main>
      </div>
    </div>
  );
}
