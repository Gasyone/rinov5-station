# Business Function Catalog — RinoEdu (Rinov4)

> Tài liệu cơ sở cho toàn bộ quá trình phát triển hệ thống RinoEdu.
> Được cấu trúc lại theo chuẩn ngành Quản lý Giáo dục (EdTech/EA).
> Cập nhật lần cuối: 2026-05-16

## Quy ước

| Khái niệm | Viết tắt | Mô tả |
|-----------|----------|-------|
| Business Function | BF | Nghiệp vụ kinh doanh (Luồng End-to-End) |
| User Story | US | Câu chuyện người dùng — hành vi cụ thể trong BF |
| Master Flow | FLOW | Luồng tổng quát xuyên suốt nhiều BF |

## Tổng quan

- **Tổng số BFs (E2E):** 39 BFs
- **Tổng số Năng lực (Capabilities):** 11
- **Mô hình tiếp cận:** Quản trị theo vòng đời nghiệp vụ (Lifecycle), chia thành 3 lớp kiến trúc (Core, Support, Governance).

---

## Business Capabilities (11 Năng lực Nghiệp vụ chuẩn)

Hệ thống được chia thành 3 phân lớp (Layers) như sau:

### Layer 1: Core Educational Capabilities (Giá trị lõi)
- [CAP-ACD: Học thuật & Đào tạo (Academic Management)](./CAP-ACD-academic-management.md)
- [CAP-ADM: Quản lý Tuyển sinh (Admissions Management)](./CAP-ADM-admissions-management.md)
- [CAP-COM: Thương mại & Bán hàng (Commerce & Sales)](./CAP-COM-commerce.md)
- [CAP-OPS: Quản lý học viên & Vận hành lớp (SIS & Class Operations)](./CAP-OPS-class-operations.md)
- [CAP-CARE: Chăm sóc học viên (Student Care & Retention)](./CAP-CARE-student-care.md)

### Layer 2: Supporting Capabilities (Khối hỗ trợ)
- [CAP-FIN: Quản trị Tài chính (Financial Management)](./CAP-FIN-financial-management.md)
- [CAP-HR: Tổ chức & Nhân sự (HR & Organization)](./CAP-HR-human-resources.md)
- [CAP-FCM: Quản lý Cơ sở vật chất (Facility Management)](./CAP-FCM-facility-management.md)

### Layer 3: Governance & Management (Khối quản trị)
- [CAP-SYS: Quản trị Hệ thống (System & Identity Governance)](./CAP-SYS-system-governance.md)
- [CAP-MDM: Dữ liệu Gốc (Master Data Management)](./CAP-MDM-master-data.md)
- [CAP-RPT: Báo cáo & Phân tích (Reporting & Analytics)](./CAP-RPT-reporting-analytics.md)

---

## Danh mục Business Functions theo Capability

*(Chi tiết định nghĩa từng BF nằm trong các file CAP tương ứng)*

### 1. Học thuật & Đào tạo (`CAP-ACD`)
- `BF-ACD-01`: Quản lý Chương trình đào tạo (Program Management)
- `BF-ACD-02`: Lộ trình học (Learning Path)
- `BF-ACD-03`: Khung chương trình (Syllabus)
- `BF-ACD-04`: Thành phần bài học (Lesson Components)
- `BF-ACD-05`: Nhóm kỹ năng (Skill Category)
- `BF-ACD-06`: Giáo trình (Curriculum)
- `BF-ACD-07`: Thiết lập học thuật (Academic Settings)
- `BF-QA-01`: Đánh giá chất lượng giảng dạy (Academic QC)

### 2. Quản lý Tuyển sinh (`CAP-ADM`)
- `BF-CRM-01`: Lead Generation & Qualification (✅ Chuẩn vàng)
- `BF-CRM-02`: Sales Pipeline & Opportunity Mgt (✅ Chuẩn vàng)
- `BF-ENR-01`: Assessment Booking & Execution (✅ Chuẩn vàng)
- `BF-ENR-02`: Trial Booking & Execution (✅ Chuẩn vàng)
- `BF-ENR-03`: Quản lý sự kiện tuyển sinh (✅ Chuẩn vàng)
- `BF-SAL-03`: Đánh giá năng lực

