"use client";

import { useMemo, useState, useEffect } from "react";
import { useCampaigns } from "@/lib/hooks/useCampaigns";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useDashboardStore } from "@/lib/store/useDashboardStore";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { ErrorState } from "@/components/dashboard/ErrorState";
import { CampaignSearch } from "./CampaignSearch";
import { CampaignFilters } from "./CampaignFilters";
import { CampaignSort } from "./CampaignSort";
import { CampaignViewToggle } from "./CampaignViewToggle";
import { CampaignsTable } from "./CampaignsTable";
import { CampaignsGrid } from "./CampaignsGrid";

export function CampaignsList() {
  const { data: campaigns, isLoading, error, refetch } = useCampaigns();

  const {
    filters,
    sort,
    searchQuery,
    viewMode,
    setSearchQuery,
    setSort,
    setStatusFilter,
    setPlatformFilter,
    setViewMode,
    resetFilters,
  } = useDashboardStore();

  // Local state for search debounce
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debouncedSearch = useDebounce(localSearch, 300);

  // Sync debounced search with store
  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  // Update local state when store changes
  useEffect(() => {
    if (searchQuery !== localSearch && searchQuery === "") {
      setLocalSearch("");
    }
  }, [searchQuery, localSearch]);

  const hasActiveFilters = searchQuery || filters.status.length > 0 || filters.platforms.length > 0;

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

    // Filter by platform
    if (filters.platforms.length > 0) {
      result = result.filter((c) =>
        c.platforms.some((p) => filters.platforms.includes(p))
      );
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
  }, [campaigns, searchQuery, filters.status, filters.platforms, sort]);

  if (isLoading) return <LoadingState />;

  if (error) {
    return (
      <ErrorState
        title="Failed to load campaigns"
        description="We encountered an issue fetching your campaigns data. Please check your connection and try again."
        retry={refetch}
      />
    );
  }

  const isCampaignsEmpty = !campaigns || campaigns.length === 0;

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
          <CampaignSearch
            value={localSearch}
            onChange={setLocalSearch}
            disabled={isCampaignsEmpty}
          />
          <CampaignFilters
            statusFilter={filters.status}
            platformFilter={filters.platforms}
            onStatusChange={setStatusFilter}
            onPlatformChange={setPlatformFilter}
            onReset={resetFilters}
            disabled={isCampaignsEmpty}
          />
          <CampaignSort
            field={sort.field}
            onFieldChange={(field) => setSort({ ...sort, field })}
            disabled={isCampaignsEmpty}
          />
        </div>

        <CampaignViewToggle
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>

      {/* Content */}
      {filteredCampaigns.length === 0 ? (
        <EmptyState
          title={hasActiveFilters ? "No matching campaigns" : "No campaigns yet"}
          description={
            hasActiveFilters
              ? "Try adjusting your filters or search query to find what you're looking for."
              : "Get started by creating your first marketing campaign."
          }
          actionLabel={hasActiveFilters ? "Reset Filters" : "Create Campaign"}
          onAction={
            hasActiveFilters
              ? () => { resetFilters(); setLocalSearch(""); }
              : undefined
          }
        />
      ) : viewMode === "grid" ? (
        <CampaignsGrid campaigns={filteredCampaigns} />
      ) : (
        <CampaignsTable
          campaigns={filteredCampaigns}
          sortField={sort.field}
          sortOrder={sort.order}
          onSortClick={handleSortClick}
        />
      )}
    </div>
  );
}
