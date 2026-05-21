---
id: US-HR-02-01
title: "Đăng ký lịch làm việc cá nhân"
bf: BF-HR-02
domain: CAP-HR
status: ready
tags: [hr, schedule, availability, personal]
---

# US-HR-02-01: Đăng ký lịch làm việc cá nhân

> **Tham chiếu:** BF-HR-02 · `[POLICY-IAM-03]` · `[POLICY-DS-03]` · Giao diện Mẫu §4.4 (Biểu mẫu) · Giao diện Mẫu §4.2 (Danh sách)

## 1. Yêu cầu Người dùng (User Story)
**Là một** Nhân viên hoặc Giáo viên, **tôi muốn** xem tuần làm việc và chọn các khung giờ tôi có thể làm việc, **để** đăng ký quỹ thời gian cá nhân trước khi trung tâm xếp lịch vận hành.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Có thể triển khai độc lập với chức năng quản lý lịch nhân viên.
> - [x] **N**egotiable — Cách trình bày lưới tuần có thể tinh chỉnh theo thiết kế.
> - [x] **V**aluable — Giúp nhân sự chủ động khai báo thời gian làm việc.
> - [x] **E**stimable — Phạm vi gồm chọn lịch, xem tổng giờ, lưu và sửa lịch.
> - [x] **S**mall — Hoàn thành trong một màn hình.
> - [x] **T**estable — Có tiêu chí kiểm thử tại mục 6 và 7.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-HR-02-01-01] Phạm vi cá nhân:** Nhân viên chỉ thao tác trực tiếp trên lịch của chính mình, trừ khi có quyền quản lý theo `[POLICY-IAM-03]`.
2. **[RULE-HR-02-01-02] Khung giờ hợp lệ:** Người dùng chỉ được chọn các ngày từ hôm nay trở đi.
3. **[RULE-HR-02-01-03] Lưu lịch tuần:** Khi lưu thành công, tuần đang xem chuyển sang trạng thái "Đã đăng ký" và có thể được dùng ngay làm quỹ thời gian vận hành.
4. **[RULE-HR-02-01-04] Sửa lịch đã lưu:** Nếu lịch chưa bị khóa bởi xếp lịch vận hành, người dùng có thể vào chế độ sửa để cập nhật lại các khung giờ.
5. **[RULE-HR-02-01-05] Khung giờ đã khóa:** Khung giờ đã được dùng để xếp lớp không được xóa trực tiếp; người dùng phải chuyển sang luồng xử lý thay đổi lịch theo quy định vận hành.
6. **[RULE-HR-02-01-06] Trạng thái hợp lệ:** Các trạng thái được dùng gồm Nháp, Đã đăng ký, Đang sử dụng và Đã khóa.

---

## 3. Cấu trúc Giao diện & Dữ liệu

### 3.1. Thanh điều hướng lịch
| Thành phần | Loại hiển thị | Logic | Ghi chú |
|------------|---------------|-------|---------|
| Chọn chế độ xem | Nút phân đoạn | Chuyển giữa Tuần và Tháng | Mặc định là Tuần. |
| Chọn trung tâm | Danh sách thả xuống | Lọc bối cảnh đăng ký | Mặc định là trung tâm đang làm việc. |
| Điều hướng thời gian | Nhóm nút | Về hôm nay, tuần trước, tuần sau | Không làm mất lựa chọn chưa lưu. |
| Cảnh báo | Nút biểu tượng | Mở ghi chú trước khi đăng ký | Chỉ hiển thị khi có cảnh báo cần đọc. |

### 3.2. Lưới đăng ký tuần
| Thành phần | Loại hiển thị | Logic | Ghi chú |
|------------|---------------|-------|---------|
| Cột khung giờ | Văn bản | Hiển thị các khung giờ từ 07:00 đến 23:00 | Mỗi ô cách nhau 30 phút. |
| Ô khung giờ | Ô chọn tương tác | Bấm hoặc kéo để chọn và bỏ chọn | Mỗi ô đại diện 30 phút; ngày quá khứ bị khóa thao tác. |
| Khung giờ ưu tiên | Dấu nhận biết | Đánh dấu khung giờ trung tâm ưu tiên | Dùng để tính tổng giờ ưu tiên. |
| Trạng thái tuần | Nhãn trạng thái | Hiển thị trạng thái lưu gần nhất | Theo bộ màu trạng thái chuẩn. |

### 3.3. Thanh tổng kết
| Thành phần | Loại hiển thị | Logic | Ghi chú |
|------------|---------------|-------|---------|
| Tổng giờ đăng ký | Văn bản nổi bật | Cộng thời lượng các ô đã chọn | Cập nhật tức thời. |
| Tổng giờ ưu tiên | Văn bản có dấu nhận biết | Cộng các khung giờ ưu tiên đã chọn | Dùng cho khuyến nghị vận hành. |
| Xóa chọn | Nút phụ | Xóa lựa chọn trong tuần đang xem | Nếu xóa lịch đã lưu thì cần xác nhận theo `[DS-P4]`. |
| Xác nhận đăng ký | Nút chính | Lưu lịch tuần | Bị vô hiệu khi chưa chọn khung giờ nào. |

