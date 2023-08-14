const express = require('express')
const router = express.Router()
const User = require('../models/users')
const jwt = require('jsonwebtoken')

router.post('/users/auth', async (req, res) => {
    try {
        console.log('Auth begin', req.body)
        const { username, password } = req.body
        const validUser = await User.findOne({ username, password })
        if (!validUser) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }
        const { email, profile, birthday } = validUser
        /**
         * Generate & send token
        */
        const token = jwt.sign({ userId: validUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
        res.status(200).json({
            message: `Successfully connected as ${validUser?.profile}`,
            id: validUser._id,
            token,
            email,
            profile,
            birthday,
            username
        })
    } catch (err) {
        return res.status(500).json({ error: `Server error: ${err}` })
    }
})

module.exports = router
