# Student Pakistan - Setup Instructions

## What Was Fixed

### 1. **Routing Issue** ✅
- **Problem**: When clicking "Join as Student", the app showed Admin fields (school name, address, contact)
- **Cause**: `useParams` hook wasn't extracting route parameters correctly in wouter
- **Fix**: Switched to `useRoute` hook which properly extracts the `:role` parameter from `/onboarding/:role`

### 2. **Form Submission Issue** ✅
- **Problem**: Clicking "Continue" showed "Processing..." but nothing happened
- **Cause**: 
  - Admin onboarding was trying to send wrong data to wrong endpoint
  - Route guards were preventing access to onboarding pages
- **Fix**:
  - Students now correctly send `city`, `classGrade`, `board` to `/api/user/profile`
  - Admins now correctly send `schoolName`, `address`, `contactNumber` to `/api/schools`
  - Moved onboarding routes outside conditional guards

### 3. **App Name Changed** ✅
- Changed from "CampusConnect" to "Student Pakistan" everywhere:
  - Landing page
  - Role selection
  - Top bar
  - HTML title
  - Database schema comments
  - Design guidelines

## How to Test the App

### Prerequisites
You need a **PostgreSQL database** (the app won't run without it).

### Option 1: Set Up Neon Database (Recommended - Free)

1. **Create a Neon account**
   - Go to https://neon.tech
   - Sign up (free tier is enough)

2. **Create a new project**
   - Click "New Project"
   - Give it a name: "student-pakistan"
   - Copy the connection string

3. **Update the .env file**
   ```bash
   DATABASE_URL=postgresql://your_actual_connection_string_here
   PORT=5000
   ```

4. **Run database migrations**
   ```bash
   npm run db:push
   ```

5. **Start the dev server**
   ```bash
   npm run dev
   ```

6. **Open the app**
   - Navigate to http://localhost:5000
   - The app should now work!

### What to Test

1. **Student Flow**:
   - Click "Join as Student" (should show student fields)
   - Fill in: City, Class/Grade, Board
   - Optional: School Code
   - Click "Continue"
   - Should redirect to home feed

2. **Admin Flow**:
   - Click "Join as School Admin" (should show admin fields)
   - Fill in: School Name, Address, Contact Number
   - Click "Continue"
   - Backend creates school and generates 6-character code
   - Should redirect to admin dashboard

### Debugging Tips

Open browser console (F12) to see debug logs:
- Route matching status
- Form data being sent
- API responses/errors

The logs will show:
```
Onboarding match: true
Onboarding params: { role: "student" }
Role from params: student
isStudent: true
```

## Current Code Status

✅ Frontend routing fixed
✅ Form submission logic corrected
✅ App name updated everywhere
✅ Loading states added
❌ Database not configured (you need to set this up)
❌ Authentication not configured (Replit Auth needs setup)

## Next Steps

1. Set up Neon database (instructions above)
2. Configure authentication (if using Replit Auth, add REPLIT_DB_URL to .env)
3. Test both student and admin flows
4. Check if data is being saved correctly

## Still Having Issues?

Check the console logs to see:
- Is the route matching? (`match: true`)
- What are the params? (`params: { role: "student" }`)
- What data is being sent to the API?
- What errors are coming back?

Share the console logs if you need more help debugging!
