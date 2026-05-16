# US-BT05: Thực thi bài test trên iPad và Đồng bộ kết quả

## Lịch sử phiên bản (Revision History)
| Version | Ngày cập nhật | Người cập nhật | Nội dung thay đổi |
|---------|---------------|----------------|-------------------|
| v1.0    | 2026-05-15    | System/AI      | Khởi tạo tài liệu, định nghĩa luồng kết nối với iPad và đồng bộ kết quả. |

---## 1. User Story

**Là một** nhân viên Vận hành / Giáo viên,
**tôi muốn** hệ thống tự động đẩy thông tin bài test sang ứng dụng iPad sau khi booking được tạo,
**để** học sinh có thể thực hiện bài test kỹ năng (Math/English) trực tiếp trên thiết bị, và kết quả được tự động cập nhật về bảng quản lý mà không cần nhập liệu thủ công.

---

## 2. Luồng kỹ thuật đồng bộ (Sync Flow)

Sơ đồ dưới đây mô tả cách hệ thống bắt tay (handshake) với thiết bị iPad để xử lý bài test:

```mermaid
sequenceDiagram
    participant S as Server (Rinov4)
    participant D as Device Service
    participant I as iPad App
    
    S->>D: Push `NEW_TEST_SESSION` (bookingId)
    D->>I: Sync to Branch Devices
    Note over I: Học sinh nhập ID / Mã PIN
    I->>S: Validate Student & Fetch Test (program, level)
    S-->>I: Return Test Data
    Note over I: Học sinh làm bài (Local state)
    I->>S: Submit Test Payload (rawScore, details)
    S->>S: Calculate & Update Booking Status
    S-->>I: Success ACK
```

1.  **Kích hoạt:** Nhân viên tạo Booking Test thành công (US-BT02) hoặc chuyển trạng thái sang "Assessing" (US-BT01/BT03).
2.  **Đồng bộ sang iPad:** Hệ thống tạo một "Test Session" gửi sang Device Service. iPad tại chi nhánh tương ứng sẽ hiển thị học viên trong danh sách "Đợi làm bài".
3.  **Thực thi (Student side):**
    *   Học sinh nhận iPad, chọn tên/mã học viên hoặc nhập OTP để bắt đầu.
    *   Học sinh thực hiện bài test (Math hoặc English LWR).
4.  **Kết quả:**
    *   Sau khi nhấn "Nộp bài", kết quả (điểm số, số câu đúng/sai) được gửi về API Rinov4.
    *   Hệ thống cập nhật trực tiếp vào bản ghi Booking Test:
        *   Môn English: Cập nhật vào phần LWR (Listening, Writing, Reading).
        *   Môn Math: Cập nhật vào điểm tổng và kết quả chi tiết.
    *   Trạng thái booking tự động chuyển sang "Tested" hoặc "Completed" (tùy cấu hình).

---

## 3. Mô tả chi tiết

### 3.1. Tương tác với Thiết bị (iPad App Integration)

| Thành phần | Hành động | Mô tả |
|------------|-----------|-------|
| **Device Sync** | Push event | Khi Booking được tạo, server gửi tín hiệu `NEW_TEST_SESSION` đến các thiết bị thuộc `branchId` của booking. |
| **Check-in iPad** | Xác thực | Học sinh có thể bắt đầu bài test bằng cách: (1) Chọn tên từ danh sách đợi, hoặc (2) Quét mã QR trên phiếu booking, hoặc (3) Nhập mã ID. |
| **Test Engine** | Thực thi | Ứng dụng iPad tải nội dung bài test dựa trên `programId` và `level` được chỉ định trong booking. |

### 3.2. Cấu trúc kết quả trả về (Payload)

| Trường dữ liệu | Loại | Mô tả |
|----------------|------|-------|
| `bookingId` | UUID | Định danh booking để cập nhật đúng bản ghi. |
| `subject` | String | `math` hoặc `english`. |
| `rawScore` | Number | Tổng điểm đạt được. |
| `maxScore` | Number | Tổng điểm tối đa của bài test. |
| `details` | JSON | Chi tiết điểm theo từng phần (vd: L: 8, W: 7, R: 9). |
| `completedAt` | Timestamp | Thời điểm học sinh nộp bài. |
| `status` | String | Thường trả về `completed` sau khi nộp thành công. |

---

## 4. Quy tắc nghiệp vụ (Business Rules)

*   **Ràng buộc thời gian:** Nếu bài test có giới hạn thời gian, ứng dụng iPad phải tự động nộp bài khi hết giờ và gửi kết quả hiện tại về hệ thống.
*   **Xử lý ghi đè:** Nếu kết quả đã tồn tại (do làm lại hoặc nhập tay), hệ thống sẽ lưu phiên bản mới nhất và giữ lại lịch sử (audit log).
*   **Trạng thái bảng quản lý:** Ngay khi nhận được tín hiệu "Đã nộp bài" từ iPad, cột "LWR" (đối với English) hoặc "Score" (đối với Math) trên màn hình `booking_test` phải hiển thị điểm số mới nhất.

---

## 5. Corner Cases

| # | Case | Hành vi mong đợi |
|---|------|-------------------|
| 5.1 | Mất kết nối mạng khi đang làm bài | iPad lưu kết quả tạm thời (Local Storage). Khi có mạng lại, tự động retry gửi kết quả về Rinov4. |
| 5.2 | Học sinh thoát ứng dụng giữa chừng | Nếu mở lại trong thời gian cho phép, học sinh làm tiếp. Nếu quá thời gian, tính kết quả đến thời điểm thoát. |
| 5.3 | Booking bị hủy trên dashboard khi đang test | iPad nhận tín hiệu `CANCEL_SESSION` và hiển thị thông báo dừng bài test. |
| 5.4 | Sai lệch Version bài test | Nếu iPad đang dùng version cũ, hệ thống từ chối nhận kết quả và yêu cầu cập nhật app/content. |

---

## 6. Acceptance Criteria

- [ ] Khi tạo booking thành công, hệ thống gửi thông tin đến thiết bị tại chi nhánh tương ứng.
- [ ] Ứng dụng iPad hiển thị đúng danh sách học viên đang đợi làm bài của chi nhánh đó.
- [ ] Học sinh có thể bắt đầu bài test bằng mã ID hoặc chọn tên.
- [ ] Bài test Math: Sau khi hoàn thành, điểm tổng được cập nhật về cột "Kết quả" trên dashboard.
- [ ] Bài test English: Sau khi hoàn thành, điểm LWR được cập nhật vào đúng các cột thành phần trong Assessment Path.
- [ ] Trạng thái trên dashboard tự động chuyển sang "Tested" ngay sau khi nhận kết quả.
- [ ] Có cơ chế retry nếu việc gửi kết quả từ iPad về server bị thất bại do lỗi mạng.
- [ ] Audit log ghi lại thời điểm nhận kết quả từ thiết bị nào (Device ID).
