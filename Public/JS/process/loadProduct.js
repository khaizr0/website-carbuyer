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
     
});