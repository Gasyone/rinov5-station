---
id: US-MDM-01-02
title: Tạo mới & Cập nhật Person Identity
bf: BF-MDM-01
domain: CAP-MDM
status: core
tags: [mdm, person, identity, create, edit, duplicate-detection]
---

# US-MDM-01-02: Tạo mới & Cập nhật Person Identity (Create/Edit Person)

> **Tuân thủ Tiêu chuẩn:**
> - `[POLICY-MDM-01]` Golden Record — Kiểm tra trùng lặp trước khi tạo mới.
> - `[POLICY-MDM-02]` Identity vs Contact Split — Form này CHỈ chứa thông tin Identity (PII). Contact quản lý riêng tại `US-MDM-01-03`.

> **Phạm vi:** Form tạo mới / chỉnh sửa Person Identity. Vị trí: Dialog hoặc page từ danh sách Person (`US-MDM-01-01`), hoặc được gọi từ các flow khác (Sale tạo Lead, HR onboard).

**Là một** Sale / CSM,
**tôi muốn** tạo mới hoặc cập nhật thông tin định danh cá nhân (Tên, Ngày sinh, CCCD),
**để** đảm bảo Golden Record chính xác và không bị trùng lặp.

---

## 1. Business Value

- Sale tạo Person khi tiếp nhận khách hàng mới (Lead → Person).
- HR Admin tạo Person khi onboard nhân sự mới.
- Duplicate Detection realtime giảm rủi ro tạo trùng, bảo vệ Golden Record.
- Form chỉ chứa Identity (PII) — tách biệt rõ ràng với Contact, tuân thủ chuẩn MDM.

---

## 2. Scope

| Hạng mục | Mô tả |
|---|---|
| Tạo mới Person | Nhập Họ tên (bắt buộc), Ngày sinh, Giới tính, CCCD, Avatar. |
| Chỉnh sửa Person | Cập nhật các trường Identity của Person đã có. |
| Duplicate Detection | Realtime quét trùng khi nhập Tên + SĐT hoặc CCCD. |
| Duplicate Resolution | Nếu trùng → Dialog cho phép chọn Person có sẵn hoặc tiếp tục tạo mới. |

### 2.1. Thành phần giao diện

| Thành phần | Loại | Mô tả | Ghi chú |
|---|---|---|---|
| Họ và Tên | Text Input | Bắt buộc. | Validation: Không rỗng, tối thiểu 2 ký tự. |
| Ngày sinh | Date Picker | Tùy chọn. | Validation: Không cho ngày trong tương lai. |
| Giới tính | Select Dropdown | Nam / Nữ / Khác. | Mặc định: không chọn. |
| CCCD/CMND | Text Input | Tùy chọn. | Unique check realtime. Format: 12 số. |
| Avatar | Upload / Webcam | PNG/JPG, tối đa 5MB. | Crop circle preview. |
| Panel Duplicate | Inline Alert (Warning) | Hiện khi phát hiện Person nghi trùng. | Hiển thị danh sách ứng viên trùng. |
| Dialog Duplicate | Modal Dialog | So sánh Person mới vs Person có sẵn. | Actions: [Dùng bản có sẵn] / [Tiếp tục tạo mới]. |
| Nút Lưu | Primary Button | Tạo mới hoặc cập nhật Person. | Disabled nếu thiếu Họ tên. |

---

## 3. Out of Scope

- Không nhập SĐT, Email, Địa chỉ trên form này — thuộc `US-MDM-01-03` (Contact Management).
- Không gán Household — thuộc `US-MDM-02-02`.
- Không tạo User Account — thuộc `US-SYS-01-02`.
- Không Merge Person — thuộc `US-MDM-01-04`.

---

## 4. Preconditions

- User đang đăng nhập với Role có quyền `persons:create` (tạo mới) hoặc `persons:update` (chỉnh sửa).
- Duplicate Detection API có thể nhận input (Tên + SĐT hoặc CCCD) và trả về danh sách nghi trùng.

---

## 5. Business Definitions

| Thuật ngữ | Định nghĩa |
|---|---|
| Identity | Thông tin PII tĩnh/ít thay đổi: Tên, DOB, CCCD, Giới tính, Avatar. Tách biệt khỏi Contact. |
| Duplicate Detection | Quá trình quét tự động tìm Person có khả năng trùng lặp dựa trên các trường match (Tên tương đồng, CCCD giống, SĐT trùng). |
| Duplicate Resolution | Quy trình để user quyết định: sử dụng Person có sẵn hay tạo bản mới (accept duplicate). |

