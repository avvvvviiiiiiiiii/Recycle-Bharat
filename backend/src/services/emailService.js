const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        // Create a transporter using environment variables
        // For development, you can use services like Ethereal Email or Gmail
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: process.env.EMAIL_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    /**
     * Send password reset email
     * @param {string} to - Recipient email address
     * @param {string} resetToken - Password reset token
     * @param {string} userName - User's full name
     */
    async sendPasswordResetEmail(to, resetToken, userName) {
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: `"Recycle Bharat" <${process.env.EMAIL_USER}>`,
            to,
            subject: 'Password Reset Request - Recycle Bharat',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 20px auto;
                            background: #ffffff;
                            border-radius: 10px;
                            overflow: hidden;
                            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                        }
                        .header {
                            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                            color: white;
                            padding: 30px;
                            text-align: center;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 28px;
                        }
                        .content {
                            padding: 40px 30px;
                        }
                        .content p {
                            margin: 15px 0;
                            color: #555;
                        }
                        .button {
                            display: inline-block;
                            padding: 14px 30px;
                            margin: 25px 0;
                            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                            color: white;
                            text-decoration: none;
                            border-radius: 8px;
                            font-weight: bold;
                            transition: transform 0.2s;
                        }
                        .button:hover {
                            transform: translateY(-2px);
                        }
                        .footer {
                            background: #f8f9fa;
                            padding: 20px;
                            text-align: center;
                            color: #666;
                            font-size: 12px;
                            border-top: 1px solid #e0e0e0;
                        }
                        .warning {
                            background: #fff3cd;
                            border-left: 4px solid #ffc107;
                            padding: 15px;
                            margin: 20px 0;
                            border-radius: 4px;
                        }
                        .token-box {
                            background: #f8f9fa;
                            padding: 15px;
                            border-radius: 6px;
                            font-family: monospace;
                            word-break: break-all;
                            margin: 15px 0;
                            border: 1px solid #e0e0e0;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔒 Password Reset Request</h1>
                        </div>
                        <div class="content">
                            <p>Hello <strong>${userName}</strong>,</p>
                            <p>We received a request to reset your password for your Recycle Bharat account.</p>
                            <p>Click the button below to reset your password:</p>
                            <div style="text-align: center;">
                                <a href="${resetUrl}" class="button">Reset Password</a>
                            </div>
                            <p>Or copy and paste this link into your browser:</p>
                            <div class="token-box">${resetUrl}</div>
                            <div class="warning">
                                <strong>⚠️ Security Notice:</strong>
                                <ul style="margin: 10px 0; padding-left: 20px;">
                                    <li>This link will expire in <strong>1 hour</strong></li>
                                    <li>If you didn't request this reset, please ignore this email</li>
                                    <li>Never share this link with anyone</li>
                                </ul>
                            </div>
                            <p>If you have any questions, please contact our support team.</p>
                            <p>Best regards,<br><strong>Recycle Bharat Team</strong></p>
                        </div>
                        <div class="footer">
                            <p>This is an automated email. Please do not reply to this message.</p>
                            <p>&copy; ${new Date().getFullYear()} Recycle Bharat. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        try {
            // If email credentials are not configured, log the reset URL instead
            if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
                console.log('\n===========================================');
                console.log('📧 EMAIL SERVICE NOT CONFIGURED');
                console.log('===========================================');
                console.log(`To: ${to}`);
                console.log(`Subject: ${mailOptions.subject}`);
                console.log(`Reset URL: ${resetUrl}`);
                console.log('===========================================\n');
                return { success: true, message: 'Email service not configured. Reset URL logged to console.' };
            }

            const info = await this.transporter.sendMail(mailOptions);
            console.log('Password reset email sent:', info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('Error sending password reset email:', error);
            // Still log the URL for development purposes
            console.log('\n===========================================');
            console.log('📧 EMAIL SEND FAILED - FALLBACK URL');
            console.log('===========================================');
            console.log(`Reset URL: ${resetUrl}`);
            console.log('===========================================\n');
            throw error;
        }
    }

    /**
     * Send password reset confirmation email
     * @param {string} to - Recipient email address
     * @param {string} userName - User's full name
     */
    async sendPasswordResetConfirmation(to, userName) {
        const mailOptions = {
            from: `"Recycle Bharat" <${process.env.EMAIL_USER}>`,
            to,
            subject: 'Password Successfully Reset - Recycle Bharat',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 20px auto;
                            background: #ffffff;
                            border-radius: 10px;
                            overflow: hidden;
                            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                        }
                        .header {
                            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                            color: white;
                            padding: 30px;
                            text-align: center;
                        }
                        .content {
                            padding: 40px 30px;
                        }
                        .footer {
                            background: #f8f9fa;
                            padding: 20px;
                            text-align: center;
                            color: #666;
                            font-size: 12px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>✅ Password Reset Successful</h1>
                        </div>
                        <div class="content">
                            <p>Hello <strong>${userName}</strong>,</p>
                            <p>Your password has been successfully reset.</p>
                            <p>If you did not make this change, please contact our support team immediately.</p>
                            <p>Best regards,<br><strong>Recycle Bharat Team</strong></p>
                        </div>
                        <div class="footer">
                            <p>&copy; ${new Date().getFullYear()} Recycle Bharat. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        try {
            if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
                console.log('Password reset confirmation email would be sent to:', to);
                return { success: true, message: 'Email service not configured.' };
            }

            const info = await this.transporter.sendMail(mailOptions);
            console.log('Password reset confirmation email sent:', info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('Error sending confirmation email:', error);
            // Don't throw error for confirmation emails
            return { success: false, error: error.message };
        }
    }
}

module.exports = new EmailService();
