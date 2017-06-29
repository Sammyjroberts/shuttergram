/**
 * Created by deanroberts on 6/26/17.
 */
const Express = require("express");
const router = Express.Router();

router.get("/", function(req, res) {
    res.json({"ok" : "so you wanna do what?"})
});
router.post("/login", function(req, res) {
    res.json({"ok" :"so you wanna login?"})
});
router.post("/register", function(req, res) {
    res.json({"ok" :"so you wanna register?"})
});

module.exports = router;