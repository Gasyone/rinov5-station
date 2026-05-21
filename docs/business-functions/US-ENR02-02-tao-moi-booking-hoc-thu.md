---
id: US-ENR02-02
title: "Tạo mới Booking Học thử"
bf: BF-ENR-02
domain: CAP-ADM
status: draft
tags: [enrollment, trial, form]
---

# US-ENR02-02: Tạo mới Booking Học thử

> **Tham chiếu:** BF-ENR-02 · `[POLICY-DS-03]` · Giao diện Mẫu §4.4 (Biểu mẫu)

## 1. Yêu cầu Người dùng (User Story)

**Là một** nhân viên Tư vấn,
**tôi muốn** lập một phiếu đăng ký nhu cầu học thử cho khách hàng,
**để** chuyển yêu cầu sang bộ phận Giáo vụ tìm lớp và xếp lịch phù hợp.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai độc lập.
> - [x] **N**egotiable — Bố cục trường nhập có thể thương lượng.
> - [x] **V**aluable — Cho phép ghi nhận nhu cầu và chuyển giao nghiệp vụ nhanh.
> - [x] **E**stimable — Đủ rõ để ước lượng công sức.
> - [x] **S**mall — Hoàn thành trong 1 vòng phát triển.
> - [x] **T**estable — Có tiêu chí nghiệm thu ở mục 7.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-FORM-01] Trường bắt buộc:** Tên học viên, Cơ sở, Chương trình phải được điền trước khi gửi.
2. **[RULE-FORM-02] Chống trùng lặp:** Một khách hàng không thể tạo 2 booking học thử có trạng thái hoạt động (Đã đặt lịch / Đã ghép lớp) cho CÙNG 1 chương trình.
3. **[RULE-FORM-03] Phụ thuộc Chương trình → Môn học:** Khi chọn chương trình, môn học tự động cập nhật và không cho phép sửa.
4. **[RULE-FORM-04] Mã tự sinh:** Mã booking tự sinh dạng TR-AAMM-NNN (VD: TR-2605-001).
5. **[RULE-FORM-05] Trạng thái mặc định:** Khi tạo thành công, nếu chưa chọn lớp: trạng thái "Chờ ghép lớp". Nếu đã chọn lớp: "Đã ghép lớp".
6. **[RULE-FORM-06] Đặt lại khi mở lại:** Mỗi lần mở hộp thoại, biểu mẫu đặt lại hoàn toàn.

---

## 3. Cấu trúc Các trường nhập liệu

**Bố cục:** 2 Cột trên màn hình rộng.

### 3.1. Thông tin đầu vào

| Tên trường | Loại hiển thị | Bắt buộc | Trường dữ liệu | Ghi chú & Quy tắc |
|------------|---------------|----------|----------------|-------------------|
| Tên học viên / Lead | Ô tìm kiếm và chọn | Có | Tên học viên | Gợi ý khi nhập liệu (Suggest-based). |
| Cơ sở | Danh sách thả xuống | Có | Tên chi nhánh | Chỉ cơ sở đang hoạt động. |
| Chương trình | Danh sách thả xuống | Có | Tên chương trình | Khi đổi: cập nhật Môn học (RULE-FORM-03). |
| Môn học | Nhãn (Tag) | — | Môn học | Tự động theo Chương trình. |
| Lịch khả dụng | Bảng chọn danh sách (Multi-session) | Không | Lớp & Buổi học | Lọc theo chương trình. Liệt kê các lớp (kèm nhãn Workshop/Chính thức) và các buổi học tương ứng. Cho phép chọn nhiều buổi thuộc cùng 1 lớp. Để trống — Giáo vụ ghép sau. |
| Ghi chú | Ô nhập văn bản dài | Không | Ghi chú | Tối đa 500 ký tự. VD: "Khách rảnh buổi tối, bé nhát cần GV nữ". |

### 3.2. Nhãn hiển thị (Read-only Tags)

