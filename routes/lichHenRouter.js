// routes/lichHen.js
const express = require('express');
const router = express.Router();
const lichHenModel = require('../models/LichHen'); // Import your JSON file model

// Route to get the appointments list
router.get('/', (req, res) => {
    try {
        // Fetch all appointments using the model function
        const lichHenList = lichHenModel.getAllLichHen();
        // Render the appointments page, passing the list and a null message
        res.render('lichHen/index', { lichHen: lichHenList, message: null });
    } catch (error) {
        // Handle error: render the page with an empty list and an error message
        res.render('lichHen/index', { lichHen: [], message: 'Đã có lỗi xảy ra khi lấy lịch hẹn.' });
    }
});

// Route to create a new appointment
router.post('/create', (req, res) => {
    const newLichHen = req.body; // Get the new appointment data from the request body

    try {
        lichHenModel.createLichHen(newLichHen); // Create a new appointment using the model function
        const lichHenList = lichHenModel.getAllLichHen(); // Fetch the updated list
        res.render('lichHen/index', { lichHen: lichHenList, message: 'Thêm lịch hẹn thành công!' });
    } catch (error) {
        const lichHenList = lichHenModel.getAllLichHen(); // Fetch the list again for rendering
        res.render('lichHen/index', { lichHen: lichHenList, message: 'Đã có lỗi xảy ra khi thêm lịch hẹn.' });
    }
});

// Route to change the appointment time and date
router.post('/change-time', (req, res) => {
    const { id, newTime, newDate } = req.body; // Destructure id, newTime, and newDate from the request body

    try {
        // Update the appointment time and date using the model function
        lichHenModel.updateLichHen(id, { time: newTime, date: newDate }); // Make sure your model supports updating both

        // After updating, fetch the updated list of appointments
        const lichHenList = lichHenModel.getAllLichHen();

        // Render the appointments page with the updated list and a success message
        res.render('lichHen/index', { lichHen: lichHenList, message: 'Đổi giờ và ngày thành công!' });
    } catch (error) {
        // Handle any errors that may occur
        const lichHenList = lichHenModel.getAllLichHen(); // Fetch the list again for rendering
        res.render('lichHen/index', { lichHen: lichHenList, message: 'Đã có lỗi xảy ra. Vui lòng thử lại.' });
    }
});


// Route to delete an appointment
router.post('/delete', (req, res) => {
    const { id } = req.body; // Get the id of the appointment to be deleted

    try {
        lichHenModel.deleteLichHen(id); // Delete the appointment using the model function
        const lichHenList = lichHenModel.getAllLichHen(); // Fetch the updated list
        res.render('lichHen/index', { lichHen: lichHenList, message: 'Xóa lịch hẹn thành công!' });
    } catch (error) {
        const lichHenList = lichHenModel.getAllLichHen(); // Fetch the list again for rendering
        res.render('lichHen/index', { lichHen: lichHenList, message: 'Đã có lỗi xảy ra khi xóa lịch hẹn.' });
    }
});

module.exports = router;
