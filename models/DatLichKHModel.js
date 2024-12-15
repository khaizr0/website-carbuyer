const { getDB } = require('../config/db');

const DatLichKHModel = {
  // Thêm một lịch hẹn mới
  async addBooking(data) {
    try {
      const db = getDB();
      console.log(data.hoTenKH);
      let idXe = null;
      let idPhuKien = null;

      if (data.idXe && data.idXe.startsWith('XE')) {
        idXe = data.idXe;
      } else if (data.idXe && data.idXe.startsWith('PK')) {
        idPhuKien = data.idXe;
      }

      // Chuyển đổi ngày sang định dạng yyyy-mm-dd
      const formattedDate = new Date(data.ngayTao).toISOString().split('T')[0];

      const result = await db.collection('DatLichKH').insertOne({
        id: `DL${Date.now()}`,
        hoTenKH: data.hoTenKH,
        time: data.time,
        date: formattedDate, // Lưu ngày theo định dạng yyyy-mm-dd
        soDT: data.soDT,
        idXe: idXe || null,
        idPhuKien: idPhuKien || null,
        trangThai: data.trangThai || 0,
        ngayTao: new Date(),
      });

      console.log('Đặt lịch thành công:', data);
      return data;
    } catch (error) {
      console.error('Lỗi khi thêm lịch hẹn:', error);
      throw new Error('Đã xảy ra lỗi khi thêm lịch hẹn.');
    }
  },

  // Lấy tất cả các lịch hẹn
  async getAllBookings() {
    try {
      const db = getDB();
      return await db.collection('DatLichKH').find().toArray();
    } catch (error) {
      console.error('Lỗi khi lấy danh sách lịch hẹn:', error);
      throw new Error('Đã xảy ra lỗi khi lấy danh sách lịch hẹn.');
    }
  },

  // Lấy lịch hẹn theo ID
  async getBookingById(id) {
    try {
      const db = getDB();
      const booking = await db.collection('DatLichKH').findOne({ id });
      if (!booking) {
        throw new Error('Không tìm thấy lịch hẹn.');
      }
      return booking;
    } catch (error) {
      console.error('Lỗi khi lấy lịch hẹn:', error);
      throw new Error('Đã xảy ra lỗi khi lấy lịch hẹn.');
    }
  },

  // Cập nhật trạng thái lịch hẹn
  async updateBookingStatus(id, trangThai) {
    try {
      const db = getDB();
      const result = await db.collection('DatLichKH').updateOne(
        { id },
        { $set: { trangThai } }
      );

      if (result.modifiedCount === 0) {
        throw new Error('Không tìm thấy lịch hẹn hoặc trạng thái không thay đổi.');
      }

      console.log(`Cập nhật trạng thái thành công cho lịch hẹn ID: ${id}`);
      return true;
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái lịch hẹn:', error);
      throw new Error('Đã xảy ra lỗi khi cập nhật trạng thái lịch hẹn.');
    }
  },
};

module.exports = DatLichKHModel;
