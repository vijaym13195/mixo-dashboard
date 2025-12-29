/**
 * Chart color mappings
 * Using direct HSL values that work in both light and dark modes
 * These vibrant colors ensure charts are visible in any theme
 */

// Main chart colors - 7 distinct vibrant colors for all themes
export const CHART_COLORS = [
  'hsl(25, 95%, 53%)',    // Orange/Coral
  'hsl(210, 80%, 52%)',   // Blue
  'hsl(142, 76%, 36%)',   // Green
  'hsl(280, 65%, 55%)',   // Purple/Pink
  'hsl(45, 93%, 47%)',    // Gold
  'hsl(265, 75%, 55%)',   // Violet
  'hsl(180, 65%, 55%)',   // Cyan
];

// Platform-specific colors
export const PLATFORM_COLORS: Record<string, string> = {
  meta: 'hsl(25, 95%, 53%)',      // Orange/Coral
  google: 'hsl(210, 80%, 52%)',   // Blue
  linkedin: 'hsl(142, 76%, 36%)', // Green
  tiktok: 'hsl(280, 65%, 55%)',   // Purple/Pink
  twitter: 'hsl(45, 93%, 47%)',   // Gold
  other: 'hsl(265, 75%, 55%)',    // Violet
};

// Status colors for campaign states
export const STATUS_COLORS: Record<string, string> = {
  active: 'hsl(142, 76%, 36%)',   // Green
  paused: 'hsl(25, 95%, 53%)',    // Orange
  completed: 'hsl(220, 15%, 45%)', // Gray
};

// Gradient colors for funnel charts
export const FUNNEL_COLORS = [
  'hsl(25, 95%, 53%)',    // Widest stage - Orange
  'hsl(210, 80%, 52%)',   // Middle - Blue
  'hsl(142, 76%, 36%)',   // Narrowest - Green
];

// Default color fallback
export const DEFAULT_COLOR = 'hsl(25, 95%, 53%)';

// Additional color mappings for different chart types
export const BUDGET_COLORS = {
  budget: 'hsl(45, 93%, 47%)',  // Gold for budget
  spend: 'hsl(25, 95%, 53%)',   // Orange for spend
};

export const PERFORMANCE_COLORS = [
  'hsl(210, 80%, 52%)',   // Primary metric
  'hsl(142, 76%, 36%)',
  'hsl(280, 65%, 55%)',
  'hsl(45, 93%, 47%)',
  'hsl(265, 75%, 55%)',
  'hsl(180, 65%, 55%)',
];

