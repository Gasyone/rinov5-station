# Bảng đối chiếu Nghiệp vụ & Hiện trạng Kỹ thuật — Đặt lịch Đánh giá Năng lực (Booking Test)

Tài liệu này đối chiếu các yêu cầu nghiệp vụ từ người dùng đối với module **Đặt lịch Đánh giá Năng lực (Booking Test)** sang các thành phần kỹ thuật tương ứng, tài liệu đặc tả chi tiết và hiện trạng triển khai thực tế trên Frontend (FE) Rinov5.

---

## 1. Bảng đối chiếu Nghiệp vụ - Kỹ thuật & Hiện trạng FE

| Yêu cầu từ User Requirement | Module/Tính năng chuyển đổi (Tech) | Tài liệu mô tả chi tiết | Hiện trạng trong Code FE | Đánh giá khoảng trống (Gaps) so với yêu cầu mới |
| :--- | :--- | :--- | :--- | :--- |
| **1. Khởi động từ CRM & Check-in**<br>- Dữ liệu đẩy từ CRM sang theo thời gian thực.<br>- Tạo mới ở trạng thái Đã đặt lịch (`booked_assessment`) luôn, không cần duyệt.<br>- Nhất quán học sinh qua ID học sinh = 1.<br>- **Quy trình Check-in:** Bỏ qua nghiệp vụ cũ bắt buộc xác nhận trên ERP mới cho làm bài test; nay học sinh vẫn làm được bài test dù chưa xác nhận. Nút xác nhận trên ERP đóng vai trò check-in thủ công ghi nhận học sinh đến.<br>- **Tự động Check-in:** Tự động xác nhận check-in học sinh (chuyển sang trạng thái "Đang đánh giá" - `started_assessment`) khi học sinh bắt đầu làm bài test trên iPad hoặc GV mở ca phỏng vấn. | - **Real-time Webhook / API & Auto Check-in**<br>- Endpoint tiếp nhận thông tin từ CRM.<br>- Logic tự động chuyển trạng thái `booked_assessment` -> `started_assessment` khi mở đánh giá phỏng vấn hoặc khi bắt đầu test iPad. | [BF-ENR-01](./BF-ENR-01-booking-test.md) (§4.1)<br>[US-BT02](./US-BT02-tao-moi-booking-test.md)<br>[US-BT03](./US-BT03-xem-cap-nhat-chi-tiet-booking.md) | **Đã hoàn thành:** Form tạo mới [BookingTestCreateDialog.tsx](../../../src/components/screens/booking-test/BookingTestCreateDialog.tsx) tạo trực tiếp mock trạng thái `booked_assessment`. Khi click mở đánh giá/phỏng vấn, hệ thống tự động chuyển trạng thái sang `started_assessment` (Đang đánh giá). Học sinh có thể làm bài độc lập trên iPad mà không bị chặn bởi bước xác nhận trên ERP. | **Đạt yêu cầu.** Giao diện check-in và tự động chuyển trạng thái hoạt động tốt. |
| **2. Thông tin đặt lịch & Mặc định 30p Phỏng vấn**<br>- Chọn học sinh, thời gian đánh giá, cơ sở, chương trình, level.<br>- Chỉ chọn giờ bắt đầu, hệ thống tự động tính ca phỏng vấn mặc định 30 phút. Không cho phép thay đổi thời lượng này để tránh trùng lịch phía sau. | - **Form Tạo mới & DatePicker**<br>- Logic tự động cộng 30 phút vào giờ bắt đầu để gán giờ kết thúc. Khóa trường thời lượng (duration = 30m). | [US-BT02](./US-BT02-tao-moi-booking-test.md) | **Chưa hoàn thành triệt để:** Dropdown "Loại ca test" (`testDuration`) trong [BookingTestCreateDialog.tsx](../../../src/components/screens/booking-test-v2/BookingTestCreateDialog.tsx) vẫn cho chọn "20 phút" hoặc "30 phút", chưa bị khóa cứng. | ⚠️ **Gap giao diện:** Cần disabled hoặc ẩn hẳn dropdown "Loại ca test" trong form tạo mới, cố định giá trị là "30 phút" để tránh nhân sự chọn sai thời lượng. |
| **3. Giới hạn trùng lịch đánh giá của Học sinh**<br>- Học sinh đang có lịch đánh giá chưa hoàn thành thì không được phép đặt lịch mới (tính theo từng Học sinh cụ thể). | - **Validation check**<br>- Kiểm tra trùng lịch cũ khi đặt lịch mới. | [BF-ENR-01](./BF-ENR-01-booking-test.md) (`[RULE-ENR-01-01]`) | **Hoàn toàn chưa có:** Trong `submitCreate` của `useBookingTestActions.ts` chưa hề có logic kiểm tra ca test chưa hoàn tất của học sinh. | ⚠️ **Gap nghiệp vụ nghiêm trọng:** Code đang bỏ qua kiểm tra chặn đặt trùng. Cần bổ sung logic duyệt tìm ca test cũ chưa hoàn tất (`status` không phải `completed`, `failed`, `cancelled`) của học sinh và chặn tạo mới. |
| **4. Làm bài đánh giá trên iPad**<br>- Tự tạo đề trên iPad. Học sinh làm bài xong, điểm Nghe-Đọc-Viết (LWR) tự động trả về ca booking. | - **LMS Integration API**<br>- Điểm số từ app iPad đồng bộ về hệ thống qua API sẵn có. | [US-BT05](./US-BT05-thuc-thi-va-dong-bo-ket-qua-test-ipad.md) | **Dữ liệu giả lập:** Hiện tại điểm LMS (LWR) được giả lập ngẫu nhiên trong file mock data. | **Đạt yêu cầu** (ở mức độ demo dữ liệu giả lập). |
| **5. Phân bổ & Thay đổi Giáo viên & Kiểm tra trùng**<br>- Quản lý gán giáo viên (có lọc "chưa gán").<br>- Giáo viên bị trùng lịch dạy hoặc trùng ca đánh giá khác sẽ **tự động được lọc bỏ hoàn toàn** khỏi danh sách đề xuất mặc định của modal gán giáo viên. Kiểm tra trùng khớp theo khung giờ chính xác (9:30 kết thúc, 9:40 free là gán được).<br>- Nếu gõ tìm kiếm chính xác tên GV trùng, hiển thị mờ đi (Disabled) kèm nhãn trùng lịch: tên ca trùng. | - **Teacher Assignment & Conflict Filter**<br>- Component lọc "Chưa gán GV".<br>- Dialog chọn nhân viên kèm logic lọc bỏ giáo viên bị trùng lịch tự động và hiển thị mờ/nhãn trùng lịch khi tìm kiếm. | [US-BT01](./US-BT01-quan-ly-danh-sach-booking-test.md) (§3.6)<br>[US-BT03](./US-BT03-xem-cap-nhat-chi-tiet-booking.md) | **Lỗi kỹ thuật ở dòng bảng chính:** Component [BookingTestEmployeePickerDialog.tsx](../../../src/components/screens/booking-test/BookingTestEmployeePickerDialog.tsx) đã có logic ẩn/mờ trùng lịch rất chuẩn. Tuy nhiên, khi gán nhanh GV ở dòng bảng danh sách (`BookingTestTableRow.tsx`), code không truyền các prop `bookings`, `bookingTime`, `currentBookingId` vào Dialog -> **làm tính năng kiểm tra trùng lịch bị vô hiệu hóa**. (Trong panel chi tiết thì hoạt động đúng). | ⚠️ **Gap kỹ thuật/Bug:** Cần bổ sung truyền prop đầy đủ từ `BookingTestTableRow.tsx` sang `BookingTestEmployeePickerDialog` để việc gán nhanh ở bảng chính cũng cảnh báo trùng lịch chính xác. |
| **6. Quản lý đa cơ sở**<br>- Quản lý giáo viên xem và thao tác trên nhiều cơ sở được gán. | - **Multi-branch filter**<br>- Dropdown chọn cơ sở trên Toolbar. | [US-BT01](./US-BT01-quan-ly-danh-sach-booking-test.md) (§3.1) | **Đã hoàn thành:** Tích hợp bộ lọc cơ sở trên component [BookingTestToolbar.tsx](../../../src/components/screens/booking-test/BookingTestToolbar.tsx). | **Đạt yêu cầu.** |
| **7. Hủy ca & Chấm Không đạt**<br>- Cho phép hủy lịch đánh giá (nếu học viên không đến) hoặc bấm "Không đạt". | - **Status transition triggers**<br>- Action thay đổi trạng thái trong màn hình chi tiết. | [US-BT03](./US-BT03-xem-cap-nhat-chi-tiet-booking.md) | **Đã hoàn thành:** Component [BookingTestDetailActions.tsx](../../../src/components/screens/booking-test/BookingTestDetailActions.tsx) cho phép đổi trạng thái trực tiếp. | **Đạt yêu cầu.** |
| **8. Giáo viên chấm Speaking & Feedback & Giờ phỏng vấn**<br>- Nhập điểm phỏng vấn và nhận xét.<br>- **Quy ước thời gian:** Giờ hiển thị trên giao diện đại diện cho giờ phỏng vấn của giáo viên phụ trách.<br>- Môn không có phỏng vấn (Toán): **Ẩn hoàn toàn** các trường liên quan đến phỏng vấn (Interviewer, Interview Time, Interview Status, Speaking Score) khỏi giao diện chi tiết và danh sách. | - **Conditional Assessment Form**<br>- Ẩn hoàn toàn các trường phỏng vấn dựa trên môn học. | [US-BT04](./US-BT04-danh-gia-english-assessment-path.md) | **Chưa ẩn triệt để môn Toán:**<br>- Bảng chính và chi tiết vẫn hiển thị cột/khối `Speaking` và render component `<SpeakingScore />` (hiển thị "GV: chưa có, AI: 0/0") cho môn Toán. | ⚠️ **Gap giao diện:** Cần thêm điều kiện ẩn Speaking Score ở Table Row và Detail Dialog nếu môn học là Toán (`booking.subject === 'math'`). Môn Toán chỉ hiển thị kết quả làm bài iPad (LWR). |
| **9. Đề xuất Level & Hoàn thành**<br>- Đầy đủ điểm iPad và Speaking, hệ thống tự gợi ý Level/Sublevel. Giáo viên sử dụng gợi ý của hệ thống, không thực hiện ghi đè level gợi ý.<br>- Môn Toán: CS, Admin hoặc Người phụ trách ca đánh giá sẽ bấm nút xác nhận "Hoàn thành" thủ công. | - **Level recommendation & Manual Complete**<br>- Khóa tính năng ghi đè level.<br>- Bấm nút Hoàn tất ca đánh giá thủ công đối với môn Toán. | [BF-ENR-01](./BF-ENR-01-booking-test.md)<br>[US-BT04](./US-BT04-danh-gia-english-assessment-path.md) | **Đã hoàn thành:** Hỗ trợ nút hoàn thành thủ công cho CS/Admin đối với môn Toán. Giáo viên không ghi đè level gợi ý của hệ thống (sử dụng logic cũ qua API). | **Đạt yêu cầu.** |
| **10. Báo cáo & Đồng bộ ngược CRM**<br>- Trả link báo cáo phỏng vấn và kết quả đánh giá ngay lập tức về CRM cho Sale để tư vấn. | - **Sync result link**<br>- Tạo link xem báo cáo tổng hợp. | [BF-ENR-01](./BF-ENR-01-booking-test.md)<br>[US-BT04](./US-BT04-danh-gia-english-assessment-path.md) | **Đã hoàn thành:** Component [BookingTestResultPage.tsx](../../../src/components/screens/booking-test/BookingTestResultPage.tsx) hiển thị biểu đồ và kết quả đánh giá để chia sẻ về CRM. | **Đạt yêu cầu.** |
| **11. Ghi chú & Lịch sử tương tác**<br>- Có chỗ ghi chú chung và tab lịch sử hoạt động của ca đánh giá. | - **Notes & Audit log tabs**<br>- Ghi nhận log thay đổi người phụ trách, trạng thái, thời điểm thi. | [US-BT03](./US-BT03-xem-cap-nhat-chi-tiet-booking.md) | **Đã hoàn thành:** Hỗ trợ ghi chú chung tích lũy và tab lịch sử hoạt động (mockup). | **Đạt yêu cầu.** |
| **12. Danh sách trạng thái & trạng thái ảo**<br>- **Trạng thái chính (4):** Đã đặt lịch, Đang đánh giá, Hoàn thành, Đã hủy.<br>- **Trạng thái ảo (5):** Chưa gán GV, Đã làm bài, Đã phỏng vấn, Không đạt, Đã check-in.<br>- Ca đánh giá môn Toán: **Không hiển thị** trạng thái ảo "Đã phỏng vấn" trên giao diện danh sách. | - **Subject-Specific Status Tiles & Filters**<br>- Phân tách logic hiển thị trạng thái chính và trạng thái ảo.<br>- Ẩn trạng thái ảo "Đã phỏng vấn" đối với môn Toán. | [BF-ENR-01](./BF-ENR-01-booking-test.md)<br>[US-BT01](./US-BT01-quan-ly-danh-sach-booking-test.md) | **Đã hoàn thành:** Hệ thống hỗ trợ hiển thị/lọc theo 4 trạng thái chính và 5 trạng thái ảo. Ẩn trạng thái ảo "Đã phỏng vấn" đối với môn Toán trên Status Tiles và bộ lọc. | **Đạt yêu cầu.** |
| **13. Tìm kiếm danh sách ca test (Search)**<br>- Hỗ trợ tìm kiếm đa năng nhanh chóng trên danh sách ca test theo 6 trường: Tên con, Tên phụ huynh, SĐT phụ huynh, Mã ca test, Trường và Phòng học. | - **Multi-field Text Search**<br>- Logic tìm kiếm chuẩn hóa chuỗi chữ thường, so khớp song song trên nhiều trường dữ liệu thực thể. | [US-BT01](./US-BT01-quan-ly-danh-sach-booking-test.md) (§3.1) | **Đã hoàn thành:** Ô tìm kiếm trên [BookingTestToolbar.tsx](../../../src/components/screens/booking-test/BookingTestToolbar.tsx) hỗ trợ tìm kiếm tức thời theo đúng 6 trường quy định. | **Đạt yêu cầu.** |
| **14. Phân quyền & Giới hạn hiển thị dữ liệu**<br>- Đảm bảo thông tin ca test được phân quyền: Giáo viên chỉ nhìn thấy các ca test được phân công trực tiếp và thuộc các cơ sở (trường) mình phụ trách. | - **Role & Scope-based Data Visibility**<br>- Lọc dữ liệu hiển thị gốc dựa trên định danh tài khoản đăng nhập (Zustand Auth Store) và danh sách trường phụ trách. | [BF-ENR-01](./BF-ENR-01-booking-test.md) (§5)<br>[US-BT01](./US-BT01-quan-ly-danh-sach-booking-test.md) | **Hoàn toàn chưa lọc theo User:** File `useBookingTestData.ts` và `BookingTestScreenV2.tsx` không hề sử dụng thông tin từ `useAuthStore` để lọc danh sách booking gốc của Giáo viên. Giáo viên đăng nhập vẫn xem được toàn bộ booking của người khác. | ⚠️ **Gap nghiệp vụ/bảo mật nghiêm trọng:** Cần bổ sung logic lọc danh sách booking gốc ở `useBookingTestData.ts` theo `user.name` và `user.role === 'teacher'`. |
| **15. Hiển thị nút "Mở đánh giá"**<br>- Chỉ hiển thị icon/nút link bài phỏng vấn ("Mở đánh giá") khi đã gán giáo viên/người phụ trách và **ca test đang ở trạng thái "Đang đánh giá"** (`started_assessment`). | - **Action visibility condition** | [BF-ENR-01](./BF-ENR-01-booking-test.md) (§5) | **Chưa giới hạn đúng trạng thái:** Nút/icon "Mở đánh giá" ở cả Table Row và Detail Actions hiển thị ngay khi `teacher` được gán, bỏ qua kiểm tra trạng thái ca test có đang là `started_assessment` hay không. | ⚠️ **Gap giao diện:** Cần bổ sung điều kiện `booking.status === 'started_assessment'` trước khi hiển thị nút "Mở đánh giá". |

