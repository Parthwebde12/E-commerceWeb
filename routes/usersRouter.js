const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

router.get("/register", function (req, res) {
  res.render("users/register", { error: null });
});
router.post("/register", usersController.registerUser);

router.get("/login", function (req, res) {
  res.render("users/login", { error: null });
});
router.post("/login", usersController.loginUser);

router.get("/logout", usersController.logoutUser);

module.exports = router;
