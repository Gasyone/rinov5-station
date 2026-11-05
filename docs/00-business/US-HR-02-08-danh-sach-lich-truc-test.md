---
id: US-HR-02-08
title: "Đăng ký Lịch trực - Danh sách lịch trực"
bf: BF-HR-02
domain: CAP-HR
persona: "PERSONA-BRANCH-MANAGER, PERSONA-CSM"
sr: "SR-PERSONA-STAFF"
status: ready
tags: [duty-roster, booking-test, shift-roster, list, crm-permission]
---

# US-HR-02-08: Đăng ký Lịch trực - Danh sách lịch trực (Master Shift Roster cho Booking Test)

> **Tham chiếu:** `BF-HR-02` (Quản lý Lịch làm việc & Quỹ thời gian) · `SR-PERSONA-STAFF` · Tiêu chuẩn Thiết kế Giao diện §4.2 (Mô hình Màn hình Danh sách & Bảng tổng hợp)  
> **Đường dẫn màn hình & Trạng thái liên quan:**  
> - `Đăng ký lịch làm việc (/app/work_registration)` -> Tab `Lịch trực test`  
> - Trạng thái ca trực: `Trống` (Chưa có người trực), `X người trực`, `Đã phân bổ`, `Đang chọn`

---

## 1. NHẬT KÝ THAY ĐỔI & BỐI CẢNH (CHANGELOG & CONTEXT)

### Lịch sử cập nhật tài liệu (Changelog)

| Ngày cập nhật | Nội dung cập nhật | Lý do cập nhật |
|---|---|---|
| 23/10/2026 | Khởi tạo tài liệu đặc tả nghiệp vụ mới (Phiên bản 1.0) cho màn hình Danh sách lịch trực test (Tab Lịch trực test), thiết kế ma trận tuần 7 ngày x 3 buổi, kết nối nguồn dữ liệu nhân sự cho phân hệ Booking Test; tinh giản hệ thống phân quyền thành 2 quyền nguyên tử (Xem và Sửa) đồng bộ với cây danh mục nhãn STATION trên hệ thống CRM; thiết lập cơ chế ẩn hoàn toàn và chặn truy cập khi không có quyền. | Chuẩn hóa quy trình phân bổ nhân sự trực ca test cố định theo tuần, phân định rõ cơ chế lấy giờ trực giữa Giáo viên và Nhân sự khác giáo viên; đồng bộ kiến trúc nạp quyền từ CRM và bảo mật thông tin triệt để. |

### Bối cảnh & Vấn đề nghiệp vụ (Context & Problem)

* **Bối cảnh nghiệp vụ:** Trong kiến trúc tổng thể, hệ thống CRM đóng vai trò trung tâm quản lý tài khoản, danh mục phân quyền và gán quyền cho nhân sự toàn hệ thống. Ứng dụng Station hiện tại là ứng dụng chuyên trách phục vụ vận hành tác nghiệp tại các cơ sở/trung tâm. 
* Khi triển khai nghiệp vụ mới **Lịch trực test** tại tab `Lịch trực test` (đường dẫn `/app/work_registration`), danh mục quyền của phân hệ này phải được **khai báo và nạp vào cây danh mục quyền trên hệ thống CRM cũ** dưới một **nhãn danh mục riêng biệt là "STATION"**.
* Tại phân hệ quản lý quyền của CRM, tính năng này được cấu hình theo cấp menu/màn hình:
  - Nhóm danh mục lớn: **STATION**
  - Menu / Màn hình: **Đăng ký lịch làm việc**
  - Mục tính năng con: `|--- Lịch trực test`
  - Cơ chế phân quyền được tinh gọn tối đa thành **đúng 2 quyền nguyên tử duy nhất**:
    1. **Quyền Xem (`view`):** Cho phép xem tab Lịch trực test, bảng ma trận tuần 7 ngày x 3 buổi, lọc và tìm kiếm nhân sự. **Nếu không được cấp hoặc bị gỡ bỏ quyền này:** Hệ thống **ẩn hoàn toàn tab Lịch trực test** trên thanh điều hướng và **chặn truy cập tuyệt đối**, không cho phép người dùng truy cập vào màn hình này dưới mọi hình thức.
    2. **Quyền Sửa (`edit`):** Cho phép kích hoạt mở Hộp thoại Phân bổ nhân sự để chọn/bỏ chọn và lưu thay đổi người trực ca. **Nếu không được cấp hoặc bị gỡ bỏ quyền này:** Hệ thống **ẩn hoàn toàn các nút `+ Sửa`** trên từng ô ca trực và **chặn tuyệt đối quyền truy cập vào luồng phân bổ nhân sự**.
