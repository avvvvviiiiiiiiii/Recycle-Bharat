# ✅ Unified Auth Hub Implemented

## 🚀 Concept
The user requested that the **Registration** flow happen on the **Landing Page**, just like Login, instead of navigating away.

## 🛠️ Implementation
I completely rebuilt the **Authentication Section** in `Login.jsx` to be a "Unified Hub".

### 1. View Toggling
- Added a `viewMode` state (`'login'` vs `'register'`).
- The form title dynamically changes: "Citizen Login" <-> "Register as Citizen".
- The visible form swaps instantly with **no page reload**.

### 2. Dynamic Registration Form
The registration form automatically adapts based on the selected role:
- **Citizen:** Standard fields (Name, Email, Password).
- **Collector:** Adds **Aadhar Number** field.
- **Recycler:** Adds **Facility Name** and **Phone** fields.
- **Government:** Adds **Department** field.

### 3. Integrated Flow
- Clicking "Create Account" simply toggles the form on the same page.
- Registration submits to the backend API directly.
- On success, it alerts the user and switches back to Login mode for immediate sign-in.

## 🎨 Animations
I wrapped the toggle in `<AnimatePresence mode="wait">` so the switch between Login and Register is smooth and animated.

## 🧪 How to Test
1.  Select a Role (e.g., Collector).
2.  Click **"Create Account"** (at the bottom or on the card).
3.  Fill out the form (notice the "Aadhar Number" field!).
4.  Register -> Get Success Alert -> Form switches back to Login.
5.  Login immediately.
