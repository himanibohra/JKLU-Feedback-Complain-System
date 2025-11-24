import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generalFeedbackSchema, GeneralFeedbackFormData, EventFeedbackFormData } from '@/utils/validation';
import { useSubmitFeedback, useSubmitEventFeedback, useEvents } from '@/hooks/useFeedback';
import { useCategories } from '@/hooks/useCategories';
import { MainLayout } from '@/components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, Users, BookOpen } from 'lucide-react';

type FeedbackType = 'academic' | 'event' | 'club' | null;

export const FeedbackPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedType, setSelectedType] = useState<FeedbackType>(null);

    // Hooks
    const { mutate: submitGeneralFeedback, isPending: isGeneralPending } = useSubmitFeedback();
    const { mutate: submitEventFeedback, isPending: isEventPending } = useSubmitEventFeedback();
    const { data: categories } = useCategories();
    const { data: events } = useEvents();

    // Forms
    const generalForm = useForm<GeneralFeedbackFormData>({
        resolver: zodResolver(generalFeedbackSchema),
        defaultValues: { rating: 3, isAnonymous: false, categoryId: '' },
    });

    const eventForm = useForm<EventFeedbackFormData>({
        defaultValues: { rating: 3, isAnonymous: false, eventId: '' },
    });

    const handleGeneralSubmit = (data: GeneralFeedbackFormData) => {
        submitGeneralFeedback(data, {
            onSuccess: () => {
                generalForm.reset();
                setSelectedType(null);
                navigate('/dashboard');
            },
        });
    };

    const handleEventSubmit = (data: EventFeedbackFormData) => {
        submitEventFeedback(data, {
            onSuccess: () => {
                eventForm.reset();
                setSelectedType(null);
                navigate('/dashboard');
            },
        });
    };

    const CLUB_ROLES = [
        'Technology Chair',
        'Robotics Chair',
        'Astro Chair',
        'Design Chair',
        'Business Chair',
        'CP Chair',
        'Dance Chair',
        'Drama Chair',
        'Music Chair',
        'Art Chair',
        'Media Chair',
        'Literary Chair',
        'CDC Chair',
        'Photography Chair'
    ];

    const renderSelectionCards = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Academic Card */}
            <div
                onClick={() => setSelectedType('academic')}
                className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer transform transition-all hover:-translate-y-2 hover:shadow-xl bg-white"
            >
                <div className="h-48 overflow-hidden">
                    <img
                        src="/academic-card.png"
                        alt="Academic Feedback"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-5 h-5 text-blue-300" />
                        <h3 className="text-xl font-bold">Academic</h3>
                    </div>
                    <p className="text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Feedback on courses, faculty, and curriculum.
                    </p>
                </div>
            </div>

            {/* Event Card */}
            <div
                onClick={() => setSelectedType('event')}
                className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer transform transition-all hover:-translate-y-2 hover:shadow-xl bg-white"
            >
                <div className="h-48 overflow-hidden">
                    <img
                        src="/event-card.png"
                        alt="Event Feedback"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-orange-300" />
                        <h3 className="text-xl font-bold">Events</h3>
                    </div>
                    <p className="text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Share your experience about recent campus events.
                    </p>
                </div>
            </div>

            {/* Club Card */}
            <div
                onClick={() => setSelectedType('club')}
                className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer transform transition-all hover:-translate-y-2 hover:shadow-xl bg-white"
            >
                <div className="h-48 overflow-hidden">
                    <img
                        src="/club-card.png"
                        alt="Club Feedback"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-green-300" />
                        <h3 className="text-xl font-bold">Clubs</h3>
                    </div>
                    <p className="text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Feedback for student clubs and activities.
                    </p>
                </div>
            </div>
        </div>
    );

    const renderForm = () => {
        const isEvent = selectedType === 'event';
        const isClub = selectedType === 'club';
        const title = selectedType === 'academic' ? 'Academic Feedback' : isEvent ? 'Event Feedback' : 'Club Feedback';
        const subtitle = isEvent
            ? 'Rate and review campus events'
            : selectedType === 'academic'
                ? 'Help us improve academic standards'
                : 'Suggestions for student clubs and committees';

        return (
            <div className="max-w-2xl mx-auto animate-fadeIn min-h-[calc(100vh-8rem)] bg-gradient-to-br from-orange-100 via-orange-100 to-blue-200 p-6 rounded-xl">
                <button
                    onClick={() => setSelectedType(null)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Categories</span>
                </button>

                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
                    <p className="text-gray-600 mt-2">{subtitle}</p>
                </div>

                {isEvent ? (
                    <form onSubmit={eventForm.handleSubmit(handleEventSubmit)} className="card space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Event *</label>
                            <select
                                {...eventForm.register('eventId', { required: 'Please select an event' })}
                                className="input"
                            >
                                <option value="">Select an event...</option>
                                {events?.map((event: any) => (
                                    <option key={event.event_id} value={event.event_id}>
                                        {event.event_name}
                                    </option>
                                ))}
                            </select>
                            {eventForm.formState.errors.eventId && (
                                <p className="text-red-500 text-sm mt-1">{eventForm.formState.errors.eventId.message}</p>
                            )}
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                            <div className="flex gap-2 items-center">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => eventForm.setValue('rating', star)}
                                            className={`p-1 transition-colors ${(eventForm.watch('rating') || 0) >= star ? 'text-yellow-400' : 'text-gray-300'
                                                }`}
                                        >
                                            <Star fill="currentColor" size={24} />
                                        </button>
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500 ml-2">
                                    {eventForm.watch('rating')}/5
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Feedback *</label>
                            <textarea
                                {...eventForm.register('content', { required: 'Feedback is required' })}
                                rows={5}
                                className="input resize-none"
                                placeholder="Share your experience..."
                            />
                            {eventForm.formState.errors.content && (
                                <p className="text-red-500 text-sm mt-1">{eventForm.formState.errors.content.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    {...eventForm.register('isAnonymous')}
                                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                                />
                                <span className="text-sm text-gray-700">Submit anonymously</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isEventPending}
                            className="btn btn-primary w-full"
                        >
                            {isEventPending ? 'Submitting...' : 'Submit Feedback'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={generalForm.handleSubmit((data) => {
                        // For clubs, we need to find a valid category ID
                        if (isClub) {
                            const clubName = data.categoryId; // Capture selected club name
                            data.content = `[${clubName}] ${data.content}`;

                            // Find real category ID
                            const realClubCategory = categories?.find(c =>
                                c.name.toLowerCase().includes('club') ||
                                c.name.toLowerCase().includes('activity') ||
                                c.name.toLowerCase().includes('extra')
                            );

                            if (realClubCategory) {
                                data.categoryId = realClubCategory.id;
                            } else if (categories && categories.length > 0) {
                                data.categoryId = categories[0].id;
                            }
                        }
                        handleGeneralSubmit(data);
                    })} className="card space-y-6">

                        {/* Category Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {isClub ? 'Select Club / Chair *' : 'Category *'}
                            </label>

                            {isClub ? (
                                <select
                                    {...generalForm.register('categoryId', { required: 'Please select a club/chair' })}
                                    className="input"
                                >
                                    <option value="">Select a club...</option>
                                    {CLUB_ROLES.map((role) => (
                                        <option key={role} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <select
                                    {...generalForm.register('categoryId', { required: 'Please select a category' })}
                                    className="input"
                                >
                                    <option value="">Select a category...</option>
                                    {categories?.filter(cat => {
                                        if (selectedType === 'academic') {
                                            return ['academic', 'course', 'faculty', 'exam', 'library'].some(k =>
                                                cat.name.toLowerCase().includes(k) ||
                                                (cat.description && cat.description.toLowerCase().includes(k))
                                            );
                                        }
                                        return true;
                                    }).map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            )}

                            {generalForm.formState.errors.categoryId && (
                                <p className="text-red-500 text-sm mt-1">{generalForm.formState.errors.categoryId.message}</p>
                            )}
                            {!isClub && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Can't find what you're looking for? Select "Other" or contact admin.
                                </p>
                            )}
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rating (Optional)</label>
                            <div className="flex gap-2 items-center">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => generalForm.setValue('rating', star)}
                                            className={`p-1 transition-colors ${(generalForm.watch('rating') || 0) >= star ? 'text-yellow-400' : 'text-gray-300'
                                                }`}
                                        >
                                            <Star fill="currentColor" size={24} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Feedback *</label>
                            <textarea
                                {...generalForm.register('content')}
                                rows={5}
                                className="input resize-none"
                                placeholder="Tell us what you think..."
                            />
                            {generalForm.formState.errors.content && (
                                <p className="text-red-500 text-sm mt-1">{generalForm.formState.errors.content.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    {...generalForm.register('isAnonymous')}
                                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                                />
                                <span className="text-sm text-gray-700">Submit anonymously</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isGeneralPending}
                            className="btn btn-primary w-full"
                        >
                            {isGeneralPending ? 'Submitting...' : 'Submit Feedback'}
                        </button>
                    </form>
                )}
            </div>
        );
    };

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8">
                {!selectedType && (
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">We Value Your Feedback</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Help us improve your campus experience. Select a category below to get started.
                        </p>
                    </div>
                )}

                {selectedType ? renderForm() : renderSelectionCards()}
            </div>
        </MainLayout>
    );
};
