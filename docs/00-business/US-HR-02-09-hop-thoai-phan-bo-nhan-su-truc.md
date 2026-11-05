---
id: US-HR-02-09
title: "Đăng ký Lịch trực - Phân bổ nhân sự"
bf: BF-HR-02
domain: CAP-HR
persona: "PERSONA-BRANCH-MANAGER, PERSONA-CSM"
sr: "SR-PERSONA-STAFF"
status: ready
tags: [duty-roster, assign-staff, booking-test, modal, form, crm-permission]
---

# US-HR-02-09: Đăng ký Lịch trực - Phân bổ nhân sự (Hộp thoại gán nhân sự trực ca)

> **Tham chiếu:** `BF-HR-02` (Quản lý Lịch làm việc & Quỹ thời gian) · `US-HR-02-08` (Danh sách lịch trực test) · Tiêu chuẩn Thiết kế Giao diện §4.4 (Mô hình Hộp thoại & Biểu mẫu tương tác)  
> **Đường dẫn màn hình & Trạng thái liên quan:**  
> - `Đăng ký lịch làm việc (/app/work_registration)` -> Tab `Lịch trực test` -> Kích hoạt Hộp thoại nổi `Phân bổ người trực: [Thứ] - [Buổi]`  
> - Trạng thái phân bổ: `Chưa phân bổ`, `Đã phân bổ ca này`, `Full ca`, `Giờ đăng ký lẻ`, `Chưa đăng ký`

---

## 1. NHẬT KÝ THAY ĐỔI & BỐI CẢNH (CHANGELOG & CONTEXT)

### Lịch sử cập nhật tài liệu (Changelog)

| Ngày cập nhật | Nội dung cập nhật | Lý do cập nhật |
|---|---|---|
| 23/10/2026 | Khởi tạo tài liệu đặc tả nghiệp vụ mới (Phiên bản 1.0) cho Hộp thoại Phân bổ nhân sự trực ca test (Tab Lịch trực test), cấu trúc chia 2 bảng thông tin song song: Danh sách nhân sự và Lịch trực chi tiết theo tuần; đồng bộ hệ thống phân quyền tập trung từ CRM theo nhãn STATION với 2 quyền Xem và Sửa; thiết lập cơ chế ẩn hoàn toàn ô chọn và nút lưu phân bổ, chặn truy cập tuyệt đối khi không đủ quyền. | Cung cấp công cụ gán nhân sự trực ca trực quan, tối ưu cho việc đối soát giờ rảnh của Giáo viên và tự động gán Full ca cho Nhân sự khác giáo viên; tinh giản phân quyền đồng bộ với CRM và bảo mật thông tin triệt để. |

### Bối cảnh & Vấn đề nghiệp vụ (Context & Problem)

* **Bối cảnh nghiệp vụ:** Khi người quản lý hoặc giáo vụ cơ sở cần điều chỉnh, bổ sung hoặc thay thế nhân sự trực ca tại một buổi cụ thể (Sáng, Chiều, Tối) của một ngày trong tuần trên bảng ma trận lịch trực test (`US-HR-02-08`), hệ thống mở ra **Hộp thoại Phân bổ nhân sự**. Hộp thoại này cần giải quyết trọn vẹn bài toán vừa chọn được nhân sự trực ca, vừa xem trước được lịch làm việc tổng thể trong tuần của nhân sự đó để tránh quá tải hoặc phân bổ thiếu công bằng.
* **Cơ chế phân quyền tập trung từ CRM:**
  - Hệ thống CRM là nơi quản lý tài khoản và phân quyền người dùng. 
  - Tại CRM, mục phân quyền cho phân hệ Station được đặt dưới một nhãn danh mục riêng là **STATION**.
  - Dưới nhãn **STATION**, menu **Đăng ký lịch làm việc** có tính năng `|--- Lịch trực test` với 2 quyền nguyên tử:
    1. **Quyền Xem (`station.work_registration.roster.view`):** Quyền cơ sở để xem thông tin danh sách và lịch tuần. Nếu không có quyền này, người dùng hoàn toàn bị chặn truy cập từ màn hình ngoài.
    2. **Quyền Sửa (`station.work_registration.roster.edit`):** Cho phép kích hoạt mở Hộp thoại Phân bổ nhân sự, tích chọn/bỏ chọn nhân sự và bấm nút `[Lưu phân bổ]`. **Nếu không được cấp hoặc bị gỡ bỏ quyền Sửa:** Hệ thống **chặn tuyệt đối không cho phép truy cập vào hộp thoại này** (nút `+ Sửa` ở màn hình ngoài bị ẩn hoàn toàn). Trong trường hợp tài khoản bị thu hồi quyền khi đang mở hộp thoại, hệ thống sẽ **ẩn ngay lập tức các ô đánh dấu chọn (Checkbox)** và **ẩn hoàn toàn nút `[Lưu phân bổ]`**, chặn không cho thực hiện bất kỳ hành vi thay đổi dữ liệu nào.
