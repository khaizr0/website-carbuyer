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
            <div class="hotline-container">
                    <span class="hotline-title">Hotline</span><br>
                    <a href="tel:0123456789" class="hotline-link">0123456789</a>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', headerHTML);
});