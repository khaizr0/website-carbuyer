const path = require('path');
const express = require('express');
const { login } = require('../controllers/authController');
const router = express.Router();

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'authentication', 'Admin-login.html'));
});

router.post('/login', login);

module.exports = router;