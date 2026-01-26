import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useIncentives = () => {
    const { data: rewardsData, isLoading, error } = useQuery({
        queryKey: ['my-rewards'],
        queryFn: async () => {
            const res = await api.get('/incentives/my-rewards');
            return res.data;
        },
    });

    return {
        balance: rewardsData?.balance || 0,
        rewards: rewardsData?.rewards || [],
        isLoading,
        error,
    };
};
