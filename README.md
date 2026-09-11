# Thiệp Cưới Online — Minh Trí & Cẩm Hương

Mã nguồn thiệp cưới online độc lập (Single Page Application) phong cách **Minimalism Dark Red** sang trọng dành cho ngày cưới của **Phạm Minh Trí & Lê Thị Cẩm Hương** (29.09.2026).

---

## Tính Năng Nổi Bật

- **Màn hình Bì thư mở đầu:**
  - Hiệu ứng mưa tim rơi lơ lửng (`ambient-fall`).
  - Con dấu sáp đỏ dập nổi nhịp tim (`seal-pulse`).
  - Nút **"Mở thiệp"** vệt sáng quét ngang (`shine`).
- **Âm nhạc tự động:** Ca khúc *Beautiful In White* (Shane Filan) tự động phát khi mở bì thư, kèm nút xoay đĩa nhạc nổi bật/tắt tùy ý.
- **Bộ ảnh cưới chất lượng cao:** 24 bức ảnh cưới studio HD sắc nét kèm trình xem ảnh phóng to toàn màn hình (Lightbox).
- **Lịch trình & Đếm ngược:**
  - Lễ Thành Hôn tại Tư Gia (09:00 - Thứ Ba, 29/09/2026).
  - Tiệc Cưới tại Nhà hàng tiệc cưới Rose Palace Huế (Đón khách 11:00 | Khai tiệc 11:30 - Thứ Ba, 29/09/2026).
  - Lịch mini tháng 9/2026 và đồng hồ đếm ngược (Countdown Timer) thời gian thực.
- **Chỉ đường & Hộp mừng cưới:**
  - Nút bấm mở trực tiếp chỉ đường Google Maps tới Rose Palace Huế.
  - Mã VietQR ngân hàng BIDV (STK: 5560991488 - Phạm Minh Trí) kèm nút sao chép STK một chạm.
- **Xác nhận tham dự:** Hộp thoại RSVP cho khách gửi lời chúc và số người tham dự.

---

## Xem Trực Tiếp & Triển Khai

1. **Xem cục bộ trên máy tính:**
   Mở trực tiếp file `index.html` bằng trình duyệt web hoặc chạy máy chủ cục bộ:
   ```bash
   python3 -m http.server 3000
   ```
   Truy cập: `http://localhost:3000`

2. **Triển khai lên Vercel:**
   ```bash
   npx vercel --prod
   ```
