---
id: US-CAL-02-06
title: "Chi tiết buổi học - Cập nhật điểm danh học viên"
bf: BF-CAL-02
domain: CAP-ADM
persona: "PERSONA-BRANCH-MANAGER, PERSONA-CSM, PERSONA-TEACHER"
sr: "SR-CSM-001"
status: ready
tags: [class-session, attendance, update-attendance, session-detail, crm-permission, capability-gating]
---

# US-CAL-02-06: Chi tiết buổi học - Cập nhật điểm danh học viên (Session Detail - Update Student Attendance)

> **Tham chiếu:** `BF-CAL-02` (Quản lý Lịch học trung tâm) · `BF-CLS-05` (Quản lý Lớp học & Chi tiết buổi học) · `US-CAL-02-05` (Lịch học trung tâm) · `US-CLS05-08` (Chi tiết buổi học) · Tiêu chuẩn Thiết kế Giao diện §4.3 (Hộp thoại Chi tiết buổi học)  
> **Đường dẫn màn hình & Trạng thái liên quan:**  
> - `Lịch học trung tâm (/app/calendar_class_schedule)` -> Nhấp chọn thẻ buổi học -> Mở Hộp thoại Chi tiết buổi học -> Tab `Điểm danh`  
> - `Danh sách lớp học (/app/classes)` -> Mở Chi tiết lớp học -> Tab `Lịch trình` -> Nhấp chọn một buổi học -> Tab `Điểm danh`  
> - Trạng thái điểm danh: `Đã đến`, `Đến muộn`, `Vắng`  

---

## 1. NHẬT KÝ THAY ĐỔI & BỐI CẢNH (CHANGELOG & CONTEXT)

### Lịch sử cập nhật tài liệu (Changelog)

| Ngày cập nhật | Nội dung cập nhật | Lý do cập nhật |
|---|---|---|
| 28/10/2026 | Khởi tạo tài liệu đặc tả nghiệp vụ mới (Phiên bản 1.0) cho tính năng Cập nhật điểm danh học viên trong Hộp thoại Chi tiết buổi học; thiết lập phân quyền tập trung từ CRM dưới nhãn STATION với 2 quyền Xem và Cập nhật điểm danh; cơ chế kiểm soát giao diện theo quyền hạn (ẩn biểu tượng thao tác và chặn bật danh mục chọn khi không đủ quyền); bổ sung ràng buộc chỉ cho phép cập nhật các buổi học trong ngày hoặc đã diễn ra. | Đáp ứng nhu cầu điều chỉnh lại điểm danh chính xác khi học viên đến trễ hoặc có thay đổi thực tế sau khi buổi học đã được điểm danh ban đầu; bảo mật và kiểm soát quyền hạn chặt chẽ theo phân quyền CRM. |

### Bối cảnh & Vấn đề nghiệp vụ (Context & Problem)

