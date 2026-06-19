const ownerModel = require("../models/owner_models");
const productModel = require("../models/product-model");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

module.exports.loginOwner = async function (req, res) {
  try {
    const { email, password } = req.body;
    const owner = await ownerModel.findOne({ email });

    if (!owner) {
      return res.render("owners/login", { error: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      return res.render("owners/login", { error: "Invalid email or password." });
    }

    const token = generateToken({ email: owner.email, id: owner._id });
    res.cookie("owner_token", token, { httpOnly: true });

    res.redirect("/owners/admin");
  } catch (err) {
    console.log(err);
    res.status(500).render("owners/login", {
      error: "Something went wrong. Please try again.",
    });
  }
};

module.exports.logoutOwner = function (req, res) {
  res.clearCookie("owner_token");
  res.redirect("/");
};

module.exports.dashboard = async function (req, res) {
  const products = await productModel.find().sort({ _id: -1 });
  res.render("owners/admin", { products, error: null });
};

module.exports.createProduct = async function (req, res) {
  try {
    const { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

    const product = await productModel.create({
      image: req.file ? `/images/uploads/${req.file.filename}` : "",
      name,
      price,
      discount: discount || 0,
      bgcolor,
      panelcolor,
      textcolor,
    });

    req.owner.products.push(product._id);
    await req.owner.save();

    res.redirect("/owners/admin");
  } catch (err) {
    console.log(err);
    const products = await productModel.find().sort({ _id: -1 });
    res.status(500).render("owners/admin", {
      products,
      error: "Could not create product. Check the fields and try again.",
    });
  }
};
