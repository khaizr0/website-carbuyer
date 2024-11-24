const express = require('express');
const router = express.Router();
const { getRecentProductsController, getAllProductsController, deleteProductByIdController, createCarProduct } = require('../controllers/ProductController');

// Route to get recent products
router.get('/recent-products', getRecentProductsController);

router.get('/products', getAllProductsController);

router.delete('/products/:id', deleteProductByIdController);

router.post('/products/create-car', createCarProduct);

module.exports = router;