* **Vấn đề giải quyết:**
  1. *Thiếu nguồn nhân sự sẵn sàng cho phân hệ Booking Test:* Trước đây chưa có bảng phân bổ người trực tập trung theo cơ sở, dẫn đến việc khi phụ huynh đặt lịch test, bộ phận tư vấn không biết giáo viên hay nhân sự nào đang trực ca để gán làm "Người phụ trách" (Tester / Giảng viên phỏng vấn).
  2. *Sự khác biệt về phương thức đăng ký giữa các nhóm tài khoản:*
     - **Tài khoản Giáo viên / Trợ giảng:** Đã có màn hình đăng ký quỹ thời gian rảnh cá nhân (Tab Đăng ký). Khi được thêm vào lịch trực test, hệ thống cần đối soát chính xác với lịch rảnh của giáo viên để xác định giờ trực thực tế.
     - **Tài khoản Nhân viên khác giáo viên (Chăm sóc khách hàng, Vận hành, Quản lý):** Chưa có quy trình tự đăng ký lịch rảnh trên hệ thống. Do đó, khi được phân bổ vào ca trực test, hệ thống tự động ghi nhận **mặc định full ca trực** ở từng ca được gán.
* **Mục tiêu & Giá trị mang lại:**
  - Thiết lập ma trận phân bổ ca trực 7 ngày trong tuần trực quan theo từng cơ sở, chia thành 3 buổi làm việc chính (Sáng, Chiều, Tối).
  - Tinh giản cơ chế phân quyền chỉ gồm 2 quyền (Xem và Sửa), đồng bộ hoàn toàn với cây phân quyền nhãn STATION trên hệ thống CRM.
  - Cung cấp nguồn dữ liệu phân bổ ca trực vững chắc để phân hệ Booking Test tự động truy vấn và ưu tiên gợi ý nhân sự trực ca khi gán người phụ trách cho ca test.

### Hiểu người dùng & Tình huống sử dụng (User Needs & Use Cases)

* **Người dùng chính (Persona):**
  - Quản lý cơ sở (`PERSONA-BRANCH-MANAGER`): Theo dõi và phân bổ chỉ tiêu nhân sự trực ca test đảm bảo cơ sở không bị trống người đón tiếp học viên.
  - Giáo vụ / Vận hành cơ sở (`PERSONA-CSM`): Cập nhật danh sách nhân sự trực từng ca, kiểm tra giờ rảnh của giáo viên để sắp xếp ca trực phù hợp.
* **Nhu cầu thực tế (Needs):**
  - Cần nhìn thấy ngay trong tuần này tại cơ sở mình quản lý, từng ca sáng/chiều/tối của mỗi thứ có bao nhiêu người trực và danh tính cụ thể là ai.
  - Cần bộ lọc theo môn học (Toán, Tiếng Anh) để nhanh chóng kiểm tra xem ca trực đã có giáo viên môn tương ứng hay chưa.
  - Cần quyền hạn rõ ràng: Nhân sự có quyền Xem chỉ được quan sát lịch; nhân sự có quyền Sửa mới được mở hộp thoại gán người trực.
* **Câu phát biểu nghiệp vụ:**
  - **Là một** Quản lý cơ sở hoặc Giáo vụ, **tôi muốn** xem bảng tổng hợp lịch trực test theo tuần và mở hộp thoại điều chỉnh người trực nếu có quyền sửa, **để** kiểm soát quân số trực ca phục vụ đón tiếp học viên kiểm tra đầu vào.

### Quy tắc nghiệp vụ (Business Rules)

1. **[RULE-ROSTER-01] Tính chu kỳ tuần:** Lịch trực test được cấu hình cố định theo khung tuần (Thứ 2 đến Chủ nhật). Lịch này tự động áp dụng lặp lại cho các tuần làm việc tiếp theo của cơ sở cho đến khi có cập nhật điều chỉnh mới.
2. **[RULE-ROSTER-02] Phân định cơ chế xác định giờ trực theo đối tượng & Lọc động:**
   - **Giáo viên & Trợ giảng:** Hệ thống đối soát với dữ liệu đăng ký quỹ thời gian rảnh tại tab Đăng ký của giáo viên trong ngày và ca tương ứng. Nếu đăng ký đủ toàn bộ khung giờ của ca trực, ghi nhận `Full ca`. Nếu chỉ đăng ký một phần giờ, hiển thị khung giờ cụ thể (ví dụ: `13:30 - 17:00`, hoặc nhiều khung giờ lẻ rời nhau). Nếu chưa đăng ký hoặc sau đó hủy bỏ toàn bộ giờ rảnh trong ca đó: Hệ thống tự động loại trừ không hiển thị giáo viên trong ô ca trực test ngoài bảng ma trận tuần (số lượng đếm người trực tự động trừ đi; tuyệt đối không hiển thị nhãn "Chưa đăng ký" trên bảng tuần theo chỉ đạo của PO).
   - **Nhân sự khác giáo viên (CS, Quản lý, Vận hành):** Do nhóm tài khoản này không có quy trình đăng ký lịch rảnh cá nhân, hệ thống tự động ghi nhận **mặc định full ca trực** ở từng ca được gán (`Full ca`).
