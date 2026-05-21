---
id: US-BT02
title: "Tạo mới Booking Test"
bf: BF-ENR-01
domain: CAP-ADM
status: draft
tags: [enrollment, booking-test, form]
---

# US-BT02: Tạo mới Booking Test

> **Tham chiếu:** BF-ENR-01 · `[POLICY-DS-03]` · Giao diện Mẫu §4.4 (Biểu mẫu)

## 1. Yêu cầu Người dùng (User Story)

**Là một** nhân viên Tư vấn / Quản lý chi nhánh,
**tôi muốn** tạo booking kiểm tra đầu vào cho học viên bằng cách chọn thông tin học viên, chương trình, trường và khung giờ trống của giáo viên,
**để** xếp lịch test hoặc demo cho học viên mới và phân công giáo viên phụ trách.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai độc lập, không phụ thuộc US-BT01 hay US-BT03..05.
> - [x] **N**egotiable — Bố cục cột, thứ tự trường nhập có thể thương lượng.
> - [x] **V**aluable — Cho phép đặt lịch test nhanh, phân bổ giáo viên đúng khung giờ.
> - [x] **E**stimable — Đủ rõ để ước lượng công sức.
> - [x] **S**mall — Hoàn thành trong 1 vòng phát triển.
> - [x] **T**estable — Có tiêu chí nghiệm thu ở mục 7.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-FORM-01] Nguồn gốc mở hộp thoại:** Hộp thoại được kích hoạt từ 2 nơi: (a) nút "Tạo booking" trên US-BT01, người dùng tự chọn học viên; (b) tab "Booking" trong màn hình chi tiết học viên, hệ thống tự khóa và điền sẵn thông tin học viên.
2. **[RULE-FORM-02] Phụ thuộc Chương trình → Level:** `NẾU` chương trình thay đổi `THÌ` danh sách level cập nhật theo lộ trình học của chương trình mới. `NẾU` chương trình không có lộ trình `THÌ` trường level vô hiệu.
3. **[RULE-FORM-03] Tab Chọn Ngày:** Khi chọn 1 ngày (trong danh sách 3 ngày gần nhất), hệ thống mặc định hiển thị tùy chọn "Không chọn giáo viên" lên đầu. Bên dưới là danh sách giáo viên kèm khung giờ trống. Chọn giáo viên nào sẽ mở rộng giờ của người đó (các giáo viên khác tự thu gọn).
4. **[RULE-FORM-04] Tab Chọn Giáo viên:** Khi chọn giáo viên từ danh sách avatar (hỗ trợ hover hiện mini-modal), hệ thống hiển thị 3 ngày khả dụng. Click 1 ngày để mở rộng khung giờ trống của họ. Danh sách giáo viên hiển thị ở cả 2 tab bắt buộc phải được lọc (filter) theo Cơ sở (Trường) đang được chọn ở cột thông tin booking.
5. **[RULE-FORM-05] Chống trùng giờ giáo viên:** `NẾU` giáo viên đã có booking trùng khung giờ `THÌ` khung đó không hiển thị (hoặc mờ đi không thể bấm) trong danh sách giờ khả dụng.
6. **[RULE-FORM-06] Mã tự tăng:** Mã booking tự sinh dạng mã ngắn (vd: E0005), bằng mã lớn nhất hiện tại + 1. `NẾU` không đọc được mã nào `THÌ` bắt đầu từ 0001.
7. **[RULE-FORM-07] Phân quyền:** Nút "Tạo booking" ẩn khi vai trò là giáo viên. Chỉ Tư vấn và Quản lý chi nhánh được phép tạo.
8. **[RULE-FORM-08] Đặt lại khi mở lại:** Mỗi lần mở hộp thoại, biểu mẫu đặt lại hoàn toàn. Môn học lấy từ tab đang chọn trên US-BT01. Ngày đặt lại về hôm nay.

---

## 3. Cấu trúc Các trường nhập liệu

**Bố cục:** 2 Cột trên màn hình rộng (không có đường viền phân cách) — Cột trái: thông tin booking (xếp thành 1 cột dọc), Cột phải: tab chọn lịch và giáo viên. Trên điện thoại: 1 cột xếp dọc.

### 3.1. Cột trái — Thông tin Booking

