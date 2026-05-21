---
id: US-ACD-07-01
title: "Thiết lập Tham số Lớp học"
bf: BF-ACD-07
domain: CAP-ACD
status: draft
tags: [acd, setup, session, capacity, form]
---

# US-ACD-07-01: Thiết lập Tham số Lớp học (Class Parameters)

> **Tham chiếu:** BF-ACD-07 · Giao diện Mẫu §4.4 (Biểu mẫu)

## 1. Yêu cầu Người dùng (User Story)
**Là một** Trưởng phòng Học thuật, **tôi muốn** cấu hình thời lượng tiêu chuẩn của một buổi học và sĩ số tối đa cho các loại lớp học, **để** hệ thống có căn cứ tự động kiểm tra sức chứa và thời gian khi xếp lịch học.

---

## 2. Kiến trúc Giao diện & Kỹ thuật

- **Thành phần Giao diện chính:** Trang điền thông tin chia thành các nhóm (Thẻ).
- **Quản lý dữ liệu:** Liên kết trực tiếp các trường nhập liệu với dữ liệu cấu hình học thuật.

---

## 3. Cấu trúc Các trường nhập liệu

**Bố cục:** Toàn trang.

### 3.1. Thông tin đầu vào

| Tên trường | Loại hiển thị | Bắt buộc | Trường dữ liệu | Ghi chú & Quy tắc kiểm tra |
|------------|---------------|----------|----------------|----------------------------|
| Thời lượng buổi học | Ô nhập số | Có | `defaultSessionDuration` | Tính bằng phút. Giá trị mặc định: `90`. |
| Sĩ số tối đa mặc định | Ô nhập số | Có | `defaultMaxClassSize` | Số lượng học viên tối đa cho một lớp tiêu chuẩn. |
| Ngưỡng cảnh báo sĩ số | Ô nhập số | Không | `classSizeWarningThreshold` | VD: Nếu lớp đạt 90% sĩ số tối đa thì hiện cảnh báo vàng. |

### 3.2. Nút hành động (Footer)
| Nút | Loại hiển thị | Logic xử lý |
|-----|---------------|-------------|
| Lưu thay đổi | Nút màu nhấn | Kiểm tra tính hợp lệ, lưu vào hệ thống, hiển thị thông báo góc màn hình. |

---

## 4. Quy tắc Nghiệp vụ cốt lõi

1. **[RULE-ACD-01] Áp dụng tương lai:** `NẾU` thời lượng buổi học thay đổi `THÌ` chỉ áp dụng cho các lớp học được tạo sau thời điểm đổi. Không tự động cập nhật lại thời lượng của các buổi học đã được xếp lịch trước đó.
2. **[RULE-ACD-02] Giới hạn thời lượng:** Thời lượng buổi học tối thiểu phải là `30` phút và tối đa là `240` phút (4 tiếng).

---

## 5. Tiêu chí Nghiệm thu
- [ ] Giao diện tải và hiển thị đúng các thông số hiện tại.
- [ ] Quy tắc chặn nhập số âm hoặc ngoài giới hạn hoạt động đúng.
- [ ] Khi xếp lịch, lớp học mới sẽ lấy thời lượng này làm mặc định.
