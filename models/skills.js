const mongoose = require('mongoose')

const skillSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, required: false },
    comment: { type: String, required: false },
    image: { type: Buffer, required: true }
})

const Skill = mongoose.model('Skill', skillSchema)

module.exports = Skill