---
id: US-ORG-02-03
title: "Tạo mới Đơn vị Tổ chức (Phòng ban/Vùng)"
bf: BF-ORG-02
domain: CAP-HR
status: draft
tags: [org, unit, form, create]
---

# US-ORG-02-03: Tạo mới Đơn vị Tổ chức

> **Tham chiếu:** BF-ORG-02 · Giao diện Mẫu §4.4 (Biểu mẫu)

## 1. Yêu cầu Người dùng (User Story)
**Là một** Quản trị Hệ thống (System Admin) hoặc Giám đốc Nhân sự, **tôi muốn** có một biểu mẫu để tạo mới một Đơn vị tổ chức (Phòng ban, Vùng, Tổ nhóm), **để** mở rộng cơ cấu báo cáo và phục vụ việc phân bổ nhân sự khi công ty phát triển.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Luồng tạo độc lập với các chức năng xem sơ đồ hay xem danh sách.
> - [x] **N**egotiable — Biểu mẫu có thể hiển thị dưới dạng trang mới hoặc hộp thoại nổi.
> - [x] **V**aluable — Là bước cơ sở để xây dựng sơ đồ tổ chức và phân quyền dữ liệu.
> - [x] **E**stimable — Dựa trên số lượng trường thông tin.
> - [x] **S**mall — Chỉ tập trung vào việc thu thập thông tin cơ bản của đơn vị.
> - [x] **T**estable — Có quy tắc kiểm tra tính hợp lệ của Đơn vị cha.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-ORG-UNIT-01]:** Mỗi đơn vị tổ chức phải có một Đơn vị cha (ngoại trừ đơn vị gốc trên cùng của công ty). Nếu chọn Đơn vị cha thì đơn vị đang tạo sẽ tự động trở thành đơn vị con trực thuộc.
2. **[RULE-ORG-UNIT-02]:** Phân loại đơn vị: Tùy thuộc vào quy mô (Ví dụ: Công ty -> Vùng -> Khối -> Chi nhánh -> Phòng ban -> Tổ nhóm). Loại đơn vị phải tuân thủ cấp bậc (Không thể đặt Khối nằm dưới Phòng ban).
3. **[RULE-ORG-UNIT-03]:** Mã đơn vị phải là duy nhất trên toàn hệ thống để phục vụ cho các báo cáo hợp nhất.

---

## 3. Cấu trúc Giao diện & Dữ liệu

**Bố cục:** Biểu mẫu dạng hộp thoại nổi (Popup/Modal) chứa các khối thông tin cơ bản.

### 3.1. Các trường thông tin

| Khu vực | Trường | Bắt buộc | Validation | Ghi chú |
|---------|--------|----------|------------|---------|
| **Thông tin chung** | Đơn vị cha | Không | Tìm kiếm đơn vị | Bỏ trống nếu là đơn vị gốc. |
| | Tên đơn vị | Có | Lớn hơn 2 ký tự | |
| | Mã đơn vị | Có | Chữ hoa không dấu, không khoảng trắng | Bất biến sau khi tạo. |
| | Loại đơn vị | Có | Danh sách chọn | Vùng / Khối / Phòng ban / Tổ nhóm. |
| **Quản lý** | Trưởng đơn vị | Không | Tìm kiếm nhân sự | Có thể để trống và bổ sung sau. |
| | Mô tả chức năng | Không | Nhập tự do | |

### 3.2. Nút thao tác
| Nút | Loại | Vị trí | Logic xử lý |
|-----|------|--------|-------------|
| Lưu & Đóng | Primary | Dưới cùng bên phải | Lưu dữ liệu -> Đóng hộp thoại -> Tải lại danh sách sơ đồ. |
| Hủy bỏ | Ghost | Dưới cùng bên phải | Đóng hộp thoại không lưu. |

---

## 4. Xử lý Ngoại lệ
| # | Tình huống | Cách xử lý |
|---|-----------|-----------|
| 4.1 | Nhập trùng Mã đơn vị | Báo lỗi ngay tại ô nhập: "Mã đơn vị này đã tồn tại, vui lòng nhập mã khác." |
| 4.2 | Lỗi kết nối / Lỗi hệ thống | Hiển thị thông báo nổi báo lỗi chung và giữ nguyên dữ liệu đang nhập để người dùng không phải nhập lại. |

---

## 5. Chỉ dẫn cho AI Agent & Lập trình viên (Business Architecture)

- Tách biệt logic nhập liệu (Biểu mẫu) với logic hiển thị danh sách (Sơ đồ tổ chức).
- Mã đơn vị là trường định danh quan trọng, cần kiểm tra trùng lặp qua hệ thống trước khi cho phép lưu.

### ⛔ Hàng rào An toàn (Guardrails)
- **KHÔNG** gộp màn hình này vào tính năng Xem chi tiết hay Xem sơ đồ. Nó phải là một Component Form riêng biệt để có thể tái sử dụng (gọi từ nhiều nơi).

---

## 6. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|--------------------|-----------------------|-------------------|
| AC-01 | Mở biểu mẫu | Bấm "Tạo Đơn vị mới" | Hộp thoại nhập liệu xuất hiện rõ ràng với đầy đủ các trường yêu cầu. |
| AC-02 | Ràng buộc mã | Nhập mã `MKT` đã tồn tại | Báo lỗi viền đỏ tại ô Mã đơn vị, nút Lưu bị vô hiệu hóa. |
| AC-03 | Tạo thành công | Điền thông tin hợp lệ và Lưu | Hộp thoại đóng, hiển thị thông báo thành công. Đơn vị mới xuất hiện trên Sơ đồ tổ chức ở đúng vị trí cấp bậc. |
