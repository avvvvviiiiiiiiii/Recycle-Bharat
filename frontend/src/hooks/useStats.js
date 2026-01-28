import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export const useStats = ({ dateRange, region } = {}) => {
    const { data: stats, isLoading, error } = useQuery({
        queryKey: ['govt-stats', { dateRange, region }],
        queryFn: async () => {
            const res = await api.get('/analytics/overview', {
                params: {
                    period: dateRange,
                    region: region
                }
            });
            return res.data;
        },
    });

    return {
        stats,
        isLoading,
        error
    };
};
