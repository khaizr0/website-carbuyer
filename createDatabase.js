//chạy "npm run db" để tạo database

const { MongoClient } = require('mongodb');

async function createDatabase() {
    const uri = 'mongodb://localhost:27017'; // thay đổi dựa trên máy mấy ní
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('car-buyer');

        // Tạo các collection
        await db.createCollection('DatLichKH');
        await db.createCollection('LoaiPhuKien');
        await db.createCollection('PhuKien');
        await db.createCollection('ThuongHieu');
        await db.createCollection('TinTuc');
        await db.createCollection('User');
        await db.createCollection('XeOto');

        console.log('Đã tạo xong các collection');

        // Thêm dữ liệu vào từng collection
        await db.collection('DatLichKH').insertOne({
            id: "DL001",
            hoTenKH: "Nguyen Van A",
            time: "10:30",
            date: "2024-10-21",
            soDT: "0909123456",
            idXe: "XE1733646898449",
            idPhuKien: null,
            trangThai: 0
        });

        await db.collection('LoaiPhuKien').insertOne({
            id: "LPK001",
            tenLoai: "Camera"
        });

        await db.collection('PhuKien').insertOne({
            id: "PK1732901518686",
            tenSP: "Phụ kiện",
            iDthuongHieu: "brand1",
            idLoai: "LPK001",
            GiaNiemYet: 312312,
            chiTietSP: "21313131",
            hinhAnh: "camera_hanh_trinh.jpg || camera2.jpg",
            trangThai: "Mới",
            datLich: 0,
            ngayTao: 0
        });

        await db.collection('ThuongHieu').insertOne({
            id: "TH001",
            TenTH: "Toyota",
            idPhanLoaiTH: 0
        });

        await db.collection('TinTuc').insertOne({
            id: "TT001",
            tenTT: "Toyota ra mắt Camry mới",
            anhDaiDien: "camry_news.png",
            chiTietBaiViet: "Toyota chính thức ra mắt dòng Camry 2023...",
            ngayDang: "2024-10-16",
            trangThai: 1
        });

        await db.collection('User').insertOne({
            id: "U001",
            hoTen: "Nguyen Van B",
            email: "nguyenvanb@example.com",
            ngaySinh: "1990-05-10",
            gioiTinh: "Nam",
            cccd: "123456789",
            matKhau: "b9ff6b991cdc84277a42cacc41493d5a9dc867445a33999401f50efe8052a022", //Pass: hashedpassword123
            anhNhanVien: "avatar_nguyenvanb.png",
            PhanLoai: 0
        });

        await db.collection('User').insertOne({
            id: "U002",
            hoTen: "Le Thi C",
            email: "caophankhai123@gmail.com",
            ngaySinh: "1992-08-15",
            gioiTinh: "Nu",
            cccd: "987654321",
            matKhau: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92", // Pass 123456
            anhNhanVien: "avatar_lethic.png",
            PhanLoai: 1
        });
        

        await db.collection('XeOto').insertOne({
            id: "XE001",
            tenSP: "Toyota Camry",
            nguyenLieuXe: "Xăng",
            iDthuongHieu: "TH001",
            namSanXuat: 2023,
            kieuDang: "Sedan",
            GiaNiemYet: 1000000000,
            soChoNgoi: 5,
            soKm: 0,
            mauXe: "Đen",
            loaiCanSo: "automatic",
            hinhAnh: "toyota_camry.jpg || toyota2.png",
            chiTietSP: "Xe nhập khẩu, đời mới 2023.",
            trangThai: "Mới",
            datLich: 1,
            ngayTao: 0
        });

        console.log('Đã thêm dữ liệu vào các collection');
    } catch (error) {
        console.error('Lỗi:', error);
    } finally {
        await client.close();
    }
}

createDatabase();