import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export const useReports = () => {
    return useQuery({
        queryKey: ['govt-reports'],
        queryFn: async () => {
            const res = await api.get('/analytics/reports');
            return res.data;
        },
        refetchInterval: 5000
    });
};
