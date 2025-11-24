import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventFeedbackSchema, EventFeedbackFormData } from '@/utils/validation';
import { useSubmitEventFeedback } from '@/hooks/useFeedback';
import { MainLayout } from '@/components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';

export const EventFeedbackPage: React.FC = () => {
    const navigate = useNavigate();
    const { mutate: submitFeedback, isPending } = useSubmitEventFeedback();

    const { register, handleSubmit, formState: { errors }, reset } = useForm<EventFeedbackFormData>({
        resolver: zodResolver(eventFeedbackSchema),
        defaultValues: {
            rating: 3,
            isAnonymous: false,
        },
    });

    const onSubmit = (data: EventFeedbackFormData) => {
        submitFeedback(data, {
            onSuccess: () => {
                reset();
                navigate('/dashboard');
            },
        });
    };

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto min-h-[calc(100vh-8rem)] bg-gradient-to-br from-orange-100 via-orange-100 to-blue-200 p-6 rounded-xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Event Feedback</h1>
                    <p className="text-gray-600 mt-2">Share your experience about a recent event</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-2">
                                Event Name *
                            </label>
                            <input
                                id="eventName"
                                type="text"
                                {...register('eventName')}
                                className="input"
                                placeholder="e.g., Tech Fest 2024"
                            />
                            {errors.eventName && (
                                <p className="text-red-500 text-sm mt-1">{errors.eventName.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-2">
                                Event Date *
                            </label>
                            <input
                                id="eventDate"
                                type="date"
                                {...register('eventDate')}
                                className="input"
                            />
                            {errors.eventDate && (
                                <p className="text-red-500 text-sm mt-1">{errors.eventDate.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                            Your Feedback *
                        </label>
                        <textarea
                            id="content"
                            {...register('content')}
                            rows={6}
                            className="input resize-none"
                            placeholder="Share your thoughts about the event..."
                        />
                        {errors.content && (
                            <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                            Rating (Optional)
                        </label>
                        <div className="flex gap-2 items-center">
                            <input
                                id="rating"
                                type="range"
                                min="1"
                                max="5"
                                {...register('rating', { valueAsNumber: true })}
                                className="flex-1"
                            />
                            <span className="text-lg font-semibold text-primary-600 w-12 text-center">
                                {register('rating').value || 3}/5
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...register('isAnonymous')}
                                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-700">Submit anonymously</span>
                        </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="btn btn-primary flex-1"
                        >
                            {isPending ? 'Submitting...' : 'Submit Feedback'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
};
