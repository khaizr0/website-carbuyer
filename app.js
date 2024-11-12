const express = require('express');
const session = require('express-session');
const { connectDB } = require('./config/db'); // Correct destructuring
const authRoutes = require('./routes/admin');
const adminRoutes = require('./routes/admin'); // Fixed: assuming `adminRoutes` should be `adminRoutes`
const path = require('path');
const app = express();

app.set('views', path.join(__dirname, 'views'));
connectDB();  // Connect to the database

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'AnhEmVanPhong2032@', resave: false, saveUninitialized: true }));

// Static files
app.use('/Public', express.static('Public'));

// Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

// Homepage redirecting to login
app.get('/', (req, res) => {
  res.redirect('/auth/login');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