---

## 2. Khoảng cách kỹ thuật giữa V1 (chạy thật) và V2 (đang phát triển)

Hiện tại, tuyến đường chính `/app/booking_test` đang tải màn hình **V1** (`src/components/screens/booking-test/BookingTestScreen.tsx`). Bản V1 này có các hạn chế lớn so với V2:
1. **Thiếu tính năng đặt lịch test (Tạo mới):** Hoàn toàn không có Dialog và Action tạo lịch.
2. **Khóa cứng tab Toán:** Nút segmented control môn Toán bị disable cứng (`disabled: subject === 'math'`).
3. **Giao diện cũ:** Không tích hợp các bảng nổi gia đình, cách tổ chức layout chưa tối ưu như V2.

**Khuyến nghị:** Cần chuyển đổi router bypass trong `src/app/(dashboard)/app/[menuId]/page.tsx` để đưa bản V2 lên thay thế hoàn toàn bản V1 tại tuyến `/app/booking_test`.

---

## 3. Các Quyết định & Đề xuất Kế hoạch Hành động (Action Plan)

Để giải quyết triệt để 6 khoảng trống (Gaps) lớn về nghiệp vụ và giao diện nêu trên, lập trình viên cần triển khai các bước sau trên bản **V2**:

### Bước 1: Khóa cứng thời lượng 30 phút
Trong [BookingTestCreateDialog.tsx](../../../src/components/screens/booking-test-v2/BookingTestCreateDialog.tsx):
- Sửa trường "Loại ca test" thành disabled (hoặc thay thế dropdown bằng một nhãn Text tĩnh) hiển thị cố định "30 phút". Set mặc định `testDuration: "30 phút"`.

