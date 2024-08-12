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

    const busboy = Busboy({ headers: event.headers });

    const tmpdir = '/tmp/uploads';
    if (!fs.existsSync(tmpdir)) {
        fs.mkdirSync(tmpdir);
    }

    const uploads = {};

    return new Promise((resolve, reject) => {
        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            const filepath = path.join(tmpdir, filename);
            uploads[fieldname] = filepath;
            file.pipe(fs.createWriteStream(filepath));
        });

        busboy.on('finish', () => {
            resolve({
                statusCode: 200,
                body: JSON.stringify({ message: 'File uploaded successfully', files: uploads }),
            });
        });

        busboy.on('error', (error) => {
            reject({
                statusCode: 500,
                body: JSON.stringify({ error: 'File upload error', details: error }),
            });
        });

        busboy.end(Buffer.from(event.body, 'base64'));
    });
};
