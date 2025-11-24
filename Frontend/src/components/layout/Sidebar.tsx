import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Home,
    FileText,
    MessageSquare,
    Calendar,
    BarChart3,
    Users,
    FolderTree,
    Tags,
    X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { clsx } from 'clsx';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const { user } = useAuth();

    const studentLinks = [
        { to: '/dashboard', icon: Home, label: 'Dashboard' },
        { to: '/complaints', icon: FileText, label: 'My Complaints' },
        { to: '/complaints/new', icon: FileText, label: 'New Complaint' },
        { to: '/feedback', icon: MessageSquare, label: 'General Feedback' },
        { to: '/event-feedback', icon: Calendar, label: 'Event Feedback' },
    ];

    const departmentLinks = [
        { to: '/department/dashboard', icon: Home, label: 'Dashboard' },
        { to: '/department/complaints', icon: FileText, label: 'Complaints' },
        { to: '/department/analytics', icon: BarChart3, label: 'Analytics' },
    ];

    const adminLinks = [
        { to: '/admin/dashboard', icon: Home, label: 'Dashboard' },
        { to: '/admin/departments', icon: FolderTree, label: 'Departments' },
        { to: '/admin/categories', icon: Tags, label: 'Categories' },
        { to: '/admin/users', icon: Users, label: 'Users' },
        { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    ];

    const getLinks = () => {
        switch (user?.role) {
            case 'admin':
                return adminLinks;
            case 'department_head':
                return departmentLinks;
            default:
                return studentLinks;
        }
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={onClose}
                />
            )}

            <aside className={clsx(
                "bg-white border-r min-h-screen transition-transform duration-300 ease-in-out z-50",
                "fixed inset-y-0 left-0 w-64",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex items-center justify-between p-4 border-b">
                    <span className="font-bold text-lg text-gray-800">Menu</span>
                    <button onClick={onClose} className="p-1 text-gray-600 hover:text-gray-900">
                        <X size={24} />
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    {getLinks().map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={() => onClose()} // Close on navigation
                            className={({ isActive }) =>
                                clsx(
                                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                                    isActive
                                        ? 'bg-orange-50 text-orange-700 font-medium'
                                        : 'text-gray-700 hover:bg-gray-50'
                                )
                            }
                        >
                            <link.icon size={20} />
                            <span>{link.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    );
};
