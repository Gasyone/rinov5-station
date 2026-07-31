---
id: US-OPS02-05
title: "Quản lý Lịch học V2 — Bảng Chỉ huy Vận hành Giảng dạy"
bf: BF-OPS-02
domain: CAP-OPS
status: standardized
tags: [schedule, class, ops, command-center, matrix]
---

# US-OPS02-05: Quản lý Lịch học V2 — Bảng Chỉ huy Vận hành Giảng dạy

> **Tham chiếu:** BF-OPS-02 · `[POLICY-DS-03]` · Giao diện Mẫu §4.2 (Danh sách dạng Grid/Matrix)

## 1. Yêu cầu Người dùng (User Story)

**Là một** Quản lý Chi nhánh hoặc Nhân viên Giáo vụ Vận hành (Operations),  
**tôi muốn** có một Trung tâm Điều hành Thời khóa biểu Đa góc nhìn (Ma trận Phòng học, Ma trận Tải trọng Giáo viên và Bảng Tiến độ Khóa học),  
**để** phát hiện ngay các sự cố trùng phòng, giáo viên quá tải, theo dõi các mốc thi giữa kỳ/tái phí và xử lý các ca dạy thay khẩn cấp mà không bị trùng lặp thông tin với lịch cá nhân của giáo viên.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai độc lập với màn hình Lịch cá nhân.
> - [x] **N**egotiable — Chi tiết ma trận hiển thị và các thẻ cảnh báo có thể tùy biến.
> - [x] **V**aluable — Mang lại công cụ quản trị nguồn lực toàn diện cho quản lý cơ sở.
> - [x] **E**stimable — Ước lượng dựa trên hạ tầng ma trận dữ liệu có sẵn.
> - [x] **S**mall — Hoàn thành trong 1 chu kỳ phát triển.
> - [x] **T**estable — Có các tiêu chí nghiệm thu chặt chẽ cho cả 3 chế độ xem.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-CAL2-01] Ba Chế độ Xem Bắt buộc (Mandatory 3 View Modes):**
   - **Xem theo Phòng học:** Hiển thị danh sách Phòng học (cột đứng) x Các khung giờ ca học (cột ngang).
   - **Xem theo Giáo viên:** Hiển thị danh sách Giáo viên (cột đứng) x Các ngày trong tuần (cột ngang) kèm tổng số giờ dạy/tuần.
   - **Xem theo Tiến độ Lớp:** Hiển thị dạng bảng tiến độ khóa học kèm thanh tiến độ buổi học (ví dụ: Buổi 18/36).
2. **[RULE-CAL2-02] Cảnh báo Xung đột Nguồn lực (Resource Conflict Alert):**
   - Nếu 2 buổi học bị xếp trùng phòng hoặc trùng giáo viên trong cùng một khung giờ, hệ thống hiển thị ô ma trận màu đỏ nổi bật và cờ cảnh báo trùng.
3. **[RULE-CAL2-03] Xử lý Dạy thay Khẩn cấp (Quick Substitute Assignment):**
   - Tại màn hình Ma trận Giáo viên, khi nhấp vào ô ca học có giáo viên xin nghỉ, Giáo vụ có thể chọn giáo viên rảnh cùng ca để gán dạy thay ngay.
4. **[RULE-CAL2-04] Cảnh báo Chuyên cần & Tái phí (Absence & Renewal Alert):**
   - Khi tỷ lệ học sinh tham gia buổi học giảm quá 20% so với sĩ số chính thức, thẻ buổi học hiển thị cảnh báo vắng bất thường.
   - Khi lớp đạt mốc 50% hoặc 80% tiến độ khóa học, hệ thống tự động gắn nhãn Thi giữa kỳ hoặc Chuẩn bị Tái phí.

### 2.1. Thông số & Định mức (Metrics & Thresholds)

- **[METRIC-01] Định mức Giờ dạy:** Giáo viên có tổng số giờ dạy trên 30 giờ/tuần sẽ bị gắn nhãn Cảnh báo quá tải.
- **[METRIC-02] Ngưỡng Chuyên cần:** Tỷ lệ tham gia dưới 80% được xếp vào nhóm Lớp cần theo dõi đặc biệt.

---

## 3. Cấu trúc Giao diện & Dữ liệu

**Bố cục Tổng thể:** Thanh công cụ phía trên (Chọn chi nhánh, Chuyển tab chế độ xem, Tìm kiếm, Bộ lọc nâng cao), Bảng chỉ số trạng thái ca học, và Khu vực Ma trận/Bảng hiển thị chính.

### 3.1. Thanh công cụ (Toolbar)

