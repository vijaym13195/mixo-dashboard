import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";

type ViewMode = 'table' | 'grid';

interface CampaignViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function CampaignViewToggle({ viewMode, onViewModeChange }: CampaignViewToggleProps) {
  return (
    <div className="flex items-center rounded-lg border bg-background p-1">
      <Button
        variant={viewMode === "table" ? "secondary" : "ghost"}
        size="sm"
        className="h-8 px-2"
        onClick={() => onViewModeChange("table")}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "grid" ? "secondary" : "ghost"}
        size="sm"
        className="h-8 px-2"
        onClick={() => onViewModeChange("grid")}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
    </div>
  );
}
