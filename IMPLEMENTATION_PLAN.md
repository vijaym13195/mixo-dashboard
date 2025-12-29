# Mixo Dashboard - Campaign Monitoring Implementation Plan

## 📋 Project Overview

**Objective:** Build a functional campaign monitoring dashboard for the Mixo Ads Campaign API that displays advertising campaign performance metrics across multiple platforms.

**API Base URL:** `https://mixo-fe-backend-task.vercel.app/`

**Tech Stack:**
- **Framework:** Next.js 16.1.1 with React 19
- **Language:** TypeScript
- **State Management:** React Query + Zustand
- **UI Components:** Radix UI + TailwindCSS
- **Data Fetching:** React Query (TanStack Query v5)
- **Theme Management:** Next-themes
- **Notifications:** Sonner
- **Icons:** Lucide React

---

## 🎯 Available API Endpoints

### 1. **Get All Campaigns**
```
GET /campaigns
```
- Retrieves list of all advertising campaigns
- Returns: Array of campaigns with basic info (id, name, status, budget, platforms, etc.)
- Rate Limited: 10 requests/minute

### 2. **Get Single Campaign**
```
GET /campaigns/{id}
```
- Retrieves detailed info for a specific campaign
- Parameters: `id` (campaign ID, e.g., camp_001)

### 3. **Get Aggregate Insights**
```
GET /campaigns/insights
```
- Aggregate metrics across all campaigns
- Returns: Total campaigns, active/paused/completed counts, total impressions, clicks, conversions, spend, CTR, CPC, conversion rate

### 4. **Get Campaign-Specific Insights**
```
GET /campaigns/{id}/insights
```
- Performance metrics for specific campaign
- Returns: impressions, clicks, conversions, spend, CTR, CPC, conversion_rate

### 5. **Stream Real-time Metrics (SSE)**
```
GET /campaigns/{id}/insights/stream
```
- Server-Sent Events stream for real-time metrics
- Content-Type: `text/event-stream`
- Useful for live monitoring dashboard

---

## 📊 Data Models

### Campaign Object
```typescript
interface Campaign {
  id: string;
  name: string;
  brand_id: string;
  status: 'active' | 'paused' | 'completed';
  budget: number;
  daily_budget: number;
  platforms: string[]; // e.g., ['meta', 'google', 'linkedin']
  created_at: string; // ISO timestamp
}

interface CampaignWithInsights extends Campaign {
  insights: CampaignInsight;
}

interface CampaignInsight {
  campaign_id: string;
  timestamp: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr: number; // Click-through rate
  cpc: number; // Cost per click
  conversion_rate: number;
}

interface AggregateInsights {
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
```

---

## 🏗️ Project Structure

```
src/
├── app/
│   ├── layout.tsx                 # Root layout with providers
│   ├── page.tsx                   # Dashboard main page
│   └── campaign/
│       └── [id]/
│           └── page.tsx           # Campaign detail page
│
├── components/
│   ├── ui/                        # Pre-built Radix UI components
│   ├── dashboard/
│   │   ├── CampaignsList.tsx     # Main campaigns list component
│   │   ├── CampaignCard.tsx      # Individual campaign card
│   │   ├── CampaignDetail.tsx    # Detailed campaign view
│   │   ├── StatsOverview.tsx     # Aggregate stats section
│   │   ├── InsightsChart.tsx     # Chart components for metrics
│   │   ├── MetricsGrid.tsx       # Key metrics display
│   │   ├── StatusBadge.tsx       # Status indicator
│   │   ├── PlatformBadge.tsx     # Platform display
│   │   ├── LoadingState.tsx      # Skeleton loaders
│   │   └── EmptyState.tsx        # Empty state UI
│   │
│   └── layout/
│       ├── Header.tsx             # Top navigation bar
│       ├── Sidebar.tsx            # Navigation sidebar
│       └── Footer.tsx             # Footer
│
├── lib/
│   ├── api/
│   │   └── client.ts              # API client setup
│   ├── hooks/
│   │   ├── useCampaigns.ts        # Campaign queries
│   │   ├── useInsights.ts         # Insights queries
│   │   └── useStream.ts           # SSE streaming hook
│   ├── types/
│   │   └── index.ts               # TypeScript types
│   ├── utils.ts                   # Utility functions
│   └── constants.ts               # App constants
│
└── styles/
    └── globals.css                # Global styles
```

