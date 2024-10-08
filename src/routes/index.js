const router = require("express").Router()
const controller = require('../controllers/index')

router.get("/welcome", controller.welcome)
router.post("/register", controller.register)
router.post("/login", controller.login)


module.exports = router