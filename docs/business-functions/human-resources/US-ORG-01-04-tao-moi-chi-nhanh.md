---
id: US-ORG-01-04
title: "Tạo mới Chi nhánh"
bf: BF-ORG-01
domain: CAP-HR
status: draft
tags: [org, branch, create, form]
---

# US-ORG-01-04: Tạo mới Chi nhánh (Branch Form)

> **Tham chiếu:** BF-ORG-01 · Giao diện Mẫu §4.4 (Biểu mẫu)

## 1. Yêu cầu Người dùng (User Story)
**Là một** Quản trị viên (Admin), **tôi muốn** có một biểu mẫu để khởi tạo một chi nhánh/cơ sở vật lý mới (Tên, Mã, Địa chỉ), **để** hệ thống có căn cứ vật lý phục vụ cho việc xếp lớp và điều phối giáo viên.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Là bước đầu tiên bắt buộc phải làm trước khi có thể xếp lớp ở một cơ sở mới.
> - [x] **N**egotiable — Có thể làm dạng hộp thoại nổi hoặc bảng trượt bên phải.
> - [x] **V**aluable — Cung cấp hồ sơ gốc cho 1 địa điểm kinh doanh.
> - [x] **E**stimable — Logic Thêm mới truyền thống.
> - [x] **S**mall — Biểu mẫu tập trung vào các trường định danh cơ bản (Tên, Địa chỉ, SĐT).
> - [x] **T**estable — Có tiêu chí kiểm tra Mã chi nhánh phải là duy nhất.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-ORG-BRANCH-03] Định danh Duy nhất:** Mã chi nhánh (Branch Code) phải là duy nhất trên toàn hệ thống và không được chứa khoảng trắng hay ký tự đặc biệt (VD: `CG_HN`, `Q1_HCM`).
2. **[RULE-ORG-BRANCH-04] Trạng thái Khởi tạo:** Khi vừa tạo thành công, chi nhánh mặc định nằm ở trạng thái `Setup`. Chi nhánh `Setup` chưa thể được sử dụng để xếp lịch học.
3. **[RULE-ORG-BRANCH-05] Móc nối Tổ chức (Mapping):** Chi nhánh vật lý tạo ra ở bước này chưa được phân quyền cho ai, cho đến khi nó được gắn (Map) vào Sơ đồ Tổ chức (`US-ORG-02-01`). (Tham khảo: `FLOW-ORG-01`).

---

## 3. Cấu trúc Giao diện & Dữ liệu

**Bố cục:** Bảng trượt (Side-panel) hoặc Hộp thoại nổi chứa các trường nhập liệu chia thành các nhóm.

### 3.1. Các trường thông tin

| Khu vực | Trường | Bắt buộc | Validation | Ghi chú |
|---------|--------|----------|------------|---------|
| **Thông tin Chung** | Mã chi nhánh | Có | Duy nhất, không khoảng trắng | Chỉ nhập chữ và số, không chứa ký tự đặc biệt. |
| | Tên chi nhánh | Có | Tối thiểu 3 ký tự | Ví dụ: "Cơ sở Cầu Giấy". |
| | Loại hình | Có | Danh sách chọn | Mặc định: "Trung tâm Đào tạo" (Có thể là Trụ sở chính, Trung tâm khảo thí). |
| **Liên hệ & Vị trí**| Số điện thoại | Không | Chuẩn số điện thoại VN | SĐT Hotline của cơ sở. |
| | Tỉnh / Thành phố | Có | Danh sách chọn | Phục vụ báo cáo và tìm kiếm. |
| | Địa chỉ chi tiết | Có | Chữ tự do | Địa chỉ số nhà, đường. |
| | Tọa độ bản đồ | Không | Chữ tự do | Link bản đồ hoặc Vĩ độ, Kinh độ. |

### 3.2. Nút thao tác
| Nút | Loại | Vị trí | Logic xử lý |
|-----|------|--------|-------------|
| Lưu Chi nhánh | Primary | Dưới cùng | Gửi dữ liệu, tạo bản ghi mới và chuyển về màn hình danh sách. |
| Hủy bỏ | Ghost | Dưới cùng | Đóng biểu mẫu, không lưu dữ liệu. |

---

## 4. Xử lý Ngoại lệ
| # | Tình huống | Cách xử lý |
|---|-----------|-----------|
| 4.1 | Nhập trùng Mã chi nhánh đã tồn tại | Biểu mẫu báo lỗi màu đỏ ở trường Mã chi nhánh: "Mã chi nhánh này đã tồn tại. Vui lòng chọn mã khác." Chặn Lưu. |

---

## 5. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|--------------------|-----------------------|-------------------|
| AC-01 | Tạo mới thành công | Điền đủ các trường bắt buộc (Mã: `CG`, Tên: `Cầu Giấy`), bấm Lưu. | Hệ thống báo thành công, trả về danh sách, hiển thị dòng mới trạng thái "Setup". |
| AC-02 | Chặn trùng lặp | Tạo chi nhánh mới, nhập lại mã `CG`. | Báo lỗi: "Mã chi nhánh đã tồn tại" ngay khi bấm ra ngoài hoặc lúc lưu. |
