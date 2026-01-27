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

            // Map Assigned Dispatches
            const assigned = (d.assigned || []).map(dev => ({
                _id: dev.id,
                model: dev.model,
                uid: dev.device_uid,
                description: dev.description,
                status: dev.current_state,
                collectorId: { displayName: dev.collector_name, email: dev.collector_email },
                updatedAt: dev.updated_at
            }));

            return { requests, deliveries, inventory, collectors, assigned };
        },
    });

    // Destructure for consumption
    const { requests, deliveries, inventory, collectors, assigned } = dashboardData || { requests: [], deliveries: [], inventory: [], collectors: [], assigned: [] };

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

    // Verify Handover (COLLECTED -> DELIVERED_TO_RECYCLER)
    const deliverMutation = useMutation({
        mutationFn: async ({ deviceId, duc }) => {
            const res = await api.post(`/recycling/devices/${deviceId}/handover`, { duc });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['recycler-dashboard']);
        },
    });

    // Mark Recycled
    const completeMutation = useMutation({
        mutationFn: async ({ deviceId, proofMetadata }) => {
            const res = await api.post(`/recycling/devices/${deviceId}/complete`, { proof_metadata: proofMetadata });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['recycler-dashboard']);
        },
    });

    return {
        requests,
        deliveries,
        inventory,
        collectors,
        assigned,
        isLoading,
        error,
        assignCollector: assignMutation.mutateAsync,
        isAssigning: assignMutation.isPending,
        confirmDelivery: deliverMutation.mutateAsync,
        isDelivering: deliverMutation.isPending,
        markRecycled: completeMutation.mutateAsync,
        isRecycling: completeMutation.isPending,
    };
};
