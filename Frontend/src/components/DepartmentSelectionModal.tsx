import React, { useState, useEffect } from 'react';
import { X, Building2 } from 'lucide-react';
import { apiClient } from '@/api/client';
import toast from 'react-hot-toast';

interface Department {
    department_id: number;
    name: string;
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
    const [departments, setDepartments] = useState<Department[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingDepartments, setIsFetchingDepartments] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetchDepartments();
        }
    }, [isOpen]);

    const fetchDepartments = async () => {
        try {
            setIsFetchingDepartments(true);
            const response = await apiClient.get('/department');
            setDepartments(response.data);
        } catch (error: any) {
            toast.error('Failed to load departments');
            console.error('Error fetching departments:', error);
        } finally {
            setIsFetchingDepartments(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedDepartment) {
            toast.error('Please select a department');
            return;
        }

        setIsLoading(true);
        try {
            // Update user's department
            await apiClient.put(`/auth/update-department`, {
                department_id: selectedDepartment
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
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
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
                        As a department head, please select which department you will manage.
                    </p>
                </div>

                {isFetchingDepartments ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Department
                            </label>
                            {/* 2-Column Grid Layout */}
                            <div className="grid grid-cols-2 gap-3">
                                {departments.map((dept) => (
                                    <label
                                        key={dept.department_id}
                                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedDepartment === dept.department_id
                                                ? 'border-orange-500 bg-orange-50'
                                                : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="department"
                                            value={dept.department_id}
                                            checked={selectedDepartment === dept.department_id}
                                            onChange={() => setSelectedDepartment(dept.department_id)}
                                            className="w-4 h-4 text-orange-600 focus:ring-orange-500 flex-shrink-0"
                                        />
                                        <span className="ml-3 text-gray-900 font-medium text-sm">
                                            {dept.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3">
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
                                disabled={isLoading || !selectedDepartment}
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
