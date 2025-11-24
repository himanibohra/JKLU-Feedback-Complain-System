import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/client';
import { Department, DepartmentFormData } from '@/utils/validation';
import toast from 'react-hot-toast';

// Fetch all departments
export const useDepartments = () => {
    return useQuery({
        queryKey: ['departments'],
        queryFn: async () => {
            const response = await apiClient.get<Department[]>('/departments');
            return response.data;
        },
    });
};

// Fetch single department
export const useDepartment = (id: string) => {
    return useQuery({
        queryKey: ['department', id],
        queryFn: async () => {
            const response = await apiClient.get<Department>(`/departments/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
};

// Create department
export const useCreateDepartment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: DepartmentFormData) => {
            const response = await apiClient.post<Department>('/departments', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            toast.success('Department created successfully!');
        },
    });
};

// Update department
export const useUpdateDepartment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: DepartmentFormData }) => {
            const response = await apiClient.put<Department>(`/departments/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            toast.success('Department updated successfully!');
        },
    });
};

// Delete department
export const useDeleteDepartment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/departments/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            toast.success('Department deleted successfully!');
        },
    });
};
