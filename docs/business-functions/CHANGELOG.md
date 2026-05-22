# Lịch sử thay đổi Tài liệu Nghiệp vụ (Business Docs Changelog)

Tài liệu này ghi chú lại tất cả các thay đổi quan trọng đối với hệ thống tài liệu Business Functions (BF), User Stories (US), và Flows. 
Không ghi chú các thay đổi về Source Code (Dev) tại đây.

## [Unreleased] - 2026-05-22

### Removed (Xóa / Ngừng sử dụng)
- **~~`BF-CLS-01` (Xếp lớp)~~** — Không còn là BF riêng. Nghiệp vụ xếp lớp được hợp nhất vào `BF-CLS-03` (Quản lý Học viên) dưới dạng trạng thái "Chờ xếp lớp". Không còn menu màn hình `/app/class_assignment` — chức năng xếp lớp tích hợp vào `/app/students` với bộ lọc trạng thái.

### Added (Thêm mới)
- **[Navigation]** Tạo 2 nhóm menu mới: `group_class_management` (Quản lý lớp học) và `group_session_management` (Quản lý buổi học). Nhóm `group_operations` (Vận hành) được ẩn.
- **[BF-CLS-03]** Mở rộng BF-CLS-03: thêm trạng thái "Chờ xếp lớp" (`Cho_xep_lop`), quy tắc xếp lớp, và Smart Matching — tất cả từ BF-CLS-01 cũ.

### Changed (Thay đổi)
- **[US-CLS01-01]** Viết lại — không còn là màn hình 2 vùng riêng biệt. Trở thành bộ lọc trạng thái trong Quản lý Học viên (`/app/students`).
- **[US-CLS01-02]** Viết lại — trở thành hành động trong Chi tiết Lớp học (`/app/classes/[id]` > Tab Học viên).
- **[US-CLS01-03]** Viết lại — trở thành batch action trong Quản lý Học viên khi lọc "Chờ xếp lớp".
- **[CAP-OPS]** Cập nhật: BF-CLS-01 không còn trong danh sách BF.
- **[FLOW-OPS-00]** Giai đoạn 4 (Tuyển sinh vào lớp) → tham chiếu `BF-CLS-03` thay vì `BF-CLS-01`.
- **[CATALOG]** Cập nhật danh mục: BF-CLS-01 đã hợp nhất vào BF-CLS-03.
- **[BF-CLS-02]** Out of scope: xếp HV → tham chiếu BF-CLS-03.
- **[BF-ENR-02]** Out of scope: xếp lớp chính thức → tham chiếu BF-CLS-03.
- **[US-CLS03-01]** Hành động "Xếp lớp" → tham chiếu BF-CLS-03 thay vì BF-CLS-01.

### Decisions (Quyết định kiến trúc)
- **[Architecture]** Không tách "Xếp lớp" thành menu riêng. "Chờ xếp lớp" là trạng thái của Học viên, không phải thực thể độc lập. Người dùng thao tác trên `/app/students` với bộ lọc trạng thái, giảm độ phức tạp điều hướng.
- **[Architecture]** Vòng đời lớp học: 5 trạng thái chuẩn — `nhap`, `mo_chieu_sinh`, `dang_hoc`, `dong_lop`, `huy`. Mock data `classRecords.ts` và `classes.ts` đã chuẩn hóa theo.
- **[US-CLS02-01]** Chuẩn hóa đầy đủ: tab trạng thái trên cùng, BranchSelect + Search + Filter cùng hàng toolbar, 11 cột bảng, action theo trạng thái, phân trang 20/50/100.
- **[ClassesScreen]** Triển khai giao diện `/app/classes` theo US-CLS02-01: SegmentedControl, BranchSelect, Search, DataTable, ConfirmDialog cho xóa lớp.
- **[classesTypes / classesHelpers / ClassesTable / ClassDetailView]** Cập nhật toàn bộ sang dùng `classRecords.ts` với lifecycle statuses mới.

- **[ClassesScreen]** Viết lại toàn bộ theo pattern `BookingTestScreen`: `<StatusTiles>` + `<ExpandableSearch>` + `<BranchSelect>` + `<FilterIconButton>` cùng hàng toolbar + status tiles.
- **[Columns]** Gộp mã lớp vào tên lớp, thêm cột "Chương trình đào tạo", gộp phòng dưới chi nhánh, dồn ngày bắt đầu/kết thúc thành cột "Thời gian".
- **[Avatars]** Giáo viên chủ nhiệm dùng avatar + hover → mini profile. Giáo viên dạy thay hiển thị nhiều avatar (dashed border) với tooltip lý do thay.
- **[ScheduleSummary]** Lịch học hiển thị dạng badge "T2 18:00" giống booking_test, nhiều dòng nếu có nhiều buổi. Nút "+N" mở modal mở rộng.
- **[Mock data]** Thêm `scheduleSlots` và `substituteTeachers[]` vào `classRecords.ts`.

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
- **[BF-CLS-01]** Cập nhật Menu ID từ `class_enrollment, students` → `class_assignment`. Thêm tham chiếu US-CLS01-01. Cập nhật mô tả giao diện sang layout 2-panel.
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
