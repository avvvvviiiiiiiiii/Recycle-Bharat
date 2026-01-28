import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, History, Award, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

export default function CitizenLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { logout } = useAuth();

    const navItems = [
        { label: t.myDevices, icon: Package, path: '/citizen/dashboard' },
        { label: t.rewards, icon: Award, path: '/citizen/rewards' },
        { label: t.activity, icon: History, path: '/citizen/activity' },
    ];

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-card/30 hidden md:flex flex-col">
                <div className="p-6">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                        {t.profile}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">{t.citizenPortal}</p>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                location.pathname === item.path
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                            )}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-border">
                    <Link to="/citizen/profile" className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground mb-1">
                        <User className="w-4 h-4" /> {t.profile}
                    </Link>
                    <button
                        onClick={() => {
                            logout();
                            navigate('/login');
                        }}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-destructive/80 hover:text-destructive transition-colors w-full"
                    >
                        <LogOut className="w-4 h-4" /> {t.signOut || "Sign Out"}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto relative">
                {/* Mobile Header (Hidden on Desktop) */}
                <header className="h-16 border-b border-border flex items-center px-4 md:hidden bg-background/80 backdrop-blur-md sticky top-0 z-10">
                    <span className="font-bold">Recycle Bharat</span>
                </header>

                <div className="p-6 md:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
