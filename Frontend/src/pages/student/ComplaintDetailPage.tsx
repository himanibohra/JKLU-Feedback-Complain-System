import React from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useComplaint } from '@/hooks/useComplaints';
import { StatusTimeline } from '@/components/complaints/StatusTimeline';
import { CommentThread } from '@/components/complaints/CommentThread';
import { SkeletonDetail } from '@/components/common/Skeleton';
import { getStatusColor, getPriorityColor, getStatusLabel, getPriorityLabel } from '@/utils/statusUtils';
import { formatDateTime } from '@/utils/dateUtils';
import { MapPin, Calendar, User, Paperclip } from 'lucide-react';

export const ComplaintDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data: complaint, isLoading } = useComplaint(id!);

    if (isLoading) {
        return (
            <MainLayout>
                <SkeletonDetail />
            </MainLayout>
        );
    }

    if (!complaint) {
        return (
            <MainLayout>
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Complaint not found</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="card">
                    <div className="flex justify-between items-start mb-4">
                        <h1 className="text-3xl font-bold text-gray-900">{complaint.title}</h1>
                        <div className="flex gap-2">
                            <span className={`badge ${getStatusColor(complaint.status)}`}>
                                {getStatusLabel(complaint.status)}
                            </span>
                            <span className={`badge ${getPriorityColor(complaint.priority)}`}>
                                {getPriorityLabel(complaint.priority)}
                            </span>
                        </div>
                    </div>

                    <p className="text-gray-700 whitespace-pre-wrap mb-6">{complaint.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                            <MapPin size={18} />
                            <div>
                                <p className="text-xs text-gray-500">Location</p>
                                <p className="font-medium">{complaint.location}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                            <Calendar size={18} />
                            <div>
                                <p className="text-xs text-gray-500">Submitted</p>
                                <p className="font-medium">{formatDateTime(complaint.createdAt)}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                            <User size={18} />
                            <div>
                                <p className="text-xs text-gray-500">Submitted By</p>
                                <p className="font-medium">
                                    {complaint.isAnonymous ? 'Anonymous' : complaint.userName}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                            <div>
                                <p className="text-xs text-gray-500">Department</p>
                                <p className="font-medium">{complaint.departmentName}</p>
                            </div>
                        </div>
                    </div>

                    {complaint.attachments.length > 0 && (
                        <div className="mt-6">
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <Paperclip size={18} />
                                Attachments ({complaint.attachments.length})
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {complaint.attachments.map((attachment) => (
                                    <a
                                        key={attachment.id}
                                        href={attachment.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        <Paperclip size={16} />
                                        <span className="text-sm">{attachment.filename}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Status Timeline */}
                <div className="card">
                    <StatusTimeline history={complaint.statusHistory} />
                </div>

                {/* Comments */}
                <div className="card">
                    <CommentThread complaintId={complaint.id} comments={complaint.comments} />
                </div>
            </div>
        </MainLayout>
    );
};
