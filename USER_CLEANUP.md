# User Cleanup Script

## Purpose
This script deletes specific test user accounts and all their related data from the database.

## Users Deleted
The following email accounts were removed:
- `jalebi12@jklu.edu.in`
- `jalebi@jklu.edu.in`
- `kiwi@jklu.edu.in`
- `test123@jklu.edu.in`
- `test@jklu.edu.in`

## What Gets Deleted
For each user, the script removes:
1. **Comments** - All comments made by the user
2. **Status History** - All status changes made by the user
3. **Complaints** - All complaints submitted by the user
4. **Feedback** - All feedback submitted by the user
5. **User Account** - The user record itself

## How to Run
```bash
cd Backend
node cleanup_users.js
```

## Safety
- The script only deletes the specific emails listed in the `emailsToDelete` array
- It will skip any emails that don't exist in the database
- All related data is deleted to maintain database integrity

## To Add More Users to Delete
Edit `Backend/cleanup_users.js` and add emails to the `emailsToDelete` array:
```javascript
const emailsToDelete = [
  'email1@jklu.edu.in',
  'email2@jklu.edu.in',
  // Add more here
];
```

---
**Status**: ✅ Executed
**Date**: 2025-11-25
