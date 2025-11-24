import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useComplaints } from '@/hooks/useComplaints';
import { useCategories } from '@/hooks/useCategories';
import { ComplaintList } from '@/components/complaints/ComplaintList';
import { ComplaintDetailModal } from '@/components/complaints/ComplaintDetailModal';
import { Pagination } from '@/components/common/Pagination';
import { DateRangePicker } from '@/components/common/DateRangePicker';
import { ComplaintFilters, ComplaintStatus, ComplaintPriority } from '@/types';
import { Search, Filter } from 'lucide-react';

export const ComplaintListPage: React.FC = () => {
    const [filters, setFilters] = useState<ComplaintFilters>({
        page: 1,
        limit: 9,
    });
    const [showFilters, setShowFilters] = useState(false);
    const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);

    const { data: complaintsData, isLoading } = useComplaints(filters);
    const { data: categories = [] } = useCategories();

    const handleFilterChange = (key: keyof ComplaintFilters, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    const clearFilters = () => {
        setFilters({ page: 1, limit: 9 });
    };

    const handleViewDetail = (id: string) => {
        console.log('Opening complaint detail for id:', id);
        setSelectedComplaintId(id);
    };

    const handleCloseModal = () => {
        setSelectedComplaintId(null);
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Complaints</h1>
                        <p className="text-gray-600 mt-2">
                            {complaintsData?.pagination.total || 0} total complaints
                        </p>
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="btn btn-secondary flex items-center gap-2"
                    >
                        <Filter size={20} />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                </div>

                {showFilters && (
                    <div className="card bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Search
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search complaints..."
                                        value={filters.search || ''}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                        className="input pl-10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={filters.category || ''}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    className="input"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={filters.status || ''}
                                    onChange={(e) => handleFilterChange('status', e.target.value as ComplaintStatus)}
                                    className="input"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Priority
                                </label>
                                <select
                                    value={filters.priority || ''}
                                    onChange={(e) => handleFilterChange('priority', e.target.value as ComplaintPriority)}
                                    className="input"
                                >
                                    <option value="">All Priorities</option>
                                    <option value="low">Low</option>
                                    <option value="normal">Normal</option>
                                    <option value="high">High</option>
                                    <option value="critical">Critical</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-4">
                            <DateRangePicker
                                startDate={filters.startDate || ''}
                                endDate={filters.endDate || ''}
                                onStartDateChange={(date) => handleFilterChange('startDate', date)}
                                onEndDateChange={(date) => handleFilterChange('endDate', date)}
                            />
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button onClick={clearFilters} className="btn btn-secondary">
                                Clear Filters
                            </button>
                        </div>
                    </div>
                )}

                <ComplaintList
                    complaints={complaintsData?.data || []}
                    isLoading={isLoading}
                    onViewDetail={handleViewDetail}
                />

                {complaintsData && (
                    <Pagination
                        currentPage={complaintsData.pagination.page}
                        totalPages={complaintsData.pagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                )}

                {selectedComplaintId && (
                    <ComplaintDetailModal
                        complaintId={selectedComplaintId}
                        onClose={handleCloseModal}
                    />
                )}
            </div>
        </MainLayout>
    );
};
