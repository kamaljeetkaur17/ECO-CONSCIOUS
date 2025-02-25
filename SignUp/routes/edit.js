const express = require('express');
const router = express.Router();
const User = require('../models/user'); 

// PUT route to update user details using token info
router.put('/', async (req, res) => {
  const { username, fullname, email, address, phoneNumber } = req.body;
  const userId = req.user.id; // Use the ID from the decoded token

  try {
    // Find the user by ID (from token) and update their details
    const updatedUser = await User.findByIdAndUpdate(
      userId, // Use userId from token
      { username, fullname, email, address, phoneNumber },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser); // Send the updated user details
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
