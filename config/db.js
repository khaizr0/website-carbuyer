const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'car-buyer';

let db;
let client;

const connectDB = async () => {
  try {
    client = new MongoClient(uri);
    await client.connect();
    console.log('Kết nối MongoDB thành công!');
    db = client.db(dbName);
    
    // Kiểm tra kết nối bằng cách list collections
    const collections = await db.listCollections().toArray();
    console.log('Các collection hiện có:', collections.map(c => c.name));
  } catch (error) {
    console.error('Kết nối database không thành công:', error);
    process.exit(1); // Thoát ứng dụng nếu không kết nối được database
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('Database chưa được khởi tạo');
  }
  return db;
};

// Thêm hàm đóng kết nối khi ứng dụng dừng
process.on('SIGINT', async () => {
  if (client) {
    await client.close();
    console.log('Đã đóng kết nối MongoDB');
    process.exit(0);
  }
});

module.exports = { connectDB, getDB };