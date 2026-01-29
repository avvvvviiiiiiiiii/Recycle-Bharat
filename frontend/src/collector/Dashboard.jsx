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
        <div className="p-8 max-w-[1400px] mx-auto space-y-10 animate-in fade-in pb-24">
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
    const isCollected = task.status === 'COLLECTED';

    return (
        <div className={`bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm hover:shadow-2xl border border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-between h-full transition-all duration-300 group relative overflow-hidden ${isCollected ? 'hover:shadow-purple-500/10' : 'hover:shadow-orange-500/10'
            }`}>
            {/* Top colored line */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${isCollected ? 'bg-gradient-to-r from-purple-500 to-indigo-500' : 'bg-gradient-to-r from-orange-400 to-amber-500'}`} />

            <div>
                <div className="flex justify-between items-start mb-6">
                    <StatusBadge status={task.status} />
                    <button
                        onClick={() => navigate(`/citizen/device/${task._id}`)}
                        className="w-8 h-8 flex items-center justify-center bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-emerald-600 rounded-full transition-colors"
                        title="View Details"
                    >
                        <Eye size={14} />
                    </button>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{task.model}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{task.description}</p>
                    <div className="mt-3 flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded-md">ID: {task.uid}</span>
                    </div>
                </div>

                <div className="space-y-3 mb-8 p-4 bg-slate-50/80 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-white/5">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm text-emerald-500 shrink-0">
                            <MapPin size={16} />
                        </div>
                        <div className="min-w-0 pt-0.5">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Collection Point</p>
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 break-words leading-tight">{task.ownerId?.email || 'Unknown Location'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="pt-2">
                {task.status === 'ASSIGNED' && (
                    <ConfirmWithDuc
                        onConfirm={(duc) => confirmPickup({ assignmentId: task._id, verification_metadata: { duc } })}
                        label="Verify & Collect"
                        icon={<PackageCheck size={18} />}
                        isProcessing={isProcessing}
                        color="emerald"
                    />
                )}

                {task.status === 'COLLECTED' && (
                    <div className="space-y-3">
                        <div className="p-3 bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 rounded-xl text-xs font-bold border border-purple-100 dark:border-purple-500/20 flex items-center gap-2 justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                            In Transit to Recycler
                        </div>

                        <button
                            onClick={() => window.confirm('Confirm delivery to Recycler Facility?') && confirmDelivery(task._id)}
                            disabled={isProcessing}
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 hover:-translate-y-0.5"
                        >
                            {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
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
        if (duc.length !== 6) return setError('Input 6-digit DUC');

        try {
            await onConfirm(duc);
        } catch (err) {
            setError(err.response?.data?.error || 'Verification Failed');
        }
    };

    if (!isPrompted) {
        return (
            <button
                onClick={() => setIsPrompted(true)}
                className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 duration-300"
            >
                {icon} {label}
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3 animate-in slide-in-from-bottom-2 fade-in duration-300">
            <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Citizen DUC</label>
                <button type="button" onClick={() => setIsPrompted(false)} className="text-[10px] text-slate-400 hover:text-red-500 font-bold uppercase transition-colors">Cancel</button>
            </div>
            <div className="relative group">
                <input
                    type="text"
                    maxLength={6}
                    value={duc}
                    onChange={(e) => setDuc(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••"
                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-emerald-900/50 rounded-xl px-2 py-3 text-center text-xl font-mono font-bold tracking-[0.5em] focus:border-emerald-500 focus:ring-0 text-slate-800 dark:text-white outline-none transition-all placeholder:text-slate-200 dark:placeholder:text-slate-800"
                    autoFocus
                />
            </div>
            {error && <p className="text-[10px] text-red-500 font-bold text-center animate-pulse">{error}</p>}
            <button
                type="submit"
                disabled={duc.length !== 6 || isProcessing}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
            >
                {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <PackageCheck size={16} />}
                VERIFY & COLLECT
            </button>
        </form>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        ASSIGNED: 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/50',
        COLLECTOR_ASSIGNED: 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/50',
        COLLECTED: 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/50',
        DELIVERED_TO_RECYCLER: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50',
        RECYCLED: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50',
    };

    const icons = {
        ASSIGNED: <PackageCheck size={10} />,
        COLLECTED: <Truck size={10} />,
    };

    // Clean up label
    const label = status.replace(/_/g, ' ');

    return (
        <span className={`flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-full border uppercase tracking-widest ${styles[status] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
            {icons[status] || <CheckCircle2 size={10} />}
            {label}
        </span>
    );
};

export default CollectorDashboard;
