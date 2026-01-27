import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
    User, Mail, Shield, Bell, Settings, LogOut,
    CheckCircle2, AlertCircle, Loader2, Save,
    Eye, EyeOff, Smartphone, Globe, Moon, Sun
} from 'lucide-react';

export default function CitizenProfile() {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Forms State
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
    const [showPasswords, setShowPasswords] = useState(false);
    const [activeSection, setActiveSection] = useState('Overview');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/profile');
            setProfile(res.data);
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to load profile data' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePreferences = async (newPrefs) => {
        setIsSaving(true);
        try {
            const res = await api.patch('/profile/update', { preferences: newPrefs });
            setProfile(res.data);
            setMessage({ type: 'success', text: 'Preferences updated successfully' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Update failed' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            return setMessage({ type: 'error', text: 'New passwords do not match' });
        }
        setIsSaving(true);
        try {
            await api.post('/profile/change-password', {
                currentPassword: passwordData.current,
                newPassword: passwordData.new
            });
            setMessage({ type: 'success', text: 'Password changed successfully' });
            setPasswordData({ current: '', new: '', confirm: '' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.error || 'Password change failed' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-emerald-500" /></div>;

    const sections = [
        { id: 'Overview', icon: User, label: 'Overview' },
        { id: 'Security', icon: Shield, label: 'Security' },
        { id: 'Notifications', icon: Bell, label: 'Notifications' },
        { id: 'Settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Profile Header */}
            <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-emerald-500/20">
                        {user?.email?.[0]?.toUpperCase()}
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-2">
                        <h1 className="text-2xl font-black text-white tracking-tight">{profile?.displayName || 'Citizen Agent'}</h1>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                <Mail size={14} className="text-emerald-500" />
                                {user?.email}
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                <Shield size={14} className="text-emerald-500" />
                                Verified Account
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification Toast */}
            {message.text && (
                <div className={`p-4 rounded-2xl border flex items-center gap-3 animate-in slide-in-from-top-2 duration-300 ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                    }`}>
                    {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <p className="text-xs font-bold uppercase tracking-wider flex-1">{message.text}</p>
                    <button onClick={() => setMessage({ type: '', text: '' })} className="text-[10px] font-black uppercase opacity-50 hover:opacity-100">Dismiss</button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Navigation Sidebar */}
                <div className="space-y-2">
                    {sections.map(s => (
                        <button
                            key={s.id}
                            onClick={() => setActiveSection(s.id)}
                            className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${activeSection === s.id
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20 translate-x-1'
                                : 'text-slate-500 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <s.icon size={18} />
                            {s.label}
                        </button>
                    ))}
                    <div className="pt-4 border-t border-white/5 mt-4">
                        <button onClick={logout} className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold text-red-500/60 hover:text-red-400 hover:bg-red-500/5 transition-all">
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </div>

                {/* Main Section Content */}
                <div className="lg:col-span-3 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[40px] p-8 min-h-[400px]">
                    {activeSection === 'Overview' && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white">Account Overview</h3>
                                <p className="text-sm text-slate-500 uppercase font-black tracking-tighter">Identity Details</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-2 translate-y-0 hover:-translate-y-1 transition-all">
                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Public Avatar</p>
                                    <p className="text-2xl font-black text-white">{profile?.displayName || 'Citizen'}</p>
                                </div>
                                <div className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-2">
                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">User ID</p>
                                    <p className="text-lg font-mono font-bold text-white uppercase">{profile?._id.slice(-12)}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'Security' && (
                        <form onSubmit={handleChangePassword} className="space-y-8 animate-in fade-in duration-300">
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white">Security Controls</h3>
                                <p className="text-sm text-slate-500 uppercase font-black tracking-tighter">Update Authorization Credentials</p>
                            </div>

                            <div className="space-y-4 max-w-md">
                                <div className="space-y-2">
                                    <label htmlFor="currentPassword" className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Password</label>
                                    <div className="relative">
                                        <input
                                            id="currentPassword"
                                            name="currentPassword"
                                            type={showPasswords ? 'text' : 'password'}
                                            required
                                            value={passwordData.current}
                                            onChange={e => setPasswordData({ ...passwordData, current: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:border-emerald-500 outline-none transition-all"
                                            placeholder="••••••••"
                                        />
                                        <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                                            {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="newPassword" className="text-[10px] font-black text-slate-500 uppercase tracking-widest">New Password</label>
                                    <input
                                        id="newPassword"
                                        name="newPassword"
                                        type={showPasswords ? 'text' : 'password'}
                                        required
                                        value={passwordData.new}
                                        onChange={e => setPasswordData({ ...passwordData, new: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:border-emerald-500 outline-none transition-all"
                                        placeholder="Min 8 characters"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="confirmPassword" className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Confirm New Password</label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showPasswords ? 'text' : 'password'}
                                        required
                                        value={passwordData.confirm}
                                        onChange={e => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:border-emerald-500 outline-none transition-all"
                                        placeholder="Re-enter password"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-900/20 transition-all flex items-center justify-center gap-3 mt-4"
                                >
                                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    CONFIRM SECURITY UPDATE
                                </button>
                            </div>
                        </form>
                    )}

                    {activeSection === 'Notifications' && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white">Notification Matrix</h3>
                                <p className="text-sm text-slate-500 uppercase font-black tracking-tighter">Communication Channels</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-6 bg-white/5 rounded-[32px] border border-white/5 group">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 group-hover:scale-110 transition-transform">
                                            <Mail size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">Email Handlers</h4>
                                            <p className="text-xs text-slate-500">Lifecycle updates and rewards summaries.</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            id="notifications-email"
                                            name="notifications_email"
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={profile?.preferences?.notifications?.email}
                                            onChange={(e) => handleUpdatePreferences({
                                                ...profile.preferences,
                                                notifications: { ...profile.preferences.notifications, email: e.target.checked }
                                            })}
                                        />
                                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-6 bg-white/5 rounded-[32px] border border-white/5 group">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500 group-hover:scale-110 transition-transform">
                                            <Smartphone size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">SMS Overlays</h4>
                                            <p className="text-xs text-slate-500">Real-time pickup SMS alerts.</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            id="notifications-sms"
                                            name="notifications_sms"
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={profile?.preferences?.notifications?.sms}
                                            onChange={(e) => handleUpdatePreferences({
                                                ...profile.preferences,
                                                notifications: { ...profile.preferences.notifications, sms: e.target.checked }
                                            })}
                                        />
                                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'Settings' && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white">Interface Overlays</h3>
                                <p className="text-sm text-slate-500 uppercase font-black tracking-tighter">Personalization Framework</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-8 bg-white/5 rounded-[40px] border border-white/5 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-orange-500/10 rounded-xl text-orange-500">
                                            {profile?.preferences?.settings?.theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                                        </div>
                                        <h4 className="font-bold text-white">Visual Mode</h4>
                                    </div>
                                    <div className="flex gap-2">
                                        {['dark', 'light'].map(t => (
                                            <button
                                                key={t}
                                                onClick={() => handleUpdatePreferences({
                                                    ...profile.preferences,
                                                    settings: { ...profile.preferences.settings, theme: t }
                                                })}
                                                className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${(profile?.preferences?.settings?.theme || 'dark') === t
                                                    ? 'bg-orange-500 text-white shadow-xl shadow-orange-900/20'
                                                    : 'bg-white/5 text-slate-500 hover:text-white'
                                                    }`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-8 bg-white/5 rounded-[40px] border border-white/5 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                                            <Globe size={20} />
                                        </div>
                                        <h4 id="lang-label" className="font-bold text-white">Framework Lang</h4>
                                    </div>
                                    <select
                                        id="settings-language"
                                        name="settings_language"
                                        aria-labelledby="lang-label"
                                        value={profile?.preferences?.settings?.language}
                                        onChange={(e) => handleUpdatePreferences({
                                            ...profile.preferences,
                                            settings: { ...profile.preferences.settings, language: e.target.value }
                                        })}
                                        className="w-full bg-slate-900 border border-white/10 rounded-2xl px-4 py-3 text-xs font-bold text-white outline-none focus:border-emerald-500"
                                    >
                                        <option value="en">English (US)</option>
                                        <option value="es">Español</option>
                                        <option value="fr">Français</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
