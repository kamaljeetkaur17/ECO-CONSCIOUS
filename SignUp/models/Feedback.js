const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  comments: { type: String, required: true },
  photo: { type: String },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;