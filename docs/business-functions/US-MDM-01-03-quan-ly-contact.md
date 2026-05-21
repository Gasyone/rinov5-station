---
id: US-MDM-01-03
title: Quản lý thông tin Liên lạc (Contact Management)
bf: BF-MDM-01
domain: CAP-MDM
status: core
tags: [mdm, person, contact, phone, email, address, primary]
---

# US-MDM-01-03: Quản lý thông tin Liên lạc (Contact Management)

> **Tuân thủ Tiêu chuẩn:**
> - `[POLICY-MDM-02]` Identity vs Contact Split — Contact là thực thể tách biệt, quan hệ 1-N với Person.

> **Phạm vi:** Tab "Liên lạc" trên trang chi tiết Person. Quản lý danh sách SĐT, Email, Địa chỉ gắn với Person. Đây là nguồn dữ liệu liên lạc cho tất cả các phân hệ (Sale gọi điện, CARE gửi SMS, ADM gửi email xác nhận).

**Là một** Sale / CSM,
**tôi muốn** thêm, sửa, xóa các thông tin liên lạc (SĐT, Email, Địa chỉ) cho một Person và đánh dấu kênh liên lạc chính,
**để** liên hệ đúng số, đúng cách và đảm bảo các phân hệ khác lấy đúng thông tin.

---

## 1. Business Value

- Sale cần SĐT chính xác để gọi tư vấn — sai số = mất khách.
- CARE cần Primary SĐT để gửi SMS điểm danh — sai số = phụ huynh không nhận được.
- Hệ thống lưu lịch sử thay đổi Contact → truy vết khi có tranh chấp.
- Tách Contact riêng (1-N) cho phép 1 người có nhiều SĐT/Email mà không tạo Person trùng.

---

## 2. Scope

| Hạng mục | Mô tả |
|---|---|
| CRUD Contact | Thêm/Sửa/Xóa từng Contact record (SĐT, Email, Địa chỉ). |
| Contact Types | 3 loại: `phone`, `email`, `address`. |
| Labels | Mỗi Contact có nhãn: Cá nhân / Công việc / Nhà / Khác. |
| Primary Marking | Đánh dấu 1 Primary cho mỗi loại (1 Primary SĐT, 1 Primary Email). |
| Click-to-action | SĐT → [Gọi], Email → [Gửi mail]. |
| Cross-person Duplicate Alert | Cảnh báo nếu SĐT/Email đã thuộc Person khác. |

### 2.1. Thành phần giao diện

| Thành phần | Loại | Mô tả | Ghi chú |
|---|---|---|---|
| Tab "Liên lạc" | Tab Panel | Nằm trong trang chi tiết Person. | Tự động mở sau khi tạo Person mới. |
| Bảng Contact | Data Table | Cột: Loại (icon), Giá trị, Nhãn, Primary (⭐), Actions. | Sorted by: Type, then Primary first. |
| Nút [+ Thêm liên lạc] | Primary Button | Mở form thêm Contact mới. | Chỉ hiện nếu có quyền `persons:update`. |
| Form thêm Contact | Inline Form / Modal | Loại (dropdown), Giá trị (input), Nhãn (dropdown). | Validation theo loại. |
| Icon Primary ⭐ | Toggle Star | Click để chọn/bỏ Primary. | Chỉ 1 Primary per type. |
| Nút [Gọi] | Icon Button (Phone) | Click-to-call trên SĐT. | `tel:` protocol. |
| Nút [Gửi mail] | Icon Button (Mail) | Click-to-email. | `mailto:` protocol. |
| Alert Cross-person | Inline Alert (Warning) | "SĐT 0912345678 cũng thuộc về Nguyễn Văn B — có thể trùng lặp!" | Hiện khi nhập SĐT/Email đã tồn tại ở Person khác. |
| Confirm xóa | Dialog | "Bạn có chắc muốn xóa SĐT 0912345678?" | Không cho xóa Contact cuối cùng. |

---

## 3. Out of Scope

- Không chỉnh sửa thông tin Identity (Tên, DOB) — thuộc `US-MDM-01-02`.
- Không quản lý quan hệ Guardian — thuộc `US-MDM-02-03`.
- Không gửi SMS/Email thực tế — chỉ cung cấp dữ liệu cho phân hệ CARE/COM.

---

## 4. Preconditions

- Person đã tồn tại trong hệ thống (`US-MDM-01-02` đã hoàn thành).
- User đang đăng nhập với Role có quyền `persons:update`.

---

## 5. Business Definitions

