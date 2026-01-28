import { useState } from 'react';
import { useStats } from '../hooks/useStats';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
    ShieldCheck, Recycle, Coins, Activity, Loader2, Filter, Download,
    Map as MapIcon, Calendar, ArrowUpRight, ArrowDownRight, Users
} from 'lucide-react';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

const GovernmentDashboard = () => {
    const [dateRange, setDateRange] = useState('This Year');
    const [region, setRegion] = useState('All Zones');
    const { stats, isLoading } = useStats({ dateRange, region });

    if (isLoading) return <div className="h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-emerald-600 w-12 h-12" /></div>;

    // Transform data layers safely to ensure numeric values for Recharts
    const trendsData = (stats?.trends || []).map(t => ({ ...t, count: parseInt(t.count) }));
    const compositionData = (stats?.composition || []).map(c => ({ name: c.name, value: parseInt(c.value) }));
    const userData = (stats?.userStats || []).map(u => ({ name: u.name, value: parseInt(u.value) }));
    const materialData = (stats?.materials || []).map(m => ({ name: m.name, value: parseInt(m.value) }));

    // Transform user data for pie chart details
    const userPieData = userData;

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 space-y-6 animate-in fade-in duration-500">
            {/* Top Bar / Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                        <ShieldCheck className="text-emerald-600" /> Recycle Bharat
                    </h1>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1 ml-9">National E-Waste Monitor • Govt of India</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 border border-slate-200">
                        <Calendar size={14} />
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="bg-transparent outline-none cursor-pointer"
                        >
                            <option>This Year</option>
                            <option>Last Quarter</option>
                            <option>Last Month</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 border border-slate-200">
                        <MapIcon size={14} />
                        <select
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                            className="bg-transparent outline-none cursor-pointer"
                        >
                            <option>All Zones</option>
                            <option>North Zone</option>
                            <option>South Zone</option>
                            <option>East Zone</option>
                            <option>West Zone</option>
                        </select>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10">
                        <Download size={14} /> Export Report
                    </button>
                </div>
            </header>

            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    title="Total E-Waste Registered"
                    value={stats?.totalDevices}
                    subtext="+12.5% from last month"
                    trend="up"
                    icon={Activity}
                    color="blue"
                />
                <KPICard
                    title="Successfully Recycled"
                    value={stats?.recycledDevices}
                    subtext={`${stats?.recyclingRate.toFixed(1)}% Conversion Rate`}
                    trend="up"
                    icon={Recycle}
                    color="emerald"
                />
                <KPICard
                    title="Incentives Distributed"
                    value={`₹${(stats?.totalIncentives / 100).toFixed(0)}k`} // Mock currency conversion
                    subtext="Direct Benefit Transfer"
                    trend="neutral"
                    icon={Coins}
                    color="amber"
                />
                <KPICard
                    title="Active Stakeholders"
                    value={userData.reduce((acc, curr) => acc + parseInt(curr.value), 0)}
                    subtext="Citizens, Collectors, Recyclers"
                    trend="up"
                    icon={Users}
                    color="purple"
                />
            </div>

            {/* Main Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-96">
                {/* Area Chart: Recycling Trends */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800">Recycling Trends Analysis</h3>
                        <Filter size={16} className="text-slate-400 cursor-pointer hover:text-slate-600" />
                    </div>
                    <div className="flex-1 w-full min-h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendsData}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="count" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Donut Chart: Device Composition */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Waste Composition</h3>
                    <p className="text-xs text-slate-500 mb-6">Breakdown by device category</p>
                    <div className="flex-1 w-full min-h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={compositionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {compositionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Row: User Demographics & Regional Heatmap (Mock) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Material Recovery */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Resource Recovery Outcomes</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={materialData}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                                <RechartsTooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Geographical/User Distribution */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Stakeholder Distribution</h3>
                    <div className="flex-1 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={userPieData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                                        const RADIAN = Math.PI / 180;
                                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                        return (
                                            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={10} fontWeight="bold">
                                                {`${(percent * 100).toFixed(0)}%`}
                                            </text>
                                        );
                                    }}
                                >
                                    {userPieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend layout="vertical" verticalAlign="middle" align="right" />
                                <RechartsTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

const KPICard = ({ title, value, subtext, trend, icon: Icon, color }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        amber: 'bg-amber-50 text-amber-600',
        purple: 'bg-purple-50 text-purple-600',
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start">
                <div className={`p-3 rounded-xl ${colorClasses[color]} mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-bold ${trend === 'up' ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {trend === 'up' ? '+2.4%' : '0.0%'}
                    </div>
                )}
            </div>
            <h4 className="text-3xl font-black text-slate-800 mb-1 tracking-tight">{value}</h4>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
            <p className="text-xs text-slate-400 border-t border-slate-50 pt-2 mt-2">{subtext}</p>
        </div>
    );
};

export default GovernmentDashboard;
