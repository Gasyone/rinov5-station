# FLOW-ENR-01: Vòng đời Booking Test (Booking Test Lifecycle)

> **Loại Sơ đồ:** Flow Nghiệp vụ chi tiết (Detailed Flow)
> **Nghiệp vụ (BF):** `BF-ENR-01`
> **Mục đích:** Mô tả chi tiết hành trình của một lịch kiểm tra đầu vào (Booking Test) từ lúc khởi tạo, phân bổ giáo viên, làm bài test trên iPad, phỏng vấn, đến khi trả kết quả tổng thể.

---

## Sơ đồ luồng nghiệp vụ chi tiết

```mermaid
graph TD
    %% Định nghĩa các nhóm màu sắc cho phòng ban/hệ thống
    classDef crm fill:#e0f2fe,stroke:#0284c7,stroke-width:2px;
    classDef ops fill:#dcfce7,stroke:#16a34a,stroke-width:2px;
    classDef test fill:#f3e8ff,stroke:#9333ea,stroke-width:2px;
    
    A[Hồ sơ Lead / Học viên trong CRM]:::crm -->|US-BT02: Tạo Booking Test| B{Đã chọn sẵn GV chưa?}:::ops
    
    %% Phân bổ giáo viên
    B -->|Chưa chọn| C[Booking: Chờ phân bổ GV]:::ops
    B -->|Đã chọn| D[Booking: Đã có GV phụ trách]:::ops
    
    C -->|US-BT03: Quản lý chọn GV| D
    D -->|US-BT03: Quản lý/Sale cần đổi người| C
    
    %% Chuyển trạng thái và làm test
    D -->|Click: Chuyển Đang đánh giá| E{Kiểm tra theo môn}:::ops
    
    E -->|Môn Toán| F_Test[iPad App: Làm bài test Toán]:::test
    E -->|Môn Tiếng Anh| G_Test[iPad App: Làm bài test LWR]:::test
    E -->|Môn Tiếng Anh| G_Inter[Giáo viên: Phỏng vấn Speaking]:::test
    
    %% Tổng hợp
    F_Test -->|Gửi raw score| H{Hệ thống tổng hợp điểm}:::ops
    G_Test -->|Gửi điểm LWR từ LMS| H
    G_Inter -->|US-BT04: GV nhập điểm Speaking| H
    
    H -->|Hoàn tất các điểm thành phần| I[Tự động tạo Link Báo cáo Tổng thể]:::ops
    
    %% Trả kết quả
    I -->|Chuyển trạng thái: Hoàn thành| J[Sale nhận thông báo & Link Báo cáo để tư vấn]:::crm
```

## Giải thích luồng
1. **Giai đoạn Đặt lịch:** Sale lấy thông tin Lead từ CRM để tạo Booking Test. Nếu có sẵn giáo viên trống giờ, Sale chọn luôn. Nếu chưa có, Booking sẽ ở trạng thái chờ Phân bổ.
2. **Giai đoạn Chuẩn bị:** Quản lý/Giáo vụ phân bổ giáo viên cho ca test.
3. **Giai đoạn Đánh giá (Execution):** 
   - Với môn Toán: Học sinh làm trắc nghiệm/tự luận trên iPad.
   - Với môn Tiếng Anh: Học sinh làm bài LWR (Listening, Writing, Reading) trên iPad + Giáo viên phỏng vấn trực tiếp (Speaking).
4. **Giai đoạn Trả kết quả:** Hệ thống thu thập đủ các điểm thành phần, tự động mix lại theo trọng số và xuất ra một Report Link duy nhất. Sale sẽ dùng Report này để tư vấn khách hàng.
