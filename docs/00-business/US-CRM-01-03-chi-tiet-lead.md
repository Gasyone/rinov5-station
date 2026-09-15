---
id: US-CRM-01-03
title: "Màn hình Chi tiết Khách hàng tiềm năng (Lead Detail & Handoff)"
bf: BF-CRM-01
domain: CAP-ADM
persona: "PERSONA-SALE"
sr: "SR-SALE-001"
tags: [crm, lead, detail, handoff]
---

# US-CRM-01-03: Màn hình Chi tiết Khách hàng tiềm năng (Lead Detail & Handoff)

> **Tham chiếu:** `BF-CRM-01` · `SR-SALE-001` · Giao diện Mẫu §4.3 (Chi tiết)  
> **Đường dẫn màn hình & Trạng thái liên quan:**  
> - `/app/crm_leads` (Hộp thoại chi tiết Lead) -> Trạng thái: `[Mới tiếp nhận, Đang tư vấn, Hẹn trải nghiệm, Chờ chốt deal, Đã chuyển đổi, Thất bại / Lưu kho]`  

---

## 1. NHẬT KÝ THAY ĐỔI & BỐI CẢNH (CHANGELOG & CONTEXT)

### Lịch sử cập nhật tài liệu (Changelog)

| Ngày cập nhật | Nội dung cập nhật | Lý do cập nhật |
|---|---|---|
| 14/09/2026 | Cập nhật cấu trúc màn hình chi tiết: đưa trường học và học lực lên thẻ tiêu đề, chuyển nhân sự phụ trách sang tiêu đề phễu vòng đời, chuẩn hóa thông tin học viên luôn hiển thị với 3 trạng thái đánh giá năng lực, thiết kế phẳng phần tâm lý, gộp thông tin phụ huynh và đưa danh sách con khác xuống dưới cùng | Tối ưu hóa trải nghiệm xem hồ sơ học viên tiềm năng và đồng bộ giao diện theo thực tế nghiệp vụ |
| 09/09/2026 | Khởi tạo tài liệu đặc tả màn hình Chi tiết Lead, bổ sung quy trình Stepper 5 bước, chuẩn hóa danh mục Điểm rơi (Drop-off Taxonomy), cơ chế bàn giao vận hành khi chốt đơn và tái kích hoạt sau 6 tháng không hoạt động | Chuẩn hóa nghiệp vụ chăm sóc khách hàng tiềm năng và liên thông dữ liệu học vụ |

### Bối cảnh & Vấn đề nghiệp vụ (Context & Problem)
* **Bối cảnh:** Thuộc phân hệ Tuyển sinh & Thương mại (`CAP-ADM`), màn hình Chi tiết Lead cung cấp không gian tương tác một cửa cho Tư vấn viên (Sales) thực hiện gọi điện, tư vấn, đặt lịch đánh giá năng lực, lên đơn hàng và theo dõi dòng thời gian tương tác của từng học viên tiềm năng.
* **Vấn đề hiện tại:** Bản cũ sử dụng hộp thoại thông tin thô, ghi chú tự do viết tắt không thể đo lường tỷ lệ rớt phễu, chưa phân định rõ ranh giới bàn giao giữa Sales và Vận hành lớp học, đồng thời thiếu cơ chế mở chu kỳ bán mới khi học viên cũ ngừng học sau 6 tháng.
* **Mục tiêu & Giá trị mang lại:**
  1. Trực quan hóa quy trình chuyển đổi 5 chặng bằng thanh tiến trình trực quan.
  2. Đo lường chính xác "điểm rơi" bằng danh mục lý do rớt chuẩn hóa theo từng chặng.
  3. Bàn giao dứt điểm cho Vận hành khi chốt đơn, giải phóng áp lực chăm sóc cho Sales.
  4. Hỗ trợ kích hoạt chu kỳ bán mới cho học viên không hoạt động trên 180 ngày mà vẫn bảo toàn lịch sử cũ.

### Hiểu người dùng & Tình huống sử dụng (User Needs & Use Cases)
* **Người dùng chính (Persona):** Tư vấn viên tuyển sinh (`PERSONA-SALE`) và Quản lý chi nhánh (`PERSONA-BRANCH_MANAGER`).
* **Nhu cầu thực tế (Needs):** Xem số điện thoại đầy đủ để bấm gọi điện ngay (Click-to-Call), ghi nhận nhanh biên bản trao đổi, biết chính xác lý do khách từ chối để hệ thống nuôi dưỡng tự động.
* **Câu phát biểu nghiệp vụ:** **Là một** Tư vấn viên tuyển sinh, **tôi muốn** xem hồ sơ chi tiết, bấm gọi điện trực tiếp, cập nhật tiến trình và ghi nhận nguyên nhân từ chối chuẩn hóa, **để** nâng cao tỷ lệ chuyển đổi và hỗ trợ phân tích điểm rò rỉ của phễu bán hàng.