| Tên trường | Loại hiển thị | Bắt buộc | Trường dữ liệu | Ghi chú & Quy tắc |
|------------|---------------|----------|----------------|-------------------|
| Học viên | Danh sách tìm kiếm | Có | Tên học viên, mã hồ sơ | Chỉ hiển thị hồ sơ cá nhân có vai trò học viên. Thông tin gia đình và SĐT tự động lấy theo hồ sơ (không hiển thị trường nhập). Nếu danh sách rỗng: dự phòng bằng tên từ booking hiện có. |
| Chương trình | Danh sách thả xuống | Có | Tên chương trình + tên môn | Chỉ hiển thị chương trình đang hoạt động. Sắp xếp alphabet tiếng Việt. Khi đổi: cập nhật danh sách Level (RULE-FORM-02). |
| Level | Danh sách thả xuống | Không | Level | Phụ thuộc chương trình đã chọn, lấy từ lộ trình học. Vô hiệu khi chưa chọn chương trình hoặc không có level. |
| Trường | Danh sách tìm kiếm | Có | Tên chi nhánh | Chỉ hiển thị cơ sở nội bộ đang hoạt động. Sắp xếp alphabet tiếng Việt. |
| Loại ca test | Danh sách thả xuống | Có | Loại ca | Các tùy chọn: "20 phút", "30 phút". Mặc định chọn 1 loại phù hợp. |
| Ghi chú | Ô nhập văn bản dài | Không | Ghi chú | Nếu trống, lưu thành "—". |

### 3.2. Cột phải — Chọn lịch hẹn & Giáo viên (Dạng Tab)

| Tên trường | Loại hiển thị | Bắt buộc | Trường dữ liệu | Ghi chú & Quy tắc |
|------------|---------------|----------|----------------|-------------------|
| Điều hướng Tab | Nút chọn Tab ngang | Có | Chế độ chọn | Hai tab: "Chọn ngày" và "Chọn giáo viên". |
| **Tab Chọn Ngày:** Danh sách Ngày | Danh sách ngang | Có | Ngày hẹn | Liệt kê 3 ngày liên tiếp tính từ hôm nay. Bấm chọn 1 ngày để xem khung giờ. |
| **Tab Chọn Ngày:** Danh sách GV & Khung giờ | Danh sách cuộn dọc | Có | Giáo viên + Giờ | Dưới ngày đang chọn: Vị trí 1 (mặc định) là "Không chọn giáo viên" kèm các khung giờ khả dụng chung. Vị trí 2 trở đi là danh sách giáo viên & khung giờ khả dụng. Chọn 1 GV để mở rộng khung giờ, chọn GV khác thì đóng GV cũ. |
| **Tab Chọn GV:** Danh sách Giáo viên | Danh sách Avatar ngang/lưới | Có | Giáo viên | Liệt kê avatar của từng giáo viên. Hover hiển thị mini modal thông tin. Mini modal có nút mở rộng ra Modal danh sách nhân viên đầy đủ (giống form chi tiết booking). |
| **Tab Chọn GV:** Danh sách Ngày & Khung giờ | Danh sách cuộn dọc | Có | Ngày + Giờ | Khi chọn 1 giáo viên: hiển thị 3 ngày gần nhất của họ. Bấm vào 1 ngày để mở rộng toàn bộ khung giờ khả dụng của giáo viên đó trong ngày. |
| Nhãn đã chọn | Văn bản | — | — | Hiển thị tóm tắt: Tên GV + Ngày + Giờ đã chọn (nếu có). |

### 3.3. Ví dụ Dữ liệu mẫu

*Giúp AI và Lập trình viên tạo dữ liệu kiểm thử chính xác.*

| Tình huống | Dữ liệu đầu vào | Kết quả mong đợi |
|------------|-----------------|-------------------|
| Tạo thành công | Học viên: Nguyễn Văn A, Chương trình: IELTS, Trường: CS Quận 1, Loại ca: 30 phút, Ngày: 15/10, GV: Trần B, Giờ: 10:30 | Booking E0005 tạo thành công, trạng thái "Đã đặt lịch", hộp thoại đóng. |
| Thiếu trường bắt buộc | Không chọn ngày/giờ | Biểu mẫu không gửi, hộp thoại không đóng. |
| Tab Chọn Ngày (Thu/Phóng) | Đang mở khung giờ của GV A, bấm chọn GV B | Khung giờ GV A thu gọn lại, khung giờ GV B mở rộng ra. |
| Tab Chọn GV (Mini modal) | Ở tab GV, hover lên avatar GV Trần B | Hiện popup nhỏ thông tin, bấm nút mở modal danh sách nhân viên. |
| Mở từ chi tiết học viên | Mở từ tab Booking của học viên Nguyễn Văn C | Khóa trường học viên. Bố cục 2 cột không viền, không có ô nhập gia đình/SĐT. |

