"use client";

import { useState } from 'react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Campaign, CampaignInsight } from '@/lib/types';
import { transformToPerformanceData } from '../utils/dataTransformers';
import { formatCompactNumber, formatCurrency, formatPercentage } from '../utils/chartFormatters';
import { CHART_COLORS } from '../utils/chartColors';

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
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
          <TabsTrigger value="impressions" className="text-xs">
            Impressions
          </TabsTrigger>
          <TabsTrigger value="clicks" className="text-xs">
            Clicks
          </TabsTrigger>
          <TabsTrigger value="conversions" className="text-xs">
            Conversions
          </TabsTrigger>
          <TabsTrigger value="spend" className="text-xs">
            Spend
          </TabsTrigger>
          <TabsTrigger value="ctr" className="text-xs">
            CTR
          </TabsTrigger>
          <TabsTrigger value="cpc" className="text-xs">
            CPC
          </TabsTrigger>
          <TabsTrigger value="conversion_rate" className="text-xs">
            Conv. Rate
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" barCategoryGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            type="number"
            tickFormatter={config.formatter}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis
            type="category"
            dataKey="name"
            tickFormatter={(value) => truncateName(value as string, 30)}
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
                  <p className="font-semibold" title={payloadData.name}>{truncateName(payloadData.name, 35)}</p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">{config.label}:</span>{' '}
                    <span className="font-medium">{config.formatter(payloadData.value)}</span>
                  </p>
                </div>
              );
            }}
          />
          <Bar dataKey="value" fill={CHART_COLORS[0]} radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
