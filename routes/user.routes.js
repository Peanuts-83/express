const express = require('express')
const router = express.Router()
const User = require('../models/users')
const { convertImageBufferToBase64 } = require('../utils/utils')

// image file management
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() })

// profile managment - Admin restricted access
const adminGuardMiddleware = require('../guards/admin.guard')

// Create new user - Admin access only!
router.post('/users', adminGuardMiddleware, upload.single('buffer'), async (req, res) => {
    try {
        const { username, birthday, email, password, profile } = req.body
        const iconBuffer = req.file ? req.file.buffer : null
        const newUser = new User({ username, birthday, email, password, profile, buffer: iconBuffer })
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    } catch (err) {
        res.status(500).json({ message: 'Failed to create new user', err })
    }
})

// Get all users
router.get('/users', async (req, res) => {
    try {
        console.log('Starting get all users')
        const allUsers = await User.find()
        // decode image to <base64>String
        allUsers.map(user => user.icon = convertImageBufferToBase64(user.buffer))
        res.json(allUsers)
    } catch (err) {
        res.status(500).json({ message: 'No user found', err })
    }
})

// Get single user by ID
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).json({ message: 'User not found!', })
        }
        const icon = convertImageBufferToBase64(user.buffer)
        res.json({ ...user, icon })
    } catch (err) {
        res.status(500).json({ message: `Failed to search for user ${req.params.id}` })
    }
})

// Update user by ID - Admin access only!
router.put('/users/:id', adminGuardMiddleware, upload.single('buffer'), async (req, res) => {
    try {
        const { username, birthday, email, password, profile, buffer } = req.body
        const iconBuffer = req.file ? req.file.buffer :
            buffer ? buffer : null
        const updatedData = { username, birthday, email, password, profile, buffer: iconBuffer }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, updatedData)
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.json(updatedUser)
    } catch (err) {
        res.status(500).json({ message: 'Unable to update user', err })
    }
})

// Delete user by ID - Admin access only!
router.delete('/users/:id', adminGuardMiddleware, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndRemove(req.params.id)
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.json(deletedUser)
    } catch (err) {
        res.status(500).json({ message: 'Unable to delete user', err })
    }
})

module.exports = router