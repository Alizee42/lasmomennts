import { getFirestore, collection, query, where, getDocs, updateDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { app } from "./firebase-config.js";

const db = getFirestore(app);

// Charger et afficher les avis non validés
export async function loadPendingReviews() {
    try {
        const q = query(collection(db, "reviews"), where("valide", "==", false));
        const querySnapshot = await getDocs(q);
        const reviewsList = document.getElementById('reviews-list');
        reviewsList.innerHTML = '';
        
        querySnapshot.forEach((doc) => {
            const reviewData = doc.data();
            const reviewItem = document.createElement('div');
            reviewItem.innerHTML = `
                <p>${reviewData.nom} ${reviewData.prenom}: ${reviewData.message}</p>
                <button onclick="validateReview('${doc.id}')">Valider</button>
                <button onclick="deleteReview('${doc.id}')">Supprimer</button>
            `;
            reviewsList.appendChild(reviewItem);
        });
    } catch (error) {
        console.error("Erreur lors du chargement des avis:", error);
    }
}

// Valider un avis
export async function validateReview(reviewId) {
    try {
        const reviewRef = doc(db, "reviews", reviewId);
        await updateDoc(reviewRef, {
            valide: true
        });
        loadPendingReviews(); // Recharger les avis après validation
    } catch (error) {
        console.error("Erreur lors de la validation de l'avis:", error);
    }
}

// Supprimer un avis
export async function deleteReview(reviewId) {
    try {
        await deleteDoc(doc(db, "reviews", reviewId));
        loadPendingReviews(); // Recharger les avis après suppression
    } catch (error) {
        console.error("Erreur lors de la suppression de l'avis:", error);
    }
}

// Charger et afficher les événements du calendrier
export async function loadCalendarEvents(calendar) {
    const events = [];
    try {
        const querySnapshot = await getDocs(collection(db, "events"));
        querySnapshot.forEach((doc) => {
            events.push({
                id: doc.id,
                title: doc.data().title,
                start: doc.data().start.toDate(),
                end: doc.data().end.toDate()
            });
        });
        calendar.addEventSource(events);
    } catch (error) {
        console.error("Erreur lors du chargement des événements du calendrier:", error);
    }
}

// Mettre à jour un événement
export async function updateEvent(info) {
    try {
        const eventRef = doc(db, "events", info.event.id);
        await updateDoc(eventRef, {
            start: info.event.start,
            end: info.event.end
        });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'événement:", error);
    }
}

// Supprimer un événement
export async function deleteEvent(eventId, calendar) {
    try {
        await deleteDoc(doc(db, "events", eventId));
        calendar.refetchEvents();
    } catch (error) {
        console.error("Erreur lors de la suppression de l'événement:", error);
    }
}
