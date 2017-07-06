/**
 * Created by deanroberts on 6/28/17.
 */
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/auth.ctrl");

/**
 *  Route for handling registration
 */
router.post("/register", ctrl.register);

/**
 * Route for handling login
 */
router.post("/login", ctrl.login);

module.exports = router;