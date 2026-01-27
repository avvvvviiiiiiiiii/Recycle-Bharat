import { useActivity } from '../hooks/useActivity';
import { useTheme } from '../context/ThemeContext';
import { History, Package, Coins, RefreshCcw, Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const CitizenActivity = () => {
    const { activities, isLoading, error } = useActivity();
    const { theme } = useTheme();
    const { t } = useLanguage();

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
                <div className={`p-2 bg-emerald-500/10 rounded-lg text-emerald-400`}>
                    <History size={24} />
                </div>
                <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t.activityHistory}</h1>
            </div>

            <div className={`border rounded-2xl overflow-hidden shadow-xl ${theme === 'dark' ? 'bg-card/30 border-white/5' : 'bg-white border-slate-200'
                }`}>
                {activities.length === 0 ? (
                    <div className="p-16 text-center text-slate-500">
                        <History className="mx-auto mb-4 opacity-20" size={64} />
                        <p>{t.noRecordedActivities}</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {activities.map((log) => (
                            <ActivityItem key={log._id} log={log} theme={theme} t={t} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const ActivityItem = ({ log, theme, t }) => {
    const config = {
        DEVICE_REGISTERED: {
            icon: Package,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
            label: t.registerDevice
        },
        STATUS_CHANGE: {
            icon: RefreshCcw,
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10',
            label: t.statusUpdate
        },
        INCENTIVE_ISSUED: {
            icon: Coins,
            color: 'text-yellow-400',
            bg: 'bg-yellow-400/10',
            label: t.rewardEarned
        },
        STATE_CHANGE: {
            icon: RefreshCcw,
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10',
            label: t.statusUpdate
        },
        default: {
            icon: History,
            color: 'text-slate-400',
            bg: 'bg-slate-400/10',
            label: t.systemEvent
        }
    };

    const item = config[log.action] || config.default;
    const Icon = item.icon;

    return (
        <div className={`p-5 flex items-start gap-4 transition-colors ${theme === 'dark' ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'
            }`}>
            <div className={`p-2.5 rounded-xl ${item.bg} ${item.color}`}>
                <Icon size={20} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                    <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {item.label}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-medium">
                        {new Date(log.createdAt).toLocaleString()}
                    </span>
                </div>
                <p className="text-sm text-slate-400 truncate">
                    {formatDetails(log, t)}
                </p>
            </div>
        </div>
    );
};

const formatDetails = (log, t) => {
    const d = log.details;
    const details = t.activityDetails;

    switch (log.action) {
        case 'DEVICE_REGISTERED':
            return details.registered.replace('{uid}', d.uid);
        case 'STATUS_CHANGE':
        case 'STATE_CHANGE':
            const statusMap = {
                COLLECTED: t.inTransit,
                DELIVERED_TO_RECYCLER: t.reachedFacility,
                COLLECTOR_ASSIGNED: t.agentDispatched,
                ACTIVE: t.activeInventory,
                RECYCLING_REQUESTED: t.recycleCalled,
                RECYCLED: t.fullyRecycling
            };
            const statusLabel = statusMap[d.newStatus] || d.newStatus.replace(/_/g, ' ');
            return details.transitioned.replace('{status}', statusLabel);
        case 'INCENTIVE_ISSUED':
            return details.earned.replace('{amount}', d.amount);
        default:
            return details.system;
    }
};

export default CitizenActivity;
