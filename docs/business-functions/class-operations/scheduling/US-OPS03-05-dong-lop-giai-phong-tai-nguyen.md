---
id: US-CLS02-05
title: "Tốt nghiệp & Đóng lớp học"
bf: BF-CLS-02
domain: CAP-OPS
status: draft
tags: [class, graduation, form]
---

# US-CLS02-05: Tốt nghiệp & Đóng lớp học

> **Tham chiếu:** BF-CLS-02 · Giao diện Mẫu §4.4 (Biểu mẫu)
> **Đường dẫn màn hình & Trạng thái liên quan:**
> - Hộp thoại đóng lớp mở từ nút **Tốt nghiệp / Đóng lớp** trên tiêu đề của hộp thoại chi tiết lớp (mở từ màn `/app/classes`) -> Trạng thái áp dụng: `Đang học`



## 1. Yêu cầu Người dùng (User Story)

**Là một** Nhân viên Giáo vụ hoặc Quản lý chi nhánh,  
**tôi muốn** mở biểu mẫu chốt kết quả và xác nhận tốt nghiệp cho học viên để thực hiện đóng lớp học,  
**để** hoàn tất vòng đời vận hành lớp, giải phóng các tài nguyên giáo viên/phòng học và chuyển đổi trạng thái hồ sơ học viên tương ứng.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Thiết kế độc lập với luồng tuyển sinh ban đầu.
> - [x] **N**egotiable — Chi tiết điều kiện kiểm tra công nợ học phí có thể tùy chỉnh.
> - [x] **V**aluable — Đóng lớp là nghiệp vụ bắt buộc để chốt sổ tài chính và cập nhật học thuật.
> - [x] **E**stimable — Đã xác định rõ các ràng buộc nghiệp vụ và luồng xử lý.
> - [x] **S**mall — Hoàn thành trong một phân đoạn phát triển.
> - [x] **T**estable — Có tiêu chí nghiệm thu chi tiết ở mục 6.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-CLS-05-01] Điều kiện kết thúc khóa:** Chỉ cho phép thực hiện đóng lớp học khi buổi học cuối cùng trong lộ trình đã hoàn thành điểm danh và ghi nhận kết quả. Nếu cố tình bấm đóng lớp trước thời hạn, hệ thống hiển thị cảnh báo đỏ và yêu cầu nhập mã phê duyệt từ Quản lý chi nhánh.
2. **[RULE-CLS-05-02] Giải phóng phòng học và Giáo viên:** Khi xác nhận đóng lớp, toàn bộ tài nguyên bao gồm Phòng học cố định và Giáo viên phụ trách chính sẽ được hệ thống giải phóng khỏi lịch vận hành hàng tuần kể từ ngày hiệu lực đóng lớp.
3. **[RULE-CLS-05-03] Chuyển đổi trạng thái học viên Roster:**
   - Các học viên có trạng thái tham gia lớp là `Đang học` (Active) sẽ tự động chuyển nhãn lớp học sang `Hết buổi` (Session Ended).
   - Trạng thái chính thức của học viên trên hệ thống sẽ tự động cập nhật:
     - Nếu học viên không còn tham gia bất kỳ lớp học hoạt động nào khác -> Chuyển sang trạng thái chính thức là **Đã nghỉ** (Dropout/Ended).
     - Nếu học viên vẫn đang theo học các lớp song song khác -> Giữ nguyên trạng thái chính thức là **Đang học**.
4. **[RULE-CLS-05-04] Đối chiếu tài chính học viên:** Khi đóng lớp, hệ thống tự động kiểm tra số buổi học thực tế đã tham gia so với số buổi trong gói học phí đã mua để phát hiện các trường hợp học quá số buổi hoặc còn buổi thừa để đề xuất sang lớp mới.

### 2.1. Thông số & Định mức (Metrics & Thresholds)
- **[METRIC-CLS-05-01] Ngày hiệu lực đóng lớp:** Mặc định lấy theo ngày hiện tại và không được chọn ngày trong tương lai quá 7 ngày.

---

## 3. Cấu trúc Các trường nhập liệu

**Bố cục:** Hộp thoại nổi 1 Cột.

### 3.1. Thông tin đầu vào

| Tên trường | Loại hiển thị | Bắt buộc | Diễn giải dữ liệu | Ghi chú & Quy tắc |
|------------|---------------|----------|-------------------|-------------------|
| Tên lớp đóng | Ô hiển thị | Không | Tên lớp học | Chỉ xem. |
| Ngày hiệu lực đóng | Ô chọn ngày | Có | Ngày đóng lớp | Mặc định là ngày hiện tại. |
| Lý do đóng lớp | Danh sách chọn | Có | Lý do đóng | Tùy chọn: "Hoàn thành lộ trình khóa học", "Lớp bị hủy giữa chừng", "Lý do khác". |
| Ghi chú chi tiết | Ô văn bản dài | Không | Ghi chú | Nhập thông tin bổ sung hoặc đánh giá chung của lớp học. |
| Xác nhận chốt điểm | Hộp chọn | Có | Xác nhận chốt điểm | Bắt buộc tích chọn để xác nhận đã nhập đủ điểm thi cuối khóa. |

