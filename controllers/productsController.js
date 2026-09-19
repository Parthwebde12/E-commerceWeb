module.exports.searchProducts = async (req, res) => {
  try {
    const { query, category, minPrice, maxPrice } = req.query;
    let filter = {};

    if (query) {
      filter.name = { $regex: query, $options: "i" };
    }
    if (category) {
      filter.category = category;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await productModel.find(filter);
    res.render("shop", { products, query, category, minPrice, maxPrice });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
};