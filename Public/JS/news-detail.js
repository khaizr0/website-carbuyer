document.addEventListener("DOMContentLoaded", function() {
    const newsId = window.location.pathname.split('/').pop();
    fetchNewsDetail(newsId);
});

async function fetchNewsDetail(newsId) {
    try {
        const response = await fetch(`/news/api/detail/${newsId}`);
        const news = await response.json();

        document.querySelector('.news-content h2').textContent = news.tenTT;
        document.querySelector('.news-date').innerHTML = `<i class="fa-solid fa-clock"></i>${news.ngayDang}`;
        document.querySelector('.news-description').textContent = news.chiTietBaiViet;
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết tin tức:', error);
    }
}