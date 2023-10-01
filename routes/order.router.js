const express = require("express")
const router = express.Router()

const orderController = require("../controller/order.controller")

router.get("/showOrder", orderController.showOrder)
router.get("/byID/:id", orderController.getOrderByID)

module.exports = router
