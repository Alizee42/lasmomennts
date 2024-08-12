const Busboy = require('busboy');
const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    return new Promise((resolve, reject) => {
        const busboy = new Busboy({ headers: event.headers });
        const uploads = {};

        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            const filepath = path.join('/tmp', filename);
            uploads[fieldname] = { filepath, filename };

            const writeStream = fs.createWriteStream(filepath);
            file.pipe(writeStream);

            writeStream.on('close', () => {
                console.log(`File [${fieldname}] uploaded successfully to ${filepath}`);
            });
        });

        busboy.on('finish', () => {
            resolve({
                statusCode: 200,
                body: JSON.stringify({
                    message: 'File uploaded successfully',
                    files: uploads,
                }),
            });
        });

        busboy.on('error', (error) => {
            console.error('Error processing file:', error);
            reject({
                statusCode: 500,
                body: JSON.stringify({ error: 'File upload error', details: error.message }),
            });
        });

        busboy.end(Buffer.from(event.body, 'base64'));
    });
};
