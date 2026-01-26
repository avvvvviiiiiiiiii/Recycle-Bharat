import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useActivity = () => {
    const { data: activities, isLoading, error } = useQuery({
        queryKey: ['my-activity'],
        queryFn: async () => {
            const res = await api.get('/audit/my-activity');
            return res.data;
        },
        refetchInterval: 5000, // Live ledger updates every 5s
    });

    return {
        activities: activities || [],
        isLoading,
        error,
    };
};
