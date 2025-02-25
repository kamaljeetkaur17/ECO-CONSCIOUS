const express = require('express');
const router = express.Router();
const CartModel = require('../models/cart'); // Adjust path if needed
const authenticateToken = require('../Middlewares/tokenAuthentication'); // Adjust path if needed

// Get all cart items for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log("Fetching cart for user ID:", req.user.id); // Debug log for user ID
    const cartItems = await CartModel.find({ userId: req.user.id });
    console.log("cart items fetched:", cartItems); // Debug log for items
    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error); // Log error for debugging
    res.status(500).json({ message: 'Server error while fetching cart items' });
  }
});

// Add item to cart
router.post('/add', authenticateToken, async (req, res) => {
  const { productId, name, price, image, description, quantity } = req.body;

  // Validate quantity
  if (!quantity || quantity < 1 || quantity > 20) {
    return res.status(400).json({ message: 'Quantity must be between 1 and 20' });
  }

  try {
    const existingItem = await CartModel.findOne({ userId: req.user.id, productId });
    if (existingItem) {
      return res.status(400).json({ message: 'Item already in cart' });
    }

    const newCartItem = new CartModel({
      userId: req.user.id,
      productId,
      name,
      price,
      image,
      description,
      quantity, // Store the selected quantity
    });

    await newCartItem.save();
    res.status(201).json({ message: 'Item added to cart' });
  } catch (error) {
    console.error('Error adding item to cart:', error); // Log error for debugging
    res.status(500).json({ message: 'Server error while adding item to cart' });
  }
});


// Remove item from cart
router.delete('/remove/:productId', authenticateToken, async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id; // Assuming req.user.id is populated by the JWT middleware
  console.log('Removing item for userId:', userId, 'and productId:', productId); // Debugging log

  try {
    const deletedItem = await CartModel.findOneAndDelete({
      userId: userId,
      productId: productId
    });

    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Server error while removing item from cart' });
  }
});

module.exports = router;