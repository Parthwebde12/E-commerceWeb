const productModel = require("../models/product-model");

module.exports.getShop = async function (req, res) {
  const products = await productModel.find().sort({ _id: -1 });
  res.render("shop", { products });
};
