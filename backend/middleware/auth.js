const jwt = require('jsonwebtoken')

exports.userAuthenticate = (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token not found'
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decoded.userId;
        req.userRole = decoded.userRole;

        next()
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.userAuthorize = (requiredRoles) => {
    return (req, res, next) => {
        if (!requiredRoles.includes(req.userRole)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden"
            })
        }
        next()
    }
}