3. **[RULE-ROSTER-03] Nguồn cấp nhân sự ưu tiên cho Booking Test:** Khi nhân viên tạo hoặc điều phối đơn Booking Test tại một ngày và khung giờ cụ thể, hệ thống Booking Test tự động truy vấn danh sách nhân sự có ca trực tương ứng trong bảng lịch trực test này để đưa lên đầu danh sách chọn "Người phụ trách".
4. **[RULE-ROSTER-04] Tối giản phân quyền theo mô hình CRM & Nguyên tắc ẩn hoàn toàn khi không đủ quyền:**
   - Toàn bộ màn hình chỉ áp dụng duy nhất 2 mã quyền nguyên tử từ nhãn STATION trên CRM: `station.work_registration.roster.view` (Xem) và `station.work_registration.roster.edit` (Sửa).
   - **Xử lý nghiêm ngặt khi không được cấp hoặc bị thu hồi quyền:**
     - **Không có Quyền Xem:** Ẩn hoàn toàn tab `Lịch trực test` trên thanh chuyển tab. Chặn tuyệt đối mọi hành vi truy cập trực tiếp bằng đường dẫn; hệ thống từ chối truy cập và chuyển hướng người dùng về màn hình mặc định.
     - **Không có Quyền Sửa:** Ẩn hoàn toàn nút `+ Sửa` và các liên kết chỉnh sửa trên mọi ô ca trực. Chặn tuyệt đối không cho phép người dùng mở Hộp thoại Phân bổ nhân sự để chỉnh sửa.
5. **[RULE-ROSTER-05] Cơ chế hiển thị thích ứng theo kích thước ô & Gom về +N khi tràn ô:** Số lượng dòng nhân sự hiển thị phẳng trong mỗi ô ca trực được tính toán hoàn toàn tự động dựa trên **chiều cao thực tế khả dụng của ô** (thay đổi linh hoạt theo độ phân giải màn hình và số lượng ca làm việc đang chọn hiển thị):
   - **Khi ô đủ chỗ cho toàn bộ nhân sự:** Hệ thống hiển thị đầy đủ 100% nhân sự, tận dụng tối đa chiều cao ô, tuyệt đối không thu gọn sớm và không để khoảng trống thừa vô lý ở phía dưới.
   - **Khi số lượng nhân sự vượt quá sức chứa của ô:** Hệ thống tự động kích hoạt cơ chế thu gọn, dành dòng cuối cùng cho nút chỉ báo `+N người khác | Chi tiết →`, và điền đầy tối đa số lượng nhân sự có thể vừa vặn trong khoảng trống còn lại phía trên.
   - Rê chuột vào nút `+N người khác` để xem danh sách tóm tắt những người còn lại qua thẻ nổi (tooltip); nhấp vào ô hoặc nút `+N người khác` để mở Hộp thoại Phân bổ nhân sự (`US-HR-02-09`).
6. **[RULE-ROSTER-06] Độc lập với bảng lương và chấm công:** Dữ liệu phân bổ ca trực test là lịch khung vận hành phục vụ tiếp đón học viên, không tự động sinh công hoặc trừ lương nhân viên.

### Phạm vi kiểm soát (Scope)

* **Phạm vi hiển thị:**
  - Thanh công cụ chung: Bộ chuyển đổi phân hệ (Tab Đăng ký, Lịch làm việc, Lịch trực test [chỉ hiển thị khi có quyền Xem], Lịch trường), Ô chọn cơ sở làm việc, Ô lọc môn học (Tất cả, Toán, Tiếng Anh), Ô tìm kiếm nhân sự trực ca theo tên/chức danh.
  - Bảng ma trận 7 ngày trong tuần: Chia thành 7 cột (Thứ 2 đến Chủ nhật). Mỗi ngày hiển thị nhãn thứ và nhãn thông tin ngày lễ (nếu trùng ngày lễ của cơ sở).
  - Khối các buổi trực trong ngày:
    - `BUỔI SÁNG`: Khung giờ chuẩn `08:00 - 12:00`
    - `BUỔI CHIỀU`: Khung giờ chuẩn `13:00 - 17:30`
    - `BUỔI TỐI`: Khung giờ chuẩn `17:30 - 22:00`
  - Thông tin trong từng ô ca trực: Số lượng người trực, nhãn trạng thái (`Trống` / `X người trực`), danh sách tên nhân sự phẳng kèm giờ trực thực tế (điền đầy tối đa theo chiều cao thực tế của ô), nút chỉ báo `+N người khác | Chi tiết →` khi số lượng nhân sự vượt quá sức chứa của ô, nút `+ Sửa` mở hộp thoại phân bổ nhân sự (chỉ hiển thị khi có quyền Sửa; nếu không có quyền Sửa thì bị ẩn hoàn toàn).

