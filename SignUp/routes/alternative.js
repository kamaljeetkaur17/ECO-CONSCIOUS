const express = require("express");
const router = express.Router();
const Product = require("../product");
const authenticateToken = require("../Middlewares/tokenAuthentication");

router.get("/:category/:id", authenticateToken, async (req, res) => {
  const { category, id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const alternatives = await Product.find({
      category,
      id: { $ne: id },
      productType: product.productType,
      ecoScore: { $gt: product.ecoScore },
    });

    res.json(alternatives);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch alternatives", error });
  }
});

module.exports = router;