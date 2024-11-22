const express = require('express');
const Film = require('../../models/Film'); // Chemin vers le modèle Film
const Categorie = require('../../models/Categorie'); // Ajout de l'import pour vérifier les catégories
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
        const { nom, description, dateDeSortie, categorie } = req.body;

        // Vérifier que toutes les catégories existent
        if (categorie && categorie.length > 0) {
            const categorieExistantes = await Categorie.find({ name: { $in: categorie } });
            if (categorieExistantes.length !== categorie.length) {
                return res.status(400).json({
                    message: 'Une ou plusieurs catégories spécifiées n\'existent pas'
                });
            }
        }

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
            categorie: categorie || [] // Utiliser un tableau vide si aucune catégorie n'est fournie
        });

        await nouveauFilm.save();
        res.status(201).json({ message: 'Film ajouté avec succès', film: nouveauFilm });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'ajout du film', error: error.message });
    }
});

// Read all (existant)
router.get('/all', async (req, res) => {
    try {
        const films = await Film.find();
        res.status(200).json(films);
    } catch (e) {
        res.status(500).json({ message: 'Erreur lors de la récupération des films', e });
    }
});

// Read by category
router.get('/categorie/:categorieName', async (req, res) => {
    try {
        const films = await Film.find({ categorie: req.params.categorieName });
        res.status(200).json(films);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des films par catégorie', error: error.message });
    }
});

// Read one
router.get('/:id', async (req, res) => {
    try {
        const film = await Film.findById(req.params.id);
        if (!film) {
            return res.status(404).json({ message: 'Film non trouvé' });
        }
        res.status(200).json(film);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du film', error: error.message });
    }
});

// Update
router.put('/update/:id', upload.fields([
    { name: 'trailer', maxCount: 1 },
    { name: 'photoAffiche', maxCount: 1 },
    { name: 'film', maxCount: 1 }
]), async (req, res) => {
    try {
        const { nom, description, dateDeSortie, categorie } = req.body;

        // Vérifier que toutes les catégories existent


        const updateData = {
            nom,
            description,
            dateDeSortie,
            categorie: categorie || [] // Utiliser un tableau vide si aucune catégorie n'est fournie
        };

        // Add files only if they are uploaded
        if (req.files) {
            if (req.files['trailer']) {
                updateData.trailer = req.files['trailer'][0].path;
            }
            if (req.files['photoAffiche']) {
                updateData.photoAffiche = req.files['photoAffiche'][0].path;
            }
            if (req.files['film']) {
                updateData.film = req.files['film'][0].path;
            }
        }

        const updatedFilm = await Film.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!updatedFilm) {
            return res.status(404).json({ message: 'Film non trouvé' });
        }

        res.status(200).json({ message: 'Film modifié avec succès', film: updatedFilm });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la modification du film', error: error.message });
    }
});

// Delete
router.delete('/delete/:id', async (req, res) => {
    try {
        const deletedFilm = await Film.findByIdAndDelete(req.params.id);
        if (!deletedFilm) {
            return res.status(404).json({ message: 'Film non trouvé' });
        }
        res.status(200).json({ message: 'Film supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du film', error: error.message });
    }
});

// Read by category (avec support pour recherche dans un tableau)
router.get('/categorie/:categorieName', async (req, res) => {
    try {
        const films = await Film.find({
            categorie: {
                $elemMatch: {
                    $eq: req.params.categorieName
                }
            }
        });

        if (films.length === 0) {
            return res.status(404).json({
                message: `Aucun film trouvé pour la catégorie ${req.params.categorieName}`
            });
        }

        res.status(200).json({
            message: `Films trouvés dans la catégorie ${req.params.categorieName}`,
            nombre: films.length,
            films: films
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération des films par catégorie',
            error: error.message
        });
    }
});


module.exports = router;