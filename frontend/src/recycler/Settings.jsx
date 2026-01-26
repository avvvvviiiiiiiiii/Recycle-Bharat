import { useAuth } from '../context/AuthContext';
import { Building2, ShieldCheck, Mail, Calendar, Settings, Lock, Smartphone, Globe, Factory } from 'lucide-react';

export default function RecyclerSettings() {
    const { user } = useAuth();

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-white tracking-tight">Facility Governance</h1>
                <p className="text-slate-400">Manage your authorized facility credentials into the e-waste passport system.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col items-center text-center shadow-2xl">
                        <div className="w-24 h-24 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center mb-6 shadow-lg shadow-orange-500/10">
                            <Factory className="w-12 h-12 text-orange-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{user?.displayName || 'Authorized Facility'}</h3>
                        <p className="text-xs text-orange-400 font-bold uppercase tracking-widest px-3 py-1 bg-orange-500/10 rounded-full border border-orange-500/10 mb-4">
                            Official Recycler
                        </p>
                        <div className="w-full pt-6 border-t border-white/5 flex justify-between text-[10px] items-center">
                            <span className="text-slate-500 uppercase font-bold tracking-tighter">Verified Since</span>
                            <span className="text-slate-300 font-mono">JAN 2026</span>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-4">
                        <div className="flex items-center gap-3 text-xs">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span className="text-slate-400">Compliant with E-Waste Act 2024</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                            <Globe className="w-4 h-4 text-blue-400" />
                            <span className="text-slate-400">Global Processing Standard 2.1</span>
                        </div>
                    </div>
                </div>

                {/* Form Data */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl space-y-8">
                        <div>
                            <h4 className="text-sm font-bold text-slate-300 mb-6 flex items-center gap-2">
                                <Settings className="w-4 h-4 text-orange-400" /> Facility Profile
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <Building2 className="w-3 h-3" /> Facility Name
                                        </label>
                                        <p className="text-sm text-white font-medium p-3 bg-white/5 rounded-xl border border-white/5">
                                            {user?.displayName || 'Loading...'}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <ShieldCheck className="w-3 h-3" /> License Number
                                        </label>
                                        <p className="text-sm text-white font-medium p-3 bg-white/5 rounded-xl border border-white/5">
                                            {user?.organization || 'EP-VALID-XXXX'}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <Mail className="w-3 h-3" /> Registered Email
                                        </label>
                                        <p className="text-sm text-white font-medium p-3 bg-white/5 rounded-xl border border-white/5">
                                            {user?.email || 'Loading...'}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <Lock className="w-3 h-3" /> Security Level
                                        </label>
                                        <p className="text-sm text-emerald-400 font-black p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                                            HIGH (Role: Recycler)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5">
                            <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-orange-900/40">
                                Save Profile Changes
                            </button>
                        </div>
                    </div>

                    <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-start gap-4">
                        <div className="p-2 bg-red-500/10 rounded-lg">
                            <Lock className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <h5 className="text-sm font-bold text-red-400 mb-1">Danger Zone</h5>
                            <p className="text-xs text-red-500/60 leading-relaxed">
                                Modifying official facility details requires secondary government verification.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