---

## 🏛️ Architecture Overview

### Clear Separation of Concerns

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Application                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────┐      ┌──────────────────────┐    │
│  │   React Components   │      │   Next-themes        │    │
│  │  (UI & Rendering)    │◄────►│  (Theme Persistence) │    │
│  └──────────────────────┘      └──────────────────────┘    │
│         ▲          ▲                                        │
│         │          │                                        │
│    ┌────┴──────┐   └──────────┬──────────────┐            │
│    │           │              │              │            │
│    ▼           ▼              ▼              ▼            │
│ ┌────────┐  ┌────────────┐  ┌────────┐  ┌────────┐       │
│ │ Zustand│  │React Query │  │ Zustand│  │Zustand │       │
│ │ Theme  │  │   (APIs)   │  │Dashboard│ │UI State│       │
│ │ Store  │  │            │  │ Store  │  │ Store  │       │
│ └────────┘  └────────────┘  └────────┘  └────────┘       │
│                    │                                       │
│                    ▼                                       │
│        ┌─────────────────────┐                            │
│        │   Mixo API Server   │                            │
│        │ https://mixo-fe...  │                            │
│        └─────────────────────┘                            │
│                    │                                       │
│        ┌───────────┴────────────┬─────────────┐           │
│        ▼                        ▼             ▼           │
│    Campaigns                Insights      SSE Stream     │
│    Endpoints                Endpoints     Endpoints      │
└─────────────────────────────────────────────────────────────┘
```

### State Management Pattern

| Layer | Tool | Responsibility | Examples |
|-------|------|-----------------|----------|
| **Server State** | React Query | API data, caching, synchronization | Campaigns, metrics, insights |
| **Theme State** | Zustand + next-themes | Theme persistence and switching | Light/dark mode |
| **UI State** | Zustand | Client-side UI state management | Filters, sorting, sidebar, refresh |

### Data Flow

```
User Interaction
    │
    ├─► Filter/Sort/Search
    │      │
    │      └─► Zustand Store (UI State)
    │           │
    │           ▼
    │       Update Component Props
    │
    ├─► Fetch Data
    │      │
    │      └─► React Query Hook
    │           │
    │           ├─► Check Cache
    │           ├─► Fetch from API
    │           └─► Store in Cache
    │
    └─► Toggle Theme
           │
           └─► Next-themes + Zustand
                │
                └─► Persist to localStorage
                    & Update DOM class
