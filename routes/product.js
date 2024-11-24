const express = require('express');
const router = express.Router();
const { getRecentProducts, getAllProducts, deleteProductById } = require('../controllers/ProductController');

// Route to get recent products
router.get('/recent-products', getRecentProducts);

router.get('/products', getAllProducts);

router.delete('/products/:id', deleteProductById);


module.exports = router;