const multer = require('multer');
const path = require('path');

// Configuration du stockage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  // Dossier où enregistrer les fichiers
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Nom unique
    },
});

// Filtrer les fichiers par types acceptés (images et vidéos)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Type de fichier non supporté'), false);
    }
};

// Initialiser multer avec le stockage et le filtre
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

module.exports = upload;
