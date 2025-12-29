"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-6 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Something went wrong!</h1>
                <p className="text-muted-foreground max-w-[500px]">
                    An unexpected error occurred. We've been notified and are working to fix it.
                </p>
                {error.digest && (
                    <p className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded">
                        Error ID: {error.digest}
                    </p>
                )}
            </div>
            <div className="flex gap-4">
                <Button onClick={() => reset()} variant="default" size="lg">
                    Try again
                </Button>
                <Button onClick={() => window.location.href = '/'} variant="outline" size="lg">
                    Back to Home
                </Button>
            </div>
        </div>
    );
}
