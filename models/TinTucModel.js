const fs = require('fs');
const path = require('path');

const tinTucFile = path.join(__dirname, '../data/json/TinTuc.json');

// Read data from the JSON file
const getTinTucData = () => {
    return JSON.parse(fs.readFileSync(tinTucFile, 'utf-8'));
};

// Write data to the JSON file
const saveTinTucData = (data) => {
    fs.writeFileSync(tinTucFile, JSON.stringify(data, null, 2));
};

module.exports = {
    getTinTucData,
    saveTinTucData
};
