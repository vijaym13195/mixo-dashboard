import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                <FileQuestion className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">404</h1>
                <h2 className="text-2xl font-semibold tracking-tight">Page not found</h2>
                <p className="text-muted-foreground max-w-[500px]">
                    Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
                </p>
            </div>
            <Button asChild size="lg" className="mt-4">
                <Link href="/">Back to Dashboard</Link>
            </Button>
        </div>
    );
}
