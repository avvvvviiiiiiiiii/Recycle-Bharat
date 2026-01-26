import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="h-screen flex items-center justify-center">Loading session...</div>;
    }

    if (!user) {
        console.warn('ProtectedRoute: No user found, redirecting to login.', { from: location.pathname });
        // Not logged in
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        console.warn('ProtectedRoute: Role mismatch.', { required: allowedRoles, current: user.role });
        // Logged in but wrong role
        const defaultPath = `/${user.role.toLowerCase()}/dashboard`;
        return <Navigate to={defaultPath} replace />;
    }

    return children;
};
