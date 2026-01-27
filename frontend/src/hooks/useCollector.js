import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export const useCollector = () => {
    const queryClient = useQueryClient();

    // Fetch Assigned Pickups
    const { data: assignments, isLoading: isAssignmentsLoading, error: assignmentsError } = useQuery({
        queryKey: ['collector-assignments'],
        queryFn: async () => {
            const res = await api.get('/collector/assignments');
            return res.data.map(a => ({
                _id: a.id,
                ...a,
                model: a.model,
                description: `${a.brand} ${a.device_type}`,
                uid: a.device_uid || 'REGULATED',
                ownerId: { email: a.pickup_address }
            }));
        },
    });

    // Fetch History
    const { data: history, isLoading: isHistoryLoading, error: historyError } = useQuery({
        queryKey: ['collector-history'],
        queryFn: async () => {
            const res = await api.get('/collector/history');
            return res.data.map(a => ({
                _id: a.id,
                ...a,
                model: a.model,
                uid: a.device_uid || 'REGULATED',
                currentDuc: a.current_duc,
                updatedAt: a.actual_pickup_time || new Date().toISOString()
            }));
        },
    });

    // Confirm Pickup
    const pickupMutation = useMutation({
        mutationFn: async ({ assignmentId, verification_metadata }) => {
            const res = await api.post(`/collector/assignments/${assignmentId}/pickup`, { verification_metadata });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['collector-assignments'] });
            queryClient.invalidateQueries({ queryKey: ['collector-history'] });
        },
    });

    // Confirm Delivery
    const deliverMutation = useMutation({
        mutationFn: async (assignmentId) => {
            const res = await api.post(`/collector/assignments/${assignmentId}/deliver`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['collector-assignments'] });
            queryClient.invalidateQueries({ queryKey: ['collector-history'] });
        },
    });

    return {
        assignments: assignments || [],
        history: history || [],
        isLoading: isAssignmentsLoading || isHistoryLoading,
        isAssignmentsLoading,
        isHistoryLoading,
        error: assignmentsError || historyError || null,
        confirmPickup: pickupMutation.mutateAsync,
        confirmDelivery: deliverMutation.mutateAsync,
        isProcessing: pickupMutation.isPending || deliverMutation.isPending
    };
};
