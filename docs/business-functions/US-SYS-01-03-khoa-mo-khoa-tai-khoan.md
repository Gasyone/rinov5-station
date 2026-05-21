---
id: US-SYS-01-03
title: "Khóa / Mở khóa / Vô hiệu hóa tài khoản"
bf: BF-SYS-01
domain: CAP-SYS
status: standardized
tags: [sys, ilm, user-account, lock, deactivate, action]
---

# US-SYS-01-03: Khóa / Mở khóa / Vô hiệu hóa tài khoản

> **Tham chiếu:** BF-SYS-01 · Design System §4.4 Form Pattern

## 1. User Story
**Là một** System Admin, **tôi muốn** thay đổi trạng thái tài khoản (Khóa tạm / Mở khóa / Vô hiệu hóa vĩnh viễn), **để** kiểm soát quyền truy cập hệ thống theo vòng đời nhân sự.

---

## 2. Đề xuất Kiến trúc Kỹ thuật (Dev/AI Architecture)

- **UI Component:** `AlertDialog` (Shadcn) kết hợp với 1 trường `Textarea` nhỏ để nhập lý do.
- **Data Binding:** Data Submit gửi: `{ accountId: string, newStatus: 'locked' | 'active' | 'deactivated', reason: string }`.
- **Đề xuất tách file:** `ChangeAccountStatusDialog.tsx`.

---

## 3. Cấu trúc Giao diện (Form Layout)

**Bố cục:** Dialog cảnh báo nhỏ (Alert Dialog).

### 3.1. Các trường nhập liệu (Inputs)

| Tên trường | UI Component | Bắt buộc | Data Binding | Ghi chú & Logic Validation |
|------------|--------------|----------|--------------|----------------------------|
| Lý do | `Textarea` | Có | `reason` | Bắt buộc nhập lý do thay đổi trạng thái để ghi log. Max 250 ký tự. |

### 3.2. Footer (Nút hành động)
| Nút | Loại | Action Logic |
|-----|------|--------------|
| Hủy bỏ | `Button(variant="outline")` | Đóng Dialog. |
| Xác nhận | `Button(variant="destructive")` | Gọi hàm Mock update status. Ghi Audit Log. Đóng Dialog. |

---

## 4. Quy tắc Nghiệp vụ & Validation (Business Rules)

1. **[RULE-ACT-01] Deactivated Limit:** `IF` Trạng thái hiện tại = 'deactivated' `THEN` không hiển thị Action Mở khóa (Vô hiệu hóa là vĩnh viễn).
2. **[RULE-ACT-02] Force Logout:** `IF` Trạng thái mới là 'locked' hoặc 'deactivated' `THEN` Xóa tất cả các active session của tài khoản đó ngay lập tức.
3. **[RULE-ACT-03] Audit Trail:** Bắt buộc lưu lịch sử hành động (Reason) vào bảng `AccountHistory`.

---

## 5. Tiêu chí chấp nhận (Acceptance Criteria)
- [ ] Giao diện AlertDialog cảnh báo hiển thị đúng text tương ứng với hành động (Lock/Unlock/Deactivate).
- [ ] Phải nhập `reason` mới sáng nút Xác nhận.
- [ ] Xử lý state transition thành công và cập nhật lại badge màu trên danh sách.
