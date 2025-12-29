import Link from "next/link";
import { format } from "date-fns";
import { Campaign } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { PlatformBadge } from "./PlatformBadge";
import { ArrowRight, Calendar, DollarSign } from "lucide-react";

interface CampaignCardProps {
    campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
    return (
        <Card className="flex flex-col overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <h3 className="font-semibold leading-none tracking-tight line-clamp-1" title={campaign.name}>
                        {campaign.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">{campaign.id}</p>
                </div>
                <StatusBadge status={campaign.status} />
            </CardHeader>
            <CardContent className="flex-1 py-4">
                <div className="grid gap-2">
                    <div className="flex items-center text-sm">
                        <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                            {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                                maximumFractionDigits: 0,
                            }).format(campaign.budget)}{" "}
                            <span className="text-muted-foreground font-normal">total</span>
                        </span>
                    </div>
                    <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                            {format(new Date(campaign.created_at), "MMM d, yyyy")}
                        </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                        {campaign.platforms.map((platform) => (
                            <PlatformBadge key={platform} platform={platform} />
                        ))}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="bg-muted/50 p-3">
                <Button variant="ghost" className="w-full h-8 text-xs justify-between group" asChild>
                    <Link href={`/campaign/${campaign.id}`}>
                        View Details
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
