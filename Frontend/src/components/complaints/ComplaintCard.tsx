import React from 'react';
import { Complaint } from '@/types';
import { getStatusColor, getPriorityColor, getStatusLabel, getPriorityLabel } from '@/utils/statusUtils';
import { formatRelativeTime } from '@/utils/dateUtils';
import { MapPin, Clock, AlertCircle, Eye } from 'lucide-react';

interface ComplaintCardProps {
    complaint: Complaint;
    onViewDetail: (id: string) => void;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, onViewDetail }) => {
    return (
        <div className="card hover:shadow-lg transition-shadow flex flex-col h-full">
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900 flex-1 line-clamp-1" title={complaint.title}>
                    {complaint.title}
                </h3>
                <div className="flex gap-2 flex-shrink-0 ml-2">
                    <span className={`badge ${getStatusColor(complaint.status)}`}>
                        {getStatusLabel(complaint.status)}
                    </span>
                    <span className={`badge ${getPriorityColor(complaint.priority)}`}>
                        {getPriorityLabel(complaint.priority)}
                    </span>
                </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                {complaint.description}
            </p>

            <div className="space-y-4 mt-auto">
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span className="truncate max-w-[100px]" title={complaint.location}>{complaint.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <AlertCircle size={16} />
                        <span className="truncate max-w-[100px]" title={complaint.category}>{complaint.category}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{formatRelativeTime(complaint.createdAt)}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                    {complaint.isAnonymous ? (
                        <span className="text-xs text-gray-500 italic">Anonymous</span>
                    ) : (
                        <span className="text-xs text-gray-500">Public</span>
                    )}

                    <button
                        onClick={() => onViewDetail(complaint.id)}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
                    >
                        <Eye size={16} />
                        View Complete Detail
                    </button>
                </div>
            </div>
        </div>
    );
};
