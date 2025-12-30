"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const PLATFORMS = [
    { id: "meta", label: "Meta (Facebook/Instagram)" },
    { id: "google", label: "Google Ads" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "tiktok", label: "TikTok" },
    { id: "twitter", label: "Twitter (X)" },
];

interface CreateCampaignFormProps {
    onCancel?: () => void;
    onSubmit?: (data: any) => void;
}

export function CreateCampaignForm({ onCancel, onSubmit }: CreateCampaignFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

    // Simple state management for form fields
    const [formData, setFormData] = useState({
        name: "",
        brand_id: "",
        status: "paused",
        budget: "",
        daily_budget: "",
    });

    const handlePlatformToggle = (platformId: string) => {
        setSelectedPlatforms((current) =>
            current.includes(platformId)
                ? current.filter((id) => id !== platformId)
                : [...current, platformId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const submissionData = {
            ...formData,
            budget: Number(formData.budget),
            daily_budget: Number(formData.daily_budget),
            platforms: selectedPlatforms,
            created_at: new Date().toISOString(),
        };

        console.log("Form submitted:", submissionData);

        setIsLoading(false);
        if (onSubmit) {
            onSubmit(submissionData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Campaign Name</Label>
                    <Input
                        id="name"
                        placeholder="e.g., Summer Sale 2025"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="brand_id">Brand ID</Label>
                        <Input
                            id="brand_id"
                            placeholder="e.g., brand_123"
                            value={formData.brand_id}
                            onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) => setFormData({ ...formData, status: value })}
                        >
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="paused">Paused</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="budget">Total Budget ($)</Label>
                        <Input
                            id="budget"
                            type="number"
                            placeholder="5000"
                            min="0"
                            value={formData.budget}
                            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="daily_budget">Daily Budget ($)</Label>
                        <Input
                            id="daily_budget"
                            type="number"
                            placeholder="100"
                            min="0"
                            value={formData.daily_budget}
                            onChange={(e) => setFormData({ ...formData, daily_budget: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Platforms</Label>
                    <div className="grid grid-cols-2 gap-2 rounded-lg border p-4">
                        {PLATFORMS.map((platform) => (
                            <div key={platform.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`platform-${platform.id}`}
                                    checked={selectedPlatforms.includes(platform.id)}
                                    onCheckedChange={() => handlePlatformToggle(platform.id)}
                                />
                                <Label
                                    htmlFor={`platform-${platform.id}`}
                                    className="text-sm font-normal cursor-pointer"
                                >
                                    {platform.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" type="button" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Campaign"}
                </Button>
            </div>
        </form>
    );
}
