/**
 * Created by deanroberts on 6/21/17.
 */
const con = require("../../config/connection");
const CREATE_TABLE_QUERY =
    `
CREATE TABLE user (
  ID int(11) NOT NULL AUTO_INCREMENT,
  email varchar(45) NOT NULL,
  userName varchar(45) NOT NULL,
  hash binary(100) NOT NULL,
  salt varchar(50) NOT NULL,
  PRIMARY KEY (ID),
  UNIQUE KEY email_UNIQUE (email),
  UNIQUE KEY userName_UNIQUE (userName),
  UNIQUE KEY ID_UNIQUE (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

`;


class User {
    static createTable() {
        return new Promise((resolve, reject) => {
            con.query(CREATE_TABLE_QUERY, (err, result) => {
                resolve(result);
                reject(err);
            });
        });
    }
    static login(){

    }
    static resetPassword() {

    }
}
module.exports = User;