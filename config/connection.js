/**
 * Created by deanroberts on 6/21/17.
 */
const mysql      = require('mysql');
const connection = mysql.createConnection({
    host     : process.env.mysql_host,
    user     : process.env.mysql_user,
    password : process.env.mysql_pass,
    database : process.env.db
});

connection.connect();

module.exports = connection;
