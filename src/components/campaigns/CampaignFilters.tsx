import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";

interface CampaignFiltersProps {
  statusFilter: string[];
  platformFilter: string[];
  onStatusChange: (status: string[]) => void;
  onPlatformChange: (platforms: string[]) => void;
  onReset: () => void;
  disabled?: boolean;
}

export function CampaignFilters({
  statusFilter,
  platformFilter,
  onStatusChange,
  onPlatformChange,
  onReset,
  disabled,
}: CampaignFiltersProps) {
  const hasActiveFilters = statusFilter.length > 0 || platformFilter.length > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0" disabled={disabled}>
          <Filter className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {['active', 'paused', 'completed'].map((status) => (
          <DropdownMenuCheckboxItem
            key={status}
            checked={statusFilter.includes(status)}
            onCheckedChange={(checked) => {
              const newStatus = checked
                ? [...statusFilter, status]
                : statusFilter.filter((s) => s !== status);
              onStatusChange(newStatus);
            }}
            className="capitalize"
          >
            {status}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Filter by Platform</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {['meta', 'google', 'linkedin'].map((platform) => (
          <DropdownMenuCheckboxItem
            key={platform}
            checked={platformFilter.includes(platform)}
            onCheckedChange={(checked) => {
              const newPlatforms = checked
                ? [...platformFilter, platform]
                : platformFilter.filter((p) => p !== platform);
              onPlatformChange(newPlatforms);
            }}
            className="capitalize"
          >
            {platform}
          </DropdownMenuCheckboxItem>
        ))}

        {hasActiveFilters && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={false}
              onCheckedChange={onReset}
              className="text-muted-foreground"
            >
              Clear All Filters
            </DropdownMenuCheckboxItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
