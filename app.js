const express = require('express');
const session = require('express-session');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/admin'); // Route admin.js
const employeeRoutes = require('./routes/employee');
const path = require('path');
const app = express();

app.set('views', path.join(__dirname, 'views'));
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'AnhEmVanPhong2032@', resave: false, saveUninitialized: true }));
app.use('/Public', express.static(path.join(__dirname, 'Public')));
app.use('/Documents', express.static(path.join(__dirname, 'Documents')));
app.use('/config', express.static(path.join(__dirname, 'config')));

// Static files
app.use('/Public', express.static('Public'));

// Routes
app.use('/', authRoutes); // Đã có route cho các tính năng đăng nhập và quên mật khẩu
app.use('/employee', employeeRoutes);

// Các route cho việc quên mật khẩu và reset mật khẩu
app.post('/forgot-password', (req, res) => {
  // Gọi controller forgotPassword
  require('./controllers/authController').forgotPassword(req, res);
});

app.post('/reset-password', (req, res) => {
  // Gọi controller resetPassword
  require('./controllers/authController').resetPassword(req, res);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'Home.html'));
});
app.get('/xedangban', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'productOption.html'));
});
app.get('/phukien', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'otherProduct.html'));
});
app.get('/tintuc', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'news.html'));
});
app.get('/forgot', (req, res) => {
  res.sendFile(path.join(__dirname, 'views','authentication', 'forgot-password.html'));
});
app.get('/reset-password', (req, res) => {
  // Chuyển hướng tới trang reset mật khẩu
  res.sendFile(path.join(__dirname, 'views','authentication', 'reset-password.html'));
});
app.get('/email-sent-success', (req, res) => {
  res.sendFile(path.join(__dirname, 'views','authentication', 'email-sent-success.html'));
});

// 404 errors
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', 'error', '404.html'));
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});