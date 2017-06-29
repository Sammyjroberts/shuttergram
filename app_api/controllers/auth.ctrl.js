/**
 * Created by deanroberts on 6/28/17.
 */
const model = require("../models/user.model");
class AuthenticationCtrl {
    static login(req, res) {
        const user = {
            userName: req.body.userName,
            password: req.body.password
        };
        const testHash = User.generateHash(user.password);
    }
    static register(req, res) {
        const user = {
            firstName : req.body.firstName,
            lastName  : req.body.lastName,
            userName  : req.body.userName,
            password  : req.body.password,
            email     : req.body.email
        };
        model.register(user)
        .then(response => {
            res.json(response);
        })
        .catch(err => {
            console.log("ERROR");
            res.json(err);
        })

    }
}
module.exports = AuthenticationCtrl;