---
id: US-HR-02-04
title: "Lịch của tôi"
bf: BF-HR-02
domain: CAP-HR
status: standardized
tags: [schedule, calendar, personal, aggregator]
---

# US-HR-02-04: Xem Lịch của tôi (My Schedule / Aggregator)

> **Tham chiếu:** BF-HR-02 · Giao diện Mẫu §4.2 (Danh sách dạng Grid)

## 1. Yêu cầu Người dùng (User Story)
**Là một** Nhân sự của tổ chức (Giáo viên, Trợ giảng, Nhân viên, Tư vấn viên), **tôi muốn** xem toàn bộ lịch làm việc cá nhân của mình được tổng hợp từ tất cả các hệ thống (Lớp học, Sự kiện, Học thử, Booking Test), **để** biết chính xác các công việc/thời gian mình đã được phân bổ trong ngày/tuần và chủ động sắp xếp công việc cá nhân.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai hiển thị độc lập, đóng vai trò Consumer.
> - [x] **N**egotiable — Giao diện có thể điều chỉnh tùy theo các bộ lọc.
> - [x] **V**aluable — Tạo ra "Một nguồn sự thật" (Single source of truth) về thời gian làm việc cho nhân viên.
> - [x] **E**stimable — Dễ dàng ước lượng do chỉ là màn hiển thị tổng hợp dữ liệu.
> - [x] **S**mall — Gói gọn trong một màn hình Dashboard/Lịch cá nhân.
> - [x] **T**estable — Có thể tạo dữ liệu giả từ nhiều nguồn để kiểm thử sự hợp nhất (Aggregator).

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-AGGR-01] Mô hình Producer - Consumer:** 
   - Màn hình này đóng vai trò là **Consumer** (Tiêu thụ dữ liệu). 
   - Các phân hệ khác như `BF-OPS-02` (Xếp lịch lớp), `BF-ENR-01` (Booking Test), `BF-ENR-02` (Học thử), `BF-OPS-03` (Sự kiện) đóng vai trò là **Producer** (Sản xuất dữ liệu).
   - Khi một sự kiện (có gán nhân sự) được tạo, thay đổi hoặc xóa ở phân hệ gốc (Producer), hệ thống phải tự động đẩy (push) thông tin về giao diện này dưới một định dạng chuẩn chung (`UnifiedSlot`).
   
2. **[RULE-AGGR-02] Ràng buộc hiển thị (Read-Only):**
   - Lịch của tôi là màn hình **Chỉ đọc**. Nhân sự không được phép sửa giờ, sửa trung tâm hay xóa lịch trực tiếp trên các thẻ lịch ở đây.
   - Bất kỳ thay đổi nào (xin nghỉ, xin đổi lịch, thay đổi thông tin lớp) đều phải quay về phân hệ gốc (Producer) tương ứng để xử lý.

3. **[RULE-AGGR-03] Cơ chế tổng hợp Chi nhánh:**
   - Nếu nhân sự được phân công làm việc ở nhiều cơ sở khác nhau, lịch mặc định sẽ gộp toàn bộ lịch từ tất cả cơ sở. Cần có tùy chọn lọc để nhân sự xem theo từng cơ sở cụ thể.

### 2.1. Thông số & Định mức (Metrics & Thresholds)
- **[METRIC-01] Hiệu năng (SLA):** Thời gian tổng hợp và tải lịch theo tuần/ngày cần < 2 giây. Do phải truy xuất chéo từ nhiều hệ thống, nên áp dụng cơ chế Caching hoặc Materialized View nếu cần ở backend thực tế.

---

## 3. Cấu trúc Giao diện & Dữ liệu

### 3.1. Thanh công cụ (Toolbar)
| Thành phần | Loại hiển thị | Logic | Ghi chú |
|------------|---------------|-------|---------|
| Chế độ xem | Segmented Control | Chuyển đổi giữa chế độ Ngày / Tuần | Mặc định: Tuần. |
| Chọn Trung tâm | Danh sách thả xuống (BranchSelect) | Lọc lịch theo trung tâm cụ thể | Mặc định: Tất cả trung tâm. |
| Khung Tìm kiếm | Ô nhập chữ (ExpandableSearch) | Quét trường Tên, Lớp học, Loại | Cập nhật kết quả tự động. |
| Nút Bộ lọc | Nút (FilterIconButton) | Mở bảng lọc nâng cao | Hiển thị số lượng bộ lọc đang bật. |
| Nút Hôm nay | Nút chữ | Trở về ngày/tuần hiện tại | |
| Điều hướng thời gian | Icon Action Button (Trái/Phải) | Lùi/Tiến 1 ngày hoặc 1 tuần | |

