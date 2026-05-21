---
id: US-XXX-YY-ZZ
title: "[Tên Biểu Mẫu Tạo/Sửa]"
bf: BF-XXX-YY
domain: CAP-XXX
status: draft
tags: [tag1, form]
---

# US-XXX-YY-ZZ: [Tên Biểu Mẫu Tạo/Sửa]

> **Tham chiếu:** BF-XXX-YY · Giao diện Mẫu §4.4 (Biểu mẫu)

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

1. **[RULE-FORM-01] Ràng buộc phụ thuộc:** `NẾU` [Phân loại] = 'A' `THÌ` [Trường B] chuyển thành bắt buộc điền.
2. **[RULE-FORM-02] Quy tắc nội dung:** Không cho phép chứa ký tự đặc biệt ở trường Mã.
3. **[RULE-FORM-03] Chống trùng lặp:** `NẾU` Mã đã tồn tại `THÌ` chặn lưu, báo lỗi "Mã đã tồn tại".

### 2.1. Thông số & Định mức (Metrics & Thresholds)
*(Định nghĩa các con số giới hạn, định mức hoặc SLA áp dụng cho biểu mẫu này)*
- **[METRIC-01] Giới hạn số lượng:** Tối đa tạo 50 bản ghi/ngày/user.
- **[METRIC-02] Giới hạn thời gian:** Khóa form không cho sửa sau 24h kể từ khi tạo.

---

## 3. Cấu trúc Các trường nhập liệu

**Bố cục:** [1 Cột / 2 Cột].

### 3.1. Thông tin đầu vào

| Tên trường | Loại hiển thị | Bắt buộc | Trường dữ liệu | Ghi chú & Quy tắc |
|------------|---------------|----------|----------------|-------------------|
| Tên [Thực thể] | Ô nhập chữ | Có | Tên | Tối đa 100 ký tự. Cảnh báo đỏ nếu bỏ trống. |
| Phân loại | Danh sách thả xuống | Có | Loại | Thay đổi loại → xóa trống trường cấp dưới. |
| Trạng thái | Công tắc bật/tắt | Không | Hoạt động | Mặc định: Bật. |
| Ghi chú | Ô nhập văn bản dài | Không | Ghi chú | Tối đa 500 ký tự. |

### 3.2. Ví dụ Dữ liệu mẫu

*Giúp AI và Lập trình viên tạo dữ liệu kiểm thử chính xác.*

| Tình huống | Dữ liệu đầu vào | Kết quả mong đợi |
|------------|-----------------|-------------------|
| Tạo thành công | Tên: "Nguyễn Văn A", Loại: "Học viên", Hoạt động: Bật | Lưu thành công, danh sách tải lại. |
| Trùng mã | Mã: "HV-24-0001" (đã tồn tại) | Báo lỗi "Mã đã tồn tại", chặn lưu. |
| Thiếu trường bắt buộc | Tên: (bỏ trống) | Viền đỏ ô Tên, chặn lưu. |

### 3.3. Nút hành động
| Nút | Loại hiển thị | Logic xử lý |
|-----|---------------|-------------|
| Hủy bỏ | Nút viền nhạt | Đóng hộp thoại, xóa trắng dữ liệu đang nhập. |
| Lưu | Nút màu nhấn | Kiểm tra → Lưu → Đóng → Tải lại danh sách. |

---

## 4. Xử lý Ngoại lệ

| # | Tình huống | Cách xử lý |
|---|-----------|-----------|
| 4.1 | Lưu khi biểu mẫu trống | Viền đỏ ô nhập liệu, hiện dòng lỗi bên dưới. |
| 4.2 | Bấm ra ngoài khi đang điền | Không tự đóng hộp thoại. Người dùng phải chủ động bấm Hủy. |

---

## 5. Chỉ dẫn cho AI Agent & Lập trình viên (Business Architecture)

- Tách biệt hoàn toàn phần xử lý giao diện (UI) và phần kiểm tra ràng buộc dữ liệu (Business Validation).
- Kiểm tra tính hợp lệ nghiệp vụ ngay khi người dùng nhập liệu (Real-time Validation) để tăng trải nghiệm.
- Áp dụng các quy tắc phân quyền (Authorization) trước khi cho phép lưu dữ liệu.

### ⛔ Hàng rào An toàn (Guardrails)
- **KHÔNG** thêm trường nhập liệu ngoài danh sách ở mục 3.1.
- **KHÔNG** thay đổi quy tắc kiểm tra hợp lệ nghiệp vụ ở mục 2 mà chưa được phê duyệt.
- **KHÔNG** bỏ qua bước xác nhận (Confirmation) cho các hành động có tính rủi ro cao (Xóa, Hủy, Khóa).

---

## 6. Kế hoạch Tự kiểm tra (Self-Verification)

| # | Hạng mục | Cách kiểm tra | Tiêu chuẩn Đạt |
|---|----------|---------------|-----------------|
| V-01 | Kiểm tra dữ liệu | Thử từng tình huống ở mục 3.2 | Kết quả khớp cột "Kết quả mong đợi". |
| V-02 | Ngoại lệ | Thử từng tình huống ở mục 4 | Hệ thống xử lý đúng mô tả. |
| V-03 | Nhãn trạng thái | Kiểm tra mọi nhãn | Không có màu gán cố định. |

---

## 7. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|--------------------|-----------------------|-------------------|
| AC-01 | Bố cục chuẩn | So với mẫu thiết kế §4.4 | Đúng bố cục [1 cột / 2 cột] đã chọn. |
| AC-02 | Kiểm tra hợp lệ | Để trống trường bắt buộc, bấm Lưu | Viền đỏ + dòng lỗi, nút Lưu bị chặn. |
| AC-03 | Lưu thành công | Điền đúng, bấm Lưu | Hộp thoại đóng, danh sách tải lại, hiện bản ghi mới. |
