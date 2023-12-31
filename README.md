# EXPRESS/NodeJS backend API server connected to Atlas mongo database

Backend API built with nodeJS / Express.&nbsp;


It is connected to Atlas cloud service giving access to your personnal mongoDB. You should subscribe to Atlas cloud services to connect your database.&nbsp;


Developp any model/route files for convenience.

## API entries
*(To be updated during dev process)*
* /users/
* /skills/<"hard"|"soft">

## Use it!
### .env file

Make at root **.env** file containing vital informations about your Atlas cloud mongoDB access and the dedicated port to be used locally on your machine, or later on the server. Other kind of env.variables can be referenced, such as **JWT_SECRET_KEY** or what else you need. This file's variables are accessed with **dotenv** module. This file is added to the .gitignore file.

```env
# Atlas URI cluster can be found in the deployment interface at this path : *Database > Connect > Connect to your application
# URI = user : password @ cluster/database ? options
MONGODB_URI=mongodb+srv://<your_user>:<your_password>@<your_atlas_cluster>/<your_database>?retryWrites=true&w=majority
# Use PORT for Http access on backend app (usually 3000)
PORT_HTTP=3001
# Use PORT for Https access on backend app (usually 443)
PORT_HTTPS=4443
# JWT secret-key
JWT_SECRET_KEY=<any_string_you_want>
```

### self-signed certificate

