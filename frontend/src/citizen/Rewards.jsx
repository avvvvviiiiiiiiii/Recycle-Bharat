import { useIncentives } from '../hooks/useIncentives';
import { useTheme } from '../context/ThemeContext';
import { Award, TrendingUp, History, Loader2, Gift } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const CitizenRewards = () => {
    const { balance, rewards, isLoading } = useIncentives();
    const { theme } = useTheme();
    const { t } = useLanguage();

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Balance Card */}
                <div className="flex-1 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-2xl p-8 text-white shadow-xl shadow-emerald-900/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Award size={120} />
                    </div>
                    <p className="text-emerald-100 text-sm font-medium uppercase tracking-wider mb-2">{t.totalBalance}</p>
                    <h2 className="text-6xl font-black mb-6">{balance} <span className="text-2xl font-normal opacity-80">{t.points}</span></h2>
                    <div className="flex gap-4">
                        <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
                            <Gift size={18} /> {t.redeemRewards}
                        </button>
                    </div>
                </div>

                {/* Stats Card */}
                <div className={`w-full md:w-80 rounded-2xl p-6 border shadow-sm flex flex-col justify-between ${theme === 'dark' ? 'bg-slate-900/40 border-white/5' : 'bg-white border-slate-100'
                    }`}>
                    <div>
                        <h3 className={`text-xs font-bold uppercase mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                            }`}>
                            <TrendingUp size={14} /> {t.quickStats}
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <p className="text-sm text-slate-500">{t.recycledItems}</p>
                                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{rewards.length}</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-4 leading-relaxed">
                        {t.autoIssueNotice}
                    </p>
                </div>
            </div>

            {/* Rewards History */}
            <div className="space-y-4">
                <h3 className={`text-xl font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                    <History size={20} className="text-emerald-600" /> {t.rewardHistory}
                </h3>

                <div className={`rounded-2xl border shadow-sm overflow-hidden ${theme === 'dark' ? 'bg-slate-900/40 border-white/5' : 'bg-white border-slate-100'
                    }`}>
                    {rewards.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">
                            {t.noRewardsEarned}
                        </div>
                    ) : (
                        <div className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-slate-50'}`}>
                            {rewards.map((reward) => (
                                <div key={reward._id} className={`p-4 flex justify-between items-center transition-colors ${theme === 'dark' ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'
                                    }`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                                            <Award size={20} />
                                        </div>
                                        <div>
                                            <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{reward.deviceId?.model || 'Device Completion'}</p>
                                            <p className="text-xs text-slate-500">{new Date(reward.createdAt).toLocaleDateString()} • {reward.deviceId?.uid}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-black text-emerald-600">+{reward.amount}</p>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">{t.points}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CitizenRewards;