---

## 2. LUỒNG XỬ LÝ CHÍNH (MAIN FLOW - HAPPY PATH)

```mermaid
sequenceDiagram
    autonumber
    actor U as Tư vấn viên
    participant F as Hộp thoại Chi tiết Lead
    participant S as Hệ thống Máy chủ
    participant DB as Cơ sở dữ liệu khách hàng

    U->>F: Bấm xem chi tiết học viên từ danh sách
    F->>S: Gửi yêu cầu lấy hồ sơ chi tiết và dòng thời gian
    S->>S: Kiểm tra quyền hạn và phạm vi cơ sở
    S->>DB: Gọi đến cơ sở dữ liệu khách hàng tiềm năng
    DB-->>S: Trả về thông tin bé, phụ huynh, đơn hàng và lịch sử chăm sóc
    S-->>F: Phản hồi thông tin đầy đủ
    F-->>U: Hiển thị thanh tiến trình 5 bước và hồ sơ 2 cột

    U->>F: Bấm nút gọi điện và nhập ghi chú nhanh
    F->>S: Gửi yêu cầu lưu nhật ký tương tác
    S->>DB: Ghi nhận biên bản tương tác mới vào chu kỳ hiện tại
    DB-->>S: Xác nhận lưu thành công
    S-->>F: Phản hồi kết quả
    F-->>U: Cập nhật dòng thời gian tương tác tức thì
```

---

## 3. GIAO DIỆN & CẤU TRÚC CHI TIẾT (UI & DATA STATE)

### 3.1. Cấu trúc các vùng giao diện & Ràng buộc Quyền hạn (Capability Gating)

| Vùng Giao diện / Nút Thao Tác | Loại Hiển Thị | Mã Quyền Yêu Cầu (Required Capability) | Xử Lý Khi Không Đủ Quyền |
| :--- | :--- | :--- | :--- |
| **Xem Chi tiết Hồ sơ Lead** | Bảng tóm tắt & Thông tin | `crm.lead.view_detail` | Chặn xem chi tiết, thông báo lỗi quyền hạn |
| **Xem Số điện thoại Đầy đủ** | Chữ kèm nút gọi | `crm.lead.view_phone_full` | Hiển thị dạng che số `090****123`, ẩn nút gọi |
| **Ghi nhận Tương tác Nhanh** | Form nhập liệu nhanh | `crm.lead.log_interaction` | Vô hiệu hóa nút lưu nhật ký |
| **Thao tác Báo rớt / Lưu kho** | Nút hành động & Hộp thoại | `crm.lead.mark_drop` | Ẩn nút báo rớt |
| **Chuyển Chặng Quy trình** | Thanh tiến trình Stepper | `crm.lead.advance_stage` | Chặn nhấp chuyển chặng trên thanh tiến trình |
| **Kích hoạt Chu kỳ Bán mới** | Nút màu nhấn | `crm.lead.reactivate` | Ẩn nút kích hoạt chu kỳ mới |
| **Xem Chi tiết Đội ngũ Phụ trách** | Hộp thoại thông tin | `crm.lead.view_staff_info` | Chỉ hiển thị tên phụ trách, không mở hộp thoại |

### 3.2. Cấu trúc các khối thông tin
1. **Khối Thẻ Tiêu đề Lead (Header Card):**
   - Thông tin học viên chính: Họ tên học viên, nút xem chi tiết hồ sơ, nút sao chép mã lead và nút kích hoạt tái tiếp cận.
   - Dòng phụ đề: Ngày sinh, giới tính, địa chỉ cư trú.