* **Bối cảnh nghiệp vụ:** Trong quy trình vận hành đào tạo tại trung tâm, giáo viên hoặc giáo vụ thực hiện điểm danh học viên đầu giờ học. Tuy nhiên, trong thực tế thường xuyên phát sinh các tình huống thay đổi: học viên vào lớp muộn sau khi giáo viên đã điểm danh vắng, học viên xin phép ra về sớm, hoặc có sự nhầm lẫn giữa học viên học thử và học viên chính thức. Khi buổi học đã được điểm danh, người có thẩm quyền cần truy cập vào Hộp thoại Chi tiết buổi học (thông qua màn hình Lịch học trung tâm hoặc Chi tiết lớp học) để cập nhật lại trạng thái điểm danh cho từng học viên.
* **Cơ chế phân quyền tập trung từ CRM:**
  - Hệ thống CRM là trung tâm quản lý tài khoản và phân quyền người dùng toàn hệ thống.
  - Tại CRM, toàn bộ các quyền của phân hệ cơ sở được gom nhóm dưới nhãn danh mục cấp cao: **STATION**.
  - Dưới nhãn **STATION**, tại menu **Lịch học trung tâm** (`calendar_class_schedule`), tính năng **Chi tiết buổi học** (`session_detail`) được cấu hình 2 quyền nguyên tử độc lập:
    1. **Quyền Xem (`station.calendar_class_schedule.session_detail.view`):** Cho phép mở xem Hộp thoại Chi tiết buổi học, xem danh sách học viên, sĩ số lớp, thẻ trạng thái điểm danh hiện tại (`Đã đến`, `Đến muộn`, `Vắng`), đơn xin nghỉ phép và nhận xét học tập. Nếu không có quyền này, người dùng hoàn toàn bị chặn truy cập vào hộp thoại.
    2. **Quyền Cập nhật điểm danh (`station.calendar_class_schedule.session_detail.edit_attendance`):** Cho phép hiển thị nút biểu tượng cập nhật điểm danh (hình người kèm dấu kiểm) trên từng dòng học viên, kích hoạt danh mục thả xuống gồm 3 trạng thái (`Đã đến`, `Đến muộn`, `Vắng`) và ghi nhận trạng thái mới vào cơ sở dữ liệu điểm danh. **Nếu không được cấp hoặc bị gỡ bỏ quyền này:** Hệ thống **ẩn hoàn toàn biểu tượng cập nhật điểm danh** trên giao diện, chặn tuyệt đối không cho phép mở danh mục hoặc thay đổi trạng thái điểm danh của học viên.
* **Vấn đề giải quyết:**
  1. *Khắc phục sai lệch sĩ số thực tế:* Cho phép giáo vụ hoặc quản lý cơ sở sửa đổi điểm danh nhanh chóng ngay trên dòng học viên chỉ với 2 thao tác chạm, không cần tạo yêu cầu phức tạp.
  2. *Chặn sửa đổi trái quy định đối với buổi học tương lai:* Hệ thống tự động nhận diện mốc thời gian của buổi học. Nếu buổi học chưa diễn ra (buổi học tương lai trong lịch trình), tính năng cập nhật điểm danh bị vô hiệu hóa kèm thông báo nhắc nhở rõ ràng.
  3. *Tự động đồng bộ số liệu chuyên cần:* Khi một học viên được cập nhật trạng thái (ví dụ từ "Vắng" sang "Đã đến"), các thẻ đếm chỉ số có mặt, vắng, đến muộn trên đầu hộp thoại lập tức cập nhật lại theo thời gian thực.
* **Mục tiêu & Giá trị mang lại:**
  - Cung cấp công cụ cập nhật điểm danh linh hoạt, trực quan theo từng dòng học viên với menu nổi nhỏ gọn.
  - Đảm bảo tính toàn vẹn dữ liệu điểm danh thông qua cơ chế phân quyền tập trung chặt chẽ từ CRM.
  - Giúp số liệu chuyên cần của học viên tại cơ sở luôn chính xác tuyệt đối, làm căn cứ tính phí, bảo lưu và báo cáo học tập định kỳ.

### Hiểu người dùng & Tình huống sử dụng (User Needs & Use Cases)

* **Người dùng chính (Persona):**
  - Quản lý cơ sở (`PERSONA-BRANCH-MANAGER`): Kiểm tra và phê duyệt điều chỉnh điểm danh cho các trường hợp đặc biệt tại cơ sở.
  - Giáo vụ / Chăm sóc học viên (`PERSONA-CSM`): Cập nhật lại điểm danh cho học sinh đi muộn, học sinh học bù hoặc học sinh có đơn xin nghỉ phép đột xuất.
  - Giáo viên giảng dạy (`PERSONA-TEACHER`): Bổ sung điểm danh cho học sinh vào lớp muộn trong ca dạy của mình.
* **Nhu cầu thực tế (Needs):**
  - Cần cập nhật lại điểm danh cho học viên ngay trên danh sách buổi học mà không làm ảnh hưởng đến các thông tin học thuật khác.
  - Cần phân biệt rõ trạng thái hiện tại với các trạng thái có thể chọn để tránh bấm nhầm.
  - Cần biết lý do vì sao một buổi học không cho phép điểm danh (do lớp chưa diễn ra hay do không đủ quyền hạn).
