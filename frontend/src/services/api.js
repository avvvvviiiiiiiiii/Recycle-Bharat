import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Make sure this matches backend PORT
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
