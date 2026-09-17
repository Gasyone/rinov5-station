---
title: "BF-CARE-02: Cơ chế Người phụ trách Chăm sóc & Phân quyền theo Phạm vi Dữ liệu"
type: "Business Function"
domain: "CAP-CARE"
parent_br: "BR-CARE-01"
sr: "SR-PERSONA-CSM"
tags: [care, alert, assignee, permission, scope]
---

# BF-CARE-02: Cơ chế Người phụ trách Chăm sóc & Phân quyền theo Phạm vi Dữ liệu

> **Capability:** CAP-CARE (Chăm sóc & Duy trì Học viên)  
> **Giai đoạn:** 2 - Vận hành Chăm sóc & Tái phí  
> **Nhóm chức năng:** Vận hành & Chăm sóc  
> **Mã màn hình:** `student_operations_alert` ([/app/student_operations_alert](http://localhost:3001/app/student_operations_alert))  
> **Tài liệu đối ứng Confluence:** [Chăm sóc tái phí - Cập nhật người phụ trách chăm sóc & Xử lý phân quyền](https://rinoeduai.atlassian.net/wiki/spaces/PS/pages/154009746/Ch+m+s+c+t+i+ph+-+C+p+nh+t+ng+i+ph+tr+ch+ch+m+s+c)

---

## Lịch sử cập nhật tài liệu (Changelog)

| Ngày cập nhật | Nội dung cập nhật | Lý do cập nhật |
|---|---|---|
| 17/09/2026 | Khởi tạo tài liệu đặc tả cơ chế người phụ trách và phân quyền theo phạm vi cá nhân | Chuẩn hóa quy tắc đồng bộ CS/GV và bảo mật dữ liệu học viên |

---

## 1. Bối cảnh & Vấn đề hiện tại (Context & Problem Statement)

* **Vì sao phải làm? (Bối cảnh):**  
  Trong quy trình quản lý trung tâm đào tạo, dữ liệu chăm sóc học viên là tài sản quan trọng kết nối giữa dịch vụ khách hàng (CSM) và chuyên môn giảng dạy (Giáo viên). Để nâng cao trách nhiệm giải trình và tỷ lệ tái phí, hệ thống cần xác định rõ người phụ trách trực tiếp cho từng học viên.
* **Vấn đề thực tế:**  
  1. Khi chưa có quy tắc đồng bộ, thông tin người phụ trách hiển thị tại danh sách tổng quan và hộp thoại chi tiết chăm sóc dễ bị lệch pha, gây nhầm lẫn trong phân công công việc.
  2. Khi học viên đổi lớp hoặc kết thúc lớp học, nếu giáo viên lớp cũ thay đổi thì lịch sử học tập của học viên trước đó có nguy cơ bị ghi đè sai lệch.
  3. Cần cơ chế giới hạn quyền xem dữ liệu theo phạm vi cá nhân để nhân viên CS hoặc Giáo viên chỉ tập trung vào tệp học viên do mình phụ trách, bảo vệ thông tin liên hệ và chống việc sao chép dữ liệu khách hàng.

---

## 2. Mục tiêu, Giá trị mang lại & Chỉ số đo lường (Objectives, Value & KPIs)

* **Mục tiêu:**  
  - Tự động hóa việc gắn kết giáo viên đứng lớp với học viên khi xếp lớp.
  - Bảo toàn lịch sử người phụ trách giáo viên khi học viên rời lớp (Snapshot bảo toàn).
  - Phân quyền chặt chẽ theo phạm vi cá nhân, chi nhánh và toàn hệ thống.
* **Giá trị mang lại:**  
  - Rõ ràng trách nhiệm cá nhân đối với từng ca chăm sóc và tỷ lệ duy trì tái phí.
  - Đảm bảo tính bảo mật và an toàn dữ liệu học viên giữa các nhân sự.
* **KPI Target (Chỉ số đo lường hiệu quả):**

| Chỉ số đo lường (KPI) | Mục tiêu kỳ vọng (Target) | Phương pháp đo lường |
|---|---|---|
| **[KPI-CARE-01] Tỷ lệ đồng bộ người phụ trách** | 100% | Tỷ lệ bản ghi khớp nhau giữa bảng danh sách và hộp thoại chi tiết |
| **[KPI-CARE-02] Tỷ lệ bảo toàn lịch sử khi thoát lớp** | 100% | Không có trường hợp nào bị ghi đè giáo viên quá khứ khi lớp cũ đổi người |
| **[KPI-CARE-03] Độ tuân thủ phân quyền phạm vi cá nhân** | 100% | Nhân sự chỉ nhìn thấy đúng dữ liệu học viên mình được phân công phụ trách |

---

## 3. Hiểu người dùng (Target Users & Personas)

* **Chuyên viên Chăm sóc Khách hàng (CSM):**
  - *Bối cảnh:* Tiếp nhận học viên mới, theo dõi chuyên cần, giải đáp thắc mắc và tư vấn tái phí.
  - *Nhu cầu:* Khi đăng nhập phạm vi cá nhân, chỉ cần xem các học viên do mình phụ trách để xử lý công việc nhanh gọn, không bị xao nhãng bởi dữ liệu của nhân sự khác.
* **Giáo viên Đứng lớp (Teacher / Academic Staff):**
  - *Bối cảnh:* Theo dõi tình hình học sinh trong lớp, chấm điểm kiểm tra, nhắc nhở bài tập về nhà.
  - *Nhu cầu:* Được tự động phân công phụ trách học viên khi học viên ghép vào lớp, giữ nguyên dữ liệu đánh giá khi học viên chuyển đi.
* **Quản lý Cơ sở (Branch Manager - BM):**
  - *Bối cảnh:* Điều phối nhân sự, gán CS thủ công cho học viên mới, luân chuyển học viên khi có nhân viên nghỉ việc.
  - *Nhu cầu:* Xem toàn bộ học viên thuộc cơ sở (Phạm vi Cơ sở) để giám sát và phân bổ nguồn lực.

---

## 4. Ranh giới Nghiệp vụ & Phân loại Risk / Standard (Scope & Classification)

### Có bao gồm (In Scope)
- Cơ chế gán thủ công người phụ trách CS khi dữ liệu chăm sóc được khởi tạo.
- Cơ chế tự động gán, điều chỉnh, đóng băng giữ nguyên và cập nhật người phụ trách GV theo tiến trình lớp học.
- Quy tắc đồng bộ hiển thị giữa bảng danh sách chăm sóc học viên và hộp thoại chi tiết chăm sóc.
- Cơ chế chọn mở rộng danh sách gói để lọc dữ liệu và hiển thị tên gói hiện tại dưới môn học.
- Cơ chế phân quyền dữ liệu theo 3 phạm vi: Cá nhân, Cơ sở, Toàn hệ thống.

### Danh sách Chức năng trong Phạm vi (Feature Scope)

| Mã Chức năng | Tên Chức năng | Mô tả Nghiệp vụ | Mức ưu tiên |
|---|---|---|---|
| **FEAT-CARE-01** | Gán người phụ trách CS thủ công | Cho phép Quản lý gán và hoán đổi nhân sự CS phụ trách học viên | Must |
| **FEAT-CARE-02** | Tự động gán và đồng bộ người phụ trách GV | Tự động gán GV khi ghép lớp, điều chỉnh theo lớp, bảo toàn khi thoát lớp | Must |
| **FEAT-CARE-03** | Chọn và lọc dữ liệu theo gói học | Mở rộng danh sách gói tại nút môn học để lọc dữ liệu chăm sóc | Must |
| **FEAT-CARE-04** | Hiển thị tên gói hiện tại dưới môn học | Hiển thị chi tiết tên gói, số buổi và thời hạn trực quan | Must |
| **FEAT-CARE-05** | Phân quyền dữ liệu theo phạm vi cá nhân | Giới hạn chỉ người phụ trách mới thấy dữ liệu học viên của mình | Must |

### Không bao gồm (Out of Scope)
- Nghiệp vụ xếp lớp học viên vật lý $\rightarrow$ Đã được quản lý tại phân hệ Tuyển sinh & Xếp lớp.
- Nghiệp vụ cấu hình nhóm vai trò hệ thống $\rightarrow$ Đã được quản lý tại phân hệ Quản trị Phân quyền.

### Đánh giá & Phân loại Risk / Standard (Quality Gate 1)

| Tiêu chí | Nội dung đánh giá thực tế | Điểm |
|---|---|---|
| **A. Ảnh hưởng hệ thống** | Tác động phân hệ chăm sóc học viên và đồng bộ hiển thị, không đổi cấu trúc cơ sở dữ liệu gốc | 0 |
| **B. Tác động tài chính** | Phục vụ công tác tái phí và phân công nhân sự, không trực tiếp trừ tiền hay tính biểu phí mới | 0 |
| **C1. Loại thay đổi** | Chuẩn hóa quy tắc đồng bộ và phân quyền hiển thị trên màn hình hiện có | 0 |
| **C2. Độ mới nghiệp vụ** | Nghiệp vụ gán phụ trách và phân quyền phạm vi dữ liệu đã chuẩn hóa | 0 |
| **D. Phụ thuộc bên ngoài** | Hệ thống tự xử lý nội bộ, không phụ thuộc dịch vụ thứ 3 | 0 |

* **Tổng điểm rủi ro:** 0 điểm
* **Kết luận phân loại:** 🟢 **Standard** (Đạt chuẩn tự động thông qua)

---

## 5. Người dùng sử dụng thế nào & Quy trình Vận hành (User Flow)

```mermaid
flowchart TD
    Start(["Khởi tạo dữ liệu chăm sóc (Đơn hàng / Gói mới)"]) --> AssignCS["Quản lý gán thủ công Chuyên viên CS"]
    AssignCS --> WaitClass["Trạng thái Chờ xếp lớp (Phụ trách GV: Chưa gán)"]
    WaitClass --> PlaceClass["Học viên được ghép lớp học"]
    PlaceClass --> AutoGV["Tự động gán Phụ trách GV theo Giáo viên của lớp"]
    
    AutoGV --> InClass{"Học viên đang học trong lớp"}
    
    InClass -->|Lớp học đổi giáo viên| UpdateGV["Tự động điều chỉnh Phụ trách GV theo GV mới"]
    UpdateGV --> InClass
    
    InClass -->|Học viên thoát lớp (Bảo lưu/Rời lớp)| FreezeGV["GIỮ NGUYÊN Phụ trách GV (Snapshot lịch sử cố định)"]
    FreezeGV --> NextAction{"Hành động tiếp theo"}
    
    NextAction -->|Ghép vào lớp mới| ReassignNewClass["Cập nhật Phụ trách GV theo lớp mới"]
    ReassignNewClass --> InClass
    NextAction -->|Tư vấn kết thúc / Hoàn thành| Complete(["Hoàn tất chu trình chăm sóc"])
    
    InClass -->|Đổi nhân viên CS| ReassignCS["Hoán đổi thủ công CS (Lưu vết nhật ký bất biến)"]
    ReassignCS --> InClass
```

---

## 6. Quy tắc Nghiệp vụ Người phụ trách & Phân quyền (Business Rules)

### 6.1. Quy tắc Vòng đời Người phụ trách
1. **[BR-OWN-01] Gán thủ công Phụ trách CS:**
   - Khi hồ sơ chăm sóc học viên được tạo mới từ phân hệ thương mại, hệ thống gán tạm hoặc để Quản lý cơ sở gán thủ công nhân viên CS tiếp nhận.
   - Nhân viên CS chịu trách nhiệm theo dõi tiến trình xếp lớp và chăm sóc học vụ xuyên suốt.
2. **[BR-OWN-02] Gán tự động Phụ trách Giáo viên:**
   - Khi học viên được ghép lớp thành công, hệ thống tự động trích xuất thông tin Giáo viên chủ nhiệm và Giáo viên phụ từ lớp học để gán làm Phụ trách GV cho học viên.
3. **[BR-OWN-03] Điều chỉnh khi lớp học điều chỉnh:**
   - Trong quá trình học, nếu lớp học thay đổi hoặc bổ sung giáo viên giảng dạy, toàn bộ học viên đang có trạng thái học tập trong lớp đó sẽ tự động được cập nhật Phụ trách GV tương ứng.
4. **[BR-OWN-04] Giữ nguyên khi thoát lớp (Bảo tồn lịch sử):**
   - Khi học viên thoát lớp (bao gồm: rời lớp, kết thúc lớp, bảo lưu thoát lớp, chờ chuyển lớp), người phụ trách GV ghi nhận tại thời điểm đó được **giữ nguyên vĩnh viễn** dưới dạng snapshot lịch sử.
   - Nếu lớp học cũ sau này thay đổi giáo viên khác, thông tin Phụ trách GV của học viên đã thoát lớp **tuyệt đối không bị thay đổi hồi tố**.
5. **[BR-OWN-05] Cập nhật khi ghép lớp mới:**
   - Khi học viên được ghép vào một lớp học mới, thông tin Phụ trách GV tự động cập nhật theo giáo viên của lớp học mới đó.
6. **[BR-OWN-06] Đồng bộ 100% Giao diện:**
   - Cột Phụ trách ở bảng danh sách bên ngoài và vùng thông tin Người phụ trách (CS và GV) trong hộp thoại chi tiết chăm sóc phải hiển thị đồng nhất.

### 6.2. Quy tắc Phân quyền theo Phạm vi Dữ liệu (Data Scope Rules)
1. **[BR-SCOPE-01] Phạm vi Cá nhân (Personal Scope):**
   - Khi tài khoản được thiết lập phạm vi dữ liệu là Cá nhân, hệ thống tự động lọc danh sách chỉ hiển thị những học viên mà tài khoản đang đăng nhập là **Phụ trách CS** hoặc **Phụ trách GV**.
   - Nhân viên không thể xem hoặc thao tác trên dữ liệu học viên do người khác phụ trách.
2. **[BR-SCOPE-02] Phạm vi Cơ sở (Branch Scope):**
   - Tài khoản có phạm vi Cơ sở xem được toàn bộ danh sách học viên và tất cả người phụ trách thuộc cơ sở mình quản lý.
3. **[BR-SCOPE-03] Phạm vi Toàn hệ thống (All / HQ Scope):**
   - Ban điều hành hoặc cấp quản trị vùng xem được dữ liệu chăm sóc học viên trên toàn bộ các chi nhánh.

---

## 7. Trải nghiệm Giao diện Dễ dùng (UI/UX Design Criteria)

1. **Menu chọn & lọc theo gói tại nút môn học:**
   - Nút môn học (ví dụ *Toán tư duy*) hiển thị biểu tượng mũi tên mở rộng. Khi người dùng nhấp chuột, một bảng danh sách nổi mở ra liệt kê đầy đủ các gói học của môn học đó kèm trạng thái, số buổi và thời hạn.
   - Người dùng nhấp chọn gói bất kỳ để lọc nhanh toàn bộ dữ liệu học tập và thẻ chăm sóc của học viên theo gói đó.
2. **Hiển thị Tên gói hiện tại dưới môn học:**
   - Ngay dưới nút môn học, hệ thống bố trí một dòng thông tin trực quan hiển thị đầy đủ tên gói học đang áp dụng (ví dụ `[MATH_TUTOR] Toán Tư Duy Toán 1:6_96 buổi`), số buổi đã học / tổng số buổi, số buổi còn lại và hạn học phí.
3. **Bố cục hiển thị Người phụ trách:**
   - Cột ngoài danh sách: Hiển thị 2 tầng rõ ràng: CS ở trên (màu xanh lá) và GV ở dưới (màu tím).
   - Hộp thoại chi tiết: Phụ trách CS có biểu tượng hoán đổi để đổi người phụ trách linh hoạt; Phụ trách GV hiển thị danh sách giáo viên phụ trách kèm bảng xem nhanh hồ sơ nhân sự khi di chuột.

---

## 8. Trường hợp Góc cạnh & Xử lý Ngoại lệ (Corner Cases)

1. **[CC-01] Học viên chưa ghép lớp (Chờ xếp lớp):**
   - *Tình huống:* Học viên mới mua gói, chưa được xếp vào lớp học vật lý nào.
   - *Xử lý:* Cột Phụ trách hiển thị CS được chỉ định và GV hiển thị dấu gạch ngang (`-`). Trong chi tiết chăm sóc, vùng giáo viên hiển thị "Chưa phân công".
2. **[CC-02] Lớp học có nhiều hơn 1 giáo viên (GV Chính và Trợ giảng):**
   - *Tình huống:* Lớp học có cả giáo viên chủ nhiệm và trợ giảng/giáo viên phụ.
   - *Xử lý:* Hệ thống hiển thị đầy đủ cả 2 giáo viên, phân cách bằng dấu phẩy. Cả 2 giáo viên đều có quyền xem học viên này khi ở phạm vi phân quyền cá nhân.
3. **[CC-03] Học viên học đồng thời 2 môn khác nhau (Toán và Tiếng Anh):**
   - *Tình huống:* Học viên có 2 gói học song song với 2 lớp học và giáo viên khác nhau.
   - *Xử lý:* Khi chuyển tab môn học hoặc chọn gói trong danh sách mở rộng, thông tin lớp học và Phụ trách GV tự động chuyển đổi đồng bộ theo môn học và lớp tương ứng.
4. **[CC-04] Lớp cũ đổi giáo viên sau khi học viên đã bảo lưu/nghỉ học:**
   - *Tình huống:* Học viên rời lớp vào ngày 10/05 với GV A. Đến ngày 01/06 lớp học bổ nhiệm GV B.
   - *Xử lý:* Bản ghi Phụ trách GV của học viên vẫn giữ nguyên là GV A, không bị đổi thành GV B.
5. **[CC-05] Nhân viên CS nghỉ việc hoặc bàn giao công tác:**
   - *Tình huống:* Quản lý thực hiện đổi người phụ trách CS cho học viên.
   - *Xử lý:* Nhật ký chăm sóc trong quá khứ của nhân viên cũ được giữ nguyên bất biến (Append-only). Nhân viên CS mới tiếp quản và hiển thị tên mới trên bảng chăm sóc.
6. **[CC-06] Người dùng không có quyền truy cập ở phạm vi cá nhân:**
   - *Tình huống:* Nhân viên truy cập trực tiếp đường dẫn hồ sơ của học viên không do mình phụ trách.
   - *Xử lý:* Hệ thống chặn truy cập, hiển thị thông báo không có quyền và chuyển hướng về danh sách học viên do mình phụ trách.
