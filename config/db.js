const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'car-buyer';

let db;

const connectDB = async () => {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log('Đã kết nối database');
  } catch (error) {
    console.error('Kết nối database không thành công:', error);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('Database chưa được khởi tạo');
  }
  return db;
};

module.exports = { connectDB, getDB };