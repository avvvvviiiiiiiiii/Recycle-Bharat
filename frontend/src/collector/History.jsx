import React from 'react';
import { useCollector } from '../hooks/useCollector';
import { History, CheckCircle2, PackageCheck, Loader2 } from 'lucide-react';

export default function CollectorHistory() {
    const { history, isLoading, error } = useCollector();

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-500" /></div>;
    if (error) return (
        <div className="p-8 text-center bg-red-50 border border-red-100 rounded-3xl m-4">
            <p className="text-red-600 font-bold mb-2">Failed to load history</p>
            <p className="text-red-400 text-xs">{error.message || 'Server error'}</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Completed Jobs History</h1>
                    <div className="flex items-center gap-2 px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Live Feed</span>
                    </div>
                </div>
                <p className="text-slate-500 font-medium">Real-time verified record of all e-waste assets you have successfully handled.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {history?.length === 0 ? (
                    <div className="col-span-full py-20 bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-center backdrop-blur-sm">
                        <div className="p-5 bg-blue-500/10 rounded-2xl mb-4 border border-blue-500/20">
                            <History className="w-10 h-10 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-200">No completed jobs yet</h3>
                        <p className="text-sm text-slate-400 max-w-xs mt-2">Your history will populate here once devices you've collected are delivered to a recycling facility.</p>
                    </div>
                ) : (
                    history?.map((task) => (
                        <div key={task._id} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl hover:shadow-blue-500/5 hover:border-blue-500/30 transition-all duration-300 group backdrop-blur-md">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="bg-blue-500/10 text-blue-400 text-[10px] font-black px-2 py-0.5 rounded-full uppercase border border-blue-500/20">
                                        Verified
                                    </div>
                                    {new Date() - new Date(task.updatedAt) < 86400000 && (
                                        <div className="bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                                            Recent
                                        </div>
                                    )}
                                    <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                                        <CheckCircle2 size={12} className="text-emerald-500" />
                                    </div>
                                </div>
                                <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-400 transition-colors uppercase">{task.uid}</span>
                            </div>

                            <h3 className="text-lg font-extrabold text-white mb-2 leading-tight">{task.model}</h3>

                            <div className="space-y-4">
                                <div className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-2xl flex justify-between items-center transition-colors group-hover:bg-blue-900/20 group-hover:border-blue-800/40">
                                    <div>
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Authorization DUC</p>
                                        <p className="font-mono text-lg font-black text-blue-400 tracking-[0.2em]">{task.currentDuc}</p>
                                    </div>
                                    <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
                                        <PackageCheck size={16} />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-800/50">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Current Lifecycle</span>
                                        <span className="text-[10px] font-black text-slate-300 uppercase mt-0.5">
                                            {task.status === 'RECYCLED' ? '♻️ Fully Recycled' :
                                                task.status === 'DELIVERED_TO_RECYCLER' ? '🏢 At Facility' :
                                                    '📦 Completed Handover'}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter block">Completed On</span>
                                        <span className="text-[10px] font-bold text-slate-400">{new Date(task.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
