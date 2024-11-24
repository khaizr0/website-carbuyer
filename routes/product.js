const express = require('express');
const router = express.Router();
const { getRecentProducts, getAllProducts, deleteProductById, createCarProduct } = require('../controllers/ProductController');

// Route to get recent products
router.get('/recent-products', getRecentProducts);

router.get('/products', getAllProducts);

router.delete('/products/:id', deleteProductById);

router.post('/products/create-car', createCarProduct);


module.exports = router;