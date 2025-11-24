import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useComplaints } from '@/hooks/useComplaints';
import { useCategories } from '@/hooks/useCategories';
import { ComplaintList } from '@/components/complaints/ComplaintList';
import { ComplaintDetailModal } from '@/components/complaints/ComplaintDetailModal';
import { Pagination } from '@/components/common/Pagination';
import { DateRangePicker } from '@/components/common/DateRangePicker';
import { ComplaintFilters, ComplaintStatus, ComplaintPriority } from '@/types';
import { Search, Filter, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

export const DepartmentDashboard: React.FC = () => {
    const { user } = useAuth();
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
        setSelectedComplaintId(id);
    };

    const handleCloseModal = () => {
        setSelectedComplaintId(null);
    };

    // Calculate stats from complaints data
    const stats = {
        pending: complaintsData?.data.filter(c => c.status === 'pending').length || 0,
        inProgress: complaintsData?.data.filter(c => c.status === 'in_progress').length || 0,
        resolved: complaintsData?.data.filter(c => c.status === 'resolved').length || 0,
        closed: complaintsData?.data.filter(c => c.status === 'closed').length || 0,
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-orange-50 via-orange-100 to-blue-100 rounded-2xl p-8 shadow-sm border border-orange-200">
                    <div className="flex items-center gap-6">
                        <div className="bg-white p-4 rounded-xl shadow-md">
                            <div className="w-20 h-20 flex items-center justify-center">
                                <img
                                    src="/jklu-logo.png"
                                    alt="JKLU Logo"
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="40" fill="%23f97316"/%3E%3Ctext x="50" y="60" font-size="40" text-anchor="middle" fill="white"%3EJ%3C/text%3E%3C/svg%3E';
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Feedback & Complaint System
                            </h1>
                            <p className="text-gray-700 leading-relaxed">
                                Your voice matters. Submit complaints, track progress, and share feedback. We are
                                committed to continuous improvement and valuing every student's input.
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                                Welcome, <span className="font-semibold">{user?.name}</span> - Department Head
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-yellow-800">Pending</p>
                                <p className="text-3xl font-bold text-yellow-900 mt-2">{stats.pending}</p>
                            </div>
                            <Clock className="w-10 h-10 text-yellow-600" />
                        </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-800">In Progress</p>
                                <p className="text-3xl font-bold text-blue-900 mt-2">{stats.inProgress}</p>
                            </div>
                            <AlertCircle className="w-10 h-10 text-blue-600" />
                        </div>
                    </div>

                    <div className="bg-green-50 p-6 rounded-xl border border-green-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-800">Resolved</p>
                                <p className="text-3xl font-bold text-green-900 mt-2">{stats.resolved}</p>
                            </div>
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-800">Closed</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.closed}</p>
                            </div>
                            <XCircle className="w-10 h-10 text-gray-600" />
                        </div>
                    </div>
                </div>

                {/* Complaints Section */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Department Complaints</h2>
                        <p className="text-gray-600 mt-1">
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
