---
id: US-HR-02-02
title: "Quản lý đăng ký lịch nhân viên"
bf: BF-HR-02
domain: CAP-HR
status: ready
tags: [hr, schedule, availability, staff-management]
---

# US-HR-02-02: Quản lý đăng ký lịch nhân viên

> **Tham chiếu:** BF-HR-02 · `[POLICY-IAM-03]` · `[POLICY-ORG-01]` · `[POLICY-DS-03]` · Giao diện Mẫu §4.2 (Danh sách)

## 1. Yêu cầu Người dùng (User Story)

**Là một** Quản lý trung tâm hoặc Nhân viên giáo vụ, **tôi muốn** xem, lọc và đăng ký lịch mẫu thay cho nhân viên thuộc phạm vi quản lý, **để** bảo đảm mỗi trung tâm có đủ quỹ thời gian nhân sự cho việc xếp lớp thông qua một lần đăng ký áp dụng lâu dài cho mọi tuần.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Tách được khỏi chức năng cấu hình khung giờ ưu tiên.
> - [x] **N**egotiable — Cách hiển thị danh sách nhân viên có thể tinh chỉnh.
> - [x] **V**aluable — Giúp quản lý xử lý nhân viên chưa đăng ký hoặc cần hỗ trợ.
> - [x] **E**stimable — Phạm vi gồm lọc, tổng hợp, xem chi tiết và đăng ký thay.
> - [x] **S**mall — Tập trung vào danh sách nhân viên và lưới lịch mẫu của nhân viên được chọn.
> - [x] **T**estable — Có tiêu chí nghiệm thu ở mục 6.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-HR-02-02-01] Phạm vi dữ liệu:** Người quản lý chỉ thấy nhân viên thuộc trung tâm hoặc phạm vi được phân quyền theo `[POLICY-ORG-01]`.
2. **[RULE-HR-02-02-02] Bộ lọc bắt buộc:** Danh sách phải lọc được theo trung tâm làm việc của nhân viên, chức danh, trạng thái và từ khóa; bộ lọc trung tâm không làm khung giờ đăng ký gắn cố định với trung tâm đó.
3. **[RULE-HR-02-02-03] Đăng ký thay:** Khi đăng ký lịch mẫu cho nhân viên khác, giao diện phải hiển thị rõ tên nhân viên đang được thao tác.
4. **[RULE-HR-02-02-04] Không chặn cứng trùng lịch:** Nếu một khung giờ đã có nhiều người đăng ký lịch rảnh, hệ thống vẫn cho quản lý xem và cân nhắc; cảnh báo được hiển thị khi cần.
5. **[RULE-HR-02-02-05] Xem chi tiết khung giờ:** Khi một khung giờ có người đăng ký, quản lý có thể mở chi tiết để xem danh sách nhân viên.
6. **[RULE-HR-02-02-06] Thao tác nguy hiểm:** Hủy hoặc xóa lịch mẫu đã lưu cho nhân viên phải có xác nhận theo `[DS-P4]`. Khung giờ đã được gán, phân bổ lớp học/công việc thực tế sẽ không bị xóa và bị khóa thao tác chỉ đọc.
7. **[RULE-HR-02-02-07] Bộ lọc theo Trạm:** Hệ thống hỗ trợ bộ lọc theo Trạm/Trường học liên kết tương ứng trên thanh công cụ để khoanh vùng quản lý nhân sự của từng trạm học thuận tiện.
8. **[RULE-HR-02-02-08] Ràng buộc trạm được gán khi đăng ký thay:** Khi quản lý đăng ký hoặc chỉnh sửa lịch rảnh thay cho giáo viên, hệ thống tự động ràng buộc ca đăng ký nằm trong khung thời gian hoạt động của Trạm học/Điểm trường được gán cho nhân sự đó.
9. **[RULE-HR-02-02-09] Khung giờ động từ ERP cũ:** Riêng tại màn hình quản lý đăng ký lịch nhân viên này, lưới thời gian không dùng danh sách cố định từ 07:00 đến 23:00 (bước 30 phút) như màn hình cá nhân. Các khung giờ (ca học) sẽ được lấy động từ danh sách các ca học đã thiết lập từ hệ thống ERP cũ (module/bảng tạo ca học) để hiển thị đồng bộ trên giao diện Frontend.

