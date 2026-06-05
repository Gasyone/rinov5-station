---
id: US-HR-02-01
title: "Đăng ký lịch làm việc cá nhân"
bf: BF-HR-02
domain: CAP-HR
status: ready
tags: [hr, schedule, availability, personal]
---

# US-HR-02-01: Đăng ký lịch làm việc cá nhân

> **Tham chiếu:** BF-HR-02 · `[POLICY-IAM-03]` · `[POLICY-DS-03]` · Giao diện Mẫu §4.2 (Danh sách)

## 1. Yêu cầu Người dùng (User Story)

**Là một** Nhân viên hoặc Giáo viên, **tôi muốn** đăng ký một lần khung lịch rảnh tuần (Thứ 2 đến Chủ nhật) của mình, **để** làm quỹ thời gian cá nhân áp dụng tự động cho mọi tuần trước khi trung tâm xếp lịch vận hành.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Có thể triển khai độc lập với chức năng quản lý lịch nhân viên.
> - [x] **N**egotiable — Cách trình bày lưới tuần có thể tinh chỉnh theo thiết kế.
> - [x] **V**aluable — Giúp nhân sự chủ động khai báo thời gian làm việc.
> - [x] **E**stimable — Phạm vi gồm chọn lịch, xem tổng giờ, lưu và sửa lịch.
> - [x] **S**mall — Hoàn thành trong một màn hình.
> - [x] **T**estable — Có tiêu chí nghiệm thu ở mục 6.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-HR-02-01-01] Phạm vi cá nhân:** Nhân viên chỉ thao tác trực tiếp trên lịch rảnh của chính mình, trừ khi có quyền quản lý theo `[POLICY-IAM-03]`.
2. **[RULE-HR-02-01-02] Đăng ký một lần:** Việc đăng ký lịch khả dụng rảnh là đăng ký một lần duy nhất cho khung lịch mẫu từ Thứ 2 đến Chủ nhật và tự động áp dụng cho tất cả các ngày trong mọi tuần tương lai. Không có khái niệm phân biệt hay chuyển đổi tuần trước, tuần sau hay tuần này khi đăng ký.
3. **[RULE-HR-02-01-03] Lưu lịch mẫu:** Khi lưu thành công, lịch mẫu tuần sẽ áp dụng trực tiếp làm quỹ thời gian rảnh mặc định của nhân viên cho tất cả các tuần tiếp theo.
4. **[RULE-HR-02-01-04] Sửa lịch đã lưu:** Người dùng có thể cập nhật lại các khung giờ rảnh của mình bất kỳ lúc nào khi có thay đổi nguyện vọng, ngoại trừ các khung giờ đã được gán, phân bổ lớp học/công việc thực tế.
5. **[RULE-HR-02-01-05] Khung giờ đã được gán, phân bổ:** Khung giờ rảnh đã được Giáo vụ gán để xếp lịch lớp/buổi học thực tế sẽ tự động hiển thị tên lớp học đã gán (ví dụ: "IELTS-01", "TOEIC-02") trực tiếp bên trong ô chọn. Khung giờ này bị khóa ở trạng thái chỉ đọc, người dùng không thể bấm chọn hoặc bỏ chọn (không được tương tác) khi cập nhật.
6. **[RULE-HR-02-01-06] Trạng thái hợp lệ:** Các trạng thái của ô grid gồm: Chưa chọn (Trống), Đã chọn (Lịch rảnh), và Đã được gán, phân bổ (Chỉ đọc, hiển thị tên lớp học).

### 2.1. Thông số & Định mức (Metrics & Thresholds)

- **[METRIC-HR-02-01-01] Hiệu năng lưu lịch:** Thời gian phản hồi API khi lưu lịch mẫu tuần dưới 1.0 giây.
- **[METRIC-HR-02-01-02] SLA thiết bị di động:** Giao diện lưới thời gian phải cuộn mượt mà trên thiết bị di động (ở chiều dọc) hoặc chuyển đổi tương ứng để tránh bể layout.

---

## 3. Cấu trúc Giao diện & Dữ liệu

### 3.1. Thanh công cụ
| Thành phần | Loại hiển thị | Logic | Ghi chú |
|------------|---------------|-------|---------|
| Chế độ xem | Nút phân đoạn | Chuyển góc nhìn (Của tôi / Nhân viên / Tổng quan) | Chọn tab "Của tôi" để tự đăng ký. |
| Chọn trung tâm | Danh sách thả xuống | Lọc bối cảnh đăng ký | Mặc định là trung tâm đang làm việc. |
| Cảnh báo | Nút biểu tượng | Mở hộp thoại cảnh báo | Chỉ hiển thị khi có cảnh báo vận hành cần đọc. |

