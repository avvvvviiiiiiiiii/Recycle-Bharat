import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BarChart3, FileText, Settings, LogOut, Building2, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export default function GovernmentLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const navItems = [
        { label: 'National Overview', icon: Globe, path: '/government/dashboard' },
        { label: 'Regional Analytics', icon: BarChart3, path: '/government/regional' },
        { label: 'Compliance Reports', icon: FileText, path: '/government/reports' },
        { label: 'Policy Settings', icon: Settings, path: '/government/settings' },
    ];

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-card/30 hidden md:flex flex-col">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-1">
                        <Building2 className="w-5 h-5 text-purple-400" />
                        <h2 className="text-lg font-bold text-white">Govt. Portal</h2>
                    </div>
                    <p className="text-xs text-muted-foreground">E-Waste Management Authority</p>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                location.pathname === item.path
                                    ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
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
                        Logged in as Admin
                    </div>
                    <button
                        onClick={() => {
                            logout();
                            navigate('/login');
                        }}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-destructive/80 hover:text-destructive transition-colors w-full"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto relative bg-background">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-background to-background pointer-events-none" />

                {/* Mobile Header */}
                <header className="h-16 border-b border-border flex items-center px-4 md:hidden bg-background/80 backdrop-blur-md sticky top-0 z-10">
                    <span className="font-bold text-purple-400">Govt. Analytics</span>
                </header>

                <div className="p-6 md:p-8 max-w-7xl mx-auto relative z-10">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
