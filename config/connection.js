/**
 * Created by deanroberts on 6/21/17.
 */
const mysql = require('mysql');



const connection = mysql.createConnection({
    host     : process.env.mysql_host,
    user     : process.env.mysql_user,
    password : process.env.mysql_pass,
    database : process.env.db
});
/***
 *
 * @param {String} env this is the current environment
 */
function sync(env) {

    const models = [];
    models.push(require("../app_api/models/user.model"));

    const promises = [];

    models.forEach( model => {
        let todoPromise;
        if(env === 'prod') {
            todoPromise = new Promise((resolve, reject) => {
                model.createTable()
                .then(resp => {
                    resolve(resp);
                })
                .catch(err => {
                    reject(err);
                })
            })
        }
        else {
            todoPromise = new Promise((resolve, reject) => {
                console.log("promise");
                model.dropTable()
                .then(resp => {
                    return model.createTable()
                })
                .then(resp => {
                    resolve(true);
                })
                .catch(err => {
                    reject(err);
                })

            })
        }
        promises.push(todoPromise);
    });

    Promise.all(promises)
    .then(resp => {
        console.log("Sync Complete");
    })
    .catch(err => {
        throw err;
    })
}

connection.connect(err => {
    console.log("connected");
    if (err) throw err;
    sync("dev");
});


module.exports = connection;
