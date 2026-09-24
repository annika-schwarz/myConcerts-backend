const express = require('express');    // Importiere das Express-Framework 
const router = express.Router();       // Erstellt einen neuen Router für die Routenverwaltung

//Test-Route, um die Funktionalität zu überprüfen
router.get('/', (req, res) => {
    res.json({ message: 'Willkommen bei der myConcerts API!' });  // Sendet eine JSON-Antwort mit einer Willkommensnachricht
});

module.exports = router;  // Exportiert den Router, damit er in anderen Dateien verwendet werden kann