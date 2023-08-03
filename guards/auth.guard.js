const jwt = require('jsonwebtoken')

const authGuardMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        console.log('token:', token)
        console.log('req:', req.headers, req.body)
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' })
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: 'Invalid token', err })
            }
            req.userId = decoded.userId
            next()
        })
    } catch (err) {
        console.log(err)
        res.json('Authentication error', err)
    }
}

module.exports = authGuardMiddleware