* **Câu phát biểu nghiệp vụ:**
  - **Là một** Quản lý cơ sở hoặc Nhân viên giáo vụ có thẩm quyền, **tôi muốn** cập nhật lại trạng thái điểm danh cho học viên trong Hộp thoại Chi tiết buổi học, **để** phản ánh đúng tình hình chuyên cần thực tế của học viên và lưu trữ vào cơ sở dữ liệu điểm danh.

### Quy tắc nghiệp vụ (Business Rules)

1. **[RULE-ATT-01] Ràng buộc thời điểm cập nhật điểm danh:**
   - Hệ thống chỉ cho phép cập nhật điểm danh đối với các buổi học đang diễn ra trong ngày hoặc các buổi học trong quá khứ đã được điểm danh trước đó.
   - Đối với các buổi học trong tương lai (chưa đến ngày diễn ra), nút cập nhật điểm danh bị làm mờ và vô hiệu hóa. Khi người dùng nhấp vào, hệ thống hiển thị thông báo hướng dẫn: `"Lớp học chưa diễn ra. Chỉ các lớp diễn ra trong ngày mới được điểm danh."`.
   - Đối với các buổi học đã bị hủy hoặc vắng toàn bộ lớp, tính năng cập nhật điểm danh bị khóa hoàn toàn.
2. **[RULE-ATT-02] Danh mục trạng thái điểm danh chuẩn hóa:**
   - Hệ thống hỗ trợ 3 trạng thái điểm danh:
     1. `Đã đến` (biểu tượng dấu kiểm màu xanh lá tích cực kèm chấm tròn nhận diện).
     2. `Đến muộn` (chấm tròn màu cam hổ phách cảnh báo).
     3. `Vắng` (chấm tròn màu đỏ cảnh báo).
   - Trạng thái mà học viên đang mang sẽ hiển thị ở chế độ vô hiệu hóa trong danh mục chọn, ngăn người dùng chọn lại trạng thái trùng lặp.
3. **[RULE-ATT-03] Kiểm soát hiển thị và chặn truy cập theo quyền CRM:**
   - Tính năng cập nhật điểm danh chỉ khả dụng khi tài khoản người dùng được cấp quyền Cập nhật điểm danh (`station.calendar_class_schedule.session_detail.edit_attendance`).
   - Khi người dùng không có quyền hoặc bị thu hồi quyền: Biểu tượng cập nhật điểm danh bị **ẩn hoàn toàn** khỏi dòng học viên, người dùng chỉ xem được huy hiệu trạng thái tĩnh.
   - Nếu quyền bị thu hồi trong khi đang mở danh mục chọn trạng thái: Giao diện lập tức đóng danh mục, từ chối mọi yêu cầu ghi nhận dữ liệu và hiển thị thông báo cảnh báo thu hồi quyền.
4. **[RULE-ATT-04] Tự động cập nhật chỉ số chuyên cần:** Ngay sau khi chọn trạng thái điểm danh mới thành công, hệ thống tự động tính toán lại các số liệu tổng hợp chuyên cần trên đầu hộp thoại (Có mặt, Đến muộn, Vắng, Sĩ số) khớp chính xác theo danh sách dòng hiển thị.
5. **[RULE-ATT-05] Xử lý học viên có đơn xin nghỉ phép hợp lệ:** Học viên có đơn xin nghỉ phép được duyệt vẫn hiển thị vạch màu hổ phách và liên kết xem chi tiết đơn. Nếu người dùng cập nhật sang `Đã đến` hoặc `Đến muộn`, hệ thống ghi nhận trạng thái thực tế mới này vào cơ sở dữ liệu điểm danh mà không làm mất lịch sử đơn nghỉ phép.

### Ranh giới nghiệp vụ (Scope)

