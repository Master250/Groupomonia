//Gestionnaire d'images : avatar etc.

const multer = require("multer");

// Définition des Types MIME acceptés

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "video/webm": "webm",
  'image/svg+xml': '.svg',
  'image/webp': '.webp'
};

// Gestion des fichiers entrants dans le dossier avatar
/*
Dans ce middleware :
nous créons une constante storage , à passer à multer comme configuration, qui contient la logique nécessaire pour indiquer à multer où enregistrer les fichiers entrants :
la fonction destination indique à multer d'enregistrer les fichiers dans le dossier avatar ;
la fonction filename indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores et d'ajouter un timestamp Date.now() comme nom de fichier. 
Elle utilise ensuite la constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée ;
Nous exportons ensuite l'élément multer entièrement configuré, lui passons notre constante storage et lui indiquons que nous gérerons uniquement les téléchargements de fichiers avatar.
*/

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file == undefined) {
      cb();
    }
    cb(null, "avatars");
  },
  filename: function (req, file, cb) {
    if (file == undefined) {
      cb();
    }
    const extension = MIME_TYPES[file.mimetype];
    let fileName =file.originalname.replace(" ", "-").replace("." + extension, "") +"-" +Date.now() +"." +extension;
    cb(null, fileName);
  }
});
module.exports = multer({ storage }).single("avatar");