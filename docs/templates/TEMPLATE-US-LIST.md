---
id: US-XXX-YY-ZZ
title: "[Tên Màn Hình Danh Sách]"
bf: BF-XXX-YY
domain: CAP-XXX
status: draft
tags: [tag1, list]
---

# US-XXX-YY-ZZ: [Tên Màn Hình Danh Sách]

> **Tham chiếu:** BF-XXX-YY · `[POLICY-XXX-YY]` · Giao diện Mẫu §4.2 (Danh sách)

## 1. Yêu cầu Người dùng (User Story)
**Là một** [Vai trò], **tôi muốn** [Hành động], **để** [Mục đích].

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai độc lập.
> - [x] **N**egotiable — Chi tiết giao diện có thể thương lượng.
> - [x] **V**aluable — Mang lại giá trị rõ ràng.
> - [x] **E**stimable — Đủ rõ để ước lượng công sức.
> - [x] **S**mall — Hoàn thành trong 1 vòng phát triển.
> - [x] **T**estable — Có tiêu chí nghiệm thu ở mục 7.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-LIST-01]:** Khi vừa truy cập, chỉ hiển thị bản ghi "Đang hoạt động".
2. **[RULE-LIST-02]:** Tìm kiếm theo nhiều trường (Tên, Mã, Email), không phân biệt chữ hoa chữ thường.

### 2.1. Thông số & Định mức (Metrics & Thresholds)
*(Định nghĩa các con số giới hạn, định mức hoặc SLA áp dụng cho danh sách này)*
- **[METRIC-01] Hiệu năng (SLA):** Thời gian tải danh sách không quá 2 giây với 100,000 bản ghi.
- **[METRIC-02] Số lượng xuất file:** Tối đa xuất (export) 5,000 dòng mỗi lần.

---

## 3. Cấu trúc Giao diện & Dữ liệu

### 3.1. Thanh công cụ
| Thành phần | Loại hiển thị | Logic | Ghi chú |
|------------|---------------|-------|---------|
| Chọn [Bối cảnh] | Danh sách thả xuống | Lọc theo phân loại | Mặc định: "Tất cả". |
| Ô tìm kiếm | Ô nhập chữ | Quét trường tên, mã | Gợi ý: "Tìm tên, mã...". |
| Nút Tạo mới | Nút màu nhấn | Mở biểu mẫu tạo mới | Kiểm tra quyền trước. |

### 3.2. Khối lọc Trạng thái
| Thành phần | Nhóm màu | Điều kiện | Ghi chú |
|------------|----------|-----------|---------|
| Tất cả | Mặc định | Bỏ lọc | |
| [Trạng thái 1] | Theo hệ thống màu chuẩn | Lọc theo trạng thái | |

### 3.3. Bảng danh sách chính
*Bấm vào dòng -> Chuyển đến trang chi tiết*

| Cột | Loại hiển thị | Trường Dữ liệu | Ghi chú |
|-----|---------------|----------------|---------|
| [Cột Chính] | Ảnh đại diện + Văn bản | Thông tin định danh | |
| Trạng thái | Nhãn màu | Trạng thái hiện tại | Theo bộ màu chuẩn |
| Ngày tạo | Văn bản | Ngày cập nhật | Định dạng: Ngày/Tháng/Năm |

### 3.4. Thao tác khi rê chuột vào dòng
| Nút | Loại | Logic | Điều kiện |
|-----|------|-------|-----------|
| [Thao tác 1] | Nút biểu tượng | Cập nhật | `NẾU trạng thái khác 'Bị Khóa'` |

### 3.5. Bảng lọc nâng cao
| Thành phần | Loại | Dữ liệu | Ghi chú |
|------------|------|---------|---------|
| Lọc [A] | Ô đánh dấu / Danh sách thả xuống | Lọc theo tiêu chí | |

### 3.6. Phân trang
Chuẩn `[20, 50, 100]` bản ghi/trang.

---

## 4. Xử lý Ngoại lệ
| # | Tình huống | Cách xử lý |
|---|-----------|-----------|
| 4.1 | Không có dữ liệu | Hiện thông báo "Chưa có dữ liệu". |
| 4.2 | Tìm kiếm không có kết quả | Hiện thông báo "Không tìm thấy", xóa nội dung bảng. |

---

## 5. Chỉ dẫn cho AI Agent & Lập trình viên (Business Architecture)

- Phải kiểm tra phân quyền (Authorization) trước khi cho phép xem dữ liệu và thực hiện thao tác (VD: Tạo mới, Xóa).
- Nhãn trạng thái bắt buộc lấy màu từ bộ quy tắc trạng thái chuẩn của doanh nghiệp (Design System).
- Bố cục danh sách phải đáp ứng đúng chuẩn trải nghiệm người dùng (Thanh công cụ -> Lọc trạng thái -> Bảng dữ liệu -> Phân trang).

### ⛔ Hàng rào An toàn (Guardrails)
- **KHÔNG** thêm cột, trường lọc, hoặc nút bấm ngoài danh sách đã được định nghĩa ở mục 3.
- **KHÔNG** bỏ qua các trạng thái Trống / Đang tải / Lỗi (Empty, Loading, Error state) trong thiết kế luồng.

---

## 6. Kế hoạch Tự kiểm tra (Self-Verification)

| # | Hạng mục | Cách kiểm tra | Tiêu chuẩn Đạt |
|---|----------|---------------|-----------------|
| V-01 | Tìm kiếm | Nhập từ khóa | Bảng lọc đúng, không phân biệt hoa/thường. |
| V-02 | Trạng thái trống | Xóa hết dữ liệu | Hiện thông báo "Chưa có dữ liệu", không lỗi giao diện. |
| V-03 | Nhãn trạng thái | Kiểm tra bằng mắt | Không có màu gán cố định. |
| V-04 | Phân trang | Chuyển trang | Dữ liệu hiển thị đúng theo trang đã chọn. |

---

## 7. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|--------------------|-----------------------|-------------------|
| AC-01 | Bố cục chuẩn | So với mẫu thiết kế §4.2 | Thanh công cụ → Khối trạng thái → Bảng → Phân trang. |
| AC-02 | Tìm kiếm đúng | Nhập từ khóa | Chỉ hiện dòng khớp, không phân biệt hoa/thường. |
| AC-03 | Nhãn đúng màu | Kiểm tra bằng mắt | Tất cả lấy màu từ hệ thống tập trung. |
