# 🚀 Mixo Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

Mixo Dashboard is a state-of-the-art marketing analytics platform designed for high-performance data visualization and campaign management. Built with the latest tech stack including Next.js 16, React 19, and Tailwind CSS 4, it offers a seamless, premium experience for marketing professionals.

---

## ✨ Key Features

### 📊 Advanced Analytics
*   **Performance Command Center**: Interactive dashboards with real-time data visualization.
*   **Rich Charts**: Utilize Funnel, Donut, Area, and Radar charts powered by Recharts.
*   **Metric Tracking**: Monitor Spend, CPC, CTR, and Conversion rates with precision.

### 🎯 Campaign Management
*   **Dynamic Views**: Toggle between high-density lists and visual grid views.
*   **Smart Filtering**: Advanced search, sort, and filter capabilities to find specific data instantly.
*   **Detail-Oriented**: Deep dive into individual campaign metrics and performance history.

### 🎨 Premium UI/UX
*   **Glassmorphism Design**: Modern, clean, and aesthetic interface inspired by premium SaaS platforms.
*   **Motion & Flow**: Smooth animations and staggered entrance effects using Framer Motion.
*   **Adaptive Theming**: Native Dark/Light mode support with theme persistence.
*   **Responsive Engine**: Optimized for everything from mobile devices to ultra-wide monitors.

---

## 🛠 Tech Stack

### Frontend Core
*   **Framework**: [Next.js 16.1.1](https://nextjs.org/) (App Router & Server Components)
*   **UI Library**: [React 19.2.3](https://react.dev/)
*   **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/) with [Radix UI](https://www.radix-ui.com/) primitives.
*   **Icons**: [Lucide React](https://lucide.dev/)

### State & Data
*   **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) for lightweight global state.
*   **Data Fetching**: [Tanstack Query v5](https://tanstack.com/query/latest) for caching and synchronization.
*   **Validation**: [Zod](https://zod.dev/) for robust schema validation.

### Visualization & Motion
*   **Charts**: [Recharts](https://recharts.org/) for responsive SVG charts.
*   **Animations**: [Framer Motion](https://www.framer.com/motion/) for fluid UI interactions.

---

## 🏗 Project Architecture

```bash
mixo-dashboard/
├── src/
│   ├── app/                # Next.js App Router (Layouts & Pages)
│   │   ├── (dashboard)/    # Main application shell and routes
│   │   │   ├── analytics/  # Analytics dashboard pages
│   │   │   ├── campaign/   # Campaign-specific views
│   │   │   └── settings/   # User and app settings
│   ├── components/         # Atomic & Feature components
│   │   ├── analytics/      # Specialized chart widgets
│   │   ├── campaigns/      # Management UI (List/Grid/Forms)
│   │   ├── layout/         # Navigation, Sidebar, and Header
│   │   └── ui/             # shadcn/ui inspired primitives
│   ├── lib/                # Core Business Logic
│   │   ├── api/            # API clients and fetchers
│   │   ├── store/          # Zustand global stores
│   │   ├── hooks/          # Custom business hooks
│   │   └── schemas/        # Zod validation schemas
│   └── ...
└── ...
```

---

## 🚦 Getting Started

### Prerequisites
*   Node.js 18.x or higher
*   npm, yarn, pnpm, or bun

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/vijaym13195/mixo-dashboard.git
    cd mixo-dashboard
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env.local` file in the root directory and add the following variable:
    ```bash
    NEXT_PUBLIC_API_URL=https://mixo-fe-backend-task.vercel.app
    ```
    Alternatively, you can copy the example file:
    ```bash
    cp .env.example .env.local
    ```

4.  **Launch Development Server**
    ```bash
    npm run dev
    ```

Navigate to `http://localhost:3000` to start exploring!

---

## 📜 Available Scripts

-   `npm run dev`: Starts the development server with hot-reloading.
-   `npm run build`: Compiles the application for production deployment.
-   `npm run start`: Runs the built production application.
-   `npm run type-check`: Validates TypeScript types across the project.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

<p align="center">Built with ❤️ for Marketing Analytics.</p>
