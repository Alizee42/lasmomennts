import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, Timestamp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';
import { db } from './firebase-config.js';

// Fonction pour ajouter tous les week-ends d'une année donnée
async function addYearWeekends(year) {
    const weekends = [];
    const startDate = new Date(year, 0, 1); // 1er janvier
    const endDate = new Date(year + 1, 0, 0); // 31 décembre

    // Parcourir chaque jour de l'année
    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
        if (date.getDay() === 6 || date.getDay() === 0) { // Samedi ou Dimanche
            weekends.push(date.toISOString().split('T')[0]); // Format yyyy-mm-dd
        }
    }

    // Ajouter les week-ends à la base de données si non présents
    const existingDates = (await getDocs(collection(db, "disponibilités"))).docs.map(doc => doc.data().date);
    
    for (const weekend of weekends) {
        if (!existingDates.includes(weekend)) {
            await addDoc(collection(db, "disponibilités"), {
                date: weekend,
                timeSlot: "Toute la journée",
                statut: "disponible",
                createdAt: Timestamp.now()
            });
        }
    }
}

// Ajouter les week-ends pour les années 2024 et 2025
async function addWeekendsForYears() {
    await addYearWeekends(2024);
    await addYearWeekends(2025);
}

// Fonction pour formater une date au format JJ/MM/AAAA
function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

// Fonction pour charger les disponibilités par mois
async function loadAvailabilities(month = new Date().getMonth(), year = new Date().getFullYear()) {
    await addWeekendsForYears(); // Assurez-vous que les week-ends sont ajoutés

    // Calculer le début et la fin du mois
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const querySnapshot = await getDocs(collection(db, "disponibilités"));
    const tableBody = document.querySelector('#availability-table tbody');
    tableBody.innerHTML = '';  // Vider le tableau avant de le remplir

    // Convertir les données en tableau et trier par date croissante
    const availabilities = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    availabilities.sort((a, b) => new Date(a.date) - new Date(b.date));

    availabilities.forEach((data) => {
        const date = new Date(data.date);

        // Vérifier si la date est dans le mois et l'année spécifiés
        if (date >= startDate && date <= endDate) {
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
    });
}

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
        loadAvailabilities(); // Recharger les disponibilités
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
    const docRef = doc(db, "disponibilités", id);
    await updateDoc(docRef, {
        statut: "réservé",
        updatedAt: Timestamp.now()
    });
    alert("Disponibilité réservée !");
    loadAvailabilities(); // Recharger les disponibilités
}

async function deleteAvailability(id) {
    await deleteDoc(doc(db, "disponibilités", id));
    alert("Disponibilité supprimée");
    loadAvailabilities(); // Recharger les disponibilités
}

// Fonction pour gérer le changement de mois
document.getElementById('month-select').addEventListener('change', (e) => {
    const [year, month] = e.target.value.split('-').map(Number);
    loadAvailabilities(month, year);
});

// Charger les disponibilités pour le mois actuel lorsque la page est chargée
loadAvailabilities();
