const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const userRoutes = require('./routes/user.routes')
const skillRoutes = require('./routes/skill.routes')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000
const allowedOrigin = 'http://localhost:4200'
const corsOptions = { origin: allowedOrigin }

// CORS definition
app.use(cors(corsOptions))
// Parse incoming JSON data
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// Use routes - update while creating new routes
app.use('/api', userRoutes)
app.use('/api', skillRoutes)

// Replace mongoDB_URI with my ATLAS cloud URI
const MONGODB_URI = process.env.MONGODB_URI

// Connect to mongoDB ATLAS
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection

// Manage connection error
db.on('error', err => {
    console.error(`Error connecting to mongoDB: ${err}`)
})

// Manage connexion success
db.once('open', () => {
    console.log('Connected to mongoDB successfully!')
})


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT} \nCORS allowed only for ${allowedOrigin}`)
})
