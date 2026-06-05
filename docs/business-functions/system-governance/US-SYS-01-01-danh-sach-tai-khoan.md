---
id: US-SYS-01-01
title: Xem & Tìm kiếm danh sách Tài khoản
bf: BF-SYS-01
domain: CAP-SYS
status: defined
tags: [sys, ilm, user-account, list]
---

# US-SYS-01-01: Xem & Tìm kiếm danh sách Tài khoản (User Account List)

> **Tham chiếu:** BF-SYS-01 · `[POLICY-IAM-01]` · Design System §4.2 List Page Pattern

## 1. User Story

**Là một** System Admin,
**tôi muốn** xem danh sách tất cả tài khoản trên hệ thống, tìm kiếm theo tên/email/trạng thái và lọc qua bộ lọc,
**để** quản lý vòng đời tài khoản (Joiner-Mover-Leaver) hiệu quả, giám sát xem ai đang nắm quyền truy cập hệ thống.

---

## 2. Mô tả chi tiết giao diện

Màn hình hiển thị toàn bộ Tài khoản theo dạng bảng dữ liệu, tuân thủ **List Page Pattern** (§4.2). Nằm ở module `/app/system_accounts`.

### 2.1. Thanh công cụ (Toolbar)

| Thành phần | Loại | Mô tả | Ghi chú |
|------------|------|-------|---------|
| Chọn Chi nhánh | Danh sách thả xuống | Lọc nhanh theo chi nhánh trực thuộc của tài khoản. Mặc định: "Tất cả chi nhánh". | Ảnh hưởng đến số đếm trên thanh trạng thái. |
| Ô tìm kiếm | Ô nhập liệu | Gợi ý: "Tìm tên, username, email...". Tìm kiếm tự động khi gõ. | Không phân biệt hoa/thường. |
| Nút Tạo tài khoản | Nút chính | Mở màn hình tạo mới tài khoản (US-SYS-01-02). | Cần quyền `users:create`. |
| Nút Lọc | Nút biểu tượng | Mở bảng lọc nâng cao từ bên phải. Hiển thị số lượng bộ lọc đang áp dụng. | |

### 2.2. Thanh trạng thái (Status Tiles)

| Thành phần | Loại | Mô tả | Ghi chú |
|------------|------|-------|---------|
| Ô "Tất cả" | Nút | Hiển thị nhãn "ALL" + tổng số tài khoản. Bấm để xem tất cả. | Cố định bên trái. |
| Các ô trạng thái | Dãy nút (3 ô) | Mỗi ô hiển thị tên trạng thái + số lượng. Bấm để lọc/bỏ lọc. | Tuân thủ màu sắc hệ thống. |

**Danh sách 3 trạng thái:**

| Trạng thái | Tên hiển thị | Nhóm màu | Cách đếm |
|------------|-------------|----------|----------|
| Đang hoạt động | Active | Tích cực (xanh lá) | `status = active` |
| Bị khóa tạm | Locked | Cảnh báo (vàng) | `status = locked` |
| Vô hiệu hóa | Deactivated | Trung tính (xám/đỏ nhạt) | `status = deactivated` |

### 2.3. Bảng danh sách (Data Table)

*Lưu ý: Click vào dòng (Row Click) mặc định mở màn hình Chi tiết tài khoản.*

| Cột | Loại | Mô tả | Ghi chú |
|-----|------|-------|---------|
| Ô chọn | Ô chọn | Chọn từng bản ghi / Chọn tất cả. | Cố định bên trái. |
| Tài khoản | Văn bản + Ảnh | Hiển thị Avatar (chữ cái đầu/ảnh), Họ tên (in đậm), Username (kiểu chữ mã, màu phụ). | Lấy Họ Tên từ Person (MDM). Kèm nút thao tác hover. |
| Liên hệ | Văn bản | Hiển thị Email đăng nhập (in đậm), SĐT (từ Person). Kèm nút copy Email. | |
| Vai trò (Roles) | Nhóm nhãn | Hiển thị các Role đang gán. Tối đa hiển thị 2 nhãn, > 2 thì hiển thị "+N". | Nếu không có Role hiển thị "Chưa gán". |
| Chi nhánh | Văn bản | Tên các chi nhánh/phòng ban trực thuộc. | Dựa vào bối cảnh HR. |
| Ngày tạo | Văn bản | Ngày tạo tài khoản (VD: 18-05-2026). | |
| Đăng nhập cuối | Văn bản | Thời gian đăng nhập gần nhất. | |
| Trạng thái | Nhãn trạng thái | Nhãn `Active`, `Locked`, `Deactivated`. | Bo tròn nhẹ. |

### 2.4. Thao tác khi di chuột (Hover Actions)

