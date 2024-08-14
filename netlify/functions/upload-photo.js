const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase-admin/storage');
const multiparty = require('multiparty');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

// Configure Firebase Admin
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
initializeApp({
  credential: cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const bucket = getStorage().bucket();

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const form = new multiparty.Form();
    const parseForm = promisify(form.parse.bind(form));

    const [fields, files] = await parseForm(event);

    if (!files.file || files.file.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No file uploaded' }),
      };
    }

    // Upload the image to Firebase Storage
    const imageFile = files.file[0];
    const filePath = path.join('/tmp', imageFile.originalFilename); // Temporary file path
    fs.writeFileSync(filePath, fs.readFileSync(imageFile.path));

    const fileUpload = bucket.file(imageFile.originalFilename);
    await fileUpload.save(fs.readFileSync(filePath), {
      contentType: imageFile.headers['content-type'],
    });

    // Get the public URL of the uploaded file
    const imageUrl = await fileUpload.getSignedUrl({
      action: 'read',
      expires: '03-09-2491', // URL expiration date
    });

    // Process form fields
    const name = fields.name[0];
    const prenom = fields.prenom[0];
    const message = fields.message[0];

    // Here you would typically store the data in a database
    console.log('Name:', name);
    console.log('Prénom:', prenom);
    console.log('Message:', message);
    console.log('Image URL:', imageUrl[0]);

    // Clean up temporary file
    fs.unlinkSync(filePath);

    return {
      statusCode: 200,
      body: JSON.stringify({
        name,
        prenom,
        message,
        imageUrl: imageUrl[0],
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
