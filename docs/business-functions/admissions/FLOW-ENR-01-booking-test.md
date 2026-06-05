# FLOW-ENR-01: Vòng đời Đặt lịch đánh giá (Đặt lịch đánh giá Lifecycle)

## 1. Bối cảnh Nghiệp vụ (Context)

Luồng chi tiết mô tả hành trình đầy đủ của một **Lịch kiểm tra đầu vào (Đặt lịch đánh giá)** — từ lúc nhân viên tư vấn đặt lịch, phân bổ giáo viên, học viên làm bài trên thiết bị, giáo viên phỏng vấn trực tiếp, đến khi hệ thống tổng hợp kết quả và trả báo cáo năng lực.

> **Nghiệp vụ gốc (BF):** `BF-ENR-01`
> **Kích hoạt bởi:** Nhân viên tư vấn tạo lịch hẹn kiểm tra cho khách hàng tiềm năng.
> **Kết thúc khi:** Hệ thống sinh xong báo cáo năng lực tổng thể (Report Link) để nhân viên tư vấn sử dụng.

## 2. Đối tượng và Hệ thống tham gia

*   **Nhân viên Tư vấn (Tư vấn viên):** Tạo lịch hẹn test từ CRM (không có bước chọn giáo viên), nhận kết quả phỏng vấn Nói và LWR để tư vấn chốt lộ trình học.
*   **Giáo viên (Teacher):** Được phân công phụ trách phỏng vấn (Speaking), chấm điểm trực tiếp trên hệ thống.
*   **Quản lý / Giáo vụ:** Phân bổ giáo viên cho ca đánh giá khi chưa có sẵn.
*   **Học viên:** Thực hiện bài test trên thiết bị tại cơ sở.
*   **Hệ thống tự động:** Đồng bộ đề đánh giá xuống thiết bị, thu thập điểm, tổng hợp kết quả và sinh báo cáo.

## 3. Sơ đồ Luồng nghiệp vụ

```mermaid
graph TD
    %% Định nghĩa các nhóm màu sắc cho phòng ban/hệ thống
    classDef crm fill:#e0f2fe,stroke:#0284c7,stroke-width:2px;
    classDef ops fill:#dcfce7,stroke:#16a34a,stroke-width:2px;
    classDef test fill:#f3e8ff,stroke:#9333ea,stroke-width:2px;

    A[Hồ sơ Học viên tiềm năng trong hệ thống quản lý khách hàng]:::crm -->|Đẩy ca test từ CRM sang ERP (mặc định chưa chọn giáo viên)| C[Đặt lịch: Chờ phân bổ Giáo viên]:::ops

    %% Phân bổ giáo viên
    C -->|US-BT01 hoặc US-BT03: Gán Giáo viên phụ trách| D[Đặt lịch: Đã có Giáo viên phụ trách]:::ops
    D -->|US-BT03: Đổi Giáo viên phụ trách| D


    %% Check-in và Chuyển trạng thái Đang triển khai
    D -->|Check-in thủ công: Xác nhận trên hệ thống| D_Checkin[Đặt lịch: Đã check-in]:::ops
    D -->|Tự động Check-in: Bắt đầu làm bài hoặc phỏng vấn| D_Checkin

    D_Checkin -->|Trạng thái: Đang triển khai| E{Thực thi ca test}:::ops

    %% Cho phép học sinh làm bài test độc lập ngay cả khi chưa check-in trên hệ thống
    D -->|Học sinh bắt đầu làm bài trên máy tính bảng| G_Test[Máy tính bảng: Làm bài Nghe-Đọc-Viết]:::test

    E --> G_Test
    E --> G_Inter[Giáo viên: Phỏng vấn Nói]:::test

    %% Tổng hợp
    G_Test -->|Gửi điểm Nghe-Đọc-Viết từ hệ thống học tập| H{Hệ thống tổng hợp điểm}:::ops
    G_Inter -->|US-BT04: Giáo viên nhập điểm Nói| H

    H -->|Hoàn thành các điểm thành phần| I[Tự động tạo Báo cáo năng lực tổng hợp]:::ops

    %% Trả kết quả
    I -->|Chuyển trạng thái: Hoàn thành| J[Tư vấn viên nhận thông báo & Báo cáo để tư vấn]:::crm

```

