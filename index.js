const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const resFormatter = require('./middleware/responseFormatter')
require('dotenv').config()

// Static variables setting
const PORT_HTTP = process.env.PORT_HTTP || 3000
const PORT_HTTPS = process.env.PORT_HTTPS || 443
const allowedOrigin = 'http://localhost:4200'
const corsOptions = {
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    // credentials: true,
    // allowedHeaders: ['Content-Type', 'Authorization']
}
// Allow self signed certificate - for dev only - remove for production!
// process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const MONGODB_URI = process.env.MONGODB_URI

const app = express()

// CORS definition
app.use(cors(corsOptions))
// Parse incoming JSON data
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// Format any response
app.use(resFormatter)

/**
 * Routes definition
 * ! Done AFTER cors & bodyParser config !
 * ! update while creating new routes !
*/
const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')
const skillRoutes = require('./routes/skill.routes')

app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', skillRoutes)

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


///////////////////////////////////////////////
//      HTTP for non-securised access        //
///////////////////////////////////////////////
app.listen(PORT_HTTP, () => {
    console.log(`Server is running on https://localhost:${PORT_HTTP} \nCORS allowed only for ${allowedOrigin}`)
})
///////////////////////////////////////////////
//  END FOR HTTP - comment if not required   //
///////////////////////////////////////////////


///////////////////////////////////////////////
//        HTTPS for securised access         //
///////////////////////////////////////////////
// const https = require('https')
// const fs = require('fs')
// const HTTPS_PRIVATE_KEY = '/etc/ssl/certs/key.pem'
// const HTTPS_CERTIFICATE = '/etc/ssl/certs/cert.pem'
// // const HTTPS_PRIVATE_KEY = 'secrets/key.pem'
// // const HTTPS_CERTIFICATE = 'secrets/cert.pem'

// // HTTPS options
// const httpsOptions = {
//     key: fs.readFileSync(HTTPS_PRIVATE_KEY), // /path/to/private-key.pem
//     cert: fs.readFileSync(HTTPS_CERTIFICATE) // /path/to/certificate.pem
// }

// // Create HTTPS server
// https.createServer(httpsOptions, app).listen(PORT_HTTPS, () => {
//     console.log(`Server is running on https://localhost:${PORT_HTTPS} \nCORS allowed only for ${allowedOrigin}`)
// })
///////////////////////////////////////////////
//  END FOR HTTPS - comment if not required  //
///////////////////////////////////////////////
