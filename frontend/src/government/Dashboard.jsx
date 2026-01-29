import { useState } from 'react';
import { useStats } from '../hooks/useStats';
import api from '../api/axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
    ShieldCheck, Recycle, Coins, Activity, Loader2, Filter, Download,
    Map as MapIcon, Calendar, ArrowUpRight, ArrowDownRight, Users
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; // Import theme context to adjust charts

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

const GovernmentDashboard = () => {
    const [dateRange, setDateRange] = useState('This Year');
    const [region, setRegion] = useState('All Zones');
    const { stats, isLoading } = useStats({ dateRange, region });
    const [isExporting, setIsExporting] = useState(false);
    const { theme } = useTheme();

    const handleExport = async () => {
        try {
            setIsExporting(true);
            const response = await api.get('/analytics/reports');
            const data = response.data;

            if (!data || data.length === 0) {
                alert("No data available to export.");
                return;
            }

            // CSV Header
            const headers = ['ID', 'Device UID', 'Type', 'Brand', 'Model', 'Serial Number', 'Owner Name', 'Owner Email', 'Registered At', 'Collector Name', 'Pickup Address'];

            // CSV Rows
            const csvRows = [headers.join(',')];

            data.forEach(row => {
                const values = [
                    row.id,
                    `"${row.device_uid || ''}"`,
                    `"${row.device_type || ''}"`,
                    `"${row.brand || ''}"`,
                    `"${row.model || ''}"`,
                    `"${row.serial_number || ''}"`,
                    `"${row.owner_name || ''}"`,
                    `"${row.owner_email || ''}"`,
                    `"${new Date(row.registered_at).toLocaleDateString()}"`,
                    `"${row.collector_name || 'Pending'}"`,
                    `"${row.pickup_address || ''}"`
                ];
                csvRows.push(values.join(','));
            });

            const csvContent = csvRows.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `recycle_bharat_report_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Export failed:", error);
            alert("Failed to export report. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    if (isLoading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-purple-600 w-12 h-12" /></div>;

    // Transform data layers safely to ensure numeric values for Recharts
    const trendsData = (stats?.trends || []).map(t => ({ ...t, count: parseInt(t.count) }));
    const compositionData = (stats?.composition || []).map(c => ({ name: c.name, value: parseInt(c.value) }));
    const userData = (stats?.userStats || []).map(u => ({ name: u.name, value: parseInt(u.value) }));
    const materialData = (stats?.materials || []).map(m => ({ name: m.name, value: parseInt(m.value) }));

    // Transform user data for pie chart details
    const userPieData = userData;

    // Chart styles for dark mode
    const chartTextColor = theme === 'dark' ? '#94a3b8' : '#64748b';
    const chartGridColor = theme === 'dark' ? '#334155' : '#e2e8f0';

    return (
        <div className="space-y-6">
            {/* Top Bar / Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
                        <ShieldCheck className="text-purple-600" /> National Overview
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1 ml-9">Real-time E-Waste Monitor • Govt of India</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-white/5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5">
                        <Calendar size={14} />
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="bg-transparent outline-none cursor-pointer dark:bg-transparent"
                        >
                            <option className="dark:bg-slate-800">This Year</option>
                            <option className="dark:bg-slate-800">Last Quarter</option>
                            <option className="dark:bg-slate-800">Last Month</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-white/5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5">
                        <MapIcon size={14} />
                        <select
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                            className="bg-transparent outline-none cursor-pointer dark:bg-transparent"
                        >
                            <option className="dark:bg-slate-800">All Zones</option>
                            <option className="dark:bg-slate-800">North Zone</option>
                            <option className="dark:bg-slate-800">South Zone</option>
                            <option className="dark:bg-slate-800">East Zone</option>
                            <option className="dark:bg-slate-800">West Zone</option>
                        </select>
                    </div>

                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                        {isExporting ? 'Exporting...' : 'Export Report'}
                    </button>
                </div>
            </header>

            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    title="Total E-Waste Register"
                    value={stats?.totalDevices}
                    subtext="+12.5% from last month"
                    trend="up"
                    icon={Activity}
                    color="blue"
                />
                <KPICard
                    title="Recycling Efficiency"
                    value={stats?.recycledDevices}
                    subtext={`${stats?.recyclingRate.toFixed(1)}% Conversion Rate`}
                    trend="up"
                    icon={Recycle}
                    color="emerald"
                />
                <KPICard
                    title="Incentives Disbursed"
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
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Recycling Trends Analysis</h3>
                        <div className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors cursor-pointer">
                            <Filter size={16} className="text-slate-400 dark:text-slate-500" />
                        </div>
                    </div>
                    <div className="flex-1 w-full min-h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendsData}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} opacity={0.5} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: chartTextColor }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: chartTextColor }} />
                                <RechartsTooltip
                                    contentStyle={{
                                        backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                    }}
                                    labelStyle={{ color: theme === 'dark' ? '#e2e8f0' : '#1e293b', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="count" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Donut Chart: Device Composition */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Waste Composition</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Breakdown by device category</p>
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
                                    stroke="none"
                                >
                                    {compositionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{
                                        backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                                        borderRadius: '8px',
                                        border: 'none',
                                    }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Row: User Demographics & Regional Heatmap (Mock) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Material Recovery */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Resource Recovery Outcomes</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={materialData}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={chartGridColor} opacity={0.5} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11, fontWeight: 600, fill: chartTextColor }} axisLine={false} tickLine={false} />
                                <RechartsTooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{
                                        backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                                        borderRadius: '8px',
                                        border: 'none',
                                    }}
                                />
                                <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Geographical/User Distribution */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Stakeholder Distribution</h3>
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
                                    stroke="none"
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
                                <RechartsTooltip
                                    contentStyle={{
                                        backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                                        borderRadius: '8px',
                                        border: 'none',
                                    }}
                                />
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
        blue: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20',
        emerald: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20',
        amber: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20',
        purple: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20',
    };

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 hover:shadow-md transition-all duration-300 group">
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
            <h4 className="text-3xl font-black text-slate-800 dark:text-white mb-1 tracking-tight">{value}</h4>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{title}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-white/5 pt-2 mt-2">{subtext}</p>
        </div>
    );
};

export default GovernmentDashboard;
