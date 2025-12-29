import { create } from 'zustand';

interface UIState {
    sidebarOpen: boolean;
    autoRefresh: boolean;
    refreshInterval: number;

    // Actions
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    setAutoRefresh: (enabled: boolean) => void;
    setRefreshInterval: (interval: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
    sidebarOpen: true,
    autoRefresh: false,
    refreshInterval: 30000, // 30 seconds

    toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

    setSidebarOpen: (open) => set({ sidebarOpen: open }),

    setAutoRefresh: (enabled) => set({ autoRefresh: enabled }),

    setRefreshInterval: (interval) => set({ refreshInterval: interval }),
}));