- **Loại lớp**: Hiển thị dưới dạng nhãn (Workshop hoặc Chính thức) gắn liền với thông tin của từng lớp học trong bảng Lịch khả dụng. Không phải là trường chọn rời.

### 3.2. Ví dụ Dữ liệu mẫu

| Tình huống | Dữ liệu đầu vào | Kết quả mong đợi |
|------------|-----------------|-------------------|
| Tạo thành công | Tên: Nguyễn Minh Anh, Cơ sở: Q1, Chương trình: Cambridge Starter | Booking TR-2605-XXX, trạng thái "Chờ ghép lớp", hộp thoại đóng. |
| Thiếu trường bắt buộc | Tên: (bỏ trống) | Viền đỏ ô Tên, chặn lưu, thông báo lỗi. |
| Trùng booking | Lead đang có booking hoạt động cùng chương trình | Báo lỗi "Lead này đang có lịch học thử chờ xử lý". |

### 3.3. Nút hành động

| Nút | Loại hiển thị | Logic xử lý |
|-----|---------------|-------------|
| Hủy | Nút viền nhạt | Đóng hộp thoại, xóa trắng dữ liệu. |
| Tạo Booking | Nút màu nhấn | Kiểm tra → Lưu → Đóng → Tải lại danh sách. |

---

## 4. Xử lý Ngoại lệ

| # | Tình huống | Cách xử lý |
|---|-----------|------------|
| 4.1 | Gửi khi thiếu trường bắt buộc | Viền đỏ ô nhập liệu, thông báo lỗi. |
| 4.2 | Bấm ra ngoài khi đang điền | Không tự đóng. Phải bấm Hủy. |
| 4.3 | Lead đã có booking hoạt động | Chặn gửi, báo lỗi. |
| 4.4 | Không có cơ sở đang hoạt động | Danh sách cơ sở trống. Không thể gửi. |

---

## 5. Chỉ dẫn cho AI Agent & Lập trình viên (Business Architecture)

- Tách biệt xử lý giao diện và kiểm tra ràng buộc dữ liệu.
- Chuỗi phụ thuộc Chương trình → Môn học phải xử lý bằng hiệu ứng phản ứng.
- Phân quyền kiểm tra trước khi cho phép lưu.

### ⛔ Hàng rào An toàn (Guardrails)

- **KHÔNG** thêm trường ngoài mục 3.1.
- **KHÔNG** thay đổi quy tắc nghiệp vụ mục 2 chưa được phê duyệt.

---

## 6. Kế hoạch Tự kiểm tra (Self-Verification)

| # | Hạng mục | Cách kiểm tra | Tiêu chuẩn Đạt |
|---|----------|---------------|-----------------|
| V-01 | Kiểm tra dữ liệu | Thử từng tình huống mục 3.2 | Kết quả khớp cột "Kết quả mong đợi". |
| V-02 | Ngoại lệ | Thử từng tình huống mục 4 | Hệ thống xử lý đúng. |
| V-03 | Phụ thuộc | Đổi chương trình | Môn học cập nhật tự động. |
| V-04 | Nhãn trạng thái | Kiểm tra booking mới | Màu từ hệ thống, không gán cố định. |

---

## 7. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|---------------------|----------------------|-------------------|
| AC-01 | Bố cục chuẩn | So mẫu §4.4 | 2 cột trên rộng, 1 cột trên hẹp. |
| AC-02 | Kiểm tra hợp lệ | Bỏ trống bắt buộc, bấm Tạo | Viền đỏ + thông báo, chặn lưu. |
| AC-03 | Chống trùng | Tạo booking trùng chương trình | Báo lỗi, chặn lưu. |
| AC-04 | Tạo thành công | Điền đủ, bấm Tạo | Đóng, booking đầu danh sách, mã tự sinh. |
| AC-05 | Phụ thuộc Chương trình | Đổi chương trình | Môn học tự cập nhật. Lớp dự kiến lọc theo. |
| AC-06 | Đặt lại biểu mẫu | Mở lại hộp thoại | Tất cả trống. |
