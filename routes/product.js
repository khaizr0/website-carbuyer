const express = require('express');
const path = require('path');

const router = express.Router();
const { getRecentProductsController, getAllProductsController, deleteProductByIdController, createCarProduct, createAccessoryProduct 
            , getEditProductPageController, updateProduct } = require('../controllers/ProductController');

router.get('/recent-products', getRecentProductsController);

router.get('/products', getAllProductsController);

router.delete('/products/:id', deleteProductByIdController);

router.post('/products/create-car', createCarProduct);

router.post('/products/create-accessory', createAccessoryProduct);

router.get('/products/edit/:id', getEditProductPageController);

router.post('/products/update/:id', updateProduct);


module.exports = router;