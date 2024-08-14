import { db } from './firebase-config.js';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc, orderBy } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
    const pendingReviewsContainer = document.getElementById('pending-reviews');

    if (pendingReviewsContainer) {
        const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
        onSnapshot(q, (snapshot) => {
            pendingReviewsContainer.innerHTML = ''; // Réinitialiser l'affichage

            snapshot.forEach(docSnapshot => {
                const review = docSnapshot.data();
                const reviewId = docSnapshot.id;

                const reviewElement = document.createElement('div');
                reviewElement.classList.add('review-item');
                reviewElement.innerHTML = `
                    <div class="review-header" onclick="toggleReviewDetails('${reviewId}')">
                        <h3>${review.name} ${review.prenom}</h3>
                        <p>${new Date(review.createdAt.toDate()).toLocaleDateString()}</p>
                    </div>
                    <div class="review-body" id="review-body-${reviewId}" style="display: none;">
                       <p><strong>Contenu du message:</strong> ${review.message}</p>
                       ${review.imageUrl ? `<p><strong>Image:</strong> <img src="${review.imageUrl}" alt="Image associée" class="review-image"></p>` : '<p>Aucune image fournie</p>'}
                    </div>
                    <div class="review-actions">
                        <button class="approve-btn" data-id="${reviewId}" ${review.approved ? 'disabled' : ''}>${review.approved ? 'Approuvé' : 'Approuver'}</button>
                        <button class="delete-btn" data-id="${reviewId}">Supprimer</button>
                    </div>
                `;
                pendingReviewsContainer.appendChild(reviewElement);
            });

            // Attacher les événements de gestion
            document.querySelectorAll('.approve-btn').forEach(button => {
                button.addEventListener('click', async function() {
                    const reviewId = this.getAttribute('data-id');
                    try {
                        const reviewDoc = doc(db, 'reviews', reviewId);
                        await updateDoc(reviewDoc, { approved: true });
                        alert('Avis approuvé avec succès.');
                    } catch (error) {
                        console.error("Erreur lors de l'approbation de l'avis:", error);
                    }
                });
            });

            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', async function() {
                    const reviewId = this.getAttribute('data-id');
                    try {
                        const reviewDoc = doc(db, 'reviews', reviewId);
                        await deleteDoc(reviewDoc);
                        alert('Avis supprimé avec succès.');
                    } catch (error) {
                        console.error("Erreur lors de la suppression de l'avis:", error);
                    }
                });
            });
        });
    }
});

function toggleReviewDetails(reviewId) {
    const reviewBody = document.getElementById(`review-body-${reviewId}`);
    if (reviewBody.style.display === "none" || reviewBody.style.display === "") {
        reviewBody.style.display = "block";
    } else {
        reviewBody.style.display = "none";
    }
}

// Rendre la fonction globale
window.toggleReviewDetails = toggleReviewDetails;
