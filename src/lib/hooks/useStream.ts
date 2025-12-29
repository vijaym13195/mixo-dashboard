import { useState, useEffect } from 'react';
import { CampaignInsight } from '../types';

export function useCampaignStream(id: string) {
    const [data, setData] = useState<CampaignInsight | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!id) return;

        // Use absolute URL if needed or relative if proxying
        // Assuming relative path works with the API setup or proxy
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mixo-fe-backend-task.vercel.app';
        const eventSource = new EventSource(`${API_BASE_URL}/campaigns/${id}/insights/stream`);

        eventSource.onmessage = (event) => {
            try {
                const parsedData = JSON.parse(event.data);
                setData(parsedData);
                setError(null);
            } catch (err) {
                setError(err as Error);
                // Silent fail for parse errors - data will remain null and component falls back to initial insights
            }
        };

        eventSource.onopen = () => {
            setIsConnected(true);
            setError(null);
        };

        eventSource.onerror = (err) => {
            // SSE is optional enhancement - silent fail since component falls back to initial insights
            // Browser EventSource will call onerror when connection fails (often due to CORS)
            setIsConnected(false);
            setError(new Error('Stream connection failed'));
            eventSource.close();
        };

        return () => {
            eventSource.close();
            setIsConnected(false);
        };
    }, [id]);

    return { data, error, isConnected };
}
