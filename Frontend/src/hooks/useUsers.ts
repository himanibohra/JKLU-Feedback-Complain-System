import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/client';
import { User } from '@/types';
import { UserFormData } from '@/utils/validation';
import toast from 'react-hot-toast';

// Fetch all users
export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await apiClient.get<User[]>('/users');
            return response.data;
        },
    });
};

// Fetch single user
export const useUser = (id: string) => {
    return useQuery({
        queryKey: ['user', id],
        queryFn: async () => {
            const response = await apiClient.get<User>(`/users/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
};

// Create user
export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: UserFormData) => {
            const response = await apiClient.post<User>('/users', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('User created successfully!');
        },
    });
};

// Update user
export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UserFormData }) => {
            const response = await apiClient.put<User>(`/users/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('User updated successfully!');
        },
    });
};

// Delete user
export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/users/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('User deleted successfully!');
        },
    });
};
