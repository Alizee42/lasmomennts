import { login } from './js/auth.js';

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password)
        .then(user => {
            console.log("Connexion réussie", user);
            window.location.href = "admin-dashboard.html"; // Redirige vers le tableau de bord après la connexion
        })
        .catch(error => {
            document.getElementById('loginError').textContent = "Échec de la connexion. Vérifiez vos informations.";
        });
});
