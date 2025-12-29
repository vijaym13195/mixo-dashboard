# Code Templates - Ready to Copy & Paste

Use these templates to jumpstart your implementation. Copy directly into your project!

---

## 1️⃣ API Client Template

**File:** `src/lib/api/client.ts`

```typescript
import { Campaign, CampaignInsight, AggregateInsights } from '@/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 
  'https://mixo-fe-backend-task.vercel.app';

class APIError extends Error {
  constructor(
    public status: number,
    public message: string,
    public retryAfter?: number
  ) {
    super(message);
    this.name = 'APIError';
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options?.headers,
      },
    });

    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get('retry-after') || '60');
      throw new APIError(429, 'Too many requests', retryAfter);
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new APIError(
        response.status,
        error.message || `API Error: ${response.statusText}`,
        error.retry_after
      );
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(500, 'Network error');
  }
}

export const apiClient = {
  campaigns: {
    getAll: () => request<{ campaigns: Campaign[]; total: number }>('/campaigns'),
    getById: (id: string) => request<{ campaign: Campaign }>(`/campaigns/${id}`),
  },

  insights: {
    getAggregate: () => 
      request<{ insights: AggregateInsights }>('/campaigns/insights'),
    getById: (id: string) => 
      request<{ insights: CampaignInsight }>(`/campaigns/${id}/insights`),
    stream: (id: string) => 
      `${API_BASE_URL}/campaigns/${id}/insights/stream`,
  },
};
```

---

## 2️⃣ React Query Hooks Template

**File:** `src/lib/hooks/useCampaigns.ts`

```typescript
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Campaign } from '@/lib/types';

interface CampaignsResponse {
  campaigns: Campaign[];
  total: number;
}

export function useCampaigns(): UseQueryResult<CampaignsResponse> {
  return useQuery({
    queryKey: ['campaigns'],
    queryFn: () => apiClient.campaigns.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useCampaign(id: string | null): UseQueryResult<{ campaign: Campaign }> {
  return useQuery({
    queryKey: ['campaign', id],
    queryFn: () => {
      if (!id) throw new Error('Campaign ID is required');
      return apiClient.campaigns.getById(id);
    },
    enabled: !!id, // Only run query if id exists
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
```

**File:** `src/lib/hooks/useInsights.ts`

```typescript
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { CampaignInsight, AggregateInsights } from '@/lib/types';

export function useInsights(): UseQueryResult<{ insights: AggregateInsights }> {
  return useQuery({
    queryKey: ['insights'],
    queryFn: () => apiClient.insights.getAggregate(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
}

export function useCampaignInsights(
  id: string | null
): UseQueryResult<{ insights: CampaignInsight }> {
  return useQuery({
    queryKey: ['campaign-insights', id],
    queryFn: () => {
      if (!id) throw new Error('Campaign ID is required');
      return apiClient.insights.getById(id);
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
  });
}
```

---

## 3️⃣ Zustand Stores Template

**File:** `src/lib/store/useDashboardStore.ts`

```typescript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface DashboardFilters {
  status: string[];
  platforms: string[];
}

export interface DashboardSort {
  field: 'name' | 'budget' | 'spend' | 'created_at' | 'status';
  order: 'asc' | 'desc';
}

export interface DashboardState {
  // State
  filters: DashboardFilters;
  sort: DashboardSort;
  searchQuery: string;
  viewMode: 'table' | 'grid';

  // Actions
  setStatusFilter: (status: string[]) => void;
  setPlatformFilter: (platforms: string[]) => void;
  setSort: (sort: DashboardSort) => void;
  setSearchQuery: (query: string) => void;
  setViewMode: (mode: 'table' | 'grid') => void;
  resetFilters: () => void;
}

const defaultState = {
  filters: { status: [], platforms: [] },
  sort: { field: 'created_at' as const, order: 'desc' as const },
  searchQuery: '',
  viewMode: 'table' as const,
};

export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set) => ({
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
    }),
    { name: 'DashboardStore' }
  )
);
```

**File:** `src/lib/store/useUIStore.ts`

```typescript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface UIState {
  // State
  sidebarOpen: boolean;
  autoRefresh: boolean;
  refreshInterval: number;

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setAutoRefresh: (enabled: boolean) => void;
  setRefreshInterval: (interval: number) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      sidebarOpen: true,
      autoRefresh: false,
      refreshInterval: 30000, // 30 seconds

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      setAutoRefresh: (enabled) => set({ autoRefresh: enabled }),

      setRefreshInterval: (interval) => set({ refreshInterval: interval }),
    }),
    { name: 'UIStore' }
  )
);
```

---

## 4️⃣ Types Template

**File:** `src/lib/types/index.ts`

```typescript
export interface Campaign {
  id: string;
  name: string;
  brand_id: string;
  status: 'active' | 'paused' | 'completed';
  budget: number;
  daily_budget: number;
  platforms: string[];
  created_at: string;
}

export interface CampaignInsight {
  campaign_id: string;
  timestamp: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr: number;
  cpc: number;
  conversion_rate: number;
}

export interface AggregateInsights {
  timestamp: string;
  total_campaigns: number;
  active_campaigns: number;
  paused_campaigns: number;
  completed_campaigns: number;
  total_impressions: number;
  total_clicks: number;
  total_conversions: number;
  total_spend: number;
  avg_ctr: number;
  avg_cpc: number;
  avg_conversion_rate: number;
}

export interface APIError {
  error: string;
  message: string;
  status: number;
  timestamp: string;
  path?: string;
}
```

---

## 5️⃣ Layout with Providers Template

**File:** `src/app/layout.tsx`

