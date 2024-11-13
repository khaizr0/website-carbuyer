const path = require('path');
const express = require('express');
const { login } = require('../controllers/authController');
const router = express.Router();

// Handle GET request to /login
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'authentication', 'Admin-login.html'));
});

// Handle POST request to /login
router.post('/login', login);

// Route for admin dashboard (protected)
router.get('/admin', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, '..', 'views', 'admin', 'home.html'));
});

module.exports = router;