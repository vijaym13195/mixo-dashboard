"use client";

import { useState } from 'react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Campaign, CampaignInsight } from '@/lib/types';
import { transformToPerformanceData } from '../utils/dataTransformers';
import { formatCompactNumber, formatCurrency, formatPercentage } from '../utils/chartFormatters';
import { PERFORMANCE_COLORS } from '../utils/chartColors';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';

interface PerformanceBarChartProps {
  campaigns: Array<Campaign & { insights?: CampaignInsight }>;
}

type Metric = keyof CampaignInsight;

const METRIC_CONFIG: Record<
  string,
  { label: string; formatter: (val: number) => string }
> = {
  impressions: { label: 'Impressions', formatter: formatCompactNumber },
  clicks: { label: 'Clicks', formatter: formatCompactNumber },
  conversions: { label: 'Conversions', formatter: formatCompactNumber },
  spend: { label: 'Spend', formatter: formatCurrency },
  ctr: { label: 'CTR', formatter: (val) => formatPercentage(val, 2) },
  cpc: { label: 'CPC', formatter: (val) => formatCurrency(val) },
  conversion_rate: { label: 'Conv. Rate', formatter: (val) => formatPercentage(val, 2) },
};

export function PerformanceBarChart({ campaigns }: PerformanceBarChartProps) {
  const [metric, setMetric] = useState<Metric>('impressions');
  const isMobile = useMediaQuery('(max-width: 640px)');

  const data = transformToPerformanceData(campaigns, metric, 10);

  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        No performance data available
      </div>
    );
  }

  const config = METRIC_CONFIG[metric];

  // Truncate long names for display
  const truncateName = (name: string, maxLength: number = 25) => {
    return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
  };

  return (
    <div className="space-y-4">
      <Tabs
        value={metric}
        onValueChange={(value) => setMetric(value as Metric)}
        className="w-full"
      >
        <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2 h-auto gap-1' : 'grid-cols-3 lg:grid-cols-7'}`}>
          <TabsTrigger value="impressions" className="text-[10px] sm:text-xs py-1.5 px-2">
            Impressions
          </TabsTrigger>
          <TabsTrigger value="clicks" className="text-[10px] sm:text-xs py-1.5 px-2">
            Clicks
          </TabsTrigger>
          <TabsTrigger value="conversions" className="text-[10px] sm:text-xs py-1.5 px-2">
            Conversions
          </TabsTrigger>
          <TabsTrigger value="spend" className="text-[10px] sm:text-xs py-1.5 px-2">
            Spend
          </TabsTrigger>
          <TabsTrigger value="ctr" className="text-[10px] sm:text-xs py-1.5 px-2">
            CTR
          </TabsTrigger>
          <TabsTrigger value="cpc" className="text-[10px] sm:text-xs py-1.5 px-2">
            CPC
          </TabsTrigger>
          <TabsTrigger value="conversion_rate" className="text-[10px] sm:text-xs py-1.5 px-2">
            Conv. Rate
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <ResponsiveContainer width="100%" height={isMobile ? 400 : 450}>
        <BarChart
          data={data}
          layout="vertical"
          barCategoryGap={isMobile ? 10 : 15}
          margin={isMobile ? { top: 5, right: 10, left: 0, bottom: 5 } : { top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            type="number"
            tickFormatter={config.formatter}
            fontSize={isMobile ? 10 : 12}
          />
          <YAxis
            type="category"
            dataKey="name"
            tickFormatter={(value) => truncateName(value as string, isMobile ? 15 : 30)}
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
                <div className="rounded-lg border bg-card p-3 shadow-md">
                  <p className="font-semibold" title={payloadData.name}>{truncateName(payloadData.name, 35)}</p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">{config.label}:</span>{' '}
                    <span className="font-medium">{config.formatter(payloadData.value)}</span>
                  </p>
                </div>
              );
            }}
          />
          <Bar dataKey="value" fill={PERFORMANCE_COLORS[0]} radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
