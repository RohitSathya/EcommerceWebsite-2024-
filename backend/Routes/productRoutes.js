const express = require('express');
const Product = require('../Models/ProductModel'); // Adjust path as necessary
const router = express.Router();

// Add product
router.post('/add', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.json(savedProduct);
  } catch (err) {
    res.status(400).json({ error: 'Error adding product' });
  }
});

// Get all products
router.get('/all', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: 'Error fetching products'});
  }
});

// Update product by ID
router.put('/update/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: 'Error updating product' });
  }
});

// Delete product by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Error deleting product' });
  }
});

module.exports = router;
