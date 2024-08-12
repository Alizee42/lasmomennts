const multiparty = require('multiparty');
const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    const form = new multiparty.Form();
    const uploadDir = '/tmp/uploads'; // Utilisez un stockage temporaire sur Lambda

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }

    return new Promise((resolve, reject) => {
        form.parse(event, (err, fields, files) => {
            if (err) {
                console.error('Error parsing form:', err);
                return resolve({
                    statusCode: 500,
                    body: 'Error parsing form',
                });
            }

            const file = files.photo[0];
            const tempPath = file.path;
            const targetPath = path.join(uploadDir, file.originalFilename);

            fs.rename(tempPath, targetPath, err => {
                if (err) {
                    console.error('Error saving file:', err);
                    return resolve({
                        statusCode: 500,
                        body: 'Error saving file',
                    });
                }

                console.log('File saved to', targetPath);
                resolve({
                    statusCode: 200,
                    body: JSON.stringify({
                        message: 'File uploaded successfully',
                        filePath: targetPath, // Vous utiliserez une URL de stockage réel ici
                    }),
                });
            });
        });
    });
};
