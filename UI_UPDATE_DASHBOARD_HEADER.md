# UI Update: Dashboard Header & Navbar

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

## Verification
1.  **Login** as Department Head.
2.  **Check Navbar**: It should be empty on the left side (no logo/title).
3.  **Check Page Header**: It should show the large logo and title in the gradient box.

---
**Status**: ✅ Updated
**Date**: 2025-11-24
