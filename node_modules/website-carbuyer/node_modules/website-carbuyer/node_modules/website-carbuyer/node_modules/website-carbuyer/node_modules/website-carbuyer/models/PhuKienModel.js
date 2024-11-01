const fs = require('fs');
const path = require('path');

// Path to the JSON file
const phuKienPath = path.join(__dirname, '../data/json/PhuKien.json');

// Read all PhuKien (Accessories)
function getAllPhuKien() {
    const data = fs.readFileSync(phuKienPath);
    return JSON.parse(data);
}

// Find PhuKien by ID
function getPhuKienById(id) {
    const phuKien = getAllPhuKien();
    return phuKien.find(item => item.id === id);
}

// Create a new PhuKien
function createPhuKien(newPhuKien) {
    const phuKien = getAllPhuKien();
    phuKien.push(newPhuKien);
    fs.writeFileSync(phuKienPath, JSON.stringify(phuKien, null, 2));
}

// Update an existing PhuKien
function updatePhuKien(id, updatedPhuKien) {
    let phuKien = getAllPhuKien();
    const index = phuKien.findIndex(item => item.id === id);
    if (index !== -1) {
        phuKien[index] = { ...phuKien[index], ...updatedPhuKien };
        fs.writeFileSync(phuKienPath, JSON.stringify(phuKien, null, 2));
    }
}

// Delete a PhuKien
function deletePhuKien(id) {
    let phuKien = getAllPhuKien();
    phuKien = phuKien.filter(item => item.id !== id);
    fs.writeFileSync(phuKienPath, JSON.stringify(phuKien, null, 2));
}

module.exports = {
    getAllPhuKien,
    getPhuKienById,
    createPhuKien,
    updatePhuKien,
    deletePhuKien
};
