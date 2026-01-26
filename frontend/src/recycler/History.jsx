import { useState } from 'react';
import { useActivity } from '../hooks/useActivity';
import { Loader2, History, CheckCircle2, Truck, Package, RefreshCw, Filter, Search, Circle, ArrowRight } from 'lucide-react';

export default function RecyclerHistory() {
    const { activities, isLoading, error } = useActivity();
    const [searchQuery, setSearchQuery] = useState('');

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-orange-500" /></div>;

    // 1. Group activities by Device ID
    const groupActivitiesByDevice = (logs) => {
        const groups = {};
        logs.forEach(log => {
            const deviceId = log.details.deviceId || 'system';
            if (!groups[deviceId]) {
                groups[deviceId] = {
                    deviceId,
                    uid: log.details.uid,
                    model: 'System Identity Unresolved',
                    logs: [],
                    latestStatus: ''
                };
            }
            groups[deviceId].logs.push(log);
            if (log.action === 'STATUS_CHANGE') {
                // Since logs are sorted Ascending (Phase 21), the last one is the latest
                groups[deviceId].latestStatus = log.details.newStatus;
            }
        });
        return Object.values(groups);
    };

    const groupedData = groupActivitiesByDevice(activities || []);

    // 2. Filter grouped data by Search Query (UID)
    const filteredGroups = groupedData.filter(group =>
        group.uid?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-white tracking-tight">Processing History</h1>
                        <div className="flex items-center gap-2 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live Ledger</span>
                        </div>
                    </div>
                    <p className="text-slate-400">Chronological lifecycle tracking grouped by asset identity.</p>
                </div>

                <div className="flex gap-2">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-orange-400 transition-colors" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Enter Device UID..."
                            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-orange-500/50 outline-none transition-all w-64"
                        />
                    </div>
                    <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-sm font-bold text-slate-300 transition-all">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
                    Error loading processing history: {error.message}
                </div>
            )}

            <div>
                {filteredGroups.length === 0 ? (
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl py-24 flex flex-col items-center justify-center text-center">
                        <History className="w-12 h-12 text-slate-700 mb-4 opacity-20" />
                        <h3 className="text-lg font-bold text-slate-400">No matching activities</h3>
                        <p className="text-sm text-slate-600 max-w-xs mt-2">Your facility's grouped lifecycle logs will appear here based on your search criteria.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredGroups.map((group) => (
                            <DeviceLifecycleCard key={group.deviceId} group={group} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function DeviceLifecycleCard({ group }) {
    const steps = [
        { key: 'RECYCLING_REQUESTED', label: 'Requested', icon: Package },
        { key: 'COLLECTOR_ASSIGNED', label: 'Assigned', icon: Truck },
        { key: 'COLLECTED', label: 'Collected', icon: RefreshCw },
        { key: 'DELIVERED_TO_RECYCLER', label: 'Facility', icon: History },
        { key: 'RECYCLED', label: 'Recycled', icon: CheckCircle2 },
    ];

    const currentIdx = steps.findIndex(s => s.key === group.latestStatus);
    const completedSteps = group.logs.filter(l => l.action === 'STATUS_CHANGE').map(l => l.details.newStatus);

    return (
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-[40px] p-8 shadow-2xl hover:border-orange-500/20 transition-all duration-300 group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-orange-500/10 transition-colors" />

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10">
                {/* Device Header */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-900/20">
                            <Package className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-bold text-white tracking-tight">Device {group.uid}</h3>
                                {group.latestStatus === 'RECYCLED' && (
                                    <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[8px] font-black uppercase rounded-full">Lifecycle End</span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">{group.deviceId}</p>
                        </div>
                    </div>
                </div>

                {/* Progress Stepper */}
                <div className="flex-1 max-w-2xl w-full">
                    <div className="relative flex justify-between items-center w-full">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/10 -translate-y-1/2" />

                        {steps.map((step, idx) => {
                            const isCompleted = completedSteps.includes(step.key);
                            const isCurrent = group.latestStatus === step.key;

                            return (
                                <div key={step.key} className="flex flex-col items-center gap-2 relative z-10">
                                    <div className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 ${isCompleted
                                            ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20'
                                            : isCurrent
                                                ? 'bg-slate-900 border-orange-500 text-orange-400 animate-pulse'
                                                : 'bg-slate-900 border-slate-700 text-slate-600'
                                        }`}>
                                        <step.icon size={18} />
                                    </div>
                                    <span className={`text-[9px] font-black uppercase tracking-tighter ${isCompleted ? 'text-white' : isCurrent ? 'text-orange-400' : 'text-slate-600'
                                        }`}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Latest Update */}
                <div className="text-right shrink-0 bg-white/5 p-4 rounded-3xl border border-white/5">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Last Transmission</p>
                    <p className="text-sm font-bold text-white">
                        {group.logs.length > 0 ? new Date(group.logs[group.logs.length - 1].createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'N/A'}
                    </p>
                    <p className="text-[10px] font-mono text-orange-500/80 mt-1">
                        {group.logs.length > 0 ? new Date(group.logs[group.logs.length - 1].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </p>
                </div>
            </div>

            {/* Event Log Detail Preview */}
            <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {group.logs.slice(-4).reverse().map((log, i) => (
                    <div key={log._id} className="p-3 bg-white/5 rounded-2xl border border-white/5 group/log hover:bg-white/10 transition-colors">
                        <p className="text-[8px] font-black text-orange-500 uppercase tracking-tighter transition-all group-hover/log:translate-x-1">
                            {formatLabel(log)}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1 truncate">
                            {formatText(log)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function formatLabel(log) {
    if (log.action === 'STATUS_CHANGE') {
        const s = log.details.newStatus;
        if (s === 'COLLECTOR_ASSIGNED') return 'Collector -> Citizen';
        if (s === 'COLLECTED') return 'Collector -> Recycler';
        if (s === 'DELIVERED_TO_RECYCLER') return 'Material Handover';
        if (s === 'RECYCLED') return 'Facility -> Recycled';
    }
    return log.action.replace(/_/g, ' ');
}

function formatText(log) {
    const d = log.details;
    if (log.action === 'STATUS_CHANGE') {
        if (d.newStatus === 'COLLECTOR_ASSIGNED') return 'Authorization confirmed.';
        if (d.newStatus === 'COLLECTED') return 'Asset retrieved.';
        if (d.newStatus === 'DELIVERED_TO_RECYCLER') return 'Handover verified.';
        if (d.newStatus === 'RECYCLED') return 'Recycling complete.';
    }
    return 'Log entry recorded.';
}
