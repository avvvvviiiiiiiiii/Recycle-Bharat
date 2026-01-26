import React from 'react';
import { useCollector } from '../hooks/useCollector';
import { History, CheckCircle2, PackageCheck, Loader2 } from 'lucide-react';

export default function CollectorHistory() {
    const { history, isLoading } = useCollector();

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-500" /></div>;

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
                    <div className="col-span-full py-20 bg-slate-50/50 border border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center">
                        <div className="p-4 bg-white/5 rounded-2xl mb-4">
                            <History className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-400">No completed jobs yet</h3>
                        <p className="text-sm text-slate-400 max-w-xs mt-2">Your history will populate as you complete physical handovers to authorized recyclers.</p>
                    </div>
                ) : (
                    history?.map((task) => (
                        <div key={task._id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-blue-500/20 transition-all duration-300 group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="bg-blue-500/10 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase border border-blue-500/20">
                                        Completed
                                    </div>
                                    {new Date() - new Date(task.updatedAt) < 3600000 && (
                                        <div className="bg-orange-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase animate-pulse">
                                            New
                                        </div>
                                    )}
                                    <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                                        <CheckCircle2 size={12} className="text-emerald-500" />
                                    </div>
                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Handover Verified</span>
                                </div>
                                <span className="text-[10px] font-mono text-slate-300 group-hover:text-slate-500 transition-colors uppercase">{task.uid}</span>
                            </div>

                            <h3 className="text-lg font-extrabold text-slate-800 mb-2 leading-tight">{task.model}</h3>

                            <div className="space-y-4">
                                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center transition-colors group-hover:bg-blue-50/30 group-hover:border-blue-100">
                                    <div>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Authorization DUC</p>
                                        <p className="font-mono text-lg font-black text-blue-600 tracking-[0.2em]">{task.currentDuc}</p>
                                    </div>
                                    <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                                        <PackageCheck size={16} />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Final Lifecycle Stage</span>
                                        <span className="text-[10px] font-black text-slate-600 uppercase mt-0.5">
                                            {task.status === 'RECYCLED' ? '♻️ Fully Recycled' : '🏢 At Recycler Facility'}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter block">Job Finalized</span>
                                        <span className="text-[10px] font-bold text-slate-500">{new Date(task.updatedAt).toLocaleDateString()}</span>
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