### 2.1. Thông số & Định mức (Metrics & Thresholds)

- **[METRIC-HR-02-02-01] SLA Tải trang:** Thời gian tải danh sách nhân viên và sơ đồ Grid dưới 1.5 giây để đảm bảo trải nghiệm quản lý mượt mà.
- **[METRIC-HR-02-02-02] Giới hạn đồng bộ ca học:** Dữ liệu ca học động từ hệ thống ERP cũ cần được đồng bộ tự động hoặc lưu tạm ở bộ nhớ đệm (cache) trình duyệt để tránh tạo tải trọng lớn lên hệ thống cũ khi quản lý chuyển đổi qua lại giữa các nhân viên.

---

## 3. Cấu trúc Giao diện & Dữ liệu

### 3.1. Thanh công cụ
| Thành phần | Loại hiển thị | Logic | Ghi chú |
|------------|---------------|-------|---------|
| Chọn trung tâm | Danh sách thả xuống | Lọc nhân viên theo trung tâm lớn | Mặc định theo trung tâm của người dùng. |
| Chọn Trạm | Danh sách thả xuống | Lọc nhân sự theo Trạm/Trường học liên kết | Giúp quản lý Station theo dõi nhanh nhân sự theo từng điểm trường. |
| Chọn chức danh | Danh sách thả xuống | Lọc nhóm nhân sự | Có lựa chọn tất cả. |
| Ô tìm kiếm | Ô nhập chữ | Tìm theo tên, mã, email | Không phân biệt chữ hoa chữ thường. |

### 3.2. Khối lọc Trạng thái
| Thành phần | Nhóm màu | Điều kiện | Ghi chú |
|------------|----------|-----------|---------|
| Tất cả | Mặc định | Bỏ lọc trạng thái | Hiển thị tổng số nhân viên. |
| Chờ đăng ký | Trung tính (Muted) | Chưa có khung giờ mẫu nào | Cần quản lý nhắc hoặc đăng ký mẫu thay. |
| Đã đăng ký | Tích cực (Positive) | Đã lưu thành công khung giờ rảnh mẫu | Đủ điều kiện để vận hành xếp lớp. |
| Đã phân bổ | Cần chú ý (Attention) | Lịch rảnh đã được gán xếp lớp thực tế | Chặn chỉnh sửa trực tiếp các ô này. |

### 3.3. Bảng danh sách chính (Bảng nhân viên)
*Bảng danh sách KHÔNG có cột hành động (Action Column). Mọi tương tác mở lưới đăng ký đều thực hiện qua hành vi click trực tiếp vào dòng nhân viên.*

| Cột | Loại hiển thị | Trường Dữ liệu | Logic & Ghi chú |
|-----|---------------|----------------|-----------------|
| Nhân viên | Ảnh đại diện + văn bản | Tên, mã và chức danh | Bấm chọn trực tiếp dòng -> Tải và kích hoạt chế độ xem/sửa lịch ở khung Grid bên phải, đồng thời tô sáng dòng đã chọn để định vị bối cảnh. |
| Trung tâm | Văn bản | Tên trung tâm | |
| Trạm được gán | Văn bản | Tên Trạm/Trường liên kết | Giúp đối chiếu nhanh địa điểm làm việc. |
| Tổng giờ tuần | Văn bản | Tổng thời lượng đăng ký rảnh | Tính theo khung lịch mẫu tuần. |
| Trạng thái | Nhãn màu | Trạng thái đăng ký | Theo bộ màu chuẩn. |

### 3.4. Thao tác khi rê chuột vào dòng (Hoặc tương tác dòng)
Bảng tối giản tối đa, không chứa các nút bấm biểu tượng hành động (như Sửa, Xem chi tiết, Đăng ký thay) khi hover dòng để tránh làm rối mắt người dùng. Thao tác duy nhất là nhấn chuột trái chọn dòng.

### 3.5. Bảng lọc nâng cao
| Thành phần | Loại | Dữ liệu | Ghi chú |
|------------|------|---------|---------|
| Lọc Trạng thái đăng ký | Hộp kiểm (Checkbox) | Chờ đăng ký, Đã đăng ký, Đã phân bổ | |

