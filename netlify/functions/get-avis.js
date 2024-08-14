// get-avis.js
import { db, collection, getDocs } from './firebase-config.js';

async function getAvis() {
  try {
    const querySnapshot = await getDocs(collection(db, 'avis'));
    const avisList = [];

    querySnapshot.forEach((doc) => {
      avisList.push(doc.data());
    });

    return avisList;
  } catch (error) {
    console.error('Erreur lors de la récupération des avis:', error);
    return [];
  }
}

// Exemple d'utilisation
window.addEventListener('DOMContentLoaded', async () => {
  const avisList = await getAvis();
  const temoignagesList = document.getElementById('temoignages-list');

  avisList.forEach((avis) => {
    const div = document.createElement('div');
    div.classList.add('temoignage');
    div.innerHTML = `
      <div class="photo-container">
        <img src="${avis.imageUrl}" alt="Photo" class="temoignage-photo">
      </div>
      <div class="temoignage-message">
        <p class="message-texte">${avis.avis}</p>
      </div>
      <div class="temoignage-nom">
        <p>${avis.nom} ${avis.prenom}</p>
      </div>
    `;
    temoignagesList.appendChild(div);
  });
});