* **Vấn đề giải quyết:**
  1. *Khó khăn khi phân bổ mà không thấy lịch tuần của nhân sự:* Nếu chỉ có danh sách tích chọn đơn thuần, người quản lý không biết nhân sự đó trong tuần đã trực bao nhiêu ca, những ngày khác có bị trùng lịch hay không. Bố cục 2 bảng thông tin (Bảng chọn nhân sự bên trái + Bảng lịch chi tiết tuần bên phải) giúp giải quyết triệt để vấn đề này.
  2. *Quy tắc xác định giờ trực theo từng nhóm đối tượng:*
     - **Đối với Giáo viên / Trợ giảng:** Đã có dữ liệu đăng ký quỹ thời gian rảnh ở Tab Đăng ký. Khi chọn giáo viên vào ca trực, hộp thoại phải hiển thị ngay thông tin đăng ký giờ rảnh của giáo viên trong ca đó (Ví dụ: Đăng ký trọn vẹn thì xác nhận `Full ca`, nếu đăng ký giờ lẻ thì hiển thị nhãn giờ `13:30 - 17:00`, nếu chưa đăng ký thì báo `Chưa đăng ký`).
     - **Đối với Nhân sự khác giáo viên (CS, Vận hành, Quản lý):** Do hệ thống không áp dụng quy trình đăng ký giờ rảnh cá nhân cho nhóm này, nên khi được chọn phân bổ, hệ thống tự động ghi nhận **mặc định full ca trực** ở từng ca được gán (`Full ca`).
* **Mục tiêu & Giá trị mang lại:**
  - Hỗ trợ thao tác gán/hủy phân bổ nhân sự nhanh chóng bằng ô đánh dấu kiểm trực quan khi có quyền Sửa.
  - Phản ánh tức thì sự thay đổi: Khi người dùng tích chọn một nhân sự, bảng lịch tuần bên phải ngay lập tức bổ sung ca đang chọn vào ma trận tuần của nhân sự đó với nhãn đánh dấu `Đang chọn`.
  - Lưu kết quả phân bổ vào cơ sở dữ liệu làm căn cứ điều phối nhân sự cho phân hệ Đặt lịch kiểm tra năng lực (Booking Test).

### Hiểu người dùng & Tình huống sử dụng (User Needs & Use Cases)

* **Người dùng chính (Persona):**
  - Quản lý cơ sở (`PERSONA-BRANCH-MANAGER`): Phân bổ chỉ tiêu trực ca test công bằng giữa các nhân sự trong cơ sở.
  - Giáo vụ / Vận hành cơ sở (`PERSONA-CSM`): Chỉ định giáo viên có chuyên môn môn học phù hợp vào các ca trực trọng điểm.
* **Nhu cầu thực tế (Needs):**
  - Cần lọc nhanh danh sách nhân sự theo nhóm vai trò: `Tất cả`, `Giáo viên`, hoặc `Khác` (nhân sự văn phòng, chăm sóc khách hàng).
  - Cần tìm kiếm nhân sự nhanh theo tên khi danh sách nhân viên cơ sở đông.
  - Cần nhìn thấy số ca trong tuần của từng nhân viên (`X ca/tuần`) để không phân bổ dồn dập vào một người.
