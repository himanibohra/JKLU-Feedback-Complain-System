import React, { useState, useEffect } from 'react';
import { X, Building2 } from 'lucide-react';
import { apiClient } from '@/api/client';
import toast from 'react-hot-toast';

interface Category {
    id: number;
    name: string;
    department_id: number;
}

interface DepartmentSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const DepartmentSelectionModal: React.FC<DepartmentSelectionModalProps> = ({
    isOpen,
    onClose,
    onSuccess
}) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingCategories, setIsFetchingCategories] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    const fetchCategories = async () => {
        try {
            setIsFetchingCategories(true);
            const response = await apiClient.get('/complaints/categories');

            // Map category names for cleaner display
            const displayCategories = response.data.map((cat: Category) => ({
                ...cat,
                displayName: cat.name === 'Clubs & Societies' ? 'Clubs' :
                    cat.name === 'Events & campus activities' ? 'Events' :
                        cat.name === 'IT & Technical problems' ? 'IT' :
                            cat.name === 'Admin' ? 'Administration' :
                                cat.name
            }));

            setCategories(displayCategories);
        } catch (error: any) {
            toast.error('Failed to load categories');
            console.error('Error fetching categories:', error);
        } finally {
            setIsFetchingCategories(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedCategory) {
            toast.error('Please select a category');
            return;
        }

        setIsLoading(true);
        try {
            // Find the selected category to get its department_id
            const category = categories.find(cat => cat.id === selectedCategory);

            if (!category) {
                toast.error('Invalid category selected');
                return;
            }

            // Update user's department based on the category's department
            await apiClient.put(`/auth/update-department`, {
                department_id: category.department_id
            });

            toast.success('Department assigned successfully!');
            onSuccess();
        } catch (error: any) {
            toast.error(error.response?.data?.msg || 'Failed to assign department');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                >
                    <X size={24} />
                </button>

                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Building2 className="text-orange-600" size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Select Your Department
                        </h2>
                    </div>
                    <p className="text-gray-600 text-sm">
                        As a department head, please select which department/category you will manage.
                    </p>
                </div>

                {isFetchingCategories ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Department Category
                            </label>
                            {/* 2-Column Grid Layout */}
                            <div className="grid grid-cols-2 gap-3">
                                {categories.map((category) => (
                                    <label
                                        key={category.id}
                                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedCategory === category.id
                                                ? 'border-orange-500 bg-orange-50'
                                                : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="category"
                                            value={category.id}
                                            checked={selectedCategory === category.id}
                                            onChange={() => setSelectedCategory(category.id)}
                                            className="w-4 h-4 text-orange-600 focus:ring-orange-500 flex-shrink-0"
                                        />
                                        <span className="ml-3 text-gray-900 font-medium text-sm">
                                            {(category as any).displayName || category.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || !selectedCategory}
                                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Saving...' : 'Continue'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
