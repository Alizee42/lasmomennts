const cloudinary = require('cloudinary').v2;
const multiparty = require('multiparty');
const { promisify } = require('util');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    // Upload the image to Cloudinary
    const imageFile = files.file[0];
    const result = await cloudinary.uploader.upload(imageFile.path);

    // Process form fields
    const name = fields.name[0];
    const message = fields.message[0];

    // Here you would typically store the data in a database
    console.log('Name:', name);
    console.log('Message:', message);
    console.log('Image URL:', result.secure_url);

    return {
      statusCode: 200,
      body: JSON.stringify({
        name,
        message,
        imageUrl: result.secure_url,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
