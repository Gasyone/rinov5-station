---
id: US-SYS-02-01
title: "Thiết lập Cấu hình chung & Branding"
bf: BF-SYS-02
domain: CAP-SYS
status: standardized
tags: [sys, configuration, general, branding, form]
---

# US-SYS-02-01: Thiết lập Cấu hình chung & Branding (General Settings)

> **Tham chiếu:** BF-SYS-02 · Design System §4.4 Form Pattern

## 1. User Story
**Là một** System Admin, **tôi muốn** cập nhật thông tin nhận diện thương hiệu và khu vực hóa của hệ thống, **để** giao diện ứng dụng đồng nhất với thương hiệu của tổ chức và phù hợp với múi giờ hoạt động thực tế.

---

## 2. Đề xuất Kiến trúc Kỹ thuật (Dev/AI Architecture)

- **UI Component:** `Card` layout chứa Form, nằm trong trang có tab-navigation ngang (`/app/system_config/general`).
- **Form Library:** `react-hook-form` + `zod`.
- **Data Binding:** Gửi mảng các Key-Value `{ key: 'BRAND_LOGO', value: '...' }` lên hàm mock update.
- **State Management:** Sau khi lưu thành công, cập nhật giá trị vào `useUIStore` để các components khác re-render (VD: đổi theme, đổi logo trên Header).

---

## 3. Cấu trúc Giao diện (Form Layout)

**Bố cục:** Full Page Form chia thành các Card chức năng.

### 3.1. Nhóm Khu vực hóa (Localization)

| Tên trường | UI Component | Bắt buộc | Data Binding (Mock/State) | Ghi chú & Logic Validation |
|------------|--------------|----------|---------------------------|----------------------------|
| Ngôn ngữ gốc | `Select` | Có | `DEFAULT_LANGUAGE` | Options: Tiếng Việt, English, 中文. |
| Timezone | `Select` | Có | `SYSTEM_TIMEZONE` | Khung giờ gốc của Server (Thường mặc định `Asia/Ho_Chi_Minh`). |

### 3.2. Nhóm Nhận diện thương hiệu (Branding)

| Tên trường | UI Component | Bắt buộc | Data Binding (Mock/State) | Ghi chú & Logic Validation |
|------------|--------------|----------|---------------------------|----------------------------|
| Tên tổ chức | `Input` | Có | `BRAND_NAME` | Hiển thị trên email thông báo hoặc tiêu đề tab. |
| Logo chính | `ImageUpload`| Không | `BRAND_LOGO_URL` | Hỗ trợ png/svg. Max 2MB. |
| Màu chủ đạo | `ColorPicker`| Không | `BRAND_PRIMARY_COLOR` | Mã HEX (VD: `#2563eb`). Set biến CSS `--primary` runtime. |

### 3.3. Footer (Nút hành động)
| Nút | Loại | Action Logic |
|-----|------|--------------|
| Lưu thay đổi | `Button` | Cập nhật các Key-Value vào CSDL, sync vào `useUIStore`, hiện toast "Lưu thành công". |

---

## 4. Quy tắc Nghiệp vụ & Validation (Business Rules)

1. **[RULE-GEN-01] Theme Injection:** `IF` màu chủ đạo (`BRAND_PRIMARY_COLOR`) thay đổi `THEN` inject giá trị HSL mới vào thẻ `<html>` thông qua DOM hoặc UI Store.
2. **[RULE-GEN-02] Cache Invalidation:** Logo URL thay đổi cần phải phá cache ảnh hiện tại trên client.

---

## 5. Tiêu chí chấp nhận (Acceptance Criteria)
- [ ] Màn hình form tải giá trị hiện hành từ `mockConfigs`.
- [ ] Form Validate: Không bỏ trống Tên tổ chức.
- [ ] Chọn màu sắc bằng picker, preview được màu.
- [ ] Upload Logo có validate file extension & size.
- [ ] Nhấn Lưu hiển thị Toast và thay đổi giao diện ngay lập tức nếu đổi Màu/Logo.
