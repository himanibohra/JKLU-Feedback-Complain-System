import React, { useState } from 'react';
import { Comment as CommentType } from '@/types';
import { formatRelativeTime } from '@/utils/dateUtils';
import { User, Paperclip, Edit2, Trash2, X, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUpdateComment, useDeleteComment } from '@/hooks/useComplaints';

interface CommentThreadProps {
    comments: CommentType[];
}

export const CommentThread: React.FC<CommentThreadProps> = ({
    comments
}) => {
    const { user } = useAuth();
    const { mutate: updateComment, isPending: isUpdating } = useUpdateComment();
    const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment();

    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');

    if (!comments) return null;

    // Sort comments by date (newest first)
    const sortedComments = [...comments].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const handleEditClick = (comment: CommentType) => {
        setEditingCommentId(comment.id);
        setEditContent(comment.content);
    };

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditContent('');
    };

    const handleSaveEdit = (comment: CommentType) => {
        if (editContent.trim() === '') return;

        updateComment(
            { id: comment.id, content: editContent, complaintId: comment.complaintId },
            {
                onSuccess: () => {
                    setEditingCommentId(null);
                    setEditContent('');
                }
            }
        );
    };

    const handleDeleteClick = (comment: CommentType) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            deleteComment({ id: comment.id, complaintId: comment.complaintId });
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="font-semibold text-lg">Comments ({comments.length})</h3>

            {/* Comments List */}
            <div className="space-y-4">
                {sortedComments.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No comments yet</p>
                ) : (
                    sortedComments.map((comment) => {
                        const isOwner = String(user?.id) === String(comment.userId);
                        const isEditing = editingCommentId === comment.id;

                        return (
                            <div key={comment.id} className="card group relative">
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                        <User size={20} className="text-gray-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-medium text-gray-900">{comment.userName}</p>
                                                <p className="text-xs text-gray-500 capitalize">{(comment.userRole || 'student').replace('_', ' ')}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-500">
                                                    {formatRelativeTime(comment.createdAt)}
                                                </span>
                                                {isOwner && !isEditing && (
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleEditClick(comment)}
                                                            className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(comment)}
                                                            className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                                                            title="Delete"
                                                            disabled={isDeleting}
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {isEditing ? (
                                            <div className="mt-2">
                                                <textarea
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                    className="input w-full mb-2 resize-none"
                                                    rows={3}
                                                    autoFocus
                                                />
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        className="btn btn-sm btn-ghost flex items-center gap-1"
                                                        disabled={isUpdating}
                                                    >
                                                        <X size={14} /> Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => handleSaveEdit(comment)}
                                                        className="btn btn-sm btn-primary flex items-center gap-1"
                                                        disabled={isUpdating || editContent.trim() === ''}
                                                    >
                                                        <Check size={14} /> {isUpdating ? 'Saving...' : 'Save'}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>

                                                {comment.attachments.length > 0 && (
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {comment.attachments.map((attachment) => (
                                                            <a
                                                                key={attachment.id}
                                                                href={attachment.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                                                            >
                                                                <Paperclip size={16} />
                                                                <span>{attachment.filename}</span>
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
