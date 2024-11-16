const express = require('express');
const router = express.Router();
const { forgotPassword } = require('../controllers/authController');

// Route xử lý quên mật khẩu
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;