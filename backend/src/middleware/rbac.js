const authorize = (allowedRoles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error_code: 'AUTH_Required',
                message: 'User authentication required before authorization'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error_code: 'RBAC_FORBIDDEN',
                message: `User role '${req.user.role}' is not authorized for this resource`,
                required_roles: allowedRoles
            });
        }

        next();
    };
};

module.exports = authorize;
