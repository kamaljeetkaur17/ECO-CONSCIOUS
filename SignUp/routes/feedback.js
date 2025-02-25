const express = require('express');
const multer = require('multer');
const path = require('path');
const Feedback = require('../models/Feedback'); // Ensure this model exists

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// POST feedback route
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { orderId, comments } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : null;

    const feedback = new Feedback({
      orderId,
      comments,
      photo,
    });

    await feedback.save();

    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});
router.get("/:orderId", async (req, res) => {
  try {
    const feedback = await Feedback.findOne({ orderId: req.params.orderId });
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;