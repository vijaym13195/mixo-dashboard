import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { transformToFunnelData } from '../utils/dataTransformers';
import { AggregateInsights } from '@/lib/types';
import { formatCompactNumber, formatPercentage } from '../utils/chartFormatters';
import { FUNNEL_COLORS } from '../utils/chartColors';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';

interface FunnelChartProps {
  impressions: number;
  clicks: number;
  conversions: number;
}

export function FunnelChart({ impressions, clicks, conversions }: FunnelChartProps) {
  const isMobile = useMediaQuery('(max-width: 640px)');

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
    <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
      <BarChart
        data={data}
        layout="vertical"
        barCategoryGap={isMobile ? 20 : 40}
        margin={isMobile ? { top: 5, right: 10, left: 0, bottom: 5 } : { top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          type="number"
          tickFormatter={formatCompactNumber}
          fontSize={isMobile ? 10 : 12}
        />
        <YAxis
          type="category"
          dataKey="stage"
          fontSize={isMobile ? 10 : 12}
          width={isMobile ? 70 : 80}
        />
        <Tooltip
          cursor={false}
          content={(props) => {
            const { active, payload } = props;
            if (!active || !payload || !payload.length) return null;
            const data = payload[0].payload;
            return (
              <div className={`rounded-lg border bg-card shadow-md ${isMobile ? 'p-2 text-[10px]' : 'p-3 text-sm'}`}>
                <p className="font-semibold">{data.stage}</p>
                <div className={`${isMobile ? 'mt-0.5' : 'mt-2'} space-y-0.5`}>
                  <p className="text-muted-foreground">
                    Count: {formatCompactNumber(data.count)}
                  </p>
                  <p>
                    Rate: <span className="font-medium">{formatPercentage(data.rate)}</span>
                  </p>
                </div>
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
