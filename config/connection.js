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

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
});

module.exports = connection;