### Bước 2: Thêm Validation chặn học sinh có lịch trùng chưa hoàn tất
Trong [useBookingTestActions.ts](../../../src/components/screens/booking-test-v2/useBookingTestActions.ts) -> `submitCreate`:
- Thực hiện kiểm tra:
  ```typescript
  const hasIncompleteBooking = deps.bookings.some(
    (b) =>
      b.studentId === f.studentId &&
      !['completed', 'failed', 'cancelled'].includes(b.status)
  )
  if (hasIncompleteBooking) {
    toast.error("Học viên này đang có một ca đánh giá chưa hoàn thành. Không thể tạo lịch test mới!")
    return
  }
  ```

### Bước 3: Ẩn Speaking Score đối với môn Toán
- Trong [BookingTestTableRow.tsx](../../../src/components/screens/booking-test-v2/BookingTestTableRow.tsx) (cột `Speaking`):
  ```typescript
  <TableCell>
    {booking.subject === 'english' ? (
      <SpeakingScore result={booking.testResult} compact />
    ) : (
      <span className="text-muted-foreground">-</span>
    )}
  </TableCell>
  ```
- Trong [BookingTestDetailDialog.tsx](../../../src/components/screens/booking-test-v2/BookingTestDetailDialog.tsx) (khối `SpeakingScore`):
  ```typescript
  <div className="grid gap-4 sm:grid-cols-2">
    {booking.subject === 'english' && <SpeakingScore result={booking.testResult} />}
    <LwrScore result={booking.testResult} />
  </div>
  ```

