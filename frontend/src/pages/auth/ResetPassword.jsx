import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, ArrowLeft, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import appLogo from '@/applogo.png';
import axios from 'axios';

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });

    // Verify token on component mount
    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setStatus({
                    type: 'error',
                    message: 'Invalid reset link. Please request a new password reset.'
                });
                setIsVerifying(false);
                return;
            }

            try {
                const response = await axios.post('http://localhost:5000/api/auth/verify-reset-token', {
                    token
                });

                if (response.data.valid) {
                    setTokenValid(true);
                    setUserEmail(response.data.email);
                }
            } catch (err) {
                console.error('Token verification error:', err);
                setStatus({
                    type: 'error',
                    message: err.response?.data?.message || 'Invalid or expired reset token.'
                });
            } finally {
                setIsVerifying(false);
            }
        };

        verifyToken();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });

        // Validation
        if (formData.newPassword.length < 6) {
            setStatus({
                type: 'error',
                message: 'Password must be at least 6 characters long.'
            });
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setStatus({
                type: 'error',
                message: 'Passwords do not match.'
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
                token,
                newPassword: formData.newPassword
            });

            setStatus({
                type: 'success',
                message: response.data.message || 'Password reset successful!'
            });

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            console.error('Reset password error:', err);
            setStatus({
                type: 'error',
                message: err.response?.data?.message || 'Failed to reset password. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isVerifying) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="text-center">
                    <div className="animate-spin text-6xl mb-4">⏳</div>
                    <p className="text-slate-400">Verifying reset link...</p>
                </div>
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <img src={appLogo} alt="Recycle Bharat Logo" className="w-20 h-20 mx-auto drop-shadow-2xl" />
                        <h1 className="text-3xl font-bold tracking-tight text-white mt-4">recycleBharat</h1>
                    </div>

                    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3 mb-6">
                            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-red-400 text-sm font-medium">Invalid Reset Link</p>
                                <p className="text-red-300/80 text-sm mt-1">{status.message}</p>
                            </div>
                        </div>

                        <Button
                            onClick={() => navigate('/forgot-password')}
                            className="w-full h-11 text-base bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                        >
                            Request New Reset Link
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Back Button */}
            <button
                onClick={() => navigate('/login')}
                className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Login</span>
            </button>

            <div className="w-full max-w-md relative z-10">
                {/* Logo / Header */}
                <div className="text-center mb-8 space-y-4">
                    <img src={appLogo} alt="Recycle Bharat Logo" className="w-20 h-20 mx-auto drop-shadow-2xl" />
                    <h1 className="text-3xl font-bold tracking-tight text-white">recycleBharat</h1>
                    <div className="flex items-center justify-center gap-3">
                        <div className="bg-emerald-500/20 p-3 rounded-xl">
                            <Lock className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">Reset Password</h2>
                    </div>
                    {userEmail && (
                        <p className="text-slate-400 text-sm">
                            Resetting password for <span className="text-emerald-400 font-medium">{userEmail}</span>
                        </p>
                    )}
                </div>

                {/* Glass Card */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl ring-1 ring-white/5">
                    {/* Status Messages */}
                    {status.type === 'success' && (
                        <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-emerald-400 text-sm font-medium">Success!</p>
                                <p className="text-emerald-300/80 text-sm mt-1">{status.message}</p>
                                <p className="text-emerald-300/60 text-xs mt-2">Redirecting to login...</p>
                            </div>
                        </div>
                    )}

                    {status.type === 'error' && (
                        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-red-400 text-sm font-medium">Error</p>
                                <p className="text-red-300/80 text-sm mt-1">{status.message}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="newPassword" className="text-sm font-medium text-slate-300 ml-1">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    id="newPassword"
                                    name="newPassword"
                                    autoComplete="new-password"
                                    placeholder="Enter new password"
                                    className="pl-10 pr-10 bg-slate-950/50 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 text-white"
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 ml-1">Must be at least 6 characters</p>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-300 ml-1">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                                <Input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    autoComplete="new-password"
                                    placeholder="Confirm new password"
                                    className="pl-10 pr-10 bg-slate-950/50 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 text-white"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 text-base shadow-emerald-900/20 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 mt-6"
                            disabled={isLoading || status.type === 'success'}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin">⏳</span>
                                    Resetting Password...
                                </span>
                            ) : (
                                'Reset Password'
                            )}
                        </Button>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-xs text-slate-600">Secure • Transparent • Government Approved</p>
                </div>
            </div>
        </div>
    );
}
