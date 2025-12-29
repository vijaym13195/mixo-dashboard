import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type SortField = 'name' | 'budget' | 'created_at' | 'status';

interface CampaignSortProps {
  field: SortField;
  onFieldChange: (field: SortField) => void;
  disabled?: boolean;
}

export function CampaignSort({ field, onFieldChange, disabled }: CampaignSortProps) {
  return (
    <Select
      value={field}
      onValueChange={(val) => onFieldChange(val as SortField)}
      disabled={disabled}
    >
      <SelectTrigger className="w-[140px] hidden sm:flex">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="created_at">Date Created</SelectItem>
        <SelectItem value="name">Name</SelectItem>
        <SelectItem value="budget">Budget</SelectItem>
        <SelectItem value="status">Status</SelectItem>
      </SelectContent>
    </Select>
  );
}
