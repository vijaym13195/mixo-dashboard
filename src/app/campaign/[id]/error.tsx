"use client";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function CampaignDetailError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Campaign</AlertTitle>
        <AlertDescription>
          {error.message || "Failed to load campaign details. Please try again later."}
        </AlertDescription>
      </Alert>
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link href="/campaigns">Back to Campaigns</Link>
        </Button>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    </div>
  );
}