```

---

## 📝 Task Breakdown

### Phase 1: Setup & Infrastructure (Day 1)
- [x] **Task 1.1:** Set up React Query Provider in layout (API state)
- [x] **Task 1.2:** Set up Next-themes Provider in layout (theme persistence)
- [x] **Task 1.3:** Create Zustand stores for client state:
  - Theme store
  - Dashboard UI state store (filters, sorting, search)
  - UI state store (sidebar, refresh controls)
- [x] **Task 1.4:** Create API client with base configuration
- [x] **Task 1.5:** Define TypeScript types/interfaces for API responses
- [x] **Task 1.6:** Create API error handling & interceptors
- [x] **Task 1.7:** Set up environment variables

### Phase 2: API Integration with React Query (Day 1-2)
- [x] **Task 2.1:** Create custom hooks for campaigns listing
  - `useCampaigns()` - Get all campaigns with caching
  - `useCampaign(id)` - Get single campaign details
  - `useInsights()` - Get aggregate insights
  - `useCampaignInsights(id)` - Get campaign-specific insights
  - `useCampaignStream(id)` - Handle SSE streaming
  
- [x] **Task 2.2:** Configure React Query:
  - Set cache times (staleTime, cacheTime)
  - Configure retry logic
  - Setup error handling
  - Enable/disable refetching

- [x] **Task 2.3:** Implement error boundaries & error states

### Phase 3: UI Components - Core (Day 2-3)
- [x] **Task 3.1:** Create layout structure
  - Header with title/branding
  - Sidebar/Navigation
  - Main content area
  
- [x] **Task 3.2:** Create reusable UI components
  - StatusBadge (active/paused/completed)
  - PlatformBadge (meta/google/linkedin)
  - MetricCard (single metric display)
  - LoadingState/Skeleton components
  
- [x] **Task 3.3:** Create StatsOverview component
  - Display aggregate metrics
  - Total campaigns, active, paused, completed
  - Total spend, impressions, clicks, conversions
  - Key metrics: CTR, CPC, conversion rate

### Phase 4: UI Components - Campaigns List (Day 3)
- [x] **Task 4.1:** Create CampaignsList component
  - Use `useDashboardStore` for filter/sort/search state
  - Use `useCampaigns()` hook for API data
  - Table/Grid view toggle using `setViewMode` action
  - Sorting using `setSort` action
  - Filtering using `setStatusFilter` and `setPlatformFilter` actions
  - Search functionality using `setSearchQuery` action
  - Pagination

- [x] **Task 4.2:** Create CampaignCard component
  - Display campaign info from API data
  - Show platforms
  - Display budget info
  - Status indicator
  - Link to detail page

- [x] **Task 4.3:** Add row actions
  - View details link
  - Hover effects

### Phase 5: Campaign Detail Page (Day 4)
- [x] **Task 5.1:** Create campaign detail layout
  - Campaign info header
  - Breadcrumbs navigation
  - Back button

- [x] **Task 5.2:** Display campaign insights
  - Key metrics grid
  - Performance indicators
  - Budget vs spend comparison

- [x] **Task 5.3:** Add real-time streaming (optional)
  - Connect to SSE stream endpoint
  - Update metrics in real-time
  - Show last updated timestamp

### Phase 6: Dashboard Features (Day 4-5)
- [ ] **Task 6.1:** Implement filtering (using Zustand store)
  - By status (active/paused/completed)
  - By platform (meta/google/linkedin)
  - Update `useDashboardStore` filter state
  - Apply filters to React Query results client-side

- [ ] **Task 6.2:** Implement sorting (using Zustand store)
  - By name
  - By budget
  - By spend
  - By status
  - By created date
  - Update `useDashboardStore` sort state

- [ ] **Task 6.3:** Add search functionality (using Zustand store)
  - Search by campaign name
  - Real-time filtering with debounce
  - Update `setSearchQuery` in store

- [ ] **Task 6.4:** Implement refresh controls (using Zustand store)
  - Manual refresh button (invalidate React Query)
  - Auto-refresh toggle using `useUIStore`
  - Last updated indicator

### Phase 7: Error Handling & Loading States (Day 5)
- [ ] **Task 7.1:** Implement error states
  - API error messages
  - Retry mechanisms
  - Fallback UI

- [ ] **Task 7.2:** Implement loading states
  - Skeleton loaders
  - Spinner for list
  - Progressive loading

- [ ] **Task 7.3:** Add empty states
  - No campaigns message
  - No results for filters

### Phase 8: Responsive Design & Polish (Day 5-6)
- [ ] **Task 8.1:** Mobile responsiveness
  - Mobile menu
  - Stack layout on small screens
  - Touch-friendly interactions

- [ ] **Task 8.2:** Implement dark mode with next-themes
  - Theme toggle component in header
  - Persist theme preference (localStorage)
  - System theme detection
  - Smooth theme transitions

- [ ] **Task 8.3:** Add notifications
  - Success notifications
  - Error alerts
  - Info messages

### Phase 9: Testing & Optimization (Day 6)
- [ ] **Task 9.1:** Performance optimization
  - React Query cache optimization
  - Image optimization
  - Code splitting

- [ ] **Task 9.2:** Test data handling
  - Test with sample data
  - Test error scenarios
  - Test edge cases

### Phase 10: Deployment (Day 6-7)
- [ ] **Task 10.1:** Build & test production build
  - Run `npm run build`
  - Test in production mode

- [ ] **Task 10.2:** Deploy to Vercel
  - Connect GitHub repo
  - Configure environment variables
  - Deploy

- [ ] **Task 10.3:** Setup monitoring & logging
  - Error tracking
  - Performance monitoring

---

## 🎨 UI Design Details

### Color Scheme
- **Primary:** Blue (for CTAs and highlights)
- **Success:** Green (for active status)
- **Warning:** Orange/Amber (for paused)
- **Danger:** Red (for errors)
- **Neutral:** Gray (for text and borders)

### Typography
- **Display/Headings:** Bold 24-28px
- **Section Titles:** Medium 18-20px
- **Body Text:** Regular 14-16px
- **Small Text:** Regular 12-13px

### Layout
- **Container:** Max-width 1440px, centered
- **Spacing:** 8px base unit (8, 16, 24, 32, 48px)
- **Border Radius:** 8px standard
- **Shadows:** Subtle elevation shadows

### Components

#### 1. **Header**
```
┌─────────────────────────────────────────┐
│ 🔷 Mixo Dashboard    [Refresh] [⚙️]    │
└─────────────────────────────────────────┘
```
- Left: Logo + Title
- Right: Refresh button, Settings icon

#### 2. **Dashboard Stats Overview**
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Total        │ Active       │ Paused       │ Completed    │
│ Campaigns    │ Campaigns    │ Campaigns    │ Campaigns    │
│              │              │              │              │
│     14       │      8       │      4       │      2       │
└──────────────┴──────────────┴──────────────┴──────────────┘

┌──────────────┬──────────────┬──────────────┐
│ Total Spend  │ Total        │ Avg          │
│              │ Impressions  │ Conversion   │
│ $28,500.50   │ 350,000      │ 5%           │
└──────────────┴──────────────┴──────────────┘
```

