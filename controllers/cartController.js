const productModel = require("../models/product-model");

module.exports.addToCart = async function (req, res) {
  const user = req.user;
  user.cart.push(req.params.id);
  await user.save();
  res.redirect("/shop");
};

module.exports.removeFromCart = async function (req, res) {
  const user = req.user;
  const index = user.cart.indexOf(req.params.id);
  if (index > -1) {
    user.cart.splice(index, 1);
    await user.save();
  }
  res.redirect("/cart");
};

// Cart stores repeated product ids (one entry per unit), so we
// count occurrences here to get a quantity per product.
module.exports.getCart = async function (req, res) {
  const user = req.user;

  const counts = {};
  user.cart.forEach((id) => {
    counts[id] = (counts[id] || 0) + 1;
  });

  const ids = Object.keys(counts);
  const products = await productModel.find({ _id: { $in: ids } });

  const items = products.map((product) => {
    const quantity = counts[product._id.toString()];
    const lineTotal = (product.price - product.discount) * quantity;
    return { product, quantity, lineTotal };
  });

  const total = items.reduce((sum, item) => sum + item.lineTotal, 0);

  res.render("cart", { items, total });
};

module.exports.checkout = async function (req, res) {
  const user = req.user;

  if (user.cart.length === 0) {
    return res.redirect("/cart");
  }

  const counts = {};
  user.cart.forEach((id) => {
    counts[id] = (counts[id] || 0) + 1;
  });

  const ids = Object.keys(counts);
  const products = await productModel.find({ _id: { $in: ids } });

  const items = products.map((product) => ({
    product: product._id,
    name: product.name,
    price: product.price,
    discount: product.discount,
    quantity: counts[product._id.toString()],
  }));

  const total = items.reduce(
    (sum, item) => sum + (item.price - item.discount) * item.quantity,
    0
  );

  user.orders.push({
    items,
    total,
    placedAt: new Date(),
  });
  user.cart = [];
  await user.save();

  res.redirect("/orders");
};

module.exports.getOrders = function (req, res) {
  const orders = [...req.user.orders].reverse();
  res.render("orders", { orders });
};
