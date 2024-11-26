const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Charge les variables d'environnement
const app = express();
const port = 3000;

// Secret pour le token JWT
const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret'; // Changez ceci en une valeur plus sécurisée

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuration de la connexion à la base de données
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Remplacez par votre nom d'utilisateur
    password: '', // Remplacez par votre mot de passe
    database: 'lasmoments' // Remplacez par le nom de votre base de données
});

// Vérifiez la connexion
db.connect((err) => {
    if (err) throw err;
    console.log('Connecté à la base de données MySQL !');
});

// Route de test
app.get('/', (req, res) => {
    res.send('Bienvenue sur le serveur !');
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});

// Middleware d'authentification
const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) return res.sendStatus(403);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Route d'inscription
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertion de l'utilisateur dans la base de données
    db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: results.insertId, email });
    });
});

// Route de connexion
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Vérification de l'utilisateur
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ message: 'Utilisateur non trouvé' });

        const user = results[0];

        // Vérification du mot de passe
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return res.status(401).json({ message: 'Mot de passe incorrect' });

        // Création du token JWT
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    });
});

// Exemple de route protégée
app.get('/protected', authenticateJWT, (req, res) => {
    res.json({ message: 'Vous êtes dans une zone protégée!', user: req.user });
});
