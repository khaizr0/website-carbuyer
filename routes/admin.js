const path = require('path');
const express = require('express');
const { login, forgotPassword, resetPassword, resetPasswordPage } = require('../controllers/authController');
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

// Route cho việc quên mật khẩu
router.post('/forgot-password', forgotPassword);

// Route trang reset mật khẩu
router.get('/reset-password/:email/:token', resetPasswordPage);

// Route xử lý đặt lại mật khẩu
router.post('/reset-password/:email/:token', resetPassword);

module.exports = router;