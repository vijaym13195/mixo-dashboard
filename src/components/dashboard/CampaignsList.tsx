"use client";

import { useMemo } from "react";
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
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCampaigns } from "@/lib/hooks/useCampaigns";
import { useDashboardStore } from "@/lib/store/useDashboardStore";
import { StatusBadge } from "./StatusBadge";
import { PlatformBadge } from "./PlatformBadge";
import { CampaignCard } from "./CampaignCard";
import { LoadingState } from "./LoadingState";
import { EmptyState } from "./EmptyState";
import {
    ArrowUpDown,
    Filter,
    LayoutGrid,
    List,
    Search,
    SlidersHorizontal,
} from "lucide-react";

export function CampaignsList() {
    const { data: campaigns, isLoading, error } = useCampaigns();

    const {
        filters,
        sort,
        searchQuery,
        viewMode,
        setSearchQuery,
        setSort,
        setStatusFilter,
        setViewMode,
        resetFilters,
    } = useDashboardStore();

    const filteredCampaigns = useMemo(() => {
        if (!campaigns) return [];

        let result = [...campaigns];

        // Filter by search query
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (c) =>
                    c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
            );
        }

        // Filter by status
        if (filters.status.length > 0) {
            result = result.filter((c) => filters.status.includes(c.status));
        }

        // Sort
        result.sort((a, b) => {
            const aValue = a[sort.field];
            const bValue = b[sort.field];

            if (aValue < bValue) return sort.order === "asc" ? -1 : 1;
            if (aValue > bValue) return sort.order === "asc" ? 1 : -1;
            return 0;
        });

        return result;
    }, [campaigns, searchQuery, filters.status, sort]);

    if (isLoading) return <LoadingState />;

    if (error) {
        return (
            <div className="flex h-40 items-center justify-center rounded-lg border border-destructive/50 bg-destructive/10 text-destructive">
                Error loading campaigns. Please try again.
            </div>
        );
    }

    // Helper for sorting click
    const handleSortClick = (field: typeof sort.field) => {
        if (sort.field === field) {
            setSort({ field, order: sort.order === "asc" ? "desc" : "asc" });
        } else {
            setSort({ field, order: "asc" });
        }
    };

    return (
        <div className="space-y-4">
            {/* Controls Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 items-center gap-2">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search campaigns..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48">
                            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {['active', 'paused', 'completed'].map((status) => (
                                <DropdownMenuCheckboxItem
                                    key={status}
                                    checked={filters.status.includes(status)}
                                    onCheckedChange={(checked) => {
                                        const newStatus = checked
                                            ? [...filters.status, status]
                                            : filters.status.filter((s) => s !== status);
                                        setStatusFilter(newStatus);
                                    }}
                                    className="capitalize"
                                >
                                    {status}
                                </DropdownMenuCheckboxItem>
                            ))}
                            {filters.status.length > 0 && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuCheckboxItem
                                        checked={false}
                                        onCheckedChange={() => setStatusFilter([])}
                                        className="text-muted-foreground"
                                    >
                                        Clear Filters
                                    </DropdownMenuCheckboxItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>


                    <Select
                        value={sort.field}
                        onValueChange={(val) => setSort({ ...sort, field: val as any })}
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
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center rounded-lg border bg-background p-1">
                        <Button
                            variant={viewMode === "table" ? "secondary" : "ghost"}
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => setViewMode("table")}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === "grid" ? "secondary" : "ghost"}
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => setViewMode("grid")}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content */}
            {filteredCampaigns.length === 0 ? (
                <EmptyState
                    onAction={resetFilters}
                    actionLabel="Reset Filters & Search"
                />
            ) : viewMode === "grid" ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredCampaigns.map((campaign) => (
                        <CampaignCard key={campaign.id} campaign={campaign} />
                    ))}
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[250px]">
                                    <Button variant="ghost" className="h-8 -ml-3" onClick={() => handleSortClick("name")}>
                                        Name
                                        <ArrowUpDown className="ml-2 h-3 w-3" />
                                    </Button>
                                </TableHead>
                                <TableHead>Platform</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    <Button variant="ghost" className="h-8 -mr-3" onClick={() => handleSortClick("budget")}>
                                        Budget
                                        <ArrowUpDown className="ml-2 h-3 w-3" />
                                    </Button>
                                </TableHead>
                                <TableHead className="text-right">
                                    <Button variant="ghost" className="h-8 -mr-3" onClick={() => handleSortClick("created_at")}>
                                        Created
                                        <ArrowUpDown className="ml-2 h-3 w-3" />
                                    </Button>
                                </TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCampaigns.map((campaign) => (
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
                                        {new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                            maximumFractionDigits: 0,
                                        }).format(campaign.budget)}
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
            )}
        </div>
    );
}
