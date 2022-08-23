const Product = require("../models/Product");

class CartController {
  async calculate(req, res) {
    try {
      const products = req.body;

      if (!products || !products.length) throw new Error("Empty Products List");

      const ids = products.map((i) => i._id);
      const cartProducts = await Product.find({ _id: { $in: ids } }).select(
        "title price images quantity"
      );
      let total = 0;
      cartProducts.forEach((product, i) => {
        const item = products.find((e) => e._id == product._id);
        if (item.quantity > product.quantity) {
          throw new Error(`Not enough stock available for '${product.title}'`);
        } else {
          total += product.price * item.quantity;
        }
        product.quantity = item.quantity;
      });

      return res.status(200).json({
        status: "success",
        total,
        products: cartProducts,
      });
    } catch (err) {
      console.error(err);
      return res.status(404).json({
        status: "error",
        message: err.message,
      });
    }
  }
}

module.exports = new CartController();
