"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/lib/store/useUIStore";
import { useQueryClient } from "@tanstack/react-query";
import {
    Moon,
    Sun,
    Menu,
    RefreshCw,
    Bell,
    Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

export function Header() {
    const { setTheme, theme } = useTheme();
    const { toggleSidebar, autoRefresh, setAutoRefresh, refreshInterval } = useUIStore();
    const queryClient = useQueryClient();
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const refreshData = (showToast = false) => {
        queryClient.invalidateQueries();
        setLastUpdated(new Date());
        if (showToast) {
            toast.success("Dashboard refreshed", {
                description: "Latest data has been fetched.",
            });
        }
    };

    useEffect(() => {
        if (!autoRefresh) return;
        const interval = setInterval(() => refreshData(false), refreshInterval);
        return () => clearInterval(interval);
    }, [autoRefresh, refreshInterval, queryClient]);

    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:h-[60px] lg:px-6">
            <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={toggleSidebar}
            >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Sidebar</span>
            </Button>

            <div className="flex flex-1 items-center justify-end gap-2">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground hidden sm:inline-block">
                        Updated {format(lastUpdated, "h:mm a")}
                    </span>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={autoRefresh ? "text-primary" : ""}
                                title="Data Settings"
                            >
                                <RefreshCw className={`h-4 w-4 ${autoRefresh ? "animate-spin-slow" : ""}`} />
                                <span className="sr-only">Refresh</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => refreshData(true)}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Refresh Now
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem
                                checked={autoRefresh}
                                onCheckedChange={setAutoRefresh}
                            >
                                Auto Refresh (30s)
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <Button variant="ghost" size="icon">
                    <Bell className="h-4 w-4" />
                    <span className="sr-only">Notifications</span>
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </div>
        </header>
    );
}
