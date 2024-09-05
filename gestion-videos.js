import { storage, db } from './firebase-config.js';
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', () => {
    const videoForm = document.getElementById('video-form');
    const videoTable = document.getElementById('video-table').getElementsByTagName('tbody')[0];
    const videosCollection = collection(db, 'videos');

    // Fonction pour afficher les vidéos dans le tableau
    const displayVideos = async () => {
        const querySnapshot = await getDocs(videosCollection);
        videoTable.innerHTML = ''; // Réinitialiser le tableau

        querySnapshot.forEach((doc) => {
            const video = doc.data();
            const videoRow = document.createElement('tr');

            const videoCell = document.createElement('td');
            const videoElement = document.createElement('video');
            videoElement.controls = true;
            const sourceElement = document.createElement('source');
            sourceElement.src = video.url;
            sourceElement.type = 'video/mp4';
            videoElement.appendChild(sourceElement);
            videoCell.appendChild(videoElement);

            const deleteCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Supprimer';
            deleteButton.addEventListener('click', async () => {
                await deleteDoc(doc.ref);
                displayVideos(); // Réactualiser la liste des vidéos
                alert('Vidéo supprimée avec succès.');
            });
            deleteCell.appendChild(deleteButton);

            videoRow.appendChild(videoCell);
            videoRow.appendChild(deleteCell);
            videoTable.appendChild(videoRow);
        });
    };

    // Gérer l'ajout de vidéo
    if (videoForm) {
        videoForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const fileInput = document.getElementById('video-file');
            const file = fileInput.files[0];

            if (file) {
                const fileRef = ref(storage, `videos/${file.name}`);
                try {
                    const snapshot = await uploadBytes(fileRef, file);
                    const videoUrl = await getDownloadURL(snapshot.ref);
                    await addDoc(videosCollection, { url: videoUrl });
                    fileInput.value = ''; // Réinitialiser le champ de fichier
                    displayVideos(); // Réactualiser la liste des vidéos
                    alert('Vidéo téléchargée avec succès !');
                } catch (error) {
                    console.error('Erreur lors de l\'upload des vidéos:', error);
                }
            }
        });
    }

    // Afficher les vidéos au chargement
    displayVideos();
});
