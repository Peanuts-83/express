const jwt = require('jsonwebtoken')

const authGuardMiddleware = async (req, res, next) => {
    try {
        console.log('authGuardMiddleware start')
        console.log('headers - ', req.headers)
        const token = req.headers.authorization?.split(' ')[1]
        console.log('token -', token)
        console.log('req -', req.headers, req.body)
        if (!token) {
            console.log('Error - req.body', req.body)
            return res.status(401).json({ error: 'Unauthorized' })
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                console.log('Error with token -', err)
                return res.status(403).json({ error: 'Invalid token', err })
            }
            req.userId = decoded.userId
            console.log('Token OK -', req.userId)
            next()
        })
    } catch (err) {
        console.log(err)
        res.json('Authentication error', err)
    }
}

module.exports = authGuardMiddleware
