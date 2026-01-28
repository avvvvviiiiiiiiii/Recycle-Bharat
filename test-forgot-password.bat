@echo off
echo Testing Forgot Password API...
echo.

curl -X POST http://localhost:5000/api/auth/forgot-password ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\"}"

echo.
echo.
echo Check the backend console for the reset URL!
pause
