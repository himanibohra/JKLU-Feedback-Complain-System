import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/client';
import {
    AnalyticsSummary,
    DepartmentAnalytics,
    CategoryAnalytics,
    PriorityAnalytics,
    TimelineAnalytics,
} from '@/types';

// Fetch analytics summary
export const useAnalyticsSummary = () => {
    return useQuery({
        queryKey: ['analytics', 'summary'],
        queryFn: async () => {
            const response = await apiClient.get<AnalyticsSummary>('/analytics/summary');
            return response.data;
        },
    });
};

// Fetch department analytics
export const useDepartmentAnalytics = () => {
    return useQuery({
        queryKey: ['analytics', 'department'],
        queryFn: async () => {
            const response = await apiClient.get<DepartmentAnalytics[]>('/analytics/department');
            return response.data;
        },
    });
};

// Fetch category analytics
export const useCategoryAnalytics = () => {
    return useQuery({
        queryKey: ['analytics', 'category'],
        queryFn: async () => {
            const response = await apiClient.get<CategoryAnalytics[]>('/analytics/category');
            return response.data;
        },
    });
};

// Fetch priority analytics
export const usePriorityAnalytics = () => {
    return useQuery({
        queryKey: ['analytics', 'priority'],
        queryFn: async () => {
            const response = await apiClient.get<PriorityAnalytics[]>('/analytics/priority');
            return response.data;
        },
    });
};

// Fetch timeline analytics
export const useTimelineAnalytics = (days: number = 30) => {
    return useQuery({
        queryKey: ['analytics', 'timeline', days],
        queryFn: async () => {
            const response = await apiClient.get<TimelineAnalytics[]>(
                `/analytics/timeline?days=${days}`
            );
            return response.data;
        },
    });
};

// Export complaints to CSV
export const exportComplaints = async (filters?: Record<string, string>) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`/export/complaints?${params.toString()}`, {
        responseType: 'blob',
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `complaints_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
};
