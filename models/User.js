const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  hoTen: { type: String, required: true },
  email: { type: String, required: true, unique: true },  // Đảm bảo email là duy nhất
  ngaySinh: { type: Date, required: true },
  gioiTinh: { type: String, required: true },
  cccd: { type: String, required: true },
  matKhau: { type: String, required: true },  // Mật khẩu đã được mã hóa
  anhNhanVien: { type: String },
  PhanLoai: { type: Number, required: true }  // 0: admin, 1: nhân viên
}, { timestamps: true });  // Tự động lưu ngày tạo và cập nhật

module.exports = mongoose.model('User', userSchema);
