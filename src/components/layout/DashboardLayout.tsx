"use client";

import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useUIStore } from "@/lib/store/useUIStore";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    // We don't strictly need to read state here if Sidebar handles its own visibility via CSS 
    // but if we want to push content over on desktop when sidebar is open vs closed (if we had a collapsible sidebar), we would.
    // For now, based on Sidebar implementation:
    // Desktop: Sidebar is static, w-64.
    // Mobile: Sidebar is fixed, translates centrally.
    // So the main content needs a left margin only on desktop.

    // Actually, usually we have a flex container.

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    <div className="mx-auto max-w-7xl space-y-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
