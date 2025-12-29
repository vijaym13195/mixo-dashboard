# Best Folder and File Structure Guide

## Project Overview
This guide documents the optimal folder and file structure used in the **Mixo Dashboard** - a modern Next.js 16 dashboard application built with TypeScript, React 19, Tailwind CSS, and Recharts for data visualization.

---

## 📁 Root Level Directory Structure

```
project-root/
├── public/                          # Static assets (images, fonts, etc.)
├── src/                            # Main source code directory
├── .git/                           # Git version control
├── .next/                          # Next.js build output (auto-generated)
├── node_modules/                   # Dependencies (auto-generated)
├── .gitignore                      # Git ignore rules
├── package.json                    # Project dependencies & scripts
├── package-lock.json               # Dependency lock file
├── tsconfig.json                   # TypeScript configuration
├── next.config.ts                  # Next.js configuration
├── postcss.config.mjs              # PostCSS configuration
├── components.json                 # UI library configuration
├── next-env.d.ts                   # Next.js auto-generated types
└── [Documentation files]           # README, guides, implementation plans
    ├── README.md
    ├── QUICK_START.md
    ├── CODE_TEMPLATES.md
    ├── STATE_MANAGEMENT_GUIDE.md
    ├── IMPLEMENTATION_PLAN.md
    └── UPDATE_SUMMARY.md
```

### Key Configuration Files:
- **tsconfig.json**: TypeScript compiler options and path aliases
- **next.config.ts**: Next.js framework configuration
- **components.json**: UI component library metadata (Shadcn UI config)
- **postcss.config.mjs**: CSS processing pipeline configuration
- **tailwind.config.ts**: Tailwind CSS customization

---

## 📂 Source Code Structure (`/src`)

### Main Structure:
```
src/
├── app/                            # Next.js App Router (pages & layouts)
├── components/                     # React components (organized by feature/domain)
└── lib/                           # Utilities, hooks, services, types, and stores
```

---

## 🎯 App Router Structure (`/src/app`)

```
src/app/
├── layout.tsx                      # Root layout (wraps entire app)
├── page.tsx                        # Root page (home route)
├── loading.tsx                     # Root loading state
├── error.tsx                       # Root error boundary
├── not-found.tsx                   # 404 page
├── providers.tsx                   # Context providers (Theme, Query, etc.)
├── globals.css                     # Global styles
└── (dashboard)/                    # Route group (shared layout)
    ├── layout.tsx                  # Dashboard layout
    ├── page.tsx                    # Dashboard home
    ├── loading.tsx                 # Dashboard loading state
    ├── analytics/                  # Feature: Analytics
    │   ├── page.tsx               # Analytics page
    │   └── loading.tsx            # Analytics loading
    ├── campaign/                   # Feature: Campaign
    │   ├── page.tsx               # Campaigns list page
    │   └── [id]/                  # Dynamic route (single campaign)
    │       ├── page.tsx           # Campaign detail page
    │       ├── loading.tsx        # Campaign detail loading
    │       └── error.tsx          # Campaign detail error
    └── settings/                   # Feature: Settings
        ├── page.tsx               # Settings page
        └── loading.tsx            # Settings loading
```

### Next.js App Router Best Practices:
- ✅ **Route Groups** `(dashboard)`: Group related routes with shared layouts without affecting URLs
- ✅ **Dynamic Routes** `[id]`: Use square brackets for dynamic segments
- ✅ **Parallel Loading**: Each route has its own `loading.tsx` for better UX
- ✅ **Error Boundaries**: Route-specific `error.tsx` for error handling
- ✅ **Shared Layouts**: DRY principle - shared layouts avoid repetition

---

## 🧩 Components Structure (`/src/components`)

Components are organized by **domain/feature** rather than by type (not "containers" and "presentational").

```
src/components/
│
├── ui/                             # Primitive UI components (reusable)
│   ├── alert.tsx
│   ├── badge.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── checkbox.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── input.tsx
│   ├── progress.tsx
│   ├── scroll-area.tsx
│   ├── select.tsx
│   ├── separator.tsx
│   ├── skeleton.tsx
│   ├── switch.tsx
│   ├── table.tsx
│   ├── tabs.tsx
│   ├── tooltip.tsx
│   └── sonner.tsx                 # Toast notifications
│
├── layout/                         # Layout components
│   ├── DashboardLayout.tsx        # Main dashboard wrapper
│   ├── Header.tsx                 # Top navigation
│   └── Sidebar.tsx                # Side navigation
│
├── dashboard/                      # Dashboard feature components
│   ├── MetricCard.tsx             # Single metric display
│   ├── StatsOverview.tsx          # Stats collection component
│   ├── EmptyState.tsx             # Empty state UI
│   ├── ErrorState.tsx             # Error state UI
│   └── LoadingState.tsx           # Loading state UI
│
├── campaigns/                      # Campaigns feature components
│   ├── CampaignsGrid.tsx          # Grid view of campaigns
│   ├── CampaignsList.tsx          # List view of campaigns
│   ├── CampaignCard.tsx           # Single campaign card
│   ├── CampaignFilters.tsx        # Filter controls
│   ├── CampaignSearch.tsx         # Search functionality
│   ├── CampaignSort.tsx           # Sort controls
│   ├── CampaignViewToggle.tsx     # Grid/List toggle
│   ├── StatusBadge.tsx            # Campaign status display
│   ├── PlatformBadge.tsx          # Platform type display
│   └── CampaignListSkeleton.tsx   # Loading skeleton
│
└── analytics/                      # Analytics feature components
    ├── ChartCard.tsx              # Wrapper for chart display
    ├── ChartSkeleton.tsx          # Chart loading skeleton
    ├── charts/                    # Specific chart implementations
    │   ├── BudgetBarChart.tsx
    │   ├── FunnelChart.tsx
    │   ├── PerformanceBarChart.tsx
    │   ├── PlatformPieChart.tsx
    │   └── StatusDonutChart.tsx
    └── utils/                     # Analytics-specific utilities
        ├── chartColors.ts         # Color schemes for charts
        ├── chartFormatters.ts     # Number/date formatting
        └── dataTransformers.ts    # Data transformation logic
```

