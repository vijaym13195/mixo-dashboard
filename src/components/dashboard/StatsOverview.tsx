"use client";

import { useInsights } from "@/lib/hooks/useInsights";
import { MetricCard } from "./MetricCard";
import { Activity, CreditCard, MousePointerClick, TrendingUp } from "lucide-react";

export function StatsOverview() {
    const { data: insights, isLoading, error } = useInsights();


    if (error) {
        return (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
                Failed to load insights.
            </div>
        );
    }

    // Helper to format currency
    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    // Helper to format number
    const formatNumber = (val: number) =>
        new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(val);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
                title="Total Spend"
                value={isLoading ? 0 : formatCurrency(insights?.total_spend || 0)}
                icon={<CreditCard className="h-4 w-4" />}
                isLoading={isLoading}
            />

            <MetricCard
                title="Active Campaigns"
                value={isLoading ? 0 : insights?.active_campaigns || 0}
                description={`of ${insights?.total_campaigns || 0} total`}
                icon={<Activity className="h-4 w-4" />}
                isLoading={isLoading}
            />

            <MetricCard
                title="Total Impressions"
                value={isLoading ? 0 : formatNumber(insights?.total_impressions || 0)}
                icon={<TrendingUp className="h-4 w-4" />}
                isLoading={isLoading}
            />

            <MetricCard
                title="Referrals / Clicks"
                value={isLoading ? 0 : formatNumber(insights?.total_clicks || 0)}
                description={`CTR: ${insights?.avg_ctr ? (insights.avg_ctr).toFixed(2) : 0}%`}
                icon={<MousePointerClick className="h-4 w-4" />}
                isLoading={isLoading}
            />
        </div>
    );
}
