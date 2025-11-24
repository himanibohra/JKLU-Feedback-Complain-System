// User and Authentication Types
export type UserRole = 'student' | 'faculty' | 'department_head' | 'admin';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    departmentId?: string;
    departmentName?: string;
    createdAt: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

// Complaint Types
export type ComplaintStatus = 'pending' | 'in_progress' | 'resolved' | 'closed';
export type ComplaintPriority = 'low' | 'normal' | 'high' | 'critical';

export interface Complaint {
    id: string;
    title: string;
    description: string;
    category: string;
    categoryId: string;
    location: string;
    priority: ComplaintPriority;
    status: ComplaintStatus;
    isAnonymous: boolean;
    userId: string;
    userName?: string;
    departmentId: string;
    departmentName: string;
    attachments: Attachment[];
    createdAt: string;
    updatedAt: string;
}

export interface ComplaintDetail extends Complaint {
    statusHistory: StatusHistoryItem[];
    comments: Comment[];
}

export interface StatusHistoryItem {
    id: string;
    status: ComplaintStatus;
    changedBy: string;
    changedByName: string;
    timestamp: string;
    note?: string;
}

export interface Comment {
    id: string;
    complaintId: string;
    userId: string;
    userName: string;
    userRole: UserRole;
    content: string;
    attachments: Attachment[];
    createdAt: string;
}

export interface Attachment {
    id: string;
    filename: string;
    url: string;
    size: number;
    uploadedAt: string;
    uploadedBy: string;
}

export interface ComplaintFormData {
    title: string;
    description: string;
    categoryId: string;
    location: string;
    priority: ComplaintPriority;
    isAnonymous: boolean;
    attachments?: File[];
}

export interface ComplaintFilters {
    category?: string;
    status?: ComplaintStatus;
    priority?: ComplaintPriority;
    startDate?: string;
    endDate?: string;
    search?: string;
    page?: number;
    limit?: number;
}

// Feedback Types
export interface Feedback {
    id: string;
    userId: string;
    userName?: string;
    type: 'general' | 'event';
    content: string;
    rating?: number;
    eventName?: string;
    eventDate?: string;
    isAnonymous: boolean;
    createdAt: string;
}

export interface FeedbackFormData {
    content: string;
    rating?: number;
    isAnonymous: boolean;
}

export interface GeneralFeedbackFormData extends FeedbackFormData {
    categoryId: string;
}

export interface EventFeedbackFormData extends FeedbackFormData {
    eventId: string;
}

export interface Event {
    id: string;
    name: string;
    category: string;
    date: string;
    isActive: boolean;
}

// Department and Category Types
export interface Department {
    id: string;
    name: string;
    description?: string;
    headId?: string;
    headName?: string;
    createdAt: string;
}

export interface Category {
    id: string;
    name: string;
    description?: string;
    departmentId: string;
    departmentName: string;
    createdAt: string;
}

// Analytics Types
export interface AnalyticsSummary {
    totalComplaints: number;
    pendingComplaints: number;
    resolvedComplaints: number;
    highPriorityComplaints: number;
    anonymousComplaints: number;
    averageResolutionTime: number; // in hours
}

export interface DepartmentAnalytics {
    departmentId: string;
    departmentName: string;
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
    closed: number;
}

export interface CategoryAnalytics {
    categoryId: string;
    categoryName: string;
    count: number;
}

export interface PriorityAnalytics {
    priority: ComplaintPriority;
    count: number;
}

export interface TimelineAnalytics {
    date: string;
    count: number;
    resolved: number;
}

// Pagination Types
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface ApiError {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
}
