# Category Updates (Revert & Add)

## Changes Made

1. **Reverted "Mess/Cafeteria"**:
   - Split back into two separate categories: **"Mess"** and **"Cafeteria"**.

2. **Added "Transport"**:
   - Ensured **"Transport"** is available as a category.

## Final Category List

The Department Selection Modal now displays the following categories:

1. Academics
2. Administration
3. Clubs (Clubs & Societies)
4. Events (Events & campus activities)
5. Hostel
6. IT (IT & Technical problems)
7. Maintenance
8. **Mess** (Separate)
9. **Cafeteria** (Separate)
10. Sports
11. **Transport**

## Database Updates

- Ran `revert_categories.js` script to:
  - Update `categories` table
  - Change "Mess/Cafeteria" -> "Mess"
  - Insert "Cafeteria"
  - Insert "Transport" (if missing)

## Frontend Updates

- Updated `DepartmentSelectionModal.tsx` to include both "Mess" and "Cafeteria" in the filter list.

---

**Status**: ✅ Completed
**Date**: 2025-11-24
