/**
 * Chart color mappings using CSS variables
 * Maps to the existing --chart-1 through --chart-5 variables in globals.css
 */

// Main chart colors from CSS variables
export const CHART_COLORS = [
  'hsl(var(--chart-1))',  // Orange/Gold - oklch(0.646 0.222 41.116)
  'hsl(var(--chart-2))',  // Teal/Cyan - oklch(0.6 0.118 184.704)
  'hsl(var(--chart-3))',  // Deep Blue - oklch(0.398 0.07 227.392)
  'hsl(var(--chart-4))',  // Lime Green - oklch(0.828 0.189 84.429)
  'hsl(var(--chart-5))',  // Yellow-Green - oklch(0.769 0.188 70.08)
];

// Platform-specific colors (consistent with existing PlatformBadge component)
export const PLATFORM_COLORS: Record<string, string> = {
  meta: 'hsl(var(--chart-1))',
  google: 'hsl(var(--chart-2))',
  linkedin: 'hsl(var(--chart-3))',
  other: 'hsl(var(--chart-4))',
};

// Status colors (consistent with existing StatusBadge component)
export const STATUS_COLORS: Record<string, string> = {
  active: 'hsl(142.1 76.2% 36.3%)',    // Green
  paused: 'hsl(32.1 95.6% 44.2%)',     // Orange
  completed: 'hsl(240 4.8% 46.1%)',   // Gray
};

// Gradient colors for funnel charts
export const FUNNEL_COLORS = [
  'hsl(var(--chart-1))',  // Widest stage
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',  // Narrowest stage
];

// Default color fallback
export const DEFAULT_COLOR = 'hsl(var(--chart-1))';
