"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

const PLATFORMS = [
    { id: "meta", label: "Meta (Facebook/Instagram)" },
    { id: "google", label: "Google Ads" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "tiktok", label: "TikTok" },
    { id: "twitter", label: "Twitter (X)" },
];

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Campaign name must be at least 2 characters.",
    }),
    brand_id: z.string().min(1, {
        message: "Brand ID is required.",
    }),
    status: z.enum(["active", "paused", "completed"]),
    budget: z.coerce.number().min(1, {
        message: "Budget must be at least 1.",
    }),
    daily_budget: z.coerce.number().min(1, {
        message: "Daily budget must be at least 1.",
    }),
    platforms: z.array(z.string()).refine((value) => value.length > 0, {
        message: "You must select at least one platform.",
    }),
});

interface CreateCampaignFormProps {
    onCancel?: () => void;
    onSubmit?: (data: any) => void;
}

export function CreateCampaignForm({ onCancel, onSubmit }: CreateCampaignFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    // 1. Define your form.
    const form = useForm({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            brand_id: "",
            status: "paused",
            budget: 0,
            daily_budget: 0,
            platforms: [],
        },
    });

    const { isValid } = form.formState;

    // 2. Define a submit handler.
    async function onFormSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const submissionData = {
            ...values,
            created_at: new Date().toISOString(),
        };

        console.log("Form submitted:", submissionData);

        setIsLoading(false);
        if (onSubmit) {
            onSubmit(submissionData);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Campaign Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Summer Sale 2025" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="brand_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Brand ID</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., brand_123" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="paused">Paused</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="budget"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Total Budget ($)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="5000"
                                            {...field}
                                            value={(field.value as any) || ""}
                                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="daily_budget"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Daily Budget ($)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="100"
                                            {...field}
                                            value={(field.value as any) || ""}
                                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="platforms"
                        render={() => (
                            <FormItem>
                                <div className="mb-4">
                                    <FormLabel className="text-base">Platforms</FormLabel>
                                </div>
                                <div className="grid grid-cols-2 gap-2 rounded-lg border p-4">
                                    {PLATFORMS.map((platform) => (
                                        <FormField
                                            key={platform.id}
                                            control={form.control}
                                            name="platforms"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem
                                                        key={platform.id}
                                                        className="flex flex-row items-start space-x-3 space-y-0"
                                                    >
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(platform.id)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...field.value, platform.id])
                                                                        : field.onChange(
                                                                            field.value?.filter(
                                                                                (value) => value !== platform.id
                                                                            )
                                                                        )
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="font-normal cursor-pointer">
                                                            {platform.label}
                                                        </FormLabel>
                                                    </FormItem>
                                                )
                                            }}
                                        />
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" type="button" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading || !isValid}>
                        {isLoading ? "Creating..." : "Create Campaign"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
