import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/client';
import {
    Complaint,
    ComplaintDetail,
    ComplaintFormData,
    ComplaintFilters,
    PaginatedResponse,
    ComplaintStatus,
} from '@/types';
import toast from 'react-hot-toast';

// Fetch complaints with filters and pagination
export const useComplaints = (filters: ComplaintFilters = {}) => {
    return useQuery({
        queryKey: ['complaints', filters],
        queryFn: async () => {
            console.log('=== FRONTEND: Fetching complaints ===');
            console.log('Filters:', filters);

            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    params.append(key, String(value));
                }
            });

            const url = `/complaints?${params.toString()}`;
            console.log('Request URL:', url);

            const response = await apiClient.get<PaginatedResponse<Complaint>>(url);
            console.log('Complaints received:', response.data);
            console.log('Total complaints:', response.data.pagination?.total || response.data.data?.length || 0);

            return response.data;
        },
    });
};

// Fetch single complaint detail
export const useComplaint = (id: string) => {
    return useQuery({
        queryKey: ['complaint', id],
        queryFn: async () => {
            const response = await apiClient.get<ComplaintDetail>(`/complaints/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
};

// Create complaint
export const useCreateComplaint = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ComplaintFormData & { attachments?: File[] }) => {
            console.log('=== FRONTEND: Creating complaint ===');
            console.log('Data:', data);

            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('category_id', data.categoryId);
            formData.append('location', data.location);
            formData.append('priority', data.priority);
            formData.append('is_anonymous', String(data.isAnonymous));

            if (data.attachments) {
                console.log('Attaching files:', data.attachments.length);
                data.attachments.forEach((file) => {
                    formData.append('attachments', file);
                });
            }

            console.log('Sending request to /complaints');
            const response = await apiClient.post<Complaint>('/complaints', formData);
            console.log('Response received:', response.data);
            return response.data;
        },
        onSuccess: (data) => {
            console.log('=== FRONTEND: Complaint created successfully ===', data);
            queryClient.invalidateQueries({ queryKey: ['complaints'] });
            toast.success('Complaint submitted successfully!');
        },
        onError: (error: any) => {
            console.error('=== FRONTEND: Error creating complaint ===');
            console.error('Error:', error);
            console.error('Response:', error.response?.data);
            toast.error(error.response?.data?.error || 'Failed to create complaint');
        },
    });
};

// Update complaint status
export const useUpdateComplaintStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, status, note }: { id: string; status: ComplaintStatus; note?: string }) => {
            const response = await apiClient.put(`/complaints/${id}/status`, { status, note });
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['complaint', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['complaints'] });
            toast.success('Status updated successfully!');
        },
    });
};

// Add comment to complaint
export const useAddComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            complaintId,
            content,
            attachments
        }: {
            complaintId: string;
            content: string;
            attachments?: File[]
        }) => {
            const formData = new FormData();
            formData.append('content', content);

            if (attachments) {
                attachments.forEach((file) => {
                    formData.append('attachments', file);
                });
            }

            const response = await apiClient.post(
                `/complaints/${complaintId}/comments`,
                formData
            );
            return response.data;
        },
        onSuccess: (_, variables) => {
            // Optimistic update
            queryClient.invalidateQueries({ queryKey: ['complaint', variables.complaintId] });
            toast.success('Comment added successfully!');
        },
        onError: (error: any) => {
            console.error('=== FRONTEND: Error adding comment ===');
            console.error('Error:', error);
            console.error('Response:', error.response?.data);
            toast.error(error.response?.data?.error || 'Failed to add comment');
        },
    });
};

// Update comment
export const useUpdateComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, content, complaintId }: { id: string; content: string; complaintId: string }) => {
            const response = await apiClient.put(`/comments/${id}`, { comment_text: content });
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['complaint', variables.complaintId] });
            toast.success('Comment updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.msg || 'Failed to update comment');
        },
    });
};

// Delete comment
export const useDeleteComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, complaintId }: { id: string; complaintId: string }) => {
            await apiClient.delete(`/comments/${id}`);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['complaint', variables.complaintId] });
            toast.success('Comment deleted successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.msg || 'Failed to delete comment');
        },
    });
};

// Upload attachment to complaint
export const useUploadAttachment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ complaintId, files }: { complaintId: string; files: File[] }) => {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append('attachments', file);
            });

            const response = await apiClient.post(
                `/complaints/${complaintId}/attachments`,
                formData
            );
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['complaint', variables.complaintId] });
            toast.success('Attachment uploaded successfully!');
        },
        onError: (error: any) => {
            console.error('=== FRONTEND: Error uploading attachment ===');
            console.error('Error:', error);
            console.error('Response:', error.response?.data);
            toast.error(error.response?.data?.error || 'Failed to upload attachment');
        },
    });
};

// Delete complaint (admin only)
export const useDeleteComplaint = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/complaints/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['complaints'] });
            toast.success('Complaint deleted successfully!');
        },
    });
};
