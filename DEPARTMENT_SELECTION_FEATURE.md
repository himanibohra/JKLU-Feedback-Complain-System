# Department Selection Feature for Department Heads

## Overview
After a user signs up as a department head, a modal popup appears asking them to select which department they will manage. This ensures complaints are properly routed to the correct department head.

## Implementation Details

### Backend Changes

1. **Department Model** (`Backend/Models/department.js`)
   - Added `getAll()` method to fetch all departments

2. **Department Controller** (`Backend/Controllers/departmentController.js`)
   - Added `getAllDepartments()` controller to handle GET requests for all departments

3. **Department Routes** (`Backend/Routes/departmentRoutes.js`)
   - Added public route: `GET /api/department` - Returns list of all departments

4. **User Model** (`Backend/Models/user.js`)
   - Added `updateDepartment(user_id, department_id)` method to update user's department

5. **Auth Controller** (`Backend/Controllers/authController.js`)
   - Added `updateDepartment()` controller to handle department assignment
   - Only allows department heads to set their department

6. **Auth Routes** (`Backend/Routes/authRoutes.js`)
   - Added protected route: `PUT /api/auth/update-department` - Updates user's department

### Frontend Changes

1. **DepartmentSelectionModal Component** (`Frontend/src/components/DepartmentSelectionModal.tsx`)
   - New modal component that displays after department head signup
   - Fetches all departments from the API
   - Shows radio button selection with visual feedback
   - Handles department assignment via API call
   - Provides cancel option (user can set department later)

2. **SignupPage** (`Frontend/src/pages/auth/SignupPage.tsx`)
   - Updated signup flow to detect department_head role
   - Automatically logs in department head after registration
   - Stores temporary token in localStorage
   - Shows DepartmentSelectionModal
   - Clears token and redirects to login after department selection

## User Flow

1. User fills out signup form and selects "Department Head" role
2. User submits the form
3. Backend creates the user account
4. Frontend automatically logs in the user (to get auth token)
5. Department selection modal appears with list of departments:
   - Academics
   - Administration
   - Student Affairs
6. User selects their department and clicks "Continue"
7. Backend updates the user's department_id
8. User is redirected to login page with success message
9. User logs in and can now manage complaints for their department

## API Endpoints

### Get All Departments (Public)
```
GET /api/department
Response: [
  { department_id: 1, name: "Academics" },
  { department_id: 2, name: "Administration" },
  { department_id: 3, name: "Student Affairs" }
]
```

### Update User Department (Protected)
```
PUT /api/auth/update-department
Headers: { Authorization: "Bearer <token>" }
Body: { department_id: 2 }
Response: { msg: "Department updated successfully" }
```

## Benefits

1. **Proper Complaint Routing**: Complaints are automatically routed to the correct department head
2. **Better Organization**: Department heads only see complaints relevant to their department
3. **User-Friendly**: Simple modal interface with clear visual feedback
4. **Flexible**: Users can skip and set department later if needed
5. **Secure**: Only department heads can set their department, validated on backend

## Testing

To test this feature:
1. Navigate to signup page
2. Create account with role "Department Head"
3. Modal should appear with department options
4. Select a department and click "Continue"
5. Login with the new account
6. Verify the department is correctly assigned
