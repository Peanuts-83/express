const express = require('express')
const router = express.Router()
const authMiddleware = require('../auth')

router.post('/user/auth', authMiddleware, (req,res) => {
    console.log('Authenticated user -', req.user)
    res.json({message: `${req.user.profile==='admin' ? 'Admin authenticated' : 'Guest authenticated'}`})
})