/* this part is not actually used - to be developped&nbsp;

Make a "secrets" folder at root to store secret ssl, or store them into /etc/ssl. "secrets" is added to the .gitignore file to keep contained files secure.
It should contain:

* **cert.pem** & **key.pem** for HTTPS certificates. It can be obtained by various ways. For development purpose, I am using self-signed certificates (not recommended for production) you can produce this way (I do store cert & key in /etc/ssh/ in this use case):
```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/localhost-selfsigned.key -out /etc/ssl/certs/localhost-selfsigned.crt
```

You can add this certificate to your client navigator (Chrome; Firefox,...) by importing it to Params > Security > Certificates. The certificate (*certificate.p12*) to import is a mixed version of your cert.pem and key.pem files that can be done this way:

```bash
cat localhost-selfsigned.crt localhost-selfsigned.key > combined.pem
openssl pkcs12 -export -out certificate.p12 -in combined.pem
```

Restart your navigator after adding ceertificate.&nbsp;

/* end of undevelopped part

### Install depencies & start frontend application
Install required dependencies with npm, yarn or any of your package manager.
Use the **start** script from *package.json*

```bash
npm install
npm start
```

## Test it!

You can use **Postman** (VsCode has a very nice *Postman plugin*) to test your CRUD routes.&nbsp;


In order to upload image files (png format only is tested at the beginning of this project) for "icon" or "image" keys (check User & Skill models), you will have to set your Header option **Content-Type: multipart/form-data**. The data you will pass through Body must be with **form-data** option (key/value pairs), so that you can select **file** for "icon" or "image" keys and get the right file.

## CORS
*ref. https://docs.digitalocean.com/glossary/allow-origin/#:~:text=Access%2DControl%2DAllow%2DOrigin%20is%20a%20header%20request%20that,of%20a%20page%20is%20accessible*&nbsp;


Access-Control-Allow-Origin header specifies from where this API server is accessible.
**cors** module is used. You can define your frontEnd application's URL in **index.js** setup.
More securised access shall be defined later for production purpose.

```javascript
const allowedOrigin = 'http://localhost:4200'
const corsOptions = { origin: allowedOrigin }

// CORS definition
app.use(cors(corsOptions))
```

## Authentification - HTTP/HTTPS settings

HTTPS protocol is set by default. Check the end of *index.js* file for changing to HTTP.
If you need securised access for user identification, use HTTPS instead of HTTP protocol. This way the **HEADERS** containing username/password you send from frontend side are encrypted.&nbsp;

For security reasons, ports < 1024 require privileged access. For this reason, I set my HTTPS PORT to 4443, so that nodeJS can access my secret files.

## Response formatter

In order to format all the responses from the API routes, use the **responseFormatter middleware**. You will be able to format any response at your convenience, adding some keys/values to fit the result your frontend app expects.

## File management

### Multer

*ref. https://expressjs.com/en/resources/middleware/multer.html*

#### ENCODE for storage in mongoDB

Actually manages file storing. In the case of light weight files only under 16Mb (mongoDB's limit for document) the use of **multer** module is not strictly required and files can be stored as is under binary format.&nbsp;


But if files are bigger than 16Mb, MongoDB's GridFS functionality can be combined with multer to store these larger files in a separate collection and still associate them with te relevant document in the current collection.
Files are temporary stored in memoryStorage (*{ storage: multer.memoryStorage() }*) before being stored as bin data in mongoDB.&nbsp;


An other option could be temp storing files on the disk with the *dest* option in multer instead of *storage* option, but it would require therefor to use **fs** module to manage disk space on server and gain access to the temp files!

```javascript
const express = require('express');
const multer = require('multer');

const app = express();
const upload = multer({ storage: multer.memoryStorage() }); // Store the file directly in memory as a buffer

// Use 'upload' middleware for routes that handle file uploads and other form fields
app.post('/users', upload.single('icon'), (req, res) => {
  // Access other form fields (username, email, password) using req.body
  const { username, email, password } = req.body;

  // req.file contains the uploaded file information
  // Access the file buffer using req.file.buffer
  const iconFile = req.file;

  if (!iconFile) {
    return res.status(400).json({ message: 'No icon file uploaded' });
  }

  // Process the uploaded file buffer and other form fields as needed
  // For example, you can save the PNG image buffer in the database
  // and create a new user with the extracted form data

  console.log('Username:', username);
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('File Buffer:', iconFile.buffer);

  res.status(200).json({ message: 'File uploaded successfully' });
});

// Your other routes and configurations go here

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
```

#### ENCODE for UI


Getting the file back to any UI, it is necessary to convert the buffured png file to a usable format.
**This operation must be implemented on backend application, because it's a server side operation using NodeJS BUFFER module**. One common way is to encode it with the **toString('base64')** method.

```javascript
// JS - SERVER SIDE - Convert PNG image buffer to Base64 encoded string
const convertImageBufferToBase64 = (buffer) => {
  return buffer.toString('base64');
};

// HTML - FRONT SIDE - Assuming you have fetched the user data from the server and have the Base64 encoded image available
<img src="data:image/png;base64, {{ base64EncodedImage }}" alt="User Avatar" />
```

### GridFS

For files greater than 16Mb, **GridFSBuccket** from **mongodb** module is required, with **fs** module.
I have not used this module for now, but it could be used for futur dev. To be creused...

```javascript
const { MongoClient, GridFSBucket } = require('mongodb');
const fs = require('fs');

// Replace 'YOUR_MONGODB_URI' with your MongoDB connection string
const MONGODB_URI = 'YOUR_MONGODB_URI';
const DATABASE_NAME = 'my_database';

async function main() {
  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(MONGODB_URI, { useUnifiedTopology: true });
    const db = client.db(DATABASE_NAME);

    // Create a new GridFSBucket to work with PNG files
    const bucket = new GridFSBucket(db, {
      bucketName: 'png_files'
    });

    // Read the PNG file as a buffer
    const fileBuffer = fs.readFileSync('path/to/your/png/file.png');

    // Create a write stream for the file in GridFS
    const uploadStream = bucket.openUploadStream('file.png');

    // Pipe the file data into the upload stream
    const fileId = await new Promise((resolve, reject) => {
      const readStream = new Readable();
      readStream.push(fileBuffer);
      readStream.push(null);
      readStream.pipe(uploadStream)
        .on('error', reject)
        .on('finish', () => resolve(uploadStream.id));
    });

    console.log('File stored in MongoDB with ID:', fileId);

    // Close the connection to MongoDB
    client.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
```
