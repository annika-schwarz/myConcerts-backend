const express = require('express');    // Importiere das Express-Framework 
const router = express.Router();       // Erstellt einen neuen Router für die hier ausgelagerte Routenverwaltung (statt in server.js)
const Concert = require('../models/concert.model');  // Importiere das Concert-Modell, um mit der MongoDB-Datenbank zu interagieren

//Test-Route, um die Funktionalität zu überprüfen (erscheint bei Aufruf )
router.get('/', (req, res) => {  // Definiert eine GET-Route für den Pfad '/' (Root-Route)
    res.json({ message: 'Willkommen bei der myConcerts API!' });  // Sendet eine JSON-Antwort mit einer Willkommensnachricht
});

// GET-Route, um ALLE Konzerte aus der DB abzurufen (aufsteigend nach Datum)
router.get('/concerts', async (req, res) => {
    try {
        const concerts = await Concert.find().sort({ date: 1 }); // liefert alle Konzerte aufsteigend (1) nach Datum sortiert
        res.json(concerts);  // toJSON aus Datenmodell wird aufgerufen & wandelt Mongoose-Doc in JSON um
    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Abrufen der Konzerte', error: error.message });
    }
});

//GET-Route, um EINZELNES Konzert aus der DB aufzurufen
router.get('/concerts/:id', async (req, res) => {
    try {
        const concert = await Concert.findById(req.params.id); // liest dynmaischen ID-Wert aus der URL aus
        if (!concert) {     // wenn id formal korrekt, aber kein Konzert mit der ID gefunden (DB liefert null zurück)...
                return res.status(404).json({ message: 'Konzert nicht gefunden' });  // ... dann gib Fehlermeldung zurück
                }                                                                   // (um zu verhindern, dass Wert null mit Statuscode 200 OK ans Frontend geschickt wird)

        res.json(concert);         //toJSON aufgerufen & Mongoose-Doc ind JSON umgewandelt                       
        
    } catch (error) {   // id synthaktisch / formal ungültig oder DB ist offline
        res.status(500).json({ message: 'Fehler beim Abruf des Konzerts', error: error.message})
    }

});

// POST-Route, um neues Konzert anzulegen
router.post('/concerts', async (req, res) => {
    try {
        const newConcert = new Concert(req.body);  //neus Mongoose-Doc Konzert mit den in req.body vom Frontend geschickten Konzertdaten im JSON-Format 
        const savedConcert = await newConcert.save();  // Konzert wird in DB gespeichert (1) Schema-Validierung, erstellen der DB _id, Umwandlung in DB-Format (BSON)
                                                     // await=warten bis DB antwortet, savedConcert unterscheidet sich von newConcert dadurch, dass es jetzt garantiert die von MongoDB vergebene, eindeutige _id sowie eventuell automatisch erzeugte Zeitstempel enthält
        res.status(201).json(savedConcert);  // sendet Statuscode 201 Created & gespeichertes Konzert zurück ans Frontend
    } catch (error) {                       // wenn Validierungsfehler
        res.status(400).json({ message: 'Fehler beim Erstellen des Konzerts', error: error.message });
    }
});

//PUT-Route, um Konzert zu aktualisieren
router.put('/concerts/:id', async (req, res) => {
    try {
        const updatedConcert = await Concert.findByIdAndUpdate(  //finde Konzert anhand Id und überschreibe es
            req.params.id,      // extrahiert ID des Konzerts
            req.body,           // neue Daten die alte Daten überschreiben sollen
            {new: true, runValidators: true }  // gibt neues Doc zurück (standardmäßig wir altes Mongooose-Doc zurückgegeben), Validierung des Daten-Schemas
        );
        if (!updatedConcert) {  // id formal korrekt, aber kein passendes Konzert gefunden
            return res.status(404).json({ message: 'Konzert nicht gefunden' });     // stellt sicher, dass Fehlermeldung kommt, weil sonst Rückgabe 'null' mit Statuscode 200 OK
        }
        res.json(updatedConcert);
    } catch (error) {
        res.status(400).json({ message: 'Fehler beim Aktualisieren des Konzerts', error: error.message });
    }
});

//DELETE-Route, um Konzert zu löschen
router.delete('/concerts/:id', async (req, res) => {
    try {
        const deletedConcert = await Concert.findByIdAndDelete(req.params.id);  // sucht Konzert nach ID und löscht es direkt
        if(!deletedConcert) {      // id formal korrekt, aber nicht gefunden
            return res.status(404).json({ message: 'Konzert nicht gefunden' }); // stellt sicher, dass Fehlercode zurückgegeben wird, statt 'null' mit 200 OK
        }
        res.json({ message: 'Konzert erfolgreich gelöscht', id: req.params.id }); // default Statuscode 200 Ok zurück & Antwort-Objekt mit Schlüsselwerteoaaren message und id (so kann frontend gelöschtes Konzert direkt us der liste heruasfiltern, ohne neue DB-Anfrage)
    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Löschen des Konzerts', error: error.message });
        }
    });

module.exports = router;  // Exportiert den Router, damit er in anderen Dateien verwendet werden kann