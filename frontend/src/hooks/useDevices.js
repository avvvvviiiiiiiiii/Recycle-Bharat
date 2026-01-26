import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export const useDevices = () => {
    const queryClient = useQueryClient();

    // Fetch Citizen's Devices
    const { data: devices, isLoading, error } = useQuery({
        queryKey: ['my-devices'],
        queryFn: async () => {
            const res = await api.get('/devices/my-devices');
            return res.data;
        },
    });

    // Register New Device
    const registerMutation = useMutation({
        mutationFn: async (deviceData) => {
            const res = await api.post('/devices/register', deviceData);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['my-devices']);
        },
    });

    // Request Recycle
    const recycleMutation = useMutation({
        mutationFn: async (deviceId) => {
            const res = await api.post(`/devices/${deviceId}/recycle`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['my-devices']);
            queryClient.invalidateQueries(['device']);
        },
    });

    // Reveal DUC
    const revealDucMutation = useMutation({
        mutationFn: async (deviceId) => {
            const res = await api.get(`/devices/${deviceId}/reveal-duc`);
            return res.data;
        },
    });

    return {
        devices,
        isLoading,
        error,
        registerDevice: registerMutation.mutate,
        isRegistering: registerMutation.isPending,
        requestRecycle: recycleMutation.mutate,
        isRecycling: recycleMutation.isPending,
        revealDuc: revealDucMutation.mutateAsync,
        isRevealing: revealDucMutation.isPending,
    };
};

export const useDevice = (id) => {
    return useQuery({
        queryKey: ['device', id],
        queryFn: async () => {
            const res = await api.get(`/devices/${id}`);
            return res.data;
        },
        enabled: !!id
    });
};
