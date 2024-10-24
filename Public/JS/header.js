document.addEventListener("DOMContentLoaded", function() {
    const headerHTML = `
         <div class="header">
        <div class="menu">
            <img src="/Documents/CarLogo.png" alt="Logo" class="logo">
            <a href="#">Trang chủ</a>
            <a href="#">Giới thiệu</a>
            <a href="#">Dịch vụ</a>
            <a href="#">Liên hệ</a>
        </div>
        <div class="search-container">
            <input type="text" class="search-box" placeholder="Tìm kiếm xe ở đây">
            <button class="search-button"><i class="fa-solid fa-magnifying-glass"></i></button>
            <span class="hotline">Hotline: 0901234567</span>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', headerHTML);
});