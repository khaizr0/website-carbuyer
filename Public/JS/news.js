// news.js
let currentPage = 1;
const itemsPerPage = 4; // Số bài viết hiển thị trên mỗi trang
const totalItems = 4; // Tổng số bài viết (cần cập nhật tùy theo số lượng bài viết thực tế)
const totalPages = Math.ceil(totalItems / itemsPerPage);

function changePage(direction) {
    if (direction === 1 && currentPage < totalPages) {
        currentPage++;
    } else if (direction === -1 && currentPage > 1) {
        currentPage--;
    }

    document.getElementById("current-page").textContent = currentPage;
    updateArticlesDisplay();
}

function updateArticlesDisplay() {
    const articles = document.querySelectorAll(".article");
    articles.forEach((article, index) => {
        if (index >= (currentPage - 1) * itemsPerPage && index < currentPage * itemsPerPage) {
            article.style.display = "flex"; // Hiển thị bài viết
        } else {
            article.style.display = "none"; // Ẩn bài viết
        }
    });

    // Cập nhật trạng thái nút
    document.getElementById("prev").disabled = currentPage === 1;
    document.getElementById("next").disabled = currentPage === totalPages;
}

// Đảm bảo nội dung được ẩn khi tải trang
document.addEventListener("DOMContentLoaded", function() {
    updateArticlesDisplay(); // Cập nhật hiển thị bài viết khi trang tải
    document.getElementById("total-pages").textContent = totalPages; // Hiển thị tổng số trang
});
