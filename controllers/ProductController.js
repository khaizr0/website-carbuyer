const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getDB } = require('../config/db');
const { addCarProduct, getRecentProducts, getAllProducts, deleteProductById, addAccessoryProduct, findProductById, updateProductById } = require('../models/ProductModel');

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
      const accessoryData = req.body;

      // Xử lý danh sách hình ảnh
      if (req.files && req.files.length > 0) {
        accessoryData.hinhAnh = req.files.map(file => file.filename).join(' || ');
      } else {
        accessoryData.hinhAnh = '';
      }

      // Kiểm tra các trường bắt buộc
      const missingFields = [];
      if (!accessoryData.tenSP) missingFields.push('Tên sản phẩm');
      if (!accessoryData.iDthuongHieu) missingFields.push('Thương hiệu');
      if (!accessoryData.idLoai) missingFields.push('Loại phụ kiện');
      if (!accessoryData.GiaNiemYet) missingFields.push('Giá');
      
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
      console.log('Bắt đầu xử lý yêu cầu chỉnh sửa sản phẩm.');

      const productId = req.params.id;
      console.log('ID sản phẩm:', productId);

      const { product, productType } = await findProductById(productId);
      console.log('Kết quả từ findProductById:', { product, productType });

      if (!product) {
          console.warn('Sản phẩm không tồn tại.');
          return res.status(404).json({ message: 'Sản phẩm không tồn tại.' });
      }

      console.log('Đọc file editProduct.html.');
      const editProductHtml = fs.readFileSync(
          path.join(__dirname, '../views/employee/editProduct.html'),
          'utf8'
      );

      // Debug nội dung HTML (nếu cần thiết, lưu ý: không in nội dung lớn vào log)
      console.log('Đã đọc xong file editProduct.html.');

      // Tạo script để điền dữ liệu
      const scriptFillData = `
      <script>
      document.addEventListener('DOMContentLoaded', function() {
          console.log('Đang khởi tạo dữ liệu cho form.');
          const productType = '${productType}';
          const product = ${JSON.stringify(product)};
          
          console.log('Loại sản phẩm:', productType);
          console.log('Dữ liệu sản phẩm:', product);

          if (productType === 'XE') {
              document.getElementById('tenSP').value = product.tenSP;
              document.getElementById('iDthuongHieu').value = product.iDthuongHieu;
              document.getElementById('namSanXuat').value = product.namSanXuat;
              document.getElementById('GiaNiemYet').value = product.GiaNiemYet;
              document.getElementById('soKm').value = product.soKm;
              document.getElementById('nguyenLieuXe').value = product.nguyenLieuXe;
              document.getElementById('kieuDang').value = product.kieuDang;
              document.getElementById('soChoNgoi').value = product.soChoNgoi;
              document.getElementById('mauXe').value = product.mauXe;
              document.getElementById('loaiCanSo').value = product.loaiCanSo;
              document.getElementById('chiTietSP').value = product.chiTietSP;
              document.getElementById('trangThai').value = product.trangThai;
          } else if (productType === 'PK') {
              document.getElementById('tenSPPK').value = product.tenSP;
              document.getElementById('iDthuongHieuPK').value = product.iDthuongHieu;
              document.getElementById('idLoaiPK').value = product.idLoai;
              document.getElementById('GiaNiemYetPK').value = product.GiaNiemYet;
              document.getElementById('chiTietSPPK').value = product.chiTietSP;
              document.getElementById('trangThaiPK').value = product.trangThai;
          }
      });
      </script>
      `;

      console.log('Script điền dữ liệu đã được tạo.');

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
              ${scriptFillData}
          </body>
          </html>
      `);

      console.log('Đã gửi response với giao diện chỉnh sửa sản phẩm.');
  } catch (error) {
      console.error('Lỗi khi tải trang chỉnh sửa sản phẩm:', error);
      res.status(500).json({ message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau!' });
  }
};

const updateProduct = async (req, res) => {
  const productId = req.params.id;

  try {
      // Tìm sản phẩm hiện tại
      const { product, productType } = await findProductById(productId);

      if (!product) {
          return res.status(404).json({ message: 'Sản phẩm không tồn tại.' });
      }

      // Xử lý upload hình ảnh mới (nếu có)
      upload(req, res, async (err) => {
          if (err) {
              console.error('Lỗi upload file:', err);
              return res.status(400).json({ message: err.message });
          }

          // Danh sách file mới
          const newImages = req.files.map(file => file.filename);
          console.log('Hình ảnh mới:', newImages);

          // Kiểm tra thay đổi hình ảnh
          if (newImages.length > 0 && product.images) {
              // Xóa ảnh cũ trong thư mục
              product.images.forEach(image => {
                  const filePath = path.join(__dirname, '../Public/images/Database/Products/', image);
                  if (fs.existsSync(filePath)) {
                      fs.unlinkSync(filePath);
                      console.log(`Đã xóa ảnh cũ: ${filePath}`);
                  }
              });
          }

          // Chuẩn hóa dữ liệu nếu là sản phẩm Phụ Kiện
          let updatedData = { ...req.body };

          if (productType === 'PK') {
              updatedData.tenSP = updatedData.tenSPPK;
              updatedData.iDthuongHieu = updatedData.iDthuongHieuPK;
              updatedData.idLoai = updatedData.idLoaiPK;
              updatedData.GiaNiemYet = updatedData.GiaNiemYetPK;
              updatedData.chiTietSP = updatedData.chiTietSPPK;
              updatedData.trangThai = updatedData.trangThaiPK;

              // Xóa các key không cần thiết
              delete updatedData.tenSPPK;
              delete updatedData.iDthuongHieuPK;
              delete updatedData.idLoaiPK;
              delete updatedData.GiaNiemYetPK;
              delete updatedData.chiTietSPPK;
              delete updatedData.trangThaiPK;
          }

          // Thêm ảnh mới vào dữ liệu cập nhật
          updatedData.images = newImages.length > 0 ? newImages : product.images; // Giữ ảnh cũ nếu không upload ảnh mới

          // Cập nhật vào database
          const db = getDB();
          const collectionName = productType === 'XE' ? 'XeOto' : 'PhuKien';
          await db.collection(collectionName).updateOne({ id: productId }, { $set: updatedData });

          return res.status(200).json({ message: 'Cập nhật sản phẩm thành công.' });
      });
  } catch (error) {
      console.error('Lỗi khi cập nhật sản phẩm:', error);
      res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại.' });
  }
};


module.exports = { createCarProduct, getRecentProductsController, getAllProductsController, 
  deleteProductByIdController, createAccessoryProduct, getEditProductPageController, updateProduct };