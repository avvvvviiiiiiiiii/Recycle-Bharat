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

        // Settings/Profile
        interfaceOverlays: 'Interface Overlays',
        personalizationFramework: 'Personalization Framework',
        frameworkLang: 'Framework Lang',

        // Dashboard
        assetLedger: 'Asset Ledger',
        inventoryManagement: 'Citizen Inventory Management',
        registerNewAsset: 'Register New Asset',
        regulatedAssets: 'Regulated Unified Assets',
        modernDevicesDesc: 'Modern devices with pre-printed 8-digit unique identities.',
        legacyItems: 'Legacy E-Waste Items',
        legacyItemsDesc: 'Existing electronics requiring manual asset-tagging after calling for recycling.',
        tracked: 'Tracked',
        registered: 'Registered',
        noRegulatedAssets: 'No regulated assets registered',
        noLegacyItems: 'No legacy items registered',
        handoverCode: 'Handover Code',
        deviceDetails: 'Device details',
        lifecycleArchive: 'Lifecycle Archive',
        visualMode: 'Visual Mode',
        vDark: 'Dark',
        vLight: 'Light',

        // Navigation
        myDevices: 'My Devices',
        rewards: 'Rewards',
        activity: 'Activity',
        citizenPortal: 'Citizen Portal',

        // Rewards
        totalBalance: 'Total Balance',
        points: 'Points',
        redeemRewards: 'Redeem Rewards',
        quickStats: 'Quick Stats',
        recycledItems: 'Recycled Items',
        rewardHistory: 'Reward History',
        noRewardsEarned: 'No rewards earned yet.',
        autoIssueNotice: 'Verification points are issued automatically once a device is delivered to a recycler.',

        // Activity
        activityHistory: 'Activity History',
        noRecordedActivities: 'No recorded activities yet.',
        statusUpdate: 'Status Update',
        rewardEarned: 'Reward Earned',
        systemEvent: 'System Event',

        // Device Details
        backToMyDevices: 'Back to My Devices',
        archivedProfile: 'Archived Profile',
        activeInventory: 'Active Inventory',
        recycleCalled: 'Recycle Called',
        agentDispatched: 'Agent Dispatched',
        reachedFacility: 'Reached Facility',
        fullyRecycling: 'Fully Recycled',
        inTransit: 'In Transit',
        verifiedEntry: 'Verified Entry',
        pendingStage: 'Pending Stage',
        proofNotice: 'To prevent fraud, you must provide your Device Unique Code (DUC) to the collector during physical handover.',
        initiatePickup: 'Initiate Pickup',
        callForRecycling: 'CALL FOR RECYCLING',
        revealPickupCode: 'Reveal Pickup Code',
        regenerateCode: 'Regenerate Code',

        // Register Device
        registerDevice: 'Register Device',
        deviceType: 'Device Type',
        brand: 'Brand',
        model: 'Model',
        purchaseYear: 'Purchase Year',
        serialNumber: 'Serial Number (Optional)',
        backToDashboard: 'Back to Dashboard',
        profile: 'Profile',
        settings: 'Settings',
        verifiedAccount: 'Verified Account',
        accountOverview: 'Account Overview',
        identityDetails: 'Identity Details',
        publicAvatar: 'Public Avatar',
        userId: 'User ID',
        logout: 'Logout',
        securityControls: 'Security Controls',
        updateAuth: 'Update Authorization Credentials',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        confirmPassword: 'Confirm Password',
        saveChanges: 'Save Changes',
        changePassword: 'Change Password',
        dismiss: 'Dismiss',
        preferences: 'Preferences',
        interfaceCustomization: 'Interface Customization',
        notificationsDesc: 'Configure how you receive system alerts',
        securityDesc: 'Manage your access and credentials',
        emailHandlers: 'Email Handlers',
        smsOverlays: 'SMS Overlays',
        smsDesc: 'Real-time pickup SMS alerts.',
        english: 'English (US)',
        hindi: 'Hindi (हिन्दी)',
        punjabi: 'Punjabi (ਪੰਜਾਬੀ)',
        createCitizenAccount: 'Create Citizen Account',
        citizenRegistrationPortal: 'Citizen Registration Portal',
        fullName: 'Full Name',
        setPassword: 'Set Password',
        creatingAccount: 'Creating Account...',
        registerCitizenAccount: 'Register Citizen Account',
        alreadyHaveIdentity: 'Already have an identity?',
        signInHere: 'Sign in here',
        registerFacility: 'Register Facility',
        registerAgent: 'Register Agent',
        confirmPickupDetails: 'Confirm Pickup Details',
        pickupAddress: 'Pickup Address',
        preferredDate: 'Preferred Date',
        cancel: 'Cancel',
        processing: 'Processing...',
        confirmRequest: 'Confirm Request',
        smartphone: 'Smartphone',
        laptop: 'Laptop',
        tablet: 'Tablet',
        smartwatch: 'Smartwatch',
        audio: 'Audio Device',
        other: 'Other',
        rewardEarned: 'Reward Earned',
        statusUpdate: 'Status Update',
        systemEvent: 'System Event',
        activityDetails: {
            registered: 'Device [{uid}] was successfully registered in the system.',
            transitioned: 'Device transitioned to {status}.',
            earned: 'Earned {amount} points for recycling completion.',
            system: 'A system action was recorded.'
        }
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

        // Settings/Profile
        interfaceOverlays: 'इंटरफ़ेस ओवरले',
        personalizationFramework: 'वैयक्तिकरण ढांचा',
        frameworkLang: 'ढांचा भाषा',
        profile: 'प्रोफाइल',
        signOut: 'साइन आउट',
        overview: 'अवलोकन',
        security: 'सुरक्षा',
        notifications: 'नोटिफिकेशन',
        settings: 'सेटिंग्स',

        // Dashboard
        assetLedger: 'एसेट लेजर',
        inventoryManagement: 'नागरिक सूची प्रबंधन',
        registerNewAsset: 'नई संपत्ति पंजीकृत करें',
        regulatedAssets: 'विनियमित एकीकृत संपत्तियां',
        modernDevicesDesc: '8-अंकीय विशिष्ट पहचान वाले आधुनिक उपकरण।',
        legacyItems: 'पुरानी ई-कचरा वस्तुएं',
        legacyItemsDesc: 'पुनर्चक्रण के लिए कॉल करने के बाद मैन्युअल एसेट-टैगिंग की आवश्यकता वाले इलेक्ट्रॉनिक्स।',
        tracked: 'ट्रैक किया गया',
        registered: 'पंजीकृत',
        noRegulatedAssets: 'कोई विनियमित संपत्ति पंजीकृत नहीं है',
        noLegacyItems: 'कोई पुरानी वस्तु पंजीकृत नहीं है',
        handoverCode: 'हैंडओवर कोड',
        deviceDetails: 'डिवाइस विवरण',
        lifecycleArchive: 'लाइफसाइकिल आर्काइव',
        visualMode: 'विजुअल मोड',
        vDark: 'डार्क',
        vLight: 'लाइट',

        // Navigation
        myDevices: 'मेरे उपकरण',
        rewards: 'पुरस्कार',
        activity: 'गतिविधि',
        citizenPortal: 'नागरिक पोर्टल',

        // Rewards
        totalBalance: 'कुल शेष',
        points: 'अंक',
        redeemRewards: 'पुरस्कार रिडीम करें',
        quickStats: 'त्वरित आँकड़े',
        recycledItems: 'पुनर्नवीनीकरण वस्तुएं',
        rewardHistory: 'पुरस्कार इतिहास',
        noRewardsEarned: 'अभी तक कोई पुरस्कार नहीं मिला।',
        autoIssueNotice: 'डिवाइस के रीसाइक्लर को सौंपे जाने के बाद वेरिफिकेशन पॉइंट्स अपने आप जारी हो जाते हैं।',

        // Activity
        activityHistory: 'गतिविधि इतिहास',
        noRecordedActivities: 'अभी तक कोई गतिविधि रिकॉर्ड नहीं की गई।',
        statusUpdate: 'स्थिति अपडेट',
        rewardEarned: 'पुरस्कार अर्जित किया',
        systemEvent: 'सिस्टम इवेंट',

        // Device Details
        backToMyDevices: 'मेरे उपकरणों पर वापस जाएं',
        archivedProfile: 'आर्काइव्ड प्रोफाइल',
        activeInventory: 'सक्रिय सूची',
        recycleCalled: 'रीसाइक्लिंग के लिए कॉल किया गया',
        agentDispatched: 'एजेंट भेजा गया',
        reachedFacility: 'सुविधा पर पहुंचे',
        fullyRecycling: 'पूरी तरह से पुनर्नवीनीकरण',
        inTransit: 'रास्ते में',
        verifiedEntry: 'सत्यापित प्रविष्टि',
        pendingStage: 'लंबित चरण',
        proofNotice: 'धोखाधड़ी को रोकने के लिए, आपको फिजिकल हैंडओवर के दौरान संग्रहकर्ता को अपना डिवाइस यूनिक कोड (DUC) प्रदान करना होगा।',
        initiatePickup: 'पिकअप शुरू करें',
        callForRecycling: 'रीसाइक्लिंग के लिए कॉल करें',
        revealPickupCode: 'पिकअप कोड दिखाएं',
        regenerateCode: 'कोड फिर से जेनरेट करें',

        // Register Device
        registerDevice: 'उपकरण पंजीकृत करें',
        deviceType: 'उपकरण का प्रकार',
        brand: 'ब्रांड',
        model: 'मॉडल',
        purchaseYear: 'खरीद का वर्ष',
        serialNumber: 'सीरियल नंबर (वैकल्पिक)',
        backToDashboard: 'डैशबोर्ड पर वापस जाएं',
        verifiedAccount: 'सत्यापित खाता',
        accountOverview: 'खाता विवरण',
        identityDetails: 'पहचान विवरण',
        publicAvatar: 'सार्वजनिक अवतार',
        userId: 'यूजर आईडी',
        logout: 'लॉगआउट',
        securityControls: 'सुरक्षा नियंत्रण',
        updateAuth: 'प्रमाणीकरण क्रेडेंशियल अपडेट करें',
        currentPassword: 'वर्तमान पासवर्ड',
        newPassword: 'नया पासवर्ड',
        confirmPassword: 'पासवर्ड की पुष्टि करें',
        saveChanges: 'परिवर्तन सहेजें',
        changePassword: 'पासवर्ड बदलें',
        dismiss: 'खारिज करें',
        preferences: 'वरीयताएँ',
        interfaceCustomization: 'इंटरफ़ेस अनुकूलन',
        notificationsDesc: 'कॉन्फ़िगर करें कि आप सिस्टम अलर्ट कैसे प्राप्त करते हैं',
        securityDesc: 'अपनी पहुंच और क्रेडेंशियल प्रबंधित करें',
        emailHandlers: 'ईमेल हैंडलर',
        smsOverlays: 'SMS ओवरले',
        smsDesc: 'वास्तविक समय पिकअप SMS अलर्ट।',
        english: 'अंग्रेजी (English)',
        hindi: 'हिन्दी (Hindi)',
        punjabi: 'पंजाबी (Punjabi)',
        createCitizenAccount: 'नागरिक खाता बनाएं',
        citizenRegistrationPortal: 'नागरिक पंजीकरण पोर्टल',
        fullName: 'पूरा नाम',
        setPassword: 'पासवर्ड सेट करें',
        creatingAccount: 'खाता बनाया जा रहा है...',
        registerCitizenAccount: 'नागरिक खाता पंजीकृत करें',
        alreadyHaveIdentity: 'पहले से ही पहचान है?',
        signInHere: 'यहाँ साइन इन करें',
        registerFacility: 'सुविधा पंजीकृत करें',
        registerAgent: 'एजेंट पंजीकृत करें',
        confirmPickupDetails: 'पिकअप विवरण की पुष्टि करें',
        pickupAddress: 'पिकअप का पता',
        preferredDate: 'पसंदीदा तिथि',
        cancel: 'रद्द करें',
        processing: 'प्रसंस्करण...',
        confirmRequest: 'अनुरोध की पुष्टि करें',
        smartphone: 'स्मार्टफोन',
        laptop: 'लैपटॉप',
        tablet: 'टैबलेट',
        smartwatch: 'स्मार्टवॉच',
        audio: 'ऑडियो डिवाइस',
        other: 'अन्य',
        rewardEarned: 'इनाम मिला',
        statusUpdate: 'स्थिति अपडेट',
        systemEvent: 'सिस्टम इवेंट',
        activityDetails: {
            registered: 'डिवाइस [{uid}] सफलतापूर्वक सिस्टम में पंजीकृत किया गया था।',
            transitioned: 'डिवाइस {status} की ओर बढ़ा।',
            earned: 'रीसाइक्लिंग पूरा होने पर {amount} अंक अर्जित किए।',
            system: 'एक सिस्टम क्रिया रिकॉर्ड की गई थी।'
        }
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

        // Settings/Profile
        interfaceOverlays: 'ਇੰਟਰਫੇਸ ਓਵਰਲੇਅ',
        personalizationFramework: 'ਨਿੱਜੀਕਰਨ ਫਰੇਮਵਰਕ',
        frameworkLang: 'ਫਰੇਮਵਰਕ ਭਾਸ਼ਾ',
        profile: 'ਪ੍ਰੋਫਾਈਲ',
        signOut: 'ਸਾਈਨ ਆਉਟ',
        overview: 'ਸੰਖੇਪ ਜਾਣਕਾਰੀ',
        security: 'ਸੁਰੱਖਿਆ',
        notifications: 'ਸੂਚਨਾਵਾਂ',
        settings: 'ਸੈਟਿੰਗਾਂ',

        // Dashboard
        assetLedger: 'ਸੰਪੱਤੀ ਲੇਜ਼ਰ',
        inventoryManagement: 'ਨਾਗਰਿਕ ਵਸਤੂ ਪ੍ਰਬੰਧਨ',
        registerNewAsset: 'ਨਵੀਂ ਸੰਪੱਤੀ ਰਜਿਸਟਰ ਕਰੋ',
        regulatedAssets: 'ਨਿਯੰਤ੍ਰਿਤ ਯੂਨੀਫਾਈਡ ਸੰਪਤੀਆਂ',
        modernDevicesDesc: '8-ਅੰਕਾਂ ਦੀਆਂ ਵਿਲੱਖਣ ਪਛਾਣਾਂ ਵਾਲੇ ਆਧੁਨਿਕ ਉਪਕਰਣ।',
        legacyItems: 'ਪੁਰਾਣੀਆਂ ਈ-ਕੂੜਾ ਵਸਤੂਆਂ',
        legacyItemsDesc: 'ਰੀਸਾਈਕਲਿੰਗ ਲਈ ਕਾਲ ਕਰਨ ਤੋਂ ਬਾਅਦ ਮੈਨੂਅਲ ਐਸੇਟ-ਟੈਗਿੰਗ ਦੀ ਲੋੜ ਵਾਲੇ ਇਲੈਕਟ੍ਰੋਨਿਕਸ।',
        tracked: 'ਟਰੈਕ ਕੀਤਾ ਗਿਆ',
        registered: 'ਰਜਿਸਟਰਡ',
        noRegulatedAssets: 'ਕੋਈ ਨਿਯੰਤ੍ਰਿਤ ਸੰਪਤੀ ਰਜਿਸਟਰਡ ਨਹੀਂ ਹੈ',
        noLegacyItems: 'ਕੋਈ ਪੁਰਾਣੀ ਵਸਤੂ ਰਜਿਸਟਰਡ ਨਹੀਂ ਹੈ',
        handoverCode: 'ਹੈਂਡਓਵਰ ਕੋਡ',
        deviceDetails: 'ਡਿਵਾਈਸ ਦੇ ਵੇਰਵੇ',
        lifecycleArchive: 'ਜੀਵਨ ਚੱਕਰ ਆਰਕਾਈਵ',
        visualMode: 'ਵਿਜ਼ੂਅਲ ਮੋਡ',
        vDark: 'ਡਾਰਕ',
        vLight: 'ਲਾਈਟ',

        // Navigation
        myDevices: 'ਮੇਰੇ ਉਪਕਰਣ',
        rewards: 'ਇਨਾਮ',
        activity: 'ਗਤੀਵਿਧੀ',
        citizenPortal: 'ਨਾਗਰਿਕ ਪੋਰਟਲ',

        // Rewards
        totalBalance: 'ਕੁੱਲ ਬਕਾਇਆ',
        points: 'ਅੰਕ',
        redeemRewards: 'ਇਨਾਮ ਰੀਡੀਮ ਕਰੋ',
        quickStats: 'ਤੁਰੰਤ ਅੰਕੜੇ',
        recycledItems: 'ਰੀਸਾਈਕਲ ਕੀਤੀਆਂ ਵਸਤੂਆਂ',
        rewardHistory: 'ਇਨਾਮ ਇਤਿਹਾਸ',
        noRewardsEarned: 'ਅਜੇ ਤੱਕ ਕੋਈ ਇਨਾਮ ਨਹੀਂ ਮਿਲਿਆ।',
        autoIssueNotice: 'ਡਿਵਾਈਸ ਦੇ ਰੀਸਾਈਕਲਰ ਨੂੰ ਸੌਂਪੇ ਜਾਣ ਤੋਂ ਬਾਅਦ ਵੈਰੀਫਿਕੇਸ਼ਨ ਪੁਆਇੰਟ ਆਪਣੇ ਆਪ ਜਾਰੀ ਹੋ ਜਾਂਦੇ ਹਨ।',

        // Activity
        activityHistory: 'ਗਤੀਵਿਧੀ ਇਤਿਹਾਸ',
        noRecordedActivities: 'ਅਜੇ ਤੱਕ ਕੋਈ ਸਰਗਰਮੀ ਰਿਕਾਰਡ ਨਹੀਂ ਕੀਤੀ ਗਈ।',
        statusUpdate: 'ਸਥਿਤੀ ਅਪਡੇਟ',
        rewardEarned: 'ਇਨਾਮ ਪ੍ਰਾਪਤ ਕੀਤਾ',
        systemEvent: 'ਸਿਸਟਮ ਇਵੈਂਟ',

        // Device Details
        backToMyDevices: 'ਮੇਰੇ ਡਿਵਾਈਸਾਂ ਤੇ ਵਾਪਸ ਜਾਓ',
        archivedProfile: 'ਆਰਕਾਈਵ ਕੀਤਾ ਪ੍ਰੋਫਾਈਲ',
        activeInventory: 'ਸਰਗਰਮ ਵਸਤੂ ਸੂਚੀ',
        recycleCalled: 'ਰੀਸਾਈਕਲ ਲਈ ਕਾਲ ਕੀਤੀ ਗਈ',
        agentDispatched: 'ਏਜੰਟ ਭੇਜਿਆ ਗਿਆ',
        reachedFacility: 'ਸਹੂਲਤ ‘ਤੇ ਪਹੁੰਚ ਗਏ',
        fullyRecycling: 'ਪੂਰੀ ਤਰ੍ਹਾਂ ਰੀਸਾਈਕਲ ਕੀਤਾ ਗਿਆ',
        inTransit: 'ਰਸਤੇ ਵਿੱਚ',
        verifiedEntry: 'ਪ੍ਰਮਾਣਿਤ ਐਂਟਰੀ',
        pendingStage: 'ਬਕਾਇਆ ਪੜਾਅ',
        proofNotice: 'ਧੋਖਾਧੜੀ ਨੂੰ ਰੋਕਣ ਲਈ, ਫਿਜ਼ੀਕਲ ਹੈਂਡਓਵਰ ਦੌਰਾਨ ਤੁਹਾਨੂੰ ਕਲੈਕਟਰ ਨੂੰ ਆਪਣਾ ਡਿਵਾਈਸ ਯੂਨੀਕ ਕੋਡ (DUC) ਪ੍ਰਦਾਨ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ।',
        initiatePickup: 'ਪਿਕਅੱਪ ਸ਼ੁਰੂ ਕਰੋ',
        callForRecycling: 'ਰੀਸਾਈਕਲਿੰਗ ਲਈ ਕਾਲ ਕਰੋ',
        revealPickupCode: 'ਪਿਕਅੱਪ ਕੋਡ ਦਿਖਾਓ',
        regenerateCode: 'ਕੋਡ ਦੁਬਾਰਾ ਜਨਰੇਟ ਕਰੋ',

        // Register Device
        registerDevice: 'ਡਿਵਾਈਸ ਰਜਿਸਟਰ ਕਰੋ',
        deviceType: 'ਡਿਵਾਈਸ ਦੀ ਕਿਸਮ',
        brand: 'ਬ੍ਰਾਂਡ',
        model: 'ਮਾਡਲ',
        purchaseYear: 'ਖਰੀਦ ਦਾ ਸਾਲ',
        serialNumber: 'ਸੀਰੀਅਲ ਨੰਬਰ (ਵਿਕਲਪਿਕ)',
        backToDashboard: 'ਡੈਸ਼ਬੋਰਡ ‘ਤੇ ਵਾਪਸ ਜਾਓ',
        verifiedAccount: 'ਪ੍ਰਮਾਣਿਤ ਖਾਤਾ',
        accountOverview: 'ਖਾਤਾ ਸੰਖੇਪ ਜਾਣਕਾਰੀ',
        identityDetails: 'ਪਛਾਣ ਦੇ ਵੇਰਵੇ',
        publicAvatar: 'ਪਬਲਿਕ ਅਵਤਾਰ',
        userId: 'ਯੂਜ਼ਰ ਆਈਡੀ',
        logout: 'ਲੌਗਆਉਟ',
        securityControls: 'ਸੁਰੱਖਿਆ ਨਿਯੰਤਰਣ',
        updateAuth: 'ਪ੍ਰਮਾਣਿਕਤਾ ਪ੍ਰਮਾਣ ਪੱਤਰ ਅੱਪਡੇਟ ਕਰੋ',
        currentPassword: 'ਮੌਜੂਦਾ ਪਾਸਵਰਡ',
        newPassword: 'ਨਵਾਂ ਪਾਸਵਰਡ',
        confirmPassword: 'ਪਾਸਵਰਡ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ',
        saveChanges: 'ਤਬਦੀਲੀਆਂ ਸੁਰੱਖਿਅਤ ਕਰੋ',
        changePassword: 'ਪਾਸਵਰਡ ਬਦਲੋ',
        dismiss: 'ਖਾਰਜ ਕਰੋ',
        preferences: 'ਪਸੰਦਾਂ',
        interfaceCustomization: 'ਇੰਟਰਫੇਸ ਅਨੁਕੂਲਤਾ',
        notificationsDesc: 'ਸਿਸਟਮ ਅਲਰਟ ਪ੍ਰਾਪਤ ਕਰਨ ਦੇ ਤਰੀਕੇ ਨੂੰ ਕੌਂਫਿਗਰ ਕਰੋ',
        securityDesc: 'ਆਪਣੀ ਪਹੁੰਚ ਅਤੇ ਪ੍ਰਮਾਣ ਪੱਤਰਾਂ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ',
        emailHandlers: 'ਈਮੇਲ ਹੈਂਡਲਰ',
        smsOverlays: 'SMS ਓਵਰਲੇਅ',
        smsDesc: 'ਰੀਅਲ-ਟਾਈਮ ਪਿਕਅੱਪ SMS ਅਲਰਟ।',
        english: 'ਅੰਗਰੇਜ਼ੀ (English)',
        hindi: 'ਹਿੰਦੀ (Hindi)',
        punjabi: 'ਪੰਜਾਬੀ (Punjabi)',
        createCitizenAccount: 'ਨਾਗਰਿਕ ਖਾਤਾ ਬਣਾਓ',
        citizenRegistrationPortal: 'ਨਾਗਰਿਕ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਪੋਰਟਲ',
        fullName: 'ਪੂਰਾ ਨਾਮ',
        setPassword: 'ਪਾਸਵਰਡ ਸੈੱਟ ਕਰੋ',
        creatingAccount: 'ਖਾਤਾ ਬਣਾਇਆ ਜਾ ਰਿਹਾ ਹੈ...',
        registerCitizenAccount: 'ਨਾਗਰਿਕ ਖਾਤਾ ਰਜਿਸਟਰ ਕਰੋ',
        alreadyHaveIdentity: 'ਪਹਿਲਾਂ ਹੀ ਪਛਾਣ ਹੈ?',
        signInHere: 'ਇੱਥੇ ਸਾਈਨ ਇਨ ਕਰੋ',
        registerFacility: 'ਸਹੂਲਤ ਰਜਿਸਟਰ ਕਰੋ',
        registerAgent: 'ਏਜੰਟ ਰਜਿਸਟਰ ਕਰੋ',
        confirmPickupDetails: 'ਪਿਕਅੱਪ ਵੇਰਵਿਆਂ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ',
        pickupAddress: 'ਪਿਕਅੱਪ ਦਾ ਪਤਾ',
        preferredDate: 'ਪਸੰਦੀਦਾ ਮਿਤੀ',
        cancel: 'ਰੱਦ ਕਰੋ',
        processing: 'ਪ੍ਰੋਸੈਸਿੰਗ...',
        confirmRequest: 'ਬੇਨਤੀ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ',
        smartphone: 'ਸਮਾਰਟਫੋਨ',
        laptop: 'ਲੈਪਟਾਪ',
        tablet: 'ਟੈਬਲੇਟ',
        smartwatch: 'ਸਮਾਰਟਵਾਚ',
        audio: 'ਆਡੀਓ ਡਿਵਾਈਸ',
        other: 'ਹੋਰ',
        rewardEarned: 'ਇਨਾਮ ਮਿਲਿਆ',
        statusUpdate: 'ਸਥਿਤੀ ਅਪਡੇਟ',
        systemEvent: 'ਸਿਸਟਮ ਈਵੈਂਟ',
        activityDetails: {
            registered: 'ਡਿਵਾਈਸ [{uid}] ਸਿਸਟਮ ਵਿੱਚ ਸਫਲਤਾਪੂਰਵਕ ਰਜਿਸਟਰ ਹੋ ਗਈ ਸੀ।',
            transitioned: 'ਡਿਵਾਈਸ {status} ਵਿੱਚ ਤਬਦੀਲ ਹੋ ਗਈ।',
            earned: "ਰੀਸਾਈਕਲਿੰਗ ਪੂਰਾ ਹੋਣ 'ਤੇ {amount} ਅੰਕ ਪ੍ਰਾਪਤ ਕੀਤੇ।",
            system: 'ਇੱਕ ਸਿਸਟਮ ਕਾਰਵਾਈ ਰਿਕਾਰਡ ਕੀਤੀ ਗਈ ਸੀ।'
        }
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
