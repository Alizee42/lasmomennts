<?php
$host = 'localhost'; // ou l'adresse de votre serveur
$db = 'lasmoments';
$user = 'root';
$pass = '';

// Créer une connexion
$conn = new mysqli($host, $user, $pass, $db);

// Vérifier la connexion
if ($conn->connect_error) {
    die("Échec de la connexion: " . $conn->connect_error);
}

// Gérer les requêtes POST pour ajouter une vidéo
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['video-file'])) {
        $file = $_FILES['video-file'];
        $targetDir = "uploads/"; // Répertoire où les vidéos seront stockées
        $targetFile = $targetDir . basename($file["name"]);
        
        // Déplacer le fichier uploadé dans le répertoire
        if (move_uploaded_file($file["tmp_name"], $targetFile)) {
            // Insérer le chemin de la vidéo dans la base de données
            $stmt = $conn->prepare("INSERT INTO videos (videoUrl) VALUES (?)");
            $stmt->bind_param("s", $targetFile);
            $stmt->execute();
            $stmt->close();
            echo json_encode(["message" => "Vidéo téléchargée avec succès !"]);
        } else {
            echo json_encode(["error" => "Erreur lors de l'upload."]);
        }
    }
}

// Gérer les requêtes GET pour récupérer les vidéos
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $conn->query("SELECT * FROM videos");
    $videos = [];
    while ($row = $result->fetch_assoc()) {
        $videos[] = $row;
    }
    echo json_encode($videos);
}

// Gérer les requêtes DELETE pour supprimer une vidéo
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'];
    $stmt = $conn->prepare("DELETE FROM videos WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->close();
    echo json_encode(["message" => "Vidéo supprimée avec succès."]);
}

$conn->close();
?>