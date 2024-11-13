const crypto = require('crypto');
const { getUserByEmail } = require('../models/User');

const login = async (req, res) => {
  const { userName, password } = req.body;

  try {
    console.log('Login Attempt:', req.body);

    // Find user by email
    console.log('Attempting to find user by email:', userName);
    const user = await getUserByEmail(userName);

    console.log('User found:', user);

    if (!user) {
      console.log('User not found:', userName);
      return res.status(400).send('User not found');
    }

    // Hash the entered password using SHA-256
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    console.log('Password entered:', password);
    console.log('Password hash:', hashedPassword);

    // Compare hashed password with stored hashed password
    if (hashedPassword !== user.matKhau) {
      console.log('Invalid password for user:', userName);
      return res.status(400).send('Invalid password');
    }

    console.log('Password is correct');

    // Check if the user is an admin
    if (user.PhanLoai !== 0) {
      console.log('User is not an admin. PhanLoai:', user.PhanLoai);
      return res.status(403).send('Not authorized');
    }

    console.log('User is an admin. Redirecting...');
    req.session.userId = user.id;

    return res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).send('Internal server error');
  }
};

module.exports = { login };