---
id: US-ENR03-04
title: "Lịch sự kiện Cơ sở (Global Event Schedule)"
bf: BF-ENR-03
domain: CAP-ADM
status: standardized
tags: [schedule, events, booking, aggregator]
---

# US-ENR03-04: Lịch sự kiện Cơ sở (Global Event Schedule)

> **Tham chiếu:** BF-ENR-03 · Giao diện Mẫu §4.2 (Danh sách dạng Grid/Calendar)

## 1. Yêu cầu Người dùng (User Story)
**Là một** Quản lý chi nhánh hoặc Tư vấn viên (Sales/Admissions), **tôi muốn** xem toàn bộ lịch sự kiện tuyển sinh (Booking Test, Học thử, Hội thảo) diễn ra tại cơ sở trên một giao diện lịch tổng, **để** nắm bắt lịch trình tiếp khách, kiểm tra xem phòng test/giáo viên test có bị trùng lịch hay không, và quản lý các lượt khách đến cơ sở.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai độc lập với các form tạo Booking. Đóng vai trò là Aggregator (Consumer).
> - [x] **N**egotiable — Giao diện lịch có thể điều chỉnh hoặc gộp nhiều loại Booking khác nhau vào hiển thị.
> - [x] **V**aluable — Tạo ra "Một nguồn sự thật" về lưu lượng khách hàng đến test và học thử.
> - [x] **E**stimable — Dễ dàng ước lượng do chỉ là màn hiển thị UI mapping data.
> - [x] **S**mall — Hoàn thành trong 1 Sprint.
> - [x] **T**estable — Có tiêu chí nghiệm thu ở mục 7.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-EVT-01] Nguồn dữ liệu (Producer):** 
   - Lịch sự kiện cơ sở **chỉ** hiển thị các sự kiện ngoài Lớp học chính khóa. Bao gồm: `Booking Test` (từ `BF-ENR-01`), `Học thử` (từ `BF-ENR-02`), và các `Sự kiện nội bộ/Hội thảo` (từ `BF-ENR-03`).
2. **[RULE-EVT-02] Read-only & Detail Trigger:** 
   - Lưới lịch hoạt động ở chế độ **Read-only**.
   - Bất kỳ tương tác nào đều thông qua việc click vào thẻ sự kiện (Event Card). Hệ thống sẽ căn cứ vào thuộc tính `eventType` để gọi đúng Popup/Dialog chi tiết của phân hệ gốc (VD: `<BookingTestDetailDialog>` hoặc `<TrialBookingDetailDialog>`).
3. **[RULE-EVT-03] Đồng bộ tự động:** 
   - Khi có thay đổi trạng thái (VD: Khách hủy Booking, Đổi giờ test) từ Popup chi tiết, màn hình Lịch tự động re-fetch dữ liệu.

### 2.1. Thông số & Định mức (Metrics & Thresholds)
- **[METRIC-01] Hiệu năng (SLA):** Thời gian tải dữ liệu lịch của 1 Tuần phải dưới 2 giây. Hỗ trợ hiển thị tối đa hàng trăm booking trong một ngày cuối tuần mà không làm giật lag trình duyệt.

---

## 3. Cấu trúc Giao diện & Dữ liệu

### 3.1. Thanh công cụ (Toolbar)
| Thành phần | Loại hiển thị | Logic | Ghi chú |
|------------|---------------|-------|---------|
| Chế độ xem | Segmented Control | Ngày / Tuần / Tháng | Mặc định: Tuần. |
| Chọn Trung tâm | BranchSelect | Lọc theo cơ sở | Mặc định: Chi nhánh hiện tại của User. |
| Loại sự kiện | Checkbox Group / Select | Tích chọn: Booking Test, Học thử, Sự kiện khác | Cho phép lọc và ẩn bớt các loại không cần xem. |
| Tìm kiếm | ExpandableSearch | Tìm Tên khách hàng, SĐT, Tên Sự kiện | |
| Nút Tạo mới | Dropdown Button | Có các Tùy chọn: "Tạo Booking Test", "Tạo Học thử" | Gọi trực tiếp sang form của các BF tương ứng. |

### 3.2. Bảng Lịch (Calendar/Time Grid)
| Thành phần | Loại hiển thị | Dữ liệu | Ghi chú |
|------------|---------------|---------|---------|
| Trục thời gian | Cột giờ / Ngày | Dựa theo chế độ xem | Khung giờ chuẩn: 07:00 - 22:00. |
| Thẻ Lịch (Card) | Unified Event Block | Giờ, Tên KH/Sự kiện, Loại (Test/Học thử), SĐT | Chiều cao tự động co giãn. Hiển thị Icon phân biệt loại sự kiện. |
| Màu sắc thẻ | Background Color | Lấy từ `statusColors.ts` | Phân loại theo Trạng thái (Chờ test, Đang test, Đã xong, Đã hủy). |

### 3.3. Thao tác trên Thẻ Lịch (Card)
| Nút | Loại | Logic | Điều kiện |
|-----|------|-------|-----------|
| Click Thẻ lịch | Nhấp chuột (Click) | Nếu `eventType === 'BOOKING_TEST'` -> Mở `<BookingTestDetailDialog>`. Nếu `eventType === 'TRIAL'` -> Mở `<TrialBookingDetailDialog>` | |

---

## 4. Xử lý Ngoại lệ
| # | Tình huống | Cách xử lý |
|---|-----------|-----------|
| 4.1 | Ngày trống lịch | Hiển thị lưới lịch bình thường. |
| 4.2 | Lịch chồng chéo (Overlap) | Booking Test có thể có rất nhiều học viên cùng lúc ở cùng 1 khoảng thời gian, UI phải render thẻ kiểu xếp chồng (Stacked) hoặc tóm tắt (Ví dụ: "Có 5 Booking Test lúc 18:00"). |

---

## 5. Kế hoạch Tự kiểm tra (Self-Verification)

| # | Hạng mục | Cách kiểm tra | Tiêu chuẩn Đạt |
|---|----------|---------------|-----------------|
| V-01 | Phân tách dữ liệu | Kiểm tra API / Mock Data | Không bị lẫn dữ liệu "Lớp học" vào màn Lịch sự kiện. |
| V-02 | Lọc loại sự kiện | Bỏ check "Booking Test" | Các thẻ Booking Test biến mất ngay lập tức. |
| V-03 | Xử lý đa luồng | Click Booking Test vs Click Học thử | Pop-up hiện lên phải khớp với luồng nghiệp vụ của từng loại (gọi đúng Component). |

---

## 6. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|--------------------|-----------------------|-------------------|
| AC-01 | Render chính xác | Mở chế độ Tuần | Thẻ lịch hiển thị đúng khung giờ và tự co giãn độ cao thẻ. |
| AC-02 | Dynamic Navigation | Click vào thẻ | Hàm xử lý bắt đúng type của thẻ và gọi đúng Modal từ BF gốc. |
| AC-03 | Giao diện ngăn nắp | Thử tạo 5 Booking cùng giờ | UI xử lý chống vỡ layout (gom nhóm hoặc chia cột chia thẻ). |
