import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShieldAlert, Users, Database, Activity, LogOut, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminLayout() {
    const location = useLocation();

    const navItems = [
        { label: 'System Overview', icon: Activity, path: '/admin/dashboard' },
        { label: 'User Management', icon: Users, path: '/admin/users' },
        { label: 'Data Registry', icon: Database, path: '/admin/registry' },
        { label: 'Security Logs', icon: ShieldAlert, path: '/admin/logs' },
    ];

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-card/30 hidden md:flex flex-col">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-1">
                        <Lock className="w-5 h-5 text-red-500" />
                        <h2 className="text-lg font-bold text-white">Admin Console</h2>
                    </div>
                    <p className="text-xs text-muted-foreground">System Root Access</p>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                location.pathname === item.path
                                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                            )}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-border">
                    <div className="px-3 py-2 text-xs text-muted-foreground mb-1">
                        Super Admin Session
                    </div>
                    <Link to="/login" className="flex items-center gap-3 px-3 py-2 text-sm text-destructive/80 hover:text-destructive transition-colors">
                        <LogOut className="w-4 h-4" /> Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-background to-background">
                {/* Mobile Header */}
                <header className="h-16 border-b border-border flex items-center px-4 md:hidden bg-background/80 backdrop-blur-md sticky top-0 z-10">
                    <span className="font-bold text-red-400">Admin Control</span>
                </header>

                <div className="p-6 md:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
