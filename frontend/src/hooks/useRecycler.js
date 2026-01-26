import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export const useRecycler = () => {
    const queryClient = useQueryClient();

    // Fetch Requests (Devices with state RECYCLING_REQUESTED)
    // For MVP, we might fetch all devices and filter, or a specific endpoint.
    // Backend support: generic fetch or filtered. Let's assume we need to filter or backend adds endpoint.
    // Currently backend `DeviceController.getMyDevices` is for owner.
    // **We need a new endpoint** for Recycler to see all requests?
    // Wait, I didn't add that in Phase 1 backend.
    // Phase 1 backend has `DeviceService.getUserDevices` but no "get all requests".
    // I need to add that to the backend first? Or does Phase 2 plan include it?
    // Plan says: "Recycler views incoming requests".
    // I should PROBABLY add a backend endpoint `GET /api/devices/requests`.

    // Let's Stub the hook to fetch, and I'll update the backend in the next steps if needed, 
    // or use `getMyDevices` if I register the Recycler as the temporary owner? (No, that's not right).

    // I will add `GET /api/devices/pending` to the Backend in this same Phase 2 work since I control the full stack.

    const { data: requests, isLoading } = useQuery({
        queryKey: ['recycling-requests'],
        queryFn: async () => {
            const res = await api.get('/devices/pending');
            return res.data;
        },
    });

    const { data: collectors, isLoading: isLoadingCollectors } = useQuery({
        queryKey: ['collectors'],
        queryFn: async () => {
            const res = await api.get('/auth/collectors');
            return res.data;
        },
    });

    const { data: assigned, isLoading: isLoadingAssigned } = useQuery({
        queryKey: ['assigned-pickups'],
        queryFn: async () => {
            const res = await api.get('/devices/assigned');
            return res.data;
        },
    });

    const { data: deliveries, isLoading: isLoadingDeliveries } = useQuery({
        queryKey: ['incoming-deliveries'],
        queryFn: async () => {
            const res = await api.get('/devices/deliveries');
            return res.data;
        },
    });

    const { data: inventory, isLoading: isLoadingInventory } = useQuery({
        queryKey: ['recycler-inventory'],
        queryFn: async () => {
            const res = await api.get('/devices/inventory');
            return res.data;
        },
    });

    // Assign Collector
    const assignCollectorMutation = useMutation({
        mutationFn: async ({ deviceId, collectorId }) => {
            const res = await api.patch(`/devices/${deviceId}/status`, {
                status: 'COLLECTOR_ASSIGNED',
                collectorId
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries();
        },
    });

    // Confirm Delivery (Recycler perspective)
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

    // Mark as RECYCLED (Final Step)
    const recycleMutation = useMutation({
        mutationFn: async (deviceId) => {
            const res = await api.patch(`/devices/${deviceId}/status`, {
                status: 'RECYCLED'
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries();
        },
    });

    return {
        requests,
        assigned,
        deliveries: deliveries || [],
        inventory: inventory || [],
        collectors: collectors || [],
        isLoading: isLoading || isLoadingCollectors || isLoadingAssigned || isLoadingDeliveries || isLoadingInventory,
        assignCollector: assignCollectorMutation.mutateAsync,
        isAssigning: assignCollectorMutation.isPending,
        confirmDelivery: deliveryMutation.mutateAsync,
        isDelivering: deliveryMutation.isPending,
        markRecycled: recycleMutation.mutateAsync,
        isRecycling: recycleMutation.isPending
    };
};
