const { getDB } = require('../config/db');
const fs = require('fs');
const path = require('path');

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
      GiaNiemYet: Number(carData.GiaNiemYet),
      soChoNgoi: carData.soChoNgoi,
      soKm: Number(carData.soKm || 0),
      mauXe: carData.mauXe || '',
      loaiCanSo: carData.loaiCanSo || '',
      hinhAnh: carData.hinhAnh || '',
      chiTietSP: carData.chiTietSP || '',
      trangThai: carData.trangThai || '',
      datLich: Number(carData.datLich) || 0,
      ngayTao: new Date(),
    };

    const result = await carCollection.insertOne(newCarData);
    console.log('Sản phẩm đã được thêm thành công:', newCarData);
    return newCarData;
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm:', error);
    throw new Error('Đã có lỗi xảy ra khi thêm sản phẩm');
  }
};

//Phụ Kiện
const addAccessoryProduct = async (accessoryData) => {
  try {
    const db = getDB();
    const accessoryCollection = db.collection('PhuKien');

    const newAccessoryData = {
      id: `PK${Date.now()}`,
      tenSP: accessoryData.tenSP,
      iDthuongHieu: accessoryData.iDthuongHieu,
      idLoai: accessoryData.idLoai,
      GiaNiemYet: Number(accessoryData.GiaNiemYet),
      chiTietSP: accessoryData.chiTietSP,
      hinhAnh: accessoryData.hinhAnh || '',
      trangThai: accessoryData.trangThai,
      datLich: Number(accessoryData.datLich) || 0,
      ngayTao: new Date(),
    };

    const result = await accessoryCollection.insertOne(newAccessoryData);
    console.log('Phụ kiện đã được thêm thành công:', newAccessoryData);
    return newAccessoryData;
  } catch (error) {
    console.error('Lỗi khi thêm phụ kiện:', error);
    throw new Error('Đã có lỗi xảy ra khi thêm phụ kiện');
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
    status: car.trangThai
  }));
  
  // Format dữ liệu phụ kiện
  const formattedAccessories = accessories.map(acc => ({
    id: acc.id,
    name: acc.tenSP,
    brand: brandMap[acc.IDthuongHieu] || 'Unknown',
    price: acc.GiaNiemYet,
    type: 'Phụ kiện',
    status: acc.trangThai
  }));
  
  // Gộp và sắp xếp tất cả sản phẩm
  return [...formattedCars, ...formattedAccessories];
};

// Hàm xóa sản phẩm theo ID
const deleteProductById = async (id) => {
  const db = getDB();
  const carCollection = db.collection('XeOto');
  const accessoryCollection = db.collection('PhuKien');

  // Tìm sản phẩm để lấy thông tin hình ảnh trước khi xóa
  let product = await carCollection.findOne({ id });
  if (!product) {
    product = await accessoryCollection.findOne({ id });
  }

  if (product && product.hinhAnh) {
    // Xóa các file ảnh
    const imageNames = product.hinhAnh.split(' || ');
    imageNames.forEach(imageName => {
      const imagePath = path.join('Public/images/Database/Products/', imageName);
      
      // Kiểm tra và xóa file
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
          console.log(`Đã xóa file ảnh: ${imageName}`);
        } catch (error) {
          console.error(`Lỗi xóa file ảnh ${imageName}:`, error);
        }
      }
    });
  }

  // Xóa sản phẩm trong các collection
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

const findProductById = async (productId) => {
  try {
      const db = getDB();
      console.log('Debug Model: Searching for Product ID:', productId);

      const carProduct = await db.collection('XeOto').findOne({ id: productId });
      const accessoryProduct = await db.collection('PhuKien').findOne({ id: productId });

      console.log('Debug Model: Car Product:', carProduct);
      console.log('Debug Model: Accessory Product:', accessoryProduct);

      if (carProduct) {
          return { product: carProduct, productType: 'XE' };
      } else if (accessoryProduct) {
          return { product: accessoryProduct, productType: 'PK' };
      }

      return { product: null, productType: null };
  } catch (error) {
      console.error('Lỗi khi tìm sản phẩm theo ID:', error);
      throw new Error('Đã có lỗi xảy ra khi tìm sản phẩm');
  }
};

module.exports = { addCarProduct, getRecentProducts, getAllProducts, deleteProductById, addAccessoryProduct, findProductById };
