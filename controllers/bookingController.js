const BookingModel = require('../models/BookingModel');
const path = require('path');
const fs = require('fs');

class BookingController {
    // Đưa phương thức getTrangThaiText ra ngoài như một hàm độc lập
    static getTrangThaiText(trangThai) {
        switch(trangThai) {
            case 0: return 'Đã đặt';
            case 1: return 'Hoàn thành';
            case 2: return 'Đổi lịch';
            default: return 'Không xác định';
        }
    }

    static async renderBookingPage(req, res) {
        try {
            const bookings = await BookingModel.getAllBookings();
            const filePath = path.join(__dirname, '../views/employee/lich-hen.html');
            
            // Đọc nội dung file HTML
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Lỗi đọc file:', err);
                    return res.status(500).send('Có lỗi xảy ra khi tải trang');
                }

                // Sử dụng BookingController.getTrangThaiText thay vì this.getTrangThaiText
                const bookingRows = bookings.map(booking => `
                    <tr>
                        <td><input type="checkbox" class="row-checkbox" data-id="${booking._id}"></td>
                        <td>${booking.tenDichVu || 'Chưa xác định'}</td>
                        <td>${booking.hoTenKH || 'Chưa xác định'}</td>
                        <td>${booking.soDT || 'Chưa xác định'}</td>
                        <td>${booking.email || 'Chưa xác định'}</td>
                        <td>${booking.date || 'Chưa xác định'}</td>
                        <td>${booking.time || 'Chưa xác định'}</td>
                        <td>${BookingController.getTrangThaiText(booking.trangThai)}</td>
                        <td>
                            <form action="/lichHen/done" method="POST" style="display:inline;">
                                <input type="hidden" name="id" value="${booking._id}">
                                <button type="submit" class="btn btn-success"><i class="fas fa-check"></i></button>
                            </form>
                            <button class="btn btn-warning change-time-btn" data-id="${booking._id}" data-date="${booking.date}"
                                data-time="${booking.time}" data-bs-toggle="modal" data-bs-target="#changeTimeModal">
                                <i class="fas fa-clock"></i>
                            </button>
                            <form action="/lichHen/delete" method="POST" style="display:inline;">
                                <input type="hidden" name="id" value="${booking._id}">
                                <button type="submit" class="btn btn-danger"><i class="fas fa-trash"></i></button>
                            </form>
                        </td>
                    </tr>
                `).join('');

                // Thay thế phần tbody cũ bằng dữ liệu mới
                const modifiedHTML = data.replace(
                    /<tbody>[\s\S]*?<\/tbody>/,
                    `<tbody>${bookingRows}</tbody>`
                );

                res.send(modifiedHTML);
            });
        } catch (error) {
            console.error('Lỗi khi tải trang lịch hẹn:', error);
            res.status(500).send('Có lỗi xảy ra khi tải trang lịch hẹn');
        }
    }

    static async searchBookings(req, res) {
        try {
            const query = req.query.query;
            const bookings = await BookingModel.searchBookings(query);
            const filePath = path.join(__dirname, '../views/employee/lich-hen.html');
            
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Lỗi đọc file:', err);
                    return res.status(500).send('Có lỗi xảy ra khi tìm kiếm');
                }

                const bookingRows = bookings.map(booking => `
                    <tr>
                        <td><input type="checkbox" class="row-checkbox" data-id="${booking._id}"></td>
                        <td>${booking.tenDichVu || 'Chưa xác định'}</td>
                        <td>${booking.hoTenKH || 'Chưa xác định'}</td>
                        <td>${booking.soDT || 'Chưa xác định'}</td>
                        <td>${booking.email || 'Chưa xác định'}</td>
                        <td>${booking.date || 'Chưa xác định'}</td>
                        <td>${booking.time || 'Chưa xác định'}</td>
                        <td>${BookingController.getTrangThaiText(booking.trangThai)}</td>
                        <td>
                            <form action="/lichHen/done" method="POST" style="display:inline;">
                                <input type="hidden" name="id" value="${booking._id}">
                                <button type="submit" class="btn btn-success"><i class="fas fa-check"></i></button>
                            </form>
                            <button class="btn btn-warning change-time-btn" data-id="${booking._id}" data-date="${booking.date}"
                                data-time="${booking.time}" data-bs-toggle="modal" data-bs-target="#changeTimeModal">
                                <i class="fas fa-clock"></i>
                            </button>
                            <form action="/lichHen/delete" method="POST" style="display:inline;">
                                <input type="hidden" name="id" value="${booking._id}">
                                <button type="submit" class="btn btn-danger"><i class="fas fa-trash"></i></button>
                            </form>
                        </td>
                    </tr>
                `).join('');

                const modifiedHTML = data.replace(
                    /<tbody>[\s\S]*?<\/tbody>/,
                    `<tbody>${bookingRows}</tbody>`
                );

                res.send(modifiedHTML);
            });
        } catch (error) {
            console.error('Lỗi tìm kiếm lịch hẹn:', error);
            res.status(500).send('Có lỗi xảy ra khi tìm kiếm');
        }
    }

    static async markBookingDone(req, res) {
        try {
            const { id } = req.body;
            await BookingModel.updateBookingStatus(id, 1);
            res.redirect('/lichHen');
        } catch (error) {
            console.error('Lỗi đánh dấu hoàn thành:', error);
            res.status(500).send('Có lỗi xảy ra khi đánh dấu hoàn thành');
        }
    }

    static async changeBookingTime(req, res) {
        try {
            const { id, newDate, newTime } = req.body;
            await BookingModel.changeBookingDateTime(id, newDate, newTime);
            res.redirect('/lichHen');
        } catch (error) {
            console.error('Lỗi thay đổi thời gian:', error);
            res.status(500).send('Có lỗi xảy ra khi thay đổi thời gian');
        }
    }

    static async deleteBooking(req, res) {
        try {
            const { id } = req.body;
            await BookingModel.deleteBooking(id);
            res.redirect('/lichHen');
        } catch (error) {
            console.error('Lỗi xóa lịch hẹn:', error);
            res.status(500).send('Có lỗi xảy ra khi xóa lịch hẹn');
        }
    }
}

module.exports = BookingController;