```typescript
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Mixo Dashboard',
  description: 'Campaign monitoring and analytics dashboard',
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storageKey="theme-preference"
          disableTransitionOnChange={false}
        >
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

## 6️⃣ Theme Toggle Component Template

**File:** `src/components/ui/ThemeToggle.tsx`

```typescript
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-gray-700" />
      )}
    </button>
  );
}
```

---

## 7️⃣ CampaignsList Component Template

**File:** `src/components/dashboard/CampaignsList.tsx`

```typescript
'use client';

import { useCampaigns } from '@/lib/hooks/useCampaigns';
import { useDashboardStore } from '@/lib/store/useDashboardStore';
import { useMemo } from 'react';
import { Campaign } from '@/lib/types';

export function CampaignsList() {
  // React Query - Server state
  const { data, isLoading, error } = useCampaigns();

  // Zustand - Client state
  const { filters, sort, searchQuery, viewMode } = useDashboardStore();

  // Filter and sort
  const filteredCampaigns = useMemo(() => {
    if (!data?.campaigns) return [];

    let result = [...data.campaigns];

    // Apply status filter
    if (filters.status.length > 0) {
      result = result.filter((c) => filters.status.includes(c.status));
    }

    // Apply platform filter
    if (filters.platforms.length > 0) {
      result = result.filter((c) =>
        c.platforms.some((p) => filters.platforms.includes(p))
      );
    }

    // Apply search
    if (searchQuery) {
      result = result.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sort
    result.sort((a, b) => {
      let aVal: any = a[sort.field];
      let bVal: any = b[sort.field];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (sort.order === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });

    return result;
  }, [data?.campaigns, filters, searchQuery, sort]);

  if (isLoading) return <div className="p-4">Loading campaigns...</div>;
  if (error) return <div className="p-4 text-red-600">Error loading campaigns</div>;

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        Showing {filteredCampaigns.length} of {data?.total || 0} campaigns
      </div>

      {viewMode === 'table' ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Budget</th>
                <th className="text-left p-2">Platforms</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{campaign.name}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-sm 
                      ${campaign.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                      ${campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${campaign.status === 'completed' ? 'bg-gray-100 text-gray-800' : ''}
                    `}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="p-2">${campaign.budget.toLocaleString()}</td>
                  <td className="p-2">{campaign.platforms.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCampaigns.map((campaign) => (
            <div key={campaign.id} className="p-4 border rounded-lg">
              <h3 className="font-bold">{campaign.name}</h3>
              <p className="text-sm text-gray-600">{campaign.id}</p>
              <p className="mt-2">Budget: ${campaign.budget.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 8️⃣ FilterControls Component Template

**File:** `src/components/dashboard/FilterControls.tsx`

```typescript
'use client';

import { useDashboardStore } from '@/lib/store/useDashboardStore';

const STATUSES = ['active', 'paused', 'completed'];
const PLATFORMS = ['meta', 'google', 'linkedin'];

export function FilterControls() {
  const {
    filters,
    setStatusFilter,
    setPlatformFilter,
    setSearchQuery,
    resetFilters,
  } = useDashboardStore();

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      {/* Search */}
      <div>
        <label className="block text-sm font-medium mb-2">Search</label>
        <input
          type="text"
          placeholder="Campaign name..."
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      {/* Status Filter */}
      <div>
        <label className="block text-sm font-medium mb-2">Status</label>
        <div className="space-y-2">
          {STATUSES.map((status) => (
            <label key={status} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.status.includes(status)}
                onChange={(e) => {
                  const newStatuses = e.target.checked
                    ? [...filters.status, status]
                    : filters.status.filter((s) => s !== status);
                  setStatusFilter(newStatuses);
                }}
                className="mr-2"
              />
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </label>
          ))}
        </div>
      </div>

      {/* Platform Filter */}
      <div>
        <label className="block text-sm font-medium mb-2">Platforms</label>
        <div className="space-y-2">
          {PLATFORMS.map((platform) => (
            <label key={platform} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.platforms.includes(platform)}
                onChange={(e) => {
                  const newPlatforms = e.target.checked
                    ? [...filters.platforms, platform]
                    : filters.platforms.filter((p) => p !== platform);
                  setPlatformFilter(newPlatforms);
                }}
                className="mr-2"
              />
              {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </label>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={resetFilters}
        className="w-full px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition"
      >
        Reset Filters
      </button>
    </div>
  );
}
```

---

## 9️⃣ Dashboard Page Template

**File:** `src/app/page.tsx`

```typescript
'use client';

import { CampaignsList } from '@/components/dashboard/CampaignsList';
import { FilterControls } from '@/components/dashboard/FilterControls';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { Header } from '@/components/layout/Header';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <StatsOverview />

        {/* Filters and List */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <FilterControls />
          </aside>

          <section className="lg:col-span-3">
            <CampaignsList />
          </section>
        </div>
      </main>
    </div>
  );
}
```

---

## 🔟 Environment Variables Template

**File:** `.env.local`

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://mixo-fe-backend-task.vercel.app

# Theme
NEXT_PUBLIC_DEFAULT_THEME=system

# Feature Flags
NEXT_PUBLIC_ENABLE_STREAMING=true
NEXT_PUBLIC_ENABLE_AUTO_REFRESH=true
```

---

## ✨ Next Steps

1. Copy these templates into your project
2. Install any missing dependencies if needed
3. Adjust paths based on your project structure
4. Test each component as you build
5. Refer back to IMPLEMENTATION_PLAN.md for detailed guidance

All templates follow best practices for:
- ✅ TypeScript type safety
- ✅ React Query patterns
- ✅ Zustand state management
- ✅ Next.js conventions
- ✅ Separation of concerns