* **Câu phát biểu nghiệp vụ:**
  - **Là một** Quản lý cơ sở hoặc Giáo vụ, **tôi muốn** tích chọn nhân sự và xem trước lịch trực tuần của họ trong hộp thoại phân bổ, **để** quyết định phân công ca trực chính xác, hợp lý và lưu lại cho hệ thống Booking Test sử dụng.

### Quy tắc nghiệp vụ (Business Rules)

1. **[RULE-ASSIGN-01] Nhận diện giờ trực phân tầng:**
   - **Giáo viên & Trợ giảng:** Hệ thống đối soát trực tiếp với dữ liệu lịch rảnh cá nhân đã đăng ký tại tab Đăng ký. Nếu đăng ký đủ trọn vẹn ca thì hiển thị `Full ca`. Nếu chỉ đăng ký một phần thời gian thì hiển thị khung giờ lẻ cụ thể (ví dụ `13:30 - 17:00`). Nếu chưa đăng ký thời gian rảnh cho ca tương ứng: hiển thị dòng chữ cảnh báo `Chưa đăng ký` màu đỏ, đồng thời vô hiệu hóa ô đánh dấu chọn (Checkbox) và khóa dòng, ngăn chặn không cho phép chọn hoặc phân bổ giáo viên này vào ca trực.
   - **Nhân sự khác giáo viên:** Mặc định nhận toàn bộ ca trực (`Full ca`) vì nhóm này không có quy trình tự đăng ký giờ rảnh trên ứng dụng.
2. **[RULE-ASSIGN-02] Phản ánh động lịch tuần:** Khi người dùng tích chọn thêm hoặc bỏ chọn một nhân sự, ma trận 7 ngày ở bảng thông tin bên phải cập nhật tức thì, hiển thị nhãn nổi bật `Đang chọn` ở ca đang thao tác.
3. **[RULE-ASSIGN-03] Kiểm soát hiển thị và chặn truy cập theo quyền CRM:** Hộp thoại Phân bổ nhân sự chỉ cho phép truy cập khi tài khoản người dùng có quyền Sửa (`station.work_registration.roster.edit`). Khi người dùng không có quyền Sửa hoặc bị thu hồi quyền:
   - Tại màn hình ngoài, nút `+ Sửa` bị ẩn hoàn toàn, chặn người dùng mở hộp thoại.
   - Nếu quyền Sửa bị thu hồi trong khi đang mở hộp thoại, giao diện lập tức ẩn toàn bộ các ô đánh dấu chọn (Checkbox) và ẩn nút `[Lưu phân bổ]`, từ chối thao tác gửi dữ liệu, đồng thời hiển thị cảnh báo thu hồi quyền và tự động đóng hộp thoại.
4. **[RULE-ASSIGN-04] Tính độc lập phân bổ:** Phân bổ nhân sự áp dụng cho từng ca cụ thể của cơ sở. Việc lưu dữ liệu sẽ ghi nhận danh sách mã nhân sự vào cơ sở dữ liệu phân bổ ca trực (`MasterShiftAssignment`).

### Ranh giới nghiệp vụ (Scope)

* **Phạm vi hiển thị trong hộp thoại:**
  - **Tiêu đề hộp thoại:** Tên thứ và buổi trực đang phân bổ (Ví dụ: `Phân bổ người trực: Thứ 2 - Buổi sáng`), kèm nhãn bộ môn đang lọc.
  - **Bảng bên trái (Danh sách nhân sự & Lựa chọn):**
    - Thanh công cụ nhỏ gọn: 3 nút chuyển đổi vai trò (`Tất cả`, `Giáo viên`, `Khác`) và ô tìm kiếm nhanh theo tên.
    - Danh sách thẻ nhân sự: Ô đánh dấu chọn (Checkbox), tên nhân sự, nhãn vai trò, chuyên môn bộ môn (Toán, Tiếng Anh đối với GV), nhãn giờ đăng ký rảnh đối với GV hoặc `Full ca` đối với nhân sự khác, số ca đã phân bổ trong tuần (`X ca/tuần`), mũi tên chỉ báo dòng đang xem.
  - **Bảng bên phải (Lịch trực chi tiết theo tuần của nhân sự đang chọn):**
    - Khối thông tin nhân sự: Tên, vai trò, cơ sở làm việc và tổng số ca trực tuần (`X ca`).
    - Bảng 7 ngày trong tuần: Thứ trong tuần, số ca trực trong ngày, các thẻ buổi trực (Sáng, Chiều, Tối + thời lượng trực), nhãn nổi bật `Đang chọn` tại ngày và ca đang thao tác.
  - **Chân hộp thoại:** Dòng chữ hiển thị tổng quân số đã chọn (`Đã chọn: X người trực`), nút `Hủy` và nút `Lưu phân bổ (X)`.

