export interface Campaign {
    id: string;
    name: string;
    brand_id: string;
    status: 'active' | 'paused' | 'completed';
    budget: number;
    daily_budget: number;
    platforms: string[]; // e.g., ['meta', 'google', 'linkedin']
    created_at: string; // ISO timestamp
}

export interface CampaignInsight {
    campaign_id: string;
    timestamp: string;
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
    ctr: number; // Click-through rate
    cpc: number; // Cost per click
    conversion_rate: number;
}

export interface CampaignWithInsights extends Campaign {
    insights: CampaignInsight;
}

export interface AggregateInsights {
    timestamp: string;
    total_campaigns: number;
    active_campaigns: number;
    paused_campaigns: number;
    completed_campaigns: number;
    total_impressions: number;
    total_clicks: number;
    total_conversions: number;
    total_spend: number;
    avg_ctr: number;
    avg_cpc: number;
    avg_conversion_rate: number;
}
