import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                console.log('[AuthContext] User hydrated:', parsed.email);
                return parsed;
            }
            console.log('[AuthContext] No user found in storage (Guest).');
            return null;
        } catch (e) {
            console.error('[AuthContext] Failed to parse user from storage', e);
            return null;
        }
    });
    // We can assume loading is false if we read from storage effectively,
    // or we can verify the token validity. For now, let's start with false.
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Optional: Validate token with backend on mount if needed
    }, []);

    const login = async (email, password) => {
        // setLoading(true); // No longer needed as we transition state synchronously
        try {
            console.log(`[Auth] Attempting login: ${email}`);
            const res = await api.post('/auth/login', { email, password });
            const { token, user } = res.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            console.log('[Auth] Login successful');
            return user;
        } catch (error) {
            console.error('[Auth] Login failed:', error.response?.data?.message || error.message);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            console.log(`[Auth] Attempting register: ${userData.email}`);
            const res = await api.post('/auth/register', userData);
            console.log('[Auth] Registration successful');
            return res.data;
        } catch (error) {
            console.error('[Auth] Registration failed:', error.response?.data?.message || error.message);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        console.log('[Auth] Logged out');
    };

    const updateUser = (updatedUser) => {
        const newUser = { ...user, ...updatedUser };
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
