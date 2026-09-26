const mongoose = require('mongoose'); // Importiere Mongoose für die Arbeit mit MongoDB

const concertSchema = new mongoose.Schema(
    {
        artist: { type: String, required: true, trim: true }, // Künstler, erforderlich, keine führenden oder nachfolgenden Leerzeichen
        date: { type: String, required: true },
        venue: { type: String, required: true, trim: true },
        supportActs: { type: String, default: '', trim: true },  // Support-Acts, optional, initialisiert mit einem leeren String
        rating: { type: Number, default: null, min: 1, max: 5 },  // Bewertung, optional, initialisiert mit null
        comment: { type: String, default: '', trim: true },  // Kommentar, optional, keine führenden oder nachfolgenden Leerzeichen
    },
    {
        timestamps: true,  // Fügt automatisch die Felder 'createdAt' und 'updatedAt' hinzu
        toJSON: { virtuals: true },   // wandelt Datenbankeinträge in JSON um, einschließlich virtueller Felder
        toObject: {virtuals: true }   // wandelt Mongoose-Dokumente in JavaScript-Objekte um, einschließlich virtueller Felder
    }
);

// wandelt Mongoose _id für Angular in id um, da Angular _id nicht unterstützt
concertSchema.virtual('id').get(function () {
    return this._id.toHexString();  // gibt den Wert von '_id' als Hexadezimal-String zurück (sicherer als toString())
});

// berechnet, ob das Konzert in der Vergangenheit liegt, basierend auf dem Datum des Konzerts
concertSchema.virtual('isPast').get(function () {
    if (!this.date) return false;  // false, wenn kein Datum vorhanden ist

    const today = new Date();  // Datumsobjekt aus JavaScript mit aktuellem Datum + Uhrzeit
    today.setHours(0, 0, 0, 0);  // setzt uhrzeit auf = uhr heute morgen

    const concertDate = new Date(this.date);
    return concertDate < today;  // gibt true zurück, wenn das Konzertdatum in der Vergangenheit liegt, andernfalls false (heute = false, nicht vergangen)
})

// individuelle Definition der Standard-Methode toJSON von Mongoose-Docs
// räumt Mongoose-Doc auf, bevor es als JavaScript-Objekt ans Angular-Frontend geschickt wird
concertSchema.set('toJSON', {
    virtuals: true,  // virtuelle Felder in JSON-Ausgabe sichtbar und werden mitgesendet
    versionKey: false,  // entfernt das __v-Feld (MongoDB-intern) aus der JSON-Ausgabe
    transfom: function (doc, ret) {   // zu transformierendes Mongoose-doc (doc), Zielobjekt / Rückgabe Java Script-Objekt (ret = return)
        delete ret._id;   // entfernt _id (jetzt redundant, da id = _id) aus der JSON-Ausgabe
    }
})

// Exportiert das Mongoose-Modell 'Concert', das auf dem concertSchema basiert, für die Verwendung in anderen Dateien
module.exports = mongoose.model('Concert', concertSchema);



