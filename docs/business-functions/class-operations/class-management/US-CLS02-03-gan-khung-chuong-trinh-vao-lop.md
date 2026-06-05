---
id: US-CLS02-03
title: "Gắn Khung chương trình (Syllabus) vào Lớp"
bf: BF-CLS-02
domain: CAP-OPS
status: draft
tags: [class, syllabus, form]
---

# US-CLS02-03: Gắn Khung chương trình (Syllabus) vào Lớp

> **Tham chiếu:** BF-CLS-02 · Giao diện Mẫu §4.4 (Biểu mẫu)
> **Đường dẫn màn hình & Trạng thái liên quan:**
> - Hộp thoại gán mở từ tab **Lộ trình học tập** tại hộp thoại chi tiết lớp học (mở từ màn `/app/classes`) -> Trạng thái áp dụng: `Nháp`



## 1. Yêu cầu Người dùng (User Story)

**Là một** Nhân viên Giáo vụ hoặc Quản lý chi nhánh,  
**tôi muốn** gán một Khung chương trình (Syllabus) đã được ban hành vào lớp học của mình,  
**để** hệ thống tự động kế thừa cấu trúc bài giảng, đề cương và các tài liệu đi kèm để sinh ra lộ trình học tập chi tiết từng buổi học.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Thiết kế độc lập với luồng điểm danh và đánh giá học viên.
> - [x] **N**egotiable — Chi tiết cách tự động phân bổ buổi học khi số bài học lệch số buổi có thể điều chỉnh.
> - [x] **V**aluable — Giúp giáo vụ không phải nhập tay lộ trình học tập cho từng lớp mới, tăng hiệu quả vận hành.
> - [x] **E**stimable — Đã xác định rõ các ràng buộc nghiệp vụ và cấu trúc dữ liệu.
> - [x] **S**mall — Hoàn thành trong một phân đoạn phát triển.
> - [x] **T**estable — Có tiêu chí nghiệm thu chi tiết ở mục 6.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-CLS-03-01] Bộ lọc trạng thái Syllabus:** Chỉ hiển thị và cho phép chọn các Khung chương trình (Syllabus) đang ở trạng thái hoạt động (Active/Published). Không hiển thị các Syllabus nháp hoặc đã lưu trữ.
2. **[RULE-CLS-03-02] Kế thừa độc lập (Đóng băng dữ liệu):** Khi gán Syllabus vào lớp học, toàn bộ đề mục bài giảng, tài liệu đính kèm, slide bài học và bài tập về nhà của Syllabus tại thời điểm gán sẽ được nhân bản và khóa cứng vào Lớp học. Mọi chỉnh sửa hay cập nhật phiên bản Syllabus gốc sau đó từ phòng học thuật sẽ KHÔNG tự động đồng bộ vào lớp này, nhằm bảo vệ tính ổn định của khóa học đang diễn ra.
3. **[RULE-CLS-03-03] Chặn gán trùng lặp:** Mỗi lớp học chỉ được gán tối đa 1 Khung chương trình chính tại một thời điểm. Việc gán lại Khung chương trình mới sẽ ghi đè và yêu cầu xác nhận rủi ro mất dữ liệu lộ trình hiện tại.
4. **[RULE-CLS-03-04] Ràng buộc số buổi học:** 
   - Nếu số lượng bài học trong Syllabus ($N$) bằng số buổi học dự kiến của lớp học ($M$), hệ thống gán tương ứng 1-1.
   - Nếu số lượng bài học trong Syllabus ($N$) ít hơn số buổi học dự kiến ($M$), hệ thống điền $N$ bài đầu tiên, các buổi thừa còn lại ở cuối sẽ được gán chủ đề mặc định là "Ôn tập & Kiểm tra cuối khóa".
   - Nếu số lượng bài học trong Syllabus ($N$) nhiều hơn số buổi học dự kiến ($M$), hệ thống hiển thị cảnh báo đỏ và yêu cầu giáo vụ chọn gộp các bài học cuối hoặc yêu cầu phòng vận hành mở rộng thêm thời gian học của lớp.

### 2.1. Thông số & Định mức (Metrics & Thresholds)
- **[METRIC-CLS-03-01] Số lượng buổi tối đa:** Giới hạn một Syllabus không vượt quá 120 bài học/buổi học để đảm bảo hiệu năng tải lộ trình.

---

## 3. Cấu trúc Các trường nhập liệu

**Bố cục:** Hộp thoại nổi (Modal) 1 Cột.

### 3.1. Thông tin đầu vào

| Tên trường | Loại hiển thị | Bắt buộc | Trường dữ liệu | Ghi chú & Quy tắc |
|------------|---------------|----------|----------------|-------------------|
| Tên Khung chương trình | Danh sách chọn | Có | `syllabus_id` | Tìm kiếm nhanh tên Syllabus đang hoạt động. |
| Mô tả chi tiết | Ô văn bản dài | Không | `description` | Chỉ xem. Hiển thị thông tin tóm tắt và số lượng bài học của Syllabus đã chọn. |
| Ngày bắt đầu áp dụng | Ô chọn ngày | Có | `apply_date` | Mặc định là ngày khai giảng của lớp học. |
| Quy tắc phân bổ buổi | Ô chọn nhóm | Có | `allocation_rule` | Tùy chọn: "Phân bổ 1-1 tuần tự" hoặc "Tùy chỉnh phân bổ thủ công". |

### 3.2. Ví dụ Dữ liệu mẫu

| Tình huống | Dữ liệu đầu vào | Kết quả mong đợi |
|------------|-----------------|-------------------|
| Gán thành công | Chọn: "IELTS Junior v2.1", Quy tắc: "Tuần tự" | Hệ thống sinh ra 12 buổi học tương ứng với 12 bài giảng trong Syllabus. Trạng thái lưu thành công. |
| Thay đổi Syllabus | Lớp đang có Syllabus cũ, chọn gán Syllabus mới | Hiển thị cảnh báo: "Lớp học đã có lộ trình bài giảng. Việc thay đổi sẽ thiết lập lại toàn bộ lộ trình. Bạn có chắc chắn muốn tiếp tục?" |

### 3.3. Nút hành động

| Nút | Loại hiển thị | Logic xử lý |
|-----|---------------|-------------|
| Hủy bỏ | Nút viền nhạt | Đóng hộp thoại, giữ nguyên lộ trình cũ của lớp học. |
| Xác nhận gán | Nút màu nhấn | Kiểm tra trùng khớp -> Tạo lộ trình mới -> Cập nhật nhật ký hoạt động -> Đóng hộp thoại và tải lại tab Lộ trình. |

---

## 4. Mô tả chi tiết (Màn hình & Luồng)

### 4.1. Mô tả Màn hình
- Giao diện biểu mẫu là một hộp thoại nhỏ (Modal) hiện lên giữa màn hình khi giáo vụ nhấp vào nút "Gán khung chương trình" ở tab **Lộ trình học tập** của màn chi tiết lớp học.
- Hộp thoại có thiết kế tối giản, tập trung vào ô tìm kiếm và chọn Syllabus. Sau khi chọn một Syllabus cụ thể, phía dưới sẽ hiển thị một bảng tóm tắt danh sách các bài học (tên bài, mục tiêu học tập, số lượng bài tập đính kèm) để giáo vụ xác nhận trước khi lưu.

### 4.2. Luồng Hoạt động (Workflow)
1. Giáo vụ mở màn hình chi tiết lớp học, chuyển sang tab **Lộ trình học tập** và bấm nút "Gán khung chương trình".
2. Hộp thoại nổi lên. Giáo vụ chọn Syllabus từ danh sách thả xuống.
3. Hệ thống gọi dữ liệu cấu trúc của Syllabus đó và hiển thị danh sách bài học tóm tắt bên dưới.
4. Giáo vụ kiểm tra thông tin, chọn quy tắc phân bổ và bấm nút "Xác nhận gán".
5. Hệ thống thực hiện nhân bản cấu trúc Syllabus vào cơ sở dữ liệu lớp học, ghi nhận hành động vào nhật ký (Logs), đóng hộp thoại và tự động cập nhật lại danh sách bài học trên giao diện tab Lộ trình.

---

## 5. Corner Cases (Trường hợp góc cạnh & Đặc biệt)

| # | Tình huống đặc biệt (Corner Case) | Cách xử lý chi tiết | Ghi chú / Trạng thái |
|---|----------------------------------|---------------------|----------------------|
| 5.1 | Giáo vụ cố tình gán Khung chương trình khi lớp học đã diễn ra được một số buổi | Hệ thống hiển thị cảnh báo yêu cầu xác nhận. Nếu đồng ý, các buổi học đã hoàn thành giảng dạy sẽ được giữ nguyên đề mục cũ, chỉ cập nhật đề mục mới cho các buổi học chưa diễn ra. | Cảnh báo tương tác |
| 5.2 | Gán Khung chương trình trống không có bài học nào | Hệ thống hiển thị lỗi và chặn lưu, cảnh báo rằng chương trình được chọn không chứa dữ liệu bài học hợp lệ. | Chặn lưu từ hệ thống |

---

## 6. Tiêu chí Nghiệm thu (Acceptance Criteria)

- **AC-1 (Lọc Syllabus hoạt động):** Danh sách chọn chỉ hiển thị các Syllabus có trạng thái hoạt động (Active).
- **AC-2 (Kế thừa đề cương bài giảng):** Sau khi xác nhận gán thành công, lộ trình học tập của lớp phải tự động cập nhật đầy đủ danh sách bài học, tài liệu đính kèm tương ứng với cấu trúc Syllabus đã chọn.
- **AC-3 (Cảnh báo ghi đè):** Hiển thị cảnh báo rủi ro ghi đè lộ trình cũ rõ ràng khi người dùng cố tình thay đổi Syllabus đã gán trước đó.
- **AC-4 (Ghi nhật ký hệ thống):** Hành động gán Syllabus phải được tự động ghi nhận một dòng log chi tiết vào tab Nhật ký hoạt động của lớp học kèm tên giáo vụ thực hiện.