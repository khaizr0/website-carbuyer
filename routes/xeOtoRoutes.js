const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Load JSON files
const xeOtoFile = path.join(__dirname, '../data/json/XeOto.json');
const thuongHieuFile = path.join(__dirname, '../data/json/ThuongHieu.json');

// Read data from files
const getXeOtoData = () => JSON.parse(fs.readFileSync(xeOtoFile, 'utf-8'));
const getThuongHieuData = () => JSON.parse(fs.readFileSync(thuongHieuFile, 'utf-8'));

// 1. List all XeOto (Read)
router.get('/', (req, res) => {
    const xeOtoData = getXeOtoData();
    const thuongHieuData = getThuongHieuData();
    res.render('admin/xeOto/index', { xeOto: xeOtoData, thuongHieu: thuongHieuData });
});


// 3. Handle form submission to create new XeOto
router.post('/create', (req, res) => {
    const xeOtoData = getXeOtoData();
    const newXe = {
        id: `XE${xeOtoData.length + 1}`,
        ...req.body,
        trangThai: 1,
        datLich: 0
    };
    xeOtoData.push(newXe);
    fs.writeFileSync(xeOtoFile, JSON.stringify(xeOtoData, null, 2));
    res.redirect('/xeOto');
});

// 4. Show form to edit existing XeOto (Update)
router.get('/edit/:id', (req, res) => {
    const xeOtoData = getXeOtoData();
    const thuongHieuData = getThuongHieuData();
    const xe = xeOtoData.find(x => x.id === req.params.id);
    res.render('admin/xeOto/edit', { xeOto: xe, thuongHieu: thuongHieuData });
});

// 5. Handle form submission to update XeOto
router.post('/edit/:id', (req, res) => {
    const xeOtoData = getXeOtoData();
    const index = xeOtoData.findIndex(x => x.id === req.params.id);
    xeOtoData[index] = { ...xeOtoData[index], ...req.body };
    fs.writeFileSync(xeOtoFile, JSON.stringify(xeOtoData, null, 2));
    res.redirect('/xeOto');
});

// 6. Delete an XeOto (Delete)
router.post('/delete/:id', (req, res) => {
    const xeOtoData = getXeOtoData();
    const newData = xeOtoData.filter(x => x.id !== req.params.id);
    fs.writeFileSync(xeOtoFile, JSON.stringify(newData, null, 2));
    res.redirect('/xeOto');
});

module.exports = router;