---

## 2. LUỒNG XỬ LÝ CHÍNH (MAIN FLOW - HAPPY PATH)

```mermaid
sequenceDiagram
    autonumber
    actor U as Quản lý cơ sở / Giáo vụ
    participant F as Giao diện Hộp thoại Phân bổ (Station)
    participant CRM as Hệ thống CRM (Phân quyền)
    participant S as Hệ thống Máy chủ Station
    participant DB as Cơ sở dữ liệu

    U->>F: Kích hoạt mở hộp thoại (Bấm ô ca hoặc nút + Sửa)
    F->>CRM: Xác thực quyền hạn người dùng (Nhãn STATION -> Lịch trực test)
    CRM-->>F: Trả về trạng thái quyền Xem và quyền Sửa
    
    alt Không có Quyền Sửa (edit) hoặc bị gỡ bỏ quyền
        F-->>U: Chặn truy cập; Ẩn nút mở và không cho phép mở hộp thoại phân bổ
    else Có Quyền Sửa (edit)
        F->>S: Gửi yêu cầu lấy danh sách nhân sự cơ sở & dữ liệu phân bổ hiện tại
        S->>DB: Gọi đến cơ sở dữ liệu nhân sự và cơ sở dữ liệu phân bổ ca trực
        DB-->>S: Trả về danh sách nhân viên cơ sở và các phân bổ hiện có
        S->>DB: Gọi đến cơ sở dữ liệu lịch rảnh cá nhân để lấy giờ đăng ký của giáo viên
        DB-->>S: Trả về dữ liệu giờ rảnh đã đăng ký
        S-->>F: Phản hồi gói dữ liệu cấu hình ban đầu
        F-->>U: Hiển thị hộp thoại 2 bảng: Danh sách nhân sự (trái) và Lịch tuần (phải)

        opt Lọc vai trò hoặc Tìm kiếm
            U->>F: Bấm nút lọc vai trò (Giáo viên / Khác) hoặc nhập tên tìm kiếm
            F->>F: Lọc danh sách nhân sự hiển thị ở bảng bên trái
        end

        U->>F: Nhấp vào dòng một nhân sự để xem chi tiết
        F->>F: Cập nhật bảng bên phải hiển thị ma trận 7 ngày trực tuần của nhân sự đó

        U->>F: Tích chọn hoặc bỏ chọn ô đánh dấu trước tên nhân sự
        F->>F: Cập nhật tức thì số lượng ca tuần và thẻ [Đang chọn] ở bảng bên phải
        F->>F: Cập nhật tổng quân số tại chân hộp thoại: Đã chọn: X người trực

        U->>F: Nhấp nút [Lưu phân bổ (X)]
        F->>S: Gửi danh sách mã nhân sự được phân bổ cho ca trực
        S->>DB: Ghi nhận cập nhật vào cơ sở dữ liệu phân bổ ca trực
        DB-->>S: Xác nhận lưu dữ liệu thành công
        S-->>F: Phản hồi kết quả lưu thành công
        F-->>U: Hiển thị thông báo thành công, đóng hộp thoại và làm mới ma trận bên ngoài
    end
```

---

## 3. GIAO DIỆN, QUY TẮC KIỂM TRA DỮ LIỆU & PHÂN QUYỀN (UI, VALIDATION RULES & PERMISSION)

### 3.1. Cấu trúc Danh mục Phân quyền trên Hệ thống CRM (CRM Permission Mapping)

