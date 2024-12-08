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

document.addEventListener("DOMContentLoaded", function() {
    fetchNews();
});

async function fetchNews() {
    try {
        const response = await fetch('/news/api/all');
        const newsList = await response.json();
        
        const otherArticlesContainer = document.querySelector('.other-articles');
        otherArticlesContainer.innerHTML = ''; // Xóa nội dung cũ

        newsList.forEach((news, index) => {
            if (index === 0) {
                // Cập nhật bài viết nổi bật
                updateFeaturedArticle(news);
            } else {
                // Tạo các bài viết nhỏ
                createArticleElement(news);
            }
        });

        // Cập nhật phân trang
        const totalItems = newsList.length;
        const itemsPerPage = 4;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        document.getElementById("total-pages").textContent = totalPages;
        updateArticlesDisplay();
    } catch (error) {
        console.error('Lỗi khi lấy tin tức:', error);
    }
}

function updateFeaturedArticle(news) {
    const featuredArticle = document.querySelector('.featured-article');
    featuredArticle.querySelector('img').src = `/Public/images/${news.anhDaiDien}`;
    featuredArticle.querySelector('h3').textContent = news.ngayDang;
    featuredArticle.querySelector('h2').textContent = news.tenTT;
    featuredArticle.querySelector('p').textContent = news.chiTietBaiViet.substring(0, 150) + '...';
}

function createArticleElement(news) {
    const otherArticlesContainer = document.querySelector('.other-articles');
    const articleDiv = document.createElement('div');
    articleDiv.classList.add('article');

    articleDiv.innerHTML = `
        <img src="/Public/images/${news.anhDaiDien}" alt="${news.tenTT}">
        <div class="article-content">
            <h3>${news.ngayDang}</h3>
            <h4>${news.tenTT}</h4>
            <p>${news.chiTietBaiViet.substring(0, 100)}...</p>
            <a href="/news/detail/${news._id}">Đọc thêm</a>
        </div>
    `;

    otherArticlesContainer.appendChild(articleDiv);
}
