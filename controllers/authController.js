const crypto = require('crypto');
const { getUserByEmail } = require('../models/User');

const login = async (req, res) => {
  const { userName, password } = req.body;

  try {
    console.log('Login Attempt:', req.body);

    // Find user by email (userName)
    const user = await getUserByEmail(userName);
    console.log('User found:', user);

    if (!user) {
      return res.status(400).send('User not found');
    }

    // Hash password with SHA-256
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    if (hashedPassword !== user.matKhau) {
      return res.status(400).send('Invalid password');
    }

    // Save userId and role to session
    req.session.userId = user.id;
    req.session.userRole = user.PhanLoai;

    // Check user type and redirect
    if (user.PhanLoai === 0) { // Admin
      return res.redirect('/admin');
    } else if (user.PhanLoai === 1) { // Employee
      return res.redirect('/employee/dashboard');
    } else {
      return res.status(403).send('Not authorized');
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).send('Internal server error');
  }
};

module.exports = { login };