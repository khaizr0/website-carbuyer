const { getDB } = require('../config/db');

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

module.exports = { addCarProduct };
