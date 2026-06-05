---
id: US-ENR02-02
title: "Tạo mới Booking Học thử"
bf: BF-ENR-02
domain: CAP-ADM
status: draft
tags: [enrollment, trial, form]
---

# US-ENR02-02: Tạo mới Booking Học thử (Chỉ dành cho bản V2)

> **Tham chiếu:** BF-ENR-02 · `[POLICY-DS-03]` · Giao diện Mẫu §4.4 (Biểu mẫu)

## 1. Yêu cầu Người dùng (User Story)

**Là một** nhân viên Tư vấn,
**tôi muốn** tạo nhanh một phiếu đăng ký nhu cầu học thử trực tiếp trên hệ thống, chọn học viên tiềm năng hiện có hoặc tạo mới trực tiếp từ ô nhập liệu, chọn lớp học và ca học phù hợp ngay tại giao diện,
**để** hoàn tất việc đặt lịch trải nghiệm cho học viên một cách nhanh chóng mà không cần chờ đợi Giáo vụ xếp lớp thủ công sau đó.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Thực hiện độc lập trên giao diện tạo mới.
> - [x] **N**egotiable — Chi tiết các trường thông tin có thể tùy chỉnh thêm.
> - [x] **V**aluable — Giúp giảm tải công việc nhập liệu cho Giáo vụ và tăng tốc độ chốt lịch.
> - [x] **E**stimable — Đã rõ ràng cấu trúc các ô nhập liệu và bảng lịch khả dụng.
> - [x] **S**mall — Hoàn thành trong một đợt phát triển.
> - [x] **T**estable — Có tiêu chí nghiệm thu rõ ràng ở mục 6.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1.  **[RULE-FORM-01] Trường bắt buộc nhập:** Để tạo mới một phiếu học thử, bắt buộc phải có các thông tin: Tên học viên, Cơ sở và Chương trình học trải nghiệm.
2.  **[RULE-FORM-02] Chọn học viên thông minh:** Ô chọn học viên hỗ trợ tìm kiếm danh sách học viên hiện có trong hệ thống. Trường hợp học viên chưa có trong cơ sở dữ liệu (khách hàng mới hoàn toàn), nhân viên có thể gõ trực tiếp tên học viên mới và nhấn nút tạo mới ngay tại ô nhập liệu.
3.  **[RULE-FORM-03] Tự động cập nhật Môn học:** Khi nhân viên chọn Chương trình học (ví dụ: *Cambridge Starter*), hệ thống sẽ tự động điền Môn học tương ứng (*Tiếng Anh*) và khóa cứng ô hiển thị môn học (chỉ đọc) để tránh sai sót.
4.  **[RULE-FORM-04] Tích hợp xếp ca học nhanh:** Giao diện tạo mới tích hợp trực tiếp bảng hiển thị lịch khả dụng bên phải. Khi nhân viên chọn Chương trình học, danh sách các lớp thuộc chương trình đó sẽ tự động hiển thị để nhân viên chọn ca học trực tiếp.
5.  **[RULE-FORM-05] Quy tắc xác định trạng thái mặc định:**
    *   Nếu nhân viên chỉ điền thông tin nhu cầu và **không chọn ca học** trong biểu mẫu: Phiếu học thử sau khi tạo sẽ ở trạng thái **Chờ xác nhận**.
    *   Nếu nhân viên thực hiện **chọn ca học** trực tiếp tại biểu mẫu: Phiếu học thử sau khi tạo sẽ chuyển ngay sang trạng thái **Đã ghép lớp**.
6.  **[RULE-FORM-06] Tự động tạo mã số:** Mã phiếu học thử sẽ được hệ thống sinh tự động theo định dạng chuẩn: `TR-YYMM-NNN` (Ví dụ: `TR-2605-001` đại diện cho phiếu học thử thứ nhất được tạo vào tháng 05 năm 2026).
7.  **[RULE-FORM-07] Xếp ca học duy nhất:** Mỗi booking học thử chỉ được phép đăng ký xếp **đúng 1 buổi học duy nhất**.

### 2.1. Thông số & Định mức (Metrics & Thresholds)

- **[METRIC-01] Giới hạn số lượng:** Tối đa tạo 50 booking học thử/ngày/nhân viên để tránh spam hệ thống.

---

## 3. Cấu trúc Các trường nhập liệu

**Bố cục:** 2 Cột (Cột trái Thông tin chung chiếm 33% độ rộng / Cột phải Lịch khả dụng chiếm 67% độ rộng).

### 3.1. Thông tin đầu vào

| Tên trường | Loại hiển thị | Bắt buộc | Trường dữ liệu | Ghi chú & Quy tắc |
| :--- | :--- | :--- | :--- | :--- |
| Tên học viên / Lead | Hộp chọn kết hợp tìm kiếm nhập chữ | Có | Tên học sinh | Cho phép chọn học viên cũ hoặc gõ tạo mới. |
| Cơ sở | Danh sách thả xuống | Có | Tên cơ sở | Danh sách các chi nhánh của trung tâm. |
| Chương trình | Danh sách thả xuống | Có | Tên chương trình | Thay đổi chương trình → tải lại lịch khả dụng. |
| Môn học | Ô hiển thị (Chỉ đọc) | — | Môn học | Tự động điền theo Chương trình, nền xám nhẹ. |
| Ghi chú | Ô nhập văn bản dài | Không | Ghi chú | Tối đa 500 ký tự. |

