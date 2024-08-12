const { google } = require('googleapis');

exports.handler = async function(event, context) {
    const sheets = google.sheets('v4');

    // Authentification avec Google Sheets API
    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),  // Remplacement des \n pour les nouvelles lignes
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const client = await auth.getClient();
    const spreadsheetId = '1xa-p49icKGSSvScOfmeAIyLAmhDKA1_CO0pNVh4Eaas';  // Remplacez par l'ID de votre Google Sheet

    try {
        const response = await sheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: 'Sheet1!A:E',  // Assurez-vous que le range correspond à vos colonnes
        });

        const rows = response.data.values;
        return {
            statusCode: 200,
            body: JSON.stringify(rows),  // Retourner les données sous forme de JSON
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),  // Retourner une erreur en JSON
        };
    }
};
