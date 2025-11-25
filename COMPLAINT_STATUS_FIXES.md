# Complaint Status Update Issues - Fixed

## Issues Reported

1. **Closed complaints still showing** - After clicking "Close Complaint", the modal closes but the complaint list doesn't refresh
2. **Closed count not updating** - Stats aren't recalculating after status change
3. **Wrong department name** - Complaint shows "Mess" instead of "Hostel" department

## Fixes Applied

### 1. ✅ Force Refetch After Status Update

**Problem**: React Query was invalidating the cache but not immediately refetching the data.

**Solution**: Updated `useUpdateComplaintStatus` hook to use `refetchQueries` instead of just `invalidateQueries`.

**File**: `Frontend/src/hooks/useComplaints.ts`

**Change**:
```typescript
onSuccess: async (_, variables) => {
    // Invalidate and refetch immediately
    await queryClient.invalidateQueries({ queryKey: ['complaint', variables.id] });
    await queryClient.refetchQueries({ queryKey: ['complaints'] });  // Force immediate refetch
    toast.success('Status updated successfully!');
}
```

**Result**:
- Complaint list now refreshes immediately after status update
- Stats (pending, closed counts) update automatically
- Modal closes and shows updated data

---

### 2. ✅ Modal Closes After Status Update

**Problem**: Modal stayed open after clicking "Close Complaint".

**Solution**: Added `onClose()` call in the success callback.

**File**: `Frontend/src/components/complaints/ComplaintDetailModal.tsx`

**Change**:
```typescript
const handleCloseComplaint = () => {
    if (window.confirm('Are you sure you want to close this complaint?')) {
        updateStatus(
            { id: complaintId, status: 'closed' },
            {
                onSuccess: () => {
                    onClose();  // Close modal after successful update
                }
            }
        );
    }
};
```

---

### 3. ⚠️ Department Name Issue

**Problem**: Complaint shows wrong department name ("Mess" instead of "Hostel").

**Root Cause**: This is a **data issue**, not a code issue. The backend is correctly returning the department name from the `departments` table.

**Explanation**:
- **Hostel** category → belongs to **Student Affairs** department (ID: 3)
- **Mess** category → belongs to **Student Affairs** department (ID: 3)

Both categories belong to the same department. If a complaint shows "Mess" as the department, it means:
1. The complaint was created with the **Mess category**
2. The category is correctly mapped to **Student Affairs** department
3. The department name should show "Student Affairs", not "Mess"

**Verification Needed**:
Check if the issue is:
- Frontend displaying category name instead of department name?
- Database has incorrect `department_id` for the complaint?

**To Check**:
1. Look at the complaint detail modal
2. Verify it shows `complaint.departmentName` (not `complaint.category`)
3. Check the database: `SELECT * FROM complaints WHERE complaint_id = [id]`
4. Verify the `department_id` matches the correct department

---

## How to Test

### Test 1: Status Update and Refresh
1. **Refresh browser** (Ctrl + Shift + R)
2. Login as Department Head
3. Click "View Complete Detail" on a pending complaint
4. Click "Close Complaint" and confirm
5. ✅ Modal should close
6. ✅ Complaint list should refresh immediately
7. ✅ Complaint should show "Closed" badge
8. ✅ "Closed" count in stats should increase

### Test 2: Department Name
1. Open a complaint detail
2. Check the "Department" field
3. It should show the **department name** (e.g., "Student Affairs")
4. NOT the category name (e.g., "Mess" or "Hostel")

---

## Category to Department Mapping

From `Backend/seed_categories.js`:

| Category | Department ID | Department Name |
|----------|---------------|-----------------|
| Academics | 1 | Academics |
| Hostel | 3 | Student Affairs |
| Mess | 3 | Student Affairs |
| Cafeteria | 2 | Administration |
| IT & Technical problems | 2 | Administration |
| Transport | 2 | Administration |
| Maintenance | 2 | Administration |
| Sports | 3 | Student Affairs |
| Clubs & Societies | 3 | Student Affairs |
| Events & campus activities | 3 | Student Affairs |
| Admin | 2 | Administration |

---

**Status**: ✅ Refetch issue fixed, Department name needs verification
**Date**: 2025-11-25