### 3.4. Nút hành động

| Nút | Loại hiển thị | Logic xử lý |
|-----|---------------|-------------|
| Hủy bỏ | Nút viền nhạt | Đóng hộp thoại, không lưu, xóa trắng dữ liệu. |
| Tạo | Nút màu nhấn | Kiểm tra bắt buộc (Học viên, Chương trình, Trường, Giáo viên, Ngày + Giờ) → Lưu → Đóng → Tải lại danh sách. |

### 3.5. Dữ liệu Booking sau khi tạo

| Trường | Giá trị |
|--------|---------|
| Mã | Tự tăng dạng mã ngắn (vd: E0005) — RULE-FORM-06. |
| Trạng thái | "Đã đặt lịch" (mặc định). |
| Môn học | Lấy từ tab môn đang chọn trên US-BT01. |
| Loại sự kiện | "Kiểm tra" (mặc định) hoặc "Demo". |
| Phòng | Mặc định "Sảnh" nếu không chọn. |
| Ghi chú | Nội dung ghi chú hoặc "—" nếu trống. |
| Kết quả đánh giá | Nếu chọn kiểm tra trực tuyến: cấu trúc kết quả khởi tạo rỗng. Nếu không: không có trường này. |

---

## 4. Xử lý Ngoại lệ

| # | Tình huống | Cách xử lý |
|---|-----------|------------|
| 4.1 | Danh sách hồ sơ học viên trống (chưa có dữ liệu) | Danh sách hiển thị dạng dự phòng: lấy tên từ các booking hiện có (loại trùng). Vẫn cho phép tạo booking. |
| 4.2 | Chương trình không có lộ trình học | Danh sách Level hiển thị gợi ý "Chọn level", vô hiệu. Không chặn gửi (level không bắt buộc). |
| 4.3 | Đổi chương trình khi đã chọn level | Nếu level cũ tồn tại trong chương trình mới → giữ nguyên. Nếu không → chọn level đầu tiên. Nếu chương trình mới không có level → xóa. |
| 4.4 | Chưa chọn giáo viên khi xem lưới khung giờ | Tất cả khung giờ đều khả dụng (không có dữ liệu trùng). Chọn giáo viên sau sẽ xóa khung giờ đã chọn. |
| 4.5 | Không có chi nhánh đang hoạt động | Danh sách trường hiển thị trống. Không chặn giao diện nhưng không thể gửi (trường bắt buộc). |
| 4.6 | Không có nhân sự có chức danh giáo viên | Danh sách giáo viên hiển thị trống. Không chặn giao diện nhưng không thể gửi (giáo viên bắt buộc). |
| 4.7 | Gửi khi thiếu trường bắt buộc | Biểu mẫu không gửi, hộp thoại không đóng, không hiện thông báo lỗi (chặn im lặng). |
| 4.8 | Bấm ra ngoài hộp thoại khi đang điền | Không tự đóng hộp thoại. Người dùng phải chủ động bấm Hủy. |
| 4.9 | Mở hộp thoại lần 2 liên tiếp | Biểu mẫu đặt lại hoàn toàn. Môn học lấy từ tab đang chọn. Ngày đặt lại về hôm nay. |
| 4.10 | Múi giờ xác định ngày | Dùng múi giờ địa phương của người dùng để xác định "hôm nay". |
| 4.11 | Mã bị trùng hoặc không đọc được | Quét tất cả booking, lấy mã lớn nhất + 1. Nếu không đọc được → bắt đầu từ 0001. |

---

## 5. Chỉ dẫn cho AI Agent & Lập trình viên (Business Architecture)

- Tách biệt hoàn toàn phần xử lý giao diện và phần kiểm tra ràng buộc dữ liệu.
- Nhãn trạng thái bắt buộc lấy màu từ bộ quy tắc trạng thái chuẩn (`statusColors.ts`).
- Chuỗi phụ thuộc (Chương trình → Level, Giáo viên → Khung giờ, Ngày → Khung giờ) phải xử lý bằng hiệu ứng phản ứng (reactive effect), không dùng kiểm tra thủ công.
- Phân quyền phải kiểm tra trước khi hiển thị nút "Tạo booking" và trước khi cho phép lưu.
- Khi mở từ màn hình chi tiết học viên: nhận dữ liệu học viên qua tham số, khóa các trường đã điền sẵn.

