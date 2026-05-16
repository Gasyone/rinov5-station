# Capability: SIS & Class Operations (Năng lực SIS & Vận hành Lớp học)

**ID:** `CAP-OPS`  
**Domain:** SIS & Operations (Quản lý Học viên & Vận hành)  
**Class:** Core Operational & Supporting

---

## 1. Mục tiêu & Phạm vi (Goal & Scope)
Năng lực lõi quyết định việc "sản xuất" dịch vụ giáo dục của trung tâm. Giải quyết các bài toán từ việc mở Lớp học (Class), xếp thời khóa biểu (Schedule), sinh ra các sự kiện thực tế (Session), điểm danh đánh giá, cho đến khi Lớp học kết thúc.

**Phạm vi:** Quản lý toàn bộ vòng đời của Lớp học vật lý và ảo, điều phối tài nguyên (Giáo viên, Phòng học) và quản lý sĩ số học viên.

## 2. Kiến trúc Thực thể Cốt lõi (Key Entities Architecture)
Hệ thống áp dụng mô hình phân tách rõ ràng giữa cấu trúc tĩnh (Class) và sự kiện động (Session) để đảm bảo tính linh hoạt trong vận hành:

1. **Lớp học (Class):**
   - Là "vỏ hộp" tĩnh, mang tính dài hạn (VD: Khóa học 6 tháng).
   - Chứa thông tin cấu trúc cơ bản: Khung chương trình (Syllabus), Giáo viên chủ nhiệm chính (Primary Teacher), và Danh sách học sinh (Roster/Sĩ số).
   - Mọi học viên đăng ký sẽ được xếp (Enroll) vào Class.

2. **Khung lịch (Schedule / Golden Schedule):**
   - Bộ quy tắc thời gian lặp lại của Class (VD: Tối Thứ 3 & Thứ 5, 18:00 - 19:30 tại Phòng 101).

3. **Buổi học (Session):**
   - Là các sự kiện vật lý thực tế diễn ra vào một ngày giờ cụ thể (VD: Buổi số 1 tối ngày 15/05/2026).
   - Được sinh ra từ sự kết hợp giữa **Class** và **Schedule**.
   - Mỗi Session được ánh xạ với 1 Chủ đề/Bài học (Topic) từ Syllabus.
   - **Mọi biến động thực tế đều diễn ra trên Session:** Dạy thay (Substitute), Đổi phòng, Nghỉ lễ, Học bù (Makeup class), Điểm danh.

4. **Hồ sơ Điểm danh (Attendance Record):**
   - Dữ liệu ghi nhận tình trạng có mặt, đi muộn, về sớm của học viên.
   - **Nguyên tắc cốt lõi:** Điểm danh luôn luôn phải gắn với **Session** (Điểm danh theo buổi), KHÔNG gắn với Class.

## 3. Nguyên tắc Vận hành (Core Principles)
1. **Bất biến của Class:** Không thay đổi thông tin Class khi có sự kiện đột xuất. Nếu hôm nay GV chủ nhiệm ốm, chỉ thay đổi thông tin Giáo viên trên đúng **Session** của ngày hôm đó (Dạy thay).
2. **Nguyên tắc Chống trùng (No-Conflict):** Hệ thống chặn lưu Khung lịch (Schedule) hoặc Session nếu phát hiện Giáo viên, Phòng học, hoặc Học viên đang bị kẹt ở một Session khác cùng thời điểm.
3. **Session Lifecycle:** Một buổi học có các trạng thái rõ ràng: Lên lịch (Scheduled) -> Đang diễn ra (In Progress) -> Đã hoàn thành/Chốt sổ (Completed).

## 4. Giao tiếp liên miền (Cross-Capability Interactions)
*   👉 **Nhận từ `CAP-HR`:** Lấy quỹ thời gian làm việc (Availability) của Giáo viên.
*   👉 **Nhận từ `CAP-ACD`:** Lấy Khung chương trình (Syllabus) để tạo lộ trình các Session.
*   👉 **Cấp cho `CAP-CARE`:** Cung cấp thông tin điểm danh/vắng mặt để CSM gọi điện chăm sóc.
*   👉 **Cấp cho `CAP-FIN`:** Cung cấp số lượng Session đã học để tính lương giáo viên và tính phí khấu trừ của học viên.

## 5. Danh sách Business Functions (BF)

### Khối Vận hành (OPS) - Tập trung vào Lịch và Buổi học
| Mã BF | Tên Business Function (Luồng E2E) | Trạng thái |
|-------|-----------------------------------|------------|
| `BF-OPS-02` | Xếp lịch & Chống trùng (Class Scheduling & Conflict Resolution) | ✅ Đã chuẩn hóa |
| `BF-OPS-03` | Vòng đời buổi học (Session Delivery Lifecycle & Substitute) | ✅ Đã chuẩn hóa |

> ℹ️ `BF-OPS-01` (Đăng ký quỹ thời gian) đã được chuyển sang `CAP-HR` → [`BF-HR-02`](./BF-HR-02-quan-ly-quy-thoi-gian.md).

### Khối Lớp học (CLS) - Tập trung vào Học viên và Điểm danh
| Mã BF | Tên Business Function (Luồng E2E) | Trạng thái |
|-------|-----------------------------------|------------|
| `BF-CLS-01` | Xếp lớp (Enrollment to Class) | ✅ Đã chuẩn hóa |
| `BF-CLS-02` | Quản lý Lớp học (Class Lifecycle & Syllabus Attachment) | ✅ Đã chuẩn hóa |
| `BF-CLS-03` | Quản lý Học viên (Class Roster Management) | ✅ Đã chuẩn hóa |
| `BF-CLS-04` | Quản lý Giáo viên chủ nhiệm (Primary Teacher Management) | ✅ Đã chuẩn hóa |
| `BF-CLS-05` | Điểm danh & Nhận xét (Session Attendance & Grading) | ✅ Đã chuẩn hóa |
| `BF-CLS-06` | Báo nghỉ, Bảo lưu & Chuyển lớp (Absence & Transfer) | ✅ Đã chuẩn hóa |
