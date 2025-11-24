# JKLU Feedback & Complaint System - Frontend

A production-ready React + TypeScript + Tailwind CSS frontend for the JKLU Feedback & Complaint System.

## Features

- **Multi-Role Support**: Student, Faculty, Department Head, and Admin roles
- **Complaint Management**: Create, view, filter, and track complaints with status timeline
- **Feedback System**: General and event-specific feedback submission
- **Real-time Updates**: Optimistic UI updates with React Query
- **File Uploads**: Drag-and-drop file uploads with progress tracking
- **Analytics Dashboard**: Charts and statistics for admins and department heads
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **Role-Based Access**: Protected routes based on user roles
- **CSV Export**: Export complaints data for reporting

## Tech Stack

- **Framework**: Vite + React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios with interceptors
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Update the `VITE_API_BASE_URL` in `.env` to point to your backend API:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── api/              # Axios client configuration
├── components/       # React components
│   ├── admin/        # Admin-specific components
│   ├── auth/         # Authentication components
│   ├── common/       # Reusable UI components
│   ├── complaints/   # Complaint-related components
│   └── layout/       # Layout components
├── contexts/         # React contexts (Auth)
├── hooks/            # Custom React Query hooks
├── pages/            # Page components
│   ├── admin/        # Admin pages
│   ├── auth/         # Login page
│   ├── department/   # Department head pages
│   └── student/      # Student/faculty pages
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
│   ├── dateUtils.ts  # Date formatting
│   ├── fileUtils.ts  # File handling
│   ├── statusUtils.ts # Status/priority helpers
│   └── validation.ts # Zod schemas
├── App.tsx           # Main app component with routing
├── main.tsx          # Application entry point
└── index.css         # Global styles

```

## API Endpoints

The frontend expects the following API endpoints:

### Authentication
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout

### Complaints
- `GET /complaints` - List complaints (with filters)
- `POST /complaints` - Create complaint
- `GET /complaints/:id` - Get complaint details
- `PUT /complaints/:id` - Update complaint
- `DELETE /complaints/:id` - Delete complaint
- `PUT /complaints/:id/status` - Update status
- `POST /complaints/:id/comments` - Add comment
- `POST /complaints/:id/attachments` - Upload attachments

### Feedback
- `GET /feedback` - List general feedback
- `POST /feedback` - Submit general feedback
- `GET /event-feedback` - List event feedback
- `POST /event-feedback` - Submit event feedback

### Analytics
- `GET /analytics/summary` - Get summary statistics
- `GET /analytics/department` - Department analytics
- `GET /analytics/category` - Category analytics
- `GET /analytics/priority` - Priority analytics
- `GET /analytics/timeline` - Timeline data

### Admin
- `GET /departments` - List departments
- `POST /departments` - Create department
- `PUT /departments/:id` - Update department
- `DELETE /departments/:id` - Delete department
- `GET /categories` - List categories
- `POST /categories` - Create category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category
- `GET /users` - List users
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /export/complaints` - Export complaints CSV

## Key Features Explained

### Authentication
- JWT-based authentication with automatic token refresh
- Auto-redirect to login on 401 responses
- Session persistence in localStorage

### File Uploads
- Drag-and-drop support
- File size validation (max 10MB per file)
- Multiple file uploads (max 5 files)
- Progress tracking

### Filtering & Pagination
- Server-side pagination
- Multi-criteria filtering (category, status, priority, date range)
- Search functionality

### Optimistic Updates
- Instant UI feedback for comments and status changes
- Automatic cache invalidation with React Query

### Role-Based Access
- Protected routes based on user roles
- Dynamic navigation based on role
- Role-specific dashboards

## Assumptions

Since the backend API specification wasn't provided, the following assumptions were made:

1. **API Response Format**: All successful responses follow `{ success: true, data: T }` format
2. **Error Format**: Errors return `{ success: false, message: string, errors?: {} }`
3. **Pagination**: Uses `page` and `limit` query parameters, returns `{ data: [], pagination: {} }`
4. **File Uploads**: Accepts `multipart/form-data` with `attachments` field
5. **Authentication**: Returns `{ user: User, token: string }` on login
6. **Status History**: Automatically tracked by backend when status changes
7. **Anonymous Complaints**: User info hidden when `isAnonymous` is true
8. **Department Assignment**: Users can be assigned to departments via `departmentId`

## Demo Credentials

For testing purposes, you can use these credentials (update based on your backend):

- **Student**: student@jklu.edu.in / password
- **Faculty**: faculty@jklu.edu.in / password
- **Department Head**: head@jklu.edu.in / password
- **Admin**: admin@jklu.edu.in / password

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
