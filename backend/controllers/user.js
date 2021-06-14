// Imports des packages

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserManager = require ('../managers/UserManager.js')

// Initialisation

let userManager = new UserManager();

// Fonction de Signup
/*
Dans cette fonction singup :
nous appelons la fonction de hachage de bcrypt dans notre mot de passe et lui demandons de « saler » le mot de passe 10 fois. 
Plus la valeur est élevée, plus l'exécution de la fonction sera longue, et plus le hachage sera sécurisé.
il s'agit d'une fonction asynchrone qui renvoie une Promise dans laquelle nous recevons le hash généré ;
dans notre bloc then , nous créons un utilisateur et l'enregistrons dans la base de données, en renvoyant une réponse de réussite en cas de succès, 
et des erreurs avec le code d'erreur en cas d'échec ;
*/ 

exports.signup = (req, res, next) => {
    let email = req.body.email;
	let password = req.body.password;
	let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let avatar = req.body.avatar;
    bcrypt.hash(password, 10)
        .then (hash => {
            let sqlInserts = [lastName, firstName, email, avatar, hash];
            userManager.signup(sqlInserts)
                .then((response) =>{
                    res.status(201).json(JSON.stringify(response))
                })
                .catch((error) =>{
                    console.error(error);
                    res.status(400).json({error})
                })
        })
        .catch(error => res.status(500).json(error)) 
};

// Connexion 

exports.login = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    let sqlInserts = [email];
    userManager.login(sqlInserts, password)
        .then((response) =>{
            res.status(200).json(JSON.stringify(response))
        })
        .catch((error) =>{
            res.status(400).json(error)
        })
}

// Récuperer le profil d'utilisateur et l'affiche

exports.seeMyProfile = (req, res, next) => {
    
    const userId = req.userId;
    let sqlInserts = [userId];
    userManager.seeMyProfile(sqlInserts)
        .then((response) =>{
            res.status(200).json(JSON.stringify(response))
        })
        .catch((error) =>{
            console.log(error);
            res.status(400).json(error)
        })
} 

// Modifier le profil d'un utilisateur

exports.updateUser = (req, res, next) => {
     
    let userId = req.params.id;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let avatar = `${req.protocol}://${req.get('host')}/avatars/${req.file.filename}`;
    let sqlInserts = [firstName, lastName, email, avatar, userId];
    userManager.updateUser(sqlInserts)
        .then((response) =>{
            res.status(201).json(JSON.stringify(response))
        })
        .catch((error) =>{
            res.status(400).json(error)
        })
}

// Supprimer le profil d'utilisateur

exports.deleteUser = (req, res, next) => {
    
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const userId = decodedToken.userId;
    let sqlInserts = [userId];
    userManager.deleteUser(sqlInserts)
        .then((response) =>{
            res.status(200).json(JSON.stringify(response))
        })
        .catch((error) =>{
            console.log(error);
            res.status(400).json(error)
        })
} 
 


