import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Recycle, Truck, Factory, Building2, User, Leaf, ArrowLeft, Sun, Moon, Globe, X, Code, Github, Linkedin, KeyRound, Eye, EyeOff, CreditCard, Phone } from 'lucide-react';
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
    const [searchParams] = useSearchParams();
    const { login } = useAuth();
    const { language, setLanguage, t } = useLanguage();

    // Carousel state
    const [currentSlide, setCurrentSlide] = useState(0);
    const carouselImages = [img1, img2, img3, img4, img5];

    // Theme state
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);
    const [showAboutModal, setShowAboutModal] = useState(false);

    // Login state
    const [selectedRole, setSelectedRole] = useState(null);
    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Registration State
    const [viewMode, setViewMode] = useState('login'); // 'login' | 'register'
    const [regData, setRegData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        organization: '', // Used for Aadhar/Facility/Dept
        phone: ''
    });

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (regData.password !== regData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            // Map specific fields based on role
            const payload = {
                email: regData.email,
                password: regData.password,
                role: selectedRole.toUpperCase(), // Backend expects uppercase
                full_name: regData.fullName,
                phone: regData.phone
            };

            // Map organization/extra field
            if (selectedRole === 'collector') {
                // Aadhar is stored in organization column for now
                payload.organization = regData.organization;
            } else if (selectedRole === 'recycler') {
                payload.organization = regData.organization;
            } else if (selectedRole === 'government') {
                payload.organization = regData.organization;
            }

            await api.post('/auth/register', payload);

            // Success! Switch to login and pre-fill
            setFormData({ identifier: regData.email, password: '' });
            setViewMode('login');
            setError('');
            alert('Registration Successful! Please login.'); // Simple feedback
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setIsLoading(false);
        }
    };

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

    const developers = [
        { name: 'Shubham Singh' },
        { name: 'Abhinab Jana' },
        { name: 'Manjot Singh' },
        { name: 'Abhishek Chaturvedi' },
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

    // Read role from URL parameter and auto-select it
    useEffect(() => {
        const roleParam = searchParams.get('role');
        if (roleParam && ['citizen', 'collector', 'recycler', 'government'].includes(roleParam)) {
            setSelectedRole(roleParam);
        }
    }, [searchParams]);

    // Scroll to login form when role is selected
    useEffect(() => {
        if (selectedRole) {
            // Wait for DOM to update, then scroll
            requestAnimationFrame(() => {
                setTimeout(() => {
                    const formSection = document.getElementById('login-form-section');
                    if (formSection) {
                        // Scroll to the top of the form section
                        window.scrollTo({
                            top: formSection.offsetTop,
                            behavior: 'instant'
                        });
                    }
                }, 100);
            });
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

            // Normalize role for navigation (govt -> government)
            const navigationRole = userRole === 'govt' ? 'government' : userRole;
            navigate(`/${navigationRole}/dashboard`);
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    // Reset view mode when role changes
    useEffect(() => {
        setViewMode('login');
        setError('');
        setRegData({ fullName: '', email: '', password: '', confirmPassword: '', organization: '', phone: '' });
    }, [selectedRole]);

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
            activeBg: 'bg-emerald-600',
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
            activeBg: 'bg-blue-600',
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
            activeBg: 'bg-orange-600',
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
            activeBg: 'bg-purple-600',
            registerPath: '/register/government',
            registerLabel: t.registerGovernment || t.contactAdmin
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
                            <button
                                onClick={() => setShowAboutModal(true)}
                                className={`text-base font-medium ${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}
                            >
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

            {/* About Us Modal */}
            {showAboutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className={`relative max-w-2xl w-full ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} rounded-2xl shadow-2xl border p-8 max-h-[90vh] overflow-y-auto`}>
                        {/* Close Button */}
                        <button
                            onClick={() => setShowAboutModal(false)}
                            className={`absolute top-4 right-4 p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'} transition-colors`}
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Header */}
                        <div className="text-center mb-8">
                            <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'} mb-2`}>About RecycleBharat</h2>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>National E-Waste Management Portal</p>
                        </div>

                        {/* Mission */}
                        <div className="mb-8">
                            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'} mb-3`}>Our Mission</h3>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'} leading-relaxed`}>
                                RecycleBharat is a comprehensive e-waste management platform designed to streamline the collection,
                                processing, and recycling of electronic waste across India. We connect citizens, collectors, recyclers,
                                and government agencies to create a sustainable ecosystem for responsible e-waste disposal.
                            </p>
                        </div>

                        {/* Developers */}
                        <div>
                            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'} mb-4`}>Development Team</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {developers.map((dev, idx) => (
                                    <div key={idx} className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} border rounded-xl p-4 transition-all hover:shadow-lg`}>
                                        <div className="flex items-center justify-center">
                                            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{dev.name}</h4>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
                            <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                © 2026 RecycleBharat • Built with ❤️ for a sustainable future
                            </p>
                        </div>
                    </div>
                </div>
            )}

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
                            <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-b from-slate-900/90 via-slate-800/85 to-slate-900/90' : 'bg-gradient-to-b from-green-50/90 via-emerald-100/60 to-green-50/90'}`} />
                        </div>
                    ))}
                </div>

                {/* Hero Content */}
                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        {/* Government Emblem */}
                        <motion.img
                            src={appLogo}
                            alt="Recycle Bharat Logo"
                            className="w-24 h-24 mx-auto mb-8 drop-shadow-2xl"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        />

                        {/* Main Title */}
                        <h1 className={`text-5xl md:text-6xl font-bold tracking-tight mb-2 transition-colors ${isDarkMode ? 'text-white drop-shadow-2xl' : 'text-emerald-950 drop-shadow-sm'}`}>
                            {language === 'en' ? (
                                <>recycle<span className="font-normal">Bharat</span></>
                            ) : (
                                t.title
                            )}
                        </h1>

                        <p className={`text-xl md:text-2xl font-medium mb-2 transition-colors ${isDarkMode ? 'text-white drop-shadow-lg' : 'text-emerald-900'}`}>
                            {t.subtitle}
                        </p>

                        <p className={`text-base transition-colors ${isDarkMode ? 'text-slate-200 drop-shadow' : 'text-emerald-700'}`}>
                            {t.tagline}
                        </p>
                    </motion.div>
                </div>

                {/* Carousel Indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                    {carouselImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all ${index === currentSlide
                                ? (isDarkMode ? 'bg-white w-8' : 'bg-emerald-600 w-8')
                                : (isDarkMode ? 'bg-white/50 hover:bg-white/75' : 'bg-emerald-900/20 hover:bg-emerald-900/40')
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </section>

            {/* Role Selection Section */}
            <section className={`${isDarkMode ? 'bg-slate-900' : 'bg-white'} pb-12 transition-colors relative`}>
                {/* Stats Section - Floating Bar Design */}
                <div className="relative z-20 px-4 mb-16">
                    <motion.div
                        className={`max-w-6xl mx-auto -mt-16 rounded-2xl shadow-xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'} py-8 px-8 transform transition-colors`}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100 dark:divide-slate-700">
                            {stats.map((stat) => (
                                <div key={stat.key} className="flex items-center justify-center gap-4 group">
                                    <div className={`group-hover:scale-110 transition-transform duration-300`}>
                                        <stat.icon className="w-10 h-10 text-rose-500 stroke-[1.5]" />
                                    </div>
                                    <div className="text-left">
                                        <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            {stat.value}
                                        </div>
                                        <div className={`text-[10px] md:text-xs uppercase tracking-wider font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mt-1`}>
                                            {stat.label}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
                <div className="max-w-6xl mx-auto px-4">
                    <motion.h2
                        className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'} mb-8 text-center`}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        {t.selectRole}
                    </motion.h2>
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.15
                                }
                            }
                        }}
                    >
                        {roleCards.map((role) => (
                            <motion.button
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    show: { opacity: 1, y: 0 }
                                }}
                                key={role.id}
                                onClick={() => setSelectedRole(role.id)}
                                className={`group relative flex flex-col ${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-5 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl ${selectedRole === role.id
                                    ? 'border-transparent' // Border is handled by layoutId
                                    : isDarkMode ? 'border border-slate-700 hover:border-slate-600' : 'border border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                {/* Icon */}
                                <div className={`${role.iconBg} w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 transition-transform duration-300 group-hover:scale-110`}>
                                    <role.icon className={`w-7 h-7 ${role.iconColor}`} />
                                </div>

                                <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{role.title}</h3>
                                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mb-4 leading-relaxed`}>
                                    {role.description}
                                </p>

                                {/* Action Buttons */}
                                <div className="space-y-2 mt-auto">
                                    <div className={`w-full py-2 rounded-lg font-medium transition-colors ${selectedRole === role.id
                                        ? `bg-gradient-to-r ${role.color} text-white shadow-md`
                                        : `${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'} group-hover:bg-slate-200 dark:group-hover:bg-slate-600`
                                        }`}>
                                        {selectedRole === role.id ? t.selected : 'Select'}
                                    </div>

                                    {selectedRole === role.id && role.registerPath && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                        >
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedRole(role.id);
                                                    setViewMode('register');
                                                }}
                                                className={`block w-full py-2 rounded-lg border border-dashed border-slate-300 text-slate-500 text-sm hover:text-slate-800 hover:border-slate-800 transition-colors z-20 relative`}
                                            >
                                                {role.registerLabel}
                                            </button>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Selection Indicator */}
                                {selectedRole === role.id && (
                                    <motion.div
                                        layoutId="selectionRing"
                                        className={`absolute -inset-1 rounded-2xl border-2 ${role.borderColor} pointer-events-none opacity-50`}
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </motion.button>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Unified Auth Section */}
            <AnimatePresence mode="wait">
                {selectedRole && (
                    <motion.section
                        key="auth-section"
                        id="login-form-section"
                        className={`min-h-screen ${isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'} py-20 px-4`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <div className="max-w-md mx-auto">
                            {/* Back Button */}
                            <button
                                onClick={() => setSelectedRole(null)}
                                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span>{t.changeRole}</span>
                            </button>

                            {/* Header Card */}
                            <div className="text-center mb-8 space-y-4">
                                <div className="flex items-center justify-center gap-3">
                                    <div className={`${currentRoleConfig.iconBg} p-3 rounded-xl`}>
                                        <RoleIcon className={`w-6 h-6 ${currentRoleConfig.iconColor}`} />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-white">
                                        {viewMode === 'login' ? `${currentRoleConfig.title} Login` : `Register as ${currentRoleConfig.title}`}
                                    </h2>
                                </div>
                            </div>

                            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl ring-1 ring-white/5">
                                {error && (
                                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                        {error}
                                    </div>
                                )}

                                {viewMode === 'login' ? (
                                    /* LOGIN FORM */
                                    <form onSubmit={handleLogin} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300 ml-1">{t.emailAddress}</label>
                                            <Input
                                                type="email"
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
                                                <Link to={`/forgot-password?role=${selectedRole}`} className="text-xs font-medium text-emerald-400 hover:text-emerald-300">Forgot Password?</Link>
                                            </div>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    autoComplete="current-password"
                                                    placeholder="••••••••"
                                                    className="bg-slate-950/50 border-white/10 focus:border-emerald-500/50 text-white pr-10"
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    required
                                                />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200">
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>
                                        <Button type="submit" className={`w-full mt-6 h-11 text-base bg-gradient-to-r ${currentRoleConfig.color} ${currentRoleConfig.hoverColor}`} disabled={isLoading}>
                                            {isLoading ? t.authenticating : t.accessDashboard}
                                        </Button>
                                    </form>
                                ) : (
                                    /* REGISTER FORM */
                                    <form onSubmit={handleRegister} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
                                            <Input
                                                placeholder={selectedRole === 'government' ? "Official Name" : selectedRole === 'recycler' ? "Owner Name" : "Your Name"}
                                                className="bg-slate-950/50 border-white/10 focus:border-emerald-500/50 text-white"
                                                value={regData.fullName}
                                                onChange={(e) => setRegData({ ...regData, fullName: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                                            <Input
                                                type="email"
                                                placeholder="user@example.com"
                                                className="bg-slate-950/50 border-white/10 focus:border-emerald-500/50 text-white"
                                                value={regData.email}
                                                onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                                                required
                                            />
                                        </div>

                                        {/* Dynamic Role Fields */}
                                        {selectedRole === 'collector' && (
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-300 ml-1 flex items-center gap-2">
                                                    <CreditCard className="w-4 h-4" /> Aadhar Number
                                                </label>
                                                <Input
                                                    placeholder="XXXX-XXXX-XXXX"
                                                    className="bg-slate-950/50 border-white/10 focus:border-emerald-500/50 text-white"
                                                    value={regData.organization}
                                                    onChange={(e) => setRegData({ ...regData, organization: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        )}
                                        {selectedRole === 'recycler' && (
                                            <>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-300 ml-1 flex items-center gap-2">
                                                        <Factory className="w-4 h-4" /> Facility Name
                                                    </label>
                                                    <Input
                                                        placeholder="Eco Processing Unit 1"
                                                        className="bg-slate-950/50 border-white/10 focus:border-emerald-500/50 text-white"
                                                        value={regData.organization}
                                                        onChange={(e) => setRegData({ ...regData, organization: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-300 ml-1 flex items-center gap-2">
                                                        <Phone className="w-4 h-4" /> Contact Phone
                                                    </label>
                                                    <Input
                                                        placeholder="+91 98765 43210"
                                                        className="bg-slate-950/50 border-white/10 focus:border-emerald-500/50 text-white"
                                                        value={regData.phone}
                                                        onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </>
                                        )}
                                        {selectedRole === 'government' && (
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-300 ml-1 flex items-center gap-2">
                                                    <Building2 className="w-4 h-4" /> Department
                                                </label>
                                                <Input
                                                    placeholder="e.g. Pollution Control Board"
                                                    className="bg-slate-950/50 border-white/10 focus:border-emerald-500/50 text-white"
                                                    value={regData.organization}
                                                    onChange={(e) => setRegData({ ...regData, organization: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Create password"
                                                className="bg-slate-950/50 border-white/10 focus:border-emerald-500/50 text-white"
                                                value={regData.password}
                                                onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300 ml-1">Confirm Password</label>
                                            <Input
                                                type="password"
                                                placeholder="Confirm password"
                                                className="bg-slate-950/50 border-white/10 focus:border-emerald-500/50 text-white"
                                                value={regData.confirmPassword}
                                                onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <Button type="submit" className={`w-full mt-6 h-11 text-base bg-gradient-to-r ${currentRoleConfig.color} ${currentRoleConfig.hoverColor}`} disabled={isLoading}>
                                            {isLoading ? 'Creating Account...' : 'Complete Registration'}
                                        </Button>
                                    </form>
                                )}

                                <div className="mt-6 text-center text-sm text-slate-400">
                                    {viewMode === 'login' ? (
                                        <>
                                            {t.newAs} {currentRoleConfig.title}?{' '}
                                            <button
                                                onClick={() => setViewMode('register')}
                                                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                                            >
                                                Create Account
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            Already have an account?{' '}
                                            <button
                                                onClick={() => setViewMode('login')}
                                                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                                            >
                                                Sign In
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

            {/* Developer Credits Section */}
            <section className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'} py-12 border-t transition-colors`}>
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-8">
                        <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'} mb-2`}>Developed By</h3>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Meet the team behind RecycleBharat</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        {developers.map((dev, idx) => (
                            <div key={idx} className={`${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} border rounded-xl p-6 text-center transition-all hover:shadow-xl hover:scale-105`}>
                                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Code className="w-8 h-8 text-white" />
                                </div>
                                <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{dev.name}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

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
