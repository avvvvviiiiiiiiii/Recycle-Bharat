import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecycler } from '../hooks/useRecycler';
import { Loader2, Truck, UserCheck, CheckCircle2, X, Recycle } from 'lucide-react';

const RecyclerDashboard = () => {
    const navigate = useNavigate();
    const {
        requests, deliveries, inventory, collectors,
        isLoading, error, assignCollector, isAssigning,
        confirmDelivery, isDelivering, markRecycled, isRecycling
    } = useRecycler();

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-orange-500" /></div>;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-12">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-600 bg-clip-text text-transparent">
                    Recycler Control Center
                </h1>
                <div className="px-4 py-1.5 bg-orange-50 text-orange-700 rounded-full text-xs font-bold border border-orange-100 flex items-center gap-2">
                    <UserCheck size={14} /> {collectors.length} Field Partners Available
                </div>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
                    Error loading data: {error.response?.data?.error || error.message}
                </div>
            )}

            <div className="space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Truck className="text-blue-400" /> Incoming Requests
                </h2>
                <div className="bg-card/30 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                    <table className="w-full text-left">
                        <thead className="bg-white/[0.03] border-b border-white/5">
                            <tr>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Device Identity</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Owner</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Admission Date</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Assign Logistics</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {requests?.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-16 text-center text-slate-500">
                                        <Truck className="mx-auto mb-4 opacity-10" size={48} />
                                        No pending recycling requests found.
                                    </td>
                                </tr>
                            ) : (
                                requests?.map((req) => (
                                    <RequestRow
                                        key={req._id}
                                        req={req}
                                        collectors={collectors}
                                        onAssign={assignCollector}
                                        isAssigning={isAssigning}
                                        navigate={navigate}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Incoming Deliveries Section */}
            <div className="space-y-4 pt-8">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Truck className="text-orange-400" /> Inbound Logistics (Partners in Transit)
                </h2>
                <div className="bg-card/30 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                    <table className="w-full text-left">
                        <thead className="bg-white/[0.03] border-b border-white/5">
                            <tr>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Device Identity</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Partner</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Logistics Time</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Verify Handover</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {(deliveries || []).length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-12 text-center text-slate-600">
                                        No agents are currently in transit to your facility.
                                    </td>
                                </tr>
                            ) : (
                                deliveries.map((dev) => (
                                    <DeliveryRow
                                        key={dev._id}
                                        dev={dev}
                                        onConfirm={confirmDelivery}
                                        isDelivering={isDelivering}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Materials at Facility Section */}
            <div className="space-y-4 pt-8">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="text-emerald-400" /> Materials at Facility (Awaiting Final Recycling)
                </h2>
                <div className="bg-card/30 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                    <table className="w-full text-left">
                        <thead className="bg-white/[0.03] border-b border-white/5">
                            <tr>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Device Identity</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Handed Over By</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Final Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {inventory?.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="p-12 text-center text-slate-600">
                                        No materials currently awaiting processing.
                                    </td>
                                </tr>
                            ) : (
                                inventory.map((dev) => (
                                    <InventoryRow key={dev._id} dev={dev} onRecycle={markRecycled} isRecycling={isRecycling} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const RequestRow = ({ req, collectors, onAssign, isAssigning, navigate }) => {
    const [selectedCollector, setSelectedCollector] = useState('');

    const handleAssign = () => {
        if (!selectedCollector) return alert('Please select a collector first.');
        onAssign({ deviceId: req._id, collectorId: selectedCollector });
    };

    return (
        <tr className="hover:bg-white/[0.02] transition-colors group">
            <td className="p-4">
                <div className="font-medium text-white">{req.model}</div>
                <div className="text-[10px] font-mono text-slate-500 mt-1 select-all">{req.uid}</div>
            </td>
            <td className="p-4">
                <div className="text-sm text-slate-300">{req.ownerId?.email || 'N/A'}</div>
                <div className="text-[10px] text-slate-500">Citizen Account</div>
            </td>
            <td className="p-4">
                <div className="text-sm text-slate-400">{new Date(req.createdAt).toLocaleDateString()}</div>
                <div className="text-[10px] text-slate-500">{new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </td>
            <td className="p-4">
                <div className="flex justify-end items-center gap-2">
                    <select
                        value={selectedCollector}
                        onChange={(e) => setSelectedCollector(e.target.value)}
                        className="bg-slate-900 border border-white/10 text-xs text-white rounded-lg px-2 py-1.5 focus:border-orange-500/50 outline-none transition-all"
                    >
                        <option value="">Select Logistics Partner...</option>
                        {collectors.map(c => (
                            <option key={c._id} value={c._id}>
                                {c.displayName || c.email} {c.organization ? `(${c.organization})` : ''}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleAssign}
                        disabled={!selectedCollector || isAssigning}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:bg-slate-800 text-white rounded-lg transition-all text-xs font-bold"
                    >
                        {isAssigning ? <Loader2 size={14} className="animate-spin" /> : <Truck size={14} />}
                        Dispatch Partner
                    </button>
                </div>
            </td>
        </tr>
    );
};

const DeliveryRow = ({ dev, onConfirm, isDelivering }) => {
    const [duc, setDuc] = useState('');
    const [isPrompted, setIsPrompted] = useState(false);
    const [error, setError] = useState('');

    const handleConfirm = async () => {
        if (duc.length !== 6) return setError('DUC must be 6 digits');
        setError('');
        try {
            await onConfirm({ deviceId: dev._id, duc });
        } catch (err) {
            setError(err.response?.data?.error || 'Handover failed: Check DUC');
        }
    };

    return (
        <tr className="hover:bg-white/[0.02] transition-colors group">
            <td className="p-4">
                <div className="font-medium text-white group-hover:text-orange-400 transition-colors">{dev.model}</div>
                <div className="text-[10px] font-mono text-slate-500 uppercase">{dev.uid}</div>
            </td>
            <td className="p-4">
                <div className="text-sm text-slate-300 font-bold">{dev.collectorId?.displayName}</div>
                <div className="text-[10px] text-slate-500">{dev.collectorId?.email}</div>
            </td>
            <td className="p-4">
                <div className="text-sm text-slate-400">{new Date(dev.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </td>
            <td className="p-4">
                <div className="flex justify-end items-center gap-2">
                    {isPrompted ? (
                        <div className="flex items-center gap-2 animate-in slide-in-from-right-2 duration-200">
                            <input
                                type="text"
                                maxLength={6}
                                value={duc}
                                onChange={(e) => setDuc(e.target.value.replace(/\D/g, ''))}
                                placeholder="PARTNER DUC"
                                className="bg-slate-950 border border-orange-500/30 text-[10px] font-black tracking-widest text-orange-400 rounded-lg px-3 py-2 w-32 focus:border-orange-500 outline-none transition-all"
                                autoFocus
                            />
                            <button
                                onClick={handleConfirm}
                                disabled={isDelivering || duc.length !== 6}
                                className="bg-orange-600 hover:bg-orange-500 text-white p-2 rounded-lg transition-all disabled:opacity-50 shadow-lg shadow-orange-900/20"
                            >
                                {isDelivering ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                            </button>
                            <button onClick={() => setIsPrompted(false)} className="text-slate-500 hover:text-white p-1">
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsPrompted(true)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-orange-500/10 border border-white/5 hover:border-orange-500/30 text-slate-400 hover:text-orange-400 rounded-lg text-xs font-bold transition-all"
                        >
                            Accept Handover
                        </button>
                    )}
                </div>
                {error && <p className="text-[9px] text-red-500 text-right mt-1 font-bold">{error}</p>}
            </td>
        </tr>
    );
};

const InventoryRow = ({ dev, onRecycle, isRecycling }) => {
    return (
        <tr className="hover:bg-white/[0.02] transition-colors group">
            <td className="p-4">
                <div className="font-medium text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{dev.model}</div>
                <div className="text-[10px] font-mono text-slate-500">{dev.uid}</div>
            </td>
            <td className="p-4">
                <div className="text-sm text-slate-300 font-bold">{dev.collectorId?.displayName}</div>
                <div className="text-[10px] text-slate-500 italic">Verified Logistical Link</div>
            </td>
            <td className="p-4">
                <div className="flex justify-end items-center">
                    <button
                        onClick={() => onRecycle(dev._id)}
                        disabled={isRecycling}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
                    >
                        {isRecycling ? <Loader2 size={14} className="animate-spin" /> : <Recycle size={14} />}
                        INITIALIZE RECYCLING
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default RecyclerDashboard;
