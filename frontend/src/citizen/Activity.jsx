import { useActivity } from '../hooks/useActivity';
import { History, Package, Coins, RefreshCcw, Loader2, AlertCircle } from 'lucide-react';

const CitizenActivity = () => {
    const { activities, isLoading, error } = useActivity();

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-emerald-500" /></div>;

    if (error) return (
        <div className="p-8 text-center text-red-500 flex flex-col items-center gap-2">
            <AlertCircle size={40} />
            <p>Failed to load activity history.</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                    <History size={24} />
                </div>
                <h1 className="text-3xl font-bold text-white">Activity History</h1>
            </div>

            <div className="bg-card/30 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                {activities.length === 0 ? (
                    <div className="p-16 text-center text-slate-500">
                        <History className="mx-auto mb-4 opacity-20" size={64} />
                        <p>No recorded activities yet.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {activities.map((log) => (
                            <ActivityItem key={log._id} log={log} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const ActivityItem = ({ log }) => {
    const config = {
        DEVICE_REGISTERED: {
            icon: Package,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
            label: 'Device Registered'
        },
        STATUS_CHANGE: {
            icon: RefreshCcw,
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10',
            label: 'Status Update'
        },
        INCENTIVE_ISSUED: {
            icon: Coins,
            color: 'text-yellow-400',
            bg: 'bg-yellow-400/10',
            label: 'Reward Earned'
        },
        default: {
            icon: History,
            color: 'text-slate-400',
            bg: 'bg-slate-400/10',
            label: 'System Event'
        }
    };

    const item = config[log.action] || config.default;
    const Icon = item.icon;

    return (
        <div className="p-5 flex items-start gap-4 hover:bg-white/[0.02] transition-colors">
            <div className={`p-2.5 rounded-xl ${item.bg} ${item.color}`}>
                <Icon size={20} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-white">
                        {item.label}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-medium">
                        {new Date(log.createdAt).toLocaleString()}
                    </span>
                </div>
                <p className="text-sm text-slate-400 truncate">
                    {formatDetails(log)}
                </p>
            </div>
        </div>
    );
};

const formatDetails = (log) => {
    const d = log.details;
    switch (log.action) {
        case 'DEVICE_REGISTERED':
            return `Device [${d.uid}] was successfully registered in the system.`;
        case 'STATUS_CHANGE':
            return `Device [${d.uid}] transitioned from ${d.oldStatus.replace('_', ' ')} to ${d.newStatus.replace('_', ' ')}.`;
        case 'INCENTIVE_ISSUED':
            return `Earned ${d.amount} points for recycling device completion.`;
        default:
            return 'A system action was recorded.';
    }
};

export default CitizenActivity;
