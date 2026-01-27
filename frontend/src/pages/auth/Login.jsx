import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Recycle, Truck, Factory, Building2, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import appLogo from '@/applogo.png';

export default function RoleLogin() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const role = searchParams.get('role') || 'citizen';

    const { login } = useAuth();
    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const user = await login(formData.identifier, formData.password);
            const userRole = user.role.toLowerCase();

            if (userRole !== role && role !== 'government') {
                setError(`Access denied. Your account is registered as a ${user.role}, but you are trying to log in as a ${role}.`);
                setIsLoading(false);
                return;
            }

            navigate(`/${userRole}/dashboard`);
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const roleConfig = {
        citizen: {
            title: 'Citizen Login',
            icon: User,
            color: 'emerald',
            registerPath: '/register',
            registerLabel: 'Create Citizen Account'
        },
        collector: {
            title: 'Collector Login',
            icon: Truck,
            color: 'blue',
            registerPath: '/register/collector',
            registerLabel: 'Register as Collector'
        },
        recycler: {
            title: 'Recycler Login',
            icon: Factory,
            color: 'orange',
            registerPath: '/register/recycler',
            registerLabel: 'Register Recycling Facility'
        },
        government: {
            title: 'Government Login',
            icon: Building2,
            color: 'purple',
            registerPath: '/register',
            registerLabel: 'Contact Administrator'
        }
    };

    const config = roleConfig[role] || roleConfig.citizen;
    const Icon = config.icon;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-${config.color}-500/10 rounded-full blur-[120px] pointer-events-none`} />

            {/* Back Button */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
            </button>

            <div className="w-full max-w-md relative z-10">
                {/* Logo / Header */}
                <div className="text-center mb-8 space-y-4">
                    <img src={appLogo} alt="Recycle Bharat Logo" className="w-20 h-20 mx-auto drop-shadow-2xl" />
                    <h1 className="text-3xl font-bold tracking-tight text-white">recycleBharat</h1>
                    <div className="flex items-center justify-center gap-3">
                        <div className={`bg-${config.color}-500/20 p-3 rounded-xl`}>
                            <Icon className={`w-6 h-6 text-${config.color}-400`} />
                        </div>
                        <h2 className="text-xl font-semibold text-white">{config.title}</h2>
                    </div>
                </div>



                {/* Glass Card */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl ring-1 ring-white/5">
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
                                <Icon className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                                <Input
                                    type="email"
                                    id="identifier"
                                    name="identifier"
                                    autoComplete="username"
                                    placeholder="user@example.com"
                                    className="pl-10 bg-slate-950/50 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 text-white"
                                    value={formData.identifier}
                                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-medium text-slate-300">Password</label>
                                <a href="#" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                                    Forgot?
                                </a>
                            </div>
                            <Input
                                type="password"
                                id="password"
                                name="password"
                                autoComplete="current-password"
                                placeholder="••••••••"
                                className="bg-slate-950/50 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 text-white"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className={`w-full mt-6 h-11 text-base shadow-${config.color}-900/20 bg-gradient-to-r from-${config.color}-600 to-${config.color}-700 hover:from-${config.color}-700 hover:to-${config.color}-800`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Authenticating...' : 'Access Dashboard'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-400">
                        New as a {role.charAt(0).toUpperCase() + role.slice(1)}?{' '}
                        <Link
                            to={config.registerPath}
                            className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                        >
                            {config.registerLabel}
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
