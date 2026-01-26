import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Recycle, Truck, Factory, Building2, User } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialRole = searchParams.get('role') || 'citizen';

    const { login } = useAuth();
    const [role, setRole] = useState(initialRole);
    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Backend expects 'email', but UI says 'identifier'. Mapping it.
            const user = await login(formData.identifier, formData.password);

            // Check if the actual role matches the selected UI role tab
            const userRole = user.role.toLowerCase();
            if (userRole !== role && role !== 'government') {
                setError(`Access denied. Your account is registered as a ${user.role}, but you are trying to log in as a ${role}.`);
                setIsLoading(false);
                return;
            }

            // Navigate based on actual user role
            navigate(`/${userRole}/dashboard`);
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const roles = [
        { id: 'citizen', label: 'Citizen', icon: User, color: 'text-emerald-400' },
        { id: 'collector', label: 'Collector', icon: Truck, color: 'text-blue-400' },
        { id: 'recycler', label: 'Recycler', icon: Factory, color: 'text-orange-400' },
        { id: 'government', label: 'Official', icon: Building2, color: 'text-purple-400' },
    ];

    const CurrentIcon = roles.find(r => r.id === role)?.icon || User;

    // Helper to get registration path based on selected login tab
    const getRegisterPath = () => {
        if (role === 'citizen') return '/register';
        if (role === 'recycler') return '/register/recycler';
        if (role === 'collector') return '/register/collector';
        return '/register';
    };

    const getRegisterLabel = () => {
        if (role === 'citizen') return 'Create Account';
        if (role === 'recycler') return 'Register Facility';
        if (role === 'collector') return 'Register Agent';
        return 'Create Account';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black p-4 relative overflow-hidden">

            {/* Background Ambience */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10 p-1">

                {/* Logo / Header */}
                <div className="text-center mb-8 space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-900/20 border border-emerald-500/30 mb-4 shadow-xl backdrop-blur-sm">
                        <Recycle className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Recycle Bharat</h1>
                    <p className="text-slate-400">E-Waste Management & Tracking Application</p>
                </div>

                {/* Glass Card */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl ring-1 ring-white/5">

                    {/* Role Switcher */}
                    <div className="grid grid-cols-4 gap-2 mb-8 bg-slate-950/50 p-1.5 rounded-xl border border-white/5">
                        {roles.map((r) => (
                            <button
                                key={r.id}
                                onClick={() => setRole(r.id)}
                                className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-200 ${role === r.id ? 'bg-white/10 shadow-lg ring-1 ring-white/20' : 'hover:bg-white/5 text-slate-500'}`}
                            >
                                <r.icon className={`w-5 h-5 mb-1 ${role === r.id ? r.color : 'text-slate-500'}`} />
                                <span className={`text-[10px] font-medium ${role === r.id ? 'text-white' : 'text-slate-500'}`}>{r.label}</span>
                            </button>
                        ))}
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <CurrentIcon className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                                <Input
                                    type="email"
                                    id="identifier"
                                    name="identifier"
                                    autoComplete="username"
                                    placeholder="user@example.com"
                                    className="pl-10 bg-slate-950/50 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                                    value={formData.identifier}
                                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-medium text-slate-300">Password</label>
                                <a href="#" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">Forgot?</a>
                            </div>
                            <Input
                                type="password"
                                id="password"
                                name="password"
                                autoComplete="current-password"
                                placeholder="••••••••"
                                className="bg-slate-950/50 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <Button
                            variant="premium"
                            className="w-full mt-6 h-11 text-base shadow-emerald-900/20"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Authenticating...' : 'Access Dashboard'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-400">
                        New as a {role.charAt(0).toUpperCase() + role.slice(1)}?{' '}
                        <Link to={getRegisterPath()} className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                            {getRegisterLabel()}
                        </Link>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-xs text-slate-600">Secure • Transparent • Government Approved</p>
                </div>
            </div>
        </div>
    );
}
