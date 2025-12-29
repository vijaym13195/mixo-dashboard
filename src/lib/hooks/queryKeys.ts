export const campaignKeys = {
    all: ['campaigns'] as const,
    lists: () => [...campaignKeys.all, 'list'] as const,
    list: (filters: string) => [...campaignKeys.lists(), { filters }] as const,
    details: () => [...campaignKeys.all, 'detail'] as const,
    detail: (id: string) => [...campaignKeys.details(), id] as const,
};

export const insightKeys = {
    all: ['insights'] as const,
    aggregate: () => [...insightKeys.all, 'aggregate'] as const,
    campaign: (id: string) => [...insightKeys.all, 'campaign', id] as const,
};
