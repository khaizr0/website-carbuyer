const User = require('../models/User');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
    const { userName, password } = req.body;
    
    try {
        // Log input for debugging
        console.log('Login Attempt:', req.body);

        // Find user by email (userName here is the email)
        console.log('Attempting to find user by email:', userName);
        const user = await User.findOne({ email: userName }); // Sử dụng findOne thay vì find

        // Log the result
        console.log('User found:', user);

        // If no user found, return error
        if (!user) {  // Kiểm tra nếu không tìm thấy người dùng
            console.log('User not found:', userName);
            return res.status(400).send('User not found');
        }

        // Log the password and stored hash for comparison
        console.log('Password entered:', password);
        console.log('Stored password hash:', user.matKhau);

        // Check if password matches the hashed password
        const match = await bcrypt.compare(password, user.matKhau);
        if (!match) {
            console.log('Invalid password for user:', userName);
            return res.status(400).send('Invalid password');
        }

        // Log if password is correct
        console.log('Password is correct');

        // Check if the user is an admin
        if (user.PhanLoai !== 0) {
            console.log('User is not an admin. PhanLoai:', user.PhanLoai);
            return res.status(403).send('Not authorized');
        }

        // Log that the user is an admin
        console.log('User is an admin. Redirecting...');

        // Set session or JWT token
        req.session.userId = user.id;  // Assuming you're using sessions
        console.log('Login successful, redirecting to admin dashboard...');

        return res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).send('Internal server error');
    }
};


module.exports = { login };
