const express = require('express');
const router = express.Router();
const User = require('../models/user')

router.delete('/', async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from the token payload
    console.log(`Deleting profile for user ID: ${userId}`);

    const deletedProfile = await User.findByIdAndDelete(userId);
    if (!deletedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting profile', error });
  }
});

module.exports = router;
