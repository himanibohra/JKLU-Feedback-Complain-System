import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/client';
import { Category } from '@/types';
import { CategoryFormData } from '@/utils/validation';
import toast from 'react-hot-toast';

// Fetch all categories
export const useCategories = (departmentId?: string) => {
    return useQuery({
        queryKey: ['categories', departmentId],
        queryFn: async () => {
            const url = departmentId
                ? `/complaints/categories?departmentId=${departmentId}`
                : '/complaints/categories';
            const response = await apiClient.get<Category[]>(url);
            return response.data;
        },
    });
};

// Fetch single category
export const useCategory = (id: string) => {
    return useQuery({
        queryKey: ['category', id],
        queryFn: async () => {
            const response = await apiClient.get<Category>(`/categories/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
};

// Create category
export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CategoryFormData) => {
            const response = await apiClient.post<Category>('/categories', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category created successfully!');
        },
    });
};

// Update category
export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: CategoryFormData }) => {
            const response = await apiClient.put<Category>(`/categories/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category updated successfully!');
        },
    });
};

// Delete category
export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/categories/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category deleted successfully!');
        },
    });
};
