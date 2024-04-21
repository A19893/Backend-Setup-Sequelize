const router = require('express').Router();

router.get("/", (req, res, next) => {
    res.json({
      status: "This is the Sequelize-Setup Microservice 1.0.0",
    });
});
router.use("/users", require("./users_route"));

module.exports = router;