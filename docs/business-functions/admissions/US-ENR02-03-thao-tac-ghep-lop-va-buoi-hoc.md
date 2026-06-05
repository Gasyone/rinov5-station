---
id: US-ENR02-03
title: "Thao tác Ghép lớp và Buổi học"
bf: BF-ENR-02
domain: CAP-ADM
status: draft
tags: [enrollment, trial, form]
---

# US-ENR02-03: Thao tác Ghép lớp và Buổi học

> **Tham chiếu:** BF-ENR-02 · `[RULE-ENR-02-05]` · `[RULE-ENR-02-09]` · Giao diện Mẫu §4.4 (Biểu mẫu)

## 1. Yêu cầu Người dùng (User Story)

**Là một** Giáo vụ / Quản lý chi nhánh,
**tôi muốn** mở hộp thoại ghép lớp cho một phiếu học thử đang chờ gán ca học, xem thông tin lớp cũ (nếu có), sử dụng bộ chọn ngày để lọc nhanh lớp trống và chọn ca học phù hợp,
**để** hoàn tất việc xếp ca học thử cho học sinh mà vẫn kiểm soát được sĩ số và độ tải của các lớp đang vận hành.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai độc lập dưới dạng hộp thoại thao tác phụ trợ.
> - [x] **N**egotiable — Giao diện hiển thị ca học có thể điều chỉnh để tăng trải nghiệm người dùng.
> - [x] **V**aluable — Giúp điều phối viên xếp lớp nhanh chóng, chính xác và trực quan.
> - [x] **E**stimable — Đã xác định rõ các điều kiện lọc và ràng buộc sĩ số.
> - [x] **S**mall — Hoàn thành trong một đợt phát triển.
> - [x] **T**estable — Có tiêu chí nghiệm thu rõ ràng ở mục 6.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1.  **[RULE-FORM-01] Lọc lớp thông minh:** Danh sách lớp học gợi ý trong bảng lịch khả dụng phải tự động lọc chính xác theo đúng Chương trình học và Môn học được ghi nhận trong phiếu học thử của học viên.
2.  **[RULE-FORM-02] Bộ lọc khoảng ngày học thử:** Hộp thoại cung cấp một bộ chọn khoảng ngày. Giáo vụ chọn khoảng ngày mong muốn học thử của học viên, danh sách ca học khả dụng sẽ tự động được lọc và hiển thị trong khoảng thời gian này.
3.  **[RULE-FORM-03] Kiểm soát sĩ số nghiêm ngặt:** Đối với từng ca học chi tiết, nếu số lượng học viên có mặt thực tế (gồm cả học viên chính thức và học viên học thử đã ghép trước đó) bằng hoặc vượt quá sĩ số tối đa của ca học, hệ thống sẽ vô hiệu hóa ô chọn (vô hiệu hộp kiểm) và hiển thị ca học ở trạng thái mờ (không cho phép chọn).
4.  **[RULE-FORM-04] Xếp ca học duy nhất:** Mỗi booking học thử chỉ được phép chọn **đúng 1 ca học duy nhất**. Hộp kiểm chọn ca tự động hoạt động như nút chọn duy nhất (khi chọn ca mới sẽ tự động hủy chọn ca cũ).
5.  **[RULE-FORM-05] Quy trình chuyển trạng thái:** Sau khi Giáo vụ thực hiện ghép lớp thành công (bằng cách chọn ca và bấm *Xác nhận ghép* hoặc *Lưu thay đổi*), trạng thái của phiếu học thử sẽ tự động chuyển sang **Chờ xác nhận** để chờ duyệt chính thức, chứ không chuyển thẳng sang Đã ghép lớp ngay để kiểm soát chất lượng vận hành.

### 2.1. Thông số & Định mức (Metrics & Thresholds)

- **[METRIC-01] Giới hạn thời gian xếp:** Chỉ cho phép thực hiện xếp lớp cho các ca học thử diễn ra trong tương lai (không xếp vào các ca học đã bắt đầu hoặc diễn ra trong quá khứ).

---

## 3. Cấu trúc Các trường nhập liệu

**Bố cục:** 1 Cột dọc, các khu vực phân tách bằng dòng kẻ ngang mờ.

### 3.1. Thông tin đầu vào

| Tên trường | Loại hiển thị | Bắt buộc | Trường dữ liệu | Ghi chú & Quy tắc |
| :--- | :--- | :--- | :--- | :--- |
| Thông tin hiện tại | Vùng hiển thị (Chỉ xem) | — | Lớp, ca, thời gian hiện tại | Chỉ hiển thị nếu phiếu học thử đã từng được gán ca học trước đó. |
| Chọn khoảng ngày | Bộ chọn khoảng ngày | Không | Khoảng ngày học thử | Lọc nhanh các ca diễn ra trong khoảng ngày được chọn. |
| Lớp khả dụng | Khối thông tin co giãn | Có | Ca học thử | Mở lớp để chọn duy nhất 1 ca học. Ca học đầy sĩ số bị mờ đi. |
| Ghi chú giáo viên | Ô nhập văn bản dài | Không | Ghi chú | Nhập lưu ý đặc biệt gửi cho giáo viên dạy buổi học đó. |

