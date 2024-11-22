const mongoose = require('mongoose');

// Création du schéma de film
const filmSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    dateDeSortie: {
        type: String,
        required: true,
    },
    trailer: {
        type: String, // URL de la vidéo de trailer (ou un chemin vers un fichier)
        required: true,
    },
    photoAffiche: {
        type: String, // URL de la photo d'affiche (ou un chemin vers un fichier)
        required: true,
    },
    film: {
        type: String, // URL du film complet (ou un chemin vers un fichier)
        required: true,
    },
    categorie:{
        type:[String],
        required:true,
    }
});

// Exportation du modèle Film
const Film = mongoose.model('Film', filmSchema);
module.exports = Film;
