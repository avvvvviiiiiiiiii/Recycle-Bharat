import { useNavigate } from 'react-router-dom';
import { useDevices } from '../hooks/useDevices';
import { Plus, Recycle, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

const CitizenDashboard = () => {
    const navigate = useNavigate();
    const { devices, isLoading } = useDevices();

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-emerald-500" /></div>;

    const regulatedDevices = devices?.filter(d => d.recycleNumber) || [];
    const legacyDevices = devices?.filter(d => !d.recycleNumber) || [];

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent tracking-tight">
                        Asset Ledger
                    </h1>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Citizen Inventory Management</p>
                </div>
                <button
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl transition-all shadow-xl shadow-emerald-900/10 font-bold cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    onClick={() => navigate('/citizen/register')}
                >
                    <Plus size={20} /> Register New Asset
                </button>
            </div>

            <div className="space-y-16">
                {/* Section 1: Regulated Unified Assets */}
                <div className="space-y-6">
                    <div className="flex items-end justify-between border-b border-white/5 pb-4">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <ShieldCheck className="text-blue-400" size={20} /> Regulated Unified Assets
                            </h2>
                            <p className="text-xs text-slate-500 font-medium tracking-tight">Modern devices with pre-printed 8-digit unique identities.</p>
                        </div>
                        <span className="text-[10px] font-black text-blue-400/50 uppercase tracking-widest">{regulatedDevices.length} Tracked</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {regulatedDevices.length === 0 ? (
                            <div className="col-span-full py-12 bg-blue-500/5 border border-dashed border-blue-500/10 rounded-[32px] flex flex-col items-center justify-center text-center">
                                <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">No regulated assets registered</p>
                            </div>
                        ) : (
                            regulatedDevices.map((device) => (
                                <DeviceCard key={device._id} device={device} variant="blue" navigate={navigate} />
                            ))
                        )}
                    </div>
                </div>

                {/* Section 2: Legacy E-Waste Items */}
                <div className="space-y-6">
                    <div className="flex items-end justify-between border-b border-white/5 pb-4">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-emerald-500/10">
                                <Recycle className="text-emerald-400" size={20} /> Legacy E-Waste Items
                            </h2>
                            <p className="text-xs text-slate-500 font-medium tracking-tight">Existing electronics requiring manual asset-tagging after calling for recycling.</p>
                        </div>
                        <span className="text-[10px] font-black text-emerald-400/50 uppercase tracking-widest">{legacyDevices.length} Registered</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {legacyDevices.length === 0 ? (
                            <div className="col-span-full py-12 bg-emerald-500/5 border border-dashed border-emerald-500/10 rounded-[32px] flex flex-col items-center justify-center text-center">
                                <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">No legacy items registered</p>
                            </div>
                        ) : (
                            legacyDevices.map((device) => (
                                <DeviceCard key={device._id} device={device} variant="emerald" navigate={navigate} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const DeviceCard = ({ device, variant, navigate }) => {
    const isBlue = variant === 'blue';
    const cardAccent = isBlue ? 'blue' : 'emerald';

    return (
        <div
            onClick={() => navigate(`/citizen/device/${device._id}`)}
            className={`group bg-slate-900/40 backdrop-blur-xl border border-white/5 hover:border-${cardAccent}-500/30 rounded-[32px] p-7 flex flex-col justify-between h-full cursor-pointer transition-all duration-300 shadow-2xl hover:shadow-${cardAccent}-500/10 hover:-translate-y-1`}
        >
            <div className="space-y-4">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                        <span className="text-[9px] font-mono text-slate-500 bg-white/5 px-2 py-1 rounded-md uppercase tracking-wider w-fit">{device.uid}</span>
                        {device.recycleNumber && (
                            <div className="flex items-center gap-1.5 bg-blue-500/10 px-2 py-1 rounded-lg border border-blue-500/20 w-fit">
                                <ShieldCheck size={10} className="text-blue-400" />
                                <span className="text-[9px] font-black text-blue-400 uppercase">ID: {device.recycleNumber}</span>
                            </div>
                        )}
                    </div>
                    <StatusBadge status={device.status} />
                </div>
                <div>
                    <h3 className={`text-xl font-bold text-white mb-2 group-hover:text-${cardAccent}-400 transition-colors`}>{device.model}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-medium">{device.description}</p>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                {device.currentDuc && !device.isTerminated && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3 flex justify-between items-center group/duc transition-all hover:bg-emerald-500/20">
                        <div>
                            <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Handover Code</p>
                            <p className="text-xl font-black text-white tracking-[0.3em] font-mono leading-none mt-1">{device.currentDuc}</p>
                        </div>
                        <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400 group-hover/duc:scale-110 transition-transform">
                            <ShieldCheck size={16} />
                        </div>
                    </div>
                )}
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <span className={`group-hover:text-${cardAccent}-400 transition-colors flex items-center gap-2`}>
                        {device.isTerminated ? 'Lifecycle Archive' : 'Passport details'}
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                </div>
            </div>
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const colors = {
        ACTIVE: 'bg-green-100 text-green-700',
        RECYCLING_REQUESTED: 'bg-blue-100 text-blue-700',
        COLLECTOR_ASSIGNED: 'bg-yellow-100 text-yellow-700',
        COLLECTED: 'bg-purple-100 text-purple-700',
        DELIVERED_TO_RECYCLER: 'bg-orange-100 text-orange-700',
        RECYCLED: 'bg-emerald-100 text-emerald-700',
    };

    const labels = {
        COLLECTED: 'In Transit',
        DELIVERED_TO_RECYCLER: 'At Facility',
        COLLECTOR_ASSIGNED: 'Authorized'
    };

    return (
        <span className={`px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-tighter ${colors[status] || 'bg-gray-100/10 text-gray-400'}`}>
            {labels[status] || status.replace(/_/g, ' ')}
        </span>
    );
};

export default CitizenDashboard;
