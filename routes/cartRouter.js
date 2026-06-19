const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.get("/add/:id", isLoggedIn, cartController.addToCart);
router.get("/remove/:id", isLoggedIn, cartController.removeFromCart);
router.get("/", isLoggedIn, cartController.getCart);
router.post("/checkout", isLoggedIn, cartController.checkout);

module.exports = router;
