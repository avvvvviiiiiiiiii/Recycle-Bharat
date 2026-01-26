import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export const useCollector = () => {
    const queryClient = useQueryClient();

    // Fetch Assigned Pickups
    const { data: assignments, isLoading } = useQuery({
        queryKey: ['assigned-pickups'],
        queryFn: async () => {
            const res = await api.get('/devices/assigned');
            return res.data;
        },
    });

    // Fetch Completed Jobs
    const { data: history, isLoading: isLoadingHistory } = useQuery({
        queryKey: ['collector-history'],
        queryFn: async () => {
            const res = await api.get('/devices/collector-history');
            return res.data;
        },
        refetchInterval: 5000,
    });

    // Confirm Pickup
    const pickupMutation = useMutation({
        mutationFn: async ({ deviceId, duc }) => {
            const res = await api.patch(`/devices/${deviceId}/status`, {
                status: 'COLLECTED',
                duc
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries();
        },
    });

    // Confirm Delivery
    const deliveryMutation = useMutation({
        mutationFn: async ({ deviceId, duc }) => {
            const res = await api.patch(`/devices/${deviceId}/status`, {
                status: 'DELIVERED_TO_RECYCLER',
                duc
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries();
        },
    });

    return {
        assignments,
        history: history || [],
        isLoading: isLoading || isLoadingHistory,
        confirmPickup: pickupMutation.mutateAsync,
        confirmDelivery: deliveryMutation.mutateAsync,
        isProcessing: pickupMutation.isPending || deliveryMutation.isPending
    };
};
