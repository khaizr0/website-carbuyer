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
            date: "2024-10-20",
            soDT: "0909123456",
            email: "nguyenvana@example.com",
            tenDichVu: "Lái thử xe",
            idXe: "XE001",
            idPhuKien: null,
            trangThai: 0
        });

        await db.collection('LoaiPhuKien').insertOne({
            id: "LPK001",
            tenLoai: "Camera"
        });

        await db.collection('PhuKien').insertOne({
            id: "PK001",
            tenSP: "Camera hành trình",
            IDthuongHieu: "TH002",
            idLoai: "LPK001",
            GiaNiemYet: 5000000,
            chiTietSP: "Camera hành trình 4K, kết nối wifi.",
            hinhAnh: "camera_hanh_trinh.png || camera2.png",
            trangThai: 1,
            datLich: 0
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
            matKhau: "b9ff6b991cdc84277a42cacc41493d5a9dc867445a33999401f50efe8052a022",
            anhNhanVien: "avatar_nguyenvanb.png",
            PhanLoai: 0
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
            loaiCanSo: "Tự động",
            hinhAnh: "toyota_camry.png || toyota2.png",
            chiTietSP: "Xe nhập khẩu, đời mới 2023.",
            trangThai: 1,
            datLich: 1
        });

        console.log('Đã thêm dữ liệu vào các collection');
    } catch (error) {
        console.error('Lỗi:', error);
    } finally {
        await client.close();
    }
}

createDatabase();