import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Truck, ArrowRight, UserCheck, Mail, Lock, Phone } from 'lucide-react';
import api from '@/services/api';

export default function CollectorRegister() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        vehicleDetails: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/auth/register', {
                email: formData.email,
                password: formData.password,
                role: 'COLLECTOR',
                full_name: formData.fullName,
                organization: formData.vehicleDetails
            });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-900 via-[#121b2b] to-black p-4 relative overflow-hidden">

            <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

            <div className="w-full max-w-xl relative z-10">
                <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl ring-1 ring-white/5">

                    <div className="flex flex-col items-center text-center mb-10">
                        <div className="w-20 h-20 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/10">
                            <Truck className="w-10 h-10 text-blue-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Agent Application</h1>
                        <p className="text-slate-400 max-w-sm">Apply to become an authorized e-waste collection agent in your region.</p>
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
                                <UserCheck className="w-4 h-4 text-blue-400/60" /> Full Name
                            </label>
                            <Input
                                placeholder="Alex Carter"
                                className="h-12 bg-slate-950/50 border-white/10 focus:border-blue-500/50"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2 col-span-full md:col-span-1">
                            <label className="text-sm font-medium text-slate-300 ml-1 flex items-center gap-2">
                                <Truck className="w-4 h-4 text-blue-400/60" /> Vehicle Model
                            </label>
                            <Input
                                placeholder="Ford Transit (ABC-123)"
                                className="h-12 bg-slate-950/50 border-white/10 focus:border-blue-500/50"
                                value={formData.vehicleDetails}
                                onChange={(e) => setFormData({ ...formData, vehicleDetails: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2 col-span-full">
                            <label className="text-sm font-medium text-slate-300 ml-1 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-blue-400/60" /> Email Address
                            </label>
                            <Input
                                type="email"
                                placeholder="alex@logistics.com"
                                className="h-12 bg-slate-950/50 border-white/10 focus:border-blue-500/50"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2 col-span-full">
                            <label className="text-sm font-medium text-slate-300 ml-1 flex items-center gap-2">
                                <Lock className="w-4 h-4 text-blue-400/60" /> Account Password
                            </label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                className="h-12 bg-slate-950/50 border-white/10 focus:border-blue-500/50"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        <Button
                            variant="premium"
                            className="w-full h-12 text-lg font-bold group col-span-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border-none shadow-lg shadow-blue-900/20"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Apply for Access'}
                            {!loading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                        </Button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center text-sm text-slate-400">
                        Already an agent?{' '}
                        <Link to="/login?role=collector" className="text-blue-400 hover:text-blue-300 font-bold transition-colors underline underline-offset-4 decoration-blue-500/30 hover:decoration-blue-400">
                            Log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}