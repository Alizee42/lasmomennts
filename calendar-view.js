import { db } from './firebase-config.js';
import { collection, query, getDocs } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: async function(fetchInfo, successCallback, failureCallback) {
            const q = query(collection(db, 'disponibilites'));
            const snapshot = await getDocs(q);
            let events = [];
            snapshot.forEach(doc => {
                let event = doc.data();
                event.id = doc.id;
                events.push(event);
            });
            successCallback(events);
        },
        // Désactiver l'édition des événements
        editable: false,
        selectable: false
    });

    calendar.render();
});
