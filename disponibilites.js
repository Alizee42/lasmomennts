import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, Timestamp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';
import { db } from './firebase-config.js';

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
        loadAvailabilities();
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

async function loadAvailabilities() {
    const querySnapshot = await getDocs(collection(db, "disponibilités"));
    const tableBody = document.querySelector('#availability-table tbody');
    tableBody.innerHTML = '';  // Vider le tableau avant de le remplir

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const statut = data.statut === "réservé" ? "Réservé" : "Disponible";

        const row = `
            <tr>
                <td>${data.date}</td>
                <td>${data.timeSlot}</td>
                <td>${statut}</td>
                <td>
                    ${data.statut === "disponible" ? `<button class="reserve-btn" data-id="${doc.id}">Réserver</button>` : ""}
                    <button class="delete-btn" data-id="${doc.id}">Supprimer</button>
                </td>
            </tr>`;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}

async function reserveAvailability(id) {
    const docRef = doc(db, "disponibilités", id);
    await updateDoc(docRef, {
        statut: "réservé",
        updatedAt: Timestamp.now()
    });
    alert("Disponibilité réservée !");
    loadAvailabilities();
}

async function deleteAvailability(id) {
    await deleteDoc(doc(db, "disponibilités", id));
    alert("Disponibilité supprimée");
    loadAvailabilities();
}

// Charger les disponibilités lorsque la page est chargée
loadAvailabilities();
