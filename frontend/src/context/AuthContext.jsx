import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for token on mount
        const token = localStorage.getItem('token');
        if (token) {
            // Decode or validate token? For now, we assume if it exists, we might need to fetch profile.
            // But MVP: just decode role from token OR store user object in localStorage too.
            // Let's store user in localStorage for persistence across refreshes.
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            const { token, user } = res.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            return { success: true, user };
        } catch (err) {
            console.error('Login error:', err);
            let errorMessage = 'Login failed';

            if (err.code === 'ERR_NETWORK' || !err.response) {
                errorMessage = 'Server Unreachable: The backend process has likely crashed. Please check your database connection or whitelist settings.';
            } else {
                errorMessage = err.response?.data?.error || 'Login failed';
            }

            return {
                success: false,
                error: errorMessage
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
