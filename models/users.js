const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    birthday: { type: String, required: false },
    email: { type: String, required: true },
    buffer: { type: Buffer, required: false },
    profile: {type: String, required: true, default: 'guest', enum: ['guest','admin']},
    icon: {type: String, required: false}
})

const User = mongoose.model('User', userSchema)

module.exports = User