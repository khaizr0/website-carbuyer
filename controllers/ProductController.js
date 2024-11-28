const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { addCarProduct, getRecentProducts, getAllProducts, deleteProductById, addAccessoryProduct, findProductById } = require('../models/ProductModel');

// Cấu hình multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Public/images/Database/Products/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ cho phép upload file ảnh!'), false);
    }
  },
  limits: {
    files: 5 
  }
}).array('uploadImage', 5);

const createCarProduct = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error('Lỗi upload file:', err);
        return res.status(400).json({ message: err.message });
      }

      // Lấy dữ liệu từ form
      const carData = req.body;
      
      // Xử lý danh sách hình ảnh
      if (req.files && req.files.length > 0) {
        carData.hinhAnh = req.files.map(file => file.filename).join(' || ');
      } else {
        carData.hinhAnh = '';
      }

      // Xử lý checkbox đặt lịch
      carData.datLich = carData.dangkilaithu === 'on' ? 1 : 0;

      // Kiểm tra các trường bắt buộc
      const missingFields = [];
      if (!carData.tenSP) missingFields.push('Tên sản phẩm');
      if (!carData.iDthuongHieu) missingFields.push('Thương hiệu');
      if (!carData.namSanXuat) missingFields.push('Năm sản xuất');
      if (!carData.GiaNiemYet) missingFields.push('Giá niêm yết');
      if (!carData.soChoNgoi) missingFields.push('Số chỗ ngồi');
      
      if (missingFields.length > 0) {
        return res.status(400).json({ 
          message: `Dữ liệu không đầy đủ, thiếu các trường: ${missingFields.join(', ')}` 
        });
      }

      // Thêm sản phẩm vào database
      const newProduct = await addCarProduct(carData);

      res.status(200).json({ 
        message: 'Sản phẩm đã được thêm thành công!',
        product: newProduct 
      });
    });
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm:', error);
    res.status(500).json({ message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau!' });
  }
};

const createAccessoryProduct = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error('Lỗi upload file:', err);
        return res.status(400).json({ message: err.message });
      }

      // Log toàn bộ req.body để kiểm tra
      console.log('Dữ liệu nhận được:', req.body);

      // Lấy dữ liệu từ form
      const accessoryData = {
        tenSanPham: req.body.tenSP,
        iDthuongHieu: req.body.iDthuongHieu,
        loaiPhuKien: req.body.idLoai,
        gia: req.body.GiaNiemYet,
        chiTietSanPham: req.body.chiTietSP,
        trangThai: req.body.trangThai,
        dangKiLaiThu: req.body.datLich === 'on' ? 1 : 0
      };

      // Xử lý danh sách hình ảnh
      if (req.files && req.files.length > 0) {
        accessoryData.hinhAnh = req.files.map(file => file.filename).join(' || ');
      } else {
        accessoryData.hinhAnh = '';
      }

      // Kiểm tra các trường bắt buộc
      const missingFields = [];
      if (!accessoryData.tenSanPham) missingFields.push('Tên sản phẩm');
      if (!accessoryData.iDthuongHieu) missingFields.push('Thương hiệu');
      if (!accessoryData.loaiPhuKien) missingFields.push('Loại phụ kiện');
      if (!accessoryData.gia) missingFields.push('Giá');
      
      if (missingFields.length > 0) {
        return res.status(400).json({ 
          message: `Dữ liệu không đầy đủ, thiếu các trường: ${missingFields.join(', ')}` 
        });
      }

      // Thêm phụ kiện vào database
      const newAccessory = await addAccessoryProduct(accessoryData);

      res.status(200).json({ 
        message: 'Phụ kiện đã được thêm thành công!',
        accessory: newAccessory 
      });
    });
  } catch (error) {
    console.error('Lỗi khi thêm phụ kiện:', error);
    res.status(500).json({ message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau!' });
  }
};

const getRecentProductsController = async (req, res) => {
  try {
    const recentProducts = await getRecentProducts();
    
    const formattedProducts = recentProducts.map(product => {
      const imageFileName = product.hinhAnh.split('||')[0].trim();
      const imageUrl = `/Public/images/Database/Products/${imageFileName}`;

      return {
        name: product.tenSP,
        price: new Intl.NumberFormat('vi-VN', { 
          style: 'currency', 
          currency: 'VND' 
        }).format(product.GiaNiemYet),
        year: product.namSanXuat,
        mileage: product.soKm.toLocaleString('vi-VN') + ' km',
        fuelType: product.nguyenLieuXe,
        imageUrl: imageUrl
      };
    });
    
    console.log('Fetched Products:', formattedProducts);
    res.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching recent products:', error);
    res.status(500).json({ message: 'Có lỗi khi lấy sản phẩm' });
  }
};

const getAllProductsController = async (req, res) => {
  try {
    const allProducts = await getAllProducts();
    res.json(allProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Có lỗi khi lấy danh sách sản phẩm' });
  }
};

const deleteProductByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await deleteProductById(id);
    res.status(200).json({ message });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Có lỗi khi xóa sản phẩm.' });
  }
};

const getEditProductPageController = async (req, res) => {
  try {
      const productId = req.params.id;

      // Tìm sản phẩm theo ID
      const { product, productType } = await findProductById(productId);

      if (!product) {
          return res.status(404).json({ message: 'Sản phẩm không tồn tại.' });
      }

      const editProductHtml = fs.readFileSync(
          path.join(__dirname, '../views/employee/editProduct.html'),
          'utf8'
      );

      res.send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Chỉnh Sửa Sản Phẩm</title>
              <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
          </head>
          <body>
              <input type="hidden" id="productType" value="${productType}">
              ${editProductHtml}
          </body>
          </html>
      `);
  } catch (error) {
      console.error('Lỗi khi tải trang chỉnh sửa sản phẩm:', error);
      res.status(500).json({ message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau!' });
  }
};

module.exports = { createCarProduct, getRecentProductsController, getAllProductsController, deleteProductByIdController, createAccessoryProduct, getEditProductPageController };