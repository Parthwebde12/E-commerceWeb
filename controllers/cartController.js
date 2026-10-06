const productModel = require("../models/product-model");
const mongoose = require("mongoose");

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
    image: product.image || "",
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

module.exports.getOrders = async function (req, res) {
  const orders = [...req.user.orders].reverse().map((order) => {
    const orderData =
      typeof order.toObject === "function" ? order.toObject() : order;
    return {
      ...orderData,
      items: (order.items || []).map((item) => ({ ...item })),
    };
  });
  const productIds = orders
    .flatMap((order) => order.items)
    .filter((item) => !item.image && item.product)
    .map((item) => item.product)
    .filter((id) => mongoose.isValidObjectId(id));
  const products = productIds.length
    ? await productModel.find({ _id: { $in: productIds } }).select("_id image")
    : [];
  const productImages = new Map(
    products.map((product) => [product._id.toString(), product.image || ""])
  );

  orders.forEach((order) => {
    order.items.forEach((item) => {
      item.image = item.image || productImages.get(String(item.product)) || "";
    });
  });

  res.render("orders", { orders });
};