### Component Organization Principles:
- 🎨 **UI Components** (`/ui`): Reusable, unstyled primitives from Radix UI + Tailwind
- 🔧 **Feature-Based**: Components grouped by domain (campaigns, analytics, dashboard)
- 📦 **Utils per Feature**: Each feature folder has its own `utils/` and `charts/` subfolders
- 🎭 **States as Components**: `EmptyState`, `LoadingState`, `ErrorState` as dedicated components
- 📊 **Chart Organization**: Charts isolated in dedicated folder with shared utilities

---

## 🛠️ Library Structure (`/src/lib`)

```
src/lib/
│
├── utils.ts                        # General utility functions
│
├── types/
│   └── index.ts                   # Shared TypeScript interfaces & types
│
├── api/
│   └── client.ts                  # API client instance (fetch/axios)
│
├── hooks/                         # Custom React hooks
│   ├── queryKeys.ts               # React Query key factory
│   ├── useAllCampaignInsights.ts # Hook for fetching all campaigns
│   ├── useCampaigns.ts            # Hook for campaign queries
│   ├── useInsights.ts             # Hook for insights data
│   ├── useDebounce.ts             # Debounce utility hook
│   └── useStream.ts               # Streaming data hook
│
├── store/                         # State management (Zustand)
│   ├── useDashboardStore.ts       # Dashboard state
│   ├── useThemeStore.ts           # Theme/dark mode state
│   └── useUIStore.ts              # UI state (modals, filters, etc.)
│
└── utils/                         # Utility functions organized by purpose
    └── (place domain-specific utils here)
```

### Library Best Practices:
- **Types**: Centralized in `types/index.ts` for reusability
- **API**: Single client instance in `api/client.ts`
- **Hooks**: One hook per file, descriptive naming with `use` prefix
- **Query Keys**: Centralized in `queryKeys.ts` for React Query
- **State Management**: Each store handles a specific domain (theme, dashboard, UI)

---

## 🎨 Key Design Patterns

### 1. **Component Composition**
```typescript
// ✅ Good: Composition over inheritance
<DashboardLayout>
  <Header />
  <div className="flex">
    <Sidebar />
    <main>
      <StatsOverview />
      <CampaignsGrid />
    </main>
  </div>
</DashboardLayout>
```

### 2. **Feature-Based File Organization**
- Each feature has its own folder: `campaigns/`, `analytics/`, `dashboard/`
- Related components, utilities, and types stay together
- Reduces cognitive load and improves maintainability

### 3. **Loading & Error States**
- Dedicated components: `LoadingState.tsx`, `ErrorState.tsx`, `EmptyState.tsx`
- Consistent UX across the app
- Reusable across features

### 4. **State Management Strategy**
```
Zustand Stores (Global UI State)
├── useDashboardStore: Dashboard-specific state
├── useThemeStore: Theme/dark mode
└── useUIStore: UI state (modals, filters)

React Query (Server State)
├── useAllCampaignInsights: Campaign insights
├── useCampaigns: Campaign data
└── useInsights: Analytics insights
```

### 5. **Utility Hierarchy**
```
/lib/utils/           # General utilities
  └── General helpers

/components/*/utils/  # Feature-specific utilities
  └── Domain-specific transformers & formatters
```

---

## 📋 File Naming Conventions

### Component Files
- **PascalCase** for component files: `CampaignCard.tsx`, `StatsOverview.tsx`
- **One component per file** (with rare exceptions for small related components)
- **Descriptive names** that indicate purpose

### Utility Files
- **camelCase** for utility files: `chartColors.ts`, `dataTransformers.ts`
- **Specific purpose** in filename: `chartFormatters.ts`, `queryKeys.ts`

### Special Files
- **index.ts**: Only used for type exports (`types/index.ts`)
- **layout.tsx**, **page.tsx**, **loading.tsx**: Next.js conventions
- **[id].tsx**: Dynamic routes in Next.js

---

## 🔄 Import Path Strategy

