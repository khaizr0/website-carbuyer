const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { getTinTucData, saveTinTucData } = require('../models/TinTucModel');

// Setup multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/images'); // Specify the upload directory
    },
    filename: (req, file, cb) => {
        // Use the original name and add a timestamp to avoid duplicates
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});
const upload = multer({ storage });

// 1. List all TinTuc (Read)
router.get('/', (req, res) => {
    const tinTucData = getTinTucData();
    res.render('tinTuc/', { tinTuc: tinTucData });
});

// 2. Show form to create new TinTuc
router.get('/create', (req, res) => {
    res.render('tinTuc/create');
});

// 3. Handle form submission to create new TinTuc
router.post('/create', upload.single('anhDaiDien'), (req, res) => {
    const tinTucData = getTinTucData();
    
    const newTinTuc = {
        id: `TT00${tinTucData.length + 1}`,
        tenTT: req.body.tenTT,
        anhDaiDien: req.file.filename, // Store the filename of the uploaded image
        ngayDang: req.body.ngayDang,
        trangThai: req.body.trangThai,
        chiTietBaiViet: req.body.chiTietBaiViet
    };
    
    tinTucData.push(newTinTuc);
    saveTinTucData(tinTucData);
    res.redirect('/tinTuc');
});

// 4. Show form to edit existing TinTuc (Update)
router.get('/edit/:id', (req, res) => {
    const tinTucData = getTinTucData();
    const tinTuc = tinTucData.find(t => t.id === req.params.id);
    res.render('tinTuc/edit', { tinTuc });
});

// 5. Handle form submission to update TinTuc
router.post('/edit/:id', upload.single('anhDaiDien'), (req, res) => {
    const tinTucData = getTinTucData();
    const index = tinTucData.findIndex(t => t.id === req.params.id);
    
    // If a new file is uploaded, update the image
    if (req.file) {
        tinTucData[index].anhDaiDien = req.file.filename; // Update the filename
    }
    
    // Update other fields
    tinTucData[index] = {
        ...tinTucData[index],
        tenTT: req.body.tenTT,
        ngayDang: req.body.ngayDang,
        trangThai: req.body.trangThai,
        chiTietBaiViet: req.body.chiTietBaiViet
    };
    
    saveTinTucData(tinTucData);
    res.redirect('/tinTuc');
});

// 6. Delete a TinTuc (Delete)
router.post('/delete/:id', (req, res) => {
    const tinTucData = getTinTucData();
    const newData = tinTucData.filter(t => t.id !== req.params.id);
    saveTinTucData(newData);
    res.redirect('/tinTuc');
});

module.exports = router;
