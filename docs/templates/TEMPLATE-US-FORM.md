---
id: US-XXX-YY-ZZ
title: "[Tên Biểu Mẫu Tạo/Sửa]"
bf: BF-XXX-YY
domain: CAP-XXX
status: draft
tags: [tag1, form]
---

# US-XXX-YY-ZZ: [Tên Biểu Mẫu Tạo/Sửa]

> **Tham chiếu:** BF-XXX-YY · Giao diện Mẫu §4.4 (Biểu mẫu)
> **Đường dẫn màn hình & Trạng thái liên quan:**
> - `[Đường dẫn gọi biểu mẫu hoặc Hộp thoại]` -> Trạng thái: `[Các trạng thái được phép]`



## 1. Yêu cầu Người dùng (User Story)
**Là một** [Vai trò], **tôi muốn** [Hành động], **để** [Mục đích].

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai độc lập.
> - [x] **N**egotiable — Chi tiết giao diện có thể thương lượng.
> - [x] **V**aluable — Mang lại giá trị rõ ràng.
> - [x] **E**stimable — Đủ rõ để ước lượng công sức.
> - [x] **S**mall — Hoàn thành trong 1 vòng phát triển.
> - [x] **T**estable — Có tiêu chí nghiệm thu ở mục 7.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-FORM-01] Ràng buộc phụ thuộc:** `NẾU` [Phân loại] = 'A' `THÌ` [Trường B] chuyển thành bắt buộc điền.
2. **[RULE-FORM-02] Quy tắc nội dung:** Không cho phép chứa ký tự đặc biệt ở trường Mã.
3. **[RULE-FORM-03] Chống trùng lặp:** `NẾU` Mã đã tồn tại `THÌ` chặn lưu, báo lỗi "Mã đã tồn tại".

### 2.1. Thông số & Định mức (Metrics & Thresholds)
*(Định nghĩa các con số giới hạn, định mức hoặc SLA áp dụng cho biểu mẫu này)*
- **[METRIC-01] Giới hạn số lượng:** Tối đa tạo 50 bản ghi/ngày/user.
- **[METRIC-02] Giới hạn thời gian:** Khóa form không cho sửa sau 24h kể từ khi tạo.

---

## 3. Cấu trúc Các trường nhập liệu

**Bố cục:** [1 Cột / 2 Cột].

### 3.1. Thông tin đầu vào

| Tên trường | Loại hiển thị | Bắt buộc | Trường dữ liệu | Ghi chú & Quy tắc |
|------------|---------------|----------|----------------|-------------------|
| Tên [Thực thể] | Ô nhập chữ | Có | Tên | Tối đa 100 ký tự. Cảnh báo đỏ nếu bỏ trống. |
| Phân loại | Danh sách thả xuống | Có | Loại | Thay đổi loại → xóa trống trường cấp dưới. |
| Trạng thái | Công tắc bật/tắt | Không | Hoạt động | Mặc định: Bật. |
| Ghi chú | Ô nhập văn bản dài | Không | Ghi chú | Tối đa 500 ký tự. |

### 3.2. Ví dụ Dữ liệu mẫu

*Giúp Lập trình viên tạo dữ liệu kiểm thử chính xác.*

| Tình huống | Dữ liệu đầu vào | Kết quả mong đợi |
|------------|-----------------|-------------------|
| Tạo thành công | Tên: "Nguyễn Văn A", Loại: "Học viên", Hoạt động: Bật | Lưu thành công, danh sách tải lại. |
| Trùng mã | Mã: "HV-24-0001" (đã tồn tại) | Báo lỗi "Mã đã tồn tại", chặn lưu. |
| Thiếu trường bắt buộc | Tên: (bỏ trống) | Viền đỏ ô Tên, chặn lưu. |

### 3.3. Nút hành động
| Nút | Loại hiển thị | Logic xử lý |
|-----|---------------|-------------|
| Hủy bỏ | Nút viền nhạt | Đóng hộp thoại, xóa trắng dữ liệu đang nhập. |
| Lưu | Nút màu nhấn | Kiểm tra → Lưu → Đóng → Tải lại danh sách. |

