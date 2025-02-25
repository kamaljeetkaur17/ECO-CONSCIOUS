// const express = require('express');
// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// const db = require('../config/db'); // Ensure this is your MySQL database connection

// dotenv.config();

// const router = express.Router();
// const JWT_SECRET = process.env.JWT_SECRET;

// router.get('/verify', async (req, res) => {
//   const { token } = req.query;

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [decoded.email]);

//     if (users.length === 0) {
//       return res.status(400).send("<h2>Invalid token or user does not exist.</h2>");
//     }

//     const user = users[0];

//     if (user.isVerified) {
//       return res.status(200).send("<h2>Email is already verified. You can now log in.</h2>");
//     }

//     // Update isVerified to 1
//     await db.execute("UPDATE users SET isVerified = 1 WHERE email = ?", [decoded.email]);

//     // Send an HTML success page
//     return res.send(`
//       <div style="font-family: Arial, sans-serif; text-align: center;">
//         <h2>Email Verified Successfully!</h2>
//         <p>You can now log in.</p>
//         <a href="http://localhost:3000/login" style="padding: 10px 15px; background: #28a745; color: white; text-decoration: none; border-radius: 5px;">Login Now</a>
//       </div>
//     `);
//   } catch (error) {
//     console.error(error);
//     return res.status(400).send("<h2>Invalid or expired token.</h2>");
//   }
// });

// module.exports = router;

const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const db = require("../config/db"); // MySQL connection

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.get("/verify", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send("<h2>Invalid or expired token.</h2>");
  }

  try {
    // Decode JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    const email = decoded.email;

    // Fetch user by email
    const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(400).send("<h2>Invalid token or user does not exist.</h2>");
    }

    const user = users[0];

    if (user.isVerified) {
      return res.status(200).send(`
        <div style="font-family: Arial, sans-serif; text-align: center;">
          <h2>Email is already verified.</h2>
          <p>You can now log in.</p>
          <a href="http://localhost:3000/login" style="padding: 10px 15px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">Login Now</a>
        </div>
      `);
    }

    // Update isVerified status
    await db.execute("UPDATE users SET isVerified = 1 WHERE email = ?", [email]);

    return res.send(`
      <div style="font-family: Arial, sans-serif; text-align: center;">
        <h2>🎉 Email Verified Successfully!</h2>
        <p>You can now log in.</p>
        <a href="http://localhost:3000/login" style="padding: 10px 15px; background: #28a745; color: white; text-decoration: none; border-radius: 5px;">Login Now</a>
      </div>
    `);
  } catch (error) {
    console.error("Verification Error:", error);
    return res.status(400).send("<h2>Invalid or expired token.</h2>");
  }
});

module.exports = router;
