import Link from "next/link";
import { format } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Campaign } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { PlatformBadge } from "./PlatformBadge";

type SortField = 'name' | 'budget' | 'created_at' | 'status';
type SortOrder = 'asc' | 'desc';

interface CampaignsTableProps {
  campaigns: Campaign[];
  sortField: SortField;
  sortOrder: SortOrder;
  onSortClick: (field: SortField) => void;
}

export function CampaignsTable({ campaigns, sortField, sortOrder, onSortClick }: CampaignsTableProps) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">
              <Button variant="ghost" className="h-8 -ml-3" onClick={() => onSortClick("name")}>
                Name
                <ArrowUpDown className="ml-2 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">
              <Button variant="ghost" className="h-8 -mr-3" onClick={() => onSortClick("budget")}>
                Budget
                <ArrowUpDown className="ml-2 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button variant="ghost" className="h-8 -mr-3" onClick={() => onSortClick("created_at")}>
                Created
                <ArrowUpDown className="ml-2 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((campaign) => (
            <TableRow key={campaign.id}>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span className="line-clamp-1">{campaign.name}</span>
                  <span className="text-xs text-muted-foreground">{campaign.id}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {campaign.platforms.map(p => <PlatformBadge key={p} platform={p} />)}
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={campaign.status} />
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(campaign.budget)}
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {format(new Date(campaign.created_at), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/campaign/${campaign.id}`}>Details</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
