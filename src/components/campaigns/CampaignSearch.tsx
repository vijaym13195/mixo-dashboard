import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CampaignSearchProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function CampaignSearch({ value, onChange, disabled }: CampaignSearchProps) {
  return (
    <div className="relative w-full max-w-sm flex items-center">
      <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        placeholder="Search campaigns..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 pr-9"
        disabled={disabled}
      />
      {value && !disabled && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-transparent"
          onClick={() => onChange("")}
          type="button"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
