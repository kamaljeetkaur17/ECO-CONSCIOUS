const mongoose = require('mongoose');
const Product = require('./product');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function trimProducts() {
  try {
    // Define the categories to trim
    const categories = ["men's clothing", "women's clothing", 'Shoes', 'Beauty'];

    for (const category of categories) {
      // Find the products in the specified category
      const products = await Product.find({ category }).exec();

      if (products.length > 8) {
        // Calculate the number of excess products
        const excessProductsCount = products.length - 8;

        // Sort the products and delete the excess ones
        const productsToDelete = products.slice(-excessProductsCount);
        const deleteIds = productsToDelete.map(product => product._id);

        await Product.deleteMany({ _id: { $in: deleteIds } });
      }
    }

    console.log('Successfully trimmed products in each category to 8');
  } catch (err) {
    console.error('Error trimming products:', err);
  } finally {
    mongoose.connection.close();
  }
}

trimProducts();
