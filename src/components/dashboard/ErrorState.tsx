import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorStateProps {
    title?: string;
    description?: string;
    retry?: () => void;
    compact?: boolean;
}

export function ErrorState({
    title = "Something went wrong",
    description = "We couldn't load the data. Please try again.",
    retry,
    compact = false,
}: ErrorStateProps) {
    if (compact) {
        return (
            <Alert variant="destructive" className="my-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="flex items-center gap-2">
                    {title}
                    {retry && (
                        <Button
                            variant="link"
                            className="h-auto p-0 text-destructive underline"
                            onClick={retry}
                        >
                            Retry
                        </Button>
                    )}
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center animate-in fade-in-50">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
                <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold text-destructive">{title}</h3>
            <p className="mb-6 mt-2 text-sm text-muted-foreground max-w-sm">
                {description}
            </p>
            {retry && (
                <Button onClick={retry} variant="outline" className="gap-2 border-destructive/20 hover:bg-destructive/10 hover:text-destructive">
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                </Button>
            )}
        </div>
    );
}