### 3.2. Bảng lọc nâng cao (Slide Panel)
| Thành phần | Loại hiển thị | Dữ liệu | Ghi chú |
|------------|---------------|---------|---------|
| Khoảng thời gian | Ô đánh dấu (Checkbox) | Hôm nay, Sắp diễn ra | Có thể chọn nhiều. |
| Nguồn lịch | Ô đánh dấu (Checkbox) | Lớp học, Sự kiện (Booking Test, Học thử...) | Lọc theo nguồn từ Producer. |

### 3.3. Bảng Lịch (Schedule Time Grid)
| Cột/Dòng | Loại hiển thị | Trường Dữ liệu | Ghi chú |
|----------|---------------|----------------|---------|
| Trục thời gian | Cột giờ | 07:00 -> 23:00 | Khung giờ hoạt động chuẩn chung toàn hệ thống. |
| Trục ngày | Các cột thứ | Thứ 2 - Chủ Nhật (hoặc 1 ngày) | Tùy theo chế độ xem (Ngày/Tuần). |
| Thẻ lịch (UnifiedCard) | Khối thông tin | Giờ, Tên sự kiện, Phân loại, Trung tâm, Thống kê học viên | Tự động co giãn theo khoảng thời gian thực tế. |

### 3.4. Thao tác trên Thẻ Lịch (Card)
| Nút | Loại | Logic | Điều kiện |
|-----|------|-------|-----------|
| Thẻ lịch | Nhấp chuột (Click) | Mở trang chi tiết gốc của sự kiện/lớp học đó (nếu được hỗ trợ) | Read-only tại màn hình lịch. |

---

## 4. Xử lý Ngoại lệ
| # | Tình huống | Cách xử lý |
|---|-----------|-----------|
| 4.1 | Không có lịch trình | Lưới thời gian hiển thị trống, không cần báo lỗi. |
| 4.2 | Tìm kiếm không có kết quả | Ẩn toàn bộ thẻ lịch, lưới thời gian trống. |

---

## 5. Chỉ dẫn cho AI Agent & Lập trình viên (Business Architecture)

- **Mô hình Dữ liệu Hợp nhất (Unified Data Model):** Trên UI, cần định nghĩa một cấu trúc dữ liệu chuẩn (`UnifiedSlot`) bao gồm các trường bắt buộc như: `id`, `scheduleType` (lớp/sự kiện), `title`, `subtitle`, `date`, `timeLabel`, `endTimeLabel`, `branch`, `typeLabel`. Tất cả dữ liệu mock từ các nguồn khác nhau phải được map về định dạng chung này trước khi render lên lưới.
- **Tuân thủ Design System:** Bắt buộc dùng `getStatusBadgeClass()` từ `src/lib/statusColors.ts` để hiển thị màu thẻ trạng thái hoặc phân loại sự kiện.
- **Component dùng chung:** Phải sử dụng các component từ `@/components/controls` cho Toolbar và `FilterSheetPanel` từ `@/components/filters`.

### ⛔ Hàng rào An toàn (Guardrails)
- **KHÔNG** đặt logic chỉnh sửa (CRUD) lịch trực tiếp trên thẻ. Mọi luồng thay đổi trạng thái (cancel, đổi lịch) phải dẫn về các luồng nghiệp vụ tương ứng (VD: Flow đổi lịch học).
- **KHÔNG** làm vỡ layout lưới thời gian khi có nhiều lịch chồng lấp (Overlap) cùng khung giờ.
- **KHÔNG** tạo thêm hằng số (constants) màu sắc riêng lẻ cho các loại sự kiện trong file giao diện. Nếu cần thêm màu cho loại lịch mới, phải định nghĩa ở `statusColors.ts` và đưa vào tài liệu.

---

## 6. Kế hoạch Tự kiểm tra (Self-Verification)

| # | Hạng mục | Cách kiểm tra | Tiêu chuẩn Đạt |
|---|----------|---------------|-----------------|
| V-01 | Hợp nhất dữ liệu | Dùng dữ liệu mock từ 2 nguồn (Lớp học, Sự kiện) | Hiển thị chung trên một lưới thời gian. |
| V-02 | Chuyển đổi khung nhìn | Bấm "Ngày", "Tuần" | Trục thời gian hiển thị đúng định dạng mà thẻ vẫn khớp vị trí. |
| V-03 | Lọc theo nguồn | Tích chọn bộ lọc "Lớp học" | Chỉ giữ lại các thẻ có type là lớp học. |

---

## 7. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|--------------------|-----------------------|-------------------|
| AC-01 | Bố cục chuẩn mực | So sánh với tài liệu UI | Có đầy đủ các Controls chuẩn (Tìm kiếm, Chọn nhánh, Chọn chế độ xem). |
| AC-02 | Định vị chính xác | Kéo thẻ thả vào grid | Thẻ sự kiện xuất hiện đúng khe thời gian (VD: 18:00 - 19:30). |
| AC-03 | Đồng bộ Màu sắc | Kiểm tra trực quan | Màu của các loại lịch phải trùng khớp hoàn toàn với màu định nghĩa toàn hệ thống. |