### Path Aliases (configured in `tsconfig.json`)
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Import Examples
```typescript
// ✅ Good: Using @ alias
import { useCampaigns } from '@/lib/hooks'
import { CampaignCard } from '@/components/campaigns'
import type { Campaign } from '@/lib/types'

// ❌ Avoid: Relative imports
import { useCampaigns } from '../../../../lib/hooks'
```

---

## 📦 Technology Stack Overview

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16 | React framework with SSR/SSG |
| **Language** | TypeScript | Type-safe JavaScript |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **UI Components** | Radix UI + Shadcn | Accessible, unstyled components |
| **State (UI)** | Zustand | Lightweight state management |
| **State (Server)** | React Query | Server state management |
| **Forms** | React Hook Form + Zod | Form handling & validation |
| **Charts** | Recharts | React chart library |
| **Animations** | Framer Motion | React animation library |
| **Icons** | Lucide React | Icon library |
| **Notifications** | Sonner | Toast notifications |
| **Theme** | Next-themes | Dark mode support |

---

## 🚀 Best Practices Summary

### Do's ✅
1. **Organize by feature/domain**, not by type
2. **Keep related files together** (components, utils, types)
3. **Use PascalCase for components**, camelCase for utilities
4. **Centralize types** in `lib/types/`
5. **Create custom hooks** for data fetching logic
6. **Use path aliases** `@/` for imports
7. **Leverage Next.js conventions** (layout, page, loading, error)
8. **Separate UI and business logic**
9. **Create dedicated state/loading/error components**
10. **Document complex components** with JSDoc comments

### Don'ts ❌
1. **Don't mix concerns** - keep UI, logic, and types separate
2. **Don't use index files** for components (except types)
3. **Don't nest too deeply** - keep 2-3 levels max
4. **Don't create "utils" folders** with unrelated functions
5. **Don't import from parent app directories** in components
6. **Don't forget loading states** - every async operation needs it
7. **Don't put all utilities in one file** - organize by domain
8. **Don't ignore TypeScript** - use strict types

---

## 📊 Dependency Hierarchy

```
App (page.tsx)
  ↓
Layouts (layout.tsx)
  ↓
Feature Components (CampaignsList, Analytics, etc.)
  ↓
UI Components (Button, Card, Input, etc.)
  ↓
Custom Hooks (useCampaigns, useDebounce, etc.)
  ↓
State (Zustand stores, React Query)
  ↓
Utilities & Types
```

### Important Rules:
- ✅ Child components can import from parent domains
- ❌ Parent components should NOT import from child domains
- ✅ All components can import from `lib/` (utilities, hooks, types)
- ❌ Circular imports are forbidden

---

## 🔍 Quick Reference: Where to Put Things

| What | Where | Example |
|------|-------|---------|
| **New Page** | `src/app/(dashboard)/[feature]/page.tsx` | `campaign/page.tsx` |
| **New Component** | `src/components/[feature]/` | `campaigns/CampaignCard.tsx` |
| **New Hook** | `src/lib/hooks/use[Feature].ts` | `useCampaigns.ts` |
| **New Type** | `src/lib/types/index.ts` | Add to central file |
| **Utility Function** | `src/lib/utils/` or `src/components/[feature]/utils/` | Domain-specific utils |
| **Global State** | `src/lib/store/use[Domain]Store.ts` | `useDashboardStore.ts` |
| **API Endpoint** | `src/lib/api/` | `client.ts` |
| **Static Assets** | `public/` | Images, fonts, etc. |
| **UI Primitive** | `src/components/ui/` | Shadcn/Radix components |
| **Loading State** | `src/app/[route]/loading.tsx` | Route-specific |
| **Error Handler** | `src/app/[route]/error.tsx` | Route-specific |

---

## 📝 Example: Adding a New Feature

### Step 1: Create Feature Route
```
src/app/(dashboard)/reports/
├── page.tsx          # Main page
├── loading.tsx       # Loading state
└── error.tsx         # Error boundary
```

### Step 2: Create Feature Components
```
src/components/reports/
├── ReportsList.tsx           # Main component
├── ReportCard.tsx            # Subcomponent
├── ReportFilters.tsx         # Filter component
├── utils/
│   ├── reportFormatters.ts   # Formatting logic
│   └── reportTransformers.ts # Data transformation
└── charts/
    ├── ReportBarChart.tsx
    └── ReportTrendChart.tsx
```

### Step 3: Create Custom Hooks
```
src/lib/hooks/
├── useReports.ts             # Fetch reports
└── useReportFilters.ts       # Filter state
```

### Step 4: Add Types
```
src/lib/types/index.ts
// Add Report interface
```

### Step 5: Create Store (if needed)
```
src/lib/store/useReportsStore.ts
```

---

## 🎯 Conclusion

This structure provides:
- **Scalability**: Easy to add new features without affecting existing code
- **Maintainability**: Clear organization makes code easy to find and modify
- **Reusability**: Shared components and utilities reduce duplication
- **Type Safety**: Centralized types prevent errors
- **Performance**: Feature-based code splitting and lazy loading
- **DX**: Clear conventions improve developer experience

Follow these principles, and your codebase will remain clean, organized, and easy to navigate as it grows! 🚀
