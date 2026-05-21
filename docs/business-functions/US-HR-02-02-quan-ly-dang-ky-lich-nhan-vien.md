---
id: US-HR-02-02
title: "Quản lý đăng ký lịch nhân viên"
bf: BF-HR-02
domain: CAP-HR
status: ready
tags: [hr, schedule, availability, staff-management]
---

# US-HR-02-02: Quản lý đăng ký lịch nhân viên

> **Tham chiếu:** BF-HR-02 · `[POLICY-IAM-03]` · `[POLICY-ORG-01]` · `[POLICY-DS-03]` · Giao diện Mẫu §4.2 (Danh sách) · Giao diện Mẫu §4.4 (Biểu mẫu)

## 1. Yêu cầu Người dùng (User Story)
**Là một** Quản lý trung tâm hoặc Nhân viên giáo vụ, **tôi muốn** xem, lọc và đăng ký lịch thay cho nhân viên thuộc phạm vi quản lý, **để** bảo đảm mỗi trung tâm có đủ quỹ thời gian nhân sự cho việc xếp lớp.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Tách được khỏi chức năng cấu hình khung giờ ưu tiên.
> - [x] **N**egotiable — Cách hiển thị danh sách nhân viên có thể tinh chỉnh.
> - [x] **V**aluable — Giúp quản lý xử lý nhân viên chưa đăng ký hoặc cần hỗ trợ.
> - [x] **E**stimable — Phạm vi gồm lọc, tổng hợp, xem chi tiết và đăng ký thay.
> - [x] **S**mall — Tập trung vào tuần đang xem và danh sách nhân viên.
> - [x] **T**estable — Có tiêu chí kiểm thử tại mục 6 và 7.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-HR-02-02-01] Phạm vi dữ liệu:** Người quản lý chỉ thấy nhân viên thuộc trung tâm hoặc phạm vi được phân quyền theo `[POLICY-ORG-01]`.
2. **[RULE-HR-02-02-02] Bộ lọc bắt buộc:** Danh sách phải lọc được theo trung tâm làm việc của nhân viên, chức danh, trạng thái và từ khóa; bộ lọc trung tâm không làm khung giờ đăng ký gắn cố định với trung tâm đó.
3. **[RULE-HR-02-02-03] Đăng ký thay:** Khi đăng ký lịch cho nhân viên khác, giao diện phải hiển thị rõ tên nhân viên đang được thao tác.
4. **[RULE-HR-02-02-04] Không chặn cứng trùng lịch:** Nếu một khung giờ đã có nhiều người đăng ký, hệ thống vẫn cho quản lý xem và cân nhắc; cảnh báo được hiển thị khi cần.
5. **[RULE-HR-02-02-05] Xem chi tiết khung giờ:** Khi một khung giờ có người đăng ký, quản lý có thể mở chi tiết để xem danh sách nhân viên.
6. **[RULE-HR-02-02-06] Thao tác nguy hiểm:** Hủy hoặc xóa lịch đã lưu cho nhân viên phải có xác nhận theo `[DS-P4]`.

---

## 3. Cấu trúc Giao diện & Dữ liệu

### 3.1. Thanh công cụ
| Thành phần | Loại hiển thị | Logic | Ghi chú |
6. **[RULE-HR-02-02-06] Thao tác nguy hiểm:** Hủy hoặc xóa lịch đã lưu cho nhân viên phải có xác nhận theo `[DS-P4]`.

---

## 3. Cấu trúc Giao diện & Dữ liệu

### 3.1. Thanh công cụ
| Thành phần | Loại hiển thị | Logic | Ghi chú |
|------------|---------------|-------|---------|
| Chọn trung tâm | Danh sách thả xuống | Lọc nhân viên theo trung tâm | Mặc định theo trung tâm của người dùng. |
| Chọn chức danh | Danh sách thả xuống | Lọc nhóm nhân sự | Có lựa chọn tất cả. |
| Ô tìm kiếm | Ô nhập chữ | Tìm theo tên, mã, email | Không phân biệt chữ hoa chữ thường. |
| Bộ lọc nâng cao | Bảng bên | Lọc theo trạng thái đăng ký | Theo mẫu tìm kiếm và lọc của Design System. |

