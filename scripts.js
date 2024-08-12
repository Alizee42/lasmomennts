// Ajoutez ici des fonctionnalités JavaScript si nécessaire
// Exemple : Animation de défilement vers les sections

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
function toggleFeatures(button) {
    const featuresList = button.nextElementSibling;
    if (featuresList.style.display === "none" || featuresList.style.display === "") {
        featuresList.style.display = "block";
        button.textContent = "Afficher moins";
    } else {
        featuresList.style.display = "none";
        button.textContent = "En savoir plus";
    }
}
function openModal(modalId) {
    document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

    const messages = [
       "Organisez un événement mémorable avec notre Photobooth 360 !",
        "Avez-vous des questions sur le projet ? Contactez-nous dès maintenant !"
    ];

    let currentMessageIndex = 0;
    const messageElement = document.getElementById("rotating-message");

    function showNextMessage() {
        messageElement.textContent = messages[currentMessageIndex];
        currentMessageIndex = (currentMessageIndex + 1) % messages.length;
    }

    setInterval(showNextMessage, 4000); // Change message every 3 seconds
    showNextMessage(); // Show the first message immediately
 // Function to redirect to index.html after 10 seconds
 function redirectToHome() {
    setTimeout(function() {
        window.location.href = 'index.html';
    }, 6000); // 10000 milliseconds = 10 seconds
}

    function toggleMusic() {
        var audio = document.getElementById('background-music');
        var button = document.getElementById('music-toggle');
        var icon = document.getElementById('music-icon');
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
  // Fonction pour démarrer la musique à la première interaction utilisateur
  function startMusicOnInteraction() {
    var audio = document.getElementById('background-music');
    audio.play();
    document.removeEventListener('click', startMusicOnInteraction);
}

// Ajout d'un écouteur d'événement pour démarrer la musique à la première interaction
document.addEventListener('click', startMusicOnInteraction);

document.getElementById('avis-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêche le rechargement de la page

    const nom = document.getElementById('nom').value;
    const prenom = document.getElementById('prenom').value;
    const avis = document.getElementById('avis').value;
    const date = document.getElementById('date').value;

    // Crée un nouvel élément pour l'avis
    const newAvis = document.createElement('div');
    newAvis.classList.add('temoignage');
    newAvis.innerHTML = `
        <h3>${nom} ${prenom}</h3>
        <p>${avis}</p>
        <small>${new Date(date).toLocaleDateString()}</small>
    `;

    // Ajoute l'avis au début de la liste des témoignages
    document.getElementById('temoignages-list').prepend(newAvis);

    // Réinitialise le formulaire
    document.getElementById('avis-form').reset();
});
