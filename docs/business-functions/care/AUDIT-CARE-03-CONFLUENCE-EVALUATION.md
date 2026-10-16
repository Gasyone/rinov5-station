# BÁO CÁO ĐÁNH GIÁ TÀI LIỆU CHUẨN CARE-04 TRÊN CONFLUENCE (LẦN 2)
*(Thư mục: Care - Báo cáo tháng học viên | Folder ID: 158105703)*

- **URL Confluence:** [Care- Báo cáo tháng học viên (Folder 158105703)](https://rinoeduai.atlassian.net/wiki/spaces/PS/folder/158105703)
- **Thời điểm kiểm tra:** 12/10/2026 (Phiên bản cập nhật sau khi đổi mã sang CARE-04 và bỏ yêu cầu Phi chức năng)
- **Phân loại rủi ro:** 🔴 **Risk** (Tích hợp dữ liệu giữa Quản lý lớp, Khung chương trình, Điểm danh và Chăm sóc)

---

## 🌟 I. CÁC ĐIỂM ĐÃ ĐƯỢC CẬP NHẬT & KHẮC PHỤC RẤT TỐT (RESOLVED)

1. ✅ **Đã đổi mã định danh sang `CARE-04` thành công:**
   - Cả 4 tài liệu đã đổi mã sang `BF-CARE-04`, `US-CARE-04-01`, `US-CARE-04-02`, `US-CARE-04-03`.
   - **Xung đột mã số:** Xung đột với `BF-CARE-03: Care Rule Engine` cũ đã được xử lý triệt để.
2. ✅ **Đã thống nhất nhãn nút Khung chương trình:**
   - Trong `US-CARE-04-02`, nút nạp bài đã được đồng bộ thống nhất thành nhãn `[📖 Thêm bài]` (ở cả User Flow, Bảng 4 và AC-05).
3. ✅ **Đã gỡ bỏ tính năng chưa làm:**
   - Đã xóa bỏ dòng `Nút Sao chép (Tính năng chưa phát triển)` tại Bảng 7 của `US-CARE-04-02`, đảm bảo nguyên tắc Zero Open Questions.
4. ✅ **Đã sửa lỗi chính tả và tiêu đề bảng ở US-CARE-04-03:**
   - Đã sửa lỗi chính tả: `goish học` $\rightarrow$ `gói học`, `Bộ gối học` $\rightarrow$ `Bộ gói học`.
   - Đổi tên điều khiển Bảng 3.1: `Bộ chọn Khóa học / Môn học` $\rightarrow$ `Bộ chọn Gói học` (đồng bộ với BF).
   - Sửa tiêu đề Bảng 3.2: `Bảng mô tả Cụm Header` $\rightarrow$ `Bảng mô tả Khung thẻ Hồ sơ chính`.
   - Bổ sung bảng Lịch sử cập nhật (Changelog) ở đầu trang.
5. ✅ **Đã lược bỏ Mục Phi chức năng** theo đúng định hướng tinh giản của dự án.

---

## ⚠️ II. CÁC LỖI VĂN BẢN & CÂU CỤT DỞ DANG CÒN SÓT LẠI

### 1. `US-CARE-04-01` (ID: 158302243)
- **REQ-01 (khuyết biểu thức điều kiện):**
  > Nguyên văn: `...khi Section Nhật ký học tập hiển thị và tổng số kỳ báo cáo thực tế . Nếu tổng số kỳ báo cáo =0, ẩn hoàn toàn khối`
  - *Vấn đề:* Đã thêm `=0` ở vế sau, nhưng vế trước vẫn bị mất biểu thức so sánh: `tổng số kỳ báo cáo thực tế .` (thiếu `> 0`). Cần sửa thành: `tổng số kỳ báo cáo thực tế > 0`.
- **AC-02 (dở dang sau dấu phẩy):**
  > Nguyên văn: `Hiển thị Nút Chỉnh sửa nếu có quyền sửa, `
  - *Vấn đề:* Đã thay "button" thành "Nút" nhưng câu vẫn bị ngắt đột ngột sau dấu phẩy `,`. Cần bổ sung vế sau: `...nếu không có quyền, chỉ hiển thị ở chế độ xem.`
- **AC-05 (thiếu dấu đóng ngoặc tiêu đề):**
  > Nguyên văn: `### AC-05 (Navigation Path - Mở trực tiếp trang đích trên thẻ trình duyệt mới`
  - *Vấn đề:* Đã thêm chữ "mới" nhưng thiếu dấu đóng ngoặc tròn `)`.
- **Bảng 3.2 (sót cụm từ AI):**
  > Nguyên văn: `...sử dụng tính năng AI Tổng hợp kế hoạch bài học và lưu thay đổi vào hệ thống Tính năng AI chưa áp dụng tại thời điểm hiện tại`
  - *Vấn đề:* Hệ thống thực tế nạp bài từ Khung chương trình (Syllabus) lớp ghép, hoàn toàn không dùng AI. Cần xóa cụm từ AI này.

---

### 2. `US-CARE-04-02` (ID: 158105707)
- **AC-03 (câu bị cắt cụt):**
  > Nguyên văn: `Giả sử: Hộp thoại đang mở ở Chế độ Xem và kỳ báo cáo .`
  - *Vấn đề:* Bị cụt sau chữ `kỳ báo cáo .`. Cần bổ sung: `...và kỳ báo cáo đã có dữ liệu.`
- **AC-10 (Chuyên cần - bị ngắt sau dấu hai chấm):**
  > Nguyên văn: `**Chuyên cần:** Tự động cộng dồn tổng số buổi có mặt và số ca muộn của học viên ở cả lớp cũ và lớp mới trong suốt chu kỳ tháng: `
  - *Vấn đề:* Dừng lại ở dấu hai chấm `: ` không có câu tiếp nối. Cần bổ sung diễn giải: `(Số buổi đi học mới = Buổi có mặt lớp cũ + Buổi có mặt lớp mới).`
- **Bảng 4 (Lỗi gõ):** Dòng Bộ đôi chọn khoảng bài học vẫn còn lỗi chính tả: `mặc đinh: Chọn bài` $\rightarrow$ Sửa thành: `mặc định: Chọn bài`.
- **Bảng 1 (Dòng Button Chỉnh sửa):** Còn dùng từ `button`, `mode/chế độ`, và lỗi gõ `chính sửa`, `chuyển sáng chế độ xem`.
- **Bảng 3 (Dòng A2.1):** Cột *Nhãn chỉ dẫn & Bullet màu sắc* để trống.

---

### 3. `US-CARE-04-03` (ID: 158105715)
- **AC-05 (Lỗi chính tả tiêu đề):**
  > Nguyên văn: `### AC-05: Mở tab Nhận xết kiểm tra từ Thẻ điểm kiểm tra (REQ-05)`
  - *Vấn đề:* Viết sai chính tả chữ `"Nhận xết"` $\rightarrow$ Sửa thành: `"Nhận xét"`.
- **AC-09 & AC-10 (Lỗi đánh số và cú pháp):**
  - Tiêu đề `### AC-9: ` $\rightarrow$ Nên chuẩn hóa thành `### AC-09: `.
  - Tiêu đề `### AC-**10: Tải ảnh áp phích...` $\rightarrow$ Thừa dấu sao `**` bên trong mã tiêu đề.
- **CASE-10 (Lỗi khoảng trắng):**
  - `**[CASE-10]Trình duyệt chặn tải tệp:**` $\rightarrow$ Thiếu dấu cách sau dấu ngoặc vuông `] `.
- **Bảng 3.5 (Mục A2 - cụt sau dấu hai chấm):**
  - Dòng A2 cột quy tắc ghi: `...Tự động thích ứng linh hoạt theo môn học:` $\rightarrow$ Cần bổ sung tiếp: `Môn Toán (phản xạ tính toán, tư duy hình học), Môn Tiếng Anh (từ vựng, phát âm, mẫu câu).`

---

### 4. `BF-CARE-04` (ID: 158072955)
- **Mục 5.1 (Câu dở dang):**
  > Nguyên văn: `Hệ thống lưu nội dung và chuyển cờ`
  - *Vấn đề:* Chưa nêu rõ chuyển cờ gì. Cần bổ sung: `...và chuyển cờ tự động thành sai (is_auto_generated = false).`
- **Bảng 5.2 (Thiếu cột Mã Quyền):**
  - Bảng danh mục quyền chỉ có Tên quyền, Loại quyền, Scope, Diễn giải; thiếu hẳn cột `Mã Quyền (Capability Key)` để ghi mã `care.monthly_report.edit`.

---

## ⚡ III. CÁC ĐIỂM NGHIỆP VỤ CẦN LÀM RÕ (BUSINESS LOGIC CLARIFICATIONS)

1. **Giới hạn số lượng Ảnh/Video khoảnh khắc:**
   - **BF-04 (Mục 6.3):** Quy định *chọn lọc **tối đa 6 khoảnh khắc** tiêu biểu*.
   - **US-04-03 (Mục REQ-03 & RULE-MR-03):** Quy định *Nếu có trên 6 ảnh, ô thứ 6 có lớp phủ: `+X khoảnh khắc`*.
   - 👉 **Chốt lại:** Giáo viên có được chọn $\ge 7$ ảnh không? Nếu có, BF cần sửa thành: *"Giáo viên chọn ảnh tiêu biểu; giao diện trang đích ưu tiên hiển thị 6 ô đầu (ô 6 hiện +X nếu có nhiều hơn 6 ảnh)"*. Nếu không cho chọn quá 6 ảnh, thì bỏ quy tắc `+X` trên trang đích.
2. **Bộ chọn Gói học trên Hộp thoại `US-CARE-04-02`:**
   - BF-04, US-01 và US-03 đều quản lý đa gói học độc lập.
   - Nhưng Header của hộp thoại `US-CARE-04-02` chỉ có bộ chọn *Kỳ báo cáo*, chưa có chỗ chuyển *Gói học*. Cần làm rõ: Hộp thoại tự động lấy theo Gói học đang chọn ở màn hình cha, hay cần bổ sung thêm một dropdown Gói học tại Header hộp thoại?
3. **Tab Nhận xét kiểm tra của Phụ huynh trên Landing Page (US-CARE-04-03 AC-05):**
   - Nút `Nhận xét` mở tab mới nội dung bài kiểm tra. Cần ghi chú rõ: Tab này mở view công khai (public view) dành riêng cho phụ huynh để không bị yêu cầu đăng nhập tài khoản nhân viên.
