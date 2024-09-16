import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, Timestamp, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';
import { db } from './firebase-config.js';

// Fonction pour ajouter tous les jours d'une année donnée
async function addYearDates(year, specificDays = []) {
    const dates = [];
    const startDate = new Date(year, 0, 1); // 1er janvier
    const endDate = new Date(year + 1, 0, 0); // 31 décembre

    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
        const dateString = date.toISOString().split('T')[0]; // Format yyyy-mm-dd
        const dayOfWeek = date.getDay();

        if (specificDays.includes(dayOfWeek)) {
            dates.push(dateString);
        }
    }

    console.log(`Dates for ${year}:`, dates);

    try {
        const existingDates = (await getDocs(collection(db, "disponibilités"))).docs.map(doc => doc.data().date);
        console.log('Existing Dates:', existingDates);

        for (const date of dates) {
            if (!existingDates.includes(date)) {
                await addDoc(collection(db, "disponibilités"), {
                    date: date,
                    timeSlot: "Toute la journée",
                    statut: "disponible",
                    createdAt: Timestamp.now()
                });
                console.log(`Added date: ${date}`);
            }
        }
    } catch (error) {
        console.error("Error adding dates:", error);
    }
}

// Ajouter les dates pour les années 2024 et 2025
async function addDatesForYears() {
    console.log('Adding dates for 2024 and 2025');
    await addYearDates(2024, [0, 6]); // Ajouter seulement les samedis (6) et dimanches (0)
    await addYearDates(2025, [0, 6]); // Ajouter seulement les samedis (6) et dimanches (0)
}


// Fonction pour formater une date au format JJ/MM/AAAA
function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

// Fonction pour charger les disponibilités par mois et année
function loadAvailabilities(month = new Date().getUTCMonth(), year = new Date().getUTCFullYear()) {
    const startDate = new Date(Date.UTC(year, month, 1)); // Premier jour du mois
    const endDate = new Date(Date.UTC(year, month + 1, 0)); // Dernier jour du mois

    console.log('Chargement des disponibilités de:', startDate.toISOString(), 'à', endDate.toISOString());

    const availabilityCollection = collection(db, "disponibilités");
    onSnapshot(availabilityCollection, (querySnapshot) => {
        const tableBody = document.querySelector('#availability-table tbody');
        tableBody.innerHTML = '';  // Vider le tableau avant de le remplir

        // Récupérer les disponibilités et les trier par date
        const availabilities = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        availabilities.sort((a, b) => a.date.localeCompare(b.date)); // Tri alphabétique des dates

        availabilities.forEach((data) => {
            const date = new Date(data.date);

         
            // Vérifier que la date est dans la plage demandée
            if (date >= startDate && date <= endDate) {
                const dayOfWeek = date.getDay();
                
                // Afficher uniquement les samedis (6) et dimanches (0)
                if (dayOfWeek === 0 || dayOfWeek === 6) {
                    const statut = data.statut === "réservé" ? "Réservé" : "Disponible";

                    const row = `
                        <tr>
                            <td>${formatDate(data.date)}</td>
                            <td>${data.timeSlot}</td>
                            <td>${statut}</td>
                            <td>
                                ${data.statut === "disponible" ? `<button class="reserve-btn" data-id="${data.id}">Réserver</button>` : ""}
                                <button class="delete-btn" data-id="${data.id}">Supprimer</button>
                            </td>
                        </tr>`;
                    tableBody.insertAdjacentHTML('beforeend', row);
                }
            }
        });
    });
}

// Fonction de gestion du changement de mois
document.getElementById('month-select').addEventListener('change', (e) => {
    const [year, month] = e.target.value.split('-').map(Number);
    console.log('Year selected:', year);
    console.log('Month selected:', month);
    loadAvailabilities(month, year);
});

// Événement de soumission du formulaire pour ajouter une disponibilité
document.getElementById('availability-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const date = document.getElementById('date').value;
    const timeSlot = document.getElementById('time-slot').value;

    try {
        await addDoc(collection(db, "disponibilités"), {
            date: date,
            timeSlot: timeSlot,
            statut: "disponible",
            createdAt: Timestamp.now()
        });
        alert("Disponibilité ajoutée avec succès !");
    } catch (error) {
        console.error("Erreur lors de l'ajout de la disponibilité : ", error);
    }
});

// Event delegation pour les boutons "Réserver" et "Supprimer"
document.querySelector('#availability-table tbody').addEventListener('click', async (e) => {
    if (e.target.tagName === 'BUTTON') {
        const id = e.target.getAttribute('data-id');
        if (e.target.classList.contains('reserve-btn')) {
            await reserveAvailability(id);
        } else if (e.target.classList.contains('delete-btn')) {
            await deleteAvailability(id);
        }
    }
});

async function reserveAvailability(id) {
    try {
        const docRef = doc(db, "disponibilités", id);
        await updateDoc(docRef, {
            statut: "réservé",
            updatedAt: Timestamp.now()
        });
        alert("Disponibilité réservée !");
    } catch (error) {
        console.error("Erreur lors de la réservation : ", error);
    }
}

async function deleteAvailability(id) {
    try {
        await deleteDoc(doc(db, "disponibilités", id));
        alert("Disponibilité supprimée");
    } catch (error) {
        console.error("Erreur lors de la suppression : ", error);
    }
}

// Charger les disponibilités pour le mois actuel lorsque la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    const [currentYear, currentMonth] = (new Date().toISOString().split('T')[0]).split('-').map(Number);
    loadAvailabilities(currentMonth, currentYear);
});
