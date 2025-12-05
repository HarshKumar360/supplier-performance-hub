import { Bell, Search, User, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="h-[72px] border-b border-border/40 bg-background/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <button className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 border border-border/40 text-muted-foreground hover:bg-muted hover:text-foreground transition-all w-64">
          <Search className="w-4 h-4" />
          <span className="text-sm flex-1 text-left">Search...</span>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium bg-background rounded border border-border/60">
            <Command className="w-3 h-3" />K
          </kbd>
        </button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-muted/50">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rag-red rounded-full ring-2 ring-background" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted/50">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20">
                <User className="w-4 h-4 text-primary" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl">
            <DropdownMenuLabel>
              <div className="py-1">
                <p className="font-semibold">John Smith</p>
                <p className="text-xs text-muted-foreground font-normal">Global Admin</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="rounded-lg">Profile Settings</DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg">Switch Role</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive rounded-lg">Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
