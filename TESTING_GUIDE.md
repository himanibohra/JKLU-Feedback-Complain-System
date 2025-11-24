# Testing Department Head Signup Flow

## Step-by-Step Testing Guide

### 1. Clear Browser Cache
Before testing, make sure to:
- **Hard refresh** the page: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Or **clear browser cache** and reload

### 2. Navigate to Signup Page
```
http://localhost:3000/signup
```

### 3. Fill in the Signup Form

**Test Credentials:**
- **Name**: Test Department Head
- **Email**: depthead@jklu.edu.in
- **Role**: **Department Head** (select from dropdown)
- **Password**: test123
- **Confirm Password**: test123

### 4. Click "Sign Up"

### 5. What Should Happen:

#### ✅ Expected Behavior:
1. **Toast notification** appears: "Account created! Please select your department."
2. **Modal pops up** with title "Select Your Department"
3. **Categories displayed** in a 2-column grid:
   - Academics
   - Administration
   - Clubs (from "Clubs & Societies")
   - Events (from "Events & campus activities")
   - Hostel
   - IT (from "IT & Technical problems")
   - Maintenance
   - **Mess/Cafeteria** ⭐
   - Sports
   - **Transport** ⭐

4. **Select a category** (e.g., "Transport" or "Mess/Cafeteria")
5. **Click "Continue"**
6. **Redirected to**: `/department/dashboard`
7. **User is logged in** (no login page)

#### ❌ If Modal Doesn't Appear:

**Check Browser Console** (F12 → Console tab):
- Look for API errors
- Check if `/complaints/categories` endpoint is being called
- Verify the response

**Common Issues:**
1. **API Error**: Backend might not be running
2. **CORS Error**: Check backend CORS configuration
3. **Network Error**: Check if backend is on port 8080

### 6. Debugging Steps

If the modal still doesn't appear, open **Browser DevTools** (F12):

#### Check Network Tab:
1. Go to **Network** tab
2. Click "Sign Up"
3. Look for these requests:
   - `POST /api/auth/register` - Should return 200/201
   - `POST /api/auth/login` - Should return 200 with token
   - `GET /api/complaints/categories` - Should return categories array

#### Check Console Tab:
- Look for any JavaScript errors
- Check if `showDepartmentModal` state is being set to `true`

#### Check Application Tab:
- Go to **Application** → **Local Storage** → `http://localhost:3000`
- After signup, you should see:
  - `token`: JWT token string
  - `user`: JSON object with user details

### 7. Manual Testing Commands

If you want to test the API directly, open a new PowerShell window:

```powershell
# Test categories endpoint
curl http://localhost:8080/api/complaints/categories

# Expected response: Array of categories with id, name, department_id
```

### 8. Force Refresh Frontend

If changes still don't appear:

```powershell
# Stop the frontend dev server (Ctrl+C in the terminal)
# Then restart:
cd Frontend
npm run dev
```

---

## Troubleshooting Checklist

- [ ] Backend is running on port 8080
- [ ] Frontend is running on port 3000
- [ ] Browser cache cleared (hard refresh)
- [ ] No console errors in browser
- [ ] `/api/complaints/categories` endpoint returns data
- [ ] Modal state `showDepartmentModal` is set to `true` after signup
- [ ] Token is stored in localStorage after signup

---

**Last Updated**: 2025-11-24 19:16
**Status**: Ready for testing
