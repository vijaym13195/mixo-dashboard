import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Campaign, CampaignInsight } from '@/lib/types';
import { transformToBudgetComparison } from '../utils/dataTransformers';
import { formatCurrency, formatPercentage } from '../utils/chartFormatters';
import { BUDGET_COLORS } from '../utils/chartColors';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';

interface BudgetBarChartProps {
  campaigns: Array<Campaign & { insights?: CampaignInsight }>;
}

export function BudgetBarChart({ campaigns }: BudgetBarChartProps) {
  const isMobile = useMediaQuery('(max-width: 640px)');
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
    <ResponsiveContainer width="100%" height={isMobile ? 450 : 350}>
      <BarChart
        data={data}
        barCategoryGap={isMobile ? 10 : 25}
        layout="vertical"
        margin={isMobile ? { top: 5, right: 10, left: 0, bottom: 5 } : { top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          type="number"
          tickFormatter={formatCurrency}
          fontSize={isMobile ? 10 : 12}
        />
        <YAxis
          type="category"
          dataKey="name"
          tickFormatter={(value) => truncateName(value as string, isMobile ? 15 : 25)}
          fontSize={isMobile ? 9 : 11}
          width={isMobile ? 70 : 100}
        />
        <Tooltip
          cursor={false}
          content={(props) => {
            const { active, payload } = props;
            if (!active || !payload || !payload.length) return null;
            const payloadData = payload[0].payload as typeof data[0];
            return (
              <div className={`rounded-lg border bg-card shadow-md ${isMobile ? 'p-2' : 'p-3'}`}>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold`} title={payloadData.name}>
                  {truncateName(payloadData.name, isMobile ? 20 : 30)}
                </p>
                <div className={`${isMobile ? 'mt-1' : 'mt-2'} space-y-0.5`}>
                  <p className={`${isMobile ? 'text-[10px]' : 'text-sm'} text-muted-foreground`}>
                    Budget: {formatCurrency(payloadData.budget)}
                  </p>
                  <p className={`${isMobile ? 'text-[10px]' : 'text-sm'} text-muted-foreground`}>
                    Spend: {formatCurrency(payloadData.spend)}
                  </p>
                  <p className={`${isMobile ? 'text-[10px]' : 'text-sm'} font-medium ${payloadData.utilization > 100 ? 'text-destructive' : ''}`}>
                    Util: {formatPercentage(payloadData.utilization)}
                  </p>
                </div>
              </div>
            );
          }}
        />
        <Legend />
        <Bar dataKey="budget" fill={BUDGET_COLORS.budget} name="Budget" radius={[0, 0, 0, 8]} />
        <Bar dataKey="spend" fill={BUDGET_COLORS.spend} name="Spend" radius={[0, 0, 0, 8]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
