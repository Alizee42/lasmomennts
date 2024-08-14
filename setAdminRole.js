const admin = require('firebase-admin');
admin.initializeApp();

async function setAdminRole(email) {
    try {
        // Récupérer l'utilisateur par son email
        const user = await admin.auth().getUserByEmail(email);

        // Définir le claim personnalisé 'admin'
        await admin.auth().setCustomUserClaims(user.uid, {
            admin: true
        });

        console.log(`Success! ${email} has been granted admin privileges.`);
    } catch (error) {
        console.error('Error setting admin role:', error);
    }
}

// Exécuter la fonction pour un utilisateur spécifique
setAdminRole('alizee.gueye@gmail.com');