Cơ chế phân quyền của Hộp thoại Phân bổ nhân sự sử dụng chung bộ quyền được cấu hình dưới **nhãn STATION** trên hệ thống CRM:

```text
STATION (Nhãn phân hệ trạm / cơ sở)
└── Đăng ký lịch làm việc (work_registration)
    └── |--- Lịch trực test (roster)
             ├── [X] Quyền Xem  (Mã quyền: station.work_registration.roster.view)
             └── [X] Quyền Sửa  (Mã quyền: station.work_registration.roster.edit)
```

### 3.2. Cấu trúc các trường nhập liệu & Ràng buộc kiểm tra (Validation Rules)

| Tên trường thông tin | Kiểu hiển thị | Nguồn dữ liệu | Định dạng & Giới hạn | Diễn giải quy tắc kiểm duyệt dữ liệu |
|---|---|---|---|---|
| **Bộ lọc vai trò nhân sự** | Cụm nút bấm chọn nhanh | Danh mục vai trò | "Tất cả", "Giáo viên", "Khác" | Nhấp để lọc danh sách nhân sự ở bảng bên trái theo nhóm vai trò |
| **Ô tìm kiếm tên nhân sự** | Ô nhập văn bản kèm biểu tượng kính lúp | Người dùng nhập | Văn bản thường, tối đa 50 ký tự | Lọc tức thì danh sách nhân sự theo họ tên hoặc chức danh |
| **Ô đánh dấu phân bổ (Checkbox)** | Ô vuông đánh dấu kiểm | Dữ liệu phân bổ ca trực | Đã chọn (tích xanh) hoặc Chưa chọn | Yêu cầu quyền Sửa; nếu không có quyền Sửa thì bị ẩn hoàn toàn khỏi thẻ nhân sự |
| **Thông tin Vai trò & Môn học** | Nhãn văn bản kèm màu phân biệt | Danh mục nhân sự cơ sở | Giáo viên: hiển thị kèm môn ("Toán", "Tiếng Anh"); Nhóm Khác: hiển thị vai trò kèm nhãn "Hỗ trợ chung" | Tuyệt đối không gán môn chuyên môn (Toán, Tiếng Anh) cho nhân sự nhóm Khác; nhóm Khác phục vụ đón tiếp và hỗ trợ vận hành chung cho mọi môn |
| **Giờ trực của Giáo viên** | Nhãn giờ hiển thị nhỏ | Đối soát lịch rảnh cá nhân | "Full ca", khoảng giờ lẻ "HH:mm - HH:mm" hoặc "Chưa đăng ký" | Tự động tính từ dữ liệu tab Đăng ký; giáo viên chưa đăng ký sẽ báo cảnh báo |
| **Giờ trực của Nhân sự khác** | Nhãn giờ mặc định | Quy tắc hệ thống tự động | "Full ca" | Mặc định luôn nhận trọn vẹn ca trực do không có quy trình đăng ký lịch rảnh; không hiển thị trạng thái Chưa đăng ký |

### 3.3. Nút hành động trên biểu mẫu hộp thoại

| Tên nút | Kiểu hiển thị | Logic xử lý nghiệp vụ | Mã Quyền Yêu Cầu Từ CRM |
|---|---|---|---|
| **Hủy bỏ (Nút Hủy)** | Nút bấm viền nhạt | Đóng hộp thoại nổi, hủy bỏ mọi thay đổi tạm thời, giữ nguyên phân bổ cũ | `station.work_registration.roster.view` (Xem) |
| **Lưu phân bổ (X)** | Nút bấm màu nhấn kèm biểu tượng dấu kiểm | Gửi danh sách nhân sự đã chọn lên hệ thống để lưu vào cơ sở dữ liệu $\rightarrow$ Đóng hộp thoại $\rightarrow$ Cập nhật ô ca ngoài bảng; ẩn hoàn toàn nếu không có quyền Sửa | `station.work_registration.roster.edit` (Sửa) |

---

## 4. KHỐI CHỨC NĂNG CHI TIẾT: ACTION & LUỒNG KÍCH HOẠT (ACTIONS & EVENTS)

