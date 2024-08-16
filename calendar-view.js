import { getDocs, collection } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';
import { db } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', async function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'fr',  // Utiliser la locale française
        buttonText: {
            today: "Aujourd'hui"  // Personnaliser le texte pour "Today"
        },
    });
    calendar.render();

    const querySnapshot = await getDocs(collection(db, "disponibilités"));
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        calendar.addEvent({
            title: data.statut === "réservé" ? "Réservé" : "Disponible",
            start: data.date,
            allDay: true,
            color: data.statut === "réservé" ? 'red' : 'green'
        });
    });
});
