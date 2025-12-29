import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Campaign, CampaignInsight } from '@/lib/types';
import { transformToBudgetComparison } from '../utils/dataTransformers';
import { formatCurrency, formatPercentage } from '../utils/chartFormatters';
import { CHART_COLORS } from '../utils/chartColors';

interface BudgetBarChartProps {
  campaigns: Array<Campaign & { insights?: CampaignInsight }>;
}

export function BudgetBarChart({ campaigns }: BudgetBarChartProps) {
  const data = transformToBudgetComparison(campaigns, 8);

  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        No budget data available
      </div>
    );
  }

  // Truncate long names for display
  const truncateName = (name: string, maxLength: number = 20) => {
    return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} barCategoryGap={8} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          type="number"
          tickFormatter={formatCurrency}
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <YAxis
          type="category"
          dataKey="name"
          tickFormatter={(value) => truncateName(value as string, 25)}
          stroke="hsl(var(--muted-foreground))"
          fontSize={11}
          width={100}
        />
        <Tooltip
          content={(props) => {
            const { active, payload } = props;
            if (!active || !payload || !payload.length) return null;
            const payloadData = payload[0].payload as typeof data[0];
            return (
              <div className="rounded-lg border bg-card p-3 shadow-md">
                <p className="font-semibold" title={payloadData.name}>{truncateName(payloadData.name, 30)}</p>
                <p className="text-sm text-muted-foreground">
                  Budget: {formatCurrency(payloadData.budget)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Spend: {formatCurrency(payloadData.spend)}
                </p>
                <p className={`text-sm font-medium ${payloadData.utilization > 100 ? 'text-destructive' : ''}`}>
                  Utilization: {formatPercentage(payloadData.utilization)}
                </p>
              </div>
            );
          }}
        />
        <Legend />
        <Bar dataKey="budget" fill={CHART_COLORS[2]} name="Budget" radius={[0, 0, 0, 8]} />
        <Bar dataKey="spend" fill={CHART_COLORS[0]} name="Spend" radius={[0, 0, 0, 8]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
