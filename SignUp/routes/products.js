const express = require("express");
const router = express.Router();
const connection = require("../config/db"); // MySQL connection
const authenticateToken = require("../Middlewares/tokenAuthentication");

// Function to shuffle array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// ✅ GET all products with search & category filter
router.get("/", authenticateToken, (req, res) => {
  try {
    const { search, category } = req.query;
    let query = "SELECT * FROM products";
    let params = [];
    let conditions = [];

    if (category) {
      conditions.push("category = ?");
      params.push(category);
    }
    if (search) {
      conditions.push("name LIKE ?");
      params.push(`%${search}%`);
    }
    if (conditions.length) {
      query += " WHERE " + conditions.join(" AND ");
    }

    connection.query(query, params, (err, results) => {
      if (err) {
        console.error("Database Query Error:", err);
        return res.status(500).json({ message: "Database error", error: err.message });
      }
      
      res.json(shuffleArray(results)); // Shuffling before sending response
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ GET a single product by ID
router.get("/:id", authenticateToken, (req, res) => {
  try {
    const productId = parseInt(req.params.id, 10);

    connection.query("SELECT * FROM products WHERE id = ?", [productId], (err, results) => {
      if (err) {
        console.error("Database Query Error:", err);
        return res.status(500).json({ message: "Database error", error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(results[0]);
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
