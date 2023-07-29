const User = require('./models/users')

const authMiddleware = async (req, res, next) => {
    const { username, password } = req.body

    try {
        const adminUser = await User.find({ username, password, profile: 'admin' })
        if (adminUser) {
            req.user = {...adminUser._doc, profile: 'admin'}
        }
        next()
    } catch(err) {
        console.error('Authentication error -', err)
        res.status(500).json({message: 'Authentication failed -', err})
    }
}

module.exports = authMiddleware