### 3.6. Phân trang (Thanh công cụ phân trang dưới Bảng nhân viên)
| Thành phần | Loại hiển thị | Logic | Ghi chú |
|------------|---------------|-------|---------|
| Chọn kích thước trang | Hộp thả xuống (Dropdown) | Chọn số lượng dòng hiển thị trên một trang: `20`, `50`, `100` | Mặc định là 20 bản ghi/trang. |
| Hiển thị vị trí | Văn bản | Hiển thị dạng: `Hiển thị dòng X - Y trong Z dòng` | Cập nhật động theo vị trí trang hiện tại. |
| Điều hướng trang | Nhóm nút bấm biểu tượng | Gồm các nút: Về trang đầu (`<<`), Trang trước (`<`), Trang sau (`>`), Đến trang cuối (`>>`) | Nút trước bị vô hiệu hóa khi ở trang đầu, nút sau bị vô hiệu hóa khi ở trang cuối. |

---

## 4. Mô tả chi tiết (Màn hình & Luồng)

### 4.1. Mô tả Màn hình
- Màn hình chia làm 2 khu vực lớn cạnh nhau (Split view):
  - Bên trái: Bảng danh sách nhân viên kèm thanh Toolbar tìm kiếm lọc nâng cao ở trên đầu, Khối lọc trạng thái ở giữa, và Thanh công cụ phân trang (Pagination Toolbar) ghim cố định ở sát mép dưới của bảng danh sách chính.
  - Bên phải: Lưới Grid tổng hợp/đăng ký của giáo viên được chọn. Khi chưa chọn dòng nhân viên nào, Grid hiển thị trạng thái trống (EmptyState) hoặc sơ đồ chỉ đọc chung. Khi người dùng click chọn trực tiếp một dòng nhân viên bên trái, Grid lập tức chuyển sang chế độ chỉnh sửa cho nhân viên đó, hiển thị thanh trạng thái *"Đang đăng ký cho [Tên Nhân Viên]"* ở trên đầu lưới và hiển thị Action Bar ở dưới chân lưới.
- Dưới chân màn hình khi đang ở chế độ đăng ký thay là Action Bar hiển thị tổng giờ rảnh chọn hộ, nút "Hủy" và nút "Xác nhận đăng ký".

### 4.2. Luồng Hoạt động (Workflow)
1. **Chọn nhân viên:** Quản lý truy cập tab "Nhân viên", rà soát danh sách và **click chọn trực tiếp vào dòng** của Giáo viên C trên bảng (không bấm nút phụ).
2. **Kích hoạt Grid:** Dòng của Giáo viên C chuyển sang trạng thái được chọn (Selected Highlight). Khung bên phải lập tức biến đổi: tải danh sách ca học động từ ERP cũ, tải lịch rảnh hiện tại của Giáo viên C và hiển thị dưới dạng lưới Grid có thể tương tác.
3. **Chọn giờ mẫu:** Quản lý bấm hoặc kéo chuột chọn các ca rảnh thay cho Giáo viên C. Các ca đã gán lớp học thực tế hiển thị tên lớp và bị disabled hoàn toàn, chặn click/drag.
4. **Lưu dữ liệu:** Quản lý bấm "Xác nhận đăng ký". Hệ thống lưu dữ liệu đăng ký rảnh mẫu cho Giáo viên C, ghi nhận Quản lý là người thực hiện, và tự động đồng bộ làm quỹ thời gian cho mọi tuần tiếp theo.

---

## 5. Corner Cases (Trường hợp góc cạnh & Đặc biệt)

