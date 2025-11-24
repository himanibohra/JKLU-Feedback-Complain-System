import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
    onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isDashboard = location.pathname === '/dashboard' || location.pathname === '/dashboard/';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getDashboardLink = () => {
        switch (user?.role) {
            case 'admin':
                return '/admin/dashboard';
            case 'department_head':
                return '/department/dashboard';
            default:
                return '/dashboard';
        }
    };

    return (
        <header className="bg-white shadow-sm border-b sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-3">
                        {!isDashboard && (
                            <Link to={getDashboardLink()} className="flex items-center gap-3">
                                <img
                                    src="/JKLU logo.png"
                                    alt="JKLU Logo"
                                    className="h-12 w-12 object-contain"
                                />
                                <h1 className="text-2xl font-bold text-orange-600 hidden sm:block">
                                    Feedback & Complaint System
                                </h1>
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 border-l pl-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
                            </div>
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                <User size={20} className="text-orange-600" />
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>

                        <button
                            onClick={onMenuClick}
                            className="p-2 text-gray-600 hover:text-gray-900"
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
