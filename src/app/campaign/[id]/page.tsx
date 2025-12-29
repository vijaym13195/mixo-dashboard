"use client";

import { use } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Calendar, DollarSign, Activity, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { useCampaign } from "@/lib/hooks/useCampaigns";
import { useCampaignInsights } from "@/lib/hooks/useInsights";
import { useCampaignStream } from "@/lib/hooks/useStream";

import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { PlatformBadge } from "@/components/dashboard/PlatformBadge";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface CampaignDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function CampaignDetailPage({ params }: CampaignDetailPageProps) {
    // Unwrap params using React.use()
    const { id } = use(params);

    const { data: campaign, isLoading: isLoadingCampaign, error: campaignError } = useCampaign(id);
    const { data: initialInsights, isLoading: isLoadingInsights, error: insightsError } = useCampaignInsights(id);
    const { data: streamData, isConnected } = useCampaignStream(id);

    // Use real-time data if available, otherwise fallback to initial fetch
    const insights = streamData || initialInsights;
    const isLoading = isLoadingCampaign || isLoadingInsights;
    const error = campaignError || insightsError;

    if (error) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
                <Alert variant="destructive" className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Failed to load campaign details. {(error as Error).message}
                    </AlertDescription>
                </Alert>
                <Button variant="outline" asChild>
                    <Link href="/">Back to Dashboard</Link>
                </Button>
            </div>
        )
    }

    if (isLoading || !campaign) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-xl" />
                    ))}
                </div>
                <Skeleton className="h-[400px] rounded-xl" />
            </div>
        );
    }

    // Format helpers
    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    const formatNumber = (val: number) =>
        new Intl.NumberFormat('en-US').format(val);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Button variant="ghost" size="icon" className="-ml-2 h-8 w-8" asChild>
                            <Link href="/">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <span className="text-sm">/ Campaigns / {campaign.id}</span>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
                            <StatusBadge status={campaign.status} />
                        </div>
                        <p className="text-muted-foreground">
                            Brand ID: <span className="font-mono text-xs">{campaign.brand_id}</span>
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Created {format(new Date(campaign.created_at), "MMM d, yyyy")}
                        </div>
                        <Separator orientation="vertical" className="h-4" />
                        <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            Budget: {formatCurrency(campaign.budget)}
                        </div>
                        <Separator orientation="vertical" className="h-4" />
                        <div className="flex gap-1">
                            {campaign.platforms.map(p => <PlatformBadge key={p} platform={p} />)}
                        </div>

                        {isConnected && (
                            <>
                                <Separator orientation="vertical" className="h-4" />
                                <div className="flex items-center gap-1.5 text-green-500 animate-pulse">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    Live Updates
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                    </Button>
                </div>
            </div>

            <Separator />

            {/* Insights Grid */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Performance Insights
                </h2>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <MetricCard
                        title="Total Spend"
                        value={formatCurrency(insights?.spend || 0)}
                        description="Total campaign spend"
                    />
                    <MetricCard
                        title="Impressions"
                        value={formatNumber(insights?.impressions || 0)}
                        description="Total views"
                    />
                    <MetricCard
                        title="Clicks"
                        value={formatNumber(insights?.clicks || 0)}
                        description={`CTR: ${insights?.ctr ? insights.ctr.toFixed(2) : 0}%`}
                    />
                    <MetricCard
                        title="Conversions"
                        value={formatNumber(insights?.conversions || 0)}
                        description={`Rate: ${insights?.conversion_rate ? insights.conversion_rate.toFixed(2) : 0}%`}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <MetricCard
                        title="Cost Per Click (CPC)"
                        value={formatCurrency(insights?.cpc || 0)}
                        className="bg-muted/20"
                    />
                    <MetricCard
                        title="Daily Budget Utilization"
                        value={formatCurrency(campaign.daily_budget)}
                        description="Max daily spend cap"
                        className="bg-muted/20"
                    />
                </div>
            </div>
        </div>
    );
}
