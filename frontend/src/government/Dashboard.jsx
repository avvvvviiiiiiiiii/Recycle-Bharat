import { useStats } from '../hooks/useStats';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ShieldCheck, Recycle, Coins, Activity, Loader2 } from 'lucide-react';

const GovernmentDashboard = () => {
    const { stats, isLoading } = useStats();

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-purple-600" /></div>;

    const data = stats?.trends || [];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight">National E-Waste Monitor</h1>
                    <p className="text-gray-500 font-medium">Real-time compliance & sustainability metrics</p>
                </div>
                <div className="px-4 py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs font-bold border border-purple-100 flex items-center gap-2">
                    <ShieldCheck size={14} /> Official Government Access
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Devices" value={stats?.totalDevices} icon={<Activity className="text-blue-500" />} />
                <StatCard title="Recycled Items" value={stats?.recycledDevices} icon={<Recycle className="text-emerald-500" />} />
                <StatCard title="Points Issued" value={stats?.totalIncentives} icon={<Coins className="text-yellow-500" />} />
                <StatCard title="Recycling Rate" value={`${stats?.recyclingRate.toFixed(1)}%`} icon={<div className="font-bold text-sm text-purple-500">Rate</div>} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chart Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-700 mb-6">Recycling Volume (Monthly)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Breakdown Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-gray-700 mb-6">System Health</h3>
                        <div className="space-y-6">
                            <HealthBar label="Verification Latency" value={98} color="bg-emerald-500" />
                            <HealthBar label="Incentive Idempotency" value={100} color="bg-blue-500" />
                            <HealthBar label="Collector Efficiency" value={84} color="bg-purple-500" />
                        </div>
                    </div>
                    <div className="mt-8 p-4 bg-gray-50 rounded-xl text-xs text-gray-500 leading-relaxed italic">
                        All data is synchronized with the audit-trail-verified device registry. Compliance scores are calculated based on recycling frequency vs registration volume.
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
        </div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h4 className="text-2xl font-black text-gray-800">{value}</h4>
    </div>
);

const HealthBar = ({ label, value, color }) => (
    <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-tight">
            <span>{label}</span>
            <span>{value}%</span>
        </div>
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
        </div>
    </div>
);

export default GovernmentDashboard;
