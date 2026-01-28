import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import {
    User, Mail, Shield, Bell, Settings, LogOut,
    CheckCircle2, AlertCircle, Loader2, Save,
    Eye, EyeOff, Smartphone, Globe, Moon, Sun, Lock
} from 'lucide-react';

export default function CitizenProfile() {
    const { user, logout } = useAuth();
    const { theme } = useTheme();
    const { setLanguage, t } = useLanguage();
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
            // Sync global language with profile preference
            if (res.data.preferences?.settings?.language) {
                setLanguage(res.data.preferences.settings.language);
            }
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
        { id: 'Overview', icon: User, label: t.overview },
        { id: 'Security', icon: Lock, label: t.security },
        { id: 'Notifications', icon: Bell, label: t.notifications },
        { id: 'Settings', icon: Settings, label: t.settings },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Profile Header */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 relative overflow-hidden shadow-sm">
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-emerald-500/20">
                        {user?.email?.[0]?.toUpperCase()}
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-2">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{profile?.displayName || user?.full_name || 'Citizen User'}</h1>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-xs font-medium bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
                                <Mail size={14} className="text-emerald-500" />
                                {user?.email}
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-xs font-medium bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
                                <Shield size={14} className="text-blue-500" />
                                {t.verifiedAccount || 'Verified Account'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification Toast */}
            {message.text && (
                <div className={`p-4 rounded-xl border flex items-center gap-3 animate-in slide-in-from-top-2 duration-300 ${message.type === 'success'
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800'
                    : 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                    }`}>
                    {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <p className="text-sm font-medium flex-1">{message.text}</p>
                    <button onClick={() => setMessage({ type: '', text: '' })} className="text-xs font-bold uppercase opacity-60 hover:opacity-100">{t.dismiss || 'Dismiss'}</button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-1 space-y-2">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-2 shadow-sm">
                        {sections.map(s => (
                            <button
                                key={s.id}
                                onClick={() => setActiveSection(s.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeSection === s.id
                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                                    }`}
                            >
                                <s.icon size={18} />
                                {s.label}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 border border-transparent hover:border-red-100 dark:hover:border-red-900/20 transition-all bg-white dark:bg-slate-900 shadow-sm"
                    >
                        <LogOut size={18} /> {t.logout || "Sign Out"}
                    </button>
                </div>

                {/* Main Section Content */}
                <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm min-h-[400px]">
                    {activeSection === 'Overview' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.accountOverview}</h3>
                                <p className="text-sm text-slate-500">{t.identityDetails || 'Your personal identity and account information.'}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-2xl space-y-2">
                                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{t.publicAvatar}</p>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{profile?.displayName || 'Citizen'}</p>
                                </div>
                                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-2xl space-y-2">
                                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{t.userId}</p>
                                    <p className="text-lg font-mono font-medium text-slate-900 dark:text-white truncate">{profile?._id}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'Security' && (
                        <form onSubmit={handleChangePassword} className="space-y-6 animate-in fade-in duration-300">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.securityControls}</h3>
                                <p className="text-sm text-slate-500">{t.updateAuth || 'Manage your password and security keys.'}</p>
                            </div>

                            <div className="space-y-4 max-w-md">
                                <div className="space-y-2">
                                    <label htmlFor="currentPassword" className="text-xs font-bold text-slate-500 uppercase">{t.currentPassword}</label>
                                    <div className="relative">
                                        <input
                                            id="currentPassword"
                                            name="currentPassword"
                                            type={showPasswords ? 'text' : 'password'}
                                            required
                                            value={passwordData.current}
                                            onChange={e => setPasswordData({ ...passwordData, current: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                                            placeholder="••••••••"
                                        />
                                        <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                            {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="newPassword" className="text-xs font-bold text-slate-500 uppercase">{t.newPassword}</label>
                                    <input
                                        id="newPassword"
                                        name="newPassword"
                                        type={showPasswords ? 'text' : 'password'}
                                        required
                                        value={passwordData.new}
                                        onChange={e => setPasswordData({ ...passwordData, new: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                                        placeholder="Min 8 characters"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="confirmPassword" className="text-xs font-bold text-slate-500 uppercase">{t.confirmPassword}</label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showPasswords ? 'text' : 'password'}
                                        required
                                        value={passwordData.confirm}
                                        onChange={e => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                                        placeholder="Re-enter password"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 mt-2"
                                >
                                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    {t.changePassword}
                                </button>
                            </div>
                        </form>
                    )}

                    {activeSection === 'Notifications' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.notifications}</h3>
                                <p className="text-sm text-slate-500">{t.preferences || 'Choose how you want to be notified.'}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 group">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl text-emerald-500 shadow-sm">
                                            <Mail size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white">{t.emailHandlers}</h4>
                                            <p className="text-xs text-slate-500">{t.notificationsDesc}</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            id="notifications-email"
                                            name="notifications_email"
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={profile?.preferences?.notifications?.email || false}
                                            onChange={(e) => handleUpdatePreferences({
                                                ...profile.preferences,
                                                notifications: { ...profile.preferences.notifications, email: e.target.checked }
                                            })}
                                        />
                                        <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 group">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl text-blue-500 shadow-sm">
                                            <Smartphone size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white">{t.smsOverlays}</h4>
                                            <p className="text-xs text-slate-500">{t.smsDesc}</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            id="notifications-sms"
                                            name="notifications_sms"
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={profile?.preferences?.notifications?.sms || false}
                                            onChange={(e) => handleUpdatePreferences({
                                                ...profile.preferences,
                                                notifications: { ...profile.preferences.notifications, sms: e.target.checked }
                                            })}
                                        />
                                        <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'Settings' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.interfaceOverlays || 'Interface Settings'}</h3>
                                <p className="text-sm text-slate-500">{t.personalizationFramework || 'Customize your experience.'}</p>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 space-y-4 max-w-md">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-emerald-500 shadow-sm">
                                            <Globe size={20} />
                                        </div>
                                        <h4 id="lang-label" className="font-bold text-slate-900 dark:text-white">{t.frameworkLang}</h4>
                                    </div>
                                    <select
                                        id="settings-language"
                                        name="settings_language"
                                        aria-labelledby="lang-label"
                                        value={profile?.preferences?.settings?.language}
                                        onChange={(e) => {
                                            const newLang = e.target.value;
                                            setLanguage(newLang); // Update Global Context
                                            handleUpdatePreferences({
                                                ...profile.preferences,
                                                settings: { ...profile.preferences.settings, language: newLang }
                                            });
                                        }}
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-emerald-500 cursor-pointer"
                                    >
                                        <option value="en">{t.english}</option>
                                        <option value="hi">{t.hindi}</option>
                                        <option value="pa">{t.punjabi}</option>
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
