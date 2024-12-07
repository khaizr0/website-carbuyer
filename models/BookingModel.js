const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

class BookingModel {
    static async getAllBookings() {
        const db = getDB();
        return await db.collection('DatLichKH').find({}).toArray();
    }

    static async searchBookings(query) {
        const db = getDB();
        return await db.collection('DatLichKH').find({
            $or: [
                { hoTenKH: { $regex: query, $options: 'i' } },
                { soDT: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { tenDichVu: { $regex: query, $options: 'i' } }
            ]
        }).toArray();
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