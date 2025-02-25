const express = require("express");
const router = express.Router();
const Product = require("../product");
const authenticateToken = require("../Middlewares/tokenAuthentication");

router.get("/:term", authenticateToken, async (req, res) => {
    const { term } = req.params;
    try {
      const products = await Product.find({
        name: { $regex: term, $options: "i" },
      });
      res.json(products);
    } catch (error) {
      console.error("Error while fetching products:", error);  // Log the error
      res.status(500).send("Error searching for products.");
    }
  });

module.exports = router;