---

## 4. Mô tả chi tiết (Màn hình & Luồng)

*(Mô tả dễ hiểu, đầy đủ bằng ngôn ngữ tự nhiên để đội ngũ kỹ thuật có thể hiểu rõ và thực hiện được đúng yêu cầu. Không quy định định dạng cụ thể, người viết chủ động chọn cách thể hiện phù hợp như văn bản tự do, các bước thực hiện step-by-step, mã giả nghiệp vụ, hoặc vẽ sơ đồ luồng hoạt động...)*

### 4.1. Mô tả Màn hình
- [Người viết mô tả chi tiết bố cục của biểu mẫu (1 cột hay 2 cột), cách sắp xếp các nhóm trường thông tin nhập liệu, và các thành phần giao diện liên quan.]

### 4.2. Luồng Hoạt động (Workflow)
- [Người viết mô tả luồng đi của biểu mẫu từ lúc mở ra, quá trình người dùng nhập liệu, kiểm tra tính hợp lệ thời gian thực, cho đến khi bấm Lưu hoặc Hủy.]

---

## 5. Corner Cases (Trường hợp góc cạnh & Đặc biệt)

*(Bắt buộc phải liệt kê đầy đủ các trường hợp đặc biệt, ngoại lệ hoặc lỗi có thể xảy ra trong thực tế. Trong quá trình xây dựng, nếu phát sinh thêm bất kỳ trường hợp đặc biệt nào, người viết và lập trình viên phải lập tức cập nhật bổ sung vào bảng này.)*

| # | Tình huống đặc biệt (Corner Case) | Cách xử lý chi tiết | Ghi chú / Trạng thái |
|---|----------------------------------|---------------------|----------------------|
| 5.1 | Người dùng bấm Lưu khi biểu mẫu trống | Viền đỏ ô nhập liệu bắt buộc và hiển thị dòng chữ báo lỗi tương ứng ngay bên dưới trường đó. | Kiểm tra thời gian thực |
| 5.2 | Bấm ra ngoài biểu mẫu/hộp thoại khi đang điền | Ngăn chặn việc tự động đóng hộp thoại để tránh mất dữ liệu. Người dùng phải bấm nút Hủy để xác nhận đóng. | |
| 5.3 | Trùng mã định danh hoặc dữ liệu duy nhất | Khi bấm Lưu, hệ thống kiểm tra và chặn hành động lưu, hiển thị thông báo lỗi trùng dữ liệu cụ thể. | Chặn lưu từ hệ thống |
| 5.4 | Mất kết nối internet khi đang gửi biểu mẫu | Hiển thị trạng thái đang gửi bị lỗi và thông báo cho người dùng thử lại, giữ nguyên dữ liệu đã nhập trên biểu mẫu. | |

---

## 6. Tiêu chí Nghiệm thu (Acceptance Criteria)

*(Liệt kê chi tiết các điều kiện xác định sản phẩm/tính năng được xem là hoàn thành. Viết dưới dạng danh sách gạch đầu dòng rõ ràng, cụ thể và dễ dàng kiểm thử.)*

- **AC-1 (Bố cục chuẩn):** Biểu mẫu hiển thị đúng bố cục thiết kế đã chọn (1 cột hoặc 2 cột), các trường nhập liệu được gắn nhãn đầy đủ và rõ ràng.
- **AC-2 (Kiểm tra hợp lệ):** Khi bỏ trống trường bắt buộc và bấm Lưu, hệ thống phải chặn lưu, đồng thời bôi đỏ viền ô nhập liệu và hiển thị thông báo lỗi chi tiết.
- **AC-3 (Lưu dữ liệu thành công):** Khi điền thông tin hợp lệ và bấm Lưu, dữ liệu được ghi nhận vào hệ thống, hộp thoại đóng lại, danh sách chính tự động tải lại và hiển thị bản ghi mới.
- **AC-4 (Hủy bỏ an toàn):** Khi bấm nút Hủy bỏ, hệ thống xóa sạch dữ liệu tạm trên biểu mẫu và đóng hộp thoại mà không thực hiện bất kỳ thay đổi nào trên hệ thống.

