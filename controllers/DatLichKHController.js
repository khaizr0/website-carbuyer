const { addBooking, getBookingById, getAllDatLich, deleteBookingById } = require('../models/DatLichKHModel');

const createDatLichController = async (data) => {
  try {
    // Handling missing fields by setting them to null
    if (!data.khachHangId) data.khachHangId = null;
    if (!data.ngayDat) data.ngayDat = null;
    if (!data.gioDat) data.gioDat = null;
    if (!data.dichVuId) data.dichVuId = null;

    // Proceed with adding the new booking
    const newDatLich = await addDatLich(data);
    return {
      message: 'Đặt lịch thành công!',
      datLich: newDatLich,
    };
  } catch (error) {
    console.error('Lỗi khi tạo đặt lịch:', error);
    throw new Error('Đã có lỗi xảy ra. Vui lòng thử lại sau!');
  }
};

const getDatLichByIdController = async (id) => {
  try {
    const datLich = await getDatLichById(id);
    return datLich;
  } catch (error) {
    console.error('Lỗi khi lấy đặt lịch:', error);
    throw new Error('Có lỗi khi lấy đặt lịch.');
  }
};

const getAllDatLichController = async () => {
  try {
    const allDatLich = await getAllDatLich();
    return allDatLich;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đặt lịch:', error);
    throw new Error('Có lỗi khi lấy danh sách đặt lịch.');
  }
};

const deleteDatLichByIdController = async (id) => {
  try {
    const message = await deleteDatLichById(id);
    return { message };
  } catch (error) {
    console.error('Lỗi khi xóa đặt lịch:', error);
    throw new Error('Có lỗi khi xóa đặt lịch.');
  }
};

module.exports = {
  createDatLichController,
  getDatLichByIdController,
  getAllDatLichController,
  deleteDatLichByIdController,
};
