const express = require("express")
const router = express.Router()

const boostController = require("../controller/boost.controller")

router.get("/showBoost", boostController.showBoost)
router.get("/byID/:id", boostController.getBoostByID)


module.exports = router