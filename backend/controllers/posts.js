// Imports des packages

const PostsManager = require ('../managers/PostsManager.js')

let postsManager = new PostsManager();
 
//  Récuperer tout les posts

exports.getAllPosts = (req, res, next) => {
    postsManager.getAllPosts()
        .then((response) => {
            res.status(200).json(JSON.stringify(response));
        });
}

// Création d'un post

exports.createPost = (req, res, next) => { 
    let title = req.body.title;
    let userId = req.body.userId;
    let content = req.body.content;
    let imageUrl = req.body.content && req.file? `${req.protocol}://${req.get('host')}/images/${req.file.filename}`:null;
    let sqlInserts = [userId, title, content, imageUrl];
    postsManager.createPost(sqlInserts)
        .then((response) => {
            res.status(201).json(JSON.stringify(response));
        })
}

// Mettre à jour un post

exports.updatePost = (req, res, next) => {
    
    const userId = req.userId;
    let title = req.body.title;
    let content = req.body.content;
    let postId = req.params.id;
    let imageUrl =`${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    let sqlInserts1 = [postId];
    let sqlInserts2 = [title, content, imageUrl, postId, userId];
    postsManager.updatePost(sqlInserts1, sqlInserts2)
        .then((response) => {
            res.status(201).json(JSON.stringify(response));
        })
        .catch((error) =>{
            console.log(error);
            res.status(400).json(JSON.stringify(error));
        })
}

// Supprimer un post

exports.deletePost = (req, res, next) => {
    
    const userId = req.userId;
    let postId = req.params.id;
    let sqlInserts1 = [postId];
    let sqlInserts2 = [postId, userId];
    postsManager.deletePost(sqlInserts1, sqlInserts2)
        .then((response) =>{
            res.status(200).json(JSON.stringify(response));
        })
        .catch((error) =>{
            console.log(error);
            res.status(400).json(JSON.stringify(error));
        })
}


// Session commentaires

exports.getComments = (req, res, next) => {
    let postId = req.params.id;
    let sqlInserts = [postId];
    postsManager.getComments(sqlInserts)
        .then((response) =>{
            res.status(200).json(JSON.stringify(response));
        })
}

// Création d'un commentaire 

exports.createComment = (req, res, next) => { 
    let postId = req.params.id;
    let userId = req.body.userId;
    let content = req.body.content;
    let sqlInserts = [userId, postId, content];
    postsManager.createComment(sqlInserts)
        .then((response) =>{
            res.status(201).json(JSON.stringify(response));
        })
}

// Mettre à jour un commentaire

exports.updateComment = (req, res, next) => {
    
    const userId = req.userId;
    let postId = req.body.postId;
    let comContent = req.body.comContent;
    let commentId = req.params.id;
    let sqlInserts1 = [commentId];
    let sqlInserts2 = [comContent,commentId,userId, postId,  ];
    
    postsManager.updateComment(sqlInserts1, sqlInserts2)
        .then((response) => {
            res.status(201).json(JSON.stringify(response));  
        }) 
        .catch((error) =>{
            console.log(error);
            res.status(400).json(JSON.stringify(error));
        })
}

exports.deleteComment = (req, res, next) => {
    
    const userId = req.userId;
    let commentId = req.params.id;
    let sqlInserts1 = [commentId];
    let sqlInserts2 = [commentId, userId];
    postsManager.deleteComment(sqlInserts1, sqlInserts2)
        .then((response) =>{
            res.status(200).json(JSON.stringify(response));
        })
        .catch((error) =>{
            console.log(error);
            res.status(400).json(JSON.stringify(error));
        })
}


// Session "Like/Dislike"

exports.getAllLikes = (req, res, next) =>{
     postsManager.getAllLikes()
        .then((response) =>{
            res.status(200).json(JSON.stringify(response));
        })
}
exports.postLike = (req, res, next) => {
    let userId = req.body.userId;
    let nbLikes = req.body.nbLikes;
    let postId = req.body.postId;
    let sqlInserts1 = [postId, userId];
    let sqlInserts2 = [nbLikes,postId];
    postsManager.postLike(sqlInserts1, sqlInserts2, req.body.liked)
        .then((response) =>{
            res.status(201).json(JSON.stringify(response))
        }) 
}




