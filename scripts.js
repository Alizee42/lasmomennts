import { db, storage } from './firebase-config.js';
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
   
    const avisForm = document.getElementById('reviewForm');
    const temoignagesList = document.getElementById('temoignages-list');

    // Fonction pour ouvrir ou fermer une modale
    function toggleModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            const isModalVisible = modal.style.display === "block";
            modal.style.display = isModalVisible ? "none" : "block";
        } else {
            console.error(`Modale avec l'ID ${modalId} introuvable.`);
        }
    }

    // Rendre toggleModal disponible globalement
    window.toggleModal = toggleModal;

    document.querySelectorAll('.modal .close').forEach(closeButton => {
        closeButton.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                toggleModal(modal.id);
            }
        });
    });

    window.addEventListener('click', function(event) {
        document.querySelectorAll('.modal').forEach(modal => {
            if (event.target === modal) {
                toggleModal(modal.id);
            }
        });
    });

    if (avisForm) {
        avisForm.addEventListener('submit', async function(event) {
            event.preventDefault();
    
            const nom = document.getElementById('name').value;
            const prenom = document.getElementById('prenom').value;
            const message = document.getElementById('message').value;
            const file = document.getElementById('file').files[0];
    
            if (nom && prenom && message) {
                let imageUrl = '';
    
                if (file) {
                    const fileRef = ref(storage, `images/${file.name}`);
    
                    try {
                        const snapshot = await uploadBytes(fileRef, file);
                        imageUrl = await getDownloadURL(snapshot.ref);
                    } catch (error) {
                        console.error('Erreur lors du téléchargement sur Firebase:', error);
                        return;
                    }
                }
    
                // Enregistrer l'avis dans Firestore
                try {
                    await addDoc(collection(db, 'reviews'), {
                        name: nom,
                        prenom: prenom,
                        message: message,
                        imageUrl: imageUrl,
                        approved: false, // L'avis n'est pas approuvé par défaut
                        createdAt: serverTimestamp()
                    });
                    alert("Votre avis a été soumis et attend l'approbation.");
                    avisForm.reset();
                    toggleModal('reviewModal'); // Fermer la modale après l'envoi
                } catch (error) {
                    console.error("Erreur lors de l'enregistrement de l'avis:", error);
                }
            } else {
                console.error("Tous les champs doivent être remplis.");
            }
        });
    }

    // Charger et afficher les avis approuvés
    if (temoignagesList) {
        const q = query(collection(db, 'reviews'), where('approved', '==', true), orderBy('createdAt', 'desc'));
        onSnapshot(q, (snapshot) => {
            temoignagesList.innerHTML = ''; // Réinitialiser l'affichage
    
            if (snapshot.empty) {
                console.log("Aucun avis approuvé trouvé.");
            } else {
                snapshot.forEach(doc => {
                    const review = doc.data();
                
                    // Ajouter la phrase accrocheuse une seule fois si ce n'est pas déjà fait
                    if (!document.getElementById('phrase-accrocheuse')) {
                        const accrocheContainer = document.createElement('div');
                        accrocheContainer.id = 'phrase-accrocheuse';
                        accrocheContainer.innerHTML = `
                            <h2>"Ils ont capturé des moments magiques, découvrez leurs avis !"</h2>
                        `;
                        const temoignagesSection = document.getElementById('temoignages-container');
                        temoignagesSection.insertBefore(accrocheContainer, temoignagesSection.firstChild);
                    }
                
                    const newAvis = document.createElement('div');
                    newAvis.classList.add('temoignage');
                    newAvis.innerHTML = `
                        <div class="photo-container">
                            <img src="${review.imageUrl}" alt="Photo" class="temoignage-photo">
                        </div>
                        <div class="temoignage-message">
                            <span class="quote-icon">“</span>
                            <p class="message-texte">${review.message}</p>
                            <span class="quote-icon2">”</span>
                        </div>
                        <div class="temoignage-nom">
                            <p>${review.name} ${review.prenom}</p>
                        </div>
                    `;
    
                    temoignagesList.appendChild(newAvis);
                });
            }
        }, error => {
            console.error("Erreur lors de la récupération des avis approuvés:", error);
        });
    }
    // Gestion de la musique de fond
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

    // Rotation des messages
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

    setInterval(showNextMessage, 4000); // Changer le message toutes les 4 secondes
    showNextMessage(); // Afficher le premier message immédiatement

    // Exposer la fonction toggleModal au global pour être utilisée dans le HTML
    window.toggleModal = toggleModal;
});
