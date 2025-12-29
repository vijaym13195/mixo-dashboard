"use client";

import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { useInsights } from "@/lib/hooks/useInsights";
import { BarChart3, TrendingUp, Users, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
  const { data: insights, isLoading } = useInsights();

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const formatNumber = (val: number) =>
    new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(val);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Deep dive into your marketing performance metrics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Spend"
          value={isLoading ? "..." : formatCurrency(insights?.total_spend || 0)}
          icon={<TrendingUp className="h-4 w-4" />}
          isLoading={isLoading}
        />
        <MetricCard
          title="Avg CPC"
          value={isLoading ? "..." : formatCurrency(insights?.avg_cpc || 0)}
          icon={<BarChart3 className="h-4 w-4" />}
          isLoading={isLoading}
        />
        <MetricCard
          title="Avg CTR"
          value={isLoading ? "..." : `${insights?.avg_ctr?.toFixed(2) || 0}%`}
          icon={<Target className="h-4 w-4" />}
          isLoading={isLoading}
        />
        <MetricCard
          title="Conversion Rate"
          value={isLoading ? "..." : `${insights?.avg_conversion_rate?.toFixed(2) || 0}%`}
          icon={<Users className="h-4 w-4" />}
          isLoading={isLoading}
        />
      </div>

      {/* Placeholder for charts - future enhancement */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>
            Detailed analytics charts will be displayed here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
            <p className="text-sm text-muted-foreground">Charts coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
