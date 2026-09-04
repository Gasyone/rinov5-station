# ĐẶC TẢ CHI TIẾT CƠ CHẾ PHÂN QUYỀN & PHẠM VI DỮ LIỆU PHÂN HỆ RINOEDU STATION

> **Tham chiếu tài liệu nền tảng:**  
> - **Capability:** `CAP-SYS` (Quản trị Hệ thống & Phân quyền)  
> - **Business Function:** `BF-SYS-04` (Entitlement & Authorization)  
> - **Chính sách doanh nghiệp:** `[POLICY-IAM-01]`, `[POLICY-IAM-02]`, `[POLICY-IAM-03]`, `[POLICY-ORG-01]`  
> - **Màn hình thực thi trên Station:** `/app/permissions`

---

## MỤC LỤC
1. [Bản chất Kiến trúc Phân quyền Station (Mô hình RBAC × ABAC)](#1-bản-chất-kiến-trúc-phân-quyền-station-mô-hình-rbac--abac)
2. [Mối quan hệ giữa Quyền thao tác và Phạm vi Dữ liệu](#2-mối-quan-hệ-giữa-quyền-thao-tác-và-phạm-vi-dữ-liệu)
3. [Quy tắc ràng buộc giữa "Truy cập", "Xem tất cả" và "Data Scope"](#3-quy-tắc-ràng-buộc-giữa-truy-cập-xem-tất-cả-và-data-scope)
4. [Tác động đa chiều của Data Scope lên từng Hành động (Xem, Thêm, Sửa, Xóa, Export)](#4-tác-động-đa-chiều-của-data-scope-lên-từng-hành-động)
5. [Đặc tả Chi tiết 32 Quyền Station phân tách theo 7 Phân hệ](#5-đặc-tả-chi-tiết-32-quyền-station-phân-tách-theo-7-phân-hệ)
   - [Phân hệ 1: Tuyển sinh & Trải nghiệm](#phân-hệ-1-tuyển-sinh--trải-nghiệm-admissions--placement)
   - [Phân hệ 2: Quản lý & Vận hành Lớp học](#phân-hệ-2-quản-lý--vận-hành-lớp-học-class-operations)
   - [Phân hệ 3: Chăm sóc Học viên & Dịch vụ (CARE)](#phân-hệ-3-chăm-sóc-học-viên--dịch-vụ-care)
   - [Phân hệ 4: Lịch biểu & Nhân sự Cơ sở](#phân-hệ-4-lịch-biểu--nhân-sự-cơ-sở-hr--scheduling)
   - [Phân hệ 5: Quản lý Học viên & Khách hàng Cơ sở](#phân-hệ-5-quản-lý-học-viên--khách-hàng-cơ-sở-students--crm)
   - [Phân hệ 6: Thu học phí, Đơn hàng & Sản phẩm](#phân-hệ-6-thu-học-phí-đơn-hàng--sản-phẩm-billing--orders)
   - [Phân hệ 7: Quản trị & Cấu hình Trạm](#phân-hệ-7-quản-trị--cấu-hình-trạm-station-administration)
6. [Đề xuất Mô hình Cấu hình 2 Tầng Kế thừa (Hybrid Inheritance)](#6-đề-xuất-mô-hình-cấu-hình-2-tầng-kế-thừa-hybrid-inheritance)
7. [Bảng Ánh xạ Quyền theo 5 Vị trí Công tác Điển hình tại Cơ sở](#7-bảng-ánh-xạ-quyền-theo-5-vị-trí-công-tác-điển-hình-tại-cơ-sở)
8. [Quy tắc Kỹ thuật Triển khai cho Đội ngũ Backend & Frontend](#8-quy-tắc-kỹ-thuật-triển-khai-cho-đội-ngũ-backend--frontend)

---

## 1. BẢN CHẤT KIẾN TRÚC PHÂN QUYỀN STATION (MÔ HÌNH RBAC × ABAC)

RinoEdu Station là phân hệ chuyên biệt phục vụ vận hành trường học/trung tâm (Center/School Management). Do đó, bài toán phân quyền tại Station không chỉ dừng lại ở việc **"Ai được bấm nút gì"** mà quan trọng hơn là **"Ai được nhìn thấy và can thiệp vào học sinh, lớp học, doanh thu của cơ sở nào"**.

Hệ thống kết hợp 2 chuẩn mực an ninh:
1. **RBAC (Role-Based Access Control):** Cấp phép theo chức danh vai trò đối với các **Hành động thao tác** (Thêm, Sửa, Xóa, Export, Xem tất cả).
2. **ABAC (Attribute-Based Access Control / Data Scope):** Kiểm soát **Biên giới dữ liệu** dựa trên ngữ cảnh công tác từ hồ sơ nhân sự (`CAP-HR`: cơ sở công tác, phòng ban/tổ bộ môn, mã người dùng).

```text
CÔNG THỨC QUYỀN THỰC THI (Effective Permission Formula):
┌───────────────────────────┐     ┌────────────────────────────┐     ┌────────────────────────────────────┐
│   HÀNH ĐỘNG THAO TÁC      │     │     PHẠM VI DỮ LIỆU        │     │     QUYỀN THỰC THI THỰC TẾ         │
│   (Thêm, Sửa, Xóa, Export)│  ×  │ (Bản thân / Nhóm / Cơ sở)  │  =  │(Được Sửa/Xóa bản ghi cụ thể nào    │
│          [RBAC]           │     │          [ABAC]            │     │    trên giao diện và CSDL)         │
└───────────────────────────┘     └────────────────────────────┘     └────────────────────────────────────┘
```

---

## 2. MỐI QUAN HỆ GIỮA QUYỀN THAO TÁC VÀ PHẠM VI DỮ LIỆU

### Câu hỏi bản chất: *"Không phân quyền thì làm sao có Data Scope? Trước khi kích hoạt phân Data thì cần tối thiểu quyền gì?"*

> **Nguyên tắc bất biến:**  
> **QUYỀN TRUY CẬP LÀ ĐIỀU KIỆN TIÊN QUYẾT (Prerequisite Gatekeeper).**  
> Nếu một tài khoản **KHÔNG CÓ QUYỀN TRUY CẬP** (`access = false`) vào phân hệ, thì **PHẠM VI DỮ LIỆU HOÀN TOÀN VÔ NGHĨA (Bị vô hiệu hóa / Không áp dụng)**.

1. **Khi `access = false`:**
   - Hệ thống chặn ngay tại cổng (HTTP 403 Forbidden), người dùng không thể mở màn hình.
   - Toàn bộ quyền thao tác (`create`, `edit`, `delete`, `export`, `viewAll`) tự động bị tắt.
   - Cột **Phạm vi Dữ liệu (Data Scope)** bị khóa cứng (disabled) và hiển thị là `-` (Không áp dụng). Không thể chọn `personal`, `team` hay `branch`, vì tài khoản không có quyền bước vào phân hệ.
2. **Khi `access = true`:**
   - Chìa khóa vào phòng được kích hoạt.
   - Cột **Phạm vi Dữ liệu** được mở khóa để xác định: khi đã vào màn hình, tài khoản được nhìn thấy và thao tác trên tập dữ liệu nào.

---

## 3. QUY TẮC RÀNG BUỘC GIỮA "TRUY CẬP", "XEM TẤT CẢ" VÀ "DATA SCOPE"

Trên bảng ma trận phân quyền, có 3 cột liên quan chặt chẽ tới việc đọc dữ liệu nhưng mang vai trò hoàn toàn khác biệt:

| Tiêu chí | Cột "Truy cập" (`access`) | Cột "Xem tất cả" (`viewAll`) | Cột "Phạm vi Dữ liệu" (`scope`) |
|:---|:---|:---|:---|
| **Bản chất** | **Cửa ngõ vào màn hình** | **Đặc quyền xem không giới hạn / Bỏ qua bộ lọc** | **Biên giới dữ liệu toàn cục của phân hệ** |
| **Vai trò** | Quyết định người dùng có được nhìn thấy menu và tải giao diện phân hệ hay không. | Quyết định người dùng có được xem các bản ghi vượt ngoài trách nhiệm cá nhân (Super-view) hay không. | Xác định giới hạn tối đa mà người dùng có thể chạm tới (`personal`, `team`, `branch`, `global`). |
| **Ví dụ thực tế** | Có quyền vào màn *Khách hàng & Lead*. | Được xem cả những lead **không phân bổ cho mình**, xem SĐT đầy đủ không bị che `091****111`. | Xác định chỉ xem lead trong **Toàn cơ sở** của mình hay được xem **Toàn chuỗi** liên cơ sở. |

---

## 4. TÁC ĐỘNG ĐA CHIỀU CỦA DATA SCOPE LÊN TỪNG HÀNH ĐỘNG

> **Lưu ý quan trọng:** Data Scope **KHÔNG PHẢI chỉ áp dụng cho mỗi quyền Xem/Truy cập**, mà nó là **luật giới hạn chung cho TẤT CẢ các hành động Thêm, Sửa, Xóa, Export**:

| Hành động (Action) | Khi Scope = Bản thân (`personal`) | Khi Scope = Cùng nhóm (`team`) | Khi Scope = Toàn cơ sở (`branch`) | Khi Scope = Toàn chuỗi (`global`) |
|:---|:---|:---|:---|:---|
| **Xem / Truy cập (`read`)** | Chỉ thấy bản ghi do chính mình tạo hoặc được chỉ định phụ trách trực tiếp. | Thấy bản ghi của tất cả nhân sự trong cùng tổ/nhóm làm việc. | Thấy toàn bộ bản ghi thuộc phạm vi cơ sở/chi nhánh công tác. | Thấy bản ghi của toàn bộ các cơ sở trên toàn chuỗi. |
| **Sửa (`edit`)** | **Chỉ được sửa bản ghi của chính mình.** Bị chặn nếu cố sửa dữ liệu của đồng nghiệp khác. | Được sửa bản ghi thuộc quyền quản lý của nhóm mình. | **Được sửa bất kỳ bản ghi nào** trong cơ sở (thẩm quyền Quản lý/Giáo vụ cơ sở). | Được sửa bản ghi ở mọi cơ sở (thẩm quyền Ban Giám đốc/Admin tổng). |
| **Xóa / Hủy (`delete`)** | **Chỉ được xóa/hủy bản ghi do mình tạo** (VD: xóa ghi chú của mình, hủy buổi bù mình tạo). | Được xóa/hủy bản ghi thuộc thành viên trong nhóm. | **Được xóa/hủy bản ghi trong toàn cơ sở** (bắt buộc qua hộp thoại xác nhận `ConfirmDialog`). | Quyền xóa dữ liệu trên toàn hệ thống. |
| **Thêm mới (`create`)** | Bản ghi mới tạo tự động gắn quyền sở hữu cho chính mình (`owner = current_user`). | Bản ghi mới tạo thuộc về nhóm của người tạo. | Được tạo và chỉ định người phụ trách/lớp học cho bất kỳ ai tại cơ sở. | Được tạo bản ghi và chỉ định cho bất kỳ cơ sở nào trong chuỗi. |
| **Download / Export (`export`)** | **Chỉ xuất Excel dữ liệu cá nhân của mình** (VD: Giáo viên xuất danh sách lớp mình dạy). | Xuất Excel dữ liệu của cả nhóm kinh doanh/tổ chuyên môn. | **Xuất Excel dữ liệu toàn trường/cơ sở** (doanh thu, danh sách toàn bộ học sinh). | Xuất báo cáo dữ liệu cấp tập đoàn toàn chuỗi. |

---

## 5. ĐẶC TẢ CHI TIẾT 32 QUYỀN STATION PHÂN TÁCH THEO 7 PHÂN HỆ

Toàn bộ 32 tính năng của Station được phân bổ vào đúng **7 Phân hệ Vận hành Trạm**, mỗi phân hệ có bảng danh mục và bảng ngữ nghĩa Scope riêng biệt:

---

### PHÂN HỆ 1: TUYỂN SINH & TRẢI NGHIỆM (ADMISSIONS & PLACEMENT)
*Mục tiêu: Đánh giá năng lực đầu vào, tổ chức học thử và xếp lớp học viên mới.*

#### Bảng 1.1: Danh mục Quyền Phân hệ Tuyển sinh & Trải nghiệm
| STT | Mã Tính năng | Tên Tính năng / Quyền | Quyền Tiên quyết | Thao tác Hỗ trợ (RBAC) | Mô tả Nghiệp vụ |
|:---:|:---|:---|:---:|:---|:---|
| 1 | `adm_booking_test` | Lịch Kiểm tra / Booking Test | `Truy cập` | Truy cập, Thêm, Sửa, Xóa, Export, Xem tất cả | Đặt lịch hẹn đánh giá năng lực đầu vào và nhập điểm test của học sinh. |
| 2 | `adm_trial_class` | Lịch Học thử (Trial Class) | `Truy cập` | Truy cập, Thêm, Sửa | Tiếp nhận nhu cầu và ghép học viên trải nghiệm vào 1 buổi của lớp đang học. |
| 3 | `adm_class_placement` | Xếp lớp Học viên mới | `Truy cập` | Truy cập, Sửa | Ghép học viên vào danh sách lớp chính thức sau khi đóng đủ học phí. |

#### Bảng 1.2: Ngữ nghĩa Data Scope Phân hệ Tuyển sinh & Trải nghiệm
| Cấp độ Scope | Ý nghĩa đối với Xem/Truy cập | Ý nghĩa đối với Thêm / Sửa / Xóa |
|:---|:---|:---|
| **Bản thân (`personal`)** | Chỉ xem booking test và ca học thử do chính mình đặt hẹn hoặc được chỉ định chấm điểm. | Chỉ sửa/hủy booking test do chính mình tạo; không thể sửa lịch test của tư vấn viên khác. |
| **Cùng nhóm (`team`)** | Xem lịch test và kết quả đánh giá của các tư vấn viên trong cùng nhóm tuyển sinh. | Sửa/hỗ trợ cập nhật điểm test cho các thành viên trong nhóm. |
| **Toàn cơ sở (`branch`)** | Xem toàn bộ lịch test, học thử và danh sách học viên chờ xếp lớp của toàn cơ sở. | Giáo vụ/Quản lý cơ sở điều phối giám khảo, duyệt xếp lớp cho học viên toàn cơ sở. |
| **Toàn chuỗi (`global`)** | Tra cứu kết quả test và lịch tuyển sinh liên cơ sở trên toàn hệ thống. | Toàn quyền điều phối tuyển sinh liên chi nhánh. |

---

### PHÂN HỆ 2: QUẢN LÝ & VẬN HÀNH LỚP HỌC (CLASS OPERATIONS)
*Mục tiêu: Quản lý sĩ số, phòng học, giáo viên, điểm danh chuyên cần, nghỉ phép và học bù.*

#### Bảng 2.1: Danh mục Quyền Phân hệ Vận hành Lớp học
| STT | Mã Tính năng | Tên Tính năng / Quyền | Quyền Tiên quyết | Thao tác Hỗ trợ (RBAC) | Mô tả Nghiệp vụ |
|:---:|:---|:---|:---:|:---|:---|
| 4 | `ops_classes` | Quản lý Lớp học | `Truy cập` | Truy cập, Thêm, Sửa, Xóa, Export, Xem tất cả | Tạo lớp, cập nhật phòng học, đổi giáo viên, chia ca và thời khóa biểu. |
| 5 | `ops_attendance_evaluation` | Điểm danh & Đánh giá buổi học | `Truy cập` | Truy cập, Sửa, Export | Điểm danh chuyên cần, chấm BTVN và ghi nhận xét học sinh theo buổi. |
| 6 | `ops_leave_reserve` | Bảo lưu & Nghỉ phép học viên | `Truy cập` | Truy cập, Thêm, Sửa | Tiếp nhận và duyệt đơn xin nghỉ phép, tạm dừng hoặc bảo lưu gói học. |
| 7 | `ops_makeup_class` | Quản lý & Sắp xếp Học bù | `Truy cập` | Truy cập, Thêm, Sửa | Tạo ca học bù và xếp lịch học bù cho học sinh có phép vắng mặt. |

#### Bảng 2.2: Ngữ nghĩa Data Scope Phân hệ Vận hành Lớp học
| Cấp độ Scope | Ý nghĩa đối với Xem/Truy cập | Ý nghĩa đối với Thêm / Sửa / Xóa |
|:---|:---|:---|
| **Bản thân (`personal`)** | Chỉ thấy các lớp do mình trực tiếp giảng dạy (Giáo viên chính/Trợ giảng) hoặc chủ nhiệm. | Chỉ được điểm danh, chấm BTVN trên các lớp do mình dạy; không thể can thiệp lớp khác. |
| **Cùng nhóm (`team`)** | Thấy các lớp học thuộc tổ chuyên môn bộ môn phụ trách (Tổ Toán, Tổ Tiếng Anh...). | Trưởng bộ môn kiểm tra giáo án, duyệt kết quả đánh giá của giáo viên trong tổ. |
| **Toàn cơ sở (`branch`)** | Thấy toàn bộ danh sách lớp học, phòng học, lịch bù và học viên nghỉ phép của cơ sở. | Giáo vụ cơ sở toàn quyền xếp phòng, đổi giáo viên, duyệt bảo lưu học phí toàn trường. |
| **Toàn chuỗi (`global`)** | Xem danh mục và sĩ số lớp học của tất cả các chi nhánh trên toàn hệ thống. | Giám đốc đào tạo tập đoàn theo dõi chất lượng và chuẩn hóa lộ trình toàn chuỗi. |

---

### PHÂN HỆ 3: CHĂM SÓC HỌC VIÊN & DỊCH VỤ (STUDENT CARE & RETENTION)
*Mục tiêu: Kiểm soát rủi ro nghỉ học (churn), xử lý khiếu nại và phễu gia hạn/tái phí.*

#### Bảng 3.1: Danh mục Quyền Phân hệ Chăm sóc Học viên
| STT | Mã Tính năng | Tên Tính năng / Quyền | Quyền Tiên quyết | Thao tác Hỗ trợ (RBAC) | Mô tả Nghiệp vụ |
|:---:|:---|:---|:---:|:---|:---|
| 8 | `care_operations_alert` | Cảnh báo & Vận hành Chăm sóc | `Truy cập` | Truy cập, Thêm, Sửa, Export, Xem tất cả | Xử lý các ca cảnh báo học tập, gọi điện tương tác, ghi nhật ký CSKH. |
| 9 | `care_dispatcher` | Điều phối & Gán nhân sự CSKH | `Truy cập` | Truy cập, Sửa | Phân bổ danh sách học viên cho các chuyên viên CSKH phụ trách. |
| 10 | `care_renewal` | Quản lý Tái phí & Phễu gia hạn | `Truy cập` | Truy cập, Sửa, Export | Theo dõi hạn học dự kiến, chăm sóc tái phí theo chu kỳ tháng T, T+1. |
| 11 | `care_tickets` | Quản lý Ticket & Khiếu nại dịch vụ | `Truy cập` | Truy cập, Thêm, Sửa, Xóa | Tiếp nhận phản ánh chất lượng và theo dõi tiến độ giải quyết khiếu nại SLA. |

#### Bảng 3.2: Ngữ nghĩa Data Scope Phân hệ Chăm sóc Học viên
| Cấp độ Scope | Ý nghĩa đối với Xem/Truy cập | Ý nghĩa đối với Thêm / Sửa / Xóa |
|:---|:---|:---|
| **Bản thân (`personal`)** | Chỉ nhận và xem các ca cảnh báo, ticket khiếu nại, học viên tái phí gán cho chính mình. | Chỉ được cập nhật nhật ký gọi điện, đóng ticket do mình phụ trách xử lý. |
| **Cùng nhóm (`team`)** | Xem toàn bộ cảnh báo và ticket trong phạm vi nhóm/tổ CSKH mình sinh hoạt. | Hỗ trợ tương tác chéo, nhận bàn giao ca chăm sóc của đồng nghiệp trong nhóm. |
| **Toàn cơ sở (`branch`)** | Xem toàn bộ cảnh báo học sinh nghỉ học nhiều, phản ánh phụ huynh toàn cơ sở. | Trưởng nhóm/Quản lý CSKH cơ sở toàn quyền phân bổ học viên, điều phối xử lý ticket. |
| **Toàn chuỗi (`global`)** | Theo dõi chỉ số hài lòng (CSAT), tỷ lệ tái phí và khiếu nại dịch vụ toàn chuỗi. | Ban Giám sát Dịch vụ khách hàng tập đoàn kiểm tra và xử lý khiếu nại nghiêm trọng. |

---

### PHÂN HỆ 4: LỊCH BIỂU & NHÂN SỰ CƠ SỞ (HR & SCHEDULING)
*Mục tiêu: Đăng ký ca làm việc, phân công giảng dạy, duyệt dạy thay và quản lý nhân sự trạm.*

#### Bảng 4.1: Danh mục Quyền Phân hệ Lịch biểu & Nhân sự
| STT | Mã Tính năng | Tên Tính năng / Quyền | Quyền Tiên quyết | Thao tác Hỗ trợ (RBAC) | Mô tả Nghiệp vụ |
|:---:|:---|:---|:---:|:---|:---|
| 12 | `hr_my_schedule` | Lịch của tôi & Đăng ký ca | `Truy cập` | Truy cập, Thêm, Sửa | Xem thời khóa biểu cá nhân, đăng ký khung giờ rảnh/ca làm việc hàng tuần. |
| 13 | `hr_teacher_assignment` | Phân công Giảng dạy & Dạy thay | `Truy cập` | Truy cập, Sửa, Export | Phân công giáo viên chủ nhiệm, duyệt đơn báo nghỉ và phân công dạy thay. |
| 14 | `hr_employees_directory` | Hồ sơ Nhân sự & Hợp đồng | `Truy cập` | Truy cập, Thêm, Sửa, Xóa, Export | Quản lý danh sách giáo viên, trợ giảng và nhân viên tại cơ sở. |
| 15 | `hr_reports_exec` | Báo cáo Vận hành Cơ sở | `Truy cập` | Truy cập, Export | Báo cáo chuyên cần, doanh thu cơ sở, KPI chăm sóc, tổng giờ giảng dạy. |
| 16 | `usr_work_schedule` | Thời khóa biểu cơ sở | `Truy cập` | Truy cập, Thêm, Sửa, Xóa, Xem tất cả | Thời khóa biểu làm việc và ca trực hàng tuần của toàn thể nhân sự. |
| 17 | `usr_appointments` | Lịch hẹn phụ huynh | `Truy cập` | Truy cập, Thêm, Sửa, Xóa, Xem tất cả | Sổ lịch hẹn tiếp đón phụ huynh và học sinh tại sảnh cơ sở. |

#### Bảng 4.2: Ngữ nghĩa Data Scope Phân hệ Lịch biểu & Nhân sự
| Cấp độ Scope | Ý nghĩa đối với Xem/Truy cập | Ý nghĩa đối với Thêm / Sửa / Xóa |
|:---|:---|:---|
| **Bản thân (`personal`)** | Chỉ xem lịch dạy, ca trực và hồ sơ thông tin cá nhân của chính mình. | Chỉ được tự đăng ký/hủy ca làm việc cá nhân trước hạn chốt lịch hàng tuần. |
| **Cùng nhóm (`team`)** | Xem lịch dạy và ca trực của đồng nghiệp cùng tổ bộ môn. | Thỏa thuận đổi ca, nhận dạy thay cho đồng nghiệp trong cùng tổ chuyên môn. |
| **Toàn cơ sở (`branch`)** | Xem toàn bộ bảng phân công giáo viên, sổ lịch hẹn và danh bạ nhân sự cơ sở. | Quản lý cơ sở toàn quyền xếp ca trực, duyệt nghỉ phép giáo viên, ký hợp đồng nhân sự. |
| **Toàn chuỗi (`global`)** | Quản lý danh bạ nhân sự và điều động giáo viên/nhân sự trên toàn bộ hệ thống. | Ban Nhân sự tập đoàn luân chuyển nhân sự, duyệt chính sách lương thưởng toàn chuỗi. |

---

### PHÂN HỆ 5: QUẢN LÝ HỌC VIÊN & KHÁCH HÀNG CƠ SỞ (STUDENTS & CRM)
*Mục tiêu: Quản lý hồ sơ học viên, thông tin phụ huynh, mối quan hệ gia đình và lịch sử tương tác.*

> 💡 **LƯU Ý KIẾN TRÚC VỀ CÁC QUYỀN LẺ (Action-Level Permissions):**  
> Các quyền `crm_transfer_owner` (chuyển người phụ trách), `crm_transfer_relation` (gộp/chuyển quan hệ gia đình), `crm_search_all` (tra cứu toàn hệ thống) và `crm_care_contact` (ghi log chăm sóc) vốn là **các nút bấm hành động nhạy cảm** nằm trên giao diện Hồ sơ Khách hàng. Chúng được hệ thống tách thành các dòng phân quyền độc lập nhằm mục đích kiểm soát bảo mật chuyên sâu (tránh việc nhân viên tự ý đổi data, gộp nhầm mất lịch sử hoặc tuồn thông tin ra ngoài).

#### Bảng 5.1: Danh mục Quyền Phân hệ Học viên & Khách hàng Cơ sở
| STT | Mã Tính năng | Tên Tính năng / Quyền | Quyền Tiên quyết | Thao tác Hỗ trợ (RBAC) | Mô tả Nghiệp vụ |
|:---:|:---|:---|:---:|:---|:---|
| 18 | `crm_customer_info` | Thông tin Khách hàng / Học viên | `Truy cập` | Truy cập, Thêm, Sửa, Xóa, Export, Xem tất cả | Xem, thêm mới, sửa hồ sơ thông tin khách hàng tiềm năng và học viên. |
| 19 | `crm_transfer_owner` | Chuyển người phụ trách | `Truy cập` | Truy cập, Sửa | Bàn giao, điều phối lead giữa các chuyên viên tư vấn / CSKH. |
| 20 | `crm_transfer_relation` | Chuyển quan hệ & Hộ gia đình | `Truy cập` | Truy cập, Sửa | Gộp hộ gia đình, liên kết phụ huynh và học sinh anh chị em ruột. |
| 21 | `crm_search_all` | Tra cứu hồ sơ | `Truy cập` | Truy cập | Tìm kiếm không giới hạn số điện thoại và hồ sơ khách hàng. |
| 22 | `crm_care_contact` | Lịch sử Chăm sóc Contact | `Truy cập` | Truy cập | Ghi nhật ký cuộc gọi, tạo lịch nhắc tương tác với khách hàng. |

#### Bảng 5.2: Ngữ nghĩa Data Scope Phân hệ Học viên & Khách hàng Cơ sở
| Cấp độ Scope | Ý nghĩa đối với Xem/Truy cập | Ý nghĩa đối với Thêm / Sửa / Xóa |
|:---|:---|:---|
| **Bản thân (`personal`)** | Chỉ xem hồ sơ lead/học viên do chính mình phụ trách (ẩn SĐT dạng `091****111`). | Chỉ được sửa thông tin liên hệ của học viên mình chăm sóc; không thể sửa hồ sơ người khác. |
| **Cùng nhóm (`team`)** | Xem danh sách học viên của các thành viên trong cùng nhóm tư vấn/CSKH. | Bàn giao, chia sẻ thông tin học viên trong nội bộ nhóm. |
| **Toàn cơ sở (`branch`)** | Tra cứu và xem toàn bộ học viên đang theo học tại cơ sở công tác. | Bàn giao học viên giữa các phòng ban trong cơ sở, gộp hộ gia đình học chung trường. |
| **Toàn chuỗi (`global`)** | Tìm kiếm học viên liên cơ sở (phục vụ việc chuyển trường, tra cứu lịch sử). | Điều chuyển hồ sơ học viên giữa cơ sở A và cơ sở B khi học viên chuyển nơi ở. |

---

### PHÂN HỆ 6: THU HỌC PHÍ, ĐƠN HÀNG & SẢN PHẨM (BILLING & ORDERS)
*Mục tiêu: Tạo đơn đăng ký khóa học, thu học phí tại quầy, xuất phiếu thu và theo dõi doanh thu trạm.*

#### Bảng 6.1: Danh mục Quyền Phân hệ Thu học phí, Đơn hàng & Sản phẩm
| STT | Mã Tính năng | Tên Tính năng / Quyền | Quyền Tiên quyết | Thao tác Hỗ trợ (RBAC) | Mô tả Nghiệp vụ |
|:---:|:---|:---|:---:|:---|:---|
| 23 | `ord_orders` | Đơn hàng & Học phí | `Truy cập` | Truy cập, Thêm, Sửa, Xóa, Export, Xem tất cả | Lập đơn hàng khóa học, áp dụng mã ưu đãi và tính học phí. |
| 24 | `ord_confirm_payment` | Xác nhận đóng học phí | `Truy cập` | Truy cập | Duyệt chuyển khoản, in phiếu thu tiền học phí tại quầy. |
| 25 | `rpt_revenue` | Báo cáo doanh thu | `Truy cập` | Truy cập | Báo cáo doanh thu thực thu, công nợ và hoàn phí cơ sở. |
| 26 | `rpt_personal_achievement` | Báo cáo thành tích cá nhân | `Truy cập` | Truy cập | Theo dõi tiến độ hoàn thành chỉ tiêu doanh thu cá nhân. |
| 27 | `prd_products` | Khóa học & Học liệu | `Truy cập` | Truy cập, Thêm, Sửa, Xóa | Quản lý danh mục khóa học đơn lẻ, sách và học liệu. |
| 28 | `prd_combos` | Combo gói học | `Truy cập` | Truy cập, Thêm, Sửa, Xóa | Gói học dài hạn kết hợp nhiều môn hoặc nhiều cấp độ. |
| 29 | `mkt_campaigns` | Ưu đãi & Voucher học phí | `Truy cập` | Truy cập, Thêm, Sửa, Xóa | Mã giảm giá, voucher và chương trình ưu đãi học phí. |

#### Bảng 6.2: Ngữ nghĩa Data Scope Phân hệ Thu học phí & Đơn hàng
| Cấp độ Scope | Ý nghĩa đối với Xem/Truy cập | Ý nghĩa đối với Thêm / Sửa / Xóa |
|:---|:---|:---|
| **Bản thân (`personal`)** | Chỉ xem các đơn hàng và phiếu thu do chính mình tạo ra; theo dõi KPI cá nhân. | Chỉ được hủy/chỉnh sửa đơn hàng nháp do chính mình tạo trước khi thanh toán. |
| **Cùng nhóm (`team`)** | Xem đơn hàng và doanh số của các thành viên trong nhóm kinh doanh. | Trưởng nhóm hỗ trợ duyệt đơn hàng của nhân viên trong nhóm. |
| **Toàn cơ sở (`branch`)** | Xem toàn bộ đơn hàng, công nợ và báo cáo doanh thu thực thu của toàn cơ sở. | Thu ngân/Kế toán cơ sở xác nhận tiền về, in phiếu thu, duyệt chính sách học phí cơ sở. |
| **Toàn chuỗi (`global`)** | Xem tổng hợp doanh thu và công nợ toàn hệ sinh thái RinoEdu. | Kế toán trưởng/Ban Giám đốc duyệt hoàn phí, cấu hình bảng giá và combo toàn chuỗi. |

---

### PHÂN HỆ 7: CẤU HÌNH & QUẢN TRỊ TRẠM (STATION ADMINISTRATION)
*Mục tiêu: Cấu hình quy tắc cảnh báo, thiết lập ma trận phân quyền và quản trị tài khoản người dùng.*

#### Bảng 7.1: Danh mục Quyền Phân hệ Quản trị Trạm
| STT | Mã Tính năng | Tên Tính năng / Quyền | Quyền Tiên quyết | Thao tác Hỗ trợ (RBAC) | Mô tả Nghiệp vụ |
|:---:|:---|:---|:---:|:---|:---|
| 30 | `sys_care_conditions` | Quy tắc Cảnh báo CSKH | `Truy cập` | Truy cập, Thêm, Sửa, Xóa | Cấu hình quy tắc kích hoạt cảnh báo, SLA giờ, vai trò phụ trách. |
| 31 | `sys_permissions_matrix` | Quản lý Quyền & Ma trận | `Truy cập` | Truy cập, Thêm, Sửa, Xóa | Định nghĩa Topic, Nhóm quyền (Roles), cấp phép thao tác và Data Scope. |
| 32 | `sys_user_accounts` | Tài khoản & Gán Role | `Truy cập` | Truy cập, Thêm, Sửa, Xóa | Tạo tài khoản đăng nhập, gán nhóm quyền, khóa/mở khóa tài khoản. |

#### Bảng 7.2: Ngữ nghĩa Data Scope Phân hệ Quản trị Trạm
| Cấp độ Scope | Ý nghĩa đối với Xem/Truy cập | Ý nghĩa đối với Thêm / Sửa / Xóa |
|:---|:---|:---|
| **Toàn cơ sở (`branch`)** | Xem danh sách tài khoản và nhóm quyền áp dụng cho nhân sự tại cơ sở mình quản lý. | Giám đốc cơ sở cấp tài khoản cho giáo viên mới, gán nhóm quyền trong phạm vi cơ sở. |
| **Toàn chuỗi (`global`)** | Quản trị toàn bộ danh mục tài khoản, nhóm quyền và quy tắc an ninh toàn hệ thống. | Quản trị viên hệ thống (System Admin) thiết lập ma trận bảo mật chung cho toàn nền tảng. |

---

## 6. ĐỀ XUẤT MÔ HÌNH CẤU HÌNH 2 TẦNG KẾ THỪA (HYBRID INHERITANCE)

Để tối ưu hóa giao diện `/app/permissions` giúp quản trị viên cấu hình nhanh nhưng vẫn linh hoạt tuyệt đối:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ TẦNG 1: PHẠM VI MẶC ĐỊNH CỦA NHÓM QUYỀN (Role Default Scope)          │
│ Cấu hình tại khối "Thông tin quyền". Ví dụ chọn: [Toàn cơ sở]          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Tự động áp dụng cho tất cả 32 tính năng
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ TẦNG 2: NGOẠI LỆ TỪNG TÍNH NĂNG (Feature-Level Override)               │
│ Dropdown trên từng dòng mặc định hiển thị: [-- Kế thừa: Toàn cơ sở --] │
│ Chỉ cần đổi khi có ngoại lệ:                                           │
│  • Đơn hàng & Học phí    ──> Chọn lại: [Bản thân]                      │
│  • Lịch làm việc cá nhân ──> Chọn lại: [Bản thân]                      │
│  • Các tính năng khác    ──> Giữ nguyên: [-- Kế thừa --]               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 7. BẢNG ÁNH XẠ QUYỀN THEO 5 VỊ TRÍ CÔNG TÁC ĐIỂN HÌNH TẠI CƠ SỞ

Dưới đây là gợi ý cấu hình mẫu cho 5 chức danh vận hành thực tế tại Station:

| Chức danh công tác | Scope Mặc định | Phân hệ Được phép Truy cập | Các Ngoại lệ Scope đặc thù |
|:---|:---:|:---|:---|
| **1. Giám đốc Cơ sở (Branch Manager)** | `Toàn cơ sở` | Toàn bộ 7 Phân hệ (Toàn quyền quản trị cơ sở) | Kế thừa toàn bộ `Toàn cơ sở` cho cả 32 tính năng. |
| **2. Giáo vụ Cơ sở (Academic Officer)** | `Toàn cơ sở` | • Tuyển sinh & Xếp lớp<br/>• Vận hành Lớp học<br/>• Lịch biểu & Nhân sự | • Đơn hàng: Chỉ xem (`Bản thân` hoặc Không truy cập).<br/>• Quản trị hệ thống: Không truy cập. |
| **3. Giáo viên chính (Teacher)** | `Bản thân` | • Vận hành Lớp học (Điểm danh, nhận xét)<br/>• Lịch biểu cá nhân (`hr_my_schedule`) | • Màn Quản lý lớp: Cần xem danh mục lớp của `Toàn cơ sở` để biết phòng trống, nhưng chỉ sửa/điểm danh lớp của `Bản thân`. |
| **4. Chuyên viên CSKH (Care Officer)** | `Bản thân` | • Chăm sóc Học viên & Dịch vụ<br/>• Hồ sơ Học viên cơ sở<br/>• Lịch hẹn phụ huynh | • Phân công/Điều phối: Không truy cập.<br/>• Hồ sơ học sinh: Scope `Toàn cơ sở` (nhưng chỉ sửa khách do mình phụ trách). |
| **5. Tư vấn Tuyển sinh (EC / Sale)** | `Bản thân` | • Tuyển sinh (Booking test, học thử)<br/>• Đơn hàng & Học phí (Tạo đơn)<br/>• Hồ sơ Khách hàng | • Đơn hàng: Chỉ xem/tạo đơn của `Bản thân`.<br/>• Lớp học: Chỉ xem thời khóa biểu các lớp `Toàn cơ sở` để tư vấn cho phụ huynh. |

---

## 8. QUY TẮC KỸ THUẬT TRIỂN KHAI CHO ĐỘI NGŨ BACKEND & FRONTEND

1. **Nguyên tắc "Mặc định Từ chối" (Default Deny):**  
   Bất kỳ API gọi dữ liệu nào nếu không tìm thấy bản ghi cấp quyền hợp lệ trong phiên làm việc đều phải trả về mã lỗi `403 Forbidden`.
2. **Bộ lọc CSDL theo Data Scope (Backend Query Enforcement):**
   - `Scope === 'personal'`: Nối thêm điều kiện `WHERE created_by = user.id OR owner_id = user.id`.
   - `Scope === 'team'`: Nối thêm điều kiện `WHERE team_id = user.team_id`.
   - `Scope === 'branch'`: Nối thêm điều kiện `WHERE branch_id = user.branch_id`.
   - `Scope === 'global'`: Không nối điều kiện lọc chi nhánh.
3. **Che Số điện thoại trên Bảng danh sách:**  
   Toàn bộ số điện thoại hiển thị trên danh sách bảng (List page) bắt buộc phải che ẩn ở giữa dạng `091****111`. Chỉ khi người dùng có thẩm quyền mở hộp thoại Chi tiết mới được hiển thị số đầy đủ.
4. **Cộng dồn Quyền hạn (Effective Permission Union):**  
   Khi một nhân sự kiêm nhiệm nhiều vai trò (được gán nhiều Role), quyền hạn thực tế là phép Hợp (Union) của tất cả các quyền thành phần, và Data Scope lấy theo mức rộng nhất giữa các Role active.
