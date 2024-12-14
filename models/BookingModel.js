const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

class BookingModel {
    static async getAllBookings() {
        const db = getDB();
        const bookings = await db.collection('DatLichKH').find({}).toArray();
        
        // Xử lý để lấy tên sản phẩm và xác định loại
        const processedBookings = await Promise.all(bookings.map(async (booking) => {
            let productName = 'Chưa xác định';
            let productType = 'Chưa xác định';
    
            if (booking.idXe) {
                const xe = await db.collection('XeOto').findOne({ id: booking.idXe });
                productName = xe ? xe.tenSP : 'Không xác định';
                productType = 'Đăng kí lái thử';
            }
    
            if (booking.idPhuKien) {
                const phuKien = await db.collection('PhuKien').findOne({ id: booking.idPhuKien });
                productName = phuKien ? phuKien.tenSP : 'Không xác định';
                productType = 'Đặt trước sản phẩm';
            }
    
            // Chuyển đổi định dạng ngày
            const formattedDate = booking.date ? 
                booking.date.split('-').reverse().join('/') : 
                'Chưa xác định';
    
            return {
                ...booking,
                tenSP: productName,
                idSP: booking.idXe || booking.idPhuKien,
                loaiDichVu: productType,
                date: formattedDate
            };
        }));
    
        return processedBookings;
    }

    static async searchBookings(query) {

    }

    static async updateBookingStatus(id, status) {
        const db = getDB();
        return await db.collection('DatLichKH').updateOne(
            { _id: new ObjectId(id) },
            { $set: { trangThai: status } }
        );
    }

    static async changeBookingDateTime(id, newDate, newTime) {
        const db = getDB();
        return await db.collection('DatLichKH').updateOne(
            { _id: new ObjectId(id) },
            { $set: { 
                date: newDate, 
                time: newTime,
                trangThai: 2 // Trạng thái đã hẹn ngày khác
            } }
        );
    }

    static async deleteBooking(id) {
        const db = getDB();
        return await db.collection('DatLichKH').deleteOne({ _id: new ObjectId(id) });
    }
}

module.exports = BookingModel;