| Thuật ngữ | Định nghĩa |
|---|---|
| Contact Record | Một bản ghi liên lạc gắn với Person. Gồm: type, value, label, is_primary. |
| Primary Contact | Contact được đánh dấu là kênh liên lạc chính cho loại đó. VD: Primary SĐT = SĐT mà CARE gửi SMS. |
| Cross-person Duplicate | SĐT/Email đã tồn tại ở Person khác — có thể là dấu hiệu 2 Person thực chất là 1 người. |
| Label | Phân loại mục đích sử dụng: Cá nhân, Công việc, Nhà, Khác. |

---

## 6. Main Flow — Thêm Contact

1. User mở trang chi tiết Person → Tab "Liên lạc".
2. Danh sách Contact hiện tại hiển thị trong bảng.
3. User bấm [+ Thêm liên lạc].
4. Form inline mở ra: Loại (SĐT/Email/Địa chỉ), Giá trị, Nhãn.
5. User nhập giá trị. Validation realtime theo loại (SĐT: 10 số, Email: format).
6. **Cross-person Duplicate Check:** Hệ thống quét giá trị mới xem đã thuộc Person nào khác chưa.
7. Nếu trùng → Alert warning. User quyết định: tiếp tục thêm (cho phép) hoặc hủy.
8. User bấm [Lưu].
9. Contact record được tạo. Nếu là Contact đầu tiên của loại đó → tự động đánh dấu Primary.

## 6b. Main Flow — Đánh dấu Primary

1. User bấm ⭐ trên Contact muốn đặt làm Primary.
2. Hệ thống bỏ Primary của Contact cùng loại cũ, đánh Primary cho Contact mới.
3. Cập nhật realtime, không cần reload.

## 6c. Main Flow — Xóa Contact

1. User bấm [Xóa] trên Contact.
2. Hệ thống kiểm tra: đây có phải Contact cuối cùng không?
3. Nếu là cuối cùng → Block xóa. Alert: "Person phải có ít nhất 1 SĐT hoặc Email."
4. Nếu không → Dialog xác nhận → Xóa.
5. Nếu Contact bị xóa là Primary → Contact còn lại cùng loại tự động trở thành Primary.

---

## 7. Corner Cases

| # | Tình huống | Cách xử lý |
|---|---|---|
| C-01 | SĐT nhập sai format (không đủ 10 số) | Validation realtime, hiển thị lỗi dưới field. |
| C-02 | Email sai format | Validation realtime. |
| C-03 | SĐT/Email đã thuộc Person khác | Alert warning, cho phép user tiếp tục (có thể bố/mẹ dùng chung SĐT). |
| C-04 | Xóa Contact cuối cùng | Block xóa, hiển thị lỗi. |
| C-05 | Xóa Contact đang là Primary | Contact cùng loại còn lại tự động lên Primary. |
| C-06 | Person chỉ có 1 SĐT duy nhất → tự động là Primary | Đúng, không cần click ⭐. |
| C-07 | Thêm SĐT thứ 2 → không tự động Primary | Đúng, Primary vẫn là SĐT đầu tiên. User muốn đổi phải click ⭐. |

---

## 8. Acceptance Criteria

- [ ] **AC-01** Tab "Liên lạc" hiển thị danh sách Contact của Person.
- [ ] **AC-02** Thêm Contact mới với 3 loại: SĐT, Email, Địa chỉ.
- [ ] **AC-03** Validation SĐT (10 số), Email (format) hoạt động realtime.
- [ ] **AC-04** Cross-person Duplicate Check hiện alert nếu SĐT/Email đã thuộc Person khác.
- [ ] **AC-05** Đánh dấu Primary bằng click ⭐, chỉ 1 Primary per type.
- [ ] **AC-06** Contact đầu tiên của mỗi loại tự động là Primary.
- [ ] **AC-07** Không cho xóa Contact cuối cùng.
- [ ] **AC-08** Xóa Primary → Contact cùng loại còn lại tự lên Primary.
- [ ] **AC-09** Click-to-call (tel:) và Click-to-email (mailto:) hoạt động.
- [ ] **AC-10** Ghi Audit Log cho mọi thay đổi Contact.
- [ ] **AC-11** Nhãn (Cá nhân/Công việc/Nhà/Khác) lưu đúng và hiển thị đúng.

---

## 9. Dependencies

- `BF-MDM-01`: Dịch vụ CRUD Contact, Kiểm tra trùng lặp Contact.
- `US-MDM-01-02`: Trang chi tiết Person (chứa tab này).
- Dữ liệu mẫu Contact.
- `CAP-CARE` / `CAP-COM`: Hệ thống tiêu thụ dữ liệu — đọc SĐT/Email chính.