* **Phạm vi áp dụng:**
  - Tab `Điểm danh` bên trong Hộp thoại Chi tiết buổi học.
  - Áp dụng khi truy cập từ cả 2 phân hệ: `Lịch học trung tâm (/app/calendar_class_schedule)` và `Danh sách lớp học (/app/classes)`.
* **Phạm vi hiển thị thành phần cập nhật:**
  - Nút biểu tượng cập nhật điểm danh: Đặt tại cột thông tin học viên, nằm sát cạnh phải khối họ tên và nhãn đối tượng (Học thử / Mới). Biểu tượng hiển thị khi người dùng rê chuột vào dòng hoặc khi danh mục chọn đang mở.
  - Danh mục thả xuống (Dropdown menu): Khung nổi kích thước gọn gàng, hiển thị 3 lựa chọn trạng thái (`Đã đến`, `Đến muộn`, `Vắng`) với màu sắc chỉ thị trực quan.
  - Huy hiệu trạng thái điểm danh: Hiển thị tại cột điểm danh, tự động đổi màu và nội dung tương ứng ngay sau khi chọn.

---

## 2. LUỒNG XỬ LÝ CHÍNH (MAIN FLOW - HAPPY PATH)

```mermaid
sequenceDiagram
    autonumber
    actor U as Quản lý cơ sở / Giáo vụ
    participant F as Giao diện Chi tiết buổi học (Station)
    participant CRM as Hệ thống CRM (Phân quyền)
    participant S as Hệ thống Máy chủ Station
    participant DB as Cơ sở dữ liệu

    U->>F: Mở Hộp thoại Chi tiết buổi học (từ Lịch học hoặc Lớp học)
    F->>CRM: Xác thực quyền hạn người dùng (Nhãn STATION -> Lịch học trung tâm -> Chi tiết buổi học)
    CRM-->>F: Trả về trạng thái quyền Xem (view) và Cập nhật điểm danh (edit_attendance)

    alt Không có Quyền Cập nhật điểm danh (edit_attendance)
        F-->>U: Hiển thị giao diện chỉ đọc; Ẩn hoàn toàn biểu tượng nút cập nhật điểm danh
    else Có Quyền Cập nhật điểm danh (edit_attendance)
        F-->>U: Hiển thị đầy đủ danh sách học viên và biểu tượng nút cập nhật điểm danh
        
        U->>F: Rê chuột vào dòng học viên và nhấp biểu tượng cập nhật điểm danh
        
        alt Buổi học tương lai (Chưa diễn ra)
            F-->>U: Hiển thị thông báo nhắc nhở "Lớp học chưa diễn ra. Chỉ các lớp diễn ra trong ngày mới được điểm danh."
        else Buổi học trong ngày hoặc đã diễn ra
            F-->>U: Mở danh mục thả xuống gồm 3 trạng thái (Đã đến, Đến muộn, Vắng)
            U->>F: Nhấp chọn một trạng thái mới (khác trạng thái hiện tại)
            F->>S: Gửi yêu cầu cập nhật trạng thái điểm danh của học viên trong buổi học
            S->>DB: Gọi đến cơ sở dữ liệu điểm danh để ghi nhận trạng thái mới
            DB-->>S: Xác nhận lưu dữ liệu điểm danh thành công
            S-->>F: Phản hồi kết quả cập nhật thành công
            F-->>U: Cập nhật huy hiệu trạng thái trên dòng, làm mới số liệu tổng hợp chuyên cần và hiển thị thông báo thành công
        end
    end
```

---

## 3. GIAO DIỆN, QUY TẮC KIỂM TRA DỮ LIỆU & PHÂN QUYỀN (UI, VALIDATION RULES & PERMISSION)

### 3.1 Cấu trúc Danh mục Phân quyền trên Hệ thống CRM (CRM Permission Mapping)

Cơ chế phân quyền cho tính năng Cập nhật điểm danh sử dụng bộ quyền được cấu hình dưới **nhãn STATION** trên hệ thống CRM:

