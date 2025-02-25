const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const authenticateToken = require("../Middlewares/tokenAuthentication");

router.get("/", authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate(
      "items.productId"
    );
    if (!orders) {
      return res.status(404).json({ message: "No orders found" });
    }
    res.json({ orders });
  } catch (error) {
    console.error("Error:", error); // Log the error details for debugging
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;