### 3. Thương mại & Bán hàng (`CAP-COM`)
- `BF-PRD-01`: Product & Bundle Strategy (✅ Chuẩn vàng)
- `BF-SAL-01`: Order Creation & Fulfillment (✅ Chuẩn vàng)

### 4. Vận hành Lớp & Học viên (`CAP-OPS`)
- `BF-OPS-02`: Class Scheduling & Conflict Resolution (✅ Đã chuẩn hóa)
- `BF-OPS-03`: Class Delivery Lifecycle (✅ Đã chuẩn hóa)
- `BF-CLS-01`: Xếp lớp (✅ Đã chuẩn hóa)
- `BF-CLS-02`: Quản lý Lớp học (✅ Đã chuẩn hóa)
- `BF-CLS-03`: Quản lý Học viên (✅ Đã chuẩn hóa)
- `BF-CLS-04`: Quản lý Giáo viên chủ nhiệm (✅ Đã chuẩn hóa)
- `BF-CLS-05`: Điểm danh & Nhận xét (✅ Đã chuẩn hóa)
- `BF-CLS-06`: Nghỉ học, Bảo lưu, Chuyển lớp (✅ Đã chuẩn hóa)

### 5. Chăm sóc học viên (`CAP-CARE`)
- `BF-CARE-01`: Student Care & Ticket Lifecycle (✅ Chuẩn vàng)
- `BF-CARE-02`: Renewal & Retention Campaign (✅ Chuẩn vàng)

### 6. Quản trị Tài chính (`CAP-FIN`)
- `BF-SAL-02`: Payment, Receipt & Revenue Management

### 7. Tổ chức & Nhân sự (`CAP-HR`)
- `BF-ORG-01`: Branch Setup & Opening Process (✅ Chuẩn vàng)
- `BF-ORG-02`: Organization Structure Governance (✅ Chuẩn vàng)
- `BF-HR-01`: Staff Onboarding & Offboarding Lifecycle (✅ Đã có US)
- `BF-HR-02`: Staff Availability & Work Registration (✅ Đã chuẩn hóa)

### 8. Cơ sở vật chất (`CAP-FCM`)
- `BF-QA-02`: Facility Maintenance & Checklist

### 9. Quản trị Hệ thống (`CAP-SYS`)
- `BF-SYS-01`: Access Control Lifecycle (✅ Đã có US)
- `BF-SYS-02`: Platform Configuration Governance
- `BF-SYS-03`: Device Provisioning Lifecycle

### 10. Dữ liệu Gốc (`CAP-MDM`)
- `BF-PRF-01`: Individual Master Profile Lifecycle
- `BF-PRF-02`: Family Profile Lifecycle
- `BF-PRF-03`: Corporate/B2B Client Lifecycle

### 11. Báo cáo & Phân tích (`CAP-RPT`)
- `BF-RPT-01`: Executive Reporting & Analytics

---

## Luồng nghiệp vụ tổng thể (Master Flows)
- [FLOW-ENR-00: Luồng Tuyển sinh (Lead to Student)](./FLOW-ENR-00-vong-doi-tuyen-sinh.md)
- [FLOW-ENR-01: Vòng đời Booking Test](./FLOW-ENR-01-booking-test.md)
- [FLOW-ENR-02: Học thử ghép buổi](./FLOW-ENR-02-hoc-thu-ghep-buoi.md)
- [FLOW-OPS-00: Vòng đời Lớp học (Class Lifecycle)](./FLOW-OPS-00-vong-doi-lop-hoc.md)
- [FLOW-OPS-01: Vòng đời Buổi học (Session Lifecycle)](./FLOW-OPS-01-vong-doi-buoi-hoc.md)
