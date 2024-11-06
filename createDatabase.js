//chạy "npm run db" để tạo database

const { MongoClient } = require('mongodb');

async function createDatabase() {
    const uri = 'mongodb://localhost:27017'; // thay đổi dựa trên máy mấy ní
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('car-buyer');

        await db.createCollection('DatLichKH');
        await db.createCollection('LoaiPhuKien');
        await db.createCollection('PhuKien');
        await db.createCollection('ThuongHieu');
        await db.createCollection('TinTuc');
        await db.createCollection('User');
        await db.createCollection('XeOto');
        await db.createCollection('car-buyer');

        console.log('Done');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

createDatabase();