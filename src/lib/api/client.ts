const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mixo-fe-backend-task.vercel.app';

export const apiClient = {
    async get(endpoint: string) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: { 'Accept': 'application/json' },
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return response.json();
    },
};