### 3.2. Khối lọc Trạng thái
| Thành phần | Nhóm màu | Điều kiện | Ghi chú |
|------------|----------|-----------|---------|
| Chưa chọn | Trống / Viền mờ | Khung giờ đang trống | Cho phép bấm chọn rảnh. |
| Đã chọn rảnh | Sáng màu (Màu nhấn tích cực) | Khung giờ đã đánh dấu rảnh | Cho phép bấm để bỏ chọn. |
| Đã được gán, phân bổ | Đầy màu (Chứa tên lớp) | Có lớp học/buổi học thực tế đè lên | Bị vô hiệu hóa hoàn toàn, chặn tương tác. |

### 3.3. Bảng danh sách chính (Lưới đăng ký mẫu Mon-Sun)
| Cột | Loại hiển thị | Trường Dữ liệu | Ghi chú |
|-----|---------------|----------------|---------|
| Khung giờ | Văn bản | `07:00` đến `23:00` | Bước 30 phút. |
| Thứ 2 - Chủ nhật | Lưới ô tương tác | Trạng thái ô, tên lớp học | Click hoặc kéo chuột để chọn. Hiển thị tên lớp (ví dụ: "IELTS-01") nếu đã gán. |

### 3.4. Thao tác khi rê chuột vào dòng (Hoặc tương tác ô lịch)
| Nút / Thao tác | Loại | Logic | Điều kiện |
|-----|------|-------|-----------|
| Bấm/Kéo chuột trái | Thao tác click & drag | Toggles trạng thái rảnh/trống | `NẾU ô ở trạng thái khác 'Đã được gán, phân bổ'` |

### 3.5. Bảng lọc nâng cao
Không áp dụng cho màn hình đăng ký cá nhân.

### 3.6. Phân trang
Lưới lịch mẫu tuần là cố định (Thứ 2 đến Chủ nhật), không sử dụng bộ phân trang.

---

## 4. Mô tả chi tiết (Màn hình & Luồng)

### 4.1. Mô tả Màn hình
- Giao diện gồm thanh Toolbar phía trên để chuyển đổi chế độ xem.
- Vùng trung tâm là một lưới bảng biểu chia làm 8 cột (Cột 1 là trục giờ từ 07:00 đến 23:00 với 32 dòng tương đương bước 30 phút; 7 cột tiếp theo là các ngày từ Thứ 2 đến Chủ nhật).
- Ở góc dưới cùng là một Action Bar cố định (Fixed footer) hiển thị tổng giờ rảnh đã chọn, số giờ thuộc khung ưu tiên, nút "Xóa chọn" và nút "Xác nhận đăng ký".

### 4.2. Luồng Hoạt động (Workflow)
1. **Truy cập:** Người dùng đăng nhập vào hệ thống, mở `/app/work_registration`, hệ thống mặc định chọn thẻ "Của tôi".
2. **Khai báo:** Người dùng click vào các ô trống để đánh dấu rảnh, hoặc bấm kéo chuột để chọn nhanh một dải giờ. Tổng giờ rảnh trên Action Bar tự động cộng dồn (ví dụ: chọn 3 ô -> hiển thị 1.5 giờ).
3. **Chặn sửa:** Nếu ô giờ đó đã được phân công buổi học (ví dụ: đã gán dạy lớp "IELTS-01"), ô hiển thị chữ "IELTS-01" và bị vô hiệu hóa hoàn toàn (mờ đi, không có hiệu ứng hover, không nhận click).
4. **Lưu lịch:** Người dùng bấm nút "Xác nhận đăng ký". Hệ thống hiển thị thông báo đã lưu thành công và áp dụng cho tất cả các tuần tiếp theo.

---

## 5. Corner Cases (Trường hợp góc cạnh & Đặc biệt)