---

## 2. LUỒNG XỬ LÝ CHÍNH (MAIN FLOW - HAPPY PATH)

```mermaid
sequenceDiagram
    autonumber
    actor U as Quản lý cơ sở / Giáo vụ
    participant F as Giao diện Station (Thanh menu & Tab)
    participant CRM as Hệ thống CRM (Phân quyền & Tài khoản)
    participant S as Hệ thống Máy chủ Station
    participant DB as Cơ sở dữ liệu

    U->>F: Truy cập màn hình /app/work_registration
    F->>CRM: Nạp quyền tài khoản người dùng theo nhãn STATION
    CRM-->>F: Trả về trạng thái Quyền Xem và Quyền Sửa
    
    alt Không có Quyền Xem (view) hoặc bị gỡ bỏ quyền
        F-->>U: Ẩn hoàn toàn tab "Lịch trực test"; Chặn không cho phép truy cập vào
    else Có Quyền Xem (view)
        F-->>U: Hiển thị tab "Lịch trực test" trên thanh điều hướng
        U->>F: Nhấp chọn tab "Lịch trực test"
        F->>S: Gửi yêu cầu lấy danh sách phân bổ lịch trực theo cơ sở
        S->>DB: Gọi đến cơ sở dữ liệu phân bổ ca trực và cơ sở dữ liệu nhân sự
        DB-->>S: Trả về danh sách phân bổ ca trực tuần và thông tin nhân viên
        S->>DB: Gọi đến cơ sở dữ liệu lịch rảnh cá nhân để lấy giờ đăng ký của giáo viên
        DB-->>S: Trả về dữ liệu giờ rảnh đã đăng ký trong tuần
        S->>S: Đối soát thời gian trực: Giáo viên (theo giờ đăng ký), Nhân sự khác (mặc định Full ca)
        S-->>F: Phản hồi gói dữ liệu ma trận lịch trực hoàn chỉnh
        F-->>U: Hiển thị ma trận 7 ngày x 3 buổi (chỉ xem thông tin)
        
        alt Có Quyền Sửa (edit)
            F-->>U: Hiển thị nút [+ Sửa] trên từng ô ca trực
            U->>F: Nhấp vào nút [+ Sửa]
            F-->>U: Mở Hộp thoại Phân bổ nhân sự (US-HR-02-09)
        else Không có Quyền Sửa (edit) hoặc bị gỡ bỏ quyền
            F-->>U: Ẩn hoàn toàn nút [+ Sửa]; Chặn không cho phép mở luồng phân bổ
        end
    end
```

---

## 3. GIAO DIỆN, QUY TẮC KIỂM SOÁT DỮ LIỆU & PHÂN QUYỀN (UI, VALIDATION & PERMISSION)

### 3.1. Cấu trúc Danh mục Phân quyền trên Hệ thống CRM (CRM Permission Mapping)

Theo kiến trúc quản trị quyền tập trung tại CRM, phân hệ Station được định danh bằng một **nhãn danh mục phân quyền riêng biệt** có tên gọi là **STATION**.

Dưới nhãn **STATION**, hệ thống CRM khai báo cây menu và 2 quyền nguyên tử tương ứng:

```text
STATION (Nhãn phân hệ trạm / cơ sở)
└── Đăng ký lịch làm việc (work_registration)
    └── |--- Lịch trực test (roster)
             ├── [X] Quyền Xem  (Mã quyền: station.work_registration.roster.view)
             └── [X] Quyền Sửa  (Mã quyền: station.work_registration.roster.edit)
```

### 3.2. Ràng buộc Quyền hạn trên Giao diện Station (Capability Gating)

Giao diện áp dụng cơ chế kiểm soát hiển thị trực tiếp theo 2 quyền nguyên tử được nạp từ CRM:

