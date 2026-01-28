import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCollector } from '../hooks/useCollector';
import { Loader2, MapPin, PackageCheck, Truck, Eye, History, CheckCircle2, ArrowRight, ShieldCheck, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const CollectorDashboard = () => {
    const navigate = useNavigate();
    const { assignments, history, isLoading, confirmPickup, confirmDelivery, isConfirmingPickup, isConfirmingDelivery } = useCollector();
    const { t, language, setLanguage } = useLanguage();
    const { theme, setTheme } = useTheme();

    if (isLoading) return <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><Loader2 className="animate-spin text-emerald-600 w-12 h-12" /></div>;

    const isProcessing = isConfirmingPickup || isConfirmingDelivery;

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header with Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-200 dark:border-slate-800 pb-6 gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <Truck className="text-emerald-600" size={32} />
                        Recycle Bharat <span className="text-slate-400 dark:text-slate-600">|</span> Logistics
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Manage pending pickups and facility handovers.</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Language Switcher */}
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="flex items-center gap-3 px-4 py-2 border rounded-lg transition-all text-xs font-bold uppercase tracking-wider outline-none cursor-pointer appearance-none bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                        <option value="en">EN</option>
                        <option value="hi">HI</option>
                        <option value="pa">PA</option>
                    </select>

                    {/* Theme Toggle */}
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="flex items-center gap-2 px-4 py-2 border rounded-lg transition-all group bg-white border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700"
                    >
                        <div className={`${theme === 'dark' ? 'text-blue-400' : 'text-orange-500'}`}>
                            {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
                        </div>
                    </button>
                </div>
            </div>

            {/* Assignments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignments?.length === 0 ? (
                    <div className="col-span-full py-16 bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center text-center">
                        <PackageCheck className="text-slate-300 dark:text-slate-700 mb-4" size={48} />
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No active tasks</h3>
                        <p className="text-slate-500 dark:text-slate-500 text-sm">You have no pending pickups or deliveries.</p>
                    </div>
                ) : (
                    assignments?.map((task) => (
                        <AssignmentCard
                            key={task._id}
                            task={task}
                            navigate={navigate}
                            confirmPickup={confirmPickup}
                            confirmDelivery={confirmDelivery}
                            isProcessing={isProcessing}
                        />
                    ))
                )}
            </div>

            {/* Latest History Section */}
            {history?.length > 0 && (
                <div className="space-y-6 pt-8">
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <History className="text-emerald-500" size={20} /> Recent Activity
                            </h2>
                        </div>
                        <Link to="/collector/history" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group">
                            VIEW FULL HISTORY <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {history.slice(0, 3).map((task) => (
                            <div key={task._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-all">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{task.model}</h4>
                                    <p className="text-[10px] font-mono text-slate-400 truncate">{task.uid}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase">Done</p>
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

const AssignmentCard = ({ task, navigate, confirmPickup, confirmDelivery, isProcessing }) => {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <StatusBadge status={task.status} />
                    <button
                        onClick={() => navigate(`/citizen/device/${task._id}`)} // Assuming consistent route or need collector specific view
                        className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-emerald-600 rounded-lg transition-colors"
                        title="View Details"
                    >
                        <Eye size={16} />
                    </button>
                </div>

                <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{task.model}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{task.description}</p>
                    <p className="text-xs font-mono text-slate-400 mt-2 py-1 px-2 bg-slate-50 dark:bg-slate-800 rounded inline-block">{task.uid}</p>
                </div>

                <div className="space-y-3 mb-6 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                    <div className="flex items-start gap-3">
                        <MapPin size={16} className="mt-0.5 text-emerald-500 shrink-0" />
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Collection Point</p>
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-300 break-words">{task.ownerId?.email || 'Unknown Location'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                {/* Changed condition to 'ASSIGNED' to match DB Schema and User Issue */}
                {task.status === 'ASSIGNED' && (
                    <ConfirmWithDuc
                        onConfirm={(duc) => confirmPickup({ assignmentId: task._id, verification_metadata: { duc } })}
                        label="Verify & Collect"
                        icon={<PackageCheck size={18} />}
                        isProcessing={isProcessing}
                    />
                )}

                {task.status === 'COLLECTED' && (
                    <div className="space-y-3">
                        <div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-bold border border-purple-100 dark:border-purple-800 flex items-center gap-2 justify-center">
                            <Truck size={14} /> In Transit to Recycler
                        </div>

                        <button
                            onClick={() => window.confirm('Confirm delivery to Recycler Facility?') && confirmDelivery(task._id)}
                            disabled={isProcessing}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20"
                        >
                            {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <PackageCheck size={18} />}
                            Confirm Handover
                        </button>
                    </div>
                )}
            </div>
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
        if (duc.length !== 6) return setError('Enter 6-digit code');

        try {
            await onConfirm(duc);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed');
        }
    };

    if (!isPrompted) {
        return (
            <button
                onClick={() => setIsPrompted(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
            >
                {icon} {label}
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Device User Code</label>
                <button type="button" onClick={() => setIsPrompted(false)} className="text-[10px] text-slate-400 hover:text-red-500 font-bold uppercase">Cancel</button>
            </div>
            <div className="relative">
                <input
                    type="text"
                    maxLength={6}
                    value={duc}
                    onChange={(e) => setDuc(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-emerald-200 dark:border-emerald-900 rounded-lg px-2 py-2 text-center text-lg font-mono font-bold tracking-[0.3em] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                    autoFocus
                />
            </div>
            {error && <p className="text-[10px] text-red-500 font-bold text-center">{error}</p>}
            <button
                type="submit"
                disabled={duc.length !== 6 || isProcessing}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2"
            >
                {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <PackageCheck size={16} />}
                Verify
            </button>
        </form>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        ASSIGNED: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800',
        COLLECTOR_ASSIGNED: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800', // Fallback
        COLLECTED: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
        DELIVERED_TO_RECYCLER: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
        RECYCLED: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
    };

    // Clean up label
    const label = status.replace(/_/g, ' ');

    return (
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded border uppercase tracking-wider ${styles[status] || 'bg-slate-100 text-slate-500'}`}>
            {label}
        </span>
    );
};

export default CollectorDashboard;
