const express = require('express');
const session = require('express-session');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employee');
const productRoutes = require('./routes/product');
const newsRoutes = require('./routes/tinTucRoute');
const path = require('path');
const multer = require('multer');
const app = express();

app.set('views', path.join(__dirname, 'views'));
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'AnhEmVanPhong2032@', resave: false, saveUninitialized: true }));
app.use('/Public', express.static(path.join(__dirname, 'Public')));
app.use('/Documents', express.static(path.join(__dirname, 'Documents')));
app.use('/config', express.static(path.join(__dirname, 'config')));

// Routes
app.use('/', authRoutes);
app.use('/employee', employeeRoutes);
app.use('/product', productRoutes);
app.use('/news', newsRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'Home.html'));
});
app.get('/xedangban', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'productOption.html'));
});
app.get('/phukien', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'otherProduct.html'));
});


// 404 errors
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', 'error', '404.html'));
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});