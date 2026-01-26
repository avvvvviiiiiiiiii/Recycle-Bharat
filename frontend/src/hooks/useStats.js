import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useStats = () => {
    const { data: stats, isLoading, error } = useQuery({
        queryKey: ['system-stats'],
        queryFn: async () => {
            const res = await api.get('/stats');
            return res.data;
        },
        refetchInterval: 30000, // Refresh every 30 seconds
    });

    return {
        stats,
        isLoading,
        error,
    };
};