### Khối chức năng 1: Lọc, Tìm kiếm và Xem trước Nhân sự (Áp dụng Quyền Xem - view)

#### Action 1.1: Chuyển đổi Bộ lọc vai trò
* **Luồng kích hoạt:** Người dùng nhấp vào các nút `Tất cả`, `Giáo viên`, hoặc `Khác` trên đầu bảng bên trái.
* **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - **AC-1 (Happy Path - Lọc nhóm Giáo viên):**
    - **Giả sử:** Danh sách cơ sở có 10 nhân sự gồm 6 giáo viên và 4 nhân viên CS/vận hành.
    - **Khi:** Người dùng bấm nút `Giáo viên`.
    - **Thì:** Bảng bên trái chỉ hiển thị 6 giáo viên kèm thông tin môn dạy (Toán, Tiếng Anh) và giờ đăng ký rảnh.
  - **AC-2 (Happy Path - Lọc nhóm Khác):**
    - **Giả sử:** Người dùng muốn phân công nhân viên lễ tân hoặc chăm sóc khách hàng trực đón tiếp.
    - **Khi:** Người dùng bấm nút `Khác`.
    - **Thì:** Bảng bên trái chỉ hiển thị 4 nhân sự không phải giáo viên, nhãn phụ hiển thị "Hỗ trợ chung" (không gán môn chuyên môn), nhãn giờ trực hiển thị mặc định là "Full ca" (không báo trạng thái "Chưa đăng ký").

#### Action 1.2: Nhấp dòng xem chi tiết lịch tuần nhân sự (Focus Staff)
* **Luồng kích hoạt:** Người dùng nhấp vào bất kỳ vị trí nào trên dòng thẻ nhân sự (ngoài ô Checkbox).
* **Tiêu chí nghiệm thu:**
  - **AC-1 (Happy Path - Đổi tiêu điểm xem lịch):**
    - **Giả sử:** Bảng bên phải đang hiển thị lịch của nhân sự A.
    - **Khi:** Người dùng nhấp vào dòng của nhân sự B ở bảng bên trái.
    - **Thì:** Dòng nhân sự B được tô màu nền nổi bật, mũi tên điều hướng chỉ sang phải, bảng bên phải lập tức chuyển sang hiển thị đầy đủ thông tin tên, cơ sở và ma trận lịch trực 7 ngày trong tuần của nhân sự B.

---

### Khối chức năng 2: Tích chọn phân bổ và Lưu dữ liệu (Áp dụng Quyền Sửa - edit)

#### Action 2.1: Tích chọn / Bỏ chọn phân bổ nhân sự
* **Luồng kích hoạt:** Người dùng nhấp vào ô vuông đánh dấu chọn (Checkbox) tại dòng một nhân sự.
* **Tiêu chí nghiệm thu:**
  - **AC-1 (Happy Path - Có quyền sửa):**
    - **Giả sử:** Tài khoản người dùng có quyền `station.work_registration.roster.edit` từ CRM.
    - **Khi:** Người dùng nhấp vào ô đánh dấu trước tên "Sarah J.".
    - **Thì:** Ô đánh dấu chuyển sang màu nhấn có biểu tượng dấu kiểm, số ca tuần tăng thêm 1 ca, bảng bên phải bổ sung ngay ca đang chọn với nhãn nổi bật `Đang chọn`, dòng tổng kết chân trang tăng thêm 1 người.
  - **AC-2 (Unhappy Path - Bị gỡ bỏ quyền sửa hoặc không đủ quyền):**
    - **Giả sử:** Tài khoản người dùng bị gỡ bỏ quyền `station.work_registration.roster.edit` từ hệ thống CRM.
    - **Khi:** Người dùng đang mở hộp thoại hoặc cố tình thao tác.
    - **Thì:** Toàn bộ ô đánh dấu chọn (Checkbox) và nút `[Lưu phân bổ]` bị ẩn hoàn toàn khỏi giao diện; hệ thống chặn mọi thao tác lưu và tự động đóng hộp thoại.

