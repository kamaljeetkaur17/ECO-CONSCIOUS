// const express = require("express");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
// const router = express.Router();
// const validateLogin = require("../Middlewares/validateLogin");
// const db = require("../config/db");
// const dotenv = require("dotenv");

// dotenv.config();
// const JWT_SECRET = process.env.JWT_SECRET;

// // Ensure JWT_SECRET is loaded
// if (!JWT_SECRET) {
//   console.error("❌ JWT_SECRET is not defined. Check your .env file.");
//   process.exit(1); // Stop server if JWT_SECRET is missing
// }

// router.post("/", validateLogin, async (req, res) => {
//   const { email, password } = req.body;

//   try {
//       console.log("📥 Login Request Received:", req.body); 

//       // Execute MySQL query properly
//       const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
//       console.log("🛢 DB Query Result:", rows);

//       if (rows.length === 0) {
//         return res.status(400).json({ message: "Invalid credentials" });
//       }

//       const user = rows[0]; // Extract user object from array

//       // Compare hashed password
//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) {
//         return res.status(400).json({ message: "Invalid credentials" });
//       }

//       // Generate JWT Token
//       const token = jwt.sign(
//         { id: user.id, email: user.email }, 
//         JWT_SECRET, 
//         { expiresIn: "1h" }
//       );

//       res.json({
//         token,
//         user: {
//           id: user.id,
//           email: user.email,
//           name: user.name,
//         },
//       });

//   } catch (error) {
//       console.error("❌ Server Error in /api/login:", error);
//       res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// module.exports = router;
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const validateLogin = require("../Middlewares/validateLogin");
const db = require("../config/db");
const dotenv = require("dotenv");

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// Ensure JWT_SECRET is loaded
if (!JWT_SECRET) {
  console.error("❌ JWT_SECRET is not defined. Check your .env file.");
  process.exit(1); // Stop server if JWT_SECRET is missing
}

router.post("/", validateLogin, async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("📥 Login Request Received:", req.body);

    // Fetch user by email
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    console.log("🛢 DB Query Result:", rows);

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = rows[0]; // Extract user object from array

    // 🔹 **Check if user is verified**
    if (!user.isVerified) {
      return res.status(403).json({ message: "Email not verified. Please check your inbox." });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });

  } catch (error) {
    console.error("❌ Server Error in /api/login:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;

