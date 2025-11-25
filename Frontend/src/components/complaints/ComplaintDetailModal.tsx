import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useComplaint, useUpdateComplaintStatus, useAddComment, useUploadAttachment } from '@/hooks/useComplaints';
import { StatusTimeline } from './StatusTimeline';
import { CommentThread } from './CommentThread';
import { SkeletonDetail } from '../common/Skeleton';
import { FileUpload } from '../common/FileUpload';
import { getStatusColor, getPriorityColor, getStatusLabel, getPriorityLabel } from '@/utils/statusUtils';
import { formatDateTime } from '@/utils/dateUtils';
import { MapPin, Calendar, User, Paperclip, X, MessageSquare, Upload, CheckCircle, RefreshCw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { commentSchema, CommentFormData } from '@/utils/validation';

interface ComplaintDetailModalProps {
    complaintId: string;
    onClose: () => void;
}

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({ complaintId, onClose }) => {
    const { data: complaint, isLoading, error } = useComplaint(complaintId);
    const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateComplaintStatus();
    const { mutate: addComment, isPending: isAddingComment } = useAddComment();
    const { mutate: uploadAttachment, isPending: isUploadingFiles } = useUploadAttachment();

    const [showCommentForm, setShowCommentForm] = useState(false);
    const [showFileUpload, setShowFileUpload] = useState(false);
    const [filesToUpload, setFilesToUpload] = useState<File[]>([]);

    console.log('Render Modal. State:', { showCommentForm, showFileUpload });

    // Form handling for comments
    const { register, handleSubmit, reset, formState: { errors } } = useForm<CommentFormData>({
        resolver: zodResolver(commentSchema)
    });

    const onSubmitComment = (data: CommentFormData) => {
        console.log('Submitting comment:', data);
        addComment(
            { complaintId, content: data.content },
            {
                onSuccess: () => {
                    console.log('Comment submitted successfully');
                    reset();
                    setShowCommentForm(false);
                },
                onError: (error) => {
                    console.error('Error submitting comment:', error);
                }
            }
        );
    };

    const handleUploadFiles = () => {
        console.log('Uploading files:', filesToUpload);
        if (filesToUpload.length === 0) {
            console.log('No files to upload');
            return;
        }

        uploadAttachment(
            { complaintId, files: filesToUpload },
            {
                onSuccess: () => {
                    console.log('Files uploaded successfully');
                    setFilesToUpload([]);
                    setShowFileUpload(false);
                },
                onError: (error) => {
                    console.error('Error uploading files:', error);
                }
            }
        );
    };

    const handleCloseComplaint = () => {
        if (window.confirm('Are you sure you want to close this complaint?')) {
            updateStatus(
                { id: complaintId, status: 'closed' },
                {
                    onSuccess: () => {
                        // Close the modal after successful update
                        onClose();
                    }
                }
            );
        }
    };

    const handleReopenComplaint = () => {
        if (window.confirm('Are you sure you want to reopen this complaint?')) {
            updateStatus(
                { id: complaintId, status: 'pending' },
                {
                    onSuccess: () => {
                        // Close the modal after successful update
                        onClose();
                    }
                }
            );
        }
    };

    if (isLoading) {
        return ReactDOM.createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
                    <SkeletonDetail />
                </div>
            </div>,
            document.body
        );
    }

    if (error) {
        return ReactDOM.createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                    <h3 className="text-xl font-bold text-red-600 mb-2">Error Loading Complaint</h3>
                    <p className="text-gray-700 mb-4">{(error as any)?.message || 'Failed to load complaint details'}</p>
                    <button onClick={onClose} className="btn btn-primary w-full">Close</button>
                </div>
            </div>,
            document.body
        );
    }

    if (!complaint) {
        console.log('No complaint data found');
        return null;
    }

    const canClose = complaint.status !== 'closed';
    const canReopen = complaint.status === 'closed';

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors z-10"
                >
                    <X size={24} />
                </button>

                <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="border-b pb-6">
                        <div className="flex flex-col gap-4 mb-4">
                            <h2 className="text-2xl font-bold text-gray-900 pr-12">{complaint.title}</h2>
                            <div className="flex gap-2 flex-wrap">
                                <span className={`badge ${getStatusColor(complaint.status)}`}>
                                    {getStatusLabel(complaint.status)}
                                </span>
                                <span className={`badge ${getPriorityColor(complaint.priority)}`}>
                                    {getPriorityLabel(complaint.priority)}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                                <MapPin size={16} />
                                <div>
                                    <p className="text-xs text-gray-500">Location</p>
                                    <p className="font-medium">{complaint.location}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Calendar size={16} />
                                <div>
                                    <p className="text-xs text-gray-500">Submitted</p>
                                    <p className="font-medium">{formatDateTime(complaint.createdAt)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <User size={16} />
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
                    </div>

                    {/* User Actions */}
                    <div className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-xl p-4 border border-orange-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Actions</h3>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Add Comment clicked');
                                    setShowCommentForm(prev => !prev);
                                    setShowFileUpload(false);
                                }}
                                className={`btn btn-sm flex items-center gap-2 ${showCommentForm ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                            >
                                <MessageSquare size={16} />
                                {showCommentForm ? 'Cancel Comment' : 'Add Comment'}
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Upload Files clicked');
                                    setShowFileUpload(prev => !prev);
                                    setShowCommentForm(false);
                                }}
                                className={`btn btn-sm flex items-center gap-2 ${showFileUpload ? 'bg-purple-700 text-white' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                            >
                                <Upload size={16} />
                                {showFileUpload ? 'Cancel Upload' : 'Upload Files'}
                            </button>
                            {canClose && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        console.log('Close Complaint clicked');
                                        handleCloseComplaint();
                                    }}
                                    disabled={isUpdatingStatus}
                                    className="btn btn-sm bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                                >
                                    <CheckCircle size={16} />
                                    {isUpdatingStatus ? 'Closing...' : 'Close Complaint'}
                                </button>
                            )}
                            {canReopen && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        console.log('Reopen Complaint clicked');
                                        handleReopenComplaint();
                                    }}
                                    disabled={isUpdatingStatus}
                                    className="btn btn-sm bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
                                >
                                    <RefreshCw size={16} />
                                    {isUpdatingStatus ? 'Reopening...' : 'Reopen Complaint'}
                                </button>
                            )}
                        </div>

                        {/* Add Comment Form */}
                        {showCommentForm && (
                            <div className="mt-4 bg-white p-4 rounded-lg border border-gray-200 animate-fadeIn">
                                <form onSubmit={handleSubmit(onSubmitComment)}>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Comment
                                    </label>
                                    <textarea
                                        {...register('content')}
                                        rows={4}
                                        className="input resize-none mb-1 w-full"
                                        placeholder="Type your comment here..."
                                    />
                                    {errors.content && (
                                        <p className="text-red-500 text-sm mb-3">{errors.content.message}</p>
                                    )}
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            type="submit"
                                            disabled={isAddingComment}
                                            className="btn btn-sm btn-primary"
                                        >
                                            {isAddingComment ? 'Posting...' : 'Post Comment'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowCommentForm(false);
                                                reset();
                                            }}
                                            className="btn btn-sm btn-secondary"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Upload Files Form */}
                        {showFileUpload && (
                            <div className="mt-4 bg-white p-4 rounded-lg border border-gray-200 animate-fadeIn">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Upload Additional Files
                                </label>
                                <FileUpload
                                    onFilesSelected={setFilesToUpload}
                                    accept="image/*,.pdf,.doc,.docx"
                                    maxFiles={5}
                                />
                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={handleUploadFiles}
                                        disabled={isUploadingFiles || filesToUpload.length === 0}
                                        className="btn btn-sm btn-primary"
                                    >
                                        {isUploadingFiles ? 'Uploading...' : 'Upload Files'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowFileUpload(false);
                                            setFilesToUpload([]);
                                        }}
                                        className="btn btn-sm btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <p className="text-gray-700 whitespace-pre-wrap">{complaint.description}</p>
                        </div>
                    </div>

                    {/* Attachments */}
                    {complaint.attachments && complaint.attachments.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Paperclip size={18} />
                                Attachments
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {complaint.attachments.map((attachment) => (
                                    <a
                                        key={attachment.id}
                                        href={attachment.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
                                    >
                                        <Paperclip size={16} />
                                        <span className="text-sm font-medium text-gray-700">{attachment.filename}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Status Timeline */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status History</h3>
                        <div className="bg-white border rounded-xl p-4">
                            <StatusTimeline history={complaint.statusHistory} />
                        </div>
                    </div>

                    {/* Comments */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments & Updates</h3>
                        <div className="bg-white border rounded-xl p-4">
                            <CommentThread comments={complaint.comments} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};
