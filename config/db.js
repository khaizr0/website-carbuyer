const mongoose = require('mongoose');

let isConnected = false; 

const connectDB = async () => {
  if (isConnected) {
    console.log('Kết nối MongoDB đã tồn tại!');
    return mongoose.connection;
  }

  try {
    const db = await mongoose.connect('mongodb://localhost:27017/car-buyer');
    isConnected = db.connections[0].readyState === 1;
    if (isConnected) {
      console.log('Kết nối MongoDB thành công!');
    } else {
      console.log('Không thể kết nối MongoDB!');
    }
    return db;
  } catch (error) {
    console.error('Lỗi kết nối MongoDB:', error);
    throw error;
  }
};

// Function to check current MongoDB connection status
const checkConnectionStatus = () => {
  if (isConnected) {
    console.log('MongoDB server is connected.');
  } else {
    console.log('MongoDB server is not connected.');
  }
};

module.exports = { connectDB, checkConnectionStatus };
