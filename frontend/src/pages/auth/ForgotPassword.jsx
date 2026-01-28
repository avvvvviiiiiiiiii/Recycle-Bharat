import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import appLogo from '@/applogo.png';
import axios from 'axios';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const role = searchParams.get('role') || 'citizen';

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' }); // type: 'success' | 'error' | ''

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/forgot-password', {
                email
            });

            setStatus({
                type: 'success',
                message: response.data.message || 'Password reset link sent! Please check your email.'
            });

            // Clear the email field after successful submission
            setEmail('');

        } catch (err) {
            console.error('Forgot password error:', err);
            setStatus({
                type: 'error',
                message: err.response?.data?.message || 'Failed to send reset link. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Back Button */}
            <button
                onClick={() => navigate(`/login?role=${role}`)}
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
                            <Mail className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">Forgot Password</h2>
                    </div>
                    <p className="text-slate-400 text-sm">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
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

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-slate-300 ml-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                                <Input
                                    type="email"
                                    id="email"
                                    name="email"
                                    autoComplete="email"
                                    placeholder="user@example.com"
                                    className="pl-10 bg-slate-950/50 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 text-white"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 text-base shadow-emerald-900/20 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin">⏳</span>
                                    Sending Reset Link...
                                </span>
                            ) : (
                                'Send Reset Link'
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-400">
                        Remember your password?{' '}
                        <button
                            onClick={() => navigate(`/login?role=${role}`)}
                            className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                        >
                            Back to Login
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-xs text-slate-600">Secure • Transparent • Government Approved</p>
                </div>
            </div>
        </div>
    );
}
