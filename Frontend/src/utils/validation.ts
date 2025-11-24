import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const complaintSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title too long'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    categoryId: z.string().min(1, 'Please select a category'),
    location: z.string().min(3, 'Location must be at least 3 characters'),
    priority: z.enum(['low', 'normal', 'high', 'critical'], {
        errorMap: () => ({ message: 'Please select a priority' }),
    }),
    isAnonymous: z.boolean().default(false),
});

export const commentSchema = z.object({
    content: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment too long'),
});

export const feedbackSchema = z.object({
    content: z.string().min(10, 'Feedback must be at least 10 characters'),
    rating: z.number().min(1).max(5).optional(),
    isAnonymous: z.boolean().default(false),
});

export const generalFeedbackSchema = feedbackSchema.extend({
    categoryId: z.string().min(1, 'Please select a category'),
});

export const eventFeedbackSchema = feedbackSchema.extend({
    eventId: z.string().min(1, 'Please select an event'),
});

export const departmentSchema = z.object({
    name: z.string().min(3, 'Department name must be at least 3 characters'),
    description: z.string().optional(),
    headId: z.string().optional(),
});

export const categorySchema = z.object({
    name: z.string().min(3, 'Category name must be at least 3 characters'),
    description: z.string().optional(),
    departmentId: z.string().min(1, 'Please select a department'),
});

export const userSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    role: z.enum(['student', 'faculty', 'department_head', 'admin']),
    departmentId: z.string().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters').optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type ComplaintFormData = z.infer<typeof complaintSchema>;
export type CommentFormData = z.infer<typeof commentSchema>;
export type FeedbackFormData = z.infer<typeof feedbackSchema>;
export type GeneralFeedbackFormData = z.infer<typeof generalFeedbackSchema>;
export type EventFeedbackFormData = z.infer<typeof eventFeedbackSchema>;
export type DepartmentFormData = z.infer<typeof departmentSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type UserFormData = z.infer<typeof userSchema>;