| # | Tình huống đặc biệt (Corner Case) | Cách xử lý chi tiết | Ghi chú / Trạng thái |
|---|----------------------------------|---------------------|----------------------|
| 5.1 | Không có nhân viên phù hợp bộ lọc | Hiển thị màn hình trống với thông điệp hướng dẫn rõ ràng và nút "Xóa bộ lọc" để đưa danh sách về mặc định. | Áp dụng mẫu EmptyState |
| 5.2 | Giáo viên được gán làm việc song song tại 2 Trạm học (ví dụ: Cầu Giấy và Ba Đình) | Khi Quản lý trạm Cầu Giấy vào đăng ký thay, hệ thống chỉ cho phép đăng ký ca rảnh thuộc khung giờ hoạt động được phép của trạm Cầu Giấy. Lịch mẫu sau khi lưu sẽ gộp chung vào hồ sơ giáo viên nhưng phân tách rõ nguồn gốc trạm để tránh đụng lịch vật lý. | Phân bối cảnh cập nhật |
| 5.3 | Cấu hình ca học ở ERP cũ bị thay đổi (ví dụ: gộp ca, chia ca hoặc đổi giờ học) | Hệ thống tự động map lại lịch rảnh mẫu của giáo viên đã đăng ký sang các khung ca học mới tương ứng. Các ca học bị hủy bỏ sẽ tự động rút khỏi lưới đăng ký của giáo viên mà không gây lỗi dữ liệu. | Đảm bảo tính đồng bộ |
| 5.4 | Thoát chế độ đăng ký thay khi có dữ liệu nháp chưa lưu | Hệ thống hiển thị hộp thoại cảnh báo (ConfirmDialog) theo chuẩn `[DS-P4]`: "Thay đổi chưa được lưu sẽ bị mất. Bạn có chắc chắn muốn thoát?". Chỉ thoát khi người dùng bấm xác nhận. | Phòng chống mất dữ liệu |
| 5.5 | Xung đột đồng thời (Concurrency) khi 2 quản lý cùng lưu đăng ký hộ cho 1 Giáo viên | Người bấm lưu sau nhận thông báo đỏ: "Dữ liệu đăng ký lịch của giáo viên này vừa được cập nhật bởi [Tên Quản Lý Khác]. Vui lòng làm mới trang để tải dữ liệu mới nhất". Hệ thống chặn ghi đè đè dữ liệu cũ. | Chống xung đột dữ liệu |
| 5.6 | Giáo viên được chuyển trạm công tác (ví dụ: từ trạm A sang trạm B) | Hệ thống giữ nguyên lịch rảnh mẫu tuần của giáo viên, tự động đối chiếu các ca rảnh cũ của giáo viên với danh sách ca học của Trạm B. Ca học nào không tương thích hoặc nằm ngoài khung hoạt động của Trạm B sẽ được đánh dấu cảnh báo để quản lý trạm B điều chỉnh. | Chuyển tiếp trạm mượt mà |

---

## 6. Tiêu chí Nghiệm thu (Acceptance Criteria)

- **AC-1 (Tìm kiếm và lọc đa điều kiện chính xác):** Thanh tìm kiếm cho phép gõ tìm kiếm theo Tên, Mã, Email của nhân sự (không phân biệt chữ hoa/thường, hỗ trợ tiếng Việt có dấu). Bộ lọc Trung tâm, Trạm học và Chức danh hoạt động kết hợp chính xác, số dòng của bảng nhân viên và con số đếm trên status tiles cập nhật đồng bộ ngay lập tức.
- **AC-2 (Click dòng trực tiếp kích hoạt Grid):** Khi người dùng click chọn trực tiếp vào một dòng giáo viên trên bảng, dòng đó đổi sang trạng thái Selected (tô sáng), đồng thời khung Grid bên phải lập tức kích hoạt chế độ đăng ký cho giáo viên đó, hiển thị đúng ca học của trạm gán và hiển thị rõ tên giáo viên trên thanh trạng thái.
- **AC-3 (Bảng tối giản tuyệt đối):** Bảng nhân viên hoàn toàn không chứa bất kỳ cột hành động nào (như các nút bấm Sửa, Xem chi tiết, Đăng ký hộ) để đảm bảo tuân thủ thiết kế tối giản, click chọn dòng trực tiếp.
- **AC-4 (Lưới ca học động ERP cũ):** Lưới Grid thời gian hiển thị chính xác các dòng ca học được load động từ ERP cũ, không hiển thị dải 30 phút cố định.
- **AC-5 (Chặn ô gán lớp khi đăng ký thay):** Các ô có chứa tên lớp học đã gán bị vô hiệu hóa hoàn toàn (mờ đi, không nhận click/drag) trong lúc đăng ký thay và giữ nguyên không bị thay đổi khi quản lý bấm "Xóa chọn" hoặc "Hủy".
- **AC-6 (Ghi nhật ký audit log minh bạch):** Khi nhấn "Xác nhận đăng ký thay", hệ thống lưu lịch mẫu thành công, đồng thời tự động ghi nhận 1 bản ghi lịch sử vào nhật ký hệ thống (Audit log) lưu rõ: ai thao tác (ID quản lý), vai trò (ví dụ: branch_manager) và thời điểm thực hiện để phục vụ đối soát.
- **AC-7 (Phân trang ổn định):** Bảng danh sách nhân viên phân trang đúng chuẩn `[20, 50, 100]`, hiển thị đầy đủ thông tin Trạm được gán. Nút điều hướng chuyển trang trước/sau hoạt động đúng và tự động khóa (disabled) ở trang biên (ví dụ: nút "Trang trước" bị khóa khi đang ở trang 1).

