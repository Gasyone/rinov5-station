---
id: US-HR-01-02
title: "Tạo mới Nhân sự"
bf: BF-HR-01
domain: CAP-HR
status: draft
tags: [hr, employee, form, create]
---

# US-HR-01-02: Tạo mới Nhân sự (Tiếp nhận)

> **Tham chiếu:** BF-HR-01 · Giao diện Mẫu §4.4 (Biểu mẫu)

## 1. Yêu cầu Người dùng (User Story)
**Là một** Chuyên viên Nhân sự (HR), **tôi muốn** có một biểu mẫu để tạo mới hồ sơ nhân sự, **để** tiếp nhận nhân viên mới vào hệ thống một cách chuẩn hóa và liên kết với dữ liệu định danh gốc.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Luồng tạo độc lập với các chức năng khác.
> - [x] **N**egotiable — Giao diện chia bước hoặc chung một trang có thể thương lượng.
> - [x] **V**aluable — Là bước đầu tiên để quản lý vòng đời nhân sự.
> - [x] **E**stimable — Dựa trên số lượng trường thông tin.
> - [x] **S**mall — Biểu mẫu chỉ tập trung vào nghiệp vụ tiếp nhận ban đầu.
> - [x] **T**estable — Có tiêu chí kiểm tra dữ liệu rõ ràng.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-HR-CREATE-01]:** Cấu trúc 3 tầng (Person -> Worker). Khi tạo mới Nhân sự, người dùng có 2 lựa chọn:
   - Tìm và chọn một `Person` đã có sẵn trong MDM (theo SĐT, Email, CCCD).
   - Tạo mới `Person` đồng thời với tạo Nhân sự (nếu người này chưa từng tồn tại trên hệ thống).
2. **[RULE-HR-CREATE-02]:** Mã nhân viên phải được sinh tự động theo quy tắc của doanh nghiệp (ví dụ: `NV-YYYY-XXXX`) và là duy nhất.
3. **[RULE-HR-CREATE-03]:** Bắt buộc phải nhập ít nhất 1 Vị trí công tác ban đầu bao gồm: Chi nhánh trực thuộc, Phòng ban, và Chức danh. Vị trí đầu tiên này mặc định là Vị trí Chính. Việc cập nhật và điều chuyển sẽ diễn ra ở màn hình Chi tiết nhân sự (`US-HR-01-03`).

---

## 3. Cấu trúc Giao diện & Dữ liệu

**Bố cục:** Biểu mẫu dài chia thành các khối thông tin, hoặc chia theo trình tự các bước. Ưu tiên chia khối thông tin trên 1 trang để nhập liệu nhanh.

### 3.1. Các trường thông tin

| Khu vực | Trường | Bắt buộc | Validation | Ghi chú |
|---------|--------|----------|------------|---------|
| **1. Tra cứu Person** | SĐT / CCCD | Có | Tìm kiếm trong hệ thống | Nếu có, tự động điền các trường ở Khu vực 2. |
| **2. Thông tin cá nhân** | Mã nhân viên | | Chỉ đọc | Hệ thống tự sinh khi tạo mới. |
| | Họ và tên | Có | Lớn hơn 2 ký tự | |
| | Số điện thoại | Có | Chuẩn số điện thoại VN | |
| | Email | Không | Chuẩn Email | |
| | Ngày sinh | Không | Phải đủ 18 tuổi | |
| | Giới tính | Không | | |
| **3. Thông tin công tác** | Chi nhánh | Có | Danh sách chọn | |
| | Phòng ban | Có | Danh sách chọn, phụ thuộc Chi nhánh | |
| | Chức danh | Có | Danh sách chọn | |
| | Ngày nhận việc | Có | Bảng chọn ngày | Mặc định là ngày hiện tại. |
| | Loại hợp đồng | Có | Toàn thời gian / Bán thời gian | |

### 3.2. Nút thao tác
| Nút | Loại | Vị trí | Logic xử lý |
|-----|------|--------|-------------|
| Lưu & Đóng | Primary | Dưới cùng bên phải | Lưu dữ liệu -> Chuyển hướng về Danh sách. |
| Lưu & Tạo tiếp | Secondary | Dưới cùng bên phải | Lưu dữ liệu -> Xóa trắng biểu mẫu để nhập người tiếp theo. |
| Hủy bỏ | Ghost | Dưới cùng bên phải | Hủy thao tác -> Trở về trang trước. |

---

## 4. Xử lý Ngoại lệ
| # | Tình huống | Cách xử lý |
|---|-----------|-----------|
| 4.1 | Nhập CCCD bị trùng với Hồ sơ gốc đã tồn tại | Cảnh báo: "Hồ sơ cá nhân với CCCD này đã tồn tại. Xin vui lòng chọn từ danh sách." Cấm tạo trùng lặp. |
| 4.2 | Nhân sự này đã từng làm việc và nghỉ việc | Cảnh báo: "Người này đã từng là nhân viên cũ. Khôi phục hồ sơ?" -> Mở chức năng Khôi phục thay vì Tạo mới. |
| 4.3 | Lỗi kết nối / Lỗi lưu dữ liệu | Hiển thị thông báo nổi báo lỗi chung và giữ nguyên dữ liệu đang nhập. |

---

## 5. Chỉ dẫn cho AI Agent & Lập trình viên (Business Architecture)

- Tách biệt hoàn toàn phần xử lý giao diện và phần kiểm tra ràng buộc nghiệp vụ.
- Yêu cầu này chỉ áp dụng cho việc Tạo mới. Việc Cập nhật thông tin sẽ chuyển sang `US-HR-01-03` (Màn hình Chi tiết).
- Kiểm tra tính hợp lệ nghiệp vụ ngay khi người dùng nhập liệu để tăng trải nghiệm.
- Áp dụng các quy tắc phân quyền (Authorization) trước khi cho phép lưu dữ liệu.

### ⛔ Hàng rào An toàn (Guardrails)
- **KHÔNG** thêm trường nhập liệu ngoài danh sách ở mục 3.1.
- **KHÔNG** thay đổi quy tắc kiểm tra hợp lệ nghiệp vụ ở mục 2 mà chưa được phê duyệt.
- **KHÔNG** bỏ qua bước xác nhận (Confirmation) cho các hành động Hủy bỏ nếu đã có dữ liệu nhập dở dang.

---

## 6. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|--------------------|-----------------------|-------------------|
| AC-01 | Tính toàn vẹn Hồ sơ gốc | Nhập một SĐT đã tồn tại trong hệ thống | Hệ thống tự động gợi ý và điền các trường Họ tên, CCCD mà không tạo ra bản ghi thừa. |
| AC-02 | Ràng buộc tuổi | Nhập ngày sinh cách đây 15 năm | Báo lỗi ngay tại ô nhập: "Nhân viên phải từ 18 tuổi trở lên" và vô hiệu hóa nút Lưu. |
| AC-03 | Tạo thành công | Điền đủ trường hợp lệ và ấn Lưu | Sinh ra bản ghi Nhân sự mới với đầy đủ vị trí công tác. Hệ thống báo thông báo nổi màu xanh. |
| AC-04 | Hủy bỏ an toàn | Nhập dở thông tin rồi bấm Hủy | Hiện hộp thoại: "Bạn có chắc muốn thoát? Dữ liệu chưa lưu sẽ bị mất." |
