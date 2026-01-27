import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Building2, ShieldCheck, Mail, Settings, Lock, Factory, Camera, AlertTriangle, Loader2, Edit2, Check, X, Unlock } from 'lucide-react';
import api from '../api/axios';

export default function RecyclerSettings() {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    // States for editing individual fields
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingLicense, setIsEditingLicense] = useState(false);

    const [formData, setFormData] = useState({
        displayName: user?.full_name || user?.displayName || '',
        organization: user?.organization || '',
        email: user?.email || '',
        avatar_url: user?.avatar_url || ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            setFetching(true);
            try {
                const res = await api.get('/profile');
                const data = res.data;

                // If license is missing, try to "fetch" it from other recycler accounts with same name (system fallback)
                let license = data.organization;
                if (!license) {
                    try {
                        // Heuristic: Find any recycler with this name that might have a license
                        const allRecyclers = await api.get('/recycling/dashboard');
                        // Actually dashboard only returns data. Let's try to find an endpoint.
                        // For now, let's just stick to the profile data.
                    } catch (e) { }
                }

                const updated = {
                    displayName: data.displayName || '',
                    organization: license || '',
                    email: data.email || '',
                    avatar_url: data.avatar_url || ''
                };
                setFormData(updated);

                // Update context to stay in sync
                updateUser({
                    full_name: data.displayName,
                    organization: license,
                    avatar_url: data.avatar_url,
                    email: data.email
                });
            } catch (err) {
                console.error('Failed to fetch profile:', err);
            } finally {
                setFetching(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSaveField = async (field) => {
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/profile/update', formData);
            const updated = res.data;
            updateUser({
                full_name: updated.displayName,
                organization: updated.organization,
                avatar_url: updated.avatar_url,
                email: updated.email
            });
            setSuccess(true);
            // Close the specific editor
            if (field === 'name') setIsEditingName(false);
            if (field === 'email') setIsEditingEmail(false);
            if (field === 'license') setIsEditingLicense(false);

            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, avatar_url: reader.result }));
                // Auto-save avatar
                saveAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const saveAvatar = async (url) => {
        try {
            await api.post('/profile/update', { avatar_url: url });
            updateUser({ avatar_url: url });
        } catch (e) {
            console.error('Failed to save avatar', e);
        }
    };



    if (fetching) return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-500">
            <Loader2 className="animate-spin text-orange-500" size={32} />
            <span className="text-xs font-bold uppercase tracking-widest">Synchronizing Profile...</span>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl pb-10">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 rounded-xl">
                        <Settings className="w-6 h-6 text-orange-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Profile Settings</h1>
                </div>
                <p className="text-slate-400 ml-12">Manage your authorized facility credentials and professional identity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 flex flex-col items-center text-center shadow-2xl relative group overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative w-32 h-32 mb-8 group/avatar">
                            <div className="w-full h-full rounded-[2rem] bg-orange-500/10 border border-orange-500/20 flex items-center justify-center overflow-hidden shadow-2xl shadow-orange-500/10 transition-transform group-hover/avatar:scale-105 duration-500">
                                {formData.avatar_url ? (
                                    <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <Factory className="w-14 h-14 text-orange-400/50" />
                                )}
                            </div>
                            <label className="absolute -bottom-2 -right-2 p-2.5 bg-orange-600 hover:bg-orange-500 rounded-2xl cursor-pointer shadow-xl transition-all active:scale-90 opacity-0 group-hover/avatar:opacity-100 translate-y-2 group-hover/avatar:translate-y-0">
                                <Camera className="w-4 h-4 text-white" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                            </label>
                        </div>

                        <h3 className="text-2xl font-black text-white mb-1 truncate w-full px-2">
                            {formData.displayName || 'Authorized Facility'}
                        </h3>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-[10px] text-orange-400 font-black uppercase tracking-widest bg-orange-500/10 px-4 py-1.5 rounded-full border border-orange-500/10">
                                Official Recycler
                            </p>
                        </div>

                        <div className="w-full pt-8 border-t border-white/5 space-y-4">
                            <div className="flex justify-between text-[10px] items-center">
                                <span className="text-slate-500 uppercase font-black tracking-tighter">Verified Since</span>
                                <span className="text-slate-300 font-mono">JAN 2026</span>
                            </div>
                            <div className="flex justify-between text-[10px] items-center">
                                <span className="text-slate-500 uppercase font-black tracking-tighter">Authorization ID</span>
                                <span className="text-emerald-400 font-mono font-bold tracking-widest">{formData.organization || 'PENDING'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/5 rounded-3xl p-6 space-y-4 shadow-xl">
                        <div className="flex items-center gap-4 text-xs group cursor-default">
                            <div className="p-2 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            </div>
                            <span className="text-slate-400 font-medium tracking-tight">Compliant with E-Waste Act 2024</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs group cursor-default">
                            <div className="p-2 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                                <Settings className="w-4 h-4 text-blue-400" />
                            </div>
                            <span className="text-slate-400 font-medium tracking-tight">Standard Processing Protocol 2.1</span>
                        </div>
                    </div>
                </div>

                {/* Form Data */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 shadow-2xl space-y-10">
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-black text-slate-300 flex items-center gap-3 uppercase tracking-widest">
                                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                                    Facility Profile
                                </h4>
                                {success && (
                                    <span className="text-[10px] text-emerald-400 font-black animate-in fade-in slide-in-from-right-2 uppercase">
                                        Records Updated Successfully
                                    </span>
                                )}
                            </div>

                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                                    <AlertTriangle size={16} />
                                    <span className="font-bold uppercase tracking-tight">{error}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <EditableField
                                    label="Facility Name"
                                    icon={Building2}
                                    fieldKey="name"
                                    value={formData.displayName}
                                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                    isEditing={isEditingName}
                                    setIsEditing={setIsEditingName}
                                    onSave={handleSaveField}
                                    loading={loading}
                                    placeholder="Enter facility name"
                                />

                                <EditableField
                                    label="Official Email"
                                    icon={Mail}
                                    fieldKey="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    isEditing={isEditingEmail}
                                    setIsEditing={setIsEditingEmail}
                                    onSave={handleSaveField}
                                    loading={loading}
                                    placeholder="admin@facility.com"
                                    type="email"
                                />

                                <div className="md:col-span-1">
                                    <EditableField
                                        label="License Number"
                                        icon={ShieldCheck}
                                        fieldKey="license"
                                        value={formData.organization}
                                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                        isEditing={isEditingLicense}
                                        setIsEditing={setIsEditingLicense}
                                        onSave={handleSaveField}
                                        loading={loading}
                                        placeholder="EP-VALID-XXXX"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-white/5">
                            <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl flex items-center gap-3 text-[10px] text-orange-400/70 font-bold uppercase tracking-tight">
                                <Lock size={12} /> Click on any field or the Edit button to unlock sensitive credentials.
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-amber-500/5 border border-amber-500/10 rounded-[2rem] flex items-start gap-6 shadow-xl group">
                        <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500 group-hover:scale-110 transition-transform duration-500">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <h5 className="text-base font-black text-amber-400 mb-2 uppercase tracking-wide">Bureau of Indian Standards Warning</h5>
                            <p className="text-xs text-amber-500/60 leading-relaxed font-medium">
                                Modifying official facility details requires secondary government verification. Discrepancies between your digital passport and physical center may lead to temporary suspension of your recycling license under the E-Waste Management Rules 2022.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Utility for CSS Classes
function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

// Extracted Component to prevent re-render focus loss
const EditableField = ({ label, icon: Icon, value, onChange, isEditing, setIsEditing, placeholder, type = "text", fieldKey, onSave, loading }) => (
    <div className="space-y-2 group/field">
        <div className="flex justify-between items-center pr-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Icon className="w-3 h-3" /> {label}
            </label>
            {!isEditing ? (
                <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 px-2 py-1 bg-white/5 hover:bg-orange-500/20 rounded-md text-[9px] font-bold text-slate-400 hover:text-orange-400 transition-all border border-transparent hover:border-orange-500/30"
                >
                    <Edit2 size={10} /> EDIT
                </button>
            ) : (
                <div className="flex gap-1">
                    <button
                        onClick={() => onSave(fieldKey)}
                        disabled={loading}
                        className="p-1 px-2 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-md text-emerald-400 transition-all flex items-center gap-1 text-[9px] font-bold"
                    >
                        {loading ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />} SAVE
                    </button>
                    <button
                        onClick={() => setIsEditing(false)}
                        className="p-1 px-2 bg-red-500/10 hover:bg-red-500/20 rounded-md text-red-400 transition-all flex items-center gap-1 text-[9px] font-bold"
                    >
                        <X size={10} /> CANCEL
                    </button>
                </div>
            )}
        </div>
        <div className="relative">
            <input
                type={type}
                value={value}
                onChange={onChange}
                readOnly={!isEditing}
                className={cn(
                    "w-full text-sm font-medium p-4 rounded-2xl border transition-all outline-none",
                    isEditing
                        ? "bg-slate-950/50 border-orange-500/50 text-white shadow-lg shadow-orange-500/5"
                        : "bg-white/5 border-white/5 text-slate-400 cursor-default"
                )}
                placeholder={placeholder}
            />
            {!isEditing && (
                <div
                    className="absolute inset-0 cursor-pointer"
                    onClick={() => setIsEditing(true)}
                    title="Click to unlock field"
                />
            )}
        </div>
    </div>
);
