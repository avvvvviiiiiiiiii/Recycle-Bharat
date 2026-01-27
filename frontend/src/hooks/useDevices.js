import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios'; // Use our configured axios

export const useDevices = () => {
    const queryClient = useQueryClient();

    // Fetch Citizen's Devices
    const { data: devices, isLoading, error } = useQuery({
        queryKey: ['my-devices'],
        queryFn: async () => {
            console.log('[useDevices] Fetching devices...');
            console.log('[useDevices] Current Token in Storage:', localStorage.getItem('token'));

            const res = await api.get('/devices');
            // Map Postgres Data to UI format
            return res.data.map(d => ({
                _id: d.id,
                uid: d.device_uid,
                status: d.current_state,
                model: d.model,
                brand: d.brand,
                description: `${d.brand} ${d.device_type} (${d.purchase_year})`,
                recycleNumber: d.device_uid_origin === 'MANUFACTURER' ? d.device_uid : null,
                isTerminated: d.current_state === 'RECYCLED',
                createdAt: d.created_at
            }));
        },
    });

    // Register New Device
    const registerMutation = useMutation({
        mutationFn: async (deviceData) => {
            const res = await api.post('/devices', deviceData);
            return res.data;
        },
        onSuccess: async () => {
            console.log('[useDevices] Invalidating my-devices after registration...');
            await queryClient.invalidateQueries({ queryKey: ['my-devices'] });
        },
    });

    // Request Recycle
    const recycleMutation = useMutation({
        mutationFn: async ({ deviceId, ...data }) => {
            const res = await api.post(`/devices/${deviceId}/recycle`, data);
            return res.data;
        },
        onSuccess: async () => {
            console.log('[useDevices] Invalidating queries after recycling request...');
            await queryClient.invalidateQueries({ queryKey: ['my-devices'] });
            await queryClient.invalidateQueries({ queryKey: ['device'] });
        },
    });

    return {
        devices,
        isLoading,
        error,
        registerDevice: registerMutation.mutateAsync,
        isRegistering: registerMutation.isPending,
        requestRecycle: recycleMutation.mutateAsync,
        isRecycling: recycleMutation.isPending,
        revealDuc: async (deviceId) => {
            const res = await api.get(`/devices/${deviceId}/duc`);
            return res.data;
        }
    };
};

export const useDevice = (id) => {
    return useQuery({
        queryKey: ['device', id],
        queryFn: async () => {
            const res = await api.get('/devices'); // Fetch all and filter (since GET /:id not implemented yet)
            // Or implement GET /:id api. For now mock filter
            const device = res.data.find(d => d.id === parseInt(id));
            if (!device) throw new Error('Device not found');

            return {
                _id: device.id,
                uid: device.device_uid,
                status: device.current_state,
                model: device.model,
                brand: device.brand,
                device_type: device.device_type,
                description: `${device.brand} ${device.device_type}`,
                purchase_year: device.purchase_year,
                recycleNumber: device.device_uid_origin === 'MANUFACTURER' ? device.device_uid : null,
                createdAt: device.created_at
            };
        },
        enabled: !!id
    });
};
