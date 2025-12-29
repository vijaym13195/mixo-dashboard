import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { transformToFunnelData } from '../utils/dataTransformers';
import { AggregateInsights } from '@/lib/types';
import { formatCompactNumber, formatPercentage } from '../utils/chartFormatters';
import { FUNNEL_COLORS } from '../utils/chartColors';

interface FunnelChartProps {
  impressions: number;
  clicks: number;
  conversions: number;
}

export function FunnelChart({ impressions, clicks, conversions }: FunnelChartProps) {
  if (impressions === 0 && clicks === 0 && conversions === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        No conversion data available
      </div>
    );
  }

  const data = [
    { stage: 'Impressions', count: impressions, rate: 100 },
    { stage: 'Clicks', count: clicks, rate: impressions > 0 ? (clicks / impressions) * 100 : 0 },
    { stage: 'Conversions', count: conversions, rate: impressions > 0 ? (conversions / impressions) * 100 : 0 },
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} layout="vertical" barCategoryGap={40}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          type="number"
          tickFormatter={formatCompactNumber}
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <YAxis
          type="category"
          dataKey="stage"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          width={80}
        />
        <Tooltip
          cursor={false}
          content={(props) => {
            const { active, payload } = props;
            if (!active || !payload || !payload.length) return null;
            const data = payload[0].payload;
            return (
              <div className="rounded-lg border bg-card p-3 shadow-md">
                <p className="font-semibold">{data.stage}</p>
                <p className="text-sm text-muted-foreground">
                  Count: {formatCompactNumber(data.count)}
                </p>
                <p className="text-sm">
                  Rate: <span className="font-medium">{formatPercentage(data.rate)}</span>
                </p>
              </div>
            );
          }}
        />
        <Bar dataKey="count" radius={[0, 8, 8, 0]} name="Count">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={FUNNEL_COLORS[index % FUNNEL_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
