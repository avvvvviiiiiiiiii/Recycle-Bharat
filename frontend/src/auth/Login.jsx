import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Recycle, Truck, Factory, Building2, User, Leaf, ArrowLeft, Sun, Moon, Globe } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import api from '@/api/axios';

// Import carousel images
import img1 from '@/images/1.png';
import img2 from '@/images/2.png';
import img3 from '@/images/3.png';
import img4 from '@/images/4.png';
import img5 from '@/images/5.png';
import appLogo from '@/applogo.png';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { language, setLanguage, t } = useLanguage();

    // Carousel state
    const [currentSlide, setCurrentSlide] = useState(0);
    const carouselImages = [img1, img2, img3, img4, img5];

    // Theme state
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);

    // Login state
    const [selectedRole, setSelectedRole] = useState(null);
    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Stats state
    const [stats, setStats] = useState([
        { value: '...', label: t.devicesRecycled, icon: Recycle, key: 'devicesRecycled' },
        { value: '...', label: t.activeCitizens, icon: User, key: 'activeCitizens' },
        { value: '...', label: t.wasteDiverted, icon: Leaf, key: 'wasteDiverted' },
        { value: '...', label: t.recyclingCenters, icon: Factory, key: 'recyclingCenters' },
    ]);

    const languages = [
        { code: 'en', name: 'English', nativeName: 'English' },
        { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
        { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
    ];

    // Auto-rotate carousel
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Fetch real statistics
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/public/stats');
                const data = response.data;

                setStats([
                    { value: `${data.devicesRecycled}`, label: t.devicesRecycled, icon: Recycle, key: 'devicesRecycled' },
                    { value: `${data.activeCitizens}`, label: t.activeCitizens, icon: User, key: 'activeCitizens' },
                    { value: `${data.wasteDiverted}%`, label: t.wasteDiverted, icon: Leaf, key: 'wasteDiverted' },
                    { value: `${data.recyclingCenters}`, label: t.recyclingCenters, icon: Factory, key: 'recyclingCenters' },
                ]);
            } catch (err) {
                console.error('[Stats] Failed to fetch stats:', err);
                setStats([
                    { value: '0', label: t.devicesRecycled, icon: Recycle, key: 'devicesRecycled' },
                    { value: '0', label: t.activeCitizens, icon: User, key: 'activeCitizens' },
                    { value: '0%', label: t.wasteDiverted, icon: Leaf, key: 'wasteDiverted' },
                    { value: '0', label: t.recyclingCenters, icon: Factory, key: 'recyclingCenters' },
                ]);
            }
        };

        fetchStats();
    }, [language, t]);

    // Scroll to login form when role is selected
    useEffect(() => {
        if (selectedRole) {
            setTimeout(() => {
                document.getElementById('login-form-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, [selectedRole]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const user = await login(formData.identifier, formData.password);
            const userRole = user.role.toLowerCase();

            if (userRole !== selectedRole && selectedRole !== 'government') {
                setError(`Access denied. Your account is registered as a ${user.role}, but you are trying to log in as a ${selectedRole}.`);
                setIsLoading(false);
                return;
            }

            navigate(`/${userRole}/dashboard`);
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const roleCards = [
        {
            id: 'citizen',
            title: t.citizen,
            description: t.citizenDesc,
            icon: User,
            color: 'from-emerald-500 to-emerald-600',
            hoverColor: 'hover:from-emerald-600 hover:to-emerald-700',
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
            borderColor: 'border-emerald-600',
            registerPath: '/register',
            registerLabel: t.createAccount
        },
        {
            id: 'collector',
            title: t.collector,
            description: t.collectorDesc,
            icon: Truck,
            color: 'from-blue-500 to-blue-600',
            hoverColor: 'hover:from-blue-600 hover:to-blue-700',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            borderColor: 'border-blue-600',
            registerPath: '/register/collector',
            registerLabel: t.registerCollector
        },
        {
            id: 'recycler',
            title: t.recycler,
            description: t.recyclerDesc,
            icon: Factory,
            color: 'from-orange-500 to-orange-600',
            hoverColor: 'hover:from-orange-600 hover:to-orange-700',
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
            borderColor: 'border-orange-600',
            registerPath: '/register/recycler',
            registerLabel: t.registerRecycler
        },
        {
            id: 'government',
            title: t.government,
            description: t.governmentDesc,
            icon: Building2,
            color: 'from-purple-500 to-purple-600',
            hoverColor: 'hover:from-purple-600 hover:to-purple-700',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
            borderColor: 'border-purple-600',
            registerPath: '/register',
            registerLabel: t.contactAdmin
        },
    ];

    const currentRoleConfig = selectedRole ? roleCards.find(r => r.id === selectedRole) : null;
    const RoleIcon = currentRoleConfig?.icon;

    return (
        <div className={`min-h-screen overflow-y-auto scroll-smooth ${isDarkMode ? 'dark' : ''}`}>
            {/* Government Header Bar */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-600 via-white to-green-600 h-1" />

            {/* Navigation Ribbon */}
            <nav className={`fixed top-1 left-0 right-0 z-40 ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} border-b shadow-sm transition-colors`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Left: Logo and Brand */}
                        <div className="flex items-center gap-3">
                            <img src={appLogo} alt="Recycle Bharat" className="w-10 h-10" />
                            <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                Recycle<span className="font-normal">Bharat</span>
                            </span>
                        </div>

                        {/* Center: Navigation Links */}
                        <div className="hidden md:flex items-center gap-8">
                            <button className={`text-base font-semibold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} border-b-2 border-emerald-600 pb-1`}>
                                {t.home}
                            </button>
                            <button className={`text-base font-medium ${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}>
                                {t.about}
                            </button>
                            <button className={`text-base font-medium ${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}>
                                {t.contact}
                            </button>
                        </div>

                        {/* Right: Theme Toggle and Language Selector */}
                        <div className="flex items-center gap-4">
                            {/* Theme Toggle */}
                            <button
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-800 text-yellow-400' : 'bg-slate-100 text-slate-600'} hover:scale-110 transition-all`}
                                aria-label="Toggle theme"
                            >
                                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>

                            {/* Language Selector */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'} hover:scale-105 transition-all`}
                                >
                                    <Globe className="w-4 h-4" />
                                    <span className="text-sm font-medium">
                                        {languages.find(l => l.code === language)?.nativeName}
                                    </span>
                                </button>

                                {/* Language Dropdown */}
                                {showLanguageMenu && (
                                    <div className={`absolute right-0 mt-2 w-40 rounded-lg shadow-lg ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border overflow-hidden`}>
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => {
                                                    setLanguage(lang.code);
                                                    setShowLanguageMenu(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 text-sm ${language === lang.code
                                                        ? isDarkMode ? 'bg-emerald-900 text-emerald-300' : 'bg-emerald-50 text-emerald-700'
                                                        : isDarkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-50'
                                                    } transition-colors`}
                                            >
                                                {lang.nativeName}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section - Background Slideshow with Title */}
            <section className="min-h-[70vh] relative flex items-center justify-center pt-24 pb-8">
                {/* Background Carousel */}
                <div className="absolute inset-0 z-0">
                    {carouselImages.map((img, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                                }`}
                        >
                            <img
                                src={img}
                                alt={`Slide ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-b from-slate-900/90 via-slate-800/85 to-slate-900/90' : 'bg-gradient-to-b from-blue-900/85 via-purple-900/80 to-blue-900/85'}`} />
                        </div>
                    ))}
                </div>

                {/* Hero Content */}
                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto w-full">
                    {/* Government Emblem */}
                    <img src={appLogo} alt="Recycle Bharat Logo" className="w-24 h-24 mx-auto mb-8 drop-shadow-2xl" />

                    {/* Main Title */}
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white drop-shadow-2xl mb-2">
                        {language === 'en' ? (
                            <>recycle<span className="font-normal">Bharat</span></>
                        ) : (
                            t.title
                        )}
                    </h1>

                    <p className="text-xl md:text-2xl text-white font-medium mb-2 drop-shadow-lg">
                        {t.subtitle}
                    </p>

                    <p className="text-base text-slate-200 drop-shadow">
                        {t.tagline}
                    </p>
                </div>

                {/* Carousel Indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                    {carouselImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </section>

            {/* Stats Section */}
            <section className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} py-8 transition-colors`}>
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat) => (
                            <div key={stat.key} className="text-center">
                                <div className="flex justify-center mb-2">
                                    <stat.icon className="w-10 h-10 text-red-600" />
                                </div>
                                <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'} mb-1`}>{stat.value}</div>
                                <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} font-medium`}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Role Selection Section */}
            <section className={`${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'} py-12 transition-colors`}>
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'} mb-8 text-center`}>{t.selectRole}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        {roleCards.map((role) => (
                            <button
                                key={role.id}
                                onClick={() => setSelectedRole(role.id)}
                                className={`group relative ${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-5 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl border-4 ${selectedRole === role.id
                                        ? `${role.borderColor} ring-4 ring-offset-2 ${isDarkMode ? 'ring-offset-slate-900' : 'ring-offset-slate-50'} shadow-2xl scale-105`
                                        : isDarkMode ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                {/* Icon */}
                                <div className={`${role.iconBg} w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                                    <role.icon className={`w-7 h-7 ${role.iconColor}`} />
                                </div>

                                {/* Title */}
                                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'} mb-1`}>{role.title}</h3>

                                {/* Description */}
                                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-3`}>{role.description}</p>

                                {/* CTA Button */}
                                <div className={`w-full py-2 px-3 rounded-lg bg-gradient-to-r ${role.color} ${role.hoverColor} text-white font-semibold text-xs transition-all`}>
                                    {selectedRole === role.id ? `✓ ${t.selected}` : t.loginRegister}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Login Form Section - Shows when role is selected */}
            {selectedRole && (
                <section id="login-form-section" className={`min-h-screen ${isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'} py-20 px-4`}>
                    <div className="max-w-md mx-auto">
                        {/* Back Button */}
                        <button
                            onClick={() => setSelectedRole(null)}
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>{t.changeRole}</span>
                        </button>

                        {/* Login Card */}
                        <div className="text-center mb-8 space-y-4">
                            <div className="flex items-center justify-center gap-3">
                                <div className={`${currentRoleConfig.iconBg} p-3 rounded-xl`}>
                                    <RoleIcon className={`w-6 h-6 ${currentRoleConfig.iconColor}`} />
                                </div>
                                <h2 className="text-2xl font-semibold text-white">{currentRoleConfig.title} Login</h2>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl ring-1 ring-white/5">
                            {error && (
                                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">
                                        {t.emailAddress}
                                    </label>
                                    <Input
                                        type="email"
                                        id="identifier"
                                        name="identifier"
                                        autoComplete="username"
                                        placeholder="user@example.com"
                                        className="bg-slate-950/50 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 text-white"
                                        value={formData.identifier}
                                        onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-sm font-medium text-slate-300">{t.password}</label>
                                        <a href="#" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                                            {t.forgot}
                                        </a>
                                    </div>
                                    <Input
                                        type="password"
                                        id="password"
                                        name="password"
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        className="bg-slate-950/50 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 text-white"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className={`w-full mt-6 h-11 text-base bg-gradient-to-r ${currentRoleConfig.color} ${currentRoleConfig.hoverColor}`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? t.authenticating : t.accessDashboard}
                                </Button>
                            </form>

                            <div className="mt-6 text-center text-sm text-slate-400">
                                {t.newAs} {currentRoleConfig.title}?{' '}
                                <Link
                                    to={currentRoleConfig.registerPath}
                                    className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                                >
                                    {currentRoleConfig.registerLabel}
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <div className={`${isDarkMode ? 'bg-slate-950' : 'bg-slate-900'} py-6 text-center transition-colors`}>
                <p className="text-xs text-slate-400 font-medium mb-2">
                    {t.secure}
                </p>
                <p className="text-[10px] text-slate-500">
                    {t.copyright}
                </p>
            </div>
        </div>
    );
}