| # | Tình huống đặc biệt (Corner Case) | Cách xử lý chi tiết | Ghi chú / Trạng thái |
|---|----------------------------------|---------------------|----------------------|
| 5.1 | Không chọn khung giờ nào nhưng bấm lưu | Hệ thống vô hiệu hóa (disabled) nút "Xác nhận đăng ký". Nếu cố tình tác động, hiển thị thông điệp cảnh báo đỏ yêu cầu chọn ít nhất một ca rảnh. | Nút chính bị khóa |
| 5.2 | Thử bấm vào ô đã được gán lớp học | Hệ thống chặn hoàn toàn mọi phản hồi (click hoặc kéo chuột). Con trỏ chuột chuyển sang dạng vòng tròn gạch chéo (forbidden) khi rê qua ô này. Lịch sử gán lớp và tên lớp học hiển thị cố định. | Khóa tương tác 100% |
| 5.3 | Bấm nút "Xóa chọn" khi lưới có cả ô rảnh tự chọn và ô đã gán lớp | Hệ thống chỉ xóa trắng trạng thái của các ô rảnh màu xanh thông thường do giáo viên tự chọn trên màn hình. Giữ nguyên 100% các ô có chứa tên lớp học đã gán và trạng thái disabled của chúng. | Bảo vệ dữ liệu gán lớp |
| 5.4 | Đang thao tác click & drag chọn ca thì bị ngắt mạng | Hệ thống giữ nguyên trạng thái chọn tạm thời trên giao diện (Frontend draft state). Hiển thị một thanh cảnh báo đỏ mờ trên đầu lưới: "Mất kết nối Internet. Vui lòng kiểm tra lại đường truyền trước khi bấm Xác nhận". Không làm mất các ô người dùng vừa chọn. | Chống mất dữ liệu nháp |
| 5.5 | Giáo viên được phân công dạy thay tạm thời (không lặp lại) | Nếu giáo viên được xếp lịch dạy thay chỉ 1 buổi cụ thể ở một tuần nhất định, ca học đó trên lưới Lịch Khung/Mẫu tuần (áp dụng cho mọi tuần tương lai) vẫn hiển thị là Rảnh (Available) để tiếp tục xếp các lịch khác ở các tuần khác, không bị khóa cứng. Lưới chỉ khóa cứng khi buổi học là lịch xếp cố định, lặp lại hàng tuần. | Xử lý linh hoạt dạy thay |
| 5.6 | Người dùng bấm nút "Xóa chọn" để xóa sạch lịch mẫu cũ đã lưu | Hệ thống hiển thị một hộp thoại xác nhận nguy hiểm (ConfirmDialog) theo chuẩn `[DS-P4]`: "Hành động này sẽ xóa toàn bộ quỹ thời gian rảnh mẫu hiện tại của bạn. Bạn có chắc chắn muốn thực hiện?". Chỉ gửi yêu cầu xóa lên máy chủ khi người dùng nhấn nút "Đồng ý xóa". | Phòng tránh thao tác nhầm |

---

## 6. Tiêu chí Nghiệm thu (Acceptance Criteria)

- **AC-1 (Hiển thị Lưới Mon-Sun chuẩn):** Giao diện lưới lịch mẫu tuần hiển thị cố định các cột từ Thứ 2 đến Chủ nhật, trục giờ dọc từ 07:00 đến 23:00 chia vạch chi tiết 30 phút. Tuyệt đối không hiển thị ngày tháng dương lịch cụ thể (ví dụ: ngày 25/05) hoặc các nút điều hướng chuyển đổi tuần trước/tuần sau.
- **AC-2 (Tính toán tổng giờ rảnh tức thời):** Khi người dùng click chọn hoặc kéo chuột chọn nhiều ô rảnh trên lưới, chỉ số "Tổng giờ đăng ký" trên Action Bar phía dưới cùng phải cập nhật tăng/giảm ngay lập tức theo bước 30 phút của từng ô chọn (ví dụ: chọn 5 ô -> hiển thị 2.5 giờ).
- **AC-3 (Chặn tương tác ô đã gán lớp):** Tất cả các ô đã được xếp lớp học thực tế phải hiển thị rõ tên lớp học (ví dụ: "IELTS-01"), chuyển sang màu xám mờ chỉ đọc, hoàn toàn không phản hồi thao tác click chọn/hủy chọn và không bị đổi trạng thái khi bấm nút "Xóa chọn".
- **AC-4 (Xác nhận hủy chọn an toàn):** Nút "Xóa chọn" chỉ hoạt động trên các ô màu xanh do người dùng tự click chọn. Nếu lưới có thay đổi so với lịch đã lưu trước đó, khi click "Xóa chọn" hệ thống bắt buộc hiển thị hộp thoại xác nhận an toàn trước khi xóa.
- **AC-5 (Lưu và đồng bộ vô thời hạn):** Khi nhấn "Xác nhận đăng ký", hệ thống lưu lịch mẫu thành công, hiển thị thông báo Toast xanh dương chuẩn tích cực, nút "Xác nhận" tạm thời ẩn đi cho đến khi có thay đổi mới, và lịch mẫu rảnh này tự động áp dụng làm quỹ thời gian cho tất cả các tuần tiếp theo.
- **AC-6 (Action Bar ghim cố định):** Thanh Action Bar chứa tổng giờ rảnh và nút lưu phải ghim cố định ở đáy màn hình (Fixed footer), không bị trôi hay biến mất khi người dùng cuộn dọc danh sách giờ của lưới lịch.