| Vùng Giao diện / Nút Thao Tác | Loại Hiển Thị | Mã Quyền Yêu Cầu Từ CRM | Xử Lý Khi Không Đủ Quyền Hoặc Bị Gỡ Bỏ Quyền |
| :--- | :--- | :--- | :--- |
| **Tab Lịch trực test trên thanh điều hướng** | Nút chuyển tab trên thanh điều hướng | `station.work_registration.roster.view` (Xem) | **Ẩn hoàn toàn tab khỏi giao diện; Chặn tuyệt đối không cho phép truy cập vào** |
| **Màn hình bảng ma trận lịch trực test** | Toàn bộ giao diện ma trận 7 ngày | `station.work_registration.roster.view` (Xem) | **Chặn truy cập; Từ chối truy cập và chuyển hướng về màn hình mặc định** |
| **Nút [+ Sửa] trên từng ô ca trực** | Nút bấm thao tác trên tiêu đề ca | `station.work_registration.roster.edit` (Sửa) | **Ẩn hoàn toàn nút [+ Sửa]; Chặn không cho phép truy cập vào luồng phân bổ** |
| **Vùng nhấp chuột vào ô ca để phân bổ** | Hành vi tương tác trên ô ca | `station.work_registration.roster.edit` (Sửa) | **Khóa tương tác phân bổ; Chỉ cho phép xem danh sách nhân sự trực ca** |

### 3.3. Cấu trúc các trường thông tin hiển thị & Ràng buộc kiểm tra dữ liệu (Validation Rules)

| Tên trường thông tin | Kiểu hiển thị | Nguồn dữ liệu | Định dạng & Giới hạn | Diễn giải quy tắc kiểm duyệt dữ liệu |
|---|---|---|---|---|
| **Cột Thứ trong tuần** | Tiêu đề cột chữ đậm | Cấu hình tuần 7 ngày | Thứ 2 đến Chủ nhật | Hiển thị thứ, kèm nhãn ngày lễ nếu trùng ngày nghỉ lễ của cơ sở |
| **Dải tiêu đề Buổi trực** | Khung chữ in hoa có nền màu nhận diện | Danh mục ca trực hệ thống | Sáng, Chiều, Tối | Mỗi buổi có màu sắc riêng biệt và hiển thị khung giờ chuẩn |
| **Số lượng người trực trong ca** | Dòng chữ tóm tắt góc trên ô | Dữ liệu phân bổ ca trực | Số nguyên không âm | Hiển thị dạng "X người trực" hoặc "Trống" nếu chưa có nhân sự |
| **Tên nhân sự trực ca** | Dòng văn bản rút gọn | Danh sách nhân sự được gán | Điền đầy theo chiều cao ô | Hiển thị họ tên nhân sự; nếu vượt quá chiều cao ô thì thu gọn về `+N người khác` |
| **Thời gian trực thực tế** | Nhãn giờ nhỏ bên phải tên nhân sự | Tính toán đối soát lịch rảnh | "Full ca" hoặc khung giờ "HH:mm - HH:mm" | Giáo viên lấy theo lịch rảnh; Nhân sự khác mặc định hiển thị "Full ca" |

---

## 4. KHỐI CHỨC NĂNG CHI TIẾT: ACTION & LUỒNG KÍCH HOẠT (ACTIONS & EVENTS)

### Khối chức năng 1: Xem, Lọc và Tìm kiếm Lịch trực tuần (Áp dụng Quyền Xem - view)

#### Action 1.1: Chuyển đổi Cơ sở làm việc
* **Luồng kích hoạt:** Người dùng nhấp chọn cơ sở làm việc trên thanh công cụ.
* **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - **AC-1 (Happy Path - Chuyển cơ sở thành công):**
    - **Giả sử:** Người dùng có quyền `station.work_registration.roster.view` trên nhiều cơ sở và đang xem tại cơ sở A.
    - **Khi:** Người dùng chọn cơ sở B trên ô thả xuống cơ sở.
    - **Thì:** Giao diện gửi yêu cầu đến máy chủ để tải lại dữ liệu ma trận lịch trực tuần của cơ sở B và làm mới hiển thị toàn bộ 7 ngày.
  - **AC-2 (Alternate Path - Cơ sở chưa có dữ liệu phân bổ):**
    - **Giả sử:** Cơ sở mới thiết lập chưa từng được gán phân bổ người trực ca nào.
    - **Khi:** Người dùng chuyển sang cơ sở này.
    - **Thì:** Tất cả các ô ca trực trên bảng ma trận hiển thị trạng thái "Chưa có người trực".
  - **AC-3 (Unhappy Path - Không có quyền xem hoặc bị gỡ bỏ quyền):**
    - **Giả sử:** Tài khoản người dùng không được cấp hoặc bị thu hồi quyền `station.work_registration.roster.view` trên hệ thống CRM.
    - **Khi:** Người dùng truy cập vào trang Đăng ký lịch làm việc (`/app/work_registration`).
    - **Thì:** Tab `Lịch trực test` bị ẩn hoàn toàn trên thanh chuyển tab. Nếu người dùng cố ý nhập liên kết trực tiếp vào trình duyệt, hệ thống lập tức chặn lại, từ chối truy cập và chuyển hướng về màn hình mặc định.

