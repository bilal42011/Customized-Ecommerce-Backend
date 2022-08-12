const Product = require("../models/Product");

class ProductController {
  async createProduct(req, res) {
    try {
      const product = ({
        title,
        description,
        category,
        hasSizes,
        price,
        quantity,
      } = req.body);
      product.ownerId = req.userInfo.id;

      const newProduct = await Product.create(product);
      return res.status(201).json({
        status: "success",
        product: newProduct,
      });
    } catch (err) {
      console.log(err);
      return res.status(401).json({
        status: "error",
        message: err.message,
      });
    }
  }

  async getProduct(req, res) {
    const { productId } = req.params;
    try {
      const product = await Product.findById(productId).populate("ownerId");

      return res.status(200).json({
        status: "success",
        product,
      });
    } catch (err) {
      return res.status(404).json({
        status: "Error",
        info: "Product not found",
        message: err.message,
      });
    }
  }

  async updateProduct(req, res) {
    const { productId } = req.params;

    try {
      const product = await Product.findByIdAndUpdate(productId, req.body);

      return res.status(204).json({
        status: "success",
        product,
      });
    } catch (err) {
      return res.status(404).json({
        status: "Error",
        info: "Product not found",
        message: err.message,
      });
    }
  }
}

module.exports = new ProductController();
