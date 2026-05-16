# FLOW-ENR-00: Vòng đời Tuyển sinh (Enrollment Lifecycle)

> **Loại Sơ đồ:** Master Flow (Luồng tổng quan xuyên suốt)
> **Mục đích:** Mô tả hành trình end-to-end của một Khách hàng tiềm năng (Lead) đi qua các phân hệ CRM, Vận hành và Bán hàng để trở thành Học viên chính thức.

---

## Sơ đồ luồng nghiệp vụ (Business Flow)

```mermaid
graph TD
    %% Định nghĩa các bước và màu sắc cho từng phòng ban
    classDef crm fill:#e0f2fe,stroke:#0284c7,stroke-width:2px;
    classDef ops fill:#dcfce7,stroke:#16a34a,stroke-width:2px;
    classDef sales fill:#fef08a,stroke:#ca8a04,stroke-width:2px;

    %% CRM Phase
    Start((Khách hàng mới)) -->|Nhập liệu / Import| L1[BF-CRM-01: Quản lý khách hàng]
    L1:::crm -->|Sale tư vấn| L2{Hành động tiếp theo}
    
    %% Enrollment Phase (Test & Interview)
    L2 -->|Đặt lịch kiểm tra| E1[BF-ENR-01: Booking Test]
    L2 -->|Đặt lịch học thử| E2[BF-ENR-02: Trial Class]
    L2 -->|Chốt sale luôn| S2
    
    E1:::ops -->|Thực thi trên iPad| E3_Test(Bài test LWR/Toán)
    E1:::ops -->|Phỏng vấn trực tiếp| E3_Interview(Giáo viên chấm Speaking)
    
    E3_Test --> E4{Tổng hợp điểm}
    E3_Interview --> E4
    
    E4 -->|Tạo tự động| E5[Link Báo cáo Tổng thể]
    E5 -->|Gửi kết quả về Sale| S1[BF-SAL-03: Đánh giá năng lực]
    
    E2:::ops -->|Học sinh tham gia lớp| E2_1(Giáo viên nhận xét)
    E2_1 -->|Đánh giá sau học thử| S1
    
    %% Sales Phase
    S1:::sales -->|Tư vấn lộ trình, Combo| S2[BF-SAL-01: Đơn hàng]
    S2:::sales -->|Phụ huynh thanh toán| S3[BF-SAL-02: Phiếu thu]
    S3:::sales --> End((Thành Học viên chính thức))

    %% Phân luồng dữ liệu
    subgraph Giai đoạn 1: CRM & Tiếp cận
        L1
    end
    
    subgraph Giai đoạn 2: Vận hành Trải nghiệm
        E1
        E1_1
        E2
        E2_1
    end
    
    subgraph Giai đoạn 3: Chốt Sales
        S1
        S2
        S3
    end
```

## Danh sách Business Functions liên quan
Sơ đồ trên kết nối trực tiếp các nghiệp vụ sau:
1. **[BF-CRM-01](../business-functions/BF-CRM-01-quan-ly-khach-hang.md):** Khởi tạo và lưu trữ hồ sơ Lead.
2. **[BF-ENR-01](../business-functions/BF-ENR-01-booking-test.md):** Điều phối ca test, thiết bị iPad và nhân sự coi thi.
3. **[BF-ENR-02](../business-functions/BF-ENR-02-hoc-thu.md):** Cho học sinh vào lớp học thật để trải nghiệm.
4. **[BF-SAL-03](../business-functions/BF-SAL-03-danh-gia-nang-luc.md):** Sale phân tích điểm số/nhận xét để chốt lộ trình.
5. **[BF-SAL-01](../business-functions/BF-SAL-01-don-hang.md) & [BF-SAL-02](../business-functions/BF-SAL-02-phieu-thu.md):** Tạo giao dịch tài chính.
