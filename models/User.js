const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  hoTen: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  ngaySinh: { type: Date, required: true },
  gioiTinh: { type: String, required: true },
  cccd: { type: String, required: true, unique: true },
  matKhau: { type: String, required: true }, // SHA-256 hash
  anhNhanVien: { type: String },
  PhanLoai: { type: Number, required: true }, // 0: admin, 1: nhân viên
});

module.exports = mongoose.model('User', userSchema);