Nằm ở cột cuối cùng khi hover vào một dòng. Các action này thay thế nút "Xem chi tiết" dư thừa (vì click dòng đã vào xem chi tiết).

| Thành phần | Loại | Mô tả | Ghi chú |
|------------|------|-------|---------|
| Nút Khóa / Mở khóa | Nút biểu tượng | Thay đổi trạng thái khóa tạm thời (Lock) / Mở khóa (Unlock) (US-SYS-01-03). | Icon ổ khóa. Chỉ hiển thị cho user chưa Deactivated. |
| Nút Reset MK | Nút biểu tượng | Cấp lại mật khẩu tạm (US-SYS-01-04). | Icon chìa khóa. |
| Nút Vô hiệu hóa | Nút biểu tượng | Vô hiệu hóa vĩnh viễn (Deactivate). | Icon thùng rác / gạch chéo. Nằm riêng biệt (màu đỏ). |

### 2.5. Bảng lọc nâng cao (Filter Drawer)

| Thành phần | Loại | Mô tả | Ghi chú |
|------------|------|-------|---------|
| Nhóm "Trạng thái" | Danh sách ô chọn | 3 trạng thái chính: Active, Locked, Deactivated. | |
| Nhóm "Vai trò (Role)" | Danh sách ô chọn | Danh sách các Role hiện có trong hệ thống. | Tự động sinh từ `BF-SYS-04`. |
| Nhóm "Topic (Phân hệ)" | Danh sách ô chọn | Danh sách Topic phân quyền (VD: Academic, System, Sale). | |
| Nút Xóa tất cả | Nút văn bản | Đặt lại tất cả bộ lọc về mặc định. | |

### 2.6. Chân bảng (Pagination)

Tuân thủ **List Page Pattern** (§4.2): Mặc định 20 bản ghi/trang, tùy chọn [20, 50, 100].

| Thành phần | Loại | Mô tả | Ghi chú |
|------------|------|-------|---------|
| Tổng kết | Nhãn | "Hiển thị {số} bản ghi" | |
| Số dòng/trang | Dropdown | Chọn số dòng hiển thị mỗi trang: 20, 50, 100. | Khi đổi, quay về trang 1. |
| Phân trang | Nhóm nút | Nút Trang trước, các số trang, Nút Trang sau. | Vô hiệu hóa hợp lý ở đầu/cuối. |

---

## 3. Trường hợp ngoại lệ (Corner Cases)

| # | Trường hợp | Hành vi mong đợi |
|---|-----------|-----------------|
| 3.1 | Không có dữ liệu | Hiển thị EmptyState (Chưa có tài khoản nào), thanh trạng thái = 0. |
| 3.2 | Tìm kiếm không có kết quả | Bảng trống (EmptyState tìm kiếm), chân bảng hiển thị "0 bản ghi". |
| 3.3 | Chọn Role + Trạng thái cùng lúc | Lọc theo logic AND (Tài khoản thoả mãn cả 2 điều kiện). |
| 3.4 | Tài khoản chưa liên kết Person | Cột Tài khoản: Bỏ trống Họ tên, chỉ hiển thị Username. Avatar xám. |
| 3.5 | Hover vào tài khoản System Admin gốc | Vô hiệu hóa các nút Hover Actions (Không cho tự khóa chính mình hoặc admin root). |
| 3.6 | Đổi số dòng trang 3 sang 50/trang | Tính lại tổng số trang và tự động reset về Trang 1. |

---

## 4. Tiêu chí chấp nhận (Acceptance Criteria)

- [ ] Hiển thị chính xác cấu trúc Toolbar, Status Tiles, Data Table và Pagination.
- [ ] Dropdown Chi nhánh trên toolbar kết nối chính xác và lọc danh sách real-time.
- [ ] 3 ô trạng thái trên Status Tiles đếm đúng số lượng, bấm vào thì toggle lọc danh sách.
- [ ] Ô tìm kiếm tìm được dựa trên Tên hiển thị (Person), Username, và Email đăng nhập.
- [ ] Nhóm nhãn Vai trò (Roles) trong bảng tự động gom nhóm `+N` nếu > 2 roles.
- [ ] Hover vào dòng hiện đúng các nút thao tác (Khóa, Reset MK, Vô hiệu). Không hiện lỗi.
- [ ] Click bất kỳ đâu trên dòng sẽ điều hướng vào màn hình Chi tiết tài khoản.
- [ ] Bảng lọc nâng cao hoạt động chuẩn logic AND khi mix Trạng thái, Role, Topic.
- [ ] Chân bảng (Pagination) xử lý mượt mà khi đổi giới hạn bản ghi/trang.