#### Action 1.2: Lọc theo Môn học (Toán / Tiếng Anh)
* **Luồng kích hoạt:** Người dùng chọn môn học trên thanh công cụ để rà soát lực lượng giáo viên chuyên môn.
* **Tiêu chí nghiệm thu:**
  - **AC-1 (Happy Path - Lọc giáo viên theo môn):**
    - **Giả sử:** Ca Sáng Thứ 2 có 4 người trực gồm 2 giáo viên Tiếng Anh, 1 giáo viên Toán và 1 nhân sự CS (hỗ trợ chung).
    - **Khi:** Người dùng chọn bộ lọc môn "Tiếng Anh".
    - **Thì:** Dòng tóm tắt ô ca cập nhật hiển thị "3/4 người trực", các giáo viên chuyên môn Tiếng Anh và nhân sự hỗ trợ chung (CS, Quản lý) được giữ hiển thị; chỉ giáo viên môn Toán không khớp bị ẩn/làm mờ.
  - **AC-2 (Alternate Path - Ca không có giáo viên môn được chọn):**
    - **Giả sử:** Ca Chiều Thứ 3 chỉ có giáo viên môn Toán trực và không có giáo viên Tiếng Anh.
    - **Khi:** Người dùng chọn bộ lọc môn "Tiếng Anh".
    - **Thì:** Ô ca hiển thị thông báo ghi chú nghiêng "0 GV môn Tiếng Anh".

#### Action 1.3: Tìm kiếm nhanh Nhân sự trên Bảng ma trận
* **Luồng kích hoạt:** Người dùng nhập ký tự vào ô tìm kiếm trên thanh công cụ.
* **Tiêu chí nghiệm thu:**
  - **AC-1 (Happy Path - Tìm thấy nhân sự):**
    - **Giả sử:** Bảng ma trận đang hiển thị đầy đủ lịch các ngày trong tuần.
    - **Khi:** Người dùng gõ tên "Sarah" vào ô tìm kiếm.
    - **Thì:** Tất cả các ô ca trực có nhân sự tên "Sarah" được làm nổi bật với đường viền nhấn; các ô ca không có nhân sự này được giảm độ đậm.
  - **AC-2 (Alternate Path - Không tìm thấy nhân sự):**
    - **Giả sử:** Người dùng nhập một cái tên không có trong danh sách phân bổ của cơ sở.
    - **Khi:** Dừng gõ quá 300 mili-giây.
    - **Thì:** Toàn bộ bảng hiển thị ở trạng thái mờ nhẹ, không có ô nào được làm nổi bật viền nhấn.

---

### Khối chức năng 2: Kích hoạt Phân bổ & Kết nối Nghiệp vụ Booking Test (Áp dụng Quyền Sửa - edit)

#### Action 2.1: Nhấp mở Hộp thoại Phân bổ người trực
* **Luồng kích hoạt:** Người dùng nhấp chuột trực tiếp vào một ô ca bất kỳ hoặc bấm nút `+ Sửa` ở góc phải tiêu đề ô ca.
* **Tiêu chí nghiệm thu:**
  - **AC-1 (Happy Path - Có quyền sửa):**
    - **Giả sử:** Tài khoản người dùng có quyền `station.work_registration.roster.edit` được nạp từ CRM.
    - **Khi:** Người dùng nhấp vào nút `+ Sửa` tại ca Sáng Thứ 2.
    - **Thì:** Hệ thống mở Hộp thoại Phân bổ nhân sự (`US-HR-02-09`), cho phép tích chọn và thay đổi người trực ca.
  - **AC-2 (Unhappy Path - Không có quyền sửa hoặc bị gỡ bỏ quyền):**
    - **Giả sử:** Tài khoản người dùng chỉ có quyền `station.work_registration.roster.view` nhưng không có quyền `station.work_registration.roster.edit` (hoặc vừa bị quản trị viên gỡ bỏ quyền sửa).
    - **Khi:** Người dùng quan sát ô ca trực trên bảng ma trận.
    - **Thì:** Nút `+ Sửa` bị ẩn hoàn toàn khỏi tất cả các ô ca; thao tác nhấp chuột vào ô ca bị khóa chức năng sửa, hệ thống chặn tuyệt đối không cho phép truy cập vào Hộp thoại Phân bổ nhân sự.

