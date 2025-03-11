const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Dossier pour stocker les données
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// Chemin du fichier JSON des phrases
const PHRASES_FILE = path.join(DATA_DIR, 'phrases_database.json');

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint pour récupérer les phrases
app.get('/api/phrases', (req, res) => {
    try {
        if (fs.existsSync(PHRASES_FILE)) {
            const data = fs.readFileSync(PHRASES_FILE, 'utf8');
            res.json(JSON.parse(data));
        } else {
            // Créer un fichier vide si n'existe pas
            const emptyData = { phrases: [], lastUpdated: new Date().toISOString(), totalCount: 0 };
            fs.writeFileSync(PHRASES_FILE, JSON.stringify(emptyData));
            res.json(emptyData);
        }
    } catch (error) {
        console.error('Erreur lors de la lecture des phrases:', error);
        res.status(500).json({ error: 'Erreur lors de la lecture des phrases' });
    }
});

// Endpoint pour sauvegarder les phrases
app.post('/api/phrases', (req, res) => {
    try {
        const data = req.body;
        fs.writeFileSync(PHRASES_FILE, JSON.stringify(data));
        res.json({ success: true, message: 'Phrases sauvegardées avec succès' });
    } catch (error) {
        console.error('Erreur lors de la sauvegarde des phrases:', error);
        res.status(500).json({ error: 'Erreur lors de la sauvegarde des phrases' });
    }
});

// Route pour servir le dictionnaire français
app.get('/dictionnaire-francais.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dictionnaire-francais.json'));
});

// Route par défaut - servir l'application
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});