### 3.2. Ví dụ Dữ liệu mẫu

| Tình huống | Dữ liệu đầu vào | Kết quả mong đợi |
| :--- | :--- | :--- |
| Tạo thành công | Tên: "Nguyễn Minh Anh", Cơ sở: "Chi nhánh Hà Nội", Chương trình: "Cambridge Starter", gán ca "Starter S1" | Lưu thành công, sinh phiếu `TR-2605-XXX` ở trạng thái Đã ghép lớp. |
| Thiếu trường bắt buộc | Tên: (bỏ trống) | Viền đỏ ô chọn học viên, nút Tạo Booking bị chặn. |
| Không chọn ca | Điền đủ bắt buộc, không chọn ca học | Lưu thành công, sinh phiếu `TR-2605-XXX` ở trạng thái Chờ xác nhận. |

### 3.3. Nút hành động

| Nút | Loại hiển thị | Logic xử lý |
| :--- | :--- | :--- |
| Hủy | Nút viền nhạt | Đóng hộp thoại, xóa sạch dữ liệu nhập tạm. |
| Tạo Booking | Nút màu nhấn | Kiểm tra bắt buộc → Ghi dữ liệu → Đóng → Tải lại danh sách chính. |

---

## 4. Mô tả chi tiết (Màn hình & Luồng)

### 4.1. Mô tả Màn hình
Hộp thoại tạo mới được chia làm hai cột rõ ràng. Cột trái nhỏ hiển thị các trường nhập thông tin chung như Tên, Cơ sở, Chương trình. Cột phải lớn hiển thị danh sách lớp và ca học khả dụng với bộ chọn khoảng ngày ở trên cùng. Mỗi lớp được thiết kế dạng khối thông tin co giãn (mở rộng/thu gọn).

### 4.2. Luồng Hoạt động (Workflow)
Khi nhân viên bấm nút "Tạo Booking", hộp thoại mở ra. Nhân viên chọn học viên (hoặc tạo mới), chọn cơ sở và chương trình. Khi chương trình được chọn, bảng lịch khả dụng bên phải sẽ hiển thị các lớp học đang vận hành tương ứng. Nhân viên chọn khoảng ngày mong muốn để thu hẹp ca học, sau đó mở rộng lớp phù hợp và tích chọn duy nhất 1 ca học thử, cuối cùng bấm "Tạo Booking".

---

## 5. Corner Cases (Trường hợp góc cạnh & Đặc biệt)

| # | Tình huống đặc biệt (Corner Case) | Cách xử lý chi tiết | Ghi chú / Trạng thái |
| :--- | :--- | :--- | :--- |
| 5.1 | Bấm Lưu khi chưa điền thông tin bắt buộc | Hệ thống hiển thị viền đỏ quanh các ô thiếu thông tin và đưa ra thông báo cảnh báo trực quan. | Chặn lưu |
| 5.2 | Bấm ra ngoài khi đang điền biểu mẫu | Chặn không cho tự đóng hộp thoại để giữ dữ liệu. Nhân viên bắt buộc phải bấm nút Hủy để xác nhận đóng. | |
| 5.3 | Học viên vi phạm giới hạn đặt lịch học thử | Hệ thống kiểm tra thông tin và hiển thị cảnh báo đỏ trên màn hình cảnh báo học viên đã học thử quá 2 lần trong 3 tháng. | Cảnh báo cảnh tỉnh |
| 5.4 | Không có lớp học nào phù hợp đang vận hành | Hiển thị thông báo "Không có lớp học nào khả dụng cho chương trình này" bên cột phải. | |

---

## 6. Tiêu chí Nghiệm thu (Acceptance Criteria)

- **AC-1 (Bố cục chuẩn):** Biểu mẫu hiển thị đúng tỷ lệ 2 cột (Thông tin chung bên trái / Lịch khả dụng bên phải), gắn nhãn đầy đủ cho các ô nhập liệu.
- **AC-2 (Ràng buộc hợp lệ):** Khi bỏ trống Tên học viên, Cơ sở hoặc Chương trình học, hệ thống bôi đỏ viền ô nhập liệu và chặn không cho tạo booking.
- **AC-3 (Xếp ca đơn):** Hệ thống chỉ cho phép chọn đúng 1 ca học thử duy nhất trong bảng lịch khả dụng. Bấm chọn ca mới sẽ tự động hủy chọn ca cũ.
- **AC-4 (Tạo thành công):** Khi điền đủ thông tin hợp lệ, bấm Tạo Booking sẽ đóng hộp thoại, lưu dữ liệu, sinh mã số tự động và tải lại danh sách chính hiển thị bản ghi mới trên cùng.