const express = require('express');
const router = express.Router();
const { getRecentProducts } = require('../controllers/ProductController');

// Route to get recent products
router.get('/recent-products', getRecentProducts);

module.exports = router;