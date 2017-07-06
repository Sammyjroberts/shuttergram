/**
 * Created by deanroberts on 6/28/17.
 */
const model = require("../models/user.model");
const helpers = require("../helpers/ctrl.helpers");

class AuthenticationCtrl {
    /**
     *
     * @param req
     * @param res
     */
    static login(req, res) {
        //TODO authenticate req.body
        const user = {
            userName: req.body.userName,
            password: req.body.password
        };
        model.login(user)
        .then(result => {
            console.log("OH BOY");
            helpers.sendJSONResponse(res, result);
        })
        .catch(err => {
            helpers.sendJSONError(res,err);
        })
    }

    /**
     *
     * @param req
     * @param res
     */
    static register(req, res) {
        //TODO authenticate req.body
        const user = {
            firstName : req.body.firstName,
            lastName  : req.body.lastName,
            userName  : req.body.userName,
            password  : req.body.password,
            email     : req.body.email
        };
        model.register(user)
        .then(result => {
            helpers.sendJSONResponse(res, result, 201)
        })
        .catch(err => {
            helpers.sendJSONError(res,err);
        })

    }
}
module.exports = AuthenticationCtrl;