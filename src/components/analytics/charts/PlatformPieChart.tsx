import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Campaign } from '@/lib/types';
import { transformToPlatformDistribution } from '../utils/dataTransformers';
import { PLATFORM_COLORS } from '../utils/chartColors';
import { formatNumber, formatPercentage } from '../utils/chartFormatters';

interface PlatformPieChartProps {
  campaigns: Campaign[];
}

export function PlatformPieChart({ campaigns }: PlatformPieChartProps) {
  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        No campaign data available
      </div>
    );
  }

  const data = transformToPlatformDistribution(campaigns);
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomLabel}
          outerRadius={80}
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
          }}
        />
        <Legend
          verticalAlign="middle"
          align="right"
          layout="vertical"
          formatter={(value: string, entry: any) => {
            const payload = entry.payload;
            const percentage = formatPercentage((payload.value / total) * 100);
            return (
              <span className="text-sm">
                {value}: {payload.value} ({percentage})
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
