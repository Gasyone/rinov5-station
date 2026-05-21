---
id: US-ORG-01-03
title: "Quản lý Danh sách Chi nhánh"
bf: BF-ORG-01
domain: CAP-HR
status: draft
tags: [org, branch, list, crud]
---

# US-ORG-01-03: Quản lý Danh sách Chi nhánh (Branch List)

> **Tham chiếu:** BF-ORG-01 · Giao diện Mẫu §4.2 (Danh sách dạng Bảng)

## 1. Yêu cầu Người dùng (User Story)
**Là một** Quản trị viên (Admin) / Quản lý Vận hành, **tôi muốn** xem, tìm kiếm và quản lý toàn bộ danh sách các cơ sở/chi nhánh trên toàn hệ thống, **để** kiểm soát tình trạng hoạt động và truy cập nhanh vào cấu hình chi tiết của từng cơ sở.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Là màn hình độc lập, điểm chạm đầu tiên của Module Quản lý Chi nhánh.
> - [x] **N**egotiable — Có thể hiển thị dạng bảng hoặc dạng thẻ.
> - [x] **V**aluable — Nếu không có danh sách, không thể chọn chi nhánh để cài đặt thông số hoặc đóng cửa chi nhánh.
> - [x] **E**stimable — Dựa trên khung bảng dữ liệu chuẩn.
> - [x] **S**mall — Chỉ làm nhiệm vụ hiển thị và đổi trạng thái nhanh.
> - [x] **T**estable — Có quy tắc chặn xóa vĩnh viễn chi nhánh đang có học sinh.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-ORG-BRANCH-01] Vòng đời Trạng thái (Status Lifecycle):** 
   - `Setup`: Mới khởi tạo, đang setup phòng học. Chưa cho phép đưa vào luồng vận hành (OPS).
   - `Active`: Đang mở cửa hoạt động.
   - `Inactive`: Tạm đóng cửa (Ví dụ: sửa chữa, dịch bệnh). Nhân sự vẫn thuộc chi nhánh nhưng không xếp lịch học mới được.
2. **[RULE-ORG-BRANCH-02] Nguyên tắc Xóa (Deletion Rule):** Tuyệt đối KHÔNG được xóa vĩnh viễn một chi nhánh nếu chi nhánh đó đã từng phát sinh dữ liệu (Doanh thu, Nhân sự, hoặc Buổi học). Chỉ được phép chuyển sang trạng thái `Inactive` (Xóa mềm).

---

## 3. Cấu trúc Giao diện & Dữ liệu

**Bố cục:** Màn hình danh sách tiêu chuẩn với Thanh công cụ, Bộ lọc và Bảng dữ liệu.

### 3.1. Các nút Thao tác (Action Buttons)
| Nút | Vị trí | Quyền hạn | Chức năng |
|-----|--------|-----------|-----------|
| + Mở Chi nhánh mới | Góc trên bên phải | Admin | Chuyển hướng sang màn hình Tạo mới (`US-ORG-01-04`). |
| Chỉnh sửa | Cột hành động (Bảng) | Admin / Ops | Vào trang Chi tiết Chi nhánh để sửa cấu hình. |
| Khóa / Mở khóa | Cột hành động (Bảng) | Admin | Đổi trạng thái `Active` <-> `Inactive`. Phải qua Hộp thoại xác nhận. |

### 3.2. Bảng dữ liệu
| Cột | Phân loại | Ghi chú |
|-----|-----------|---------|
| Tên Chi nhánh | Văn bản + Link | Bấm vào sẽ mở trang Chi tiết. Kèm Mã chi nhánh ở dạng chữ phụ đính kèm phía dưới. |
| Khu vực / Vùng | Văn bản | Lấy từ sơ đồ tổ chức mà chi nhánh đang được gắn vào. |
| Số Phòng học | Số lượng | Tổng số phòng khai báo trong `US-ORG-01-02`. |
| Trạng thái | Nhãn màu | Hiển thị trạng thái (Mới khởi tạo / Đang hoạt động / Tạm đóng). |
| Thao tác | Nút biểu tượng | Danh sách tùy chọn: Sửa, Khóa, Xóa. |

### 3.3. Bộ lọc & Tìm kiếm
- **Tìm kiếm nhanh:** Tên chi nhánh, Mã chi nhánh.
- **Bộ lọc:** Trạng thái (Danh sách chọn), Vùng/Khu vực quản lý (Cây thư mục).

---

## 4. Xử lý Ngoại lệ
| # | Tình huống | Cách xử lý |
|---|-----------|-----------|
| 4.1 | Xóa Chi nhánh đã có giao dịch/nhân sự | Hệ thống chặn lệnh Xóa, hiện hộp thoại: "Chi nhánh đã phát sinh dữ liệu vận hành. Bạn chỉ có thể Tạm dừng (Khóa) chi nhánh này". |

---

## 5. Chỉ dẫn cho AI Agent & Lập trình viên (Business Architecture)

- Sử dụng `DataTableFrame` từ thư viện dùng chung.
- Việc vô hiệu hóa (`Inactive`) chi nhánh sẽ ảnh hưởng đến thuật toán xếp lịch (không cho xếp lịch mới), nhưng không làm mất lịch cũ. Cần đảm bảo cờ (flag) status được quản lý đúng.

### ⛔ Hàng rào An toàn (Guardrails)
- **KHÔNG** dùng lệnh xóa trực tiếp (`DELETE FROM...`). Tất cả hành động xóa chi nhánh phải đi qua hàm kiểm tra liên kết dữ liệu (Foreign Key constraints).
- **KHÔNG** đổi màu Badge Trạng thái bằng CSS inline. Phải gọi hàm `getStatusBadgeClass`.
- Mọi hành động Khóa/Mở khóa phải bọc trong `<ConfirmDialog>`.

---

## 6. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|--------------------|-----------------------|-------------------|
| AC-01 | Hiển thị danh sách | Mở màn hình danh sách chi nhánh. | Bảng hiển thị tối đa 20 dòng/trang, có phân trang, đúng màu trạng thái. |
| AC-02 | Chặn xóa vật lý | Bấm nút Xóa một chi nhánh đã hoạt động 1 năm. | Nhận thông báo lỗi không thể xóa, chỉ cho phép Vô hiệu hóa. Dữ liệu không bị mất. |
| AC-03 | Đổi trạng thái an toàn | Bấm "Khóa" chi nhánh Cầu Giấy. | Hiện Hộp thoại xác nhận. Xác nhận xong, trạng thái đổi thành "Đã khóa" và hiển thị nhãn màu xám. |
