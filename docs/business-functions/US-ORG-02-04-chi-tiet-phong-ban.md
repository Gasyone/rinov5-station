---
id: US-ORG-02-04
title: "Chi tiết Đơn vị Tổ chức (Phòng ban/Vùng)"
bf: BF-ORG-02
domain: CAP-HR
status: draft
tags: [org, unit, detail]
---

# US-ORG-02-04: Chi tiết Đơn vị Tổ chức

> **Tham chiếu:** BF-ORG-02 · Giao diện Mẫu §4.3 (Trang chi tiết)

## 1. Yêu cầu Người dùng (User Story)
**Là một** Quản trị Hệ thống (System Admin) hoặc Giám đốc Nhân sự, **tôi muốn** có một màn hình quản lý chi tiết một Đơn vị tổ chức (Phòng ban, Vùng), **để** cập nhật thông tin chung, xem danh sách nhân sự đang công tác tại đó, và theo dõi các đơn vị con trực thuộc.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai độc lập với quy trình tạo mới.
> - [x] **N**egotiable — Số lượng thẻ (Tab) có thể mở rộng theo nghiệp vụ (ví dụ: Thêm thẻ Định mức ngân sách).
> - [x] **V**aluable — Cung cấp cái nhìn toàn diện về một phòng ban/vùng thay vì chỉ là một nút trên cây sơ đồ.
> - [x] **E**stimable — Dựa trên cấu trúc chuẩn của trang chi tiết 2 cột.
> - [x] **S**mall — Hoàn thành trong 1 vòng phát triển.
> - [x] **T**estable — Có tiêu chí kiểm tra việc chặn sửa Mã đơn vị và ràng buộc khóa đơn vị.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-ORG-UNIT-04]:** Cấm sửa Mã đơn vị sau khi tạo để tránh đứt gãy liên kết dữ liệu báo cáo lịch sử.
2. **[RULE-ORG-UNIT-05]:** Điều kiện Tạm dừng/Khóa (Inactive): Chỉ có thể chuyển trạng thái đơn vị sang "Tạm dừng" nếu thỏa mãn các điều kiện:
   - Không có nhân sự nào đang ở trạng thái Đang làm việc (Active) trực thuộc đơn vị này.
   - Không có đơn vị con nào đang ở trạng thái Hoạt động.
3. **[RULE-ORG-UNIT-06]:** Quản lý nhân sự tại đơn vị: Bất kỳ thay đổi nhân sự nào (Thêm vào, Chuyển đi) sẽ được ghi nhận vào lịch sử công tác của nhân sự đó, và danh sách nhân sự của đơn vị sẽ được tự động cập nhật.

---

## 3. Cấu trúc Giao diện & Dữ liệu

**Bố cục:** 2 cột (Tóm tắt 30% / Chi tiết 70%).

### 3.1. Tiêu đề & Nút thao tác
| Nút | Loại | Logic chuyển trạng thái | Điều kiện |
|-----|------|-------------------------|-----------|
| Đổi trạng thái | Nút màu cảnh báo | Mở Hộp thoại xác nhận Khóa/Mở khóa đơn vị. | Phải thỏa mãn RULE-ORG-UNIT-05. |
| Sửa thông tin | Nút biểu tượng | Kích hoạt chế độ sửa ở Thẻ hiện tại. | Trừ khi đang "Đã khóa". |

### 3.2. Cột trái — Tóm tắt (Chỉ xem)
| Thông tin | Loại | Trường | Ghi chú |
|-----------|------|--------|---------|
| Ảnh đại diện | Hình ảnh | Icon theo Loại đơn vị | Mặc định. |
| Tên đơn vị | Chữ đậm lớn | Tên phòng ban/vùng | |
| Trạng thái | Nhãn màu | Hoạt động / Tạm khóa | Theo bộ màu chuẩn. |
| Cấp bậc | Chữ đậm vừa | Loại đơn vị (Vùng/Khối/Phòng) | |
| Mã đơn vị | Chữ nhỏ mờ | Mã đơn vị | Bất biến. |
| Đơn vị cha | Văn bản có link | Trực thuộc đơn vị nào | |
| Trưởng đơn vị | Avatar + Tên | Họ tên Quản lý | |

