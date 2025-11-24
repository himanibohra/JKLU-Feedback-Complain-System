import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus } from 'lucide-react';
import { apiClient } from '@/api/client';
import toast from 'react-hot-toast';
import { DepartmentSelectionModal } from '@/components/DepartmentSelectionModal';


const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    role: z.enum(['student', 'faculty', 'department_head', 'admin'], {
        required_error: 'Please select a role',
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

export const SignupPage: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showDepartmentModal, setShowDepartmentModal] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupFormData) => {
        setIsLoading(true);
        try {
            const { confirmPassword, ...signupData } = data;

            // Register the user
            await apiClient.post('/auth/register', signupData);

            // If user is a department head, show department selection modal
            if (data.role === 'department_head') {
                // First login to get the token
                const loginResponse = await apiClient.post('/auth/login', {
                    email: data.email,
                    password: data.password
                });

                // Store token and user info (use 'auth_token' to match API client)
                localStorage.setItem('auth_token', loginResponse.data.token);
                localStorage.setItem('user', JSON.stringify(loginResponse.data.user));

                // Show department selection modal
                setShowDepartmentModal(true);
                toast.success('Account created! Please select your department.');
            } else {
                toast.success('Account created successfully! Please login.');
                navigate('/login');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.msg || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDepartmentSuccess = () => {
        setShowDepartmentModal(false);
        toast.success('Department assigned successfully!');
        // Redirect to department dashboard instead of login
        navigate('/department/dashboard');
        // Reload to update auth context
        window.location.reload();
    };

    const handleDepartmentModalClose = () => {
        setShowDepartmentModal(false);
        toast('You can set your department later from your profile.');
        // Still redirect to dashboard even if they skip
        navigate('/department/dashboard');
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-100 via-orange-200 to-blue-200 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8 border border-white/50 backdrop-blur-sm">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        JKLU Feedback System
                    </h1>
                    <p className="text-gray-600">Create your account</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            {...register('name')}
                            className="input"
                            placeholder="John Doe"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            {...register('email')}
                            className="input"
                            placeholder="your.email@jklu.edu.in"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                            Role
                        </label>
                        <select
                            id="role"
                            {...register('role')}
                            className="input"
                        >
                            <option value="">Select your role</option>
                            <option value="student">Student</option>
                            <option value="faculty">Faculty</option>
                            <option value="department_head">Department Head</option>
                            <option value="admin">Admin</option>
                        </select>
                        {errors.role && (
                            <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            {...register('password')}
                            className="input"
                            placeholder="••••••••"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            {...register('confirmPassword')}
                            className="input"
                            placeholder="••••••••"
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary w-full flex items-center justify-center gap-2"
                    >
                        <UserPlus size={20} />
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" className="text-orange-600 hover:text-orange-700 font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

            {/* Department Selection Modal */}
            <DepartmentSelectionModal
                isOpen={showDepartmentModal}
                onClose={handleDepartmentModalClose}
                onSuccess={handleDepartmentSuccess}
            />
        </div>
    );
};
