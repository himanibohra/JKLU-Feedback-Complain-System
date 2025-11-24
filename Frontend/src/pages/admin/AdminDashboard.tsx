import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';

export const AdminDashboard: React.FC = () => {
    const { user } = useAuth();

    return (
        <MainLayout>
            <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name}</h2>
                    <p className="text-gray-600">
                        This is the main Admin Dashboard. Here you can oversee all system activities, manage users, and view global statistics.
                    </p>
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-orange-50 p-6 rounded-lg">
                            <h3 className="font-semibold text-orange-900">Total Users</h3>
                            <p className="text-3xl font-bold text-orange-700 mt-2">0</p>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-lg">
                            <h3 className="font-semibold text-blue-900">Total Complaints</h3>
                            <p className="text-3xl font-bold text-blue-700 mt-2">0</p>
                        </div>
                        <div className="bg-green-50 p-6 rounded-lg">
                            <h3 className="font-semibold text-green-900">Resolved</h3>
                            <p className="text-3xl font-bold text-green-700 mt-2">0</p>
                        </div>
                        <div className="bg-purple-50 p-6 rounded-lg">
                            <h3 className="font-semibold text-purple-900">Feedback</h3>
                            <p className="text-3xl font-bold text-purple-700 mt-2">0</p>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};
