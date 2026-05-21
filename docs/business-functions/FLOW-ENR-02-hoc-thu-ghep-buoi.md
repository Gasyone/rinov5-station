---
id: FLOW-ENR-02
title: "Vòng đời Học thử Ghép buổi"
bf: BF-ENR-02
domain: CAP-ADM
status: draft
tags: [enrollment, trial, flow]
---

# FLOW-ENR-02: Vòng đời Học thử Ghép buổi (Trial Session Lifecycle)

> **Loại Sơ đồ:** Flow Nghiệp vụ chi tiết (Detailed Flow)
> **Nghiệp vụ (BF):** `BF-ENR-02`
> **Mục đích:** Mô tả chi tiết hành trình của một vé Học thử (Trial Booking) từ lúc Sale ghi nhận nhu cầu, Giáo vụ xếp lớp, đến khi Giáo viên dạy và trả kết quả.

---

## Sơ đồ luồng nghiệp vụ chi tiết

```mermaid
graph TD
    classDef crm fill:#e0f2fe,stroke:#0284c7,stroke-width:2px;
    classDef ops fill:#dcfce7,stroke:#16a34a,stroke-width:2px;
    classDef sale fill:#fef08a,stroke:#ca8a04,stroke-width:2px;

    A[Hồ sơ Lead từ CRM]:::crm --> B[US-ENR02-02: Sale ghi nhận Nhu cầu Học thử]:::sale
    B --> C[Trạng thái: Chờ ghép lớp]:::sale
    
    C --> D[US-ENR02-03: CSM/BM Tìm Lớp & Chọn các Buổi phù hợp]:::ops
    D --> E{Lớp/Buổi còn chỗ?}:::ops
    
    E -->|Không| C
    E -->|Có| F[Xác nhận ghép Lớp & Nhiều Buổi học]:::ops
    F --> G[Trạng thái: Đã xác nhận]:::sale
    
    G -->|Khách báo bận| H[US-ENR02-04: Đổi lịch / Hủy lịch]:::sale
    H --> C
    
    G -->|Tới ngày học| I[Giáo viên Điểm danh - BF-CLS-05]:::ops
    I -->|No-show| H
    I -->|Show| J[Hệ thống Lớp: GV Điền form nhận xét chung]:::ops
    
    J --> K[Hệ thống đồng bộ kết quả -> Trạng thái: Hoàn thành]:::sale
    K --> L[Trả kết quả & Sale follow-up]:::crm
```

## Giải thích luồng
1. **Giai đoạn Booking:** Sale tạo nhu cầu (Chờ ghép).
2. **Giai đoạn Sắp xếp:** CSM (Giáo vụ) tìm Lớp đang chạy và chọn một hoặc nhiều Buổi học (Multi-session) tương lai. Nếu Lớp/Buổi hết chỗ sẽ phải chờ. Nếu ghép thành công, Booking chuyển sang Đã xác nhận. Người phụ trách Booking sẽ được gán tự động thành Giáo viên của lớp/buổi học đó. Khách hàng được phép chọn tối đa 3 buổi học.
3. **Ngoại lệ:** Nếu Khách báo bận hoặc Giáo viên hủy buổi, Sale/CSM tiến hành Đổi/Hủy lịch. Việc đổi/hủy lịch có thể áp dụng cho từng buổi cụ thể hoặc toàn bộ Booking.
4. **Vận hành thực tế:** Đến ngày học, Giáo viên/Lễ tân dùng tính năng của Quản lý Lớp (`BF-CLS-05`) để điểm danh. Học sinh bắt buộc là `Show` (Có mặt) thì mới kích hoạt bước Nhận xét. Trường hợp Multi-session, Booking chỉ bị tính là `No-show` (Không đến) khi khách vắng mặt tất cả các buổi.
5. **Kết thúc:** Sau khi GV submit form đánh giá chung tại Hệ thống Vận hành Lớp (áp dụng sau buổi học cuối cùng đối với Multi-session), Booking Học thử tự động đồng bộ kết quả (Read-only) và chuyển trạng thái hoàn thành. Hệ thống trả Feedback Report về cho CRM để Sale dùng làm "vũ khí" tư vấn chốt khách.
