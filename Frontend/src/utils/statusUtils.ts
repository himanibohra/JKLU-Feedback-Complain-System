import { ComplaintStatus, ComplaintPriority } from '@/types';

export const getStatusColor = (status: ComplaintStatus): string => {
    const colors: Record<ComplaintStatus, string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        in_progress: 'bg-blue-100 text-blue-800',
        resolved: 'bg-green-100 text-green-800',
        closed: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getPriorityColor = (priority: ComplaintPriority): string => {
    const colors: Record<ComplaintPriority, string> = {
        low: 'bg-gray-100 text-gray-800',
        normal: 'bg-blue-100 text-blue-800',
        high: 'bg-orange-100 text-orange-800',
        critical: 'bg-red-100 text-red-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
};

export const getStatusLabel = (status: ComplaintStatus): string => {
    const labels: Record<ComplaintStatus, string> = {
        pending: 'Pending',
        in_progress: 'In Progress',
        resolved: 'Resolved',
        closed: 'Closed',
    };
    return labels[status] || status;
};

export const getPriorityLabel = (priority: ComplaintPriority): string => {
    const labels: Record<ComplaintPriority, string> = {
        low: 'Low',
        normal: 'Normal',
        high: 'High',
        critical: 'Critical',
    };
    return labels[priority] || priority;
};
