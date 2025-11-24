import React from 'react';
import { Complaint } from '@/types';
import { ComplaintCard } from './ComplaintCard';
import { SkeletonCard } from '../common/Skeleton';

interface ComplaintListProps {
    complaints: Complaint[];
    isLoading?: boolean;
    onViewDetail: (id: string) => void;
}

export const ComplaintList: React.FC<ComplaintListProps> = ({
    complaints,
    isLoading = false,
    onViewDetail
}) => {
    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        );
    }

    if (complaints.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No complaints found</p>
                <p className="text-gray-400 text-sm mt-2">
                    Try adjusting your filters or create a new complaint
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {complaints.map((complaint) => (
                <ComplaintCard
                    key={complaint.id}
                    complaint={complaint}
                    onViewDetail={onViewDetail}
                />
            ))}
        </div>
    );
};