#### 3. **Campaigns List (Table View)**
```
┌─────────┬──────────────────────┬──────────────┬──────────┬───────────┐
│ Name    │ Platform             │ Budget       │ Status   │ Actions   │
├─────────┼──────────────────────┼──────────────┼──────────┼───────────┤
│ Summer  │ 🟦 Meta              │ $10,000      │ Active   │ → Details │
│ Sale    │                      │              │          │           │
├─────────┼──────────────────────┼──────────────┼──────────┼───────────┤
│ Black   │ 🔍 Google Search     │ $25,000      │ Active   │ → Details │
│ Friday  │                      │              │          │           │
└─────────┴──────────────────────┴──────────────┴──────────┴───────────┘
```

#### 4. **Campaign Card (Grid View)**
```
┌────────────────────────────────┐
│ Summer Sale - Meta             │
│ camp_001                       │
├────────────────────────────────┤
│ Status: 🟢 Active              │
│ Budget: $10,000                │
│ Daily: $500                    │
│ Platform: Meta                 │
│ Created: Nov 1, 2025           │
├────────────────────────────────┤
│        [View Details →]        │
└────────────────────────────────┘
```

#### 5. **Campaign Detail Page**
```
┌──────────────────────────────────────┐
│ ← Back | Summer Sale - Meta          │
├──────────────────────────────────────┤
│ Campaign Info:                       │
│ • Brand: brand_001                   │
│ • Status: Active                     │
│ • Total Budget: $10,000              │
│ • Daily Budget: $500                 │
│ • Created: Nov 1, 2025               │
│ • Platforms: Meta                    │
├──────────────────────────────────────┤
│ Performance Metrics:                 │
│ ┌──────────┬──────────┬──────────┐   │
│ │Impr:     │Clicks:   │Conv:     │   │
│ │34,046    │936       │91        │   │
│ └──────────┴──────────┴──────────┘   │
│ ┌──────────┬──────────┬──────────┐   │
│ │Spend:    │CTR:      │CPC:      │   │
│ │$4,290    │2.75%     │$4.58     │   │
│ └──────────┴──────────┴──────────┘   │
│ ┌──────────────────────────────────┐ │
│ │ Conv Rate: 9.72%                 │ │
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

---

## 🏗️ State Management Architecture

**Key Principle:** Clear separation between server state and client state

- **React Query:** Manages server state (API data, campaigns, insights)
- **Zustand:** Manages client state (theme, UI state, filters, sorting preferences)
- **Next-themes:** Integrates with Zustand for theme persistence

---

## 🔌 React Query Implementation Strategy (API Data Only)

### 1. **Setup in Layout**
```typescript
// app/layout.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes
      cacheTime: 10 * 60 * 1000,     // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### 2. **API Client Setup**
