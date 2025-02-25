// const express = require("express");
// const router = express.Router();
// const validateSignup = require("../Middlewares/validateSignup");
// const hashPassword = require("../Middlewares/hashPassword");
// const db = require("../config/db");
// const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");
// const dotenv = require("dotenv");

// dotenv.config();

// const JWT_SECRET = process.env.JWT_SECRET;
// const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

// // Nodemailer setup
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// router.post("/", validateSignup, hashPassword, async (req, res) => {
//   const { username, fullname, email, password, address, phoneNumber } = req.body;

//   try {
//     // Check if username or email already exists
//     const [existingUsers] = await db.execute(
//       "SELECT id, isVerified FROM users WHERE username = ? OR email = ?",
//       [username, email]
//     );

//     if (existingUsers.length > 0) {
//       if (existingUsers[0].isVerified === 0) {
//         return res.status(400).json({ message: "Email already registered but not verified. Check your inbox." });
//       }
//       return res.status(400).json({ message: "Username or Email is already taken" });
//     }

//     // Insert new user into database
//     const insertQuery =
//       "INSERT INTO users (username, fullname, email, password, address, phoneNumber, isVerified) VALUES (?, ?, ?, ?, ?, ?, ?)";
//     await db.execute(insertQuery, [username, fullname, email, password, address, phoneNumber, 0]); 

//     // Generate email verification token
//     const verificationToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
//     const verificationUrl = `${BASE_URL}/verify?token=${verificationToken}`;

//     // Send verification email
//     await transporter.sendMail({
//       from: `"EcoConsious" <${process.env.EMAIL}>`,
//       to: email,
//       subject: "Verify your email",
//       html: `
//         <div style="font-family: Arial, sans-serif; line-height: 1.6;">
//           <h3>Hi ${fullname},</h3>
//           <p>Welcome to <strong>EcoConsious</strong>! 🎉</p>
//           <p>To start using your account, please verify your email by clicking the button below:</p>
//           <p><a href="${verificationUrl}" style="background-color: #28a745; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a></p>
//           <p>If you did not sign up, you can ignore this email.</p>
//           <p>Best,</p>
//           <p>The EcoConsious Team</p>
//         </div>
//       `,
//     });

//     res.status(200).json({ message: "Signup successful. Please verify your email." });

//   } catch (error) {
//     console.error("Signup Error:", error);
//     res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const validateSignup = require("../Middlewares/validateSignup");
const hashPassword = require("../Middlewares/hashPassword");
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

router.post("/", validateSignup, hashPassword, async (req, res) => {
  const { username, fullname, email, password, address, phoneNumber } = req.body;

  try {
    // Check if username or email already exists
    const [existingUsers] = await db.execute(
      "SELECT id, isVerified FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingUsers.length > 0) {
      if (existingUsers[0].isVerified === 0) {
        return res.status(400).json({ message: "Email already registered but not verified. Check your inbox." });
      }
      return res.status(400).json({ message: "Username or Email is already taken" });
    }

    // Insert new user into database (not verified yet)
    const insertQuery =
      "INSERT INTO users (username, fullname, email, password, address, phoneNumber, isVerified) VALUES (?, ?, ?, ?, ?, ?, ?)";
    await db.execute(insertQuery, [username, fullname, email, password, address, phoneNumber, 0]); 

    // Generate email verification token (valid for 1 hour)
    const verificationToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
    const verificationUrl = `${BASE_URL}/api/verify?token=${verificationToken}`;

    // Send verification email
    await transporter.sendMail({
      from: `"EcoConsious" <${process.env.EMAIL}>`,
      to: email,
      subject: "Verify your email",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h3>Hi ${fullname},</h3>
          <p>Welcome to <strong>EcoConsious</strong>! 🎉</p>
          <p>To start using your account, please verify your email by clicking the button below:</p>
          <p><a href="${verificationUrl}" style="background-color: #28a745; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a></p>
          <p>If you did not sign up, you can ignore this email.</p>
          <p>Best,</p>
          <p>The EcoConsious Team</p>
        </div>
      `,
    });

    res.status(200).json({ message: "Signup successful. Please verify your email." });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// ✅ Route to Verify Email
router.get("/verify", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const email = decoded.email;

    // Update isVerified to 1 in database
    const [result] = await db.execute("UPDATE users SET isVerified = 1 WHERE email = ?", [email]);

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    res.status(200).json({ message: "Email verified successfully! You can now log in." });

  } catch (error) {
    console.error("Email verification error:", error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

module.exports = router;