#### Action 2.2: Cung cấp Nguồn nhân sự trực ca cho Phân hệ Booking Test
* **Luồng kích hoạt:** Nhân viên tư vấn hoặc giáo vụ thực hiện tạo/điều phối đơn kiểm tra trình độ (Booking Test) cho học viên tại một ngày và giờ cụ thể.
* **Tiêu chí nghiệm thu:**
  - **AC-1 (Happy Path - Ưu tiên nhân sự có trực ca hôm đó):**
    - **Giả sử:** Học viên đặt lịch test lúc 09:00 Thứ 2 tại cơ sở Nguyễn Tuân môn Tiếng Anh. Lịch trực test ca Sáng Thứ 2 đã phân bổ gồm "Sarah J.", "Robert L." và 1 nhân sự CS.
    - **Khi:** Màn hình Booking Test mở danh sách chọn "Người phụ trách ca test" (Tester / Giảng viên phỏng vấn).
    - **Thì:** Hệ thống tự động truy vấn dữ liệu phân bổ ca trực tuần của cơ sở Nguyễn Tuân, đưa "Sarah J." và "Robert L." lên đầu danh sách kèm nhãn đánh dấu đang trực ca hôm nay để nhân viên ưu tiên chỉ định.
  - **AC-2 (Alternate Path - Nhân sự trực ca bị trùng lịch bận khác):**
    - **Giả sử:** Giáo viên "Sarah J." được phân bổ trực ca Sáng Thứ 2, nhưng vào lúc 09:00 - 10:00 giáo viên này đã có một ca dạy lớp chính thức hoặc đã nhận phụ trách một ca test khác.
    - **Khi:** Hệ thống Booking Test kiểm tra xung đột lịch trình.
    - **Thì:** Tên giáo viên vẫn nằm trong nhóm trực ca nhưng hiển thị cảnh báo phụ "Đang bận lịch khác" kèm lý do chi tiết.

---

## 5. CÁC TRƯỜNG HỢP GÓC CẠNH & LUỒNG NGOẠI LỆ (CORNER CASES & EXCEPTION FLOWS)

- **[CASE-01] Tài khoản không được cấp quyền hoặc bị gỡ bỏ quyền trong nhóm STATION tại CRM:**
  - *Tình huống:* Nhân viên chưa được cấp quyền hoặc bị người quản trị trên CRM thu hồi quyền Xem/Sửa trong khi đang làm việc.
  - *Cách xử lý:*
    - Nếu không có quyền Xem: Hệ thống ẩn ngay lập tức tab `Lịch trực test`. Nếu truy cập trực tiếp bằng đường dẫn, hệ thống chặn truy cập hoàn toàn và chuyển hướng về trang làm việc chính.
    - Nếu không có quyền Sửa: Hệ thống ẩn ngay lập tức toàn bộ nút `+ Sửa` trên bảng ma trận, chặn không cho phép mở hộp thoại phân bổ nhân sự.
- **[CASE-02] Giáo viên được gán trực ca nhưng chưa đăng ký hoặc đã hủy bỏ lịch rảnh cá nhân:**
  - *Tình huống:* Giáo viên đã được gán vào ca trực test nhưng trên tab cá nhân chưa đăng ký hoặc sau đó tự ý hủy bỏ toàn bộ giờ rảnh của ca đó. Xử lý thuần túy khép kín trong phạm vi màn hình Lịch trực test, không can thiệp vào tab cá nhân.
  - *Cách xử lý:* Trên ô ca của bảng ma trận tuần, hệ thống đối soát động và tự động loại trừ không hiển thị giáo viên này, số lượng đếm người trực của ca tự động giảm. Tuyệt đối không hiển thị nhãn "Chưa đăng ký" ngoài bảng tuần, đảm bảo 100% nhân sự hiển thị trên bảng ma trận đều có giờ trực hợp lệ. Khi mở Hộp thoại Phân bổ nhân sự, giáo viên này sẽ hiển thị nhãn đỏ "Chưa đăng ký" kèm khóa ô chọn (checkbox) để người quản lý nhận biết và thay thế người trực khác.
- **[CASE-03] Giáo viên chỉ đăng ký một phần thời gian của ca trực:**
  - *Tình huống:* Ca Chiều có khung giờ chuẩn `13:00 - 17:30`, nhưng giáo viên chỉ đăng ký rảnh từ `14:00 - 16:30`.
  - *Cách xử lý:* Bảng ma trận không ghi nhận nhãn "Full ca" màu xanh lá, mà hiển thị chính xác khung giờ rảnh lẻ `14:00 - 16:30` màu hổ phách bên cạnh tên giáo viên, giúp bộ phận xếp lịch Booking Test không gán lịch ngoài khung giờ này.
