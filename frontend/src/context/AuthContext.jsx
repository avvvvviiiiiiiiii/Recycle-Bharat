import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('user');
            console.log('[AuthContext] Hydrating User from Storage:', storedUser);
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (e) {
            console.error('Failed to parse user from storage', e);
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
            console.log(`[Auth] Logging in as: ${email}, Password length: ${password.length}`);
            const res = await api.post('/auth/login', { email, password });
            console.log('AuthContext: Login response:', res.data);
            const { token, user } = res.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            return user;
        } catch (error) {
            console.error('AuthContext: Login API error:', error.response || error);
            throw error;
        }
    };

    const register = async (userData) => {
        await api.post('/auth/register', userData);
        // We don't auto-login after register, or maybe we do? 
        // For now, redirect to login.
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
