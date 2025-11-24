import React from 'react';
import { StatusHistoryItem } from '@/types';
import { getStatusLabel } from '@/utils/statusUtils';
import { formatDateTime } from '@/utils/dateUtils';
import { CheckCircle2, Circle } from 'lucide-react';
import { clsx } from 'clsx';

interface StatusTimelineProps {
    history: StatusHistoryItem[];
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ history }) => {
    if (!history) return null;

    // Sort by timestamp descending (most recent first)
    const sortedHistory = [...history].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg mb-4">Status History</h3>
            <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                {/* Timeline items */}
                <div className="space-y-6">
                    {sortedHistory.map((item, index) => (
                        <div key={item.id} className="relative flex gap-4">
                            {/* Icon */}
                            <div className={clsx(
                                'relative z-10 flex items-center justify-center w-8 h-8 rounded-full',
                                index === 0 ? 'bg-primary-100' : 'bg-gray-100'
                            )}>
                                {index === 0 ? (
                                    <CheckCircle2 size={18} className="text-primary-600" />
                                ) : (
                                    <Circle size={18} className="text-gray-400" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-6">
                                <div className="flex justify-between items-start mb-1">
                                    <span className={clsx(
                                        'font-medium',
                                        index === 0 ? 'text-primary-700' : 'text-gray-700'
                                    )}>
                                        {getStatusLabel(item.status)}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {formatDateTime(item.timestamp)}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Changed by {item.changedByName}
                                </p>
                                {item.note && (
                                    <p className="text-sm text-gray-500 mt-2 italic">
                                        Note: {item.note}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