2. **Khối 1: Panel trái - Chân dung Lead & Học viên (Bố cục dọc 1 cột):**
   - **Phía trên: Khối Thông tin học tập:**
     - Dòng tiêu đề và thông tin trường lớp: Tiêu đề "Thông tin học tập", trường đang theo học và học lực hiện tại của học viên, các nút hành động (sửa, phóng to).
     - Danh mục 2 chương trình đào tạo trọng tâm: Toán Tư Duy và Tiếng Anh.
     - Thể hiện 3 trạng thái đánh giá năng lực & học thử:
       - *Chưa có lịch:* Khung nét đứt kèm nút đặt lịch đánh giá và đặt lịch học thử.
       - *Đã có lịch hẹn - Chưa có kết quả:* Thể hiện thông tin ca test (ngày giờ, chương trình, chi nhánh, giáo viên phụ trách) kèm thông báo đã xếp lịch và đang chờ kết quả kiểm tra.
       - *Đã có kết quả kiểm tra:* Thể hiện xếp loại trình độ, điểm số tổng, biểu đồ đánh giá năng lực 5 kỹ năng, điểm mạnh, điểm cần rèn giũa và liên kết mở xem bài làm từ thiết bị máy tính bảng.
     - Khối Đặc điểm tâm lý & Phương pháp học tập: Thiết kế phẳng hoàn toàn, tập trung vào mục tiêu học tập, phong cách tiếp thu, tính cách lớp học, sở thích và điểm rèn giũa.
   - **Phía dưới: Thông tin Phụ huynh:**
     - Dòng tiêu đề: Biểu tượng và chữ "Thông tin Phụ huynh", mã lead, ngày tạo, cùng các nút thao tác (chỉnh sửa, phóng to).
     - Chi tiết người giám hộ: Bộ chuyển đổi người giám hộ (Bố, Mẹ) khi có nhiều người liên hệ, họ tên, vai trò, số điện thoại, thư điện tử.
     - Địa chỉ & cơ sở: Địa chỉ cư trú kèm liên kết mở bản đồ, danh sách khoảng cách tới các cơ sở gần nhất dưới dạng liên kết mở trực tiếp trên bản đồ số.
     - Con khác của Phụ huynh / Gia đình: Nằm ngay dưới khối địa chỉ và cơ sở, hiển thị danh sách liên kết nhanh tới hồ sơ các con khác trong cùng một gia đình đang được chăm sóc hoặc học tập tại trung tâm.
3. **Khối 2: Panel phải - Hệ thống 2 Tab Tác nghiệp Chuyên sâu:**
   - **Tab 1: Chăm sóc bán hàng (Mặc định):**
     - Phễu Vòng đời dạng dọc:
       - Dòng trên: Tiêu đề phễu, nút biểu tượng thu gọn/mở rộng (cho phép thu gọn chỉ hiển thị chặng hiện tại để tập trung làm việc hoặc mở rộng xem toàn bộ các chặng), huy hiệu trạng thái hiện tại, cùng cụm nút hành động Báo rớt / Tiếp tục / Kích hoạt lại.
       - Dòng dưới: Thiết kế phẳng (không viền, không nền) thể hiện kho dữ liệu tiếp nhận (Kho T), trạng thái Lead quay lại (nếu có), và tên nhân sự phụ trách (click để mở Hộp thoại thông tin chi tiết về Tư vấn viên, Chuyên viên CSKH và Cơ sở tiếp nhận & đào tạo kèm bản đồ chỉ đường).
       - Tiến trình các chặng: Thể hiện các chặng từ Mới tiếp nhận → Đang tư vấn → Hẹn trải nghiệm → Kết quả Test & Level → Chờ chốt / Đăng ký → Chuyển đổi thành công.
     - Cụm Chăm sóc & Tác nghiệp nhanh: Lựa chọn kênh tiếp cận (Cuộc gọi, Zalo, Trực tiếp), kết quả cuộc gọi, ô nhập ghi chú trao đổi, hẹn chăm sóc tiếp theo, cùng nhật ký dòng thời gian chăm sóc.
   - **Tab 2: Đơn hàng:**
     - Danh sách gói học, đơn hàng đã tạo, tiến độ nộp phí (đã thu, còn thiếu, đợt thanh toán), trạng thái thanh toán và nút tạo đơn hàng mới cho học viên.

---

## 4. KHỐI CHỨC NĂNG CHI TIẾT: ACTION & LUỒNG KÍCH HOẠT (ACTIONS & EVENTS)

### Khối chức năng 1: Ghi nhận Tương tác và Cập nhật Lịch hẹn

#### Action 1.1: Lưu nhật ký cuộc gọi
* **Luồng kích hoạt:** Tư vấn viên chọn kết quả cuộc gọi, nhập nội dung trao đổi và bấm "Lưu nhật ký".
* **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - **AC-1 (Happy Path - Lưu thành công):**
    - **Giả sử:** Hộp thoại Chi tiết Lead đang mở và tư vấn viên có quyền ghi nhận tương tác.
    - **Khi:** Người dùng chọn kênh "Cuộc gọi", kết quả "Nghe máy quan tâm", nhập nội dung "Phụ huynh đồng ý cho bé test năng lực chiều Thứ 7" và bấm Lưu.
    - **Thì:** Hệ thống lưu biên bản mới vào cơ sở dữ liệu khách hàng tiềm năng, hiển thị ngay trên đầu dòng thời gian và làm mới số lần chăm sóc.
  - **AC-2 (Validation Path - Thiếu nội dung ghi chú):**
    - **Giả sử:** Tư vấn viên đang ở form ghi nhận tương tác.
    - **Khi:** Người dùng để trống ô nội dung ghi chú và bấm Lưu nhật ký.
    - **Thì:** Hệ thống hiển thị cảnh báo yêu cầu nhập tóm tắt trao đổi trước khi lưu.

