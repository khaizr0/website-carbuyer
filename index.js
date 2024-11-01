const express = require('express');
const app = express();
const path = require('path');
const xeOtoRoutes = require('./routes/xeOtoRoutes');
const tinTucRouter = require('./routes/tinTucRouter');
const lichHenRouter = require('./routes/lichHenRouter');
const expressLayouts = require('express-ejs-layouts');

// Set view engine to EJS
app.set('view engine', 'ejs');

// Set views directory
app.set('views', path.join(__dirname, 'views'));

// Use express-ejs-layouts middleware
app.use(expressLayouts);

// Set the default layout (relative to 'views' directory)
app.set('layout', './layouts/admin_layout');  // points to 'views/layouts/layout.ejs'

// Middleware to parse incoming requests
app.use(express.urlencoded({ extended: true }));

// Static files for images and styling
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/xeOto', xeOtoRoutes);

app.use('/tinTuc', tinTucRouter);

app.use('/lichHen', lichHenRouter);

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
