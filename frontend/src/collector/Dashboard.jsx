// For MVP Phase 3, we might stick to Dashboard actions as it's cleaner.
// But to fulfill the file structure and potential future detail, we can implement it.
// However, the dashboard logic I wrote handles "Confirm Pickup".
// The prompt "Confirm Delivery" happens AFTER pickup.
// My Dashboard code only handles "Confirm Pickup".
// I need "Confirm Delivery" logic too.

// Let's UPDATE Dashboard.jsx to handle both states or use PickupDetails.
// Dashboard is easier. Let's update Dashboard to toggle actions based on status.

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCollector } from '../hooks/useCollector';
import { Loader2, MapPin, PackageCheck, Truck, Eye, History, CheckCircle2, ArrowRight } from 'lucide-react';

const CollectorDashboard = () => {
    const navigate = useNavigate();
    const { assignments, history, isLoading, confirmPickup, confirmDelivery, isProcessing } = useCollector();

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-500" /></div>;

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-12">
            <div className="space-y-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                    My Pickup Tasks
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assignments?.length === 0 ? (
                        <div className="col-span-full py-12 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                            <p className="text-gray-500">No active tasks assigned.</p>
                        </div>
                    ) : (
                        assignments?.map((task) => (
                            <AssignmentCard key={task._id} task={task} navigate={navigate} confirmPickup={confirmPickup} isProcessing={isProcessing} />
                        ))
                    )}
                </div>
            </div>

            {/* Latest Completed Tasks Section */}
            {history?.length > 0 && (
                <div className="space-y-6 pt-8 border-t border-slate-100">
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <History className="text-blue-500" size={20} /> Latest Completed Tasks
                            </h2>
                            <p className="text-xs text-slate-500 font-medium">Summary of your 3 most recent successful handovers.</p>
                        </div>
                        <Link to="/collector/history" className="text-xs font-black text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
                            VIEW FULL HISTORY <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {history.slice(0, 3).map((task) => (
                            <div key={task._id} className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex items-center gap-4 hover:bg-white hover:shadow-md transition-all group">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                                    <CheckCircle2 size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-slate-800 truncate">{task.model}</h4>
                                    <p className="text-[10px] font-mono text-slate-400">{task.uid}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-emerald-600 uppercase">Success</p>
                                    <p className="text-[9px] text-slate-400 font-bold">{new Date(task.updatedAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const AssignmentCard = ({ task, navigate, confirmPickup, isProcessing }) => {
    return (
        <div key={task._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-3">
                    <StatusBadge status={task.status} />
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-gray-400">{task.uid}</span>
                        <button
                            onClick={() => navigate(`/citizen/device/${task._id}`)}
                            className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-blue-600 rounded-md transition-all"
                            title="View Device Timeline"
                        >
                            <Eye size={14} />
                        </button>
                    </div>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-1">{task.model}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{task.description}</p>

                <div className="space-y-2 mb-6">
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin size={16} className="mt-0.5 text-blue-500" />
                        <div>
                            <p className="font-medium">Collection Address</p>
                            <p className="text-gray-500 text-xs mt-0.5">{task.ownerId?.email || 'Unknown Location'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {task.status === 'COLLECTOR_ASSIGNED' && (
                <ConfirmWithDuc
                    onConfirm={(duc) => confirmPickup({ deviceId: task._id, duc })}
                    label="Confirm Pickup"
                    icon={<PackageCheck size={18} />}
                    isProcessing={isProcessing}
                />
            )}

            {task.status === 'COLLECTED' && (
                <div className="space-y-4">
                    <div className="p-3 bg-purple-50 text-purple-700 rounded-2xl text-xs font-bold border border-purple-100 flex items-center gap-2">
                        <Truck size={14} /> In Transit to Recycler
                    </div>

                    <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-center group/duc">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Authorization DUC</p>
                        <p className="font-mono text-2xl font-black text-slate-800 tracking-[0.3em] group-hover/duc:text-blue-600 transition-colors">{task.currentDuc}</p>
                        <p className="text-[8px] text-slate-400 mt-2">Display this code to the Recycler agent</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const ConfirmWithDuc = ({ onConfirm, label, icon, isProcessing }) => {
    const [duc, setDuc] = useState('');
    const [isPrompted, setIsPrompted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (duc.length !== 6) return setError('DUC must be 6 digits');

        try {
            await onConfirm(duc);
        } catch (err) {
            setError(err.response?.data?.error || 'Verification failed');
        }
    };

    if (!isPrompted) {
        return (
            <button
                onClick={() => setIsPrompted(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
                {icon} {label}
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3 p-3 bg-slate-50 rounded-xl border border-blue-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Enter 6-Digit DUC</label>
                <button type="button" onClick={() => setIsPrompted(false)} className="text-[10px] text-slate-400 hover:text-red-500 font-bold uppercase">Cancel</button>
            </div>
            <div className="relative">
                <input
                    type="text"
                    maxLength={6}
                    value={duc}
                    onChange={(e) => setDuc(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••"
                    className="w-full bg-white border border-blue-200 rounded-lg px-4 py-2 text-center text-xl font-black tracking-[0.3em] overflow-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    autoFocus
                />
            </div>
            {error && <p className="text-[10px] text-red-500 font-medium text-center">{error}</p>}
            <button
                type="submit"
                disabled={duc.length !== 6 || isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10 text-sm"
            >
                {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <PackageCheck size={16} />}
                Verify & Handover
            </button>
        </form>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        COLLECTOR_ASSIGNED: 'bg-orange-100 text-orange-700',
        COLLECTED: 'bg-purple-100 text-purple-700',
        DELIVERED_TO_RECYCLER: 'bg-blue-100 text-blue-700',
        RECYCLED: 'bg-emerald-100 text-emerald-700',
    };
    const labels = {
        DELIVERED_TO_RECYCLER: 'COMPLETED',
        RECYCLED: 'COMPLETED'
    };
    return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${styles[status] || 'bg-gray-100'}`}>
            {labels[status] || status.replace(/_/g, ' ')}
        </span>
    );
};

export default CollectorDashboard;