### 3.2. Ví dụ Dữ liệu mẫu

| Tình huống | Dữ liệu đầu vào | Kết quả mong đợi |
|------------|-----------------|-------------------|
| Đóng lớp thông thường | Ngày: 04/06/2026, Lý do: "Hoàn thành lộ trình", Tích chọn chốt điểm: Có | Lớp chuyển sang trạng thái "Đã kết thúc" (`huy`). Toàn bộ 15 học viên roster chuyển nhãn sang "Hết buổi". Ghi nhận nhật ký. |
| Đóng lớp thiếu chốt điểm | Ngày: 04/06/2026, Lý do: "Hoàn thành lộ trình", Tích chọn chốt điểm: Không | Ô Checkbox hiển thị viền đỏ cảnh báo, nút "Xác nhận đóng" bị chặn (disabled). |

### 3.3. Nút hành động

| Nút | Loại hiển thị | Logic xử lý |
|-----|---------------|-------------|
| Hủy bỏ | Nút viền nhạt | Đóng hộp thoại, lớp học giữ nguyên trạng thái Đang học. |
| Xác nhận đóng | Nút màu nhấn nguy hiểm (Đỏ) | Thực thi đóng lớp -> Cập nhật trạng thái roster -> Giải phóng lịch tuần -> Tải lại danh sách chính. |

---

## 4. Mô tả chi tiết (Màn hình & Luồng)

### 4.1. Mô tả Màn hình
- Biểu mẫu đóng lớp hiển thị dưới dạng một hộp thoại xác nhận (Hộp thoại xác nhận kết hợp biểu mẫu).
- Tiêu đề hộp thoại in đậm đỏ cảnh báo: "Tốt nghiệp & Kết thúc lớp học".
- Giao diện có một bảng tóm tắt danh sách học viên hiện tại của lớp kèm theo kết quả học tập (tỉ lệ chuyên cần, điểm trung bình) để giáo vụ rà soát nhanh trước khi chốt.

### 4.2. Luồng Hoạt động (Workflow)
1. Giáo vụ mở màn chi tiết lớp học đang hoạt động, bấm nút "Tốt nghiệp & Kết thúc" trên biểu ngữ tiêu đề trang.
2. Hộp thoại nổi lên. Giáo vụ kiểm tra danh sách học sinh tốt nghiệp.
3. Giáo vụ chọn Ngày hiệu lực, Lý do đóng lớp, điền ghi chú và tích chọn xác nhận đã hoàn thành nhập điểm.
4. Giáo vụ bấm nút "Xác nhận đóng".
5. Hệ thống cập nhật trạng thái lớp thành Đã kết thúc, thay đổi nhãn học viên trong danh sách thành Hết buổi, giải phóng tài nguyên phòng và giáo viên, đồng thời cập nhật nhật ký hoạt động của lớp.

---

## 5. Corner Cases (Trường hợp góc cảnh & Đặc biệt)

| # | Tình huống đặc biệt (Corner Case) | Cách xử lý chi tiết | Ghi chú / Trạng thái |
|---|----------------------------------|---------------------|----------------------|
| 5.1 | Lớp đóng khi vẫn còn học viên chưa hoàn thành học phí | Hệ thống hiển thị cảnh báo danh sách học viên còn nợ học phí kèm theo liên kết xem chi tiết công nợ. Giáo vụ vẫn được phép đóng lớp nhưng thông tin công nợ sẽ được gửi cảnh báo tự động về cho bộ phận tài chính xử lý. | Cảnh báo công nợ |
| 5.2 | Đóng lớp đột xuất do chi nhánh dừng hoạt động | Chọn lý do "Lớp bị hủy giữa chừng", hệ thống sẽ bỏ qua bước bắt buộc kiểm tra chốt điểm cuối khóa và tự động tính toán hoàn trả số buổi học còn lại của học viên về ví tích lũy học phí. | Đóng lớp khẩn cấp |

---

## 6. Tiêu chí Nghiệm thu (Acceptance Criteria)

- **AC-1 (Kiểm tra chốt điểm):** Bắt buộc tích chọn xác nhận đã nhập điểm thi cuối khóa trước khi cho phép bấm nút "Xác nhận đóng" (nếu đóng với lý do hoàn thành lộ trình).
- **AC-2 (Cập nhật trạng thái danh sách):** Sau khi đóng lớp thành công, toàn bộ nhãn học viên đang học trong danh sách chuyển sang "Hết buổi".
- **AC-3 (Giải phóng tài nguyên):** Giáo viên và phòng học của lớp được giải phóng khỏi danh sách sử dụng kể từ ngày đóng lớp hiệu lực.
- **AC-4 (Lịch sử ghi nhận rõ ràng):** Dòng nhật ký ghi nhận đầy đủ lý do đóng lớp và tên giáo vụ thực hiện.
