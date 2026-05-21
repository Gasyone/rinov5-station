---
id: US-ORG-01-05
title: "Quản lý Chi tiết Chi nhánh"
bf: BF-ORG-01
domain: CAP-HR
status: draft
tags: [org, branch, detail, update]
---

# US-ORG-01-05: Quản lý Chi tiết Chi nhánh

> **Tham chiếu:** BF-ORG-01 · Giao diện Mẫu §4.3 (Trang chi tiết)

## 1. Yêu cầu Người dùng (User Story)
**Là một** Quản trị viên (Admin), **tôi muốn** có một màn hình chi tiết quản lý toàn diện thông tin, cơ sở vật chất và giờ hoạt động của một chi nhánh, **để** có thể theo dõi và cập nhật toàn bộ cấu hình vật lý của trung tâm đó.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai độc lập với màn hình danh sách.
> - [x] **N**egotiable — Số lượng thẻ (Tab) có thể mở rộng trong tương lai.
> - [x] **V**aluable — Là nơi cấu hình mọi yếu tố ảnh hưởng đến xếp lịch.
> - [x] **E**stimable — Rõ ràng cấu trúc 2 cột.
> - [x] **S**mall — Hoàn thành trong 1 vòng phát triển dựa trên giao diện mẫu.
> - [x] **T**estable — Có tiêu chí lưu lịch sử sửa đổi.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-BRANCH-DETAIL-01]:** Mã chi nhánh là trường dữ liệu không thể thay đổi sau khi khởi tạo (Định danh gốc).
2. **[RULE-BRANCH-DETAIL-02]:** Mọi thay đổi thông tin ở tất cả các thẻ (Tab) phải tự động ghi nhận vào Lịch sử hoạt động.

---

## 3. Cấu trúc Giao diện & Dữ liệu

**Bố cục:** 2 cột (Tóm tắt 30% / Chi tiết 70%). Cột Chi tiết có chứa hệ thống Thẻ (Tabs).

### 3.1. Tiêu đề & Nút thao tác
| Nút | Loại | Logic chuyển trạng thái | Điều kiện |
|-----|------|-------------------------|-----------|
| Sửa thông tin | Nút phụ | Kích hoạt chế độ sửa ở Thẻ hiện tại | |
| Khóa chi nhánh | Nút màu cảnh báo | Đổi trạng thái sang "Vô hiệu hóa", chặn mọi thao tác xếp lịch mới | Luôn hiển thị trừ khi đã khóa |

### 3.2. Cột trái — Tóm tắt (Chỉ xem)
| Thông tin | Loại | Trường | Ghi chú |
|-----------|------|--------|---------|
| Tên chi nhánh | Chữ đậm lớn | Tên đối tượng | |
| Trạng thái | Nhãn màu | Trạng thái (Setup/Active/Inactive) | Theo bộ màu chuẩn |
| Mã chi nhánh | Chữ nhỏ mờ | Mã định danh | Không cho phép sửa |
| Thông tin liên hệ | Danh sách dọc | SĐT, Tỉnh thành, Địa chỉ | Rút gọn từ Thông tin chung |

### 3.3. Cột phải — Chi tiết (Hệ thống Thẻ - Tabs)

**Thẻ 1: Thông tin chung (Mặc định)**
| Khu vực | Loại | Trường | Ghi chú |
|---------|------|--------|---------|
| Thông tin cơ bản | Tiêu đề-Giá trị | Tên, Loại hình | |
| Liên hệ | Tiêu đề-Giá trị | SĐT, Tỉnh thành, Địa chỉ, Bản đồ | |
*(Có nút Sửa để cập nhật các thông tin này)*

**Thẻ 2: Giờ hoạt động**
*(Hiển thị và quản lý cấu hình giờ hoạt động theo tài liệu `US-ORG-01-01`)*

**Thẻ 3: Phòng học**
*(Hiển thị và quản lý danh sách phòng học theo tài liệu `US-ORG-01-02`)*

### 3.4. Lịch sử hoạt động
| Thành phần | Loại | Dữ liệu | Hoạt động |
|------------|------|---------|-----------|
| Dòng thời gian | Danh sách dọc | Nhật ký | Mới nhất trên cùng. Ghi nhận khi có sửa đổi Tên, Địa chỉ, Thêm/Xóa phòng học. |

---

## 4. Xử lý Ngoại lệ
| # | Tình huống | Cách xử lý |
|---|-----------|-----------|
| 4.1 | Mã chi nhánh không tồn tại | Hiện thông báo "Không tìm thấy dữ liệu". Điều hướng về màn hình Danh sách chi nhánh. |
| 4.2 | Thao tác Khóa chi nhánh | Bắt buộc hiện Hộp thoại Xác nhận nguy hiểm trước khi thực thi. |

---

## 5. Chỉ dẫn cho AI Agent & Lập trình viên (Business Architecture)

- Tuân thủ chặt chẽ ranh giới trách nhiệm: Giao diện chi tiết đóng vai trò là "Orchestrator", nó gọi và hiển thị các Component con như `OperatingHoursTab` (`US-ORG-01-01`) và `RoomsTab` (`US-ORG-01-02`).
- Các hành động nguy hiểm (Khóa chi nhánh) phải bắt buộc thông qua hệ thống Xác nhận (`<ConfirmDialog>`) thống nhất.
- Áp dụng các quy tắc phân quyền (Authorization) trước khi hiển thị các nút thao tác.

### ⛔ Hàng rào An toàn (Guardrails)
- **KHÔNG** ôm đồm toàn bộ logic lưu dữ liệu của Giờ hoạt động và Phòng học vào file Screen này. Phải tách Component.
- **KHÔNG** cho phép sửa Mã chi nhánh.
- **KHÔNG** bỏ qua bước xác nhận cho hành động Khóa chi nhánh.

---

## 6. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|--------------------|-----------------------|-------------------|
| AC-01 | Bố cục 2 cột | So với §4.3 | 2 cột trên máy tính, 1 cột trên điện thoại. |
| AC-02 | Chuyển đổi Thẻ (Tabs) | Bấm qua lại giữa Thông tin chung, Giờ hoạt động, Phòng học | Nội dung cột phải thay đổi tương ứng, URL có thể cập nhật query param. |
| AC-03 | Lịch sử cập nhật | Sửa tên chi nhánh và Lưu | Tên chi nhánh được cập nhật, Lịch sử hoạt động tự động thêm 1 dòng ghi nhận thay đổi. |
