import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CampaignSearchProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function CampaignSearch({ value, onChange, disabled }: CampaignSearchProps) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search campaigns..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9"
        disabled={disabled}
      />
    </div>
  );
}
