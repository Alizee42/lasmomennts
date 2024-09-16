import { getDocs, collection, deleteDoc, doc, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';
import { db } from './firebase-config.js';

// Fonction pour supprimer les vendredis
async function removeFridays() {
    const querySnapshot = await getDocs(collection(db, "disponibilités"));
    const deletions = [];
    querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        const eventDate = new Date(data.date);
        const dayOfWeek = eventDate.getDay();

        // Si la date correspond à un vendredi (jour 5), on la supprime
        if (dayOfWeek === 5) {
            console.log(`Date de vendredi trouvée et supprimée: ${data.date}`);
            deletions.push(deleteDoc(doc(db, "disponibilités", docSnapshot.id)));
        }
    });

    await Promise.all(deletions);
}

// Fonction pour supprimer les doublons
async function removeDuplicateEvents() {
    const querySnapshot = await getDocs(collection(db, "disponibilités"));
    const dates = new Set();
    const toDelete = [];

    querySnapshot.forEach(docSnapshot => {
        const data = docSnapshot.data();
        const eventDate = data.date;

        // Vérifier si la date a déjà été rencontrée
        if (dates.has(eventDate)) {
            toDelete.push(deleteDoc(doc(db, "disponibilités", docSnapshot.id)));
        } else {
            dates.add(eventDate);
        }
    });

    await Promise.all(toDelete);
}

// Fonction pour afficher les événements dans le calendrier
document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'fr',
        buttonText: {
            today: "Aujourd'hui"
        },
    });
    calendar.render();

    // Obtenir les documents de la collection
    onSnapshot(collection(db, "disponibilités"), (querySnapshot) => {
        calendar.removeAllEvents(); // Supprimer tous les événements avant d'ajouter les nouveaux

        querySnapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            const eventDate = new Date(data.date);
            const dayOfWeek = eventDate.getDay();

            // Ajouter uniquement les samedis et dimanches
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                console.log('Adding event:', data.date, data.statut); // Vérifiez les données

                calendar.addEvent({
                    title: data.statut === "réservé" ? "Réservé" : "Disponible",
                    start: data.date,
                    allDay: true,
                    color: data.statut === "réservé" ? 'red' : 'green'
                });
            }
        });
    });
});

// Appel des fonctions pour nettoyer les données et préparer l'affichage
(async function() {
    await removeFridays(); // Supprimer les vendredis
    await removeDuplicateEvents(); // Supprimer les doublons
})();
