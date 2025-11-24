import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/client';
import { Feedback, GeneralFeedbackFormData, EventFeedbackFormData } from '@/types';
import toast from 'react-hot-toast';

// Fetch general feedback
export const useFeedback = () => {
    return useQuery({
        queryKey: ['feedback'],
        queryFn: async () => {
            const response = await apiClient.get<Feedback[]>('/feedback');
            return response.data;
        },
    });
};

// Submit general feedback
export const useSubmitFeedback = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: GeneralFeedbackFormData) => {
            const payload = {
                category_id: data.categoryId,
                feedback_text: data.content,
                rating: data.rating,
                is_anonymous: data.isAnonymous
            };
            const response = await apiClient.post<Feedback>('/feedback', payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['feedback'] });
            toast.success('Feedback submitted successfully!');
        },
    });
};

// Fetch events list
export const useEvents = () => {
    return useQuery({
        queryKey: ['events'],
        queryFn: async () => {
            const response = await apiClient.get<any[]>('/event-feedback');
            // Backend returns list of events
            return response.data;
        },
    });
};

// Submit event feedback
export const useSubmitEventFeedback = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: EventFeedbackFormData) => {
            const payload = {
                event_id: data.eventId,
                feedback_text: data.content,
                rating: data.rating,
                is_anonymous: data.isAnonymous
            };
            const response = await apiClient.post<Feedback>('/event-feedback', payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['event-feedback'] });
            toast.success('Event feedback submitted successfully!');
        },
    });
};