### 3.3. Cột phải — Chi tiết
Bao gồm hệ thống Thẻ (Tabs) để phân chia thông tin.

**Thẻ 1: Thông tin chung**
| Khu vực | Loại | Trường | Ghi chú |
|---------|------|--------|---------|
| Cấu trúc | Tiêu đề-Giá trị | Đơn vị cha, Cấp bậc, Mã đơn vị | Mã không được sửa. |
| Chi nhánh vật lý | Tiêu đề-Giá trị | Danh sách chi nhánh liên kết | (Tùy chọn) Nếu là đơn vị cấp Vùng/Khối. |
| Mô tả | Ô nhập liệu tự do | Chức năng, nhiệm vụ | Sửa nhanh. |

**Thẻ 2: Nhân sự trực thuộc**
| Khu vực | Loại | Trường | Ghi chú |
|---------|------|--------|---------|
| Danh sách | Bảng dữ liệu | Mã NV, Họ tên, Chức danh, Vị trí chính | Hiển thị tất cả nhân sự đang thuộc đơn vị. |
| Điều chuyển | Nút | Thêm nhân sự, Chuyển nhân sự đi | Mở công cụ Điều chuyển (Component). |

**Thẻ 3: Đơn vị con**
| Khu vực | Loại | Trường | Ghi chú |
|---------|------|--------|---------|
| Danh sách | Bảng dữ liệu | Tên đơn vị, Mã, Trưởng đơn vị, Số lượng NV | Danh sách các đơn vị cấp dưới trực tiếp. |

### 3.4. Lịch sử hoạt động
| Thành phần | Loại | Dữ liệu | Hoạt động |
|------------|------|---------|-----------|
| Nhật ký | Danh sách dọc | Lịch sử đổi tên, đổi quản lý, khóa/mở khóa | Mới nhất trên cùng. Ghi nhận người thực hiện. |

---

## 4. Xử lý Ngoại lệ
| # | Tình huống | Cách xử lý |
|---|-----------|-----------|
| 4.1 | Khóa đơn vị đang có nhân sự | Hệ thống hiện Hộp thoại thông báo: "Không thể khóa đơn vị này. Bạn cần chuyển 5 nhân sự hiện tại sang đơn vị khác trước." Nút Xác nhận bị mờ. |
| 4.2 | Chuyển đơn vị cha tạo vòng lặp | Báo lỗi ngay lập tức: "Đơn vị cấp trên không hợp lệ do tạo vòng lặp cấu trúc." |

---

## 5. Chỉ dẫn cho AI Agent & Lập trình viên (Business Architecture)

- Sử dụng chung Component "Điều chuyển nhân sự" (Từ `US-ORG-02-02`) và nhúng (embed) vào Thẻ 2 để tái sử dụng logic phân bổ.
- Đảm bảo tính nhất quán của trạng thái: Khi khóa đơn vị, mọi thao tác phân bổ nhân sự mới vào đơn vị này phải bị từ chối từ cấp hệ thống.

### ⛔ Hàng rào An toàn (Guardrails)
- **KHÔNG** cho phép sửa Mã đơn vị dưới bất kỳ hình thức nào.
- **KHÔNG** cho phép xóa dữ liệu lịch sử hoạt động.

---

## 6. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|--------------------|-----------------------|-------------------|
| AC-01 | Bố cục chuẩn | Truy cập màn hình chi tiết một phòng ban | Giao diện 2 cột, chia tab rõ ràng, hiển thị đúng thông tin tóm tắt. |
| AC-02 | Khóa Mã đơn vị | Bấm Sửa ở Thẻ Thông tin chung | Ô nhập Mã đơn vị bị vô hiệu hóa (chỉ đọc). |
| AC-03 | Ràng buộc khóa | Đổi trạng thái "Tạm khóa" cho phòng ban có 2 nhân viên | Hiện hộp thoại cảnh báo và chặn việc khóa. |
| AC-04 | Tái sử dụng điều chuyển | Ở Thẻ Nhân sự, bấm "Thêm nhân sự" | Hộp thoại công cụ Điều chuyển xuất hiện, cho phép gán người mới vào phòng. |
