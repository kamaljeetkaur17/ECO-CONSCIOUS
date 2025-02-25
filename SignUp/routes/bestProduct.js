const express = require('express');
const Product = require('../product'); // Assuming you have a Product model
const router = express.Router();

// Route to fetch the best ecoScore product from each category
router.get('/', async (req, res) => {
  try {
    const categories = ['Beauty Products', 'Clothing', 'Footwear', 'Bags'];

    // Fetch the best product for each category
    const bestProductsPromises = categories.map(async (category) => {
      const product = await Product.findOne({ category })
        .sort({ ecoScore: -1 }) // Use the correct field name
        .exec();
      if (!product) {
        console.log(`No products found in category: ${category}`);
      }
      return product;
    });

    const bestProducts = await Promise.all(bestProductsPromises);

    // Filter out null entries in case a category has no products
    const filteredBestProducts = bestProducts.filter(product => product);

    if (filteredBestProducts.length === 0) {
      return res.status(404).json({ message: 'No products found in any category' });
    }

    res.json(filteredBestProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
