const { getDB } = require('../config/db');

// Hàm thêm xe ô tô vào cơ sở dữ liệu
const addCarProduct = async (carData) => {
  try {
    const db = getDB();
    const carCollection = db.collection('XeOto'); 

    const newCarData = {
      id: `XE${Date.now()}`,
      tenSP: carData.tenSP,
      nguyenLieuXe: carData.nguyenLieuXe || '',
      iDthuongHieu: carData.iDthuongHieu,
      namSanXuat: carData.namSanXuat,
      kieuDang: carData.kieuDang || '',
      GiaNiemYet: carData.GiaNiemYet,
      soChoNgoi: carData.soChoNgoi,
      soKm: carData.soKm || 0,
      mauXe: carData.mauXe || '',
      loaiCanSo: carData.loaiCanSo || '',
      hinhAnh: carData.uploadImage || '',
      chiTietSP: carData.chiTietSP || '',
      trangThai: carData.trangThai || 1,
      datLich: carData.dangkilaithu ? 1 : 0,
    };

    await carCollection.insertOne(newCarData);
    console.log('Sản phẩm đã được thêm thành công!');
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm:', error);
    throw new Error('Đã có lỗi xảy ra khi thêm sản phẩm');
  }
};

// Hàm lấy các sản phẩm gần đây
const getRecentProducts = async () => {
  const db = getDB();
  const productsCollection = db.collection('XeOto');
  return await productsCollection
    .find({ trangThai: { $ne: 'Hide' } })
    .sort({ namSanXuat: -1 })
    .limit(6)
    .toArray();
};

// Hàm lấy tất cả các sản phẩm
const getAllProducts = async () => {
  const db = getDB();
  const carsCollection = db.collection('XeOto');
  const accessoriesCollection = db.collection('PhuKien');
  const brandsCollection = db.collection('ThuongHieu');
  
  const cars = await carsCollection.find({}).toArray();
  const accessories = await accessoriesCollection.find({}).toArray();
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
  return [...formattedCars, ...formattedAccessories];
};

// Hàm xóa sản phẩm theo ID
const deleteProductById = async (id) => {
  const db = getDB();
  const carCollection = db.collection('XeOto');
  const accessoryCollection = db.collection('PhuKien');

  // Tìm và xóa sản phẩm trong các collection
  const carResult = await carCollection.deleteOne({ id });
  if (carResult.deletedCount > 0) {
    return 'Xóa ô tô thành công!';
  }

  const accessoryResult = await accessoryCollection.deleteOne({ id });
  if (accessoryResult.deletedCount > 0) {
    return 'Xóa phụ kiện thành công!';
  }

  throw new Error('Sản phẩm không tồn tại.');
};

module.exports = { addCarProduct, getRecentProducts, getAllProducts, deleteProductById };