| Thành phần | Loại hiển thị | Logic & Tham số | Ghi chú |
|------------|---------------|-----------------|---------|
| Chế độ xem | Nút nhóm tab | Chuyển đổi giữa 3 Tab: Theo Phòng, Theo Giáo viên, Theo Tiến độ Lớp. | Mặc định: Theo Phòng. |
| Điều hướng ngày | Nhóm nút bấm | Nút "Hôm nay", nút Trước/Sau, dải ngày hiển thị. | Điều chỉnh tuần/ngày xem. |
| Chọn Chi nhánh | Danh sách thả xuống | Gọi đến cơ sở dữ liệu chi nhánh. | Mặc định: Tất cả chi nhánh. |
| Tìm kiếm | Ô nhập văn bản | Quét mã lớp, tên lớp, giáo viên, phòng học. | Cập nhật kết quả tức thì. |

### 3.2. Chế độ Xem 1: Ma trận Phân bổ Phòng học (Room Allocation Matrix)

| Thành phần | Loại hiển thị | Dữ liệu Hiển thị | Ghi chú |
|------------|---------------|------------------|---------|
| Trục đứng (Y) | Danh sách phòng | Tên phòng, Sức chứa, Loại phòng. | Cố định cột khi cuộn ngang. |
| Trục ngang (X) | Các ca học | Ca Sáng (08:00-11:30), Ca Chiều (14:00-17:30), Ca Tối (18:00-21:15). | Tiêu đề cố định khi cuộn dọc. |
| Ô Ca học | Khối thông tin | Tên lớp, Giáo viên, Sĩ số, Cảnh báo trùng. | Nhấp vào ô trống để gán phòng. |

### 3.3. Chế độ Xem 2: Ma trận Tải trọng Giáo viên (Teacher Workload Grid)

| Thành phần | Loại hiển thị | Dữ liệu Hiển thị | Ghi chú |
|------------|---------------|------------------|---------|
| Trục đứng (Y) | Danh sách giáo viên | Họ tên, Vai trò, Tổng số giờ dạy/tuần. | Cảnh báo nếu > 30 giờ/tuần. |
| Trục ngang (X) | 7 Ngày trong tuần | Thứ 2 đến Chủ nhật kèm ngày tháng. | |
| Ô Ca dạy | Khối thông tin | Tên lớp, Phòng học, Ca dạy, Cờ dạy thay. | Nhấp vào để đổi giáo viên. |

### 3.4. Chế độ Xem 3: Bảng Tiến độ Lớp học (Class Progression Board)

| Thành phần | Loại hiển thị | Dữ liệu Hiển thị | Ghi chú |
|------------|---------------|------------------|---------|
| Thẻ Lớp | Khối chữ nhật | Mã lớp, Tên lớp, Chương trình học, Phòng học. | |
| Thanh Tiến độ | Thanh ngang | Số buổi đã học / Tổng số buổi (Ví dụ: Buổi 18/36). | Tự động tính phần trăm. |
| Nhãn Sự kiện | Thẻ màu | Thi giữa kỳ, Thi cuối kỳ, Chuẩn bị Tái phí. | Gắn theo mốc phần trăm. |

---

## 4. Xử lý Ngoại lệ (Corner Cases)

| # | Tình huống | Cách xử lý | Thông báo giao diện |
|---|-----------|------------|----------------|
| 4.1 | Giáo viên xin nghỉ đột xuất | Giáo vụ mở ma trận giáo viên để gán người dạy thay. | Hiển thị cờ Dạy thay màu xanh dương. |
| 4.2 | Hai lớp xếp trùng phòng | Hệ thống phát hiện xung đột thời gian. | Cột ca học đổi sang màu đỏ nháy cảnh báo. |
| 4.3 | Không tìm thấy lớp | Nhập từ khóa tìm kiếm không khớp. | Hiển thị bảng trống kèm hướng dẫn tìm kiếm. |

---

## 5. Kế hoạch Tự kiểm tra (Self-Verification)

| # | Hạng mục | Bước kiểm tra | Tiêu chuẩn Đạt |
|---|----------|---------------|-----------------|
| V-01 | Chuyển Tab Chế độ xem | Lần lượt nhấp chuyển 3 Tab. | Giao diện đổi mượt mà sang ma trận tương ứng. |
| V-02 | Điều hướng Tuần | Bấm nút Trước/Sau. | Khoảng ngày và dữ liệu ma trận cập nhật đúng. |

---

## 6. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|--------------------|-----------------------|-------------------|
| AC-01 | Hiển thị 3 Chế độ xem | Chuyển đổi 3 Tab trên thanh công cụ. | Hiển thị đủ Ma trận Phòng, Ma trận Giáo viên, Bảng Tiến độ. |
| AC-02 | Cảnh báo trùng phòng | Giả lập 2 lớp trùng phòng cùng giờ. | Ô ma trận tự động đổi sang màu đỏ cảnh báo. |
| AC-03 | Thanh tiến độ buổi học | Kiểm tra lớp học 18/36 buổi. | Thanh tiến độ điền đúng 50% chiều rộng. |
