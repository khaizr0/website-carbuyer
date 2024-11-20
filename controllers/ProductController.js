const { getDB } = require('../config/db');

// Hàm lấy các sản phẩm mới nhất
const getRecentProducts = async (req, res) => {
  try {
    const db = getDB();
    const productsCollection = db.collection('products');
    
    // Lấy 8 sản phẩm mới nhất, sắp xếp theo thời gian tạo (createdAt)
    const recentProducts = await productsCollection.find().sort({ createdAt: -1 }).limit(6).toArray();
    
    res.json(recentProducts);  // Trả về sản phẩm dưới dạng JSON
  } catch (error) {
    console.error('Error fetching recent products:', error);
    res.status(500).send('Có lỗi khi lấy sản phẩm');
  }
};

module.exports = { getRecentProducts };