### 3.2. Khối trạng thái
| Thành phần | Nhóm màu | Điều kiện | Ghi chú |
|------------|----------|-----------|---------|
| Tất cả | Mặc định | Bỏ lọc trạng thái | Hiển thị tổng số nhân viên. |
| Chờ đăng ký | Trung tính | Chưa có khung giờ trong tuần | Cần quản lý nhắc hoặc đăng ký thay. (Đây không phải là trạng thái Nháp). |
| Đã đăng ký | Tích cực | Đã lưu thành công khung giờ rảnh | Đủ điều kiện để vận hành xếp lớp. |
| Bị khóa | Cần chú ý | Lịch đã được xếp lớp | Không sửa trực tiếp. |

### 3.3. Bảng nhân viên
| Cột | Loại hiển thị | Nội dung | Ghi chú |
|-----|---------------|----------|---------|
| Nhân viên | Ảnh đại diện + văn bản | Tên, mã và chức danh | Bấm dòng để xem chi tiết đăng ký. |
| Trung tâm | Văn bản | Trung tâm làm việc | Theo phạm vi lọc. |
| Tổng giờ tuần | Văn bản | Tổng thời lượng đã đăng ký | Tính theo tuần đang xem. |
| Trạng thái | Nhãn màu | Trạng thái đăng ký | Theo bộ màu chuẩn (Chỉ có: Chờ đăng ký, Đã đăng ký, Bị khóa). |
| Thao tác | Nút biểu tượng | Đăng ký thay, xem chi tiết | Nút chỉ hiển thị biểu tượng phải có nhãn hỗ trợ. |

### 3.4. Lưới tổng hợp theo khung giờ
| Thành phần | Loại hiển thị | Logic | Ghi chú |
|------------|---------------|-------|---------|
| Ô khung giờ | Ô tổng hợp | Hiển thị số người đã đăng ký | Danh sách khung giờ chạy từ 07:00 đến 23:00, mỗi ô cách nhau 30 phút; bấm để mở chi tiết. |
| Nhóm ảnh đại diện | Chồng ảnh | Hiển thị tối đa một vài người đầu tiên | Phần còn lại hiển thị bằng số lượng. |
| Chi tiết khung giờ | Hộp thoại | Liệt kê người đăng ký trong khung giờ | Không tự thay đổi dữ liệu. |

### 3.5. Thanh tổng kết (Khi Đăng ký thay)
| Thành phần | Loại hiển thị | Logic | Ghi chú |
|------------|---------------|-------|---------|
| Tổng giờ đăng ký | Văn bản nổi bật | Cộng thời lượng các ô đã chọn | |
| Xác nhận đăng ký | Nút chính | Lưu lịch tuần cho nhân viên được chọn | Bị vô hiệu khi chưa chọn ô nào. |

### 3.6. Hành vi theo trạng thái tuần khi đăng ký thay
| Trạng thái tuần | Hành vi của quản lý | Hành vi thanh tổng kết | Ghi chú |
|----------------|----------------------|-------------------------|---------|
| Tuần mới chưa có đăng ký | Được chọn khung giờ thay cho nhân viên | Nút chính hiển thị lưu đăng ký | Áp dụng cho nhân viên đang được chọn. |
| Tuần đã đăng ký | Được cập nhật khung giờ chưa khóa | Nút chính hiển thị cập nhật đăng ký | Không tạo quy trình duyệt. |
| Tuần trong quá khứ | Chỉ xem lại lịch đã đăng ký | Các nút thay đổi bị vô hiệu | Không cho chỉnh sửa hồi tố. |
| Tuần có lịch bị khóa | Chỉ sửa các khung giờ chưa khóa | Hệ thống hiển thị số khung giờ bị khóa | Khung giờ bị khóa phải xử lý theo luồng vận hành. |

> **Lưu ý về Trạng thái Nháp (Draft):** Hệ thống Backend KHÔNG lưu trạng thái Nháp. Việc "lưu" đăng ký chỉ có trạng thái Đã đăng ký (Registered) hoặc Chưa đăng ký. "Nháp" là trạng thái tạm thời trên Frontend khi người dùng vừa quét/chọn khung giờ trên lưới nhưng chưa bấm nút Xác nhận/Lưu.

---

## 4. Xử lý Ngoại lệ
| # | Tình huống | Cách xử lý |
|---|-----------|-----------|
| 4.1 | Không có nhân viên phù hợp bộ lọc | Hiển thị trạng thái trống và cho phép xóa bộ lọc. |
| 4.2 | Nhân viên chưa đăng ký lịch | Hiển thị trạng thái "Chờ đăng ký" và gợi ý đăng ký thay. |
| 4.3 | Thoát chế độ đăng ký thay | Quay về danh sách quản lý và giữ bộ lọc hiện tại. Nếu có dữ liệu đang "Nháp" chưa lưu, cảnh báo xác nhận. |
| 4.4 | Khung giờ có quá nhiều người | Hiển thị số lượng còn lại và mở chi tiết khi bấm. |

---

## 5. Chỉ dẫn cho Đội ngũ phát triển (Hướng dẫn Triển khai)

- Tách biệt hoàn toàn phần xử lý giao diện và phần kiểm tra ràng buộc dữ liệu.
- Kiểm tra tính hợp lệ nghiệp vụ ngay khi người dùng nhập liệu để tăng trải nghiệm.
- Áp dụng các quy tắc phân quyền trước khi cho phép lưu dữ liệu.
- **Quan trọng:** Trạng thái "Nháp" chỉ tồn tại trong state của React (Frontend) để phục vụ UI. Khi call API lưu xuống Backend, chỉ gửi danh sách các khung giờ đã chọn (coi như Đã đăng ký). Khi load dữ liệu từ Backend lên, chỉ có "Đã đăng ký", "Đã khóa", "Đang sử dụng".

### ⛔ Hàng rào An toàn (Guardrails)
- **KHÔNG** thêm trường nhập liệu ngoài danh sách ở mục 3.1.
- **KHÔNG** thay đổi quy tắc kiểm tra hợp lệ nghiệp vụ ở mục 2 mà chưa được Product Owner xác nhận.
- **KHÔNG** thiết kế Database lưu trạng thái Draft cho từng khung giờ đăng ký.

---

## 6. Kế hoạch Tự kiểm tra (Self-Verification)

| # | Hạng mục | Cách kiểm tra | Tiêu chuẩn Đạt |
|---|----------|---------------|-----------------|
| V-01 | Lọc trung tâm | Chọn từng trung tâm | Bảng chỉ còn nhân viên thuộc trung tâm đã chọn. |
| V-02 | Lọc trạng thái | Bấm từng khối trạng thái | Count và bảng thay đổi đúng. |
| V-03 | Đăng ký thay | Chọn một nhân viên và bấm đăng ký | Phần tiêu đề hiển thị đúng nhân viên đang thao tác. |
| V-04 | Chi tiết khung giờ | Bấm ô có người đăng ký | Hộp thoại liệt kê đúng danh sách và khung giờ theo bước 30 phút. |
---

## 7. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|--------------------|-----------------------|-------------------|
| AC-01 | Danh sách quản lý có đủ bộ lọc | Mở thẻ quản lý | Có trung tâm, chức danh, tìm kiếm và trạng thái. |
| AC-02 | Bộ lọc trung tâm chính xác | Chọn một trung tâm | Không còn nhân viên ngoài trung tâm đó. |
| AC-03 | Đăng ký thay rõ ngữ cảnh | Bấm đăng ký cho một nhân viên | Tên nhân viên hiển thị ở vùng thao tác chính. |
| AC-04 | Lưới tổng hợp đọc được | Mở tuần có dữ liệu | Ô có người đăng ký hiển thị số lượng và ảnh đại diện. |
| AC-05 | Trạng thái trống đúng chuẩn | Lọc không còn kết quả | Dùng trạng thái trống chuẩn, không lỗi giao diện. |
| AC-06 | Thanh tổng kết cố định khi đăng ký thay | Chọn một nhân viên và cuộn lưới tuần | Thanh tổng kết vẫn nằm ở cuối khung đăng ký. |
| AC-07 | Tuần quá khứ không sửa được | Chọn một tuần trước tuần hiện tại | Các nút lưu và xóa bị vô hiệu. |