### 3.2. Ví dụ Dữ liệu mẫu

| Tình huống | Dữ liệu đầu vào | Kết quả mong đợi |
| :--- | :--- | :--- |
| Ghép thành công | Lớp: "Cambridge Starter A1", Ca: "Starter S1" (Sĩ số: 10/15) | Phiếu học thử được cập nhật ca ghép, trạng thái chuyển sang Chờ xác nhận. |
| Ca học đầy sĩ số | Lớp: "IELTS Prep IP1", Ca: "IELTS IP2" (Sĩ số: 12/12) | Ca học bị hiển thị mờ, hộp kiểm bị khóa không thể tích chọn. |

### 3.3. Nút hành động

| Nút | Loại hiển thị | Logic xử lý |
| :--- | :--- | :--- |
| Hủy | Nút viền nhạt | Đóng hộp thoại và không thay đổi dữ liệu của phiếu học thử. |
| Xác nhận ghép | Nút màu nhấn | Kiểm tra lựa chọn → Cập nhật ca học → Đóng → Đổi trạng thái booking thành Chờ xác nhận. |

---

## 4. Mô tả chi tiết (Màn hình & Luồng)

### 4.1. Mô tả Màn hình
Hộp thoại trượt từ giữa màn hình lên (Cửa sổ nổi). Phía trên hiển thị tóm tắt thông tin ca học hiện tại của học viên làm căn cứ đối chiếu. Bên dưới là vùng Lịch khả dụng với thanh chọn khoảng ngày nằm ngang nổi bật. Mỗi lớp học là một khối co giãn (mở rộng/thu gọn) mượt mà, bấm mở rộng sẽ hiển thị danh sách các ca học chi tiết cùng hộp kiểm tròn chọn ca học.

### 4.2. Luồng Hoạt động (Workflow)
Khi Giáo vụ bấm "Ghép lớp" hoặc "Đổi buổi học" trên chi tiết booking, hộp thoại mở ra. Giáo vụ lựa chọn khoảng thời gian học sinh mong muốn trải nghiệm. Hệ thống tự động lọc các ca học tương ứng của lớp. Giáo vụ mở rộng lớp học phù hợp, tích chọn duy nhất 1 ca học trống chỗ, nhập ghi chú lưu ý đặc biệt cho giáo viên, rồi bấm "Xác nhận ghép".

---

## 5. Corner Cases (Trường hợp góc cạnh & Đặc biệt)

| # | Tình huống đặc biệt (Corner Case) | Cách xử lý chi tiết | Ghi chú / Trạng thái |
| :--- | :--- | :--- | :--- |
| 5.1 | Giáo vụ bấm Xác nhận khi chưa tích ca học | Hệ thống hiển thị thông báo nhắc nhở "Vui lòng chọn ít nhất 1 ca học" và chặn hành động lưu. | Chặn lưu |
| 5.2 | Tất cả các ca học của lớp đều đầy sĩ số | Khối co giãn vẫn mở rộng được nhưng tất cả ca học đều mờ đi và bị vô hiệu hóa ô chọn. | |
| 5.3 | Đang gán ca thì lớp học bị thay đổi lịch | Khi bấm Lưu, hệ thống kiểm tra và báo ca học đã bị thay đổi, yêu cầu Giáo vụ tải lại hộp thoại. | Xung đột đồng thời |

---

## 6. Tiêu chí Nghiệm thu (Acceptance Criteria)

- **AC-1 (Bố cục chuẩn):** Hộp thoại hiển thị đúng vùng thông tin hiện tại ở trên, bộ lọc ngày ở giữa, khối co giãn lớp học ở dưới và ô ghi chú cố định tại chân trang.
- **AC-2 (Chọn ca đơn):** Bảng ca học chỉ cho chọn duy nhất 1 ca học thử. Việc chọn ca học mới sẽ tự động hủy chọn ca học cũ.
- **AC-3 (Kiểm soát sĩ số):** Các ca học đã đầy sĩ số (số lượng học viên đã ghép lớn hơn hoặc bằng sĩ số tối đa) bắt buộc phải bị vô hiệu hóa hộp kiểm và hiển thị mờ.
- **AC-4 (Xác nhận thành công):** Bấm Xác nhận ghép sẽ đóng hộp thoại, cập nhật ca gán, tự động đưa trạng thái booking về Chờ xác nhận và ghi lịch sử hoạt động.