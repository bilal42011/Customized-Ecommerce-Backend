const Product = require("../models/Product");

const createProduct = async (req, res) => {
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
};

const getProduct = (req, res) => {};

const updateProduct = (req, res) => {};

module.exports = { createProduct, getProduct, updateProduct };
