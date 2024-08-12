const { google } = require('googleapis');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    // Extraire les données soumises depuis le corps de la requête
    const { nom, prenom, photo, avis, date } = JSON.parse(event.body);
    const sheets = google.sheets('v4');

    // Authentification avec Google Sheets API
    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const client = await auth.getClient();
    const spreadsheetId = '1xa-p49icKGSSvScOfmeAIyLAmhDKA1_CO0pNVh4Eaas'; // Remplacez par l'ID de votre Google Sheet

    try {
        // Enregistrer les données dans Google Sheets
        await sheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: 'Sheet1!A:E', // Assurez-vous que ce range correspond à vos colonnes
            valueInputOption: 'RAW',
            requestBody: {
                values: [[nom, prenom, photo, avis, date]],
            },
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: error.message }),
        };
    }
};
