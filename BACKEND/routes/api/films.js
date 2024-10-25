const express = require('express');
const Film = require('../../models/Film'); // Chemin vers le modèle Film
const upload = require('../../middleware/multerConfig');
const {memoryStorage} = require("multer"); // Chemin vers la config multer
const router = express.Router();

// Route pour ajouter un film
router.post('/ajouter', upload.fields([
    { name: 'trailer', maxCount: 1 },
    { name: 'photoAffiche', maxCount: 1 },
    { name: 'film', maxCount: 1 }
]), async (req, res) => {
    try {
        const { nom, description, dateDeSortie } = req.body;

        const trailer = req.files['trailer'][0].path;
        const photoAffiche = req.files['photoAffiche'][0].path;
        const film = req.files['film'][0].path;

        const nouveauFilm = new Film({
            nom,
            description,
            dateDeSortie,
            trailer,
            photoAffiche,
            film,
        });

        await nouveauFilm.save();
        res.status(201).json({ message: 'Film ajouté avec succès', film: nouveauFilm });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'ajout du film', error: error.message });
    }
});
router.get('/all' , async (req , res )=>{
    try {
        const films = await Film.find();
        res.status(200).json(films);
    }catch (e) {

        res.status(500).json({message :' Erreur lors de la récuparations des films ' , e});

    }
});
module.exports = router;
