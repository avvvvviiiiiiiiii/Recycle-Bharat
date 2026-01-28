# Forgot Password Feature

## Overview
The forgot password feature allows users to securely reset their passwords via email verification.

## Features Implemented

### Backend
1. **Database Schema** (`backend/src/db/schema.sql`)
   - Added `password_reset_tokens` table to store secure reset tokens
   - Tokens are hashed using SHA-256 for security
   - Tokens expire after 1 hour
   - Tokens can only be used once

2. **Email Service** (`backend/src/services/emailService.js`)
   - Professional HTML email templates
   - Password reset email with secure link
   - Password reset confirmation email
   - Fallback to console logging when email is not configured

3. **Auth Controller** (`backend/src/controllers/authController.js`)
   - `requestPasswordReset` - Generates token and sends reset email
   - `verifyResetToken` - Validates reset token
   - `resetPassword` - Updates password with valid token

4. **API Endpoints** (`backend/src/routes/authRoutes.js`)
   - `POST /api/auth/forgot-password` - Request password reset
   - `POST /api/auth/verify-reset-token` - Verify token validity
   - `POST /api/auth/reset-password` - Reset password

### Frontend
1. **Forgot Password Page** (`frontend/src/pages/auth/ForgotPassword.jsx`)
   - Clean, modern UI with glassmorphism design
   - Email input with validation
   - Success/error status messages
   - Maintains role context for navigation

2. **Reset Password Page** (`frontend/src/pages/auth/ResetPassword.jsx`)
   - Token verification on page load
   - Password strength validation (minimum 6 characters)
   - Password confirmation matching
   - Show/hide password toggles
   - Auto-redirect to login after successful reset

3. **Updated Login Page** (`frontend/src/pages/auth/Login.jsx`)
   - "Forgot?" link now navigates to forgot password page
   - Maintains role parameter for better UX

## Setup Instructions

### 1. Update Database Schema
Run the updated schema to create the password_reset_tokens table:

```bash
# Connect to your PostgreSQL database
psql -U postgres -d recycle_bharat -f backend/src/db/schema.sql
```

### 2. Configure Email (Optional)
Create a `.env` file in the `backend` directory (use `.env.example` as template):

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173
```

**For Gmail:**
1. Enable 2-factor authentication
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password in `EMAIL_PASSWORD`

**Note:** If email is not configured, reset links will be logged to the console for development.

### 3. Install Dependencies
```bash
cd backend
npm install nodemailer
```

### 4. Test the Feature

#### Test Flow:
1. Navigate to login page
2. Click "Forgot?" link
3. Enter your email address
4. Check email (or console logs) for reset link
5. Click the reset link
6. Enter new password
7. Login with new password

#### API Testing with cURL:

**Request Password Reset:**
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

**Verify Token:**
```bash
curl -X POST http://localhost:5000/api/auth/verify-reset-token \
  -H "Content-Type: application/json" \
  -d '{"token":"your-token-here"}'
```

**Reset Password:**
```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"your-token-here","newPassword":"newpassword123"}'
```

## Security Features

1. **Token Hashing**: Tokens are hashed with SHA-256 before storage
2. **Token Expiration**: Tokens expire after 1 hour
3. **Single Use**: Tokens are marked as used after password reset
4. **Email Enumeration Prevention**: Same response for existing/non-existing emails
5. **Password Validation**: Minimum 6 characters required
6. **Secure Random Tokens**: 32-byte cryptographically secure random tokens

## User Flow

```
Login Page
    ↓ (Click "Forgot?")
Forgot Password Page
    ↓ (Enter email)
Email Sent Confirmation
    ↓ (Click link in email)
Reset Password Page
    ↓ (Enter new password)
Success Message
    ↓ (Auto-redirect after 2s)
Login Page
```

## Troubleshooting

### Email not sending
- Check console logs - the reset URL will be printed there
- Verify EMAIL_USER and EMAIL_PASSWORD in .env
- For Gmail, ensure you're using an App Password, not your regular password
- Check that 2FA is enabled on your Google account

### Token invalid/expired
- Tokens expire after 1 hour
- Request a new password reset
- Check that the token in the URL matches the one in the database

### Database errors
- Ensure the password_reset_tokens table exists
- Run the schema.sql file to create the table
- Check database connection settings in .env

## Files Modified/Created

### Backend
- ✅ `backend/src/db/schema.sql` - Added password_reset_tokens table
- ✅ `backend/src/services/emailService.js` - New email service
- ✅ `backend/src/controllers/authController.js` - Added password reset methods
- ✅ `backend/src/routes/authRoutes.js` - Added password reset routes
- ✅ `backend/.env.example` - Environment configuration template
- ✅ `backend/package.json` - Added nodemailer dependency

### Frontend
- ✅ `frontend/src/pages/auth/ForgotPassword.jsx` - New forgot password page
- ✅ `frontend/src/pages/auth/ResetPassword.jsx` - New reset password page
- ✅ `frontend/src/pages/auth/Login.jsx` - Updated forgot password link
- ✅ `frontend/src/App.jsx` - Added new routes

## Future Enhancements

1. **Rate Limiting**: Limit password reset requests per email
2. **SMS Verification**: Add SMS-based password reset option
3. **Security Questions**: Additional verification layer
4. **Password History**: Prevent reuse of recent passwords
5. **Account Lockout**: Lock account after multiple failed attempts
6. **Email Templates**: More customizable email templates
7. **Multi-language Support**: Localized email templates
