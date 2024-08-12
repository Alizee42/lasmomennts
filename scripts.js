document.addEventListener('DOMContentLoaded', function() {
    const avisForm = document.getElementById('reviewForm');
    const temoignagesList = document.getElementById('temoignages-list');
    const previewContainer = document.getElementById('previewContainer');
    const previewList = document.getElementById('previewList');
    const confirmButton = document.getElementById('confirmButton');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const clientId = '2f6cc0604610439'; // Remplacez par votre vrai Client ID Imgur
    const itemsPerPage = 4; // Nombre d'avis visibles par page
    let currentPage = 0;

    avisForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const nom = document.getElementById('name').value;
        const prenom = document.getElementById('prenom').value;
        const avis = document.getElementById('message').value;
        const file = document.getElementById('file').files[0];
        let imageUrl = '';

        if (nom && prenom && avis) {
            if (file) {
                const formData = new FormData();
                formData.append('image', file);

                try {
                    const response = await fetch('https://api.imgur.com/3/image', {
                        method: 'POST',
                        headers: {
                            Authorization: `Client-ID ${clientId}`,
                        },
                        body: formData,
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    const result = await response.json();
                    if (result.success && result.data) {
                        imageUrl = result.data.link;
                    } else {
                        console.error('Erreur lors du téléchargement sur Imgur:', result.data ? result.data.error : 'Erreur inconnue');
                    }
                } catch (error) {
                    console.error('Erreur lors du téléchargement:', error);
                }
            }

            const previewItem = document.createElement('div');
            previewItem.classList.add('preview-item');
            previewItem.innerHTML = `
                <div class="photo-container">
                    <img src="${imageUrl}" alt="Photo" class="temoignage-photo">
                </div>
                <div class="temoignage-message">
                    <p class="message-texte">${avis}</p>
                </div>
                <div class="temoignage-nom">
                    <p>${nom} ${prenom}</p>
                </div>
            `;
            previewList.appendChild(previewItem);
        }
    });

    confirmButton.addEventListener('click', function() {
        previewContainer.style.display = 'none'; // Cacher la prévisualisation
        const items = previewList.querySelectorAll('.preview-item');

        items.forEach(item => {
            const newAvis = document.createElement('div');
            newAvis.classList.add('temoignage');
            newAvis.innerHTML = item.innerHTML;
            temoignagesList.appendChild(newAvis);
        });

        previewList.innerHTML = ''; // Réinitialiser la prévisualisation
    });

    function updateCarousel() {
        const offset = -currentPage * (100 / itemsPerPage);
        temoignagesList.style.transform = `translateX(${offset}%)`;
    }

    prevButton.addEventListener('click', function() {
        if (currentPage > 0) {
            currentPage--;
            updateCarousel();
        }
    });

    nextButton.addEventListener('click', function() {
        const totalPages = Math.ceil(temoignagesList.children.length / itemsPerPage) - 1;
        if (currentPage < totalPages) {
            currentPage++;
            updateCarousel();
        }
    });

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
        const audio = document.getElementById('background-music');
        const button = document.getElementById('music-toggle');
        const icon = document.getElementById('music-icon');
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
        const audio = document.getElementById('background-music');
        if (audio) {
            audio.play();
            document.removeEventListener('click', startMusicOnInteraction);
        }
    }

    // Événement d'interaction pour démarrer la musique
    document.addEventListener('click', startMusicOnInteraction);
});
