import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BarChart3, FileText, Settings, LogOut, Building2, Globe, Sun, Moon, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function GovernmentLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const { theme, setTheme } = useTheme();

    const navItems = [
        { label: 'National Overview', icon: Globe, path: '/government/dashboard' },
        { label: 'E-waste report', icon: FileText, path: '/government/reports' },
        { label: 'Profile Settings', icon: Settings, path: '/government/profile-settings' },
    ];

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden font-sans transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 hidden md:flex flex-col shadow-xl z-20">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-lg shadow-purple-500/20">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Govt. Portal</h2>
                    </div>
                    <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-widest pl-1">E-Waste Authority</p>
                </div>

                <nav className="flex-1 px-4 space-y-2 font-medium">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all duration-200 group relative overflow-hidden",
                                location.pathname === item.path
                                    ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25"
                                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                            )}
                        >
                            <item.icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", location.pathname === item.path ? "text-white" : "text-slate-400 group-hover:text-purple-500")} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100 dark:border-white/5 space-y-4">
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                            {theme === 'dark' ? <Moon size={14} className="text-purple-400" /> : <Sun size={14} className="text-amber-500" />}
                            <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                        </div>
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="w-8 h-4 bg-slate-300 dark:bg-slate-700 rounded-full relative transition-colors focus:outline-none"
                        >
                            <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm ${theme === 'dark' ? 'left-4.5 translate-x-3.5' : 'left-0.5'}`} />
                        </button>
                    </div>

                    <div>
                        <div className="px-3 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                            Logged in as Admin
                        </div>
                        <button
                            onClick={() => {
                                logout();
                                navigate('/login');
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors w-full"
                        >
                            <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto relative bg-slate-50 dark:bg-slate-950">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(168,85,247,0.1),transparent)] pointer-events-none" />

                {/* Mobile Header */}
                <header className="h-16 border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-4 md:hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 transition-colors">
                    <span className="font-black text-lg text-slate-800 dark:text-white flex items-center gap-2">
                        <Building2 className="text-purple-500" size={20} /> Govt. Portal
                    </span>
                    <button className="p-2 text-slate-600 dark:text-slate-300">
                        <Menu size={24} />
                    </button>
                </header>

                <div className="p-6 md:p-8 max-w-[1600px] mx-auto relative z-10 animate-in fade-in duration-500">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
