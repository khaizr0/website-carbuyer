//chạy "npm run db" để tạo database

const { MongoClient } = require('mongodb');

async function createDatabase() {
    const uri = 'mongodb://localhost:27017'; // thay đổi dựa trên máy mấy ní
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('car-buyer');

        // // Tạo các collection
        // await db.createCollection('DatLichKH');
        // await db.createCollection('LoaiPhuKien');
        // await db.createCollection('PhuKien');
        // await db.createCollection('ThuongHieu');
        // await db.createCollection('TinTuc');
        // await db.createCollection('User');
        // await db.createCollection('XeOto');

        // console.log('Đã tạo xong các collection');

        // Thêm dữ liệu vào từng collection
        // await db.collection('DatLichKH').insertOne({
        //     id: "DL001",
        //     hoTenKH: "Nguyen Van A",
        //     time: "10:30",
        //     date: "2024-10-21",
        //     soDT: "0909123456",
        //     idXe: "XE1733646898449",
        //     idPhuKien: null,
        //     trangThai: 0
        // });

        await db.collection('LoaiPhuKien').insertMany([
            { id: "LPK001", tenLoai: "Camera" },
            { id: "LPK002", tenLoai: "Cảm biến" },
            { id: "LPK003", tenLoai: "Loa Bluetooth" },
            { id: "LPK004", tenLoai: "Gương cầu lồi" }
        ]);

        // await db.collection('PhuKien').insertMany([
        //     {
        //         id: "PK1732901518686",
        //         tenSP: "Camera hành trình",
        //         iDthuongHieu: "TH001",
        //         idLoai: "LPK001",
        //         GiaNiemYet: 312312,
        //         chiTietSP: "Camera hành trình full HD.",
        //         hinhAnh: "camera_hanh_trinh.jpg",
        //         trangThai: "Mới",
        //         datLich: 0,
        //         ngayTao: 0
        //     },
        //     {
        //         id: "PK002",
        //         tenSP: "Cảm biến áp suất lốp",
        //         iDthuongHieu: "TH002",
        //         idLoai: "LPK002",
        //         GiaNiemYet: 1500000,
        //         chiTietSP: "Cảm biến chính xác, tích hợp hiển thị màn hình.",
        //         hinhAnh: "cam_bien_ap_suat_lop.jpg",
        //         trangThai: "Mới",
        //         datLich: 0,
        //         ngayTao: 0
        //     }
        // ]);

        await db.collection('ThuongHieu').insertMany([
            { id: "TH001", TenTH: "Toyota", idPhanLoaiTH: 0 },
            { id: "TH002", TenTH: "Honda", idPhanLoaiTH: 0 },
            { id: "TH003", TenTH: "BMW", idPhanLoaiTH: 0 },
            { id: "TH004", TenTH: "Mercedes", idPhanLoaiTH: 0 }
        ]);

        await db.collection('TinTuc').insertMany([
            {
                id: "TT001",
                tenTT: "Toyota ra mắt Camry mới",
                anhDaiDien: "camry_news.png",
                chiTietBaiViet: "Toyota chính thức ra mắt dòng Camry 2023...",
                ngayDang: "2024-10-16",
                trangThai: 1
            },
            {
                id: "TT002",
                tenTT: "Honda Civic 2024 có gì mới?",
                anhDaiDien: "civic_news.png",
                chiTietBaiViet: "Honda đã cập nhật dòng Civic mới với nhiều tính năng nổi bật...",
                ngayDang: "2024-11-01",
                trangThai: 1
            }
        ]);

        // await db.collection('User').insertOne({
        //     id: "U001",
        //     hoTen: "Nguyen Van B",
        //     email: "nguyenvanb@example.com",
        //     ngaySinh: "1990-05-10",
        //     gioiTinh: "Nam",
        //     cccd: "123456789",
        //     matKhau: "b9ff6b991cdc84277a42cacc41493d5a9dc867445a33999401f50efe8052a022", //Pass: hashedpassword123
        //     anhNhanVien: "avatar_nguyenvanb.png",
        //     PhanLoai: 0
        // });

        // await db.collection('User').insertOne({
        //     id: "U002",
        //     hoTen: "Le Thi C",
        //     email: "caophankhai123@gmail.com",
        //     ngaySinh: "1992-08-15",
        //     gioiTinh: "Nu",
        //     cccd: "987654321",
        //     matKhau: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92", // Pass 123456
        //     anhNhanVien: "avatar_lethic.png",
        //     PhanLoai: 1
        // });
        

        // await db.collection('XeOto').insertMany([
        //     {
        //         id: "XE001",
        //         tenSP: "Toyota Camry",
        //         nguyenLieuXe: "Xăng",
        //         iDthuongHieu: "TH001",
        //         namSanXuat: 2023,
        //         kieuDang: "Sedan",
        //         GiaNiemYet: 1000000000,
        //         soChoNgoi: 5,
        //         soKm: 0,
        //         mauXe: "Đen",
        //         loaiCanSo: "automatic",
        //         hinhAnh: "toyota_camry.jpg",
        //         chiTietSP: "Xe nhập khẩu, đời mới 2023.",
        //         trangThai: "Mới",
        //         datLich: 1,
        //         ngayTao: 0
        //     },
        //     {
        //         id: "XE002",
        //         tenSP: "Honda CR-V",
        //         nguyenLieuXe: "Xăng",
        //         iDthuongHieu: "TH002",
        //         namSanXuat: 2023,
        //         kieuDang: "SUV",
        //         GiaNiemYet: 900000000,
        //         soChoNgoi: 7,
        //         soKm: 0,
        //         mauXe: "Trắng",
        //         loaiCanSo: "automatic",
        //         hinhAnh: "honda_crv.jpg",
        //         chiTietSP: "Xe gia đình, đời mới 2023.",
        //         trangThai: "Mới",
        //         datLich: 0,
        //         ngayTao: 0
        //     }
        // ]);

        console.log('Đã thêm dữ liệu vào các collection');
    } catch (error) {
        console.error('Lỗi:', error);
    } finally {
        await client.close();
    }
}

createDatabase();