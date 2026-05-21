---
id: US-SYS-02-03
title: "Quản lý Danh mục Từ điển (Chức danh, Hợp đồng)"
bf: BF-SYS-02
domain: CAP-SYS
status: draft
tags: [sys, dictionary, master-data, category, list]
---

# US-SYS-02-03: Quản lý Danh mục Từ điển (Chức danh, Loại hợp đồng)

> **Tham chiếu:** BF-SYS-02 · Giao diện Mẫu §4.2 (Danh sách dạng Bảng / Inline Edit)

## 1. Yêu cầu Người dùng (User Story)
**Là một** Quản trị Hệ thống (System Admin), **tôi muốn** có một giao diện để định nghĩa và quản lý các danh mục động (Ví dụ: Danh mục Chức danh, Danh mục Loại Hợp đồng), **để** khối Nhân sự có danh sách chọn khi tạo hồ sơ hoặc điều chuyển nhân viên, thay vì phải gắn cứng vào phần mềm.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Quản lý từ điển độc lập, cung cấp dữ liệu cho toàn hệ thống.
> - [x] **N**egotiable — Có thể dùng bảng với chế độ chỉnh sửa trực tiếp để nhập liệu nhanh.
> - [x] **V**aluable — Nếu không có danh mục này, HR không thể gán Chức danh cho nhân viên.
> - [x] **E**stimable — Dạng màn hình danh sách cơ bản.
> - [x] **S**mall — Chỉ làm việc với 1 bảng dữ liệu (Loại-Từ khóa-Giá trị).
> - [x] **T**estable — Có quy tắc cấm xóa dữ liệu đang được sử dụng.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-SYS-DICT-01] Loại Danh mục:** Quản lý theo nhóm. Trong phạm vi tài liệu này, hỗ trợ 2 nhóm chính: `JOB_TITLE` (Chức danh) và `CONTRACT_TYPE` (Loại hợp đồng).
2. **[RULE-SYS-DICT-02] Không xóa lịch sử:** Bất kỳ giá trị từ điển nào đã được gán cho một Nhân sự thì tuyệt đối KHÔNG ĐƯỢC XÓA vĩnh viễn. Thay vào đó, có thể Ẩn/Vô hiệu hóa để nó không hiện lên trong Danh sách chọn lúc tạo mới nữa, nhưng vẫn hiển thị bình thường trong lịch sử cũ.
3. **[RULE-SYS-DICT-03] Tính duy nhất:** Tên của một mục từ điển phải là duy nhất trong cùng một nhóm (Không thể có 2 chức danh tên là "Giáo viên").

---

## 3. Cấu trúc Giao diện & Dữ liệu

**Bố cục:** Màn hình có 1 cột danh mục bên trái (để chọn Loại Danh mục) và 1 Bảng dữ liệu bên phải.

### 3.1. Các nút Thao tác
| Nút | Vị trí | Quyền hạn | Chức năng |
|-----|--------|-----------|-----------|
| + Thêm Dòng mới | Góc trên bảng | Admin | Thêm 1 dòng trống vào bảng để nhập liệu ngay tại chỗ. |
| Lưu thay đổi | Đầu/Cuối bảng | Admin | Lưu hàng loạt các chỉnh sửa/thêm mới. |
| Vô hiệu hóa | Cột thao tác | Admin | Tắt trạng thái hoạt động của một dòng. |

### 3.2. Bảng dữ liệu
*(Ví dụ khi đang chọn Loại danh mục: Chức danh - JOB_TITLE)*

| Cột | Phân loại | Ghi chú |
|-----|-----------|---------|
| Tên hiển thị | Ô nhập liệu | VD: "Giảng viên Cơ hữu", "Giám đốc Chi nhánh". Bắt buộc. |
| Giá trị (Mã) | Ô nhập liệu | VD: `TEACHER_FT`, `BRANCH_MANAGER`. Dùng để định danh trong cơ sở dữ liệu. Phải viết liền không dấu. |
| Mô tả | Ô nhập liệu | Mô tả ngắn về chức danh. |
| Trạng thái | Công tắc bật/tắt | Kích hoạt (Hiện trong Danh sách chọn) / Vô hiệu hóa (Ẩn). |
| Thao tác | Nút biểu tượng | Xóa dòng (Nếu chưa lưu hoặc chưa bị sử dụng). |

---

## 4. Xử lý Ngoại lệ
| # | Tình huống | Cách xử lý |
|---|-----------|-----------|
| 4.1 | Xóa Chức danh đang có người dùng | Ẩn nút Xóa vĩnh viễn (Thùng rác), chỉ hiện nút Công tắc tắt kích hoạt. Hoặc nếu cố xóa, hệ thống trả về lỗi: "Chức danh này đang được sử dụng bởi 15 nhân sự. Chỉ có thể vô hiệu hóa." |
| 4.2 | Nhập trùng Giá trị (Mã) | Báo lỗi viền đỏ ô nhập: "Mã này đã tồn tại". |

---

## 5. Chỉ dẫn cho AI Agent & Lập trình viên (Business Architecture)

- Sử dụng cơ chế Bảng dữ liệu có thể chỉnh sửa trực tiếp vì người dùng thường cần thêm hàng loạt nhiều chức danh một lúc.
- Các màn hình khác trong hệ thống khi tải danh sách chọn (ví dụ Biểu mẫu Tạo nhân sự) bắt buộc phải lọc dữ liệu theo điều kiện Trạng thái là "Đang kích hoạt". Không tải các chức danh đã vô hiệu hóa.

### ⛔ Hàng rào An toàn (Guardrails)
- **KHÔNG** xóa dòng dữ liệu trực tiếp trong CSDL nếu đã có bất kỳ liên kết dữ liệu nào trỏ tới.
- **KHÔNG** gắn cứng (hardcode) danh sách chức danh vào mã nguồn (Vì tính chất mở rộng của các chuỗi trung tâm thường xuyên sinh ra phòng ban/chức danh mới).

---

## 6. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|--------------------|-----------------------|-------------------|
| AC-01 | Thêm chức danh mới | Chọn thẻ "Chức danh", bấm "Thêm dòng mới", nhập "Trợ giảng", Lưu. | Bảng hiện chức danh mới. Sang màn hình Tạo Nhân sự, danh sách Chức danh xuất hiện "Trợ giảng". |
| AC-02 | Tắt chức danh cũ | Tắt Công tắc của chức danh "Tư vấn viên". | "Tư vấn viên" bị mờ. Sang màn hình Tạo Nhân sự, danh sách chọn không còn "Tư vấn viên". Các nhân sự cũ vẫn giữ nguyên thông tin. |
| AC-03 | Chặn xóa chức danh đang dùng | Cố tình xóa chức danh "Giáo viên". | Hệ thống chặn và trả về lỗi "Đang được sử dụng, không thể xóa". |
