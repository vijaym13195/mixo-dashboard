import { create } from 'zustand';

interface DashboardFilters {
    status: string[];
    platforms: string[];
}

interface DashboardSort {
    field: 'name' | 'budget' | 'spend' | 'created_at' | 'status';
    order: 'asc' | 'desc';
}

interface DashboardState {
    filters: DashboardFilters;
    sort: DashboardSort;
    searchQuery: string;
    viewMode: 'table' | 'grid';

    // Filter actions
    setStatusFilter: (status: string[]) => void;
    setPlatformFilter: (platforms: string[]) => void;

    // Sort actions
    setSort: (sort: DashboardSort) => void;

    // Search actions
    setSearchQuery: (query: string) => void;

    // View actions
    setViewMode: (mode: 'table' | 'grid') => void;

    // Reset actions
    resetFilters: () => void;
}

const defaultState = {
    filters: { status: [], platforms: [] },
    sort: { field: 'created_at' as const, order: 'desc' as const },
    searchQuery: '',
    viewMode: 'table' as const,
};

export const useDashboardStore = create<DashboardState>((set) => ({
    ...defaultState,

    setStatusFilter: (status) =>
        set((state) => ({
            filters: { ...state.filters, status },
        })),

    setPlatformFilter: (platforms) =>
        set((state) => ({
            filters: { ...state.filters, platforms },
        })),

    setSort: (sort) => set({ sort }),

    setSearchQuery: (query) => set({ searchQuery: query }),

    setViewMode: (mode) => set({ viewMode: mode }),

    resetFilters: () => set(defaultState),
}));