---

## 6. Main Flow — Tạo mới

1. User bấm [+ Tạo Person] từ danh sách Person.
2. Form mở ra với tất cả field rỗng.
3. User nhập Họ tên (bắt buộc).
4. User nhập thêm DOB, Giới tính, CCCD (tùy chọn).
5. **Duplicate Detection trigger:** Khi user rời khỏi field Họ tên hoặc CCCD (onBlur), hệ thống gửi query tìm Person tương đồng.
6. Nếu **không trùng** → panel trống, user tiếp tục.
7. Nếu **có nghi trùng** → Panel warning hiển thị danh sách ứng viên (Tên, DOB, SĐT, %, lý do nghi trùng).
8. User bấm vào ứng viên → Dialog so sánh side-by-side.
9. User chọn [Dùng bản có sẵn] → redirect về chi tiết Person đó. HOẶC [Tiếp tục tạo mới] → đóng dialog, cho phép submit.
10. User upload Avatar (tùy chọn).
11. User bấm [Lưu].
12. Hệ thống tạo Person record, trả về `person_id`.
13. Redirect sang trang chi tiết Person → gợi ý "Thêm thông tin liên lạc" (`US-MDM-01-03`).

## 6b. Main Flow — Chỉnh sửa

1. User bấm [Sửa] trên trang chi tiết Person hoặc row trong danh sách.
2. Form mở ra với dữ liệu hiện tại.
3. User thay đổi các trường cần thiết.
4. Duplicate Detection vẫn chạy khi đổi Tên hoặc CCCD.
5. User bấm [Lưu].
6. Hệ thống cập nhật Person record + ghi Audit Log.

---

## 7. Corner Cases

| # | Tình huống | Cách xử lý |
|---|---|---|
| C-01 | CCCD trùng chính xác với Person khác | Hiển thị lỗi "CCCD đã tồn tại — thuộc về [Tên Person]". Block submit. |
| C-02 | Tên tương đồng nhưng không chắc chắn trùng | Hiển thị warning panel. Cho phép user quyết định. |
| C-03 | User chọn "Dùng bản có sẵn" | Đóng form tạo mới, redirect về Person có sẵn. |
| C-04 | User chọn "Tiếp tục tạo mới" dù có nghi trùng | Cho phép tạo (người dùng chịu trách nhiệm). Ghi flag `accepted_duplicate = true`. |
| C-05 | Avatar upload lớn hơn 5MB | Hiển thị lỗi, không cho upload. |
| C-06 | Ngày sinh > hôm nay | Hiển thị lỗi "Ngày sinh không hợp lệ". |
| C-07 | Họ tên chỉ có 1 ký tự | Hiển thị lỗi "Tên phải có ít nhất 2 ký tự". |
| C-08 | Person đang ở trạng thái Merged (chỉnh sửa) | Block edit. Hiển thị "Person đã bị gộp. Không thể chỉnh sửa." |

---

## 8. Acceptance Criteria

- [ ] **AC-01** Họ tên là field bắt buộc, form không submit nếu rỗng.
- [ ] **AC-02** CCCD nếu nhập phải unique — realtime check.
- [ ] **AC-03** Duplicate Detection chạy khi onBlur Họ tên hoặc CCCD.
- [ ] **AC-04** Nếu phát hiện nghi trùng → hiện panel warning với danh sách ứng viên.
- [ ] **AC-05** Dialog so sánh side-by-side hoạt động khi bấm vào ứng viên.
- [ ] **AC-06** User có thể chọn "Dùng bản có sẵn" hoặc "Tiếp tục tạo mới".
- [ ] **AC-07** Avatar hỗ trợ upload PNG/JPG ≤ 5MB, crop circle preview.
- [ ] **AC-08** Sau tạo mới → redirect sang chi tiết Person + gợi ý thêm Contact.
- [ ] **AC-09** Ghi Audit Log khi tạo mới hoặc chỉnh sửa.
- [ ] **AC-10** Person Merged không cho chỉnh sửa.

---

## 9. Dependencies

- `BF-MDM-01`: Dịch vụ CRUD Person + Phát hiện trùng lặp.
- `US-MDM-01-01`: Danh sách Person (điểm vào biểu mẫu này).
- `US-MDM-01-03`: Quản lý Liên lạc (bước tiếp theo sau tạo Person).
- Dữ liệu mẫu Person.
