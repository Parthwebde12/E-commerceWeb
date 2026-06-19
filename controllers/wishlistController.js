const productModel = require("../models/product-model");

module.exports.toggleWishlist = async function (req, res) {
  const user = req.user;
  const id = req.params.id;
  const index = user.wishlist.indexOf(id);

  if (index > -1) {
    user.wishlist.splice(index, 1);
  } else {
    user.wishlist.push(id);
  }

  await user.save();
  res.redirect(req.get("Referrer") || "/shop");
};

module.exports.getWishlist = async function (req, res) {
  const products = await productModel.find({ _id: { $in: req.user.wishlist } });
  res.render("wishlist", { products });
};
