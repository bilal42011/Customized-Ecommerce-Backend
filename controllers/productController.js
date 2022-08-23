const Product = require("../models/Product");
const User = require("../models/User");

class ProductController {
  async createProduct(req, res) {
    try {
      const { title, description, category, hasSizes, price, quantity } =
        req.body;
      const product = {
        title,
        description,
        category,
        hasSizes,
        price,
        quantity,
      };
      product.ownerId = req.userInfo.id;
      product.images = req.files.map((elem) => {
        return { filename: elem.filename, path: elem.path };
      });
      const newProduct = await Product.create(product);
      const user = await User.findByIdAndUpdate(req.userInfo.id, {
        $push: { products: newProduct._id },
      });
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
    const { title, description, category, hasSizes, price, quantity } =
      req.body;

    try {
      const product = await Product.findByIdAndUpdate(productId, {
        title,
        description,
        category,
        hasSizes,
        price,
        quantity,
      });

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
