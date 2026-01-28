import { useNavigate } from 'react-router-dom';
import { useDevices } from '../hooks/useDevices';
import { useTheme } from '../context/ThemeContext';
import { Plus, Recycle, Loader2, ArrowRight, ShieldCheck, Sun, Moon, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const CitizenDashboard = () => {
    const navigate = useNavigate();
    const { devices, isLoading } = useDevices();
    const { theme, setTheme } = useTheme();
    const { t, language, setLanguage } = useLanguage();

    console.log('CitizenDashboard Render:', { isLoading, devicesCount: devices?.length, devices });

    if (isLoading) {
        console.log('CitizenDashboard: Loading state active');
        return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-emerald-500" /></div>;
    }

    const regulatedDevices = devices?.filter(d => d.recycleNumber) || [];
    const legacyDevices = devices?.filter(d => !d.recycleNumber) || [];

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Top Right Controls */}
            <div className="flex justify-end gap-3">
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

            <div className="flex justify-between items-end border-b pb-6 border-slate-200 dark:border-slate-800">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        {t.assetLedger}
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t.inventoryManagement}</p>
                </div>
                <button
                    className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-lg transition-colors font-medium text-sm shadow-sm"
                    onClick={() => navigate('/citizen/register')}
                >
                    <Plus size={18} /> {t.registerNewAsset}
                </button>
            </div>

            <div className="space-y-12">
                {/* Section 1: Regulated Unified Assets */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className={`text-lg font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                            <ShieldCheck className="text-blue-500" size={20} /> {t.regulatedAssets}
                        </h2>
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{regulatedDevices.length}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {regulatedDevices.length === 0 ? (
                            <div className="col-span-full py-12 bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-center">
                                <p className="text-slate-500 text-sm font-medium">{t.noRegulatedAssets}</p>
                            </div>
                        ) : (
                            regulatedDevices.map((device) => (
                                <DeviceCard key={device._id} device={device} variant="blue" navigate={navigate} theme={theme} t={t} />
                            ))
                        )}
                    </div>
                </div>

                {/* Section 2: Legacy E-Waste Items */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className={`text-lg font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                            <Recycle className="text-emerald-500" size={20} /> {t.legacyItems}
                        </h2>
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{legacyDevices.length}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {legacyDevices.length === 0 ? (
                            <div className="col-span-full py-12 bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-center">
                                <p className="text-slate-500 text-sm font-medium">{t.noLegacyItems}</p>
                            </div>
                        ) : (
                            legacyDevices.map((device) => (
                                <DeviceCard key={device._id} device={device} variant="emerald" navigate={navigate} theme={theme} t={t} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const DeviceCard = ({ device, variant, navigate, theme, t }) => {
    return (
        <div
            onClick={() => navigate(`/citizen/device/${device._id}`)}
            className="group border rounded-xl p-5 flex flex-col justify-between h-full cursor-pointer transition-all duration-200 hover:shadow-md bg-white border-slate-200 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700"
        >
            <div className="space-y-3">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1.5">
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border uppercase w-fit ${theme === 'dark' ? 'text-slate-400 border-slate-700 bg-slate-800' : 'text-slate-500 border-slate-200 bg-slate-50'
                            }`}>
                            {device.uid}
                        </span>
                        {device.recycleNumber && (
                            <div className="flex items-center gap-1">
                                <ShieldCheck size={12} className="text-blue-500" />
                                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">ID: {device.recycleNumber}</span>
                            </div>
                        )}
                    </div>
                    <StatusBadge status={device.status} t={t} />
                </div>
                <div>
                    <h3 className={`text-lg font-bold mb-1 leading-tight group-hover:text-emerald-600 transition-colors ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                        }`}>
                        {device.model}
                    </h3>
                    <p className={`text-xs line-clamp-2 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                        {device.description}
                    </p>
                </div>
            </div>

            <div className={`mt-6 pt-4 border-t flex justify-between items-center ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                {device.currentDuc && !device.isTerminated ? (
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{t.handoverCode}:</span>
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{device.currentDuc}</span>
                    </div>
                ) : <span></span>}

                <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-slate-400 group-hover:text-emerald-600 transition-colors">
                    {device.isTerminated ? t.lifecycleArchive : t.deviceDetails}
                    <ArrowRight size={12} />
                </div>
            </div>
        </div>
    );
};

const StatusBadge = ({ status, t }) => {
    const colors = {
        ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50',
        RECYCLING_REQUESTED: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50',
        COLLECTOR_ASSIGNED: 'bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/50',
        COLLECTED: 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-900/50',
        DELIVERED_TO_RECYCLER: 'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900/50',
        RECYCLED: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
    };

    const labels = {
        COLLECTED: t.inTransit,
        DELIVERED_TO_RECYCLER: t.reachedFacility,
        COLLECTOR_ASSIGNED: t.agentDispatched,
        ACTIVE: t.activeInventory,
        RECYCLING_REQUESTED: t.recycleCalled,
        RECYCLED: t.fullyRecycling
    };

    return (
        <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wide ${colors[status] || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
            {labels[status] || status.replace(/_/g, ' ')}
        </span>
    );
};

export default CitizenDashboard;
