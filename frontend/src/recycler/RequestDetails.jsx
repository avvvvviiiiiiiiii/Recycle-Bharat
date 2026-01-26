import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useDevice } from '../hooks/useDevices';
import { useRecycler } from '../hooks/useRecycler';
import {
    ArrowLeft, Truck, CheckCircle2, Factory, Recycle,
    Loader2, MapPin, User, ShieldCheck, X, AlertCircle, Info
} from 'lucide-react';

export default function RequestDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: device, isLoading: isLoadingDevice, error: deviceError } = useDevice(id);
    const {
        collectors, assignCollector, isAssigning,
        confirmDelivery, isDelivering,
        markRecycled, isRecycling
    } = useRecycler();

    const [selectedCollector, setSelectedCollector] = useState('');
    const [duc, setDuc] = useState('');
    const [isPrompted, setIsPrompted] = useState(false);
    const [verificationError, setVerificationError] = useState('');

    const handleAssign = () => {
        if (!selectedCollector) return;
        assignCollector({ deviceId: id, collectorId: selectedCollector }, {
            onSuccess: () => navigate('/recycler/dashboard')
        });
    };

    const handleFinalize = async () => {
        if (duc.length !== 6) return setVerificationError('DUC must be 6 digits');
        setVerificationError('');
        try {
            await confirmDelivery({ deviceId: id, duc });
            navigate('/recycler/dashboard');
        } catch (err) {
            setVerificationError(err.response?.data?.error || 'Verification failed');
        }
    };

    if (isLoadingDevice) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-orange-500 w-10 h-10" /></div>;

    if (deviceError || !device) return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-red-500/5 border border-red-500/10 rounded-3xl text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-bold text-white">Request Not Found</h2>
            <p className="text-slate-400 text-sm">We couldn't retrieve the details for this recycling request.</p>
            <Button onClick={() => navigate(-1)} variant="outline">Go Back</Button>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-slate-400 hover:text-white pl-0 gap-2 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Operations
            </Button>

            {/* Header Content */}
            <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="relative z-10 space-y-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight">Recycle Request #{device.uid}</h1>
                            <p className="text-slate-400 mt-1">Status: <span className="text-orange-400 font-black uppercase tracking-tighter">{device.status.replace(/_/g, ' ')}</span></p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-right">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Created On</span>
                            <span className="text-sm text-white font-medium">{new Date(device.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/5 pt-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                <Factory className="w-3.5 h-3.5 text-orange-400" /> Device Specifications
                            </div>
                            <div className="space-y-1">
                                <div className="text-xl font-bold text-white">{device.model}</div>
                                <p className="text-sm text-slate-400 leading-relaxed">{device.description}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                <User className="w-3.5 h-3.5 text-orange-400" /> Originating Citizen
                            </div>
                            <div className="space-y-1">
                                <div className="text-lg font-bold text-white">{device.ownerId?.email || 'N/A'}</div>
                                <p className="text-sm text-slate-500 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> Mumbai Metropolitan Region
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logic Branch: If Requested -> Assign Collector. If Collected -> Finalize. */}
            {device.status === 'RECYCLING_REQUESTED' && (
                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl space-y-8">
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-xl">
                                <Truck className="w-5 h-5 text-blue-400" />
                            </div>
                            Logistics Assignment
                        </h3>
                        <p className="text-sm text-slate-400">Dispatch an authorized collection agent to retrieve this asset from the citizen.</p>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Available Recovery Agents</label>
                        <div className="grid grid-cols-1 gap-4">
                            {collectors.length === 0 ? (
                                <p className="text-xs text-slate-500 italic p-6 bg-white/5 rounded-2xl text-center border border-dashed border-white/10">No agents currently available in this sector.</p>
                            ) : (
                                collectors.map(c => (
                                    <div
                                        key={c._id}
                                        onClick={() => setSelectedCollector(c._id)}
                                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center group ${selectedCollector === c._id ? 'bg-blue-500/10 border-blue-500/50 shadow-lg shadow-blue-500/10' : 'bg-white/5 border-white/5 hover:border-white/10'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-colors ${selectedCollector === c._id ? 'bg-blue-500 text-white' : 'bg-white/10 text-slate-400'
                                                }`}>
                                                {c.displayName?.[0] || 'A'}
                                            </div>
                                            <div>
                                                <div className="text-white font-bold">{c.displayName || c.email}</div>
                                                <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">{c.organization || 'Independent Agent'}</div>
                                            </div>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedCollector === c._id ? 'border-blue-500 bg-blue-500' : 'border-slate-700'
                                            }`}>
                                            {selectedCollector === c._id && <CheckCircle2 className="w-3 h-3 text-white" />}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <Button
                        onClick={handleAssign}
                        disabled={!selectedCollector || isAssigning}
                        className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-900/20 text-md gap-3"
                    >
                        {isAssigning ? <Loader2 className="animate-spin w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                        AUTHORIZE DISPATCH
                    </Button>
                </div>
            )}

            {device.status === 'COLLECTED' && (
                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl space-y-8">
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                            <div className="p-2 bg-orange-500/10 rounded-xl">
                                <Factory className="w-5 h-5 text-orange-400" />
                            </div>
                            Finalize Asset Recovery
                        </h3>
                        <p className="text-sm text-slate-400">Verify the physical handover from the collector using the citizen's 6-digit DUC.</p>
                    </div>

                    <div className="p-8 bg-slate-950/50 rounded-3xl border border-white/10 flex flex-col items-center gap-6">
                        <div className="w-full max-w-xs space-y-4">
                            <div className="flex justify-between items-center px-1">
                                <label htmlFor="duc_input" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Enter Handover DUC</label>
                                {verificationError && <span className="text-[10px] text-red-500 font-bold uppercase">{verificationError}</span>}
                            </div>
                            <input
                                id="duc_input"
                                name="duc_input"
                                type="text"
                                maxLength={6}
                                value={duc}
                                onChange={(e) => setDuc(e.target.value.replace(/\D/g, ''))}
                                placeholder="••••••"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 text-center text-4xl font-black text-white tracking-[0.5em] focus:border-orange-500 outline-none transition-all shadow-inner"
                            />
                        </div>

                        <div className="text-center space-y-2">
                            <p className="text-xs text-slate-500 flex items-center gap-2 justify-center">
                                <Info className="w-3 h-3" /> Obtaining DUC verifies the physical asset has changed custody.
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={handleFinalize}
                        disabled={duc.length !== 6 || isDelivering}
                        className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black rounded-2xl shadow-xl shadow-orange-900/20 text-md gap-3 border-none"
                    >
                        {isDelivering ? <Loader2 className="animate-spin w-5 h-5" /> : <Recycle className="w-5 h-5" />}
                        CERTIFY MATERIAL RECOVERY
                    </Button>
                </div>
            )}

            {device.status === 'DELIVERED_TO_RECYCLER' && (
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-8 shadow-2xl space-y-8 animate-in fade-in zoom-in-95 duration-300">
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-xl">
                                <Recycle className="w-5 h-5 text-emerald-400" />
                            </div>
                            Final Destruction & Recovery
                        </h3>
                        <p className="text-sm text-slate-400">Initialize the formal recycling process. This action is terminal and will release final environmental credits.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-1" />
                            <div>
                                <p className="text-sm font-bold text-white">Verified Input</p>
                                <p className="text-[10px] text-slate-500">All materials accounted for</p>
                            </div>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-3">
                            <ShieldCheck className="w-5 h-5 text-emerald-500 mt-1" />
                            <div>
                                <p className="text-sm font-bold text-white">Secure Archive</p>
                                <p className="text-[10px] text-slate-500">UID will be formally retired</p>
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={async () => {
                            try {
                                await markRecycled(device._id);
                                navigate('/recycler/dashboard');
                            } catch (err) {
                                console.error(err);
                            }
                        }}
                        disabled={isRecycling}
                        className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl shadow-emerald-900/20 text-md gap-3"
                    >
                        {isRecycling ? <Loader2 className="animate-spin w-5 h-5" /> : <Recycle className="w-5 h-5" />}
                        INITIALIZE FINAL RECYCLING
                    </Button>
                </div>
            )}

            {/* If already delivered but not yet terminal, show progress (this is now redundant but kept for terminal state) */}
            {device.status === 'RECYCLED' && (
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-12 text-center space-y-6">
                    <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-white">Full Recovery Achieved</h3>
                        <p className="text-slate-400 max-w-md mx-auto">This device has been successfully recovered and is now being processed for material extraction.</p>
                    </div>
                    <Button onClick={() => navigate('/recycler/history')} variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 font-bold">
                        View Audit Ledger
                    </Button>
                </div>
            )}
        </div>
    );
}
