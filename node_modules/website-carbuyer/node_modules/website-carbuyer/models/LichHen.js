const fs = require('fs');
const path = require('path');

// Path to the JSON file
const lichHenPath = path.join(__dirname, '../data/json/DatLichKH.json');

// Read all appointments (LichHen)
function getAllLichHen() {
    const data = fs.readFileSync(lichHenPath, 'utf8');
    return JSON.parse(data);
}

// Find LichHen by ID or other criteria
function getLichHenById(id) {
    const lichHenList = getAllLichHen();
    return lichHenList.find(item => item.id === id); // Assuming there is an 'id' field
}

// Create a new LichHen
function createLichHen(newLichHen) {
    const lichHenList = getAllLichHen();
    lichHenList.push(newLichHen);
    fs.writeFileSync(lichHenPath, JSON.stringify(lichHenList, null, 2));
}

// Update an existing LichHen
function updateLichHen(id, updatedLichHen) {
    let lichHenList = getAllLichHen();
    const index = lichHenList.findIndex(item => item.id === id);
    if (index !== -1) {
        lichHenList[index] = { ...lichHenList[index], ...updatedLichHen };
        fs.writeFileSync(lichHenPath, JSON.stringify(lichHenList, null, 2));
    }
}

// Delete a LichHen
function deleteLichHen(id) {
    let lichHenList = getAllLichHen();
    lichHenList = lichHenList.filter(item => item.id !== id);
    fs.writeFileSync(lichHenPath, JSON.stringify(lichHenList, null, 2));
}

module.exports = {
    getAllLichHen,
    getLichHenById,
    createLichHen,
    updateLichHen,
    deleteLichHen
};
