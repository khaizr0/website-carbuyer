const express = require('express');
const session = require('express-session');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employee');
const productRoutes = require('./routes/product');
const newsRoutes = require('./routes/tinTucRoute');
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

// Routes
app.use('/', authRoutes);
app.use('/employee', employeeRoutes);
app.use('/', productRoutes);  // Điều chỉnh route ở đây
app.use('/news', newsRoutes);

// Các route cho việc quên mật khẩu và reset mật khẩu
app.post('/forgot-password', (req, res) => {
  require('./controllers/authController').forgotPassword(req, res);
});

app.post('/reset-password', (req, res) => {
  require('./controllers/authController').resetPassword(req, res);
});
app.get('/employee/tin-tuc', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'employee/tin-tuc.html'));
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