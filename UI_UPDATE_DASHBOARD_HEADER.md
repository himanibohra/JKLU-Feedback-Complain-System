# UI Update: Categories & Dashboard

## Dashboard Header (Department Head)
Updated the header section of the Department Head Dashboard (`DepartmentDashboard.tsx`) to match the visual style of the Student Dashboard.
-   **Layout**: Centered layout with logo on the left.
-   **Logo**: Used official `/JKLU logo.png`.
-   **Styling**: Matches Student Dashboard gradient and shadows.
-   **Content**: Retained custom description and added "Welcome... - Department Head" message.

## Navbar (Global)
Updated `Header.tsx` to hide the logo and "Feedback & Complaint System" title from the navbar when on **any** dashboard page (`/dashboard`, `/department/dashboard`, `/admin/dashboard`).
-   **Goal**: Prevent redundancy since the dashboard page content already displays the logo and title prominently.
-   **Result**: Cleaner navbar on dashboard pages, matching the Student Dashboard look.

## Student Complaint Form
Updated `ComplaintCreatePage.tsx` to filter and deduplicate the "Category" dropdown options.
-   **Goal**: Ensure students can only select categories that correspond to valid Department Head roles, and remove duplicate entries.
-   **Change**: 
    -   Filtered out broad or unused categories.
    -   **Excluded**: Explicitly removed "IT" and "Administration" options (keeping "IT Support" and "General Administration" if present).
    -   Mapped long names to shorter, user-friendly names (e.g., "Clubs & Societies" -> "Clubs").
    -   **Deduplication**: Implemented logic to remove duplicate category names from the dropdown, ensuring a clean list.
-   **Result**: Consistent and clean category selection between Student and Department Head views.

## Verification
1.  **Login** as Student.
2.  **Go to** "Add Complaint".
3.  **Check Category Dropdown**: It should list specific categories like "Mess", "Transport", "IT Support", etc., without "IT" or "Administration" duplicates.

---
**Status**: ✅ Updated
**Date**: 2025-11-24
