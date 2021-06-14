const mysql = require('mysql');
console.log('connectdb');
const connectdb = mysql.createConnection({ 
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME, 
    dialect : "MySQL"
});
connectdb.connect(function(err) { 
    if (err) throw err;
    console.log('Connecté!')
});

module.exports = connectdb;