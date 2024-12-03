const express = require('express');
const router = express.Router();
const { 
  createDatLichController, 
  getAllDatLichController, 
  getDatLichByIdController, 
} = require('../controllers/DatLichKHController');

// Route to create a new booking
router.post('/create', createDatLichController);

// Route to get all bookings
router.get('/h', getAllDatLichController);

// Route to get a specific booking by ID
router.get('/:id', getDatLichByIdController);


module.exports = router;
