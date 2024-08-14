// save-avis.js
import { db, storage, collection, addDoc, ref, uploadBytes, getDownloadURL } from './firebase-config.js';

async function saveAvisBrouillon(nom, prenom, avis, file) {
  try {
    // Upload de l'image
    let imageUrl = '';
    if (file) {
      const storageRef = ref(storage, `avis/${file.name}`);
      await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(storageRef);
    }

    // Enregistrement des avis dans la collection 'avis_brouillon'
    await addDoc(collection(db, 'avis_brouillon'), {
      nom,
      prenom,
      avis,
      imageUrl,
      date: new Date().toISOString(),
      statut: 'en_attente'  // Indique que l'avis est en attente de validation
    });

    console.log('Avis enregistré en brouillon avec succès!');
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'avis en brouillon:', error);
  }
}

// Exemple d'utilisation
const form = document.getElementById('reviewForm');
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const nom = document.getElementById('name').value;
  const prenom = document.getElementById('prenom').value;
  const avis = document.getElementById('message').value;
  const file = document.getElementById('file').files[0];

  await saveAvisBrouillon(nom, prenom, avis, file);
});