```text
STATION (Nhãn phân hệ trạm / cơ sở)
└── Lịch học trung tâm (calendar_class_schedule)
    └── |--- Chi tiết buổi học (session_detail)
             ├── [X] Quyền Xem                 (Mã quyền: view)
             └── [X] Quyền Cập nhật điểm danh  (Mã quyền: edit_attendance)
```

### 3.2 Cấu trúc các trường nhập liệu & Ràng buộc kiểm tra (Validation Rules)

Bảng mô tả các thành phần giao diện, dữ liệu và ràng buộc phân quyền của tính năng Cập nhật điểm danh trong Hộp thoại Chi tiết buổi học:

| Vùng trên giao diện | Thành phần giao diện con | Dữ liệu hiển thị & Giới hạn | Diễn giải quy tắc nghiệp vụ | Ràng buộc phân quyền & Hành vi |
|---|---|---|---|---|
| **Cột thông tin học viên** | Nút biểu tượng Cập nhật điểm danh | Nút biểu tượng người kèm dấu kiểm nhỏ gọn, kích thước 24x24 điểm ảnh | Hiển thị khi người dùng rê chuột vào dòng học viên hoặc khi danh mục chọn đang mở. Đối với buổi học tương lai, nút chuyển sang màu xám mờ và hiển thị con trỏ dạng cấm. | **Kiểm soát theo quyền edit_attendance:** Nếu người dùng không có quyền này, biểu tượng bị ẩn hoàn toàn khỏi giao diện. Nhấp vào nút khi có quyền sẽ mở danh mục chọn trạng thái. |
| **Danh mục thả xuống chọn trạng thái** | Khung danh mục chọn nhanh | Khung nổi màu trắng đổ bóng, bề rộng 125 điểm ảnh, hiển thị ngay dưới biểu tượng | Hiển thị danh sách 3 trạng thái: `Đã đến`, `Đến muộn`, `Vắng`. Trạng thái học viên đang mang bị vô hiệu hóa, không cho chọn lại. | Tự động đóng lại khi người dùng nhấp chọn một trạng thái hoặc nhấp chuột ra ngoài vùng danh mục. Nếu quyền bị thu hồi đột ngột, danh mục tự động đóng ngay lập tức. |
| **Tùy chọn trạng thái 1** | Mục chọn `Đã đến` | Biểu tượng dấu kiểm đậm màu xanh lá, chữ `Đã đến`, chấm tròn chỉ thị khi đang là trạng thái này | Dành cho học viên có mặt tham gia buổi học đúng giờ. Khi đang là trạng thái này, mục hiển thị nền xanh nhạt mờ và bị vô hiệu hóa. | Nhấp chọn sẽ gửi yêu cầu cập nhật sang trạng thái `present`, cập nhật huy hiệu xanh lá `Đã đến` và tăng số lượng có mặt trên tổng kết chuyên cần. |
| **Tùy chọn trạng thái 2** | Mục chọn `Đến muộn` | Chấm tròn màu cam hổ phách, chữ `Đến muộn`, chấm tròn chỉ thị khi đang là trạng thái này | Dành cho học viên vào lớp sau giờ khai giảng quy định. Khi đang là trạng thái này, mục hiển thị nền cam nhạt mờ và bị vô hiệu hóa. | Nhấp chọn sẽ gửi yêu cầu cập nhật sang trạng thái `late`, cập nhật huy hiệu cam `Đến muộn` và tăng số lượng đi trễ trên tổng kết chuyên cần. |
| **Tùy chọn trạng thái 3** | Mục chọn `Vắng` | Chấm tròn màu đỏ cảnh báo, chữ `Vắng`, chấm tròn chỉ thị khi đang là trạng thái này | Dành cho học viên vắng mặt không tham gia buổi học. Khi đang là trạng thái này, mục hiển thị nền đỏ nhạt mờ và bị vô hiệu hóa. | Nhấp chọn sẽ gửi yêu cầu cập nhật sang trạng thái `absent`, cập nhật huy hiệu đỏ `Vắng` và tăng số lượng vắng mặt trên tổng kết chuyên cần. |
| **Cột trạng thái điểm danh** | Huy hiệu trạng thái điểm danh | Huy hiệu bo góc hiển thị trạng thái hiện tại (`Đã đến`, `Đến muộn`, `Vắng`, hoặc `+ Điểm danh`) | Phản ánh trực quan trạng thái điểm danh hiện hành của học viên trong buổi học. Tự động chuyển đổi màu sắc và nội dung ngay sau khi chọn trạng thái mới. | Thành phần hiển thị kết quả cho cả người có quyền Xem và quyền Cập nhật điểm danh. Người dùng chỉ xem có thể quan sát trạng thái mà không có quyền nhấp sửa đổi. |

