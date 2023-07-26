const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const userRoutes = require('./routes/user.routes')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

// Parse incoming JSON data
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
// Use routes defined for Users
app.use('/api', userRoutes)

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

// Define a simple test route
app.get('./', (req,res) => {
    res.send('Backend server is running')
})

// CRUD operation API here!


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})