```typescript
// lib/api/client.ts
const API_BASE_URL = 'https://mixo-fe-backend-task.vercel.app';

export const apiClient = {
  async get(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { 'Accept': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  },
};
```

### 3. **Custom Hooks**
```typescript
// lib/hooks/useCampaigns.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';

export function useCampaigns() {
  return useQuery({
    queryKey: ['campaigns'],
    queryFn: () => apiClient.get('/campaigns'),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: ['campaign', id],
    queryFn: () => apiClient.get(`/campaigns/${id}`),
    enabled: !!id,
  });
}

// lib/hooks/useInsights.ts
export function useInsights() {
  return useQuery({
    queryKey: ['insights'],
    queryFn: () => apiClient.get('/campaigns/insights'),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCampaignInsights(id: string) {
  return useQuery({
    queryKey: ['campaign-insights', id],
    queryFn: () => apiClient.get(`/campaigns/${id}/insights`),
    enabled: !!id,
  });
}

// lib/hooks/useStream.ts
export function useCampaignStream(id: string) {
  const [data, setData] = useState<CampaignInsight | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!id) return;

    const eventSource = new EventSource(`/campaigns/${id}/insights/stream`);
    
    eventSource.onmessage = (event) => {
      try {
        setData(JSON.parse(event.data));
      } catch (err) {
        setError(err as Error);
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      eventSource.close();
    };

    setIsConnected(true);

    return () => eventSource.close();
  }, [id]);

  return { data, error, isConnected };
}
```

### 4. **Query Key Structure**
```typescript
// Consistent query keys for easy invalidation
export const campaignKeys = {
  all: ['campaigns'] as const,
  lists: () => [...campaignKeys.all, 'list'] as const,
  list: (filters: string) => [...campaignKeys.lists(), { filters }] as const,
  details: () => [...campaignKeys.all, 'detail'] as const,
  detail: (id: string) => [...campaignKeys.details(), id] as const,
};

export const insightKeys = {
  all: ['insights'] as const,
  aggregate: () => [...insightKeys.all, 'aggregate'] as const,
  campaign: (id: string) => [...insightKeys.all, 'campaign', id] as const,
};
```

### 5. **Error Handling**
```typescript
// Implement error boundary for failed queries
function handleQueryError(error: Error) {
  if (error.message.includes('429')) {
    return 'Too many requests. Please try again in a moment.';
  }
  if (error.message.includes('504')) {
    return 'Server timeout. The service is temporarily unavailable.';
  }
  return 'Failed to load data. Please try again.';
}
```

---

## 🎨 Zustand Implementation Strategy (Client State Only)

### Purpose: Manage UI state, theme, and user preferences

### 1. **Theme Store**
```typescript
// lib/store/useThemeStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-store', // localStorage key
    }
  )
);
```

### 2. **Dashboard UI State Store**
```typescript
// lib/store/useDashboardStore.ts
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
```

### 3. **UI State Store (Modals, Sidebars, etc.)**
```typescript
// lib/store/useUIStore.ts
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
```

### 4. **Next-themes Integration**
```typescript
// app/layout.tsx
'use client';

import { ThemeProvider } from 'next-themes';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

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

### 5. **Theme Toggle Component**
```typescript
// components/ui/ThemeToggle.tsx
'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from './button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-10 h-10"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
```

### 6. **Using Theme in Components**
```typescript
// components/dashboard/Header.tsx
'use client';

