# Lịch sử thay đổi Tài liệu Nghiệp vụ (Business Docs Changelog)

Tài liệu này ghi chú lại tất cả các thay đổi quan trọng đối với hệ thống tài liệu Business Functions (BF), User Stories (US), và Flows. 
Không ghi chú các thay đổi về Source Code (Dev) tại đây.

## [Unreleased] - 2026-05-16

### Added (Thêm mới)
- **[FLOW]** Tạo mới `FLOW-OPS-00-vong-doi-lop-hoc.md` — Master Flow xâu chuỗi toàn bộ 9 BFs trong CAP-OPS từ Mở lớp → Xếp lịch → Sinh Session → Enroll HV → Điểm danh → Đóng lớp.
- **[US-CLS01-01]** Tạo mới `US-CLS01-01-quan-ly-danh-sach-hv-cho-xep-lop.md` — US chi tiết cho màn hình Xếp lớp (`class_assignment`), bao gồm layout 2-panel (HV chờ + Lớp còn chỗ), Smart Matching, Batch Actions, và đầy đủ Corner Cases + AC.
- **[US-ENR02-01]** Tạo mới `US-ENR02-01-quan-ly-lich-hoc-thu-ghep-buoi.md` — US chi tiết cho màn hình Học thử (`trial_class`) luồng Ghép buổi.

### Changed (Thay đổi)
- **[BF-CRM-01]** Nâng cấp lên bản "Chuẩn vàng", mapping với `crm.lead_contact_lifecycle_management` (Lead Generation & Directory).
- **[BF-CRM-02]** Nâng cấp lên bản "Chuẩn vàng", mapping với `crm.lead_contact_lifecycle_management` (Sales Pipeline & Follow-up).
- **[BF-ENR-03]** Nâng cấp lên bản "Chuẩn vàng" cho Event Management.
- **[BF-ORG-01]** Nâng cấp lên bản "Chuẩn vàng", mapping với `hr.branch_and_facility_setup` (Branch Setup).
- **[BF-ORG-02]** Nâng cấp lên bản "Chuẩn vàng", mapping với `hr.organization_structure` (Org Structure).
- **[BF-PRD-01]** Nâng cấp từ skeleton lên bản "Chuẩn vàng". Bổ sung Scope, Flow, Business Rules và Key Data cho phân hệ Quản lý Danh mục & Sản phẩm. Đề xuất danh sách US (US-PRD-01 đến US-PRD-04).
- **[BF-SAL-01]** Nâng cấp từ skeleton lên bản "Chuẩn vàng". Bổ sung Scope, Flow, Business Rules và Key Data cho phân hệ Quản lý Đơn hàng & Thanh toán. Đề xuất danh sách US (US-SAL-01 đến US-SAL-04).
- **[BF-CARE-01]** Nâng cấp từ skeleton lên bản "Chuẩn vàng". Bổ sung Scope, Flow (tạo và xử lý Care Ticket), Business Rules cho phân hệ Chăm sóc học viên (ngoại trừ Tái phí). Đề xuất danh sách US (US-CARE-01 đến US-CARE-04).
- **[BF-CARE-02]** Nâng cấp từ skeleton lên bản "Chuẩn vàng". Định nghĩa luồng quét học viên Expiring Soon, tạo Renewal Queue, và chuyển đổi tái phí. Đề xuất danh sách US (US-CARE-05 đến US-CARE-07).
- **[BF-CLS-05]** Rename file `BF-OPS-04-diem-danh.md` → `BF-CLS-05-diem-danh-nhan-xet.md` để thống nhất mã BF giữa tên file và nội dung.
- **[BF-OPS-01]** Chuẩn hóa format US-ID từ `US-WorkRegistration-0x` → `US-OPS01-0x` theo quy ước chung.
- **[BF-CLS-01]** Cập nhật Menu ID từ `class_enrollment, students` → `class_assignment`. Thêm tham chiếu US-CLS01-01. Cập nhật mô tả Frontend sang layout 2-panel.
- **[BF-ENR-02]** Biên tập lại BF Học thử (`trial_class`), định nghĩa rõ 2 mô hình Học thử: Ghép buổi (Trial Session) và Lớp riêng (Trial Class). Bổ sung Scope, Business Rules và Mermaid Flow.
- **[CATALOG]** Thêm tham chiếu `FLOW-OPS-00` vào danh sách Master Flows.

### Decisions (Quyết định kiến trúc)
- **[Architecture]** Tách màn hình HV theo chuẩn SIS: `class_assignment` (Placement/Waitlist), `students` (Active Roster), `group_care` (Care/Retention). Loại bỏ các trạng thái tài chính khỏi nhóm Vận hành.

## [Unreleased] - 2026-05-15

### Added (Thêm mới)
- **[FLOW]** Tạo mới thư mục `docs/flows/` và file Master Flow `FLOW-ENR-00-vong-doi-tuyen-sinh.md` để xâu chuỗi toàn bộ quy trình từ CRM -> Booking Test/Trial -> Đánh giá năng lực -> Chốt Sales.
- **[US-BT05]** Thêm mới tài liệu `US-BT05-thuc-thi-va-dong-bo-ket-qua-test-ipad.md` quy định luồng thực thi bài test trên iPad và đồng bộ kết quả về hệ thống Rinov4.
- Nhúng sơ đồ Mermaid mô tả luồng dữ liệu (Data Flow) trực tiếp vào file `US-BT05`.

### Changed (Thay đổi)
- **[CAP-OPS]** Chuẩn hóa toàn bộ cấu trúc định nghĩa Năng lực Vận hành Lớp học (CAP-OPS). Làm rõ khái niệm tách biệt giữa Lớp học (Class) và Buổi học (Session).
- **[BF-OPS]** Viết lại cấu trúc chuẩn cho nhóm Vận hành lịch (`BF-OPS-01`, `02`, `03`), tập trung vào Quỹ thời gian, Xếp lịch và Vòng đời Session.
- **[BF-CLS]** Viết lại cấu trúc chuẩn cho nhóm Lớp học (`BF-CLS-01` đến `06`), định nghĩa các luồng xếp lớp, quản lý sĩ số, điểm danh theo Session, báo nghỉ và bảo lưu.
- **[US-BT02]** Cập nhật tính năng Tạo mới Booking: Xác nhận 2 vị trí kích hoạt tạo booking (từ màn hình Vận hành chung và từ Tab Booking trong Chi tiết học viên).
- **[CATALOG]** Cập nhật `CATALOG.md` ghi nhận US-BT05 thuộc nghiệp vụ `BF-ENR-01` (Booking Test).
- **[BF-ENR-01]** Cập nhật danh sách User Stories tham chiếu trong file `BF-ENR-01-booking-test.md`.
