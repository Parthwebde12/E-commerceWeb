const userModel = require("../models/user-models");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

module.exports.registerUser = async function (req, res) {
  try {
    const { fullname, email, password, contact } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.render("users/register", {
        error: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      fullname,
      email,
      contact,
      password: hashedPassword,
    });

    const token = generateToken({ email: user.email, id: user._id });
    res.cookie("token", token, { httpOnly: true });

    res.redirect("/shop");
  } catch (err) {
    console.log(err);
    res.status(500).render("users/register", {
      error: "Something went wrong. Please try again.",
    });
  }
};

module.exports.loginUser = async function (req, res) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.render("users/login", { error: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("users/login", { error: "Invalid email or password." });
    }

    const token = generateToken({ email: user.email, id: user._id });
    res.cookie("token", token, { httpOnly: true });

    res.redirect("/shop");
  } catch (err) {
    console.log(err);
    res.status(500).render("users/login", {
      error: "Something went wrong. Please try again.",
    });
  }
};

module.exports.logoutUser = function (req, res) {
  res.clearCookie("token");
  res.redirect("/");
};
