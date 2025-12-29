# State Management Guide

## 🎯 Quick Reference

### What Tool to Use When?

| Use Case | Tool | Why |
|----------|------|-----|
| Fetching campaigns from API | **React Query** | Server state management |
| Caching API responses | **React Query** | Built-in caching mechanism |
| Filtering/sorting campaigns | **Zustand** | Client-side state, fast updates |
| Toggling dark/light theme | **Next-themes** | Theme persistence to localStorage |
| UI state (sidebar open/close) | **Zustand** | Simple client state |
| Auto-refresh settings | **Zustand** | User preferences |

---

## 📦 Three Core Libraries

### 1. React Query (@tanstack/react-query)
**Purpose:** Manage server state (API data)

**When to use:**
- Fetching data from API
- Caching API responses
- Synchronizing with server
- Managing loading/error states for API calls

**Example:**
```typescript
const { data, isLoading, error } = useCampaigns();
// Returns: campaigns list from API with automatic caching
```

### 2. Zustand (zustand)
**Purpose:** Manage client state (UI & user preferences)

**When to use:**
- Storing filter preferences
- Managing sort order
- UI visibility (sidebar, modals)
- Search query
- Auto-refresh settings
- View mode (table/grid)

**Example:**
```typescript
const { filters, setStatusFilter } = useDashboardStore();
// Returns: instant state updates without API calls
```

### 3. Next-themes (next-themes)
**Purpose:** Manage theme persistence

**When to use:**
- Toggling light/dark theme
- Persisting theme preference to localStorage
- Reading system theme preference

**Example:**
```typescript
const { theme, setTheme } = useTheme();
// Automatically persists to localStorage
```

---

## 🏗️ Architecture Pattern

```
┌─────────────────────────────────────────┐
│        React Components                 │
├─────────────────────────────────────────┤
│                                         │
│  useQuery()        useDashboardStore()  │
│  (React Query)     (Zustand)            │
│      │                 │                │
│      ▼                 ▼                │
│   API Data          Filter/Sort/Search │
│   Insights          UI Preferences      │
│   Campaigns         Theme               │
│                                         │
└─────────────────────────────────────────┘
        │                │
        ▼                ▼
    API Server      localStorage
```

---

## 📋 Zustand Stores to Create

### 1. **Theme Store** (Optional - next-themes handles most)
```typescript
// lib/store/useThemeStore.ts
export const useThemeStore = create<ThemeState>()(
  persist((set) => ({
    theme: 'system',
    setTheme: (theme) => set({ theme }),
  }), { name: 'theme-store' })
);
```

### 2. **Dashboard Store** (Required - Filter, Sort, Search)
```typescript
// lib/store/useDashboardStore.ts
export const useDashboardStore = create<DashboardState>((set) => ({
  filters: { status: [], platforms: [] },
  sort: { field: 'created_at', order: 'desc' },
  searchQuery: '',
  viewMode: 'table',
  
  // All action methods
  setStatusFilter: (status) => set(/* ... */),
  setPlatformFilter: (platforms) => set(/* ... */),
  setSort: (sort) => set(/* ... */),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setViewMode: (mode) => set({ viewMode: mode }),
  resetFilters: () => set({ /* reset to defaults */ }),
}));
```

### 3. **UI Store** (Optional - Sidebar, Auto-refresh)
```typescript
// lib/store/useUIStore.ts
export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  autoRefresh: false,
  refreshInterval: 30000,
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setAutoRefresh: (enabled) => set({ autoRefresh: enabled }),
  setRefreshInterval: (interval) => set({ refreshInterval: interval }),
}));
```

---

## 💡 Common Patterns

### Pattern 1: Fetch Data + Apply Client-Side Filters
```typescript
export function CampaignsList() {
  // Get server state (API data)
  const { data } = useCampaigns();
  
  // Get client state (UI preferences)
  const { filters, searchQuery, sort } = useDashboardStore();

  // Filter and sort on client-side
  const filtered = useMemo(() => {
    let result = data?.campaigns || [];
    
    // Apply Zustand filters
    if (filters.status.length > 0) {
      result = result.filter(c => filters.status.includes(c.status));
    }
    
    // Apply Zustand search
    if (searchQuery) {
      result = result.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply Zustand sort
    result.sort((a, b) => {
      const aVal = a[sort.field];
      const bVal = b[sort.field];
      return sort.order === 'asc' ? 
        (aVal > bVal ? 1 : -1) : 
        (aVal < bVal ? 1 : -1);
    });
    
    return result;
  }, [data?.campaigns, filters, searchQuery, sort]);

  return <div>{/* render filtered */}</div>;
}
```

### Pattern 2: Update Filter from Component
```typescript
export function FilterButton({ status }: { status: string }) {
  const { filters, setStatusFilter } = useDashboardStore();

  const handleClick = () => {
    const isSelected = filters.status.includes(status);
    const newStatuses = isSelected
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    
    setStatusFilter(newStatuses); // Updates Zustand store
    // Component re-renders automatically with filtered data
  };

  return <button onClick={handleClick}>{status}</button>;
}
```

### Pattern 3: Manual Refresh with React Query
```typescript
export function RefreshButton() {
  const { refetch } = useCampaigns();
  
  // Zustand is for UI preferences, not this action
  return (
    <button onClick={() => refetch()}>
      Refresh
    </button>
  );
}
```

### Pattern 4: Theme Toggle
```typescript
export function ThemeToggle() {
  const { theme, setTheme } = useTheme(); // next-themes
  // No Zustand needed - next-themes handles persistence

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  );
}
```

---

## ❌ Common Mistakes to Avoid

### ❌ Don't use React Query for UI state
```typescript
// WRONG - React Query is for server state
const { data: filters } = useQuery({
  queryKey: ['filters'],
  queryFn: () => ({ status: ['active'] }),
});
```

### ❌ Don't use Zustand for API data
```typescript
// WRONG - Zustand doesn't have caching, refetch logic
const { campaigns } = useCampaignsStore(); // This makes no sense
```

### ❌ Don't manually manage theme in Zustand when next-themes exists
```typescript
// WRONG - next-themes already handles persistence
const { theme, setTheme } = useThemeStore();
```

### ✅ Do this instead
```typescript
// Use React Query for API data
const { data: campaigns } = useCampaigns();

// Use Zustand for UI filters
const { filters } = useDashboardStore();

// Use next-themes for theme
const { theme, setTheme } = useTheme();
```

---

## 🚀 Implementation Checklist

- [ ] Create `lib/api/client.ts` - API client setup
- [ ] Create `lib/hooks/useCampaigns.ts` - React Query hooks
- [ ] Create `lib/hooks/useInsights.ts` - React Query hooks
- [ ] Create `lib/store/useDashboardStore.ts` - Zustand for filters/sort
- [ ] Create `lib/store/useUIStore.ts` - Zustand for UI visibility
- [ ] Setup Next-themes in `app/layout.tsx`
- [ ] Setup React Query Provider in `app/layout.tsx`
- [ ] Create `components/ui/ThemeToggle.tsx` - Theme switcher
- [ ] Create `components/dashboard/FilterControls.tsx` - Uses Zustand
- [ ] Create `components/dashboard/CampaignsList.tsx` - Uses both

---

## 📚 Resources

- [React Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Next-themes Docs](https://github.com/pacocoursey/next-themes)

---

**Key Takeaway:** React Query = Server State, Zustand = Client State, Next-themes = Theme Persistence