### Khối chức năng 2: Báo rớt và Xác định Điểm rơi Chuẩn hóa

#### Action 2.1: Đánh dấu Thất bại / Báo rớt Lead
* **Luồng kích hoạt:** Tư vấn viên bấm nút "Báo rớt", chọn chặng rơi và lý do từ danh mục chuẩn hóa.
* **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - **AC-3 (Happy Path - Báo rớt thành công):**
    - **Giả sử:** Lead đang ở chặng "Đang tư vấn".
    - **Khi:** Người dùng bấm "Báo rớt", chọn chặng rơi "Đang tư vấn", chọn lý do "Nhà quá xa cơ sở không tiện đưa đón", nhập ghi chú và bấm Xác nhận.
    - **Thì:** Trạng thái Lead chuyển thành "Thất bại", thanh tiến trình hiển thị điểm rơi tại chặng 2, và hệ thống chuyển Lead vào kho nuôi dưỡng sau 90 ngày.

### Khối chức năng 3: Bàn giao Vận hành và Tái kích hoạt sau 6 tháng

#### Action 3.1: Kích hoạt Chu kỳ Bán mới cho Học viên không hoạt động
* **Luồng kích hoạt:** Khi học viên đã hoàn thành khóa hoặc nghỉ học trên 180 ngày, tư vấn viên bấm nút "Kích hoạt Chu kỳ Bán mới".
* **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - **AC-4 (Happy Path - Mở chu kỳ mới):**
    - **Giả sử:** Học viên đã kết thúc khóa học và không có hoạt động trong 185 ngày.
    - **Khi:** Tư vấn viên bấm nút "Kích hoạt Chu kỳ Bán mới".
    - **Thì:** Hệ thống tạo chu kỳ bán thứ 2, giữ nguyên toàn bộ lịch sử học vụ và tương tác của chu kỳ 1, và chuyển trạng thái chu kỳ mới về "Mới tiếp nhận".

---

## 5. CÁC TRƯỜNG HỢP GÓC CẠNH (CORNER CASES)

- **[CASE-01] Lead có nhiều con cùng gia đình:**
  - *Tình huống:* Phụ huynh có 2 con đang cùng là Lead trong hệ thống.
  - *Cách xử lý:* Giao diện hiển thị danh sách thẻ liên kết anh chị em ở cột trái, cho phép tư vấn viên nhấp chuyển đổi nhanh giữa các con mà không cần đóng hộp thoại.
- **[CASE-02] Không đủ quyền xem số điện thoại đầy đủ:**
  - *Tình huống:* Nhân sự không có quyền xem thông tin liên hệ đầy đủ mở xem chi tiết.
  - *Cách xử lý:* Số điện thoại hiển thị dạng che ẩn `090****574`, đồng thời ẩn nút Gọi điện và nút Sao chép.
- **[CASE-03] Chốt đơn thành công chuyển giao sang Vận hành:**
  - *Tình huống:* Lead hoàn tất thanh toán 100% học phí hoặc đặt cọc.
  - *Cách xử lý:* Hệ thống tự động chuyển trạng thái sang "Đã chuyển đổi", hiển thị thẻ tóm tắt lớp học đã bàn giao, và khóa quyền chỉnh sửa chu kỳ bán của Sales.
- **[CASE-04] Báo rớt do khách không nghe máy nhiều lần:**
  - *Tình huống:* Tư vấn viên ghi nhận 3 lần gọi không nghe máy liên tiếp trong 3 ngày.
  - *Cách xử lý:* Hệ thống tự động gợi ý chọn lý do rơi "Không nghe máy quá 3 lần" và đề xuất kích hoạt kịch bản nhắn tin tự động chăm sóc lại.
- **[CASE-05] Tái kích hoạt học viên cũ khi phụ huynh chủ động gọi lại:**
  - *Tình huống:* Học viên đã nghỉ học 8 tháng, phụ huynh gọi lại đăng ký khóa học mới.
  - *Cách xử lý:* Hệ thống nhận diện số điện thoại phụ huynh, mở hồ sơ hiện có kèm cảnh báo nghỉ học quá 180 ngày và cho phép bấm kích hoạt Chu kỳ Bán mới ngay tại màn hình.
