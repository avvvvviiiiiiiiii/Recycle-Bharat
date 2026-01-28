import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
    Building2,
    Mail,
    ShieldCheck,
    Edit2,
    Lock,
    Save,
    AlertTriangle,
    Camera
} from 'lucide-react';
import api from '@/api/axios';

const ProfileSettings = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState({
        name: false,
        email: false,
        license: false
    });
    const [formData, setFormData] = useState({
        full_name: user?.full_name || '',
        email: user?.email || '',
        license_number: 'GOVT-AUTH-2024-IN', // Mock placeholder
        role: 'Official Government Authority'
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                full_name: user.full_name,
                email: user.email
            }));
        }
    }, [user]);

    const handleEdit = (field) => {
        setIsEditing(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result;
                setFormData(prev => ({ ...prev, avatar_url: base64String }));
                // Auto-save the photo
                try {
                    console.log('Updating profile photo...');
                    // In a real app, we'd upload this file to S3/Cloudinary and get a URL back
                    // For now, we'll try sending the base64 string if it's small enough, or just update local state
                    // await api.put('/profile/update', { avatar_url: base64String });
                } catch (error) {
                    console.error('Failed to update photo:', error);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (field) => {
        setIsLoading(true);
        try {
            // Placeholder for API call
            // await api.put('/profile/update', ...);
            console.log(`Updating ${field} to ${formData[field]}`);
            setIsEditing(prev => ({ ...prev, [field]: false }));
            // Add toast notification here
        } catch (error) {
            console.error('Update failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-white flex items-center gap-3">
                    <SettingsIcon className="text-orange-500 w-8 h-8" />
                    Profile Settings
                </h1>
                <p className="text-muted-foreground mt-1">
                    Manage your authorized government credentials and official identity.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-card/40 border border-border rounded-3xl p-8 flex flex-col items-center text-center backdrop-blur-sm sticky top-8">

                        {/* Profile Image with Edit Overlay */}
                        <div className="relative group cursor-pointer mb-6" onClick={() => document.getElementById('avatar-upload').click()}>
                            <div className="w-32 h-32 rounded-3xl bg-orange-500/10 border-2 border-orange-500/20 flex items-center justify-center overflow-hidden shadow-lg shadow-orange-500/10 group-hover:border-orange-500/50 transition-all">
                                {formData.avatar_url ? (
                                    <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <Building2 className="w-16 h-16 text-orange-500" />
                                )}
                            </div>

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/60 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs font-bold text-white flex items-center gap-1">
                                    <Camera size={14} /> Change
                                </span>
                            </div>

                            <input
                                type="file"
                                id="avatar-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handlePhotoChange}
                            />
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2">{formData.full_name}</h2>

                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Official Authority</span>
                        </div>

                        <div className="w-full space-y-4">
                            <div className="flex justify-between items-center text-sm p-4 rounded-xl bg-background/50 border border-white/5">
                                <span className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">Verified Since</span>
                                <span className="text-white font-mono font-bold">JAN 2024</span>
                            </div>
                            <div className="flex justify-between items-center text-sm p-4 rounded-xl bg-background/50 border border-white/5">
                                <span className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">Authorization ID</span>
                                <span className="text-emerald-400 font-mono font-bold">GOVT-IN-001</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Edit Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card/40 border border-border rounded-3xl p-8 backdrop-blur-sm">
                        <h3 className="text-sm font-bold text-orange-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                            Official Profile Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Ministry/Department Name */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                        <Building2 size={12} /> Ministry / Department Name
                                    </label>
                                    <button
                                        onClick={() => isEditing.name ? handleSave('full_name') : handleEdit('name')}
                                        className="text-[10px] font-bold text-orange-500 hover:text-orange-400 flex items-center gap-1 bg-orange-500/10 px-2 py-1 rounded-lg transition-colors"
                                    >
                                        {isEditing.name ? <Save size={12} /> : <Edit2 size={12} />}
                                        {isEditing.name ? 'SAVE' : 'EDIT'}
                                    </button>
                                </div>
                                <div className={`relative group transition-all duration-300 ${isEditing.name ? 'scale-105' : ''}`}>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        disabled={!isEditing.name}
                                        className={`w-full bg-black/40 border rounded-2xl py-4 px-5 text-white font-medium outline-none transition-all ${isEditing.name ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-white/10 text-white/50'}`}
                                    />
                                </div>
                            </div>

                            {/* Official Email */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                        <Mail size={12} /> Official Email
                                    </label>
                                    <button
                                        onClick={() => isEditing.email ? handleSave('email') : handleEdit('email')}
                                        className="text-[10px] font-bold text-orange-500 hover:text-orange-400 flex items-center gap-1 bg-orange-500/10 px-2 py-1 rounded-lg transition-colors"
                                    >
                                        {isEditing.email ? <Save size={12} /> : <Edit2 size={12} />}
                                        {isEditing.email ? 'SAVE' : 'EDIT'}
                                    </button>
                                </div>
                                <div className={`relative group transition-all duration-300 ${isEditing.email ? 'scale-105' : ''}`}>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={!isEditing.email}
                                        className={`w-full bg-black/40 border rounded-2xl py-4 px-5 text-white font-medium outline-none transition-all ${isEditing.email ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-white/10 text-white/50'}`}
                                    />
                                </div>
                            </div>

                            {/* License/Auth Number */}
                            <div className="space-y-3 md:col-span-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                        <ShieldCheck size={12} /> Government Authorization Code
                                    </label>
                                    <button
                                        onClick={() => isEditing.license ? handleSave('license_number') : handleEdit('license')}
                                        className="text-[10px] font-bold text-orange-500 hover:text-orange-400 flex items-center gap-1 bg-orange-500/10 px-2 py-1 rounded-lg transition-colors"
                                    >
                                        {isEditing.license ? <Save size={12} /> : <Edit2 size={12} />}
                                        {isEditing.license ? 'SAVE' : 'EDIT'}
                                    </button>
                                </div>
                                <div className={`relative group transition-all duration-300 ${isEditing.license ? 'scale-105' : ''}`}>
                                    <input
                                        type="text"
                                        name="license_number"
                                        value={formData.license_number}
                                        onChange={handleChange}
                                        disabled={!isEditing.license}
                                        className={`w-full bg-black/40 border rounded-2xl py-4 px-5 text-white font-medium outline-none transition-all ${isEditing.license ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-white/10 text-white/50'}`}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/5">
                            <div className="bg-orange-500/5 border border-orange-500/10 rounded-2xl p-4 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                                    <Lock size={20} className="text-orange-500" />
                                </div>
                                <p className="text-xs text-orange-200/60 font-medium leading-relaxed">
                                    Click on any 'EDIT' button to unlock sensitive credentials for modification. Changes are logged for audit purposes.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Warning */}
                    <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 backdrop-blur-sm">
                        <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0 animate-pulse">
                            <AlertTriangle className="text-yellow-500" />
                        </div>
                        <div className="text-center md:text-left">
                            <h4 className="text-sm font-bold text-yellow-500 uppercase tracking-wider mb-1">Bureau of Indian Standards Warning</h4>
                            <p className="text-xs text-yellow-200/60 leading-relaxed max-w-2xl">
                                Unauthorized changes to government portal credentials may result in immediate suspension of access and legal action under the E-Waste Management Rules, 2024.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper component for the header icon
const SettingsIcon = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

export default ProfileSettings;
