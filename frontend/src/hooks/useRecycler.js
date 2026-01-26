import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export const useRecycler = () => {
    const queryClient = useQueryClient();

    // Fetch Dashboard Data
    const { data: dashboardData, isLoading, error } = useQuery({
        queryKey: ['recycler-dashboard'],
        queryFn: async () => {
            const res = await api.get('/recycling/dashboard');
            const d = res.data;

            // Map Requests
            const requests = d.requests.map(r => ({
                _id: r.id,
                model: r.model,
                uid: r.device_uid,
                ownerId: { email: r.citizen_email },
                createdAt: r.created_at
            }));

            // Map Deliveries
            const deliveries = d.deliveries.map(dev => ({
                _id: dev.id,
                model: dev.model,
                uid: dev.device_uid,
                collectorId: { displayName: dev.collector_name, email: dev.collector_email },
                updatedAt: dev.picked_at
            }));

            // Map Inventory
            const inventory = d.inventory.map(dev => ({
                _id: dev.id,
                model: dev.model,
                uid: dev.device_uid,
                collectorId: { displayName: dev.collector_name }
            }));

            // Map Collectors
            const collectors = d.collectors.map(c => ({
                _id: c.id,
                displayName: c.full_name,
                email: c.email
            }));

            return { requests, deliveries, inventory, collectors };
        },
    });

    // Destructure for consumption
    const { requests, deliveries, inventory, collectors } = dashboardData || { requests: [], deliveries: [], inventory: [], collectors: [] };

    // Assign Collector
    const assignMutation = useMutation({
        mutationFn: async ({ requestId, collectorId, scheduledTime }) => {
            const res = await api.post(`/recycling/requests/${requestId}/assign`, {
                collector_id: collectorId,
                scheduled_time: scheduledTime
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['recycler-requests']);
        },
    });

    // Mark Recycled
    const completeMutation = useMutation({
        mutationFn: async ({ deviceId, proofMetadata }) => {
            const res = await api.post(`/recycling/devices/${deviceId}/complete`, { proof_metadata: proofMetadata });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['recycler-requests']);
        },
    });

    return {
        requests,
        deliveries,
        inventory,
        collectors,
        isLoading,
        error,
        assignCollector: assignMutation.mutateAsync,
        isAssigning: assignMutation.isPending,
        completeRecycling: completeMutation.mutateAsync,
        isCompleting: completeMutation.isPending,
    };
};
