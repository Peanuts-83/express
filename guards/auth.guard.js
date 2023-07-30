const User = require('../models/users')

const authGuardMiddleware = async (req, res, next) => {
    const authToken = req.header('Authorization')?.split(' ')[1]
    if (!authToken) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    JsonWebTokenError.verify(authToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' })
        }
        req.userId = decoded.userId
        next()
    })
}

module.exports = authGuardMiddleware