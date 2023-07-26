const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    // _id: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: false },
    birthday: { type: String, required: false },
    email: { type: String, required: true },
    password: { type: String, required: true },
    buffer: { type: Buffer, required: false },
    icon: {type: String, required: false}
})

const User = mongoose.model('User', userSchema)

module.exports = User