---

## 4. KHỐI CHỨC NĂNG CHI TIẾT: ACTION & LUỒNG KÍCH HOẠT (ACTIONS & EVENTS)

### Khối chức năng 1: Xem trạng thái và Kích hoạt Danh mục Cập nhật điểm danh

#### Action 1.1: Nhấp biểu tượng Cập nhật điểm danh trên dòng học viên
* **Luồng kích hoạt:** Người dùng rê chuột vào dòng học viên và nhấp vào biểu tượng hình người kèm dấu kiểm.
* **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - **AC-1 (Happy Path - Có quyền cập nhật trên buổi học hợp lệ):**
    - **Giả sử:** Buổi học diễn ra trong ngày hôm nay và tài khoản người dùng có quyền `station.calendar_class_schedule.session_detail.edit_attendance`.
    - **Khi:** Người dùng nhấp vào biểu tượng cập nhật điểm danh tại dòng của học viên "Nguyễn Bảo Ngọc".
    - **Thì:** Danh mục thả xuống mở ra mượt mà ngay cạnh biểu tượng, hiển thị 3 tùy chọn: `Đã đến`, `Đến muộn`, `Vắng`; tùy chọn tương ứng với trạng thái hiện tại của học viên bị vô hiệu hóa không cho chọn lại.
  - **AC-2 (Unhappy Path - Buổi học trong tương lai chưa diễn ra):**
    - **Giả sử:** Buổi học có ngày diễn ra trong tương lai (sau ngày hiện tại).
    - **Khi:** Người dùng cố tình nhấp vào biểu tượng cập nhật điểm danh.
    - **Thì:** Danh mục trạng thái không mở ra, hệ thống hiển thị thông báo nhắc nhở dạng nổi: "Lớp học chưa diễn ra. Chỉ các lớp diễn ra trong ngày mới được điểm danh."
  - **AC-3 (Unhappy Path - Tài khoản không có quyền cập nhật):**
    - **Giả sử:** Tài khoản người dùng chỉ có quyền Xem (`view`) mà không có quyền `edit_attendance`.
    - **Khi:** Người dùng mở xem Hộp thoại Chi tiết buổi học và rê chuột qua các dòng học viên.
    - **Thì:** Biểu tượng cập nhật điểm danh hoàn toàn không xuất hiện trên giao diện; người dùng chỉ xem được các huy hiệu trạng thái điểm danh hiện có.

---

### Khối chức năng 2: Chọn trạng thái mới và Ghi nhận dữ liệu điểm danh

