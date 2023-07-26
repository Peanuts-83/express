const express = require('express')
const router = express.Router()
const User = require('../models/users')

// image file management
const multer = require('multer')
const upload = multer({storage: multer.memoryStorage()})

// Create new user
router.post('/users', upload.single('icon'), async (req, res) => {
    try {
        const { firstName, lastName, birthday, email, password } = req.body
        const iconBuffer = req.file ? req.file.buffer : null
        const newUser = new User({firstName, lastName, birthday, email, password, icon: iconBuffer})
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    } catch (err) {
        res.status(500).json({ message: 'Failed to create new user', err })
    }
})

// Get all users
router.get('/users', async (req, res) => {
    try {
        const allUsers = await User.find()
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
        res.json(user)
    } catch (err) {
        res.status(500).json({ message: `Failed to search for user ${req.params.id}` })
    }
})

// Update user by ID
router.put('/users/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.json(updatedUser)
    } catch (err) {
        res.status(500).json({ message: 'Unable to update user', err })
    }
})

// Delete user by ID
router.delete('/users/:id', async (req, res) => {
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