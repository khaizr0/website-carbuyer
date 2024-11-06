const mongoose = require('mongoose');

let isConnected = false; 

const connectDB = async () => {
  if (isConnected) {
    console.log('Kết nối MongoDB đã tồn tại!');
    return mongoose.connection;
  }

  try {
    const db = await mongoose.connect('mongodb://localhost:27017/your_database_name', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    isConnected = db.connections[0].readyState === 1;
    console.log('Kết nối MongoDB thành công!');
    return db;
  } catch (error) {
    console.error('Lỗi kết nối MongoDB:', error);
    throw error;
  }
};

module.exports = connectDB;