#### Action 2.2: Bấm nút [Lưu phân bổ] để hoàn tất
* **Luồng kích hoạt:** Người dùng hoàn tất việc tích chọn nhân sự và nhấp nút `Lưu phân bổ (X)`.
* **Tiêu chí nghiệm thu:**
  - **AC-1 (Happy Path - Lưu thành công):**
    - **Giả sử:** Người dùng có quyền `station.work_registration.roster.edit` và đã chọn 3 nhân sự cho ca Chiều Thứ 4.
    - **Khi:** Người dùng nhấp nút `Lưu phân bổ (3)`.
    - **Thì:** Hệ thống gửi danh sách 3 mã nhân sự lên máy chủ để cập nhật cơ sở dữ liệu phân bổ ca trực, hiển thị thông báo thành công "Đã cập nhật ca Buổi chiều (Thứ 4)", đóng hộp thoại và làm mới ô ca Chiều Thứ 4 trên bảng ma trận ngoài với đúng 3 nhân sự vừa lưu.
  - **AC-2 (Alternate Path - Lưu ca không có người trực):**
    - **Giả sử:** Người dùng bỏ chọn toàn bộ nhân sự để giải phóng ca trực.
    - **Khi:** Người dùng bấm `Lưu phân bổ (0)`.
    - **Thì:** Hệ thống xác nhận xóa phân bổ của ca này, đóng hộp thoại và ô ca trên bảng ma trận ngoài chuyển về trạng thái "Chưa có người trực".

---

## 5. CÁC TRƯỜNG HỢP GÓC CẠNH & LUỒNG NGOẠI LỆ (CORNER CASES & EXCEPTION FLOWS)

- **[CASE-01] Đóng hộp thoại khi có thay đổi chưa lưu:**
  - *Tình huống:* Người dùng đã tích chọn thêm 2 nhân sự nhưng vô tình bấm nút Hủy hoặc nhấp chuột ra ngoài vùng hộp thoại.
  - *Cách xử lý:* Hệ thống lập tức hủy bỏ các thay đổi tạm thời, đóng hộp thoại và giữ nguyên trạng thái phân bổ đã lưu trước đó của ca trực mà không làm sai lệch dữ liệu.
- **[CASE-02] Giáo viên chưa đăng ký thời gian rảnh hoặc đã hủy bỏ lịch rảnh cá nhân:**
  - *Tình huống:* Giáo viên chưa đăng ký thời gian rảnh cho ca đang chọn, hoặc trước đó từng được gán vào ca nhưng sau đó đã tự ý hủy bỏ toàn bộ giờ rảnh tại tab cá nhân. Xử lý thuần túy khép kín trong phạm vi màn hình Lịch trực test, không can thiệp vào tab cá nhân.
  - *Cách xử lý:* Trong hộp thoại phân bổ, dòng giáo viên này hiển thị nhãn chữ màu đỏ "Chưa đăng ký", ô đánh dấu chọn (Checkbox) bị vô hiệu hóa (khóa mờ, không thể tích chọn). Nếu trước đó giáo viên từng nằm trong danh sách phân bổ cũ, hệ thống tự động loại bỏ (bỏ chọn) giáo viên này khỏi danh sách đang chọn, giúp người quản lý nhận biết ca trực đang bị khuyết người để chọn nhân sự khác thay thế trước khi bấm lưu phân bổ.
- **[CASE-03] Giáo viên có lịch rảnh không trùng khớp toàn bộ ca trực:**
  - *Tình huống:* Ca trực kéo dài từ `13:00 - 17:30`, nhưng giáo viên chỉ rảnh từ `13:00 - 15:00`.
  - *Cách xử lý:* Tại dòng nhân sự ở bảng trái và trong thẻ ca ở bảng phải, hệ thống hiển thị chính xác khung giờ `13:00 - 15:00` với nhãn màu hổ phách, giúp người quản lý nhận biết giáo viên chỉ trực được nửa đầu ca.
