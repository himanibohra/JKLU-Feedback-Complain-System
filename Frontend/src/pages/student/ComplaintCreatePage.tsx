import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { complaintSchema, ComplaintFormData } from '@/utils/validation';
import { useCreateComplaint } from '@/hooks/useComplaints';
import { useCategories } from '@/hooks/useCategories';
import { MainLayout } from '@/components/layout/MainLayout';
import { FileUpload } from '@/components/common/FileUpload';

export const ComplaintCreatePage: React.FC = () => {
    const navigate = useNavigate();
    const [attachments, setAttachments] = useState<File[]>([]);
    const { mutate: createComplaint, isPending } = useCreateComplaint();
    const { data: categories = [] } = useCategories();

    const { register, handleSubmit, formState: { errors }, reset } = useForm<ComplaintFormData>({
        resolver: zodResolver(complaintSchema),
        defaultValues: {
            priority: 'normal',
            isAnonymous: false,
        },
    });

    const onSubmit = (data: ComplaintFormData) => {
        console.log('Form data:', data);
        console.log('Attachments:', attachments);

        createComplaint(
            { ...data, attachments },
            {
                onSuccess: (response) => {
                    console.log('Complaint created successfully:', response);
                    navigate('/complaints');
                },
                onError: (error: any) => {
                    console.error('Error creating complaint:', error);
                    console.error('Error response:', error.response?.data);
                }
            }
        );
    };

    return (
        <MainLayout>
            <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-orange-100 via-orange-100 to-blue-200 p-6 rounded-xl">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-6 text-center">
                        <h1 className="text-3xl font-bold text-gray-900">Complaint Info Form</h1>
                        <p className="text-gray-700 mt-2 font-medium">Fill out the form below to submit your complaint</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Title *
                            </label>
                            <input
                                id="title"
                                type="text"
                                {...register('title')}
                                className="input"
                                placeholder="Brief description of the issue"
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                id="description"
                                {...register('description')}
                                rows={5}
                                className="input resize-none"
                                placeholder="Provide detailed information about your complaint"
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                                    Category *
                                </label>
                                <select id="categoryId" {...register('categoryId')} className="input">
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.categoryId && (
                                    <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                                    Priority *
                                </label>
                                <select id="priority" {...register('priority')} className="input">
                                    <option value="low">Low</option>
                                    <option value="normal">Normal</option>
                                    <option value="high">High</option>
                                    <option value="critical">Critical</option>
                                </select>
                                {errors.priority && (
                                    <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                Location *
                            </label>
                            <input
                                id="location"
                                type="text"
                                {...register('location')}
                                className="input"
                                placeholder="e.g., Hostel Block A, Classroom, Cafeteria"
                            />
                            {errors.location && (
                                <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    {...register('isAnonymous')}
                                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                                />
                                <span className="text-sm text-gray-700">Submit anonymously</span>
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Attachments (Optional)
                            </label>
                            <FileUpload
                                onFilesSelected={setAttachments}
                                accept="image/*,.pdf"
                                maxFiles={5}
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="btn bg-orange-600 hover:bg-orange-700 text-white flex-1"
                            >
                                {isPending ? 'Submitting...' : 'Submit Complaint'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    reset();
                                    setAttachments([]);
                                }}
                                className="btn bg-gray-100 hover:bg-gray-200 text-gray-700"
                            >
                                Reset
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/complaints')}
                                className="btn bg-gray-100 hover:bg-gray-200 text-gray-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
};
