# EcoFresh Market - Website Thương Mại Điện Tử Nông Sản Sạch

Hệ thống website thương mại điện tử chuyên nghiệp theo mô hình B2C (Farm-to-Table) phân phối nông sản sạch, thực phẩm hữu cơ chuẩn VietGAP.

## 1. Cấu Trúc Dự Án
```text
ecofresh-website/
├── index.html        # Trang chủ (Banner slider, Flash Sale đếm ngược, danh mục, sản phẩm nổi bật)
├── about.html        # Trang Giới thiệu (Câu chuyện thương hiệu, sứ mệnh, chứng nhận VietGAP, HTX đối tác)
├── products.html     # Trang Sản phẩm & Dịch vụ (Phân cấp danh mục 2 cấp, bộ lọc đa năng, chi tiết sản phẩm)
├── cart.html         # Trang Đơn hàng & Giỏ hàng (Tính toán tự động, áp mã voucher, thanh toán VietQR động)
├── news.html         # Trang Tin tức & Cẩm nang (Danh sách dọc từ mới đến cũ, xem bài viết chi tiết)
├── contact.html      # Trang Liên hệ (Biểu mẫu tiếp nhận thông tin tự động, bản đồ số Google Maps)
├── css/
│   └── style.css     # Hệ thống thiết kế chuẩn UI/UX E-Commerce hiện đại, responsive 100%
└── js/
    ├── products-data.js # Cơ sở dữ liệu danh mục 2 cấp, sản phẩm, dịch vụ và bài viết mẫu
    └── app.js           # Xử lý giỏ hàng, tìm kiếm gợi ý, đếm ngược flash sale, tính BMI, tạo VietQR
```

## 2. Các Tính Năng Nổi Bật Đáp Ứng Đúng Đề Tài
1. **Thiết kế giao diện (UI/UX):** Phối màu xanh ngọc bích hữu cơ (`#10B981`, `#064E3B`) thanh lịch, hiệu ứng chuyển động mượt mà, thân thiện trên cả máy tính và điện thoại.
2. **Tìm kiếm thông minh:** Tự động gợi ý sản phẩm tức thì khi gõ từ khóa kèm hình ảnh và giá bán.
3. **Flash Sale giờ vàng:** Đồng hồ đếm ngược thời gian thực, thanh tiến trình hiển thị phần trăm sản phẩm đã bán.
4. **Phân cấp danh mục 2 cấp:** Cấp 1 (Rau củ hữu cơ, Trái cây tươi, Thịt cá sinh học...) và Cấp 2 (Rau ăn lá, Rau ăn củ quả, Nấm tươi...).
5. **Giỏ hàng & Đơn hàng thông minh:** Cập nhật số lượng không cần tải lại trang, thanh tiến trình thông báo mức mua để được miễn phí vận chuyển.
6. **Thanh toán VietQR động:** Tự động sinh mã QR ngân hàng chứa số tiền chính xác và mã đơn hàng tự động khớp lệnh.
7. **Tiện ích tính khẩu phần ăn & BMI:** Nhập chiều cao, cân nặng và mục tiêu ăn uống -> tự động gợi ý giỏ thực phẩm sạch cá nhân hóa.
8. **Thống kê lượt truy cập:** Hiển thị trực tiếp số khách đang online thời gian thực và tổng lượt xem ở chân trang.

## 3. Cách Khởi Chạy Website
- **Cách 1 (Nhanh nhất):** Nhấp đúp chuột trực tiếp vào tệp `index.html` để mở ngay trên trình duyệt (Chrome, Cốc Cốc, Edge, Firefox, Safari).
- **Cách 2 (Chạy máy chủ cục bộ):**
  Mở terminal tại thư mục này và chạy lệnh:
  ```bash
  python -m http.server 8000
  ```
  Sau đó truy cập: `http://localhost:8000` trên trình duyệt.
