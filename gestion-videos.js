document.addEventListener('DOMContentLoaded', () => {
    const videoForm = document.getElementById('video-form');
    const videoTable = document.getElementById('video-table').getElementsByTagName('tbody')[0];

    // Fonction pour afficher les vidéos dans le tableau
    const displayVideos = async () => {
        try {
            const response = await fetch('video.php'); // Vérifiez que le chemin est correct
            const videos = await response.json();
            
            videoTable.innerHTML = ''; // Réinitialiser le tableau
            
            videos.forEach(video => {
                const videoRow = document.createElement('tr');
                
                const videoCell = document.createElement('td');
                const videoElement = document.createElement('video');
                videoElement.controls = true;
                const sourceElement = document.createElement('source');
                sourceElement.src = video.videoUrl; // Assurez-vous que cela correspond à votre champ
                sourceElement.type = 'video/mp4';
                videoElement.appendChild(sourceElement);
                videoCell.appendChild(videoElement);
                
                const deleteCell = document.createElement('td');
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Supprimer';
                deleteButton.addEventListener('click', async () => {
                    const deleteResponse = await fetch('video.php', {
                        method: 'DELETE',
                        body: JSON.stringify({ id: video.id }), // Assurez-vous que l'id est correct
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    const deleteResult = await deleteResponse.json();
                    alert(deleteResult.message || deleteResult.error);
                    displayVideos(); // Réactualiser la liste des vidéos
                });
                deleteCell.appendChild(deleteButton);
                
                videoRow.appendChild(videoCell);
                videoRow.appendChild(deleteCell);
                videoTable.appendChild(videoRow);
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des vidéos:', error);
        }
    };

    // Gérer l'ajout de vidéo
    if (videoForm) {
        videoForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const formData = new FormData(videoForm);
            try {
                const response = await fetch('video.php', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                alert(result.message || result.error);
                displayVideos(); // Réactualiser la liste des vidéos
                videoForm.reset(); // Réinitialiser le formulaire
            } catch (error) {
                console.error('Erreur lors de l\'upload des vidéos:', error);
            }
        });
    }

    // Afficher les vidéos au chargement
    displayVideos();
});
