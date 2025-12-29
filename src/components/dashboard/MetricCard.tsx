import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MetricCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    description?: string;
    trend?: {
        value: number;
        label: string;
    };
    isLoading?: boolean;
    className?: string;
}

export function MetricCard({
    title,
    value,
    icon,
    description,
    trend,
    isLoading,
    className,
}: MetricCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, translateY: -5 }}
            transition={{
                duration: 0.3,
                ease: "easeOut"
            }}
            className={cn("h-full", className)}
        >
            <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        {title}
                    </CardTitle>
                    {icon && <div className="text-muted-foreground">{icon}</div>}
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    ) : (
                        <>
                            <div className="text-2xl font-bold">{value}</div>
                            {(description || trend) && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    {trend && (
                                        <span className={cn(
                                            "mr-1 font-medium",
                                            trend.value > 0 ? "text-green-500" : "text-red-500"
                                        )}>
                                            {trend.value > 0 ? "+" : ""}{trend.value}%
                                        </span>
                                    )}
                                    {description}
                                </p>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
