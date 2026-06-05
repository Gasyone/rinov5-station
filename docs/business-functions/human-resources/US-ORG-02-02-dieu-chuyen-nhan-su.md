---
id: US-ORG-02-02
title: "Điều chuyển Nhân sự"
bf: BF-ORG-02
domain: CAP-HR
status: draft
tags: [hr, orgchart, transfer, form]
---

# US-ORG-02-02: Điều chuyển Nhân sự

> **Tham chiếu:** BF-ORG-02 · Giao diện Mẫu §4.4 (Biểu mẫu / Dialog)

## 1. Yêu cầu Người dùng (User Story)
**Là một** Chuyên viên Nhân sự (HR), **tôi muốn** có một chức năng để điều chuyển vị trí công tác của nhân viên từ phòng ban/chi nhánh này sang phòng ban/chi nhánh khác, **để** cập nhật kịp thời sự thay đổi trong sơ đồ tổ chức, đảm bảo nhân viên có đúng phân quyền dữ liệu mới.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Chức năng này độc lập, dùng để kết thúc 1 vị trí công tác cũ và tạo 1 vị trí công tác mới.
> - [x] **N**egotiable — Có thể thực hiện qua biểu mẫu riêng hoặc hộp thoại nổi.
> - [x] **V**aluable — Là nghiệp vụ nhân sự cốt lõi, bắt buộc phải có để luân chuyển nhân sự.
> - [x] **E**stimable — Luồng xử lý rõ ràng, chỉ thao tác trên bảng phân bổ.
> - [x] **S**mall — Chỉ tập trung vào đổi Đơn vị tổ chức và chức danh.
> - [x] **T**estable — Có tiêu chí kiểm tra dữ liệu về ngày tháng điều chuyển.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-ORG-TRANSFER-01] Nguyên tắc liền mạch:** Khi điều chuyển, hệ thống thực chất sẽ cập nhật "Ngày kết thúc" cho Vị trí công tác cũ (thường là ngày liền trước ngày điều chuyển), và sinh ra một bản ghi Vị trí công tác mới với "Ngày bắt đầu" là ngày nhận quyết định. Điều này đảm bảo lưu giữ toàn bộ lịch sử thuyên chuyển.
2. **[RULE-ORG-TRANSFER-02] Ràng buộc Vị trí Chính:** Nếu Vị trí công tác bị điều chuyển đang là Vị trí Chính, thì Vị trí mới sinh ra cũng mặc định kế thừa cờ Vị trí Chính.
3. **[RULE-ORG-TRANSFER-03] Kiểm tra tính hợp lệ của ngày:** Ngày điều chuyển (Effective Date) không được nằm trước Ngày nhận việc gốc (Hire Date) của nhân sự.

---

## 3. Cấu trúc Giao diện & Dữ liệu

**Bố cục:** Một Hộp thoại nổi mở ra từ màn hình danh sách nhân sự, hoặc mở từ thẻ "Vị trí công tác" trong hồ sơ chi tiết.

### 3.1. Các trường thông tin

| Khu vực | Trường | Bắt buộc | Validation | Ghi chú |
|---------|--------|----------|------------|---------|
| **Vị trí hiện tại** | Đơn vị / Chi nhánh cũ | Không | Chỉ hiển thị | Để người dùng đối chiếu. |
| | Chức danh cũ | Không | Chỉ hiển thị | |
| **Vị trí mới** | Ngày điều chuyển | Có | Lớn hơn hoặc bằng Ngày làm việc | Chọn ngày bắt đầu áp dụng vị trí mới. |
| | Đơn vị tổ chức mới | Có | Cây thư mục | Chọn Đơn vị trên sơ đồ tổ chức. |
| | Chi nhánh làm việc | Có | Danh sách chọn | Lấy từ danh sách chi nhánh. |
| | Chức danh mới | Có | Danh sách chọn | |
| **Lý do** | Ghi chú / Quyết định | Không | Ô văn bản dài | Số quyết định hoặc lý do điều chuyển. |

### 3.2. Nút thao tác
| Nút | Loại | Vị trí | Logic xử lý |
|-----|------|--------|-------------|
| Lưu điều chuyển | Primary | Dưới cùng bên phải | Đóng vị trí công tác cũ, tạo mới vị trí công tác. Tải lại lịch sử. |
| Hủy bỏ | Ghost | Dưới cùng bên phải | Đóng Hộp thoại. |

---

## 4. Xử lý Ngoại lệ
| # | Tình huống | Cách xử lý |
|---|-----------|-----------|
| 4.1 | Chọn ngày điều chuyển trong quá khứ trước cả ngày tạo vị trí cũ | Chặn lưu, báo lỗi: "Ngày điều chuyển không hợp lệ. Phải sau ngày kết thúc vị trí cũ". |
| 4.2 | Chọn Đơn vị đang bị Vô hiệu hóa | Ẩn các Đơn vị bị vô hiệu hóa trong danh sách chọn hoặc báo lỗi nếu cố tình chọn qua hệ thống ngầm. |

---

## 5. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|--------------------|-----------------------|-------------------|
| AC-01 | Lưu lịch sử chuyển | Chọn NV A, chuyển sang phòng ban B từ ngày mai. | Hệ thống báo thành công. Khi mở thẻ Lịch sử công tác, thấy bản ghi phòng cũ đã có ngày kết thúc (hôm nay). Bản ghi phòng B bắt đầu từ ngày mai. |
| AC-02 | Chặn ngày sai | Chọn ngày chuyển là 1 năm trước | Hộp thoại báo lỗi đỏ: "Ngày điều chuyển phải lớn hơn ngày bắt đầu vị trí hiện tại". Chặn nút Lưu. |
| AC-03 | Chọn Đơn vị dạng Cây | Mở ô chọn Đơn vị mới | Hiển thị dạng phân cấp (Vùng -> Chi nhánh -> Phòng) để người dùng chọn đúng đơn vị. |
