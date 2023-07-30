const express = require('express')
const router = express.Router()
const Skill = require('../models/skills')
const { convertImageBufferToBase64 } = require('../utils/utils')

// image file management
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() })

// profile managment - Admin restricted access
const authGuardMiddleware = require('../guards/auth.guard')

// specPath required for skills : "hard" | "soft"

// Create new skill - Admin access only!
router.post('/skills/:specPath', authGuardMiddleware, upload.single('buffer'), async (req, res) => {
    try {
        const { title, subtitle, comment, type, icon } = req.body
        if (!req.params.specPath || req.params.specPath!==type) {
            return res.status(401).json({ message: 'Unauthorised - Type (specPath) not defined or not corresponding to request ID' })
        }
        const imageBuffer = req.file ? req.file.buffer : null
        const newSkill = new Skill({ title, subtitle, comment, type, icon, buffer: imageBuffer })
        const savedSkill = await newSkill.save()
        res.status(201).json(savedSkill)
    } catch (err) {
        res.status(500).json({ message: 'Failed to create new skill', err })
    }
})

// Get all skills
router.get('/skills/:specPath', async (req, res) => {
    try {
        const allSkills = (await Skill.find()).filter(skill => skill.type===req.params.specPath)
        if (allSkills===null || allSkills===undefined || allSkills.length===0) {
            return res.status(204).json({message: 'No data found'})
        }
        // decode image to <base64>String
        allSkills.map(skill => skill.image = convertImageBufferToBase64(skill.buffer))
        res.json(allSkills)
    } catch (err) {
        res.status(500).json({ message: 'No skill found', err })
    }
})

// Get single skill by ID
router.get('/skills/:specPath/:id', async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id)
        if (!req.params.specPath || req.params.specPath!==skill.type) {
            return res.status(401).json({ message: 'Unauthorised - Type (specPath) not defined or not corresponding to request ID' })
        }
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found!', })
        }
        const image = convertImageBufferToBase64(skill.buffer)
        res.json({ ...skill, image })
    } catch (err) {
        res.status(500).json({ message: `Failed to search for skill ${req.params.id}` })
    }
})

// Update skill by ID - Admin access only!
router.put('/skills/:specPath/:id', authGuardMiddleware, upload.single('buffer'), async (req, res) => {
    try {
        const { title, subtitle, comment, type, icon, buffer } = req.body
        if (!req.params.specPath || req.params.specPath!==type) {
            return res.status(401).json({ message: 'Unauthorised - Type (specPath) not defined or not corresponding to request ID' })
        }
        const imageBuffer = req.file ? req.file.buffer :
            buffer ? buffer : null
        const updatedData = { title, subtitle, comment, type, icon, buffer: imageBuffer }
        const updatedSkill = await Skill.findByIdAndUpdate(req.params.id, updatedData)
        if (!updatedSkill) {
            return res.status(404).json({ message: 'Skill not found' })
        }
        res.json(updatedSkill)
    } catch (err) {
        res.status(500).json({ message: 'Unable to update skill', err })
    }
})

// Delete skill by ID - Admin access only!
router.delete('/skills/:id', authGuardMiddleware, async (req, res) => {
    try {
        const deletedSkill = await Skill.findByIdAndRemove(req.params.id)
        if (!deletedSkill) {
            return res.status(404).json({ message: 'Skill not found' })
        }
        res.json(deletedSkill)
    } catch (err) {
        res.status(500).json({ message: 'Unable to delete skill', err })
    }
})

module.exports = router