## 4. Diễn giải các bước

1.  **Giai đoạn Khởi tạo:** Lịch hẹn đánh giá năng lực đầu vào được đẩy tự động theo thời gian thực từ hệ thống quản lý khách hàng sang hệ thống ERP. Do CRM chưa hỗ trợ tính năng chọn giáo viên, tất cả ca đặt lịch thi mới đồng bộ sang đều ở trạng thái ban đầu là chưa chọn giáo viên (Chờ phân bổ Giáo viên).

2.  **Giai đoạn Chuẩn bị:** Quản lý hoặc Giáo vụ phân bổ giáo viên cho ca đánh giá. Có thể đổi giáo viên linh hoạt nếu có phát sinh.
3.  **Giai đoạn Đánh giá (Thực thi):**
    - **Cơ chế Check-in:** Học sinh đến chi nhánh có thể làm bài ngay trên máy tính bảng mà không bị chặn bởi bước xác nhận check-in trên hệ thống. Nhân sự chi nhánh có thể bấm xác nhận check-in thủ công trên hệ thống. Khi học sinh bắt đầu làm bài hoặc khi giáo viên mở màn hình phỏng vấn Nói, hệ thống sẽ tự động check-in và chuyển trạng thái lịch sang "Đang triển khai".
    - **Thực thi hai phần song song hoặc tuần tự:**
      - *Phần tự động:* Học sinh làm bài Nghe - Viết - Đọc (LWR) trên máy tính bảng.
      - *Phần thủ công:* Giáo viên phỏng vấn trực tiếp (Speaking), chấm điểm Nói và nhận xét trên hệ thống.

4.  **Giai đoạn Trả kết quả:** Hệ thống thu thập đủ các điểm thành phần, tự động tổng hợp theo trọng số và xuất ra một Báo cáo Năng lực duy nhất. Nhân viên tư vấn sẽ dùng báo cáo này để tư vấn khách hàng.

## 5. Xử lý Rẽ nhánh / Ngoại lệ

*   **Khách hàng không đến (Vắng mặt):** Nếu đến cuối ngày mà lịch hẹn vẫn ở trạng thái "Đã đặt lịch", hệ thống tự động quét và chuyển sang trạng thái "Không đạt".
*   **Khách hàng hủy lịch:** Nhân viên tư vấn hoặc Quản lý chuyển trạng thái thành "Đã hủy" tại bất kỳ thời điểm nào trước khi hoàn thành.
*   **Học sinh làm bài trước khi xác nhận trên hệ thống:** Hệ thống vẫn tiếp nhận bài thi và ghi nhận điểm số bình thường, đồng thời tự động cập nhật trạng thái check-in của học sinh sang "Đã check-in" và trạng thái ca đánh giá sang "Đang triển khai".
*   **Thiết bị mất kết nối khi đang làm bài:** Hệ thống lưu trữ tạm kết quả trên thiết bị. Khi có kết nối lại, tự động gửi kết quả về hệ thống chính.
*   **Giáo viên nghỉ đột xuất:** Quản lý đổi giáo viên phụ trách thông qua màn hình chi tiết lịch hẹn (US-BT03) mà không cần hủy lịch.
*   **Chỉ có một phần kết quả (Tiếng Anh):** Hai kênh đánh giá (LWR và Speaking) hoạt động độc lập. Một phần có kết quả trước vẫn được ghi nhận, phần còn lại hiển thị "chưa có" cho đến khi hoàn thành.
*   **Chưa phân công giáo viên môn Tiếng Anh:** Nếu ca test Tiếng Anh chưa được phân công giáo viên phụ trách, nút mở chấm điểm Speaking (Mở đánh giá) sẽ bị ẩn khỏi mọi góc nhìn của nhân viên trên giao diện danh sách và chi tiết. Ngay sau khi được gán giáo viên phụ trách, nút bấm này sẽ xuất hiện trở lại để tiếp tục tiến trình chấm điểm.
