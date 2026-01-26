import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="h-screen flex items-center justify-center">Loading session...</div>;
    }

    if (!user) {
        // Not logged in
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Logged in but wrong role
        const defaultPath = `/${user.role}/dashboard`;
        return <Navigate to={defaultPath} replace />;
    }

    return children;
};
