import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, Server, AlertTriangle, ShieldCheck, Search, Edit2, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

// MOCK DATA
const mockUsers = [
    { id: 1, name: 'Amit Sharma', role: 'CITIZEN', status: 'ACTIVE', joined: '12 Jan 2024' },
    { id: 2, name: 'EcoCycle Facility A', role: 'RECYCLER', status: 'ACTIVE', joined: '10 Feb 2024' },
    { id: 3, name: 'Rajesh Kumar', role: 'COLLECTOR', status: 'SUSPENDED', joined: '15 Mar 2024' },
    { id: 4, name: 'Priya Verma', role: 'CITIZEN', status: 'ACTIVE', joined: '20 Mar 2024' },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-8">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">System Overview</h1>
                <p className="text-muted-foreground">Manage users, roles, and monitor system health.</p>
            </div>

            {/* System Health Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-card/50 border border-white/5 p-4 rounded-xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">12.5k</div>
                        <div className="text-xs text-muted-foreground">Total Users</div>
                    </div>
                </div>
                <div className="bg-card/50 border border-white/5 p-4 rounded-xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Server className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">99.9%</div>
                        <div className="text-xs text-muted-foreground">Uptime</div>
                    </div>
                </div>
                <div className="bg-card/50 border border-white/5 p-4 rounded-xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">3</div>
                        <div className="text-xs text-muted-foreground">Critical Alerts</div>
                    </div>
                </div>
                <div className="bg-card/50 border border-white/5 p-4 rounded-xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">Secure</div>
                        <div className="text-xs text-muted-foreground">Audit Logs OK</div>
                    </div>
                </div>
            </div>

            {/* User Management Section */}
            <div className="bg-card/40 border border-white/5 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-white">User Management</h3>
                        <p className="text-sm text-muted-foreground">View and manage registered accounts across all roles.</p>
                    </div>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                        <Input placeholder="Search users..." className="pl-9 bg-slate-950/50 border-white/10" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-white/5 text-slate-200 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-3">User Name</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Date Joined</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {mockUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] border ${user.role === 'CITIZEN' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                                user.role === 'COLLECTOR' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                                    'bg-orange-500/10 border-orange-500/20 text-orange-400'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{user.joined}</td>
                                    <td className="px-6 py-4">
                                        <span className={`flex items-center gap-2 ${user.status === 'ACTIVE' ? 'text-emerald-400' : 'text-red-400'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-white">
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-400">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
