# Mixo Dashboard

A modern, high-performance marketing analytics dashboard built with Next.js 15, React 19, and Tailwind CSS. This application provides real-time insights into campaign performance, budget utilization, and conversion metrics.

## Features

- **Analytics Command Center**: Visualize key metrics with interactive charts including Funnels, Donut charts, and Performance bars using Recharts.
- **Campaign Management**: comprehensive list and grid views with advanced filtering, sorting, and searching capabilities.
- **Real-time Insights**: Live data streaming options for active campaigns.
- **Modern UI/UX**: 
  - Fully responsive design for all devices.
  - Dark/Light mode support with persistent theming.
  - Smooth page transitions and micro-interactions using Framer Motion.
- **Data Visualization**: Rich data representation for Spend, CPC, CTR, and Conversions.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), & [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [Tailwind Animate](https://github.com/jamiebuilds/tailwindcss-animate)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) & [Tanstack Query](https://tanstack.com/query/latest)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Validation**: [Zod](https://zod.dev/)
- **Utils**: [date-fns](https://date-fns.org/)

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd mixo-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/                  # Next.js App Router pages and layouts
│   ├── (dashboard)/      # Dashboard routes (Analytics, Campaigns, Settings)
│   └── ...
├── components/           # Reusable UI components
│   ├── analytics/        # Chart components and analytic widgets
│   ├── campaigns/        # Campaign list, cards, and filters
│   ├── dashboard/        # shared dashboard widgets
│   └── ui/               # Base UI primitives (Radix UI wrappers)
├── lib/                  # Utilities, hooks, and types
│   ├── hooks/            # Custom React hooks (useCampaigns, useInsights)
│   └── ...
└── ...
```

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/primitives/docs/overview/introduction)
