// Imports des packages

const connectdb = require('../connectdb.js');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Cette partie correspond aux rêquetes SQL correspondant respectivement aux controllers Js

class UserManager {
    constructor() {
        console.log('UserManager connecté')
    }
    signup(sqlInserts) {
        let sql = 'INSERT INTO users VALUES(NULL, ?, ?, ?, ?, ?, NULL)';
        sql = mysql.format(sql, sqlInserts);
        return new Promise((resolve, reject) => {
            connectdb.query(sql, function (err, result) {
                if (err) reject({ error: 'Erreur dans l\'inscription' });
                resolve({ message: 'Nouvel utilisateur !' })
            })
        })

    }

    // Fonction de Login
    /*
    nous utilisons la fonction login de jsonwebtoken pour encoder un nouveau token ;
    ce token contient l'ID de l'utilisateur en tant que payload (les données encodées dans le token) ;
    nous utilisons une chaîne secrète de développement temporaire RANDOM_SECRET_KEY pour encoder notre token 
    (à remplacer par une chaîne aléatoire beaucoup plus longue pour la production) ;
    nous définissons la durée de validité du token à 24 heures. L'utilisateur devra donc se reconnecter au bout de 24 heures ;
    nous renvoyons le token au front-end avec notre réponse.
    */

    login(sqlInserts, password) {
        let sql = 'SELECT * FROM users WHERE email = ?';
        sql = mysql.format(sql, sqlInserts);

        return new Promise((resolve, reject) => {
            connectdb.query(sql, function (err, result) {
                if (err) reject({ err });

                // envoyer message utilisateur inexistant ?;
                
                if (!result[0]) {
                    reject({ error: 'Utilisateur introuvable !' });
                } else {
                    bcrypt.compare(password, result[0].password)
                        .then(valid => {
                            if (!valid) return reject({ error: 'Mot de passe incorrect !' });
                            resolve({
                                userId: result[0].id,
                                token: jwt.sign(
                                    {
                                        userId: result[0].id,
                                        moderator: result[0].moderator
                                    },
                                    process.env.SECRET,
                                    { expiresIn: '24h' }
                                ),
                                moderator: result[0].moderator
                            });
                        })
                        .catch(error => reject({ error }));
                }
            })

        })
    }
    seeMyProfile(sqlInserts) {
        let sql = 'SELECT firstName, lastName, email, avatar FROM users WHERE id = ?';
        sql = mysql.format(sql, sqlInserts);
        return new Promise((resolve, reject) => {
            connectdb.query(sql, function (err, result) {
                if (err) return reject({ error: 'page indisponible' });
                resolve(result);
            })

        })

    }
    updateUser(sqlInserts) {
        let sql = 'UPDATE users SET firstName = ?, lastName = ?, email = ?, avatar = ? WHERE id = ? ';
        sql = mysql.format(sql, sqlInserts);
        return new Promise((resolve, reject) => {
            connectdb.query(sql, function (err, result) {
                if (err) return reject({ error: 'fonction indisponible' });
                resolve({ message: 'Informations mises à jour !' });
            })

        })
    }
    deleteUser(sqlInserts) {
        let sql = 'DELETE FROM users WHERE id = ?';
        sql = mysql.format(sql, sqlInserts);
        return new Promise((resolve, reject) => {
            connectdb.query(sql, function (err, result) {
                if (err) return reject({ error: 'fonction indisponible' });
                resolve({ message: 'Utilisateur supprimé' });
            })
        })
    }
    async exist(userId) {
        let sql = 'SELECT COUNT(id) FROM users WHERE id=?';
        sql = mysql.format(sql,  [userId]);
        return new Promise((resolve, reject) => {
            connectdb.query(sql, function (err, result) {
                if (err) reject({ error: 'Erreur dans l\'inscription' });
                if (result[0]['COUNT(id)'] !== 1) reject({ error: 'Token invalide' });
                resolve(true);
            });
        });
    }
}

module.exports = UserManager;
