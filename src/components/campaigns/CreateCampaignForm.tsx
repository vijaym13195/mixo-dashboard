"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
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
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { campaignFormSchema, type CreateCampaignValues } from "@/lib/schemas/campaign";
import { useCampaignOptions } from "./useCampaignOptions";

interface CreateCampaignFormProps {
    onCancel?: () => void;
    onSubmit?: (data: CreateCampaignValues & { created_at: string }) => void;
}

export function CreateCampaignForm({ onCancel, onSubmit }: CreateCampaignFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false); // Popover open state for combobox

    const { brands, platforms, isLoading: isLoadingOptions } = useCampaignOptions();

    // 1. Define your form.
    const form = useForm({
        resolver: zodResolver(campaignFormSchema),
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
    async function onFormSubmit(values: CreateCampaignValues) {
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="brand_id"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Brand ID</FormLabel>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={open}
                                                    className={cn(
                                                        "w-full justify-between font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                    disabled={isLoadingOptions}
                                                >
                                                    {field.value
                                                        ? brands.find((brand) => brand.id === field.value)?.name
                                                        : isLoadingOptions ? "Loading..." : "Select brand ID..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Search brand ID..." />
                                                <CommandList>
                                                    <CommandEmpty>No brand found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {brands.map((brand) => (
                                                            <CommandItem
                                                                key={brand.id}
                                                                value={brand.name}
                                                                onSelect={() => {
                                                                    form.setValue("brand_id", brand.id, { shouldValidate: true });
                                                                    setOpen(false);
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        brand.id === field.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                                {brand.name}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-lg border p-4">
                                    {platforms.map((platform) => (
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
