/**
 * Created by deanroberts on 6/28/17.
 */
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/auth.ctrl");

router.post("/register", ctrl.register);

router.post("/login", function() {

});

module.exports = router;