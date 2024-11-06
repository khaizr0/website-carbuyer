const express = require('express');
const crypto = require('crypto');
const User = require('../models/User');

const router = express.Router();

router.get('/login', (req, res) => {
  res.sendFile('Admin-login.html', { root: './views/authentication' });
});

router.post('/login', async (req, res) => {
  const { userName, password } = req.body;

  try {
    // Mã hóa mật khẩu với SHA-256
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    // Tìm người dùng theo tên đăng nhập và mật khẩu
    const user = await User.findOne({ id: userName, matKhau: hashedPassword });

    if (user && user.PhanLoai === 0) {
      req.session.user = user; // Lưu thông tin người dùng vào session
      return res.redirect('/admin-dashboard'); // Chuyển đến trang admin
    } else {
      return res.status(401).send('Sai tên đăng nhập hoặc mật khẩu!');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Lỗi hệ thống, vui lòng thử lại sau.');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
