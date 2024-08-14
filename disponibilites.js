import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, onSnapshot, query } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

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
        editable: true,
        selectable: true,
        select: async function(info) {
            let title = prompt('Entrez le titre de la disponibilité:');
            if (title) {
                try {
                    await addDoc(collection(db, 'disponibilites'), {
                        title: title,
                        start: info.startStr,
                        end: info.endStr
                    });
                    calendar.refetchEvents();
                } catch (error) {
                    console.error('Erreur lors de l\'ajout de la disponibilité:', error);
                }
            }
            calendar.unselect();
        },
        eventClick: async function(info) {
            if (confirm('Voulez-vous supprimer cette disponibilité?')) {
                try {
                    await deleteDoc(doc(db, 'disponibilites', info.event.id));
                    info.event.remove();
                } catch (error) {
                    console.error('Erreur lors de la suppression de la disponibilité:', error);
                }
            }
        }
    });

    calendar.render();
});
