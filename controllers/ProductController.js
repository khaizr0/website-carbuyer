const { getDB } = require('../config/db');
const multer = require('multer');
const path = require('path');


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

const getAllProducts = async (req, res) => {
  try {
    const db = getDB();
    
    // Lấy danh sách ô tô
    const carsCollection = db.collection('XeOto');
    const cars = await carsCollection.find({}).toArray();
    
    // Lấy danh sách phụ kiện
    const accessoriesCollection = db.collection('PhuKien');
    const accessories = await accessoriesCollection.find({}).toArray();
    
    // Lấy thông tin thương hiệu
    const brandsCollection = db.collection('ThuongHieu');
    const brands = await brandsCollection.find({}).toArray();
    
    // Map brands để dễ tra cứu
    const brandMap = brands.reduce((acc, brand) => {
      acc[brand.id] = brand.TenTH;
      return acc;
    }, {});
    
    // Format dữ liệu ô tô
    const formattedCars = cars.map(car => ({
      id: car.id,
      name: car.tenSP,
      brand: brandMap[car.iDthuongHieu] || 'Unknown',
      price: car.GiaNiemYet,
      type: 'Ô tô',
      status: car.trangThai === 1 ? 'Đang đăng' : 'Đã ẩn'
    }));
    
    // Format dữ liệu phụ kiện
    const formattedAccessories = accessories.map(acc => ({
      id: acc.id,
      name: acc.tenSP,
      brand: brandMap[acc.IDthuongHieu] || 'Unknown',
      price: acc.GiaNiemYet,
      type: 'Phụ kiện',
      status: acc.trangThai === 1 ? 'Đang đăng' : 'Đã ẩn'
    }));
    
    // Gộp và sắp xếp tất cả sản phẩm
    const allProducts = [...formattedCars, ...formattedAccessories];
    
    res.json(allProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Có lỗi khi lấy danh sách sản phẩm' });
  }
};

const deleteProductById = async (req, res) => {
  try {
      const { id } = req.params;
      const db = getDB();
      const carCollection = db.collection('XeOto');
      const accessoryCollection = db.collection('PhuKien');

      // Tìm và xóa sản phẩm trong các collection
      const carResult = await carCollection.deleteOne({ id });
      if (carResult.deletedCount > 0) {
          return res.status(200).json({ message: 'Xóa ô tô thành công!' });
      }

      const accessoryResult = await accessoryCollection.deleteOne({ id });
      if (accessoryResult.deletedCount > 0) {
          return res.status(200).json({ message: 'Xóa phụ kiện thành công!' });
      }

      return res.status(404).json({ message: 'Sản phẩm không tồn tại.' });
  } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ message: 'Có lỗi khi xóa sản phẩm.' });
  }
};

module.exports = { getRecentProducts, getAllProducts, deleteProductById, addProduct, upload };