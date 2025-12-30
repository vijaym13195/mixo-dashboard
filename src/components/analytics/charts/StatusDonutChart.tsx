import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { STATUS_COLORS } from '../utils/chartColors';
import { formatNumber, formatPercentage } from '../utils/chartFormatters';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';

interface StatusDonutChartProps {
  activeCampaigns: number;
  pausedCampaigns: number;
  completedCampaigns: number;
}

export function StatusDonutChart({
  activeCampaigns,
  pausedCampaigns,
  completedCampaigns,
}: StatusDonutChartProps) {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const total = activeCampaigns + pausedCampaigns + completedCampaigns;

  const data = [
    { name: 'Active', value: activeCampaigns, color: STATUS_COLORS.active },
    { name: 'Paused', value: pausedCampaigns, color: STATUS_COLORS.paused },
    { name: 'Completed', value: completedCampaigns, color: STATUS_COLORS.completed },
  ].filter((item) => item.value > 0);

  if (total === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        No campaign data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={isMobile ? 350 : 300}>
      <PieChart margin={isMobile ? { top: 10, right: 10, bottom: 40, left: 10 } : { top: 0, right: 0, bottom: 0, left: 0 }}>
        <Pie
          data={data}
          cx="50%"
          cy={isMobile ? "40%" : "50%"}
          labelLine={false}
          label={renderCustomLabel}
          innerRadius={isMobile ? 50 : 60}
          outerRadius={isMobile ? 70 : 80}
          paddingAngle={2}
          dataKey="value"
          activeShape={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number | undefined, name?: string) => {
            const numValue = value ?? 0;
            return [
              `${numValue} campaigns (${formatPercentage((numValue / total) * 100)})`,
              name ?? 'Unknown',
            ];
          }}
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: isMobile ? '10px' : '12px',
            padding: isMobile ? '4px 8px' : '8px 12px',
          }}
        />
        <Legend
          verticalAlign={isMobile ? "bottom" : "middle"}
          align={isMobile ? "center" : "right"}
          layout={isMobile ? "horizontal" : "vertical"}
          formatter={(value: string, entry: any) => {
            const payload = entry.payload;
            const percentage = formatPercentage((payload.value / total) * 100);
            return (
              <span className="text-[10px] sm:text-xs md:text-sm">
                {value}: {payload.value} {isMobile ? '' : `(${percentage})`}
              </span>
            );
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

function renderCustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, value }: any) {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent === 0) return null;

  return (
    <text
      x={x}
      y={y}
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="recharts-custom-label text-xs"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}
