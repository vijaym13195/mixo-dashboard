"use client";

import { useSettingsStore } from "@/lib/store/useSettingsStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
    const { chartVisibility, toggleChart, resetSettings } = useSettingsStore();

    const chartOptions = [
        {
            key: "campaignStatus",
            label: "Campaign Status",
            description: "Show the distribution of active, paused, and completed campaigns.",
        },
        {
            key: "platformBreakdown",
            label: "Platform Breakdown",
            description: "Display the breakdown of campaigns by advertising platform.",
        },
        {
            key: "conversionFunnel",
            label: "Conversion Funnel",
            description: "Visualize the customer journey from impression to conversion.",
        },
        {
            key: "budgetUtilization",
            label: "Budget Utilization",
            description: "Compare planned budget versus actual spend for campaigns.",
        },
        {
            key: "performanceComparison",
            label: "Top Performing Campaigns",
            description: "Rank campaigns based on key performance metrics.",
        },
    ] as const;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your dashboard preferences and view options
                    </p>
                </div>
                <Button variant="outline" onClick={resetSettings} className="gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Reset Defaults
                </Button>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Chart Visibility</CardTitle>
                        <CardDescription>
                            Customize which charts are displayed on your analytics dashboard.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        {chartOptions.map((option, index) => (
                            <motion.div
                                key={option.key}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center justify-between space-x-2"
                            >
                                <div className="flex flex-col space-y-1">
                                    <Label htmlFor={option.key} className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        {option.label}
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        {option.description}
                                    </p>
                                </div>
                                <Switch
                                    id={option.key}
                                    checked={chartVisibility[option.key]}
                                    onCheckedChange={() => toggleChart(option.key)}
                                />
                            </motion.div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