#### Action 2.1: Nhấp chọn trạng thái điểm danh mới từ danh mục
* **Luồng kích hoạt:** Người dùng nhấp chọn một trạng thái khác với trạng thái hiện tại trong danh mục thả xuống.
* **Tiêu chí nghiệm thu:**
  - **AC-4 (Happy Path - Cập nhật điểm danh thành công):**
    - **Giả sử:** Học viên "Trần Bảo My" đang mang trạng thái "Vắng" và người dùng chọn chuyển sang "Đã đến".
    - **Khi:** Người dùng nhấp vào dòng "Đã đến" trong danh mục chọn.
    - **Thì:** Danh mục tự động đóng lại; hệ thống gửi yêu cầu cập nhật đến máy chủ; huy hiệu tại cột điểm danh lập tức chuyển sang màu xanh lá "Đã đến"; số lượng có mặt trên thanh tổng kết tăng thêm 1 và số lượng vắng giảm 1; hệ thống hiển thị thông báo: "Đã cập nhật điểm danh học viên Trần Bảo My: Đã đến".
  - **AC-5 (Unhappy Path - Quyền bị thu hồi trong khi đang thao tác):**
    - **Giả sử:** Người dùng đang mở danh mục chọn thì quyền `edit_attendance` bị người quản trị thu hồi trên CRM.
    - **Khi:** Người dùng nhấp chọn một trạng thái bất kỳ.
    - **Thì:** Hệ thống từ chối ghi nhận dữ liệu, lập tức đóng danh mục chọn, ẩn biểu tượng cập nhật điểm danh khỏi dòng, giữ nguyên trạng thái cũ và hiển thị thông báo lỗi quyền hạn.

---

## 5. CÁC TRƯỜNG HỢP GÓC CẠNH & LUỒNG NGOẠI LỆ (CORNER CASES & EXCEPTION FLOWS)

* **[CASE-01] Cập nhật điểm danh cho học viên có đơn xin nghỉ phép nhưng thực tế vẫn đến lớp:**
  - *Tình huống:* Học viên có đơn xin nghỉ phép được duyệt trước đó (hiển thị chấm màu hổ phách và chữ Nghỉ phép), nhưng sau đó phụ huynh vẫn đưa học viên đến lớp học.
  - *Cách xử lý:* Người dùng có quyền vẫn được phép mở danh mục và chọn lại trạng thái `Đã đến` hoặc `Đến muộn`. Hệ thống ghi nhận trạng thái có mặt thực tế vào cơ sở dữ liệu điểm danh cho buổi học đó, đồng thời vẫn bảo lưu thông tin đơn xin nghỉ phép trong hồ sơ để đối soát lịch sử khi cần thiết.
* **[CASE-02] Thao tác trên buổi học trong tương lai chưa diễn ra:**
  - *Tình huống:* Người dùng mở chi tiết một buổi học theo lịch trình diễn ra vào tuần tới và muốn điểm danh trước.
  - *Cách xử lý:* Biểu tượng nút cập nhật hiển thị ở trạng thái mờ, con trỏ chuột chuyển thành dạng cấm. Nếu người dùng nhấp vào, hệ thống chặn mở danh mục và hiển thị thông báo: "Lớp học chưa diễn ra. Chỉ các lớp diễn ra trong ngày mới được điểm danh."
* **[CASE-03] Quyền Cập nhật điểm danh bị thu hồi trên CRM thời gian thực:**
  - *Tình huống:* Tài khoản người dùng bị quản trị viên gỡ bỏ quyền `edit_attendance` trên CRM đúng lúc đang mở xem chi tiết buổi học.
  - *Cách xử lý:* Giao diện tự động phát hiện thay đổi quyền hạn, lập tức ẩn toàn bộ các biểu tượng cập nhật điểm danh trên tất cả các dòng học viên; nếu đang mở danh mục chọn trạng thái thì danh mục tự động đóng ngay lập tức, chuyển giao diện về chế độ chỉ đọc hoàn toàn.
* **[CASE-04] Gián đoạn kết nối mạng khi gửi dữ liệu cập nhật điểm danh:**
  - *Tình huống:* Người dùng vừa nhấp chọn trạng thái mới thì đường truyền Internet bị ngắt.
  - *Cách xử lý:* Hệ thống không thay đổi huy hiệu trên dòng học viên, giữ nguyên trạng thái điểm danh trước đó, hiển thị thông báo lỗi kết nối mạng kèm nút "Thử lại", đảm bảo dữ liệu không bị sai lệch giữa màn hình và máy chủ.