---

## 7. Làm rõ Nghiệp vụ tích hợp cho Product Owner (PO & BA)

Để phục vụ kiểm duyệt sản phẩm, phần này mô tả chi tiết cách hệ thống xử lý dữ liệu và luồng liên kết nghiệp vụ giữa các module từ góc nhìn quản trị vận hành:

### 7.1. Luồng nghiệp vụ tích hợp ca học (Legacy ERP Integration)
Hệ thống Rinov5 hoạt động như một lớp giao diện và xử lý quỹ thời gian tập trung cho các Trạm học. Để hiển thị lưới đăng ký cho quản lý:
1. **Đọc dữ liệu gốc:** Khi màn hình đăng ký hộ mở ra, hệ thống tự động kết nối với danh sách các ca học (ví dụ: Ca 1: 08h-10h, Ca 2: 10h-12h...) đang hoạt động trên module tạo ca học của hệ thống ERP cũ.
2. **Dựng lưới động:** Hệ thống không hardcode cố định khung giờ 30 phút. Nếu ERP cũ có 5 ca học, lưới sẽ hiển thị đúng 5 ca này để quản lý bấm chọn. Điều này loại bỏ hoàn toàn việc lệch giờ giữa lịch đăng ký rảnh và lịch lớp thực tế khi xếp lớp.
3. **Độ trễ đồng bộ:** Mọi thay đổi về ca học ở ERP cũ (ví dụ: đổi giờ Ca 2 từ 10h sang 10h15) sẽ lập tức phản ánh lên lưới đăng ký của Rinov5 mà không cần thao tác cập nhật thủ công từ phía kỹ thuật.

### 7.2. Logic ghi nhận Đăng ký hộ (Proxy Audit Trail)
Để tránh tranh chấp thời gian làm việc giữa Giáo viên và Quản lý trạm, hệ thống kiểm soát chặt chẽ luồng lưu trữ nhật ký:
* **Ghi nhận đồng thời hai đối tượng:** Khi Quản lý trạm bấm lưu lịch rảnh thay cho Giáo viên A, hệ thống lưu bản ghi thời gian rảnh của Giáo viên A vào cơ sở dữ liệu để làm quỹ thời gian xếp lớp, đồng thời **tự động sinh một bản ghi nhật ký hệ thống (Audit log)** ghi rõ:
  * **Ai thao tác:** Họ tên và mã tài khoản của Quản lý trạm.
  * **Vai trò thao tác:** Vai trò lúc thực hiện (ví dụ: Quản lý chi nhánh Cầu Giấy).
  * **Nội dung thay đổi:** Trạng thái trước và sau khi lưu (ví dụ: Đã thêm ca rảnh Thứ 2, Thứ 4 ca 17h-19h).
* **Đối soát minh bạch:** Giáo viên khi đăng nhập vào màn hình cá nhân của mình sẽ thấy các khung giờ rảnh này (kèm ghi chú ca nào do Quản lý đăng ký hộ) để đảm bảo tính minh bạch.

### 7.3. Ràng buộc điểm trường (Station Availability Alignment)
* Mỗi Giáo viên khi ký hợp đồng sẽ được gán cố định cho một hoặc một vài Trạm học/Điểm trường vật lý nhất định.
* Khi Quản lý trạm đăng ký thay cho Giáo viên, hệ thống sẽ tự động đối chiếu các ca học của Trạm đó với khung thời gian hoạt động của Trạm học được gán cho Giáo viên. 
* Nếu Quản lý vô tình chọn ca học rảnh nằm ngoài giờ hoạt động hoặc ngoài địa bàn hoạt động của giáo viên đó, hệ thống sẽ bật cảnh báo nghiệp vụ ngay trên giao diện để quản lý điều chỉnh, ngăn ngừa việc xếp lịch sai địa điểm thực tế.
