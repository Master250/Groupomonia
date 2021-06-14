// Imports des packages

const jwt = require('jsonwebtoken');
const ModManager = require ('../managers/ModManager.js');

// Initialisation 

let modManager = new ModManager();

// Récuperer tout les posts dans l'espace du modérarteur

exports.getAllPosts = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const mod = decodedToken.moderator;
    if(mod == 1){
        modManager.getAllPosts()
            .then((response) => {
                res.status(200).json(JSON.stringify(response));
            })
            
    }else{
        res.status(400).json({error: 'Requête non authorisée'})
    }
}

// Supprimer un post par le modérateur

exports.deletePost = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const mod = decodedToken.moderator;
    
    if(mod == 1){
        let postId = req.params.id;
        let sqlInserts = [postId];
        modManager.deletePost(sqlInserts)
            .then((response) => {
                res.status(200).json(JSON.stringify(response));
            })
            
    }else{
        res.status(400).json({error: 'Requête non authorisée'})
    }
}

// Récuperer tout les commentaires des utilisateurs

exports.getAllComments = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const mod = decodedToken.moderator;
    if(mod == 1){
        modManager.getAllComments()
            .then((response) =>{
                res.status(200).json(JSON.stringify(response));
            })
    }else{
        res.status(400).json({error: 'Requête non authorisée'})
    }
}

// Supprimer un commentaire

exports.deleteComment = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const mod = decodedToken.moderator;
    if(mod == 1){
        let commentId = req.params.id;
        let sqlInserts = [commentId];
        modManager.deleteComment(sqlInserts)
            .then((response) =>{
                res.status(200).json(JSON.stringify(response));
            })
    }else{
        res.status(400).json({error: 'Requête non authorisée'})
    }
}
