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
                event.preventDefault(); // Ngăn form gửi theo GET mặc định
    
                const formData = new FormData(createCarForm);
                const carData = {
                    tenSP: formData.get('tensp'),
                    iDthuongHieu: formData.get('idthuonghieu'),
                    namSanXuat: parseInt(formData.get('namsanxuat')),
                    GiaNiemYet: parseInt(formData.get('gia')),
                    soKm: parseInt(formData.get('sokmdadi') || 0),
                    trangThai: formData.get('trangthai'),
                    nguyenLieuXe: formData.get('nguyenlieuxe'),
                    kieuDang: formData.get('kieudang'),
                    soChoNgoi: parseInt(formData.get('sochongoi')),
                    mauXe: formData.get('mauxe'),
                    loaiCanSo: formData.get('loaicanso'),
                    chiTietSP: formData.get('chitietsanpham'),
                };
    
                console.log("Dữ liệu trước khi gửi:", carData); 
    
                try {
                    const response = await fetch('/products/create-car', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(carData),
                    });
    
                    const result = await response.json();
                    if (response.ok) {
                        alert('Sản phẩm đã thêm thành công!');
                        createCarForm.reset();
                    } else {
                        alert(`Có lỗi xảy ra: ${result.message}`);
                    }
                } catch (error) {
                    console.error('Lỗi kết nối:', error);
                    alert('Đã xảy ra lỗi khi thêm sản phẩm.');
                }
            });
        }
    });
    
});