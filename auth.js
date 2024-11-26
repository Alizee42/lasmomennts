const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Empêche le rechargement de la page

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Appel à votre API d'authentification pour se connecter
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                // Si la réponse n'est pas OK, récupérez le message d'erreur
                const errorData = await response.json();
                throw new Error(errorData.message || `Erreur : ${response.status}`);
            }

            const data = await response.json();

            // Stockez le token dans le stockage local ou dans un cookie
            localStorage.setItem('token', data.token);

            // Redirection après connexion réussie
            window.location.href = 'index-admin.html'; // Assurez-vous que cette URL est correcte
        } catch (error) {
            console.error("Erreur de connexion:", error.message);
            document.getElementById('loginError').textContent = "Erreur de connexion: " + error.message;
        }
    });
}

// Déconnexion
const logoutButton = document.getElementById('logoutButton');
if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        // Supprimez le token lors de la déconnexion
        localStorage.removeItem('token');
        window.location.href = 'login.html'; // Redirection après déconnexion
    });
}
