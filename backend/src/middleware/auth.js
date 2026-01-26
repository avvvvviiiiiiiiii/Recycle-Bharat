const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Handle "Bearer <token>" or just "<token>" or "bearer <token>"
    let token = null;
    if (authHeader) {
        if (authHeader.toLowerCase().startsWith('bearer ')) {
            token = authHeader.split(' ')[1];
        } else {
            token = authHeader;
        }
    } else {
        // Fallback to x-auth-token
        token = req.headers['x-auth-token'];
    }

    if (!token) {
        return res.status(401).json({
            error_code: 'AUTH_MISSING_TOKEN',
            message: 'Access token is missing'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(`[AUTH-MW] ✅ Valid Token for: ${decoded.email}`);
        req.user = decoded; // { id, role, email }
        next();
    } catch (err) {
        console.error(`[AUTH-MW] ❌ Invalid Token: ${err.message}`);
        return res.status(403).json({
            error_code: 'AUTH_INVALID_TOKEN',
            message: 'Invalid or expired token'
        });
    }
};

module.exports = authenticate;
