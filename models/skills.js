const mongoose = require('mongoose')

const skillSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, required: false },
    type: {type: String, required: true},
    comment: { type: String, required: false },
    buffer: { type: Buffer, required: false },
    image: {type: String, required: false},
    icon: {type: String, required: false}
})

const Skill = mongoose.model('Skill', skillSchema)

module.exports = Skill