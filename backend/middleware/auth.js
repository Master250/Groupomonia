//Authentification
const jwt = require('jsonwebtoken');
const User = require("../managers/UserManager");

/*
Dans ce middleware :
étant donné que de nombreux problèmes peuvent se produire, nous insérons tout à l'intérieur d'un bloc try...catch ;
nous extrayons le token du header Authorization de la requête entrante. Il contiendra également le mot-clé Bearer. 
Nous utilisons donc la fonction split pour récupérer tout après l'espace dans le header. Les erreurs générées ici s'afficheront dans le bloc catch ;
nous utilisons ensuite la fonction verify pour décoder notre token. Si celui-ci n'est pas valide, une erreur sera générée ;
nous extrayons l'ID utilisateur de notre token ;
si la demande contient un ID utilisateur, nous le comparons à celui extrait du token. S'ils sont différents, nous générons une erreur ;
dans le cas contraire, tout fonctionne et notre utilisateur est authentifié. Nous passons l'exécution à l'aide de la fonction next() .
*/

module.exports = async (req, res, next) => {

    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.SECRET);
        const userManager = new User(); 
        await userManager.exist( decodedToken.userId );
        req.userId = decodedToken.userId;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({error: error | 'Requête non authentifiée!'})
    }
}; 