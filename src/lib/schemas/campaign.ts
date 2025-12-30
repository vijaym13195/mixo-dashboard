import * as z from "zod";

export const campaignFormSchema = z.object({
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

export type CreateCampaignValues = z.infer<typeof campaignFormSchema>;