### ⛔ Hàng rào An toàn (Guardrails)
- **KHÔNG** thêm trường nhập liệu ngoài danh sách ở mục 3.1 và 3.2.
- **KHÔNG** thay đổi quy tắc kiểm tra hợp lệ nghiệp vụ ở mục 2 mà chưa được phê duyệt.
- **KHÔNG** cho phép chọn khung giờ đã trùng với booking khác của cùng giáo viên.
- **KHÔNG** hiển thị danh sách giáo viên của toàn hệ thống ở khu vực Chọn lịch hẹn mà chưa lọc qua trường Cơ sở đang chọn.

---

## 6. Kế hoạch Tự kiểm tra (Self-Verification)

| # | Hạng mục | Cách kiểm tra | Tiêu chuẩn Đạt |
|---|----------|---------------|-----------------|
| V-01 | Kiểm tra dữ liệu | Thử từng tình huống ở mục 3.3 | Kết quả khớp cột "Kết quả mong đợi". |
| V-02 | Ngoại lệ | Thử từng tình huống ở mục 4 | Hệ thống xử lý đúng mô tả. |
| V-03 | Tab Chọn Ngày | Ở tab Ngày, chọn GV A rồi chọn GV B | Lịch GV A đóng, lịch GV B mở. |
| V-04 | Tab Chọn Giáo viên | Hover lên avatar giáo viên | Xuất hiện mini modal, bấm nút mở được modal danh sách nhân viên đầy đủ. |
| V-05 | Mở từ chi tiết học viên | Mở hộp thoại từ tab Booking của 1 học viên | Thông tin học viên điền sẵn, khóa. Không hiện field Gia đình/SĐT. |
| V-06 | Phân quyền | Đăng nhập vai trò giáo viên | Nút "Tạo booking" không hiển thị. |
| V-07 | Đặt lại biểu mẫu | Tạo xong 1 booking, mở lại hộp thoại | Tất cả trường trống. Môn và ngày đúng mặc định. |
| V-08 | Nhãn trạng thái | Kiểm tra trạng thái booking mới | Lấy màu từ hệ thống tập trung, không gán cố định. |

---

## 7. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|---------------------|----------------------|-------------------|
| AC-01 | Bố cục chuẩn biểu mẫu | So với mẫu thiết kế §4.4 | 2 cột trên màn hình rộng, 1 cột trên điện thoại. |
| AC-02 | Giao diện chuẩn (Layout & Fields) | Mở hộp thoại kiểm tra | Bố cục không có viền phân cách, không có ô nhập Gia đình/SĐT. Hiện "Loại ca test". |
| AC-03 | Chuỗi phụ thuộc Chương trình → Level | Đổi chương trình, kiểm tra level | Level cập nhật theo lộ trình. Vô hiệu khi không có level. |
| AC-04 | Tab Chọn Ngày hoạt động đúng | Chọn tab Ngày, bấm các giáo viên | Hiện 3 ngày gần nhất. "Không chọn GV" ở vị trí 1. Mở rộng GV này sẽ đóng GV khác. |
| AC-05 | Tab Chọn Giáo viên hoạt động đúng | Chọn tab GV, thao tác | Hiện avatar. Hover mở mini modal (có nút mở modal full). Click GV hiện 3 ngày, click ngày hiện full giờ. |
| AC-06 | Tạo thành công | Điền đầy đủ, bấm Tạo | Hộp thoại đóng, booking mới đầu danh sách, mã tự tăng, trạng thái "Đã đặt lịch". |
| AC-07 | Tạo thất bại | Thiếu trường bắt buộc, bấm Tạo | Hộp thoại không đóng, không tạo booking. |
| AC-08 | Mở từ chi tiết học viên | Mở từ tab Booking của 1 học viên | Thông tin học viên tự điền và khóa. Các trường khác trống. |
| AC-09 | Đặt lại biểu mẫu | Mở hộp thoại lần 2 | Toàn bộ trường trống, môn lấy từ tab đang chọn, ngày = hôm nay. |
| AC-10 | Phân quyền vai trò | Đăng nhập giáo viên | Nút "Tạo booking" không hiển thị trên US-BT01. |
