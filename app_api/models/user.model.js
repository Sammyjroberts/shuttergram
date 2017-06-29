/**
 * Created by deanroberts on 6/21/17.
 */
const con = require("../../config/connection");
const crypto = require("crypto");
const CREATE_TABLE_QUERY = `
CREATE TABLE IF NOT EXISTS user (
  ID int(11) NOT NULL AUTO_INCREMENT,
  firstName varchar(45) NOT NULL,
  lastName varchar(45) NOT NULL,
  email varchar(45) NOT NULL,
  userName varchar(45) NOT NULL,
  hash text NOT NULL,
  salt text NOT NULL,
  status ENUM('active', 'pending', 'inactive') DEFAULT 'pending',
  PRIMARY KEY (ID),
  UNIQUE KEY email_UNIQUE (email),
  UNIQUE KEY userName_UNIQUE (userName),
  UNIQUE KEY ID_UNIQUE (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

`;
const DROP_TABLE_QUERY = `DROP TABLE IF EXISTS user`;
class User {
    /***
     *
     * @returns {Promise}
     */
    static createTable() {
        return new Promise((resolve, reject) => {
            con.query(CREATE_TABLE_QUERY, (err, result) => {
                if(err) reject(err);
                resolve(result);

            });
        });
    }

    /***
     *
     * @returns {Promise}
     */
    static dropTable() {
        return new Promise((resolve, reject) => {
            con.query(DROP_TABLE_QUERY, (err, result) => {
                if(err)reject(err);
                resolve(result);

            });
        });
    }

    /**
     *
     * @param {User} user - user to instantiate in the database
     */
    static register(user) {
        console.log("model reg");
        return new Promise((resolve, reject) => {
            user.salt = crypto.randomBytes(16).toString('hex');
            user.hash = User.generateHash(user.password, user.salt);
            con.query("INSERT into user (email, firstName, lastName, userName, salt, hash) VALUES (?, ?, ?, ?, ?, ?);",
                [user.email,user.firstName,user.lastName, user.userName, user.salt, user.hash],
                (err, response, fields) => {
                    if(err) {
                        reject(err);
                    }
                    // TODO make a better response?
                    resolve(response);
                });
        });
    }
    static getUserByName(userName) {
        return new Promise((resolve, reject) => {
            con.query("SELECT email, userName, salt, hash FROM user where userName = ?",
                userName, (err,resp,fields) => {
                    if(err) reject(err);
                    resolve(resp);
            });

        })
    }
    static login(){

    }
    static resetPassword() {

    }
    static generateHash(password, salt) {
        return crypto.pbkdf2Sync(password, salt, 1000, 512,'sha512').toString('hex');
    }
    static getSalt() {

    }
}
module.exports = User;