* **[CASE-05] Xung đột chỉnh sửa điểm danh đồng thời từ hai người dùng:**
  - *Tình huống:* Giáo viên và nhân viên giáo vụ cùng mở chi tiết buổi học tại cùng thời điểm và cùng cập nhật lại điểm danh cho một học viên với hai trạng thái khác nhau.
  - *Cách xử lý:* Hệ thống ghi nhận theo nguyên tắc mốc thời gian cập nhật sau cùng vào cơ sở dữ liệu điểm danh; phiên làm việc còn lại sẽ nhận được thông báo làm mới dữ liệu và hiển thị trạng thái mới nhất vừa được ghi nhận.
* **[CASE-06] Cập nhật điểm danh cho học viên học thử hoặc học viên mới:**
  - *Tình huống:* Học viên học thử (`trial`) hoặc học viên mới (`new`) được cập nhật từ "Vắng" sang "Đã đến".
  - *Cách xử lý:* Hệ thống cập nhật trạng thái điểm danh bình thường, giữ nguyên các nhãn nhận diện `Học thử` hoặc `Mới` cạnh tên học viên, đồng thời cập nhật tức thì số lượng học thử/mới có mặt trên tổng quan chuyên cần để nhân viên giáo vụ theo dõi chăm sóc sau giờ học.
* **[CASE-07] Buổi học bị hủy hoặc chuyển trạng thái không hoạt động:**
  - *Tình huống:* Buổi học đã bị thông báo hủy (`cancelled`) hoặc vắng cả lớp (`absent`).
  - *Cách xử lý:* Nút cập nhật điểm danh bị khóa vô hiệu hóa hoàn toàn trên toàn bộ danh sách; hệ thống từ chối mọi thao tác chỉnh sửa điểm danh trên ca học đã hủy.
* **[CASE-08] Thao tác cập nhật khi đang áp dụng bộ lọc học viên cần chăm sóc:**
  - *Tình huống:* Người dùng đang bật bộ lọc chỉ xem các học viên cần chăm sóc (`isCareOnlyFilter`), danh sách chỉ hiển thị một số học viên.
  - *Cách xử lý:* Thao tác cập nhật điểm danh diễn ra bình thường cho học viên được chọn; các chỉ số chuyên cần chung của cả lớp vẫn được tính toán chuẩn xác trên tổng thể sĩ số lớp học mà không bị sai lệch bởi bộ lọc hiển thị.

---

## 6. YÊU CẦU PHI CHỨC NĂNG & KẾT NỐI HỆ THỐNG (NON-FUNCTIONAL & SYSTEM INTEGRATION)

### 6.1 Yêu cầu phi chức năng (Non-functional Requirements)

* **Thời gian phản hồi:** Thời gian mở danh mục chọn trạng thái tức thì dưới 50 phần nghìn giây kể từ khi nhấp chuột.
* **Tốc độ ghi nhận dữ liệu:** Thời gian cập nhật trạng thái điểm danh vào cơ sở dữ liệu và làm mới giao diện không quá 0.5 giây trong điều kiện mạng tiêu chuẩn.
* **Tính toàn vẹn dữ liệu:** Dữ liệu điểm danh được bảo toàn toàn vẹn; không xảy ra hiện tượng mất dữ liệu chuyên cần khi xảy ra sự cố đóng hộp thoại đột ngột.

### 6.2 Cơ chế kết nối hệ thống & Phân quyền CRM (CRM System Integration)

* Hộp thoại Chi tiết buổi học nạp thông tin quyền hạn của người dùng từ hệ thống CRM theo danh mục `STATION -> calendar_class_schedule -> session_detail`.
* Khi người dùng thực hiện cập nhật điểm danh, giao diện gửi thông tin mã học viên, mã buổi học và trạng thái mới (`present`, `late`, `absent`) đến hệ thống máy chủ để ghi nhận vào cơ sở dữ liệu điểm danh.
* Kết quả cập nhật được phản hồi tức thì để làm mới các chỉ số chuyên cần trên giao diện và đồng bộ trạng thái xuyên suốt giữa phân hệ Lịch học trung tâm và phân hệ Lớp học.
