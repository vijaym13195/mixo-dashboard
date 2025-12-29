/**
 * Formatters for chart tooltips, labels, and axis values
 */

/**
 * Format number as USD currency
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format number in compact notation (1.2K, 1.5M, etc.)
 */
export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Format number with commas
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Format as percentage
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Custom tooltip formatter for pie charts
 * Shows value and percentage
 */
export function pieTooltipFormatter(value: number, name: string): string {
  return `${name}: ${value}`;
}

/**
 * Custom tooltip formatter for bar charts with currency
 */
export function barTooltipCurrencyFormatter(value: number, name: string): string {
  if (name === 'budget' || name === 'spend') {
    return formatCurrency(value);
  }
  return formatNumber(value);
}

/**
 * Custom tooltip formatter for bar charts with compact numbers
 */
export function barTooltipCompactFormatter(value: number, name: string): string {
  return formatCompactNumber(value);
}

/**
 * Label renderer for pie chart segments
 * Shows percentage inside the chart
 */
export function renderPieLabel(entry: any, data: any[]): string {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const percentage = ((entry.value / total) * 100).toFixed(1);
  return percentage === '0.0' ? '' : `${percentage}%`;
}
