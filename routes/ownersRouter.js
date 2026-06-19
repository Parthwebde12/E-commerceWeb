const express = require("express");
const router = express.Router();
const ownersController = require("../controllers/ownersController");
const isOwnerLoggedIn = require("../middlewares/isOwnerLoggedIn");
const upload = require("../config/multer-config");

router.get("/login", function (req, res) {
  res.render("owners/login", { error: null });
});
router.post("/login", ownersController.loginOwner);

router.get("/logout", ownersController.logoutOwner);

router.get("/admin", isOwnerLoggedIn, ownersController.dashboard);
router.post(
  "/createproducts",
  isOwnerLoggedIn,
  upload.single("image"),
  ownersController.createProduct
);

module.exports = router;