- **[CASE-04] Nhân sự khác giáo viên (CS, Vận hành) được phân bổ vào ca trực:**
  - *Tình huống:* Quản lý gán nhân viên tư vấn khách hàng hoặc nhân viên vận hành vào trực ca Tối `17:30 - 22:00`.
  - *Cách xử lý:* Do nhóm tài khoản này không có quy trình đăng ký lịch rảnh cá nhân, hệ thống tự động ghi nhận mặc định thời gian trực là toàn bộ ca làm việc và hiển thị nhãn "Full ca" màu xanh lá trên ô ca trực.
- **[CASE-05] Số lượng nhân sự phân bổ trong một ca vượt quá sức chứa thực tế của ô:**
  - *Tình huống:* Ca trực được phân bổ nhiều nhân sự vượt quá chiều cao khả dụng của ô ca trên màn hình hiện tại.
  - *Cách xử lý:* Ô ca điền đầy tối đa số lượng nhân sự có thể chứa vừa vặn, dành dòng cuối cùng hiển thị nút chỉ báo `+N người khác | Chi tiết →`. Khi người dùng rê chuột vào nút, thẻ nổi (tooltip) hiển thị toàn bộ danh tính và giờ trực của những người còn lại; khi nhấp vào nút này, hệ thống tự động mở Hộp thoại Phân bổ nhân sự để xem chi tiết hoặc điều chỉnh.
- **[CASE-06] Mất kết nối mạng khi đang thao tác lọc hoặc tải ma trận lịch trực:**
  - *Tình huống:* Người dùng chuyển cơ sở hoặc thay đổi tuần nhưng đường truyền mạng máy trạm bị ngắt quãng.
  - *Cách xử lý:* Hệ thống giữ nguyên trạng thái hiển thị gần nhất, hiển thị thông báo cảnh báo lỗi tải dữ liệu dạng thanh thông báo nổi kèm nút "Thử lại", tuyệt đối không làm trắng màn hình giao diện.
- **[CASE-07] Xử lý bộ lọc Môn học đối với nhân sự nhóm Khác (CS, Vận hành, Quản lý):**
  - *Tình huống:* Người dùng chọn lọc môn chuyên môn "Toán" hoặc "Tiếng Anh" trên thanh công cụ để tìm giáo viên phụ trách ca test.
  - *Cách xử lý:* Hệ thống giữ nguyên trạng thái hiển thị của các nhân sự nhóm Khác trong ca trực (vì nhân sự này đảm nhiệm vai trò hỗ trợ chung toàn ca cho mọi học viên), chỉ lọc ẩn/làm mờ các giáo viên không đúng chuyên môn môn học được chọn.

---

## 6. YÊU CẦU PHI CHỨC NĂNG & KẾT NỐI HỆ THỐNG (NON-FUNCTIONAL & SYSTEM INTEGRATION)

### 6.1. Yêu cầu phi chức năng (Non-functional Requirements)
- **Thời gian phản hồi:** Tải dữ liệu bảng ma trận 7 ngày của cơ sở $\le 1.5$ giây trong điều kiện mạng tiêu chuẩn.
- **Tính phản hồi giao diện:** Khi gõ từ khóa tìm kiếm hoặc lọc môn học, giao diện lọc trực tiếp trong vòng $\le 100$ mili-giây mà không cần tải lại toàn bộ trang.
- **Đồng bộ quyền hạn:** Phiên đăng nhập tự động đồng bộ danh sách quyền từ hệ thống CRM theo thời gian thực; khi quản trị viên cập nhật quyền trên CRM, người dùng nhận quyền mới ngay tại lần tải lại trang tiếp theo.

### 6.2. Cơ chế kết nối hệ thống & Phân quyền CRM (CRM System Integration)
- Hệ thống CRM đóng vai trò máy chủ cấp quyền tập trung. Bảng phân quyền trên CRM bổ sung nhánh nhóm `STATION` -> `Đăng ký lịch làm việc` -> `Lịch trực test` với 2 cột lựa chọn: Xem và Sửa.
- Giao diện Station nạp thông tin quyền từ phiên làm việc của người dùng và thực hiện kiểm soát quyền hạn (Capability Gating) tương ứng với 2 quyền nói trên.
- Màn hình giao diện gọi đến cơ sở dữ liệu phân bổ ca trực (`MasterShiftAssignment`) và cơ sở dữ liệu nhân sự qua các hàm điều phối nội bộ của hệ thống.
