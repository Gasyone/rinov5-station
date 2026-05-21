---
title: "Năng lực Quản lý Học viên & Vận hành Lớp"
type: "Capability"
domain: "CAP-OPS"
status: "Active"
id: "CAP-OPS"
parent_br: "BR-002"
---

# Capability: Năng lực Quản lý Học viên & Vận hành Lớp

**ID:** `CAP-OPS`  
**Domain:** Quản lý Học viên & Vận hành Lớp  
**Phân loại:** Năng lực Cốt lõi

---

## 1. Mục tiêu & Phạm vi

Năng lực lõi quyết định việc "sản xuất" dịch vụ giáo dục của trung tâm. Giải quyết các bài toán từ việc mở Lớp học, xếp thời khóa biểu, sinh ra các buổi học thực tế, điểm danh đánh giá, cho đến khi Lớp học kết thúc.

**Phạm vi:** Quản lý toàn bộ vòng đời của Lớp học, điều phối tài nguyên (Giáo viên, Phòng học) và quản lý sĩ số học viên.

## 2. Thực thể Dữ liệu cốt lõi

1. **Lớp học:**
   - Là "vỏ hộp" tĩnh, mang tính dài hạn (VD: Khóa học 6 tháng).
   - Chứa: Khung chương trình, Giáo viên chủ nhiệm, Danh sách học viên.
   - Mọi học viên đăng ký sẽ được xếp vào Lớp.

2. **Khung lịch:**
   - Bộ quy tắc thời gian lặp lại của Lớp (VD: Tối Thứ 3 & Thứ 5, 18:00 - 19:30 tại Phòng 101).

3. **Buổi học:**
   - Sự kiện thực tế diễn ra vào ngày giờ cụ thể, sinh ra từ Lớp + Khung lịch.
   - Mỗi Buổi học ánh xạ với 1 Chủ đề/Bài học từ Khung chương trình.
   - **Mọi biến động thực tế đều diễn ra trên Buổi học:** Dạy thay, Đổi phòng, Nghỉ lễ, Học bù, Điểm danh.

4. **Hồ sơ Điểm danh:**
   - Ghi nhận tình trạng có mặt, đi muộn, về sớm.
   - **Nguyên tắc:** Điểm danh luôn gắn với **Buổi học**, KHÔNG gắn với Lớp.

## 3. Tuân thủ Tiêu chuẩn (Policy Compliance)

Khối năng lực này chịu sự ràng buộc của các điều luật cốt lõi trong `ENTERPRISE_STANDARDS.md`:
1. **Tuân thủ `[POLICY-ORG-01]`:** Lớp học gắn chi nhánh, phân quyền theo chi nhánh.

**Nguyên tắc riêng của Vận hành:**
1. **Bất biến của Lớp:** Không thay đổi thông tin Lớp khi có sự kiện đột xuất. Nếu Giáo viên ốm, chỉ thay đổi trên đúng **Buổi học** ngày đó (Dạy thay).
2. **Chống trùng:** Hệ thống chặn lưu Khung lịch hoặc Buổi học nếu phát hiện Giáo viên, Phòng học, hoặc Học viên đang bị trùng lịch.
3. **Vòng đời Buổi học:** Lên lịch → Đang diễn ra → Đã hoàn thành.

## 4. Kiến trúc & Nguyên tắc cốt lõi

Khối Vận hành thiết kế theo nguyên tắc **Tách biệt Tĩnh — Động**:
- **Tĩnh (Lớp):** Cấu trúc dài hạn, ít thay đổi.
- **Động (Buổi học):** Sự kiện thực tế, chịu mọi biến động.
- **Khung lịch:** Cầu nối giữa Tĩnh và Động, sinh Buổi học tự động từ quy tắc lặp lại.

## 5. Giao tiếp Liên miền (Cross-Capability Interactions)

*   👉 **Cung cấp dữ liệu cho:**
    - `CAP-CARE`: Thông tin điểm danh/vắng mặt để nhân viên chăm sóc gọi điện.
    - `CAP-FIN`: Số lượng Buổi học đã học để tính lương và khấu trừ.
    - `CAP-ACD`: Phản hồi tiến độ thực tế.
*   👈 **Nhận dữ liệu từ:**
    - `CAP-HR`: Quỹ thời gian làm việc của Giáo viên.
    - `CAP-ACD`: Khung chương trình để tạo lộ trình Buổi học.

> ℹ️ `BF-OPS-01` (Đăng ký quỹ thời gian) đã được chuyển sang `CAP-HR` → `BF-HR-02`.

## 6. Phân ranh giới Sở hữu Dữ liệu

| Dữ liệu | Khối này sở hữu | Thuộc khối khác |
|----------|-----------------|-----------------|
| Lớp học | ✅ | |
| Khung lịch | ✅ | |
| Buổi học | ✅ | |
| Hồ sơ Điểm danh | ✅ | |
| Bài tập về nhà | ✅ | |
| Khung chương trình gốc | | → `CAP-ACD` |
| Quỹ thời gian Giáo viên | | → `CAP-HR` |
| Phòng học | | → `CAP-FCM` |
| Hồ sơ Học viên | | → `CAP-MDM` |

## 7. Danh sách Phân hệ Nghiệp vụ (Business Functions)

### Khối Vận hành — Tập trung vào Lịch và Buổi học

| Mã BF | Tên Phân hệ Nghiệp vụ | Trạng thái |
|-------|------------------------|------------|
| `BF-OPS-02` | Xếp lịch & Chống trùng | ✅ Đã chuẩn hóa |
| `BF-OPS-03` | Vòng đời Buổi học & Dạy thay | ✅ Đã chuẩn hóa |

### Khối Lớp học — Tập trung vào Học viên và Điểm danh

| Mã BF | Tên Phân hệ Nghiệp vụ | Trạng thái |
|-------|------------------------|------------|
| `BF-CLS-01` | Xếp lớp | ✅ Đã chuẩn hóa |
| `BF-CLS-02` | Quản lý Lớp học | ✅ Đã chuẩn hóa |
| `BF-CLS-03` | Quản lý Học viên | ✅ Đã chuẩn hóa |
| `BF-CLS-04` | Quản lý Giáo viên chủ nhiệm | ✅ Đã chuẩn hóa |
| `BF-CLS-05` | Điểm danh & Nhận xét | ✅ Đã chuẩn hóa |
| `BF-CLS-06` | Nghỉ học, Bảo lưu & Chuyển lớp | ✅ Đã chuẩn hóa |
