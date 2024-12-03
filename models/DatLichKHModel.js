const { getDB } = require('../config/db');

class DatLichKHModel {
  
  // Thêm một lịch hẹn mới
  static async addBooking(bookingData) {
    try {
      const db = getDB();
      const result = await db.collection('DatLichKH').insertOne({
        id: `DL${Date.now()}`,
        hoTenKH: bookingData.hoTenKH,
        time: bookingData.time,
        date: bookingData.date,
        soDT: bookingData.soDT,
        email: bookingData.email,
        tenDichVu: bookingData.tenDichVu,
        idXe: bookingData.idXe || null,
        idPhuKien: bookingData.idPhuKien || null,
        trangThai: bookingData.trangThai || 0, // 0: Pending, 1: Confirmed, 2: Cancelled
        ngayTao: new Date()
      });

      console.log('Đặt lịch thành công:', result.ops[0]);
      return result.ops[0];
    } catch (error) {
      console.error('Lỗi khi thêm lịch hẹn:', error);
      throw new Error('Đã xảy ra lỗi khi thêm lịch hẹn.');
    }
  }

  // Lấy tất cả các lịch hẹn
  static async getAllBookings() {
    try {
      const db = getDB();
      return await db.collection('DatLichKH').find().toArray();
    } catch (error) {
      console.error('Lỗi khi lấy danh sách lịch hẹn:', error);
      throw new Error('Đã xảy ra lỗi khi lấy danh sách lịch hẹn.');
    }
  }

  // Lấy lịch hẹn theo ID
  static async getBookingById(id) {
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
  }

  // Cập nhật trạng thái lịch hẹn
  static async updateBookingStatus(id, trangThai) {
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
  }

  // Xóa lịch hẹn theo ID
  static async deleteBookingById(id) {
    try {
      const db = getDB();
      const result = await db.collection('DatLichKH').deleteOne({ id });
      if (result.deletedCount === 0) {
        throw new Error('Không tìm thấy lịch hẹn để xóa.');
      }

      console.log(`Xóa lịch hẹn thành công với ID: ${id}`);
      return true;
    } catch (error) {
      console.error('Lỗi khi xóa lịch hẹn:', error);
      throw new Error('Đã xảy ra lỗi khi xóa lịch hẹn.');
    }
  }
}

module.exports = DatLichKHModel;
