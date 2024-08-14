import { db } from './firebase-config.js'; // Vous avez déjà importé db

document.addEventListener('DOMContentLoaded', function() {
    // Pas besoin de redéclarer db ici

    // Récupérer les avis non approuvés
    db.collection('reviews').where('approved', '==', false).onSnapshot(snapshot => {
        const reviewsContainer = document.getElementById('pending-reviews');
        reviewsContainer.innerHTML = ''; // Réinitialiser l'affichage

        snapshot.forEach(doc => {
            const review = doc.data();
            const reviewId = doc.id;

            const reviewElement = document.createElement('div');
            reviewElement.classList.add('review-item');
            reviewElement.innerHTML = `
                <p><strong>${review.name} ${review.prenom}</strong></p>
                <p>${review.message}</p>
                ${review.imageUrl ? `<img src="${review.imageUrl}" alt="Image associée" style="max-width: 100px;">` : ''}
                <button class="approve-btn" data-id="${reviewId}">Approuver</button>
                <button class="delete-btn" data-id="${reviewId}">Supprimer</button>
            `;
            reviewsContainer.appendChild(reviewElement);
        });

        // Attacher les événements de gestion
        document.querySelectorAll('.approve-btn').forEach(button => {
            button.addEventListener('click', function() {
                const reviewId = this.getAttribute('data-id');
                db.collection('reviews').doc(reviewId).update({ approved: true });
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                const reviewId = this.getAttribute('data-id');
                db.collection('reviews').doc(reviewId).delete();
            });
        });
    });
});