import { useTheme } from 'next-themes';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function Header() {
  const { theme } = useTheme();

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Mixo Dashboard
        </h1>
        <ThemeToggle />
      </div>
    </header>
  );
}
```

---

## 📊 State Management Summary

| Tool | Purpose | Example |
|------|---------|---------|
| **React Query** | Server state (APIs) | Campaigns, insights, metrics data |
| **Zustand** | Client state | Filters, sorting, search, UI visibility |
| **Next-themes** | Theme persistence | Light/dark mode with localStorage |

**Best Practice:** Keep React Query focused on server state and use Zustand exclusively for client-side UI state management.

---

## 💡 Component Implementation Examples

### Example 1: CampaignsList Component (Uses Both)
```typescript
// components/dashboard/CampaignsList.tsx
'use client';

import { useCampaigns } from '@/lib/hooks/useCampaigns';
import { useDashboardStore } from '@/lib/store/useDashboardStore';
import { useMemo } from 'react';

export function CampaignsList() {
  // React Query - Server State (API data)
  const { data, isLoading, error } = useCampaigns();
  
  // Zustand - Client State (UI filters, sorting, search)
  const { filters, sort, searchQuery } = useDashboardStore();

  // Client-side filtering and sorting
  const filteredCampaigns = useMemo(() => {
    if (!data?.campaigns) return [];
    
    let result = [...data.campaigns];
    
    // Apply filters from Zustand store
    if (filters.status.length > 0) {
      result = result.filter(c => filters.status.includes(c.status));
    }
    
    if (filters.platforms.length > 0) {
      result = result.filter(c =>
        c.platforms.some(p => filters.platforms.includes(p))
      );
    }
    
    // Apply search from Zustand store
    if (searchQuery) {
      result = result.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting from Zustand store
    result.sort((a, b) => {
      let aVal = a[sort.field];
      let bVal = b[sort.field];
      
      if (sort.order === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });
    
    return result;
  }, [data?.campaigns, filters, searchQuery, sort]);

  if (isLoading) return <div>Loading campaigns...</div>;
  if (error) return <div>Error loading campaigns</div>;

  return (
    <div>
      {/* Render campaigns using filtered data */}
      {filteredCampaigns.map(campaign => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}
```

### Example 2: Campaign Detail with Insights (Uses Both)
```typescript
// app/campaign/[id]/page.tsx
'use client';

import { useCampaign } from '@/lib/hooks/useCampaigns';
import { useCampaignInsights } from '@/lib/hooks/useInsights';
import { useUIStore } from '@/lib/store/useUIStore';

export default function CampaignDetail({ params }: { params: { id: string } }) {
  // React Query - Server State
  const campaign = useCampaign(params.id);
  const insights = useCampaignInsights(params.id);
  
  // Zustand - Client State (auto-refresh settings)
  const { autoRefresh, refreshInterval } = useUIStore();

  // Set up auto-refresh if enabled
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      campaign.refetch();
      insights.refetch();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  if (campaign.isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{campaign.data?.campaign?.name}</h1>
      {/* Display campaign data and insights */}
    </div>
  );
}
```

### Example 3: Filter Controls (Uses Zustand Only)
```typescript
// components/dashboard/FilterControls.tsx
'use client';

import { useDashboardStore } from '@/lib/store/useDashboardStore';

export function FilterControls() {
  const {
    filters,
    setStatusFilter,
    setPlatformFilter,
    setSearchQuery,
    resetFilters,
  } = useDashboardStore();

  return (
    <div className="space-y-4">
      {/* Search */}
      <input
        type="text"
        placeholder="Search campaigns..."
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Status Filter */}
      <div>
        <label>Status:</label>
        <input
          type="checkbox"
          value="active"
          onChange={(e) => {
            const newStatuses = e.target.checked
              ? [...filters.status, 'active']
              : filters.status.filter(s => s !== 'active');
            setStatusFilter(newStatuses);
          }}
        />
      </div>

      {/* Platform Filter */}
      <div>
        <label>Platforms:</label>
        {/* Similar checkbox logic */}
      </div>

      <button onClick={resetFilters}>Reset Filters</button>
    </div>
  );
}
```

---

## 📦 Required Dependencies (Already Installed)

✅ **Already in package.json:**
- `@tanstack/react-query` - Data fetching & caching
- `zod` - Schema validation
- `zustand` - Light state management (if needed)
- `sonner` - Toast notifications
- `lucide-react` - Icons
- `@radix-ui/*` - UI components
- `tailwindcss` - Styling

**Optional additions:**
- `recharts` - Charts/graphs for metrics visualization
- `date-fns` - Date formatting utilities
- `react-hot-toast` - Alternative notifications

---

## 🚀 Implementation Order

1. **Setup Phase:** API client + React Query provider
2. **Data Layer:** Create all custom hooks
3. **Components:** Bottom-up (atomic → composite)
4. **Pages:** Dashboard → Campaign detail
5. **Features:** Filtering, sorting, search
6. **Polish:** Error states, loading states, responsive design
7. **Testing:** Manual testing + production build
8. **Deployment:** Vercel deployment

---

## 🎯 Key Features Checklist

### MVP (Must Have)
- [x] Fetch and display all campaigns
- [x] Display campaign details page
- [x] Show aggregate insights/stats
- [x] Display campaign-specific metrics
- [x] Error handling for API failures
- [x] Loading states during data fetching
- [x] Responsive design (mobile + desktop)

### Enhancement (Nice to Have)
- [ ] Filtering by status and platform
- [ ] Sorting by various columns
- [ ] Search functionality
- [ ] Real-time metrics streaming
- [ ] Charts/graphs for visual analytics
- [ ] Dark mode support
- [ ] Pagination for large lists
- [ ] Export data to CSV/PDF

### Advanced (Polish)
- [ ] Infinite scroll pagination
- [ ] Advanced analytics dashboard
- [ ] Campaign creation/editing
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Analytics tracking

---

## ⚠️ Important Considerations

### Rate Limiting
- **Limit:** 10 requests per minute
- **Strategy:** Use React Query caching aggressively
- **Retry:** Implement exponential backoff for 429 errors
- **Headers:** Include proper error handling for retry-after

### Error Scenarios
- **504 Gateway Timeout:** Show user-friendly message, offer retry
- **404 Not Found:** Validate campaign ID before fetching
- **429 Rate Limited:** Implement backoff strategy
- **500 Server Error:** Show error message with retry option

### Performance Optimization
- Cache campaign data for 5 minutes
- Don't refetch on window focus (user experience)
- Lazy load campaign details
- Use skeleton loaders instead of spinners
- Implement pagination for large lists

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Support for EventSource API (SSE)
- No IE11 support needed

---

## 📱 Responsive Breakpoints

- **Mobile:** < 640px - Single column, stacked layout
- **Tablet:** 640px - 1024px - Two column layout
- **Desktop:** > 1024px - Multi-column, full layout

---

## 🔐 Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=https://mixo-fe-backend-task.vercel.app
```

---

## 📊 Metrics to Display

### Campaign-Level Metrics
- Impressions (reach)
- Clicks (engagement)
- Conversions (target completion)
- Spend (cost)
- CTR (Click-Through Rate = Clicks/Impressions)
- CPC (Cost-Per-Click = Spend/Clicks)
- Conversion Rate (Conversions/Clicks)

### Platform Coverage
- Meta (Facebook/Instagram)
- Google (Search/YouTube)
- LinkedIn
- Other

---

## 🧪 Testing Checklist

- [ ] Test campaigns list loads correctly
- [ ] Test campaign detail page displays correct data
- [ ] Test filtering works (status, platform)
- [ ] Test sorting works for all columns
- [ ] Test search functionality
- [ ] Test error handling (retry, messages)
- [ ] Test loading states are visible
- [ ] Test mobile responsiveness
- [ ] Test dark mode (if implemented)
- [ ] Test production build

---

## 📈 Performance Targets

- **First Contentful Paint:** < 2s
- **Time to Interactive:** < 3s
- **Lighthouse Score:** > 80

---

## 🎓 Learning Resources

- [React Query Docs](https://tanstack.com/query/latest)
- [Next.js 16 Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## 📞 Contact & Questions

**API Issues:** Contact Hari (hari@mixoads.com)

---

**Status:** Ready for implementation  
**Last Updated:** December 29, 2025  
**Estimated Timeline:** 6-7 days for MVP, 10+ days for full feature set
