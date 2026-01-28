import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building2, ArrowRight, UserCheck, Mail, Lock, Landmark, Eye, EyeOff } from 'lucide-react';
import api from '@/services/api';

export default function GovernmentRegister() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        departmentName: ''
    });
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
                email: formData.email,
                password: formData.password,
                role: 'GOVT',
                full_name: formData.fullName,
                organization: formData.departmentName
            });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-[#1e293b] to-black p-4 relative overflow-hidden">

            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 translate-y-1/2" />

            <div className="w-full max-w-xl relative z-10">
                <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl ring-1 ring-white/5">

                    <div className="flex flex-col items-center text-center mb-10">
                        <div className="w-20 h-20 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/10">
                            <Landmark className="w-10 h-10 text-indigo-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Government Portal</h1>
                        <p className="text-slate-400 max-w-sm">Create an official account for departmental oversight and analytics.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
                            <div className="w-1 h-8 bg-red-500 rounded-full" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 col-span-full md:col-span-1">
                            <label className="text-sm font-medium text-slate-300 ml-1 flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-indigo-400/60" /> Official Name
                            </label>
                            <Input
                                placeholder="Officer Name"
                                className="h-12 bg-slate-950/50 border-white/10 focus:border-indigo-500/50"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2 col-span-full md:col-span-1">
                            <label className="text-sm font-medium text-slate-300 ml-1 flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-indigo-400/60" /> Department
                            </label>
                            <Input
                                placeholder="e.g. PCB / Municipal Corp"
                                className="h-12 bg-slate-950/50 border-white/10 focus:border-indigo-500/50"
                                value={formData.departmentName}
                                onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2 col-span-full">
                            <label className="text-sm font-medium text-slate-300 ml-1 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-indigo-400/60" /> Official Email
                            </label>
                            <Input
                                type="email"
                                placeholder="officer@gov.in"
                                className="h-12 bg-slate-950/50 border-white/10 focus:border-indigo-500/50"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2 col-span-full">
                            <label htmlFor="password" className="text-sm font-medium text-slate-300 ml-1 flex items-center gap-2">
                                <Lock className="w-4 h-4 text-indigo-400/60" /> Secure Password
                            </label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="••••••••"
                                    className="h-12 bg-slate-950/50 border-white/10 focus:border-indigo-500/50 pr-12"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-200 transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2 col-span-full">
                            <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-300 ml-1 flex items-center gap-2">
                                <Lock className="w-4 h-4 text-indigo-400/60" /> Confirm Password
                            </label>
                            <div className="relative">
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    placeholder="••••••••"
                                    className="h-12 bg-slate-950/50 border-white/10 focus:border-indigo-500/50 pr-12"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-200 transition-colors"
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            variant="premium"
                            className="w-full h-12 text-lg font-bold group col-span-full mt-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 border-none shadow-lg shadow-indigo-900/20"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Register Official Account'}
                            {!loading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                        </Button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center text-sm text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login?role=government" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors underline underline-offset-4 decoration-indigo-500/30 hover:decoration-indigo-400">
                            Sign in here
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
