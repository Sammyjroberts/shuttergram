/**
 * Created by deanroberts on 6/21/17.
 */
/**
 * User object is the user information generated from a mysql query or received from a http request .
 * @typedef {Object} User
 * @type Object
 * @property {?int} ID - users mysql ID can be null sometimes.
 * @property {string} firstName - users first Name
 * @property {string} lastName - users last name
 * @property {?string} password - js docs
 * @property {string} email - unique email address for user
 * @property {string} userName - users user name
 * @property {?string} hash - hash for users password can be null
 * @property {?string} salt - salt or random bytes used to secure password
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
    getUserName() {
        return this.userName;
    }
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
        return new Promise((resolve, reject) => {
            user.salt = crypto.randomBytes(16).toString('hex');
            user.hash = User._generateHash(user.password, user.salt);
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

    /**
     *
     * @param userName
     * @returns {Promise}
     * @private
     */
    static _getUserByName(userName) {
        return new Promise((resolve, reject) => {
            con.query("SELECT email, userName, salt, hash FROM user where userName = ?",
                userName, (err,resp,fields) => {
                    if(err) reject(err);
                    resolve(resp);
            });

        })
    }

    /**
     *
     * @param {User} user
     */
    static login(user){
        return new Promise((resolve, reject) => {
            // TODO decide if we are going to use username, or if we will use email
            // get the row from db
            this._getUserByName(user.userName)
            .then(result => {
                // see if we have a matching hash
                const hashToCheckAgainst = result[0].hash;
                const saltToUse = result[0].salt;
                const resultantHash = User._generateHash(user.password, saltToUse);

                if(hashToCheckAgainst === resultantHash) {
                    //we good
                    resolve("good job")
                }
                else {
                    reject(new Error("Incorrect Password"));
                }
            })
            .catch(err => {
                console.log(err);
                reject(err);
            })
            // test the hash
            //if success generate a token for the user
        })

    }
    static resetPassword() {

    }

    /**
     *
     * @param password
     * @param salt
     * @returns {string|String}
     * @private
     */
    static _generateHash(password, salt) {
        return crypto.pbkdf2Sync(password, salt, 1000, 512,'sha512').toString('hex');
    }
}
module.exports = User;