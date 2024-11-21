const { getDB } = require('../config/db');

const getRecentProducts = async (req, res) => {
  try {
    const db = getDB();
    const productsCollection = db.collection('XeOto');
    
    const recentProducts = await productsCollection
      .find({ trangThai: 1 })
      .sort({ namSanXuat: -1 })
      .limit(6)
      .toArray();
    
    const formattedProducts = recentProducts.map(product => {
      const imageFileName = product.hinhAnh.split('||')[0].trim();
      const imageUrl = `/Public/images/Database/Products/${imageFileName}`;

      return {
        name: product.tenSP,
        price: new Intl.NumberFormat('vi-VN', { 
          style: 'currency', 
          currency: 'VND' 
        }).format(product.GiaNiemYet),
        year: product.namSanXuat,
        mileage: product.soKm.toLocaleString('vi-VN') + ' km',
        fuelType: product.nguyenLieuXe,
        imageUrl: imageUrl
      };
    });
    
    console.log('Fetched Products:', formattedProducts);
    res.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching recent products:', error);
    res.status(500).json({ message: 'Có lỗi khi lấy sản phẩm' });
  }
};

module.exports = { getRecentProducts };