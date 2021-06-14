// Imports des packages

const multer = require('multer');
const path = require('path');

// Définition des Types MIME acceptés

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png', 
  "image/gif": "gif",
  "video/webm": "webm",
  'image/svg+xml': '.svg',
  'image/webp': '.webp'
};

// delimite la taille des fichiers
const maxSize = 1* 1000 * 1000;

// Gestion des fichiers entrants dans le dossier images
/*
Dans ce middleware :
nous créons une constante storage , à passer à multer comme configuration, qui contient la logique nécessaire pour indiquer à multer où enregistrer les fichiers entrants :
la fonction destination indique à multer d'enregistrer les fichiers dans le dossier images ;
la fonction filename indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores et d'ajouter un timestamp Date.now() comme nom de fichier. 
Elle utilise ensuite la constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée ;
Nous exportons ensuite l'élément multer entièrement configuré, lui passons notre constante storage et lui indiquons que nous gérerons uniquement les téléchargements de fichiers image.
*/

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    
    const extPath = path.extname(`/images/${file.originalname}`);
    const name = file.originalname.split(' ').join('_').split(extPath).join('');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + '_' + Date.now() + '.' + extension);
  },
  limits: {fileSize: maxSize }
});

module.exports = multer({storage: storage}).single('image');



