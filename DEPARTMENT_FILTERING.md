# Department-Based Complaint Filtering

## Overview
Implemented proper complaint filtering for department heads so they can see all complaints assigned to their department, not just complaints they personally created.

## Changes Made

### 1. Backend Model (`Backend/Models/complaint.js`)
**Added new method: `getByDepartment(department_id)`**
- Fetches all complaints for a specific department
- Includes user information (even for anonymous complaints, department heads can see who submitted)
- Joins with categories, departments, and users tables
- Orders by creation date (newest first)

```javascript
getByDepartment: (department_id) => {
  // Returns all complaints where c.department_id = ?
  // Includes: complaint details, category name, department name, user name
}
```

### 2. Backend Controller (`Backend/Controllers/complaintController.js`)
**Updated: `getMyComplaints` function**
- Now checks the user's role
- **For Department Heads**: 
  - Fetches all complaints for their assigned department using `Complaint.getByDepartment()`
  - Validates that department head has a department assigned
- **For Students & Faculty**: 
  - Continues to fetch only their own complaints using `Complaint.getByUser()`

## How It Works

### For Students/Faculty:
1. User logs in as student or faculty
2. Calls `/api/complaints` endpoint
3. Backend checks role → "student" or "faculty"
4. Returns only complaints created by that user

### For Department Heads:
1. Department head logs in
2. During signup, they selected their department (stored in `users.department_id`)
3. Calls `/api/complaints` endpoint
4. Backend checks role → "department_head"
5. Backend checks their `department_id`
6. Returns **ALL complaints** for that department (from any student/faculty)

## Example Flow

### Scenario:
- **Student A** submits complaint about "Mess Food Quality" → Category: "Mess" → Department: "Student Affairs" (ID: 3)
- **Faculty B** submits complaint about "Hostel Maintenance" → Category: "Hostel" → Department: "Student Affairs" (ID: 3)
- **Department Head C** is assigned to "Student Affairs" department

### Result:
When **Department Head C** opens their dashboard:
- ✅ Sees Student A's complaint about Mess
- ✅ Sees Faculty B's complaint about Hostel
- ✅ Can manage, comment, and update status on both
- ✅ Complaints are sorted by department, not by who created them

## Database Schema Reference

### Complaints Table:
- `complaint_id` - Primary key
- `user_id` - Who created the complaint
- `category_id` - Category (Mess, Hostel, etc.)
- `department_id` - Which department handles it
- `status` - pending, in_progress, resolved, closed
- `priority` - low, normal, high, critical

### Users Table:
- `user_id` - Primary key
- `role` - student, faculty, department_head, admin
- `department_id` - For department heads, which department they manage

## Testing

### To Verify:
1. **Create test complaints**:
   - Login as Student → Create complaint for "Mess" category
   - Login as Faculty → Create complaint for "Hostel" category
   
2. **Check Department Head Dashboard**:
   - Login as Department Head (assigned to "Student Affairs")
   - Navigate to Dashboard
   - Should see BOTH complaints (if Mess and Hostel belong to Student Affairs department)

3. **Verify Filtering**:
   - Complaints should be filtered by `department_id`, not `user_id`
   - Department head should see complaints from ALL users in their department

## Benefits
✅ Department heads can now manage all complaints in their department
✅ Proper separation of concerns (students see their own, dept heads see department's)
✅ Enables efficient complaint resolution workflow
✅ Maintains privacy for students/faculty (they only see their own complaints)

---
**Status**: ✅ Implemented and Deployed
**Date**: 2025-11-25
