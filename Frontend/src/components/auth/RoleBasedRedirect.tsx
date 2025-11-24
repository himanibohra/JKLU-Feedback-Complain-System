import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Component that redirects users to their role-specific dashboard
 */
export const RoleBasedRedirect: React.FC = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Redirect based on user role
    switch (user.role) {
        case 'admin':
            return <Navigate to="/admin/dashboard" replace />;
        case 'department_head':
            return <Navigate to="/department/dashboard" replace />;
        case 'student':
        case 'faculty':
            return <Navigate to="/dashboard" replace />;
        default:
            return <Navigate to="/login" replace />;
    }
};
