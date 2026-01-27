import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
    en: {
        // Navigation
        home: 'Home',
        about: 'About Us',
        contact: 'Contact Us',

        // Landing Page
        title: 'recycleBharat',
        subtitle: 'National E-Waste Management Portal',
        tagline: 'Driving Responsible E-Waste Collection & Awareness',
        selectRole: 'Select Your Role to Continue',

        // Stats
        devicesRecycled: 'Devices Recycled',
        activeCitizens: 'Active Citizens',
        wasteDiverted: 'Waste Diverted',
        recyclingCenters: 'Recycling Centers',

        // Role Cards
        citizen: 'Citizen',
        citizenDesc: 'Register your e-waste devices and track recycling',
        collector: 'Collector',
        collectorDesc: 'Manage pickups and deliveries to recycling centers',
        recycler: 'Recycler',
        recyclerDesc: 'Process e-waste and manage recycling operations',
        government: 'Government',
        governmentDesc: 'Monitor and analyze e-waste management data',
        loginRegister: 'Login / Register',
        selected: 'Selected',

        // Login Form
        changeRole: 'Change Role',
        emailAddress: 'Email Address',
        password: 'Password',
        forgot: 'Forgot?',
        authenticating: 'Authenticating...',
        accessDashboard: 'Access Dashboard',
        newAs: 'New as a',
        createAccount: 'Create Citizen Account',
        registerCollector: 'Register as Collector',
        registerRecycler: 'Register Recycling Facility',
        registerGovernment: 'Official Registration',
        contactAdmin: 'Contact Administrator',

        // Footer
        secure: 'Secure • Transparent • Government Approved',
        copyright: '© 2026 Ministry of Environment, Forest and Climate Change',
    },
    hi: {
        // Navigation
        home: 'होम',
        about: 'हमारे बारे में',
        contact: 'संपर्क करें',

        // Landing Page
        title: 'रीसायकल भारत',
        subtitle: 'राष्ट्रीय ई-कचरा प्रबंधन पोर्टल',
        tagline: 'जिम्मेदार ई-कचरा संग्रह और जागरूकता को बढ़ावा देना',
        selectRole: 'जारी रखने के लिए अपनी भूमिका चुनें',

        // Stats
        devicesRecycled: 'रीसायकल किए गए उपकरण',
        activeCitizens: 'सक्रिय नागरिक',
        wasteDiverted: 'कचरा डायवर्ट किया गया',
        recyclingCenters: 'रीसाइक्लिंग केंद्र',

        // Role Cards
        citizen: 'नागरिक',
        citizenDesc: 'अपने ई-कचरे के उपकरणों को पंजीकृत करें और रीसाइक्लिंग को ट्रैक करें',
        collector: 'संग्रहकर्ता',
        collectorDesc: 'रीसाइक्लिंग केंद्रों में पिकअप और डिलीवरी का प्रबंधन करें',
        recycler: 'रीसाइक्लर',
        recyclerDesc: 'ई-कचरे को संसाधित करें और रीसाइक्लिंग संचालन का प्रबंधन करें',
        government: 'सरकार',
        governmentDesc: 'ई-कचरा प्रबंधन डेटा की निगरानी और विश्लेषण करें',
        loginRegister: 'लॉगिन / रजिस्टर',
        selected: 'चयनित',

        // Login Form
        changeRole: 'भूमिका बदलें',
        emailAddress: 'ईमेल पता',
        password: 'पासवर्ड',
        forgot: 'भूल गए?',
        authenticating: 'प्रमाणीकरण...',
        accessDashboard: 'डैशबोर्ड एक्सेस करें',
        newAs: 'नए के रूप में',
        createAccount: 'नागरिक खाता बनाएं',
        registerCollector: 'संग्रहकर्ता के रूप में पंजीकरण करें',
        registerRecycler: 'रीसाइक्लिंग सुविधा पंजीकृत करें',
        registerGovernment: 'आधिकारिक पंजीकरण',
        contactAdmin: 'व्यवस्थापक से संपर्क करें',

        // Footer
        secure: 'सुरक्षित • पारदर्शी • सरकार द्वारा अनुमोदित',
        copyright: '© 2026 पर्यावरण, वन और जलवायु परिवर्तन मंत्रालय',
    },
    pa: {
        // Navigation
        home: 'ਘਰ',
        about: 'ਸਾਡੇ ਬਾਰੇ',
        contact: 'ਸੰਪਰਕ ਕਰੋ',

        // Landing Page
        title: 'ਰੀਸਾਈਕਲ ਭਾਰਤ',
        subtitle: 'ਰਾਸ਼ਟਰੀ ਈ-ਕੂੜਾ ਪ੍ਰਬੰਧਨ ਪੋਰਟਲ',
        tagline: 'ਜ਼ਿੰਮੇਵਾਰ ਈ-ਕੂੜਾ ਇਕੱਠਾ ਕਰਨਾ ਅਤੇ ਜਾਗਰੂਕਤਾ ਨੂੰ ਅੱਗੇ ਵਧਾਉਣਾ',
        selectRole: 'ਜਾਰੀ ਰੱਖਣ ਲਈ ਆਪਣੀ ਭੂਮਿਕਾ ਚੁਣੋ',

        // Stats
        devicesRecycled: 'ਰੀਸਾਈਕਲ ਕੀਤੇ ਉਪਕਰਣ',
        activeCitizens: 'ਸਰਗਰਮ ਨਾਗਰਿਕ',
        wasteDiverted: 'ਕੂੜਾ ਮੋੜਿਆ ਗਿਆ',
        recyclingCenters: 'ਰੀਸਾਈਕਲਿੰਗ ਕੇਂਦਰ',

        // Role Cards
        citizen: 'ਨਾਗਰਿਕ',
        citizenDesc: 'ਆਪਣੇ ਈ-ਕੂੜੇ ਦੇ ਉਪਕਰਣਾਂ ਨੂੰ ਰਜਿਸਟਰ ਕਰੋ ਅਤੇ ਰੀਸਾਈਕਲਿੰਗ ਨੂੰ ਟਰੈਕ ਕਰੋ',
        collector: 'ਸੰਗ੍ਰਹਿਕਰਤਾ',
        collectorDesc: 'ਰੀਸਾਈਕਲਿੰਗ ਕੇਂਦਰਾਂ ਵਿੱਚ ਪਿਕਅੱਪ ਅਤੇ ਡਿਲੀਵਰੀ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ',
        recycler: 'ਰੀਸਾਈਕਲਰ',
        recyclerDesc: 'ਈ-ਕੂੜੇ ਦੀ ਪ੍ਰਕਿਰਿਆ ਕਰੋ ਅਤੇ ਰੀਸਾਈਕਲਿੰਗ ਸੰਚਾਲਨ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ',
        government: 'ਸਰਕਾਰ',
        governmentDesc: 'ਈ-ਕੂੜਾ ਪ੍ਰਬੰਧਨ ਡੇਟਾ ਦੀ ਨਿਗਰਾਨੀ ਅਤੇ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ',
        loginRegister: 'ਲਾਗਇਨ / ਰਜਿਸਟਰ',
        selected: 'ਚੁਣਿਆ ਗਿਆ',

        // Login Form
        changeRole: 'ਭੂਮਿਕਾ ਬਦਲੋ',
        emailAddress: 'ਈਮੇਲ ਪਤਾ',
        password: 'ਪਾਸਵਰਡ',
        forgot: 'ਭੁੱਲ ਗਏ?',
        authenticating: 'ਪ੍ਰਮਾਣਿਕਤਾ...',
        accessDashboard: 'ਡੈਸ਼ਬੋਰਡ ਤੱਕ ਪਹੁੰਚ',
        newAs: 'ਨਵੇਂ ਵਜੋਂ',
        createAccount: 'ਨਾਗਰਿਕ ਖਾਤਾ ਬਣਾਓ',
        registerCollector: 'ਸੰਗ੍ਰਹਿਕਰਤਾ ਵਜੋਂ ਰਜਿਸਟਰ ਕਰੋ',
        registerRecycler: 'ਰੀਸਾਈਕਲਿੰਗ ਸਹੂਲਤ ਰਜਿਸਟਰ ਕਰੋ',
        registerGovernment: 'ਅਧਿਕਾਰਤ ਰਜਿਸਟ੍ਰੇਸ਼ਨ',
        contactAdmin: 'ਪ੍ਰਸ਼ਾਸਕ ਨਾਲ ਸੰਪਰਕ ਕਰੋ',

        // Footer
        secure: 'ਸੁਰੱਖਿਅਤ • ਪਾਰਦਰਸ਼ੀ • ਸਰਕਾਰ ਦੁਆਰਾ ਮਨਜ਼ੂਰ',
        copyright: '© 2026 ਵਾਤਾਵਰਣ, ਜੰਗਲ ਅਤੇ ਜਲਵਾਯੂ ਤਬਦੀਲੀ ਮੰਤਰਾਲਾ',
    },
};

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('language') || 'en';
    });

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const t = translations[language];

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
