import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                // Redirection après connexion réussie
                window.location.href = 'index-admin.html'; // Assurez-vous que cette URL est correcte
            })
            .catch((error) => {
                console.error("Erreur de connexion:", error.message);
                document.getElementById('loginError').textContent = "Erreur de connexion: " + error.message;
            });
    });
}

// Déconnexion
const logoutButton = document.getElementById('logoutButton');
if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        signOut(auth).then(() => {
            window.location.href = 'login.html';
        }).catch((error) => {
            console.error("Erreur lors de la déconnexion:", error);
        });
    });
}