- **[CASE-04] Phân bổ quá nhiều ca trực cho cùng một nhân sự trong tuần:**
  - *Tình huống:* Nhân sự đã được phân bổ 6 ca trực trong tuần và người quản lý tiếp tục tích chọn thêm ca thứ 7.
  - *Cách xử lý:* Số ca tuần hiển thị nổi bật với số đếm tăng lên (`7 ca/tuần`) để người quản lý nhận thức được tần suất làm việc dày đặc, tránh giao việc quá tải.
- **[CASE-05] Mất kết nối mạng khi bấm nút Lưu phân bổ:**
  - *Tình huống:* Người dùng bấm nút Lưu đúng thời điểm đường truyền mạng bị gián đoạn.
  - *Cách xử lý:* Hệ thống không đóng hộp thoại, giữ nguyên toàn bộ các nhân sự đã tích chọn, đồng thời hiển thị thông báo lỗi mạng kèm nút "Thử lại" để người dùng không bị mất công thao tác.
- **[CASE-06] Xung đột chỉnh sửa đồng thời từ hai người quản lý:**
  - *Tình huống:* Hai giáo vụ cùng mở hộp thoại phân bổ ca Sáng Thứ 2 tại cùng một thời điểm và lưu các danh sách nhân sự khác nhau.
  - *Cách xử lý:* Hệ thống áp dụng nguyên tắc cập nhật theo mốc thời gian ghi nhận sau cùng vào cơ sở dữ liệu và hiển thị thông báo làm mới dữ liệu cho phiên làm việc còn lại.
- **[CASE-07] Quyền Sửa bị thu hồi trên CRM trong khi người dùng đang mở hộp thoại:**
  - *Tình huống:* Người quản lý đang mở hộp thoại chuẩn bị chọn nhân sự thì tài khoản bị người quản trị trên CRM thu hồi quyền Sửa.
  - *Cách xử lý:* Khi phát hiện quyền hạn bị thu hồi, hệ thống lập tức ẩn các ô đánh dấu chọn (Checkbox) và ẩn nút Lưu phân bổ, từ chối mọi yêu cầu ghi nhận dữ liệu, hiển thị cảnh báo "Quyền phân bổ nhân sự của bạn đã bị gỡ bỏ trên hệ thống CRM" và tự động đóng hộp thoại về màn hình chính.
- **[CASE-08] Nhân sự thuộc nhóm Khác không đăng ký giờ rảnh trên hệ thống:**
  - *Tình huống:* Nhân viên CS hoặc Quản lý được phân bổ trực ca nhưng không có dữ liệu đăng ký tại phân hệ Đăng ký ca làm việc của giáo viên.
  - *Cách xử lý:* Hệ thống không hiển thị cảnh báo "Chưa đăng ký", tự động gán mặc định thời lượng trực là trọn vẹn cả ca ("Full ca") và gán phạm vi phụ trách là "Hỗ trợ chung".

---

## 6. YÊU CẦU PHI CHỨC NĂNG & KẾT NỐI HỆ THỐNG (NON-FUNCTIONAL & SYSTEM INTEGRATION)

### 6.1. Yêu cầu phi chức năng (Non-functional Requirements)
- **Thời gian phản hồi:** Thời gian mở hộp thoại và tải dữ liệu nhân sự của ca $\le 0.8$ giây.
- **Tính phản hồi giao diện:** Phản ứng tích chọn nhân sự và cập nhật ma trận lịch tuần bên phải diễn ra tức thì $\le 50$ mili-giây.
- **Độ tin cậy:** Bảo toàn toàn vẹn dữ liệu ca trực khi có sự cố mạng hoặc đóng hộp thoại đột ngột.

### 6.2. Cơ chế kết nối hệ thống & Phân quyền CRM (CRM System Integration)
- Hộp thoại nạp danh sách quyền Xem/Sửa của tính năng `Lịch trực test` thuộc nhãn `STATION` từ hệ thống CRM.
- Hộp thoại gọi đến cơ sở dữ liệu phân bổ ca trực (`MasterShiftAssignment`) và cơ sở dữ liệu lịch rảnh cá nhân qua hàm điều phối nội bộ.
- Gửi lưu danh sách mã nhân sự qua cơ chế bất đồng bộ, phản hồi kết quả lưu thành công ngay lập tức để làm mới bảng ma trận ngoài.
