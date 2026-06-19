const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.get("/", isLoggedIn, wishlistController.getWishlist);
router.get("/toggle/:id", isLoggedIn, wishlistController.toggleWishlist);

module.exports = router;
