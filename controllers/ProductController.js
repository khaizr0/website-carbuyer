const multer = require('multer');
const path = require('path');
const { addCarProduct, getRecentProducts, getAllProducts, deleteProductById } = require('../models/ProductModel');

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
}).single('uploadImage');

const createCarProduct = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error('Lỗi upload file:', err);
        return res.status(400).json({ message: err.message });
      }

      // Lấy dữ liệu từ form
      const carData = req.body;
      
      // Thêm tên file hình ảnh vào dữ liệu
      if (req.file) {
        carData.hinhAnh = req.file.filename;
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
      console.log('Sản phẩm đã được thêm thành công:', newProduct);

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

module.exports = { createCarProduct, getRecentProductsController, getAllProductsController, deleteProductByIdController };