---
id: US-ORG-02-01
title: "Quản lý Sơ đồ Tổ chức"
bf: BF-ORG-02
domain: CAP-HR
status: draft
tags: [orgchart, list, tree]
---

# US-ORG-02-01: Danh sách Sơ đồ Tổ chức

> **Tham chiếu:** BF-ORG-02 · Giao diện Mẫu §4.2 (Danh sách dạng Bảng / Cây)

## 1. Yêu cầu Người dùng (User Story)
**Là một** Quản trị Hệ thống (System Admin), **tôi muốn** có một giao diện hiển thị cơ cấu tổ chức dưới dạng cây, **để** thấy rõ cấu trúc báo cáo của toàn doanh nghiệp và dễ dàng truy cập vào chi tiết của từng phòng ban.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Hiển thị cây cấu trúc độc lập với luồng điều chuyển nhân sự.
> - [x] **N**egotiable — Giao diện dạng sơ đồ hoặc danh sách thu gọn có thể tùy chọn.
> - [x] **V**aluable — Cung cấp cái nhìn tổng thể trực quan cho ban lãnh đạo.
> - [x] **E**stimable — Dựa trên cấu trúc danh sách dạng cây chuẩn.
> - [x] **S**mall — Chỉ quản lý việc hiển thị phân cấp.
> - [x] **T**estable — Có tiêu chí nghiệp vụ để hiển thị đúng dữ liệu.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-ORG-TREE-01]:** Cây sơ đồ tổ chức là cây tuyến tính, một đơn vị con chỉ có duy nhất 1 đơn vị cha. Không được tạo quan hệ vòng lặp.
2. **[RULE-ORG-TREE-02]:** Các Chi nhánh vật lý (từ `BF-ORG-01`) bắt buộc phải được gắn vào một đơn vị bất kỳ trên cây để dữ liệu doanh thu / học viên có thể tổng hợp lên cấp cao hơn.
3. **[RULE-ORG-TREE-03]:** Việc quản lý chi tiết (Tạo mới, Cập nhật, Vô hiệu hóa) một đơn vị phòng ban sẽ diễn ra ở màn hình Chi tiết (`US-ORG-02-04`). Màn hình này chỉ có vai trò hiển thị và điều hướng.

---

## 3. Cấu trúc Giao diện & Dữ liệu

**Bố cục:** Hiển thị toàn màn hình dạng cây phân cấp (Cây sơ đồ tổ chức).

### 3.1. Các nút Thao tác
| Nút | Vị trí | Quyền hạn | Chức năng |
|-----|--------|-----------|-----------|
| + Tạo Đơn vị mới | Góc trên bên phải | Admin | Chuyển hướng sang màn hình Tạo mới Phòng ban (`US-ORG-02-03`). |
| Xem chi tiết | Trực tiếp trên tên đơn vị | Mọi người | Chuyển hướng sang màn hình Chi tiết Phòng ban (`US-ORG-02-04`). |
| Mở rộng/Thu gọn | Đầu sơ đồ | Mọi người | Mở bung tất cả các nhánh hoặc thu gọn lại. |

### 3.2. Cây sơ đồ
- Mỗi đơn vị hiển thị: Tên phòng ban/vùng, Biểu tượng phân loại (Ví dụ: Biểu tượng Chi nhánh, Biểu tượng Phòng ban), Số lượng nhân sự bên trong.
- Có nhãn màu hiển thị trạng thái (Đang hoạt động, Đã đóng).

---

## 4. Xử lý Ngoại lệ
| # | Tình huống | Cách xử lý |
|---|-----------|-----------|
| 4.1 | Dữ liệu phòng ban quá lớn | Áp dụng cơ chế tải dữ liệu từng phần (phòng ban con chỉ tải khi được bấm mở rộng) để tránh giật lag. |

---

## 5. Chỉ dẫn cho AI Agent & Lập trình viên (Business Architecture)

- Phải kiểm tra phân quyền (Authorization) trước khi cho phép xem dữ liệu.
- Nhãn trạng thái bắt buộc lấy màu từ bộ quy tắc trạng thái chuẩn của doanh nghiệp.
- Giao diện sơ đồ phải tối ưu hóa tải dữ liệu.

### ⛔ Hàng rào An toàn (Guardrails)
- **KHÔNG** đặt logic xử lý thêm/sửa/xóa phòng ban ở màn hình này. Màn hình này chỉ phục vụ điều hướng (List View).
- **KHÔNG** bỏ qua các trạng thái Trống / Đang tải / Lỗi.

---

## 6. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|--------------------|-----------------------|-------------------|
| AC-01 | Hiển thị sơ đồ | Truy cập trang danh sách sơ đồ tổ chức | Sơ đồ hiện đúng cấu trúc cha con. Có biểu tượng loại đơn vị. |
| AC-02 | Xem chi tiết | Bấm vào một đơn vị trên sơ đồ | Chuyển hướng thành công sang màn hình Chi tiết Đơn vị. |
| AC-03 | Tạo đơn vị mới | Bấm "Tạo Đơn vị mới" | Chuyển hướng thành công sang biểu mẫu Tạo mới Đơn vị. |
