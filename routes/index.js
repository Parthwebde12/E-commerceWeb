const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsController");
router.get("/shop/search", productsController.searchProducts);

router.get("/", function (req, res) {
  res.render("index");
});

router.get("/shop", productsController.getShop);

module.exports = router;
