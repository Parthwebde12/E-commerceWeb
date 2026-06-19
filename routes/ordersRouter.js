const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.get("/", isLoggedIn, cartController.getOrders);

module.exports = router;
