import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useComplaints } from '@/hooks/useComplaints';
import { DashboardCards } from '@/components/admin/DashboardCards';
import { FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { ComplaintList } from '@/components/complaints/ComplaintList';
import { ComplaintDetailModal } from '@/components/complaints/ComplaintDetailModal';

export const StudentDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
    const { data: complaintsData, isLoading } = useComplaints({ limit: 6 });

    const handleViewDetail = (id: string) => {
        setSelectedComplaintId(id);
    };

    const handleCloseModal = () => {
        setSelectedComplaintId(null);
    };

    const stats = [
        {
            title: 'Total Complaints',
            value: complaintsData?.pagination?.total || 0,
            icon: FileText,
            color: 'blue' as const,
        },
        {
            title: 'Pending',
            value: complaintsData?.data?.filter(c => c.status === 'pending').length || 0,
            icon: Clock,
            color: 'yellow' as const,
        },
        {
            title: 'Resolved',
            value: complaintsData?.data?.filter(c => c.status === 'resolved').length || 0,
            icon: CheckCircle,
            color: 'green' as const,
        },
        {
            title: 'High Priority',
            value: complaintsData?.data?.filter(c => c.priority === 'high').length || 0,
            icon: AlertTriangle,
            color: 'red' as const,
        },
    ];

    return (
        <MainLayout>
            <div className="space-y-8">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-orange-100 to-blue-100 rounded-2xl p-8 shadow-sm border border-white/50">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                            <img
                                src="/JKLU logo.png"
                                alt="JKLU Logo"
                                className="h-32 w-32 object-contain"
                            />
                        </div>
                        <div className="text-center md:text-left space-y-2">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                                Feedback & Complaint System
                            </h1>
                            <p className="text-lg text-gray-600 max-w-2xl">
                                Your voice matters. Submit complaints, track progress, and share feedback.
                                We are committed to continuous improvement and valuing every student's input.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions - Card style with local images */}
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Add Complaint Card */}
                        <button
                            onClick={() => navigate('/complaints/new')}
                            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group text-left border border-gray-100"
                        >
                            <div
                                className="relative h-56 bg-gray-100 flex items-center justify-center overflow-hidden"
                                style={{
                                    backgroundImage: 'url(/complaint.png)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                {/* No overlay, just the image */}
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                                    Add Complaint
                                </h3>
                                <p className="text-gray-600">
                                    Submit a new complaint or issue
                                </p>
                            </div>
                        </button>

                        {/* View Complaints Card */}
                        <button
                            onClick={() => navigate('/complaints')}
                            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group text-left border border-gray-100"
                        >
                            <div
                                className="relative h-56 bg-gray-100 flex items-center justify-center overflow-hidden"
                                style={{
                                    backgroundImage: 'url(/view-complaints.png)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                {/* No overlay */}
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    View Complaints
                                </h3>
                                <p className="text-gray-600">
                                    See all your submitted complaints
                                </p>
                            </div>
                        </button>

                        {/* Give Feedback Card */}
                        <button
                            onClick={() => navigate('/feedback')}
                            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group text-left border border-gray-100"
                        >
                            <div
                                className="relative h-56 bg-gray-100 flex items-center justify-center overflow-hidden"
                                style={{
                                    backgroundImage: 'url(/feedback.png)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                {/* No overlay */}
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                                    Give Feedback
                                </h3>
                                <p className="text-gray-600">
                                    Share your feedback and suggestions
                                </p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Statistics */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
                    <DashboardCards cards={stats} />
                </div>

                {/* Recent Complaints */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">Recent Complaints</h2>
                        <a href="/complaints" className="text-orange-600 hover:text-orange-700 font-medium">
                            View All →
                        </a>
                    </div>
                    <ComplaintList
                        complaints={complaintsData?.data || []}
                        isLoading={isLoading}
                        onViewDetail={handleViewDetail}
                    />
                </div>

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
