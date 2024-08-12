document.addEventListener('DOMContentLoaded', function() {
    // Ajout des fonctionnalités pour le formulaire d'avis
    const avisForm = document.getElementById('reviewForm');
    const temoignagesList = document.getElementById('temoignages-list');

    if (avisForm && temoignagesList) {
        avisForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Empêche le rechargement de la page

            const nom = document.getElementById('name')?.value;
            const prenom = document.getElementById('prenom')?.value;
            const avis = document.getElementById('message')?.value;
            const file = document.getElementById('file')?.files[0];
            const clientId = 'YOUR_IMGUR_CLIENT_ID'; // Remplacez par votre Client ID Imgur

            if (nom && prenom && avis) {
                let imageUrl = '';

                if (file) {
                    // Télécharger l'image sur Imgur
                    const formData = new FormData();
                    formData.append('image', file);

                    try {
                        const response = await fetch('https://api.imgur.com/3/image', {
                            method: 'POST',
                            headers: {
                                Authorization: `2f6cc0604610439 ${clientId}`,
                            },
                            body: formData,
                        });

                        const result = await response.json();

                        if (result.success) {
                            imageUrl = result.data.link;
                        } else {
                            console.error('Erreur lors du téléchargement sur Imgur:', result.data.error);
                        }
                    } catch (error) {
                        console.error('Erreur lors du téléchargement:', error);
                    }
                }

                // Crée un nouvel élément pour l'avis
                const newAvis = document.createElement('div');
                newAvis.classList.add('temoignage');
                newAvis.innerHTML = `
                    <h3>${nom} ${prenom}</h3>
                    <p>${avis}</p>
                    <small>${new Date().toLocaleDateString()}</small>
                    ${imageUrl ? `<img src="${imageUrl}" alt="Photo" style="max-width: 100%; height: auto;">` : ''}
                `;

                // Ajoute l'avis au début de la liste des témoignages
                temoignagesList.prepend(newAvis);

                // Réinitialise le formulaire
                avisForm.reset();
            } else {
                console.error("Tous les champs doivent être remplis.");
            }
        });
    } else {
        console.error('Le formulaire ou la liste des témoignages est introuvable.');
    }

    // Gestion des autres fonctionnalités

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    function toggleFeatures(button) {
        const featuresList = button.nextElementSibling;
        if (featuresList) {
            if (featuresList.style.display === "none" || featuresList.style.display === "") {
                featuresList.style.display = "block";
                button.textContent = "Afficher moins";
            } else {
                featuresList.style.display = "none";
                button.textContent = "En savoir plus";
            }
        }
    }

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = "block";
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = "none";
        }
    }

    const messages = [
       "Organisez un événement mémorable avec notre Photobooth 360 !",
        "Avez-vous des questions sur le projet ? Contactez-nous dès maintenant !"
    ];

    let currentMessageIndex = 0;
    const messageElement = document.getElementById("rotating-message");

    function showNextMessage() {
        if (messageElement) {
            messageElement.textContent = messages[currentMessageIndex];
            currentMessageIndex = (currentMessageIndex + 1) % messages.length;
        }
    }

    setInterval(showNextMessage, 4000); // Change message every 4 seconds
    showNextMessage(); // Show the first message immediately

    function toggleMusic() {
        var audio = document.getElementById('background-music');
        var button = document.getElementById('music-toggle');
        var icon = document.getElementById('music-icon');
        if (audio && button && icon) {
            if (audio.paused) {
                audio.play();
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
            } else {
                audio.pause();
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
            }
        }
    }

    // Fonction pour démarrer la musique à la première interaction utilisateur
    function startMusicOnInteraction() {
        var audio = document.getElementById('background-music');
        if (audio) {
            audio.play();
            document.removeEventListener('click', startMusicOnInteraction);
        }
    }

    // Événement d'interaction pour démarrer la musique
    document.addEventListener('click', startMusicOnInteraction);
});
