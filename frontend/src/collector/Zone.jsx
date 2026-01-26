import React from 'react';
import { MapPin, Globe, Shield, Users, Zap, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CollectorZone() {
    const { user } = useAuth();

    const stats = [
        { label: 'Active Reach', value: '4.2 km', icon: MapPin, color: 'text-blue-400' },
        { label: 'Zone Capacity', value: '85%', icon: Zap, color: 'text-amber-400' },
        { label: 'Sector Rank', value: '#12', icon: Award, color: 'text-emerald-400' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Zone Management</h1>
                <p className="text-slate-500 font-medium">Monitoring your assigned logistical sector and service performance.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile & Organization Card */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-blue-500/10 transition-colors" />

                        <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-blue-500/20">
                                {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase()}
                            </div>

                            <div className="flex-1 text-center md:text-left space-y-4">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">{user?.displayName || 'Authorized Agent'}</h2>
                                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1 flex items-center justify-center md:justify-start gap-2">
                                        <Shield size={12} className="text-blue-500" /> Professional Certification Active
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Affiliated Organization</p>
                                        <p className="font-bold text-slate-700 text-sm truncate">{user?.organization || 'Independent Operator'}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Operational ID</p>
                                        <p className="font-mono font-bold text-blue-600 text-sm">AGT-{user?._id?.slice(-6).toUpperCase()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Zone Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stats.map((s, i) => (
                            <div key={i} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-2 rounded-xl bg-slate-50 ${s.color}`}>
                                        <s.icon size={20} />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Live</span>
                                </div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</h4>
                                <p className="text-2xl font-black text-slate-800 mt-1">{s.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Service Map Sidebar Component */}
                <div className="space-y-6">
                    <div className="bg-slate-900 rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent" />

                        <div className="relative z-10 space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-white font-bold text-lg">Service Radius</h3>
                                <Globe className="text-blue-400 w-5 h-5 animate-pulse" />
                            </div>

                            <div className="aspect-square rounded-full border-4 border-dashed border-blue-500/20 flex items-center justify-center relative">
                                <div className="absolute inset-4 rounded-full border-4 border-blue-500/10" />
                                <div className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] z-20" />
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-tighter">Current Base</p>
                                    <p className="text-[8px] text-slate-500 font-bold uppercase">Central Sector</p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400 font-bold">Signal Strength</span>
                                    <span className="text-emerald-400 font-black tracking-widest uppercase">Excellent</span>
                                </div>
                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="w-full h-full bg-emerald-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <Users className="text-blue-500 w-5 h-5" />
                            <h3 className="font-bold text-slate-800 text-sm">Zone Activity</h3>
                        </div>
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    <div className="flex-1 h-2 bg-slate-50 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500/20" style={{ width: `${Math.random() * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
