# BookHive - Authentication & Authorization System

## 🔐 Authentication System Overview

BookHive now includes a complete authentication and role-based access control (RBAC) system that distinguishes between **Admin** and **User** roles.

## ✨ Features Implemented

### 1. **User Authentication**
- ✅ Login/Logout functionality
- ✅ User registration with role selection
- ✅ JWT token-based authentication
- ✅ Persistent sessions (localStorage)
- ✅ Secure password hashing with bcrypt

### 2. **Role-Based Access Control**
- ✅ **Admin Role**: Full access to create, read, update, and delete (CRUD) operations
- ✅ **User Role**: Read-only access - can view but cannot modify data
- ✅ Protected API endpoints with middleware
- ✅ UI elements dynamically shown/hidden based on role

### 3. **Protected Routes**
- ✅ All pages require authentication
- ✅ Automatic redirect to login for unauthenticated users
- ✅ Token validation on every request

## 🚀 How to Use

### **Getting Started**

1. **Start the Backend Server:**
```bash
cd Backend
npm start
```
Backend runs on `http://localhost:8060`

2. **Start the Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:3001`

### **Creating Accounts**

1. Click the preview button to open the application
2. You'll be redirected to the login page
3. Click "Register here" to create a new account
4. Fill in the registration form:
   - **Name**: Your full name
   - **Email**: Your email address
   - **Password**: Minimum 6 characters
   - **Role**: Choose "Admin" or "User"

### **User Roles Explained**

#### 👑 **Admin Role**
- Can add new books, orders, and users
- Can edit existing records
- Can delete records
- Has full CRUD permissions
- Sees all action buttons (Edit, Delete, Add)

#### 👤 **User Role**
- Can view all books, orders, and users
- **Cannot** add, edit, or delete any records
- Sees "🔒 View-only" message instead of action buttons
- Read-only access to all data

## 📋 Testing the System

### **Test Scenario 1: Admin Access**
1. Register an account with **Admin** role
2. Login with your credentials
3. Navigate to Books page
4. You should see:
   - ✅ "➕ Add New Book" button
   - ✅ "✏️ Edit" and "🗑️ Delete" buttons on each book
5. Try adding/editing/deleting a book - should work!

### **Test Scenario 2: User Access**
1. Logout from admin account
2. Register a new account with **User** role
3. Login with user credentials
4. Navigate to Books page
5. You should see:
   - ❌ No "Add New Book" button
   - ❌ "🔒 View-only mode" message instead of Edit/Delete buttons
6. Try to access the API directly - should get "Access denied" error

### **Test Scenario 3: Authentication Flow**
1. Logout from any account
2. Try to access `/books` directly
3. You should be redirected to `/login`
4. Login successfully
5. You'll be redirected back to the homepage

## 🔧 Technical Implementation

### **Backend Components**

#### **Authentication Controllers**
- `login.js`: Handles user login and JWT token generation
- `register.js`: Handles new user registration with password hashing

#### **Middleware**
- `auth.js`: 
  - `verifyToken`: Validates JWT tokens
  - `isAdmin`: Checks for admin role
  - `requireAdmin`: Combined middleware for admin-only routes

#### **Protected Routes**
All modification endpoints now require admin privileges:
```javascript
// Books
POST   /api/books      → requireAdmin
PUT    /api/books/:id  → requireAdmin
DELETE /api/books/:id  → requireAdmin
GET    /api/books      → Public

// Orders & Users follow same pattern
```

### **Frontend Components**

#### **Authentication Context**
- `AuthContext.jsx`: Provides authentication state globally
- Methods: `login()`, `register()`, `logout()`, `isAdmin()`, `isAuthenticated()`

#### **Protected Routes**
- `ProtectedRoute.jsx`: Wrapper component for authenticated routes
- Redirects to login if not authenticated
- Shows error message if insufficient permissions

#### **Login Page**
- `LoginPage.jsx`: Handles both login and registration
- Form validation
- Error handling
- Success messages

## 🎨 UI/UX Features

### **Navigation Bar**
- Shows user name and role badge when logged in
- Displays "👑 Admin" or "👤 User" indicator
- Logout button for authenticated users

### **Conditional Rendering**
- Admin sees all controls
- Users see "🔒 View-only" indicators
- Buttons automatically hidden based on role

## 🔒 Security Features

1. **Password Security**
   - Passwords hashed with bcrypt (10 rounds)
   - Never stored or transmitted in plain text

2. **Token Security**
   - JWT tokens expire after 24 hours
   - Tokens validated on every API request
   - Stored securely in localStorage

3. **API Protection**
   - All modification endpoints protected
   - Middleware validates both token and role
   - Returns 401/403 errors for unauthorized access

4. **Frontend Protection**
   - Protected routes require authentication
   - UI elements conditionally rendered
   - Axios interceptors add auth headers automatically

## 📊 API Endpoints

### **Authentication**
```
POST /api/auth/register  - Register new user
POST /api/auth/login     - Login user
```

### **Books (Protected)**
```
GET    /api/books      - Anyone can view
POST   /api/books      - Admin only
PUT    /api/books/:id  - Admin only
DELETE /api/books/:id  - Admin only
```

### **Orders (Protected)**
```
GET    /api/orders      - Anyone can view
POST   /api/orders      - Admin only
PUT    /api/orders/:id  - Admin only
DELETE /api/orders/:id  - Admin only
```

### **Users (Protected)**
```
GET    /api/users      - Anyone can view
POST   /api/users      - Admin only
PUT    /api/users/:id  - Admin only
DELETE /api/users/:id  - Admin only
```

## 🐛 Troubleshooting

### **"Failed to add book" error**
- Make sure you're logged in as an **Admin**
- Check that MongoDB is connected (look for "✅ MongoDB Connected Successfully")
- Verify your IP is whitelisted in MongoDB Atlas

### **Can't see edit/delete buttons**
- This is normal for **User** role accounts
- Only **Admin** accounts can modify data
- Create an admin account or login with one

### **Token expired error**
- Tokens expire after 24 hours
- Simply logout and login again
- Tokens are automatically refreshed on login

### **"Access denied" errors**
- You're trying to access admin-only features with a user account
- Register/login with an admin account for full access

## 🎯 Next Steps

You can now:
1. ✅ Create admin accounts for management
2. ✅ Create user accounts for viewing data
3. ✅ Test role-based permissions
4. ✅ Securely manage your bookstore data

## 📝 Notes

- **First time setup**: You'll need to register at least one admin account
- **Multiple admins**: You can create multiple admin accounts
- **MongoDB Atlas**: Make sure your IP is whitelisted (see earlier instructions)
- **Development mode**: Currently using localStorage for tokens (consider httpOnly cookies for production)

---

**Enjoy your secure BookHive application! 📚🔐**
