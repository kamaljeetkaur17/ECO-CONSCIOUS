const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  description: { type: String },
});

module.exports = mongoose.model('Wishlist', wishlistSchema);



