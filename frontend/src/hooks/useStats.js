import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export const useStats = () => {
    const { data: stats, isLoading, error } = useQuery({
        queryKey: ['govt-stats'],
        queryFn: async () => {
            const res = await api.get('/analytics/overview');
            return res.data;
        },
    });

    return {
        stats,
        isLoading,
        error
    };
};
