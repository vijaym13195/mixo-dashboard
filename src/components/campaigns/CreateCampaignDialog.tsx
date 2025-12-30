"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { CreateCampaignForm } from "./CreateCampaignForm";
import { toast } from "sonner";

export function CreateCampaignDialog() {
    const [open, setOpen] = useState(false);

    const handleSuccess = (data: any) => {
        setOpen(false);
        toast.success("Campaign created successfully", {
            description: `${data.name} has been added to your campaigns.`,
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Create Campaign</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Create New Campaign</DialogTitle>
                    <DialogDescription>
                        Set up a new marketing campaign across multiple platforms.
                    </DialogDescription>
                </DialogHeader>
                <CreateCampaignForm
                    onCancel={() => setOpen(false)}
                    onSubmit={handleSuccess}
                />
            </DialogContent>
        </Dialog>
    );
}
