document.addEventListener('DOMContentLoaded', function() {
    fetchProducts();
    
    async function fetchProducts() {
        try {
            const response = await fetch('/products');
            const products = await response.json();
            
            const carList = document.getElementById('carList');
            carList.innerHTML = ''; // Xóa dữ liệu mẫu
            
            products.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><input type="checkbox" class="row-checkbox" data-id="${product.id}"></td>
                    <td>${product.name}</td>
                    <td>${product.brand}</td>
                    <td>${new Intl.NumberFormat('vi-VN', { 
                        style: 'currency', 
                        currency: 'VND' 
                    }).format(product.price)}</td>
                    <td>${product.type}</td>
                    <td>${product.status}</td>
                    <td>
                        <button class="btn btn-trans" onclick="editProduct('${product.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-trans" onclick="deleteProduct('${product.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                carList.appendChild(row);
            });
        } catch (error) {
            console.error('Error:', error);
            alert('Có lỗi khi tải danh sách sản phẩm');
        }
    }
    
    // Các hàm xử lý sự kiện
    window.editProduct = function(id) {
        console.log('Edit product:', id);
        // Thêm code xử lý chỉnh sửa sản phẩm
    }
    
    window.deleteProduct = async function (id) {
        if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
            try {
                const response = await fetch(`/products/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    alert('Sản phẩm đã được xóa thành công!');
                    fetchProducts();
                } else {
                    alert('Có lỗi xảy ra khi xóa sản phẩm.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Có lỗi khi xóa sản phẩm.');
            }
        }
    };
    document.addEventListener('DOMContentLoaded', function() {
        const createCarForm = document.getElementById('createCarForm');
        
        if (createCarForm) {
            createCarForm.addEventListener('submit', async function(event) {
                event.preventDefault();
    
                const formData = new FormData(createCarForm);
                const fileInput = document.getElementById('uploadImage');
    
                // Kiểm tra số lượng file
                if (fileInput.files.length > 5) {
                    alert('Chỉ được phép upload tối đa 5 ảnh!');
                    return;
                }
                    
                    // Kiểm tra loại file
                    if (!file.type.startsWith('image/')) {
                        alert(`File ${file.name} không phải là file ảnh!`);
                        return;
                    }
                
    
                try {
                    formData.set('tenSP', formData.get('tenSP'));
                    formData.set('iDthuongHieu', formData.get('iDthuongHieu'));
                    formData.set('namSanXuat', formData.get('namSanXuat'));
                    formData.set('GiaNiemYet', formData.get('GiaNiemYet'));
                    formData.set('soKm', formData.get('soKm') || '0');
                    formData.set('trangThai', formData.get('trangThai'));
                    formData.set('nguyenLieuXe', formData.get('nguyenLieuXe'));
                    formData.set('kieuDang', formData.get('kieuDang'));
                    formData.set('soChoNgoi', formData.get('soChoNgoi'));
                    formData.set('mauXe', formData.get('mauXe'));
                    formData.set('loaiCanSo', formData.get('loaiCanSo'));
                    formData.set('chiTietSP', formData.get('chiTietSP'));
                    formData.set('dangkilaithu', formData.get('dangkilaithu') ? '1' : '0');
    
                    // Log dữ liệu trước khi gửi để debug
                    console.log("Dữ liệu form trước khi gửi:");
                    for (let pair of formData.entries()) {
                        console.log(pair[0] + ': ' + pair[1]);
                    }
    
                    const response = await fetch('/products/create-car', {
                        method: 'POST',
                        body: formData 
                    });
    
                    const result = await response.json();
                    
                    if (response.ok) {
                        alert('Sản phẩm đã thêm thành công!');
                        createCarForm.reset();
                        // Tải lại danh sách sản phẩm nếu cần
                        if (typeof fetchProducts === 'function') {
                            fetchProducts();
                        }
                    } else {
                        alert(`Có lỗi xảy ra: ${result.message}`);
                    }
                } catch (error) {
                    console.error('Lỗi kết nối:', error);
                    alert('Đã xảy ra lỗi khi thêm sản phẩm.');
                }
            });
        }
    
        // Thêm preview ảnh (tùy chọn)
        const uploadImage = document.getElementById('uploadImage');
        if (uploadImage) {
            uploadImage.addEventListener('change', function(event) {
                const previewContainer = document.createElement('div');
                previewContainer.id = 'imagePreview';
                previewContainer.style.marginTop = '10px';
                
                // Xóa preview cũ nếu có
                const oldPreview = document.getElementById('imagePreview');
                if (oldPreview) {
                    oldPreview.remove();
                }
    
                // Tạo preview cho mỗi file được chọn
                for (let file of this.files) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.style.maxHeight = '100px';
                        img.style.marginRight = '10px';
                        img.style.marginBottom = '10px';
                        previewContainer.appendChild(img);
                    }
                    reader.readAsDataURL(file);
                }
    
                // Chèn preview vào sau input
                this.parentNode.appendChild(previewContainer);
            });
        }
    });
});