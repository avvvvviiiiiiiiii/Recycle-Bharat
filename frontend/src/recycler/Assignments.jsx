import { useNavigate } from 'react-router-dom';
import { useRecycler } from '../hooks/useRecycler';
import { Loader2, Truck, Calendar, MapPin, User, ArrowRight } from 'lucide-react';

export default function RecyclerAssignments() {
    const navigate = useNavigate();
    const { assigned, isLoading, error } = useRecycler();

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-orange-500" /></div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-white tracking-tight">Logistics Overview</h1>
                <p className="text-slate-400">Tracking e-waste pickups currently assigned to Field Partners.</p>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-2">
                    <div className="w-1 h-5 bg-red-500 rounded-full" />
                    Failed to load logistics data: {error.response?.data?.error || error.message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(assigned || []).length === 0 ? (
                    <div className="col-span-full py-24 bg-card/30 border border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-center shadow-2xl">
                        <div className="p-6 bg-orange-500/10 rounded-3xl mb-6 border border-orange-500/20 animate-pulse">
                            <Truck className="w-10 h-10 text-orange-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white tracking-tight">No Active Logistics</h3>
                        <p className="text-sm text-slate-400 max-w-sm mt-3 leading-relaxed">
                            Your logistics pipeline is currently empty. New dispatches will appear here once you assign partners to incoming requests.
                        </p>
                    </div>
                ) : (
                    assigned.map((device) => (
                        <AssignmentCard key={device._id} device={device} navigate={navigate} />
                    ))
                )}
            </div>
        </div>
    );
}

function AssignmentCard({ device, navigate }) {
    return (
        <div className="group bg-slate-900/40 backdrop-blur-xl border border-white/5 hover:border-orange-500/20 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300">
            <div className="p-6 space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className={`px-2 py-1 text-[10px] font-bold rounded-lg uppercase tracking-widest border ${device.status === 'COLLECTED' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/10' : 'bg-blue-500/10 text-blue-400 border-blue-500/10'
                        }`}>
                        {device.status === 'COLLECTED' ? 'In Possession of Partner' : 'Partner En Route to Citizen'}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-1 rounded-md">{device.uid}</span>
                </div>

                {/* Logistics Progress Tracker */}
                <div className="py-4">
                    <div className="flex items-center w-full">
                        {/* Step 1: Dispatched */}
                        <div className="flex flex-col items-center gap-2 flex-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${['COLLECTOR_ASSIGNED', 'COLLECTED', 'DELIVERED_TO_RECYCLER'].includes(device.status)
                                ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                                : 'bg-slate-900 border-slate-700 text-slate-500'
                                }`}>
                                <User className="w-4 h-4" />
                            </div>
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Dispatched</span>
                        </div>

                        {/* Connector 1 */}
                        <div className={`h-1 flex-1 -mt-5 transition-all duration-700 ${['COLLECTED', 'DELIVERED_TO_RECYCLER'].includes(device.status) ? 'bg-blue-500' : 'bg-slate-800'
                            }`} />

                        {/* Step 2: Picked Up */}
                        <div className="flex flex-col items-center gap-2 flex-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${['COLLECTED', 'DELIVERED_TO_RECYCLER'].includes(device.status)
                                ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                : 'bg-slate-900 border-slate-700 text-slate-500'
                                }`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>
                            </div>
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Picked Up</span>
                        </div>

                        {/* Connector 2 */}
                        <div className={`h-1 flex-1 -mt-5 transition-all duration-700 ${['DELIVERED_TO_RECYCLER'].includes(device.status) ? 'bg-indigo-500' : 'bg-slate-800'
                            }`} />

                        {/* Step 3: In Transit */}
                        <div className="flex flex-col items-center gap-2 flex-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${['COLLECTED'].includes(device.status)
                                ? 'bg-orange-500 border-orange-500 text-white shadow-lg animate-pulse'
                                : (['DELIVERED_TO_RECYCLER'].includes(device.status) ? 'bg-orange-500 border-orange-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-500')
                                }`}>
                                <Truck className="w-4 h-4" />
                            </div>
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">In Transit</span>
                        </div>
                    </div>
                </div>

                {/* Device Info */}
                <div className="pt-2">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">{device.model}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2">{device.description}</p>
                </div>

                {/* Assignment Details */}
                <div className="pt-4 border-t border-white/5 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-slate-300">
                        <div className="p-1.5 bg-white/5 rounded-lg">
                            <User className="w-3.5 h-3.5 text-orange-400/80" />
                        </div>
                        <div>
                            <p className="text-slate-500 font-medium uppercase tracking-tighter text-[9px]">Assigned Partner</p>
                            <p className="font-bold">{device.collectorId?.displayName || 'Unknown Partner'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-300">
                        <div className="p-1.5 bg-white/5 rounded-lg">
                            <Calendar className="w-3.5 h-3.5 text-orange-400/80" />
                        </div>
                        <div>
                            <p className="text-slate-500 font-medium uppercase tracking-tighter text-[9px]">Last Status Update</p>
                            <p className="font-bold">{new Date(device.updatedAt).toLocaleDateString()} • {new Date(device.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={() => navigate(`/recycler/request/${device._id}`)}
                className="w-full p-4 bg-white/5 hover:bg-orange-500/10 border-t border-white/5 flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-orange-400 transition-all group/btn"
            >
                View Full Tracking Details
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
        </div>
    );
}
