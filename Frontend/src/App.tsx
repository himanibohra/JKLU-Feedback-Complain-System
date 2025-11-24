
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RoleBasedRedirect } from './components/auth/RoleBasedRedirect';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';

// Student/Faculty Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { ComplaintCreatePage } from './pages/student/ComplaintCreatePage';
import { ComplaintListPage } from './pages/student/ComplaintListPage';
import { ComplaintDetailPage } from './pages/student/ComplaintDetailPage';
import { FeedbackPage } from './pages/student/FeedbackPage';
import { EventFeedbackPage } from './pages/student/EventFeedbackPage';

// Department Head Pages
import { DepartmentDashboard } from './pages/department/DepartmentDashboard';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageDepartmentsPage } from './pages/admin/ManageDepartmentsPage';
import { ManageCategoriesPage } from './pages/admin/ManageCategoriesPage';
import { ManageUsersPage } from './pages/admin/ManageUsersPage';
import { TestDashboard } from './pages/TestDashboard';

function App() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            {/* Public Routes */}
            <Route
                path="/login"
                element={isAuthenticated ? <RoleBasedRedirect /> : <LoginPage />}
            />
            <Route
                path="/signup"
                element={isAuthenticated ? <RoleBasedRedirect /> : <SignupPage />}
            />
            <Route
                path="/test"
                element={<TestDashboard />}
            />

            {/* Student/Faculty Routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute allowedRoles={['student', 'faculty']}>
                        <StudentDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/complaints"
                element={
                    <ProtectedRoute allowedRoles={['student', 'faculty']}>
                        <ComplaintListPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/complaints/new"
                element={
                    <ProtectedRoute allowedRoles={['student', 'faculty']}>
                        <ComplaintCreatePage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/complaints/:id"
                element={
                    <ProtectedRoute>
                        <ComplaintDetailPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/feedback"
                element={
                    <ProtectedRoute allowedRoles={['student', 'faculty']}>
                        <FeedbackPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/event-feedback"
                element={
                    <ProtectedRoute allowedRoles={['student', 'faculty']}>
                        <EventFeedbackPage />
                    </ProtectedRoute>
                }
            />

            {/* Department Head Routes */}
            <Route
                path="/department/dashboard"
                element={
                    <ProtectedRoute allowedRoles={['department_head']}>
                        <DepartmentDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/department/complaints"
                element={
                    <ProtectedRoute allowedRoles={['department_head']}>
                        <ComplaintListPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/department/analytics"
                element={
                    <ProtectedRoute allowedRoles={['department_head']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            {/* Admin Routes */}
            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/departments"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <ManageDepartmentsPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/categories"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <ManageCategoriesPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/users"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <ManageUsersPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/analytics"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            {/* Default Route */}
            <Route path="/" element={<RoleBasedRedirect />} />
            <Route path="*" element={<RoleBasedRedirect />} />
        </Routes>
    );
}

export default App;
