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
} from "lucide-react";

export function Header() {
    const { setTheme, theme } = useTheme();
    const { toggleSidebar } = useUIStore();
    const queryClient = useQueryClient();

    const handleRefresh = () => {
        queryClient.invalidateQueries();
    };

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
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRefresh}
                    title="Refresh Data"
                >
                    <RefreshCw className="h-4 w-4" />
                    <span className="sr-only">Refresh</span>
                </Button>

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
