const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1']); // Nutzen direkt Google und Cloudflare DNS

const express = require('express');     // Importiere das Express-Framework
const mongoose = require('mongoose');  // Importiere Mongoose für die Arbeit mit MongoDB
const cors = require('cors');         // Importiere CORS für Cross-Origin Resource Sharing
require('dotenv').config();         // Importiere dotenv, um Umgebungsvariablen aus der .env-Datei zu laden

//Routes importieren
const routes = require('./routes');      //greift automatisch auf routes/index.js zu

const app = express();      // Erstellt eine Express-Anwendung

// Middleware 
app.use(cors());            // Aktiviert CORS für alle Routen
app.use(express.json());   // Aktiviert das  Verarbeiten / Parsen von JSON-Anfragen / JSON im Request-Body

//Routes einbinden in die Express-Anwendung
app.use('/api', routes);  // Alle Routen werden unter dem Pfad '/' verfügbar gemacht

// Port und MongoDB-URI aus der .env-Datei laden
const PORT = process.env.PORT || 3000;           // Standardport ist 3000, falls keine Umgebungsvariable gesetzt ist
const MONGODB_URI = process.env.MONGODB_URI;     // MongoDB-Verbindungs-URI aus der .env-Datei

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log('Erfolgreich mit MongoDB verbunden');  // Bestätigt erfolgreiche Verbindung zu MongoDB in der Konsole
        app.listen(PORT, () => {
            console.log(`Server läuft auf Port ${PORT}`);  // Startet den Server und gibt den Port in der Konsole aus
        });
    })
    .catch((err) => {
        console.error('Fehler beim Verbinden mit MongoDB:', err.message); // Fehlermeldung auf Konsole, falls Verbindung zu MongoDB fehlschlägt 
    });