### 3.4. Hành vi theo trạng thái tuần
| Trạng thái tuần | Hành vi ô lịch | Hành vi thanh tổng kết | Ghi chú |
|----------------|----------------|-------------------------|---------|
| Tuần mới chưa có đăng ký | Cho phép chọn các ngày hợp lệ từ hôm nay trở đi | Nút chính hiển thị lưu đăng ký và chỉ bật khi có ít nhất một khung giờ | Sau khi lưu, lịch chuyển sang đã đăng ký. |
| Tuần đã đăng ký | Cho phép chỉnh sửa các khung giờ chưa bị khóa | Nút chính hiển thị cập nhật đăng ký | Không cần duyệt lại sau khi cập nhật. |
| Tuần trong quá khứ | Chỉ xem lại, không cho chọn hoặc bỏ chọn | Các nút thay đổi bị vô hiệu | Dùng để tra cứu quỹ thời gian đã khai báo. |
| Tuần có toàn bộ khung giờ bị khóa | Chỉ xem lại, không cho thay đổi trực tiếp | Các nút thay đổi bị vô hiệu | Thay đổi phải xử lý qua luồng vận hành liên quan. |

### 3.5. Chế độ xem tháng
| Thành phần | Loại hiển thị | Logic | Ghi chú |
|------------|---------------|-------|---------|
| Ô ngày | Lịch tháng | Tóm tắt số khung giờ đã đăng ký | Không thay thế thao tác chính ở lưới tuần. |
| Nhóm ca | Nhãn ngắn | Sáng, Chiều, Tối | Giúp đọc nhanh mật độ đăng ký. |

---

## 4. Xử lý Ngoại lệ
| # | Tình huống | Cách xử lý |
|---|-----------|-----------|
| 4.1 | Chưa chọn khung giờ nào | Không cho lưu và hướng dẫn chọn ít nhất một khung giờ. |
| 4.2 | Chọn ngày đã qua | Ô lịch mờ đi và không nhận thao tác. |
| 4.3 | Tuần đã được đăng ký | Chỉ cho sửa khi lịch chưa bị khóa. |
| 4.4 | Lịch có khung giờ đã khóa | Hiển thị rõ khung giờ bị khóa và không cho bỏ chọn trực tiếp. |

---

## 5. Chỉ dẫn cho Đội ngũ phát triển (Hướng dẫn Triển khai)

- Tách biệt hoàn toàn phần xử lý giao diện và phần kiểm tra ràng buộc dữ liệu.
- Kiểm tra tính hợp lệ nghiệp vụ ngay khi người dùng nhập liệu để tăng trải nghiệm.
- Áp dụng các quy tắc phân quyền trước khi cho phép lưu dữ liệu.

### ⛔ Hàng rào An toàn (Guardrails)
- **KHÔNG** thêm trường nhập liệu ngoài danh sách ở mục 3.1.
- **KHÔNG** thay đổi quy tắc kiểm tra hợp lệ nghiệp vụ ở mục 2 mà chưa được Product Owner xác nhận.
---

## 6. Kế hoạch Tự kiểm tra (Self-Verification)

| # | Hạng mục | Cách kiểm tra | Tiêu chuẩn Đạt |
|---|----------|---------------|-----------------|
| V-01 | Chọn lịch | Chọn nhiều ô ở nhiều ngày | Tổng giờ cập nhật đúng. |
| V-02 | Ngày quá khứ | Thử bấm vào ngày trước hôm nay | Không thể chọn. |
| V-03 | Lưu lịch | Chọn ít nhất một ô và xác nhận | Trạng thái tuần cập nhật, ô đã chọn vẫn hiển thị. |
| V-04 | Màu trạng thái | Kiểm tra các nhãn trạng thái | Tất cả lấy từ bộ màu chuẩn. |

---

## 7. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|--------------------|-----------------------|-------------------|
| AC-01 | Màn hình mở ở thẻ cá nhân | Truy cập màn Đăng ký lịch | Thẻ "Của tôi" được chọn mặc định. |
| AC-02 | Chọn khung giờ hợp lệ | Chọn ít nhất ba khung giờ trong tuần | Tổng giờ tăng đúng theo bước 30 phút của từng khung giờ. |
| AC-03 | Không chọn được ngày quá khứ | Bấm vào ô thuộc ngày đã qua | Ô không đổi trạng thái. |
| AC-04 | Lưu lịch thành công | Bấm xác nhận sau khi đã chọn ô | Tuần hiển thị trạng thái đã lưu và có thời điểm cập nhật. |
| AC-05 | Sửa lịch đã lưu | Bấm sửa tuần đã lưu | Người dùng có thể cập nhật các ô chưa khóa. |
| AC-06 | Tuần quá khứ chỉ đọc | Chuyển về một tuần trước tuần hiện tại | Các ô và nút thay đổi đều không cho thao tác. |
| AC-07 | Thanh tổng kết cố định | Cuộn nội dung lưới tuần | Thanh tổng kết vẫn nằm ở cuối khung màn hình. |
