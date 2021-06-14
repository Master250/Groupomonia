// Imports

const connectdb = require('../connectdb.js');
const mysql = require('mysql');

// Cette partie correspond aux rêquetes SQL correspondant respectivement aux controllers Js

class ModManager {
    constructor() {
        console.log('ModManager connecté')
    }

    getAllPosts(){
        let sql = "SELECT posts.id, posts.userId, posts.title, posts.content, posts.imageUrl, DATE_FORMAT(posts.date, '%d/%m/%Y à %H:%i:%s') AS date, posts.likes, users.lastName, users.firstName, users.avatar FROM posts JOIN users ON posts.userId = users.id ORDER BY posts.date DESC";
        return new Promise((resolve) =>{
            connectdb.query(sql, function (err, result, fields) {
                if (err) throw err;
                resolve(result)
            });
        })
    };
    deletePost(sqlInserts){
        let sql = 'DELETE FROM posts WHERE id = ?';
        sql = mysql.format(sql, sqlInserts);
        return new Promise((resolve) =>{
            connectdb.query(sql, function (err, result, fields){
                if (err) throw err;
                resolve({message : 'Post supprimé !'});
            })
        })
    };
    getAllComments(){
        let sql = "SELECT comments.comContent, DATE_FORMAT(comments.date, '%d/%m/%Y à %H:%i:%s') AS date, comments.id, comments.userId, users.firstName, users.lastName, users.avatar FROM comments JOIN users on comments.userId = users.id ORDER BY date DESC";
        return new Promise((resolve) =>{
            connectdb.query(sql, function (err, result, fields){
                if (err) throw err;
                resolve(result);
            })
        
        })
    };
    deleteComment(sqlInserts){
        let sql = 'DELETE FROM comments WHERE id = ?';
        sql = mysql.format(sql, sqlInserts);
        return new Promise((resolve) =>{
            connectdb.query(sql, function (err, result, fields){
                if (err) throw err;
                resolve({message : 'Commentaire supprimé !'});
            })
        })
    };
    
}


module.exports = ModManager;