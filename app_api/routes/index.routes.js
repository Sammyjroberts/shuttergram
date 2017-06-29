/**
 * Created by deanroberts on 6/26/17.
 */
const Express = require("express");
const router = Express.Router();
const userRoutes = require("./user.routes");

router.use("/users", userRoutes);

module.exports = router;