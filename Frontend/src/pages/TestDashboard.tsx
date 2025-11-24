import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export const TestDashboard: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="space-y-8 max-w-7xl mx-auto">
                {/* Header Section - Centered Content */}
                <div className="py-8 bg-gradient-to-r from-orange-100 via-orange-200 to-blue-200 rounded-2xl shadow-sm border border-orange-100">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 px-8">
                        <img
                            src="/JKLU logo.png"
                            alt="JKLU Logo"
                            className="h-40 w-40 object-contain flex-shrink-0"
                        />
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl font-bold text-gray-900 mb-3">Feedback & Complaint System</h1>
                            <p className="text-gray-600 text-lg">
                                Your voice matters. Submit complaints, track progress, and share feedback.
                            </p>
                            <p className="text-gray-500 mt-1">
                                We are committed to continuous improvement and valuing every student's input.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions - Card style with local images */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
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
                                {/* No overlay */}
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

                {/* Test Stats */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center gap-3">
                                <FileText className="text-blue-500" size={24} />
                                <div>
                                    <p className="text-gray-600 text-sm">Total Complaints</p>
                                    <p className="text-2xl font-bold">0</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center gap-3">
                                <Clock className="text-yellow-500" size={24} />
                                <div>
                                    <p className="text-gray-600 text-sm">Pending</p>
                                    <p className="text-2xl font-bold">0</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="text-green-500" size={24} />
                                <div>
                                    <p className="text-gray-600 text-sm">Resolved</p>
                                    <p className="text-2xl font-bold">0</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="text-red-500" size={24} />
                                <div>
                                    <p className="text-gray-600 text-sm">High Priority</p>
                                    <p className="text-2xl font-bold">0</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
