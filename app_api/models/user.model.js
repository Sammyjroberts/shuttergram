/**
 * Created by deanroberts on 6/21/17.
 */


const con = require("../../config/connection");
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
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
            con.query("SELECT ID, firstName, lastname, email, userName, salt, hash FROM user where userName = ?",
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
                //if not found
                if(!result[0]) {
                    throw new Error("User Not Found");
                    return;
                }
                // see if we have a matching hash
                const hashToCheckAgainst = result[0].hash;
                const saltToUse = result[0].salt;
                const resultantHash = User._generateHash(user.password, saltToUse);

                if(hashToCheckAgainst === resultantHash) {
                    const token = User._generateJWT(result[0]);
                    console.log("good job");
                    resolve(token);
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
    static _generateJWT(user) {
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);
        return jwt.sign({
            ID : user.ID,
            userName: user.userName,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            exp: parseInt(expiry.getTime() / 1000),
        }, process.env.jwt_secret);
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