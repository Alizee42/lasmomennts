// validate-avis.js
import { db, collection, getDocs, deleteDoc, doc, addDoc } from './firebase-config.js';

// Récupère les avis en brouillon
async function getAvisBrouillon() {
  try {
    const querySnapshot = await getDocs(collection(db, 'avis_brouillon'));
    const avisList = [];

    querySnapshot.forEach((doc) => {
      avisList.push({ id: doc.id, ...doc.data() });
    });

    return avisList;
  } catch (error) {
    console.error('Erreur lors de la récupération des avis en brouillon:', error);
    return [];
  }
}

// Valide un avis et le déplace dans la collection principale
async function validateAvis(id) {
  try {
    // Récupération de l'avis en brouillon
    const docRef = doc(db, 'avis_brouillon', id);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    if (data) {
      // Enregistrement de l'avis validé dans la collection 'avis'
      await addDoc(collection(db, 'avis'), {
        ...data,
        statut: 'validé',  // Mise à jour du statut
      });

      // Suppression de l'avis de la collection 'avis_brouillon'
      await deleteDoc(docRef);

      console.log('Avis validé avec succès!');
    }
  } catch (error) {
    console.error('Erreur lors de la validation de l\'avis:', error);
  }
}

// Affichage des avis en brouillon pour l'administration
window.addEventListener('DOMContentLoaded', async () => {
  const avisList = await getAvisBrouillon();
  const adminContainer = document.getElementById('admin-container');

  avisList.forEach((avis) => {
    const div = document.createElement('div');
    div.classList.add('avis-brouillon');
    div.innerHTML = `
      <div class="photo-container">
        <img src="${avis.imageUrl}" alt="Photo" class="avis-photo">
      </div>
      <div class="avis-message">
        <p>${avis.avis}</p>
      </div>
      <div class="avis-nom">
        <p>${avis.nom} ${avis.prenom}</p>
      </div>
      <button onclick="validateAvis('${avis.id}')">Valider</button>
    `;
    adminContainer.appendChild(div);
  });
});

window.validateAvis = validateAvis; // Expose the validateAvis function globally
