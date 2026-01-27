import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Recycle, ArrowRight, Eye, EyeOff } from 'lucide-react';

import api from '@/services/api';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ full_name: '', email: '', password: '', confirmPassword: '', role: 'citizen' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            await api.post('/auth/register', {
                full_name: formData.full_name,
                email: formData.email,
                password: formData.password,
                role: 'CITIZEN' // Backend expects uppercase
            });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black p-4 relative overflow-hidden">

            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 translate-y-1/2" />

            <div className="w-full max-w-lg relative z-10">

                <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-2xl shadow-2xl ring-1 ring-white/5">

                    <div className="flex items-center gap-3 mb-8">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                            <Recycle className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white leading-tight">Create Citizen Account</h1>
                            <p className="text-xs text-slate-500 font-medium">Citizen Registration Portal</p>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
                            <Input
                                type="text"
                                id="full_name"
                                name="full_name"
                                autoComplete="name"
                                placeholder="John Doe"
                                className="bg-slate-950/50 border-white/10 focus:border-emerald-500/50"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                autoComplete="username"
                                placeholder="john@example.com"
                                className="bg-slate-950/50 border-white/10 focus:border-emerald-500/50"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-slate-300 ml-1">Set Password</label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    autoComplete="new-password"
                                    placeholder="Create a strong password"
                                    className="bg-slate-950/50 border-white/10 focus:border-emerald-500/50 pr-10"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-300 ml-1">Confirm Password</label>
                            <div className="relative">
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    autoComplete="new-password"
                                    placeholder="Confirm your password"
                                    className="bg-slate-950/50 border-white/10 focus:border-emerald-500/50 pr-10"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 transition-colors"
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            variant="premium"
                            className="w-full mt-4 h-11 text-base group"
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Register Citizen Account'}
                            {!loading && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 space-y-4 text-center">
                        <div className="text-sm text-slate-400">
                            Already have an identity?{' '}
                            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                                Sign in here
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}