### Bước 4: Giới hạn hiển thị nút "Mở đánh giá" đúng trạng thái
- Trong [BookingTestTableRow.tsx](../../../src/components/screens/booking-test-v2/BookingTestTableRow.tsx) (phần nút hover nhanh):
  ```typescript
  {booking.subject === 'english' && booking.teacher?.trim() && booking.status === 'started_assessment' && (
    <Button ...>
      <FileText className="h-4 w-4 text-primary" />
    </Button>
  )}
  ```
- Trong [BookingTestDetailActions.tsx](../../../src/components/screens/booking-test-v2/BookingTestDetailActions.tsx):
  ```typescript
  {booking.subject === 'english' && booking.teacher?.trim() && booking.status === 'started_assessment' && (
    <Button onClick={() => onOpenAssessment(booking.id)}>
      Mở đánh giá
    </Button>
  )}
  ```

### Bước 5: Truyền đầy đủ tham số kiểm tra trùng lịch giáo viên trên danh sách
Trong [BookingTestTableRow.tsx](../../../src/components/screens/booking-test-v2/BookingTestTableRow.tsx) (Dialog chọn nhanh GV):
- Bổ sung các props:
  ```typescript
  <BookingTestEmployeePickerDialog
    open={teacherPickerOpen}
    employees={branchEmployees}
    branchName={branchName}
    selectedName={booking.teacher}
    bookings={bookings} // Cần bổ sung prop này (nhớ nhận từ Table và truyền xuống)
    bookingTime={booking.testTime} // Cần bổ sung prop này
    currentBookingId={booking.id} // Cần bổ sung prop này
    onOpenChange={setTeacherPickerOpen}
    onSelect={...}
  />
  ```

### Bước 6: Phân quyền hiển thị dữ liệu theo Giáo viên đăng nhập
Trong [useBookingTestData.ts](../../../src/components/screens/booking-test-v2/useBookingTestData.ts):
- Nhận thông tin `user` (hoặc `userName` và `userRole` truyền vào từ Screen component):
  ```typescript
  // Trong hàm lọc bookings:
  if (userRole === 'teacher' && booking.teacher !== userName) {
    return false
  }
  ```
- Việc này giúp Giáo viên đăng nhập chỉ thấy các ca test được phân công cho mình, đúng theo yêu cầu bảo mật thông tin.
