# UI Update: Department Dashboard Header

## Change
Updated the header section of the Department Head Dashboard (`DepartmentDashboard.tsx`) to match the visual style of the Student Dashboard.

## Details
-   **Layout**: Changed to a centered layout with the logo on the left (on desktop) or top (on mobile).
-   **Logo**: Updated to use `/JKLU logo.png` (the official logo) instead of the placeholder.
-   **Styling**: Applied the same gradient (`from-orange-100 to-blue-100`), rounded corners, and shadow effects as the Student Dashboard.
-   **Content**:
    -   Title: "Feedback & Complaint System" (Same)
    -   Description: "Your voice matters..." (Same)
    -   **Added**: "Welcome, [Name] - Department Head" message below the description, as requested.

## Verification
1.  **Login** as a Department Head.
2.  **Navigate** to the Dashboard.
3.  ✅ The header should now look identical to the Student Dashboard's header, but with the "Welcome..." text included.

---
**Status**: ✅ Updated
**Date**: 2025-11-24
