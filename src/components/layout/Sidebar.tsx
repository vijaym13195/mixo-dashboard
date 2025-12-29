"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUIStore } from "@/lib/store/useUIStore";
import {
    Megaphone,
    BarChart3,
    X,
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();
    const { sidebarOpen, setSidebarOpen } = useUIStore();

    const routes = [
        {
            label: "Campaigns",
            icon: Megaphone,
            href: "/",
            active: pathname === "/" || pathname.startsWith("/campaign/"),
        },
        {
            label: "Analytics",
            icon: BarChart3,
            href: "/analytics",
            active: pathname.startsWith("/analytics"),
        },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden",
                    sidebarOpen ? "block" : "hidden"
                )}
                onClick={() => setSidebarOpen(false)}
            />

            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-background dark:bg-card transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full",
                    className
                )}
            >
                <div className="flex h-14 items-center justify-between border-b px-4 lg:h-[60px]">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <span className="text-xl font-bold text-primary">Mixo</span>
                        <span className="">Dashboard</span>
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <ScrollArea className="flex-1 py-2">
                    <div className="space-y-1 px-2">
                        {routes.map((route) => (
                            <Button
                                key={route.href}
                                variant={route.active ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start gap-3",
                                    route.active && "bg-secondary font-medium"
                                )}
                                asChild
                            >
                                <Link href={route.href}>
                                    <route.icon className="h-4 w-4" />
                                    {route.label}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </ScrollArea>

                <div className="border-t p-4">
                    <div className="flex items-center gap-3 rounded-lg border p-3 bg-card text-card-foreground shadow-sm">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">JD</span>
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium truncate">John Doe</span>
                            <span className="text-xs text-muted-foreground truncate">Admin</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
