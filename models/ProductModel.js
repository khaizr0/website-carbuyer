const { getDB } = require('../config/db');

const getRecentProducts = async () => {
  try {
    const db = getDB();
    const products = await db.collection('products')
      .find({})
      .sort({ createdAt: -1 })
      .limit(9)
      .toArray();
    return products;
  } catch (error) {
    throw new Error('Không thể lấy sản phẩm gần đây: ' + error.message);
  }
};

module.exports = { getRecentProducts };
