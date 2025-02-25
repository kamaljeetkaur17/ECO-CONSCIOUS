// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const morgan = require("morgan");
// const db = require("./config/db");  // MySQL Database connection

// const errorHandler = require("./Middlewares/errorHandler");
// const authenticateToken = require("./Middlewares/tokenAuthentication");

// // Import Routes
// const signupRouter = require("./routes/signup");
// const loginRouter = require("./routes/login");
// const verifyRouter = require("./routes/verify");
// const profileRouter = require("./routes/profile");
// const productsRouter = require("./routes/products");
// const editRouter = require("./routes/edit");
// const deleteRouter = require("./routes/delete");
// const wishlistRouter = require("./routes/wishlist");
// const cartRouter = require("./routes/cart");
// const orderRoutes = require("./routes/order");
// const orderhistoryRoutes = require("./routes/orderhistory");
// const bestProductRouter = require("./routes/bestProduct");
// const searchRouter = require("./routes/search");
// const alternativeRouter = require("./routes/alternative");
// const feedbackRouter = require("./routes/feedback");

// dotenv.config();  // ✅ Load environment variables

// const app = express();
// const port = 3000;

// app.use(cors({ 
//   origin: "http://localhost:5173",
//   methods: ["GET", "POST", "PUT", "DELETE"], 
//   credentials: true 
// }));

// // Middlewares
// app.use(morgan("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));
// app.use("/uploads", express.static("uploads"));

// // Public Routes
// app.use("/api/signup", signupRouter);
// app.use("/api/login", loginRouter);
// app.use("/verify", verifyRouter);
// app.use("/api/search", searchRouter);
// app.use("/api/alternatives", alternativeRouter);
// app.use("/api/feedback", feedbackRouter);

// // Protected Routes (Need JWT Token)
// app.use("/api/profile", authenticateToken, profileRouter);
// app.use("/api/products", productsRouter);
// app.use("/api/edit", authenticateToken, editRouter);
// app.use("/api/delete", authenticateToken, deleteRouter);
// app.use("/api/wishlist", authenticateToken, wishlistRouter);
// app.use("/api/cart", authenticateToken, cartRouter);
// app.use("/api/order", authenticateToken, orderRoutes);
// app.use("/api/order-history", authenticateToken, orderhistoryRoutes);
// app.use("/api/bestproduct", authenticateToken, bestProductRouter);

// // Error handling middleware
// app.use(errorHandler);

// // Start Server
// app.listen(port, () => {
//     console.log(`✅ Server running at http://localhost:${port}`);
// }).on("error", (err) => {
//     console.error("❌ Server failed to start:", err);
// });
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const db = require("./config/db");
const errorHandler = require("./Middlewares/errorHandler");
const authenticateToken = require("./Middlewares/tokenAuthentication");

// Import Routes
const signupRouter = require("./routes/signup");
const loginRouter = require("./routes/login");
const verifyRouter = require("./routes/verify");
const profileRouter = require("./routes/profile");
const productsRouter = require("./routes/products");
const editRouter = require("./routes/edit");
const deleteRouter = require("./routes/delete");
const wishlistRouter = require("./routes/wishlist");
const cartRouter = require("./routes/cart");
const orderRoutes = require("./routes/order");
const orderhistoryRoutes = require("./routes/orderhistory");
const bestProductRouter = require("./routes/bestProduct");
const searchRouter = require("./routes/search");
const alternativeRouter = require("./routes/alternative");
const feedbackRouter = require("./routes/feedback");

const app = express();
const port = process.env.PORT || 3000;

// Middleware Setup
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// ✅ Public Routes
app.use("/api/signup", signupRouter);
app.use("/api/login", loginRouter);
app.use("/api/verify", verifyRouter);
app.use("/api/search", searchRouter);
app.use("/api/alternatives", alternativeRouter);
app.use("/api/feedback", feedbackRouter);

// ✅ Protected Routes (JWT Required)
app.use("/api/profile", authenticateToken, profileRouter);
app.use("/api/products", authenticateToken, productsRouter);
app.use("/api/edit", authenticateToken, editRouter);
app.use("/api/delete", authenticateToken, deleteRouter);
app.use("/api/wishlist", authenticateToken, wishlistRouter);
app.use("/api/cart", authenticateToken, cartRouter);
app.use("/api/order", authenticateToken, orderRoutes);
app.use("/api/order-history", authenticateToken, orderhistoryRoutes);
app.use("/api/bestproduct", authenticateToken, bestProductRouter);

// ❌ Handle Unknown Routes
app.use("*", (req, res) => {
  res.status(404).json({ message: "❌ Route not found" });
});

// ✅ Error Handling Middleware
app.use(errorHandler);

// ✅ Start Server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
