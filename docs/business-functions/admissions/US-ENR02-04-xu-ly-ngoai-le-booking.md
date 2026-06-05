---
id: US-ENR02-04
title: "Xử lý ngoại lệ Booking học thử"
bf: BF-ENR-02
domain: CAP-ADM
status: draft
tags: [enrollment, trial, form]
---

# US-ENR02-04: Xử lý ngoại lệ Booking học thử

> **Tham chiếu:** BF-ENR-02 · `[DS-P4]` Xác nhận hành động rủi ro · Giao diện Mẫu §4.4 (Biểu mẫu)

## 1. Yêu cầu Người dùng (User Story)

**Là một** Giáo vụ hoặc Quản lý chi nhánh,
**tôi muốn** thực hiện hủy bỏ lịch học thử hoặc giải quyết các yêu cầu đổi buổi học của học sinh do hệ thống quản lý khách hàng đồng bộ sang,
**để** giải phóng ngay chỗ học trống cho học viên khác, đảm bảo sĩ số lớp học chính xác và cập nhật kịp thời ca học mới cho học sinh.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Thực hiện độc lập trên các hộp thoại hủy và ghép ca học.
> - [x] **N**egotiable — Lý do hủy hoặc ghi chú điều chỉnh có thể linh hoạt nhập thêm.
> - [x] **V**aluable — Giúp tối ưu hóa sĩ số lớp học thực tế và tránh lãng phí chỗ học của trung tâm.
> - [x] **E**stimable — Đã rõ quy trình giải phóng ca cũ và gán ca mới cùng trạng thái tương ứng.
> - [x] **S**mall — Hoàn thành trong một đợt phát triển.
> - [x] **T**est-able — Có tiêu chí nghiệm thu rõ ràng ở mục 6.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1.  **[RULE-EXC-01] Hủy lịch bắt buộc chọn lý do:**
    *   Giáo vụ hoặc nhân viên tư vấn có thể chủ động hủy phiếu học thử khi học sinh không còn nhu cầu trải nghiệm hoặc phát sinh sự cố từ trung tâm.
    *   Hành động hủy lịch yêu cầu bắt buộc phải chọn **Lý do hủy** từ danh sách chuẩn hóa của hệ thống.
    *   Sau khi hủy thành công, trạng thái phiếu chuyển sang **Đã hủy**, ca học đã ghép trước đó (nếu có) được tự động giải phóng chỗ học để cập nhật lại sĩ số.
2.  **[RULE-EXC-02] Xác nhận hành động hủy:** Hành động hủy lịch học thử được coi là hành động rủi ro cao (làm thay đổi vĩnh viễn trạng thái và giải phóng ca học). Hệ thống yêu cầu phải hiển thị một hộp thoại xác nhận thao tác nguy cơ cao trước khi tiến hành cập nhật thực tế vào hệ thống.
3.  **[RULE-EXC-03] Đồng bộ yêu cầu đổi lịch từ hệ thống quản lý khách hàng (CRM):**
    *   Trong phiên bản V1, hệ thống ERP không hỗ trợ chức năng cho người dùng tự tạo yêu cầu đổi lịch thủ công trên giao diện. Mọi yêu cầu đổi lịch đều phải được khởi tạo từ hệ thống quản lý khách hàng (CRM) và tự động đồng bộ sang ERP.
    *   Khi nhận được yêu cầu đổi lịch, hệ thống tự động chuyển trạng thái của phiếu học thử sang **Cần đổi lịch**, đồng thời tự động giải phóng ca học đã gán trước đó (đưa số lượng ca học đã chọn về trống).
4.  **[RULE-EXC-04] Xử lý khắc phục đổi lịch tại ERP:**
    *   Khi phiếu học thử ở trạng thái **Cần đổi lịch**, Giáo vụ thực hiện gán ca học mới qua chức năng "Đổi buổi" (gọi hộp thoại ghép lớp đã được đặc tả ở `US-ENR02-03`).
    *   Sau khi Giáo vụ thực hiện gán ca học mới thành công, trạng thái phiếu học thử tự động chuyển sang **Chờ xác nhận** để chờ duyệt chính thức. Ca học cũ bị giải phóng sẽ được hệ thống lưu trữ và hiển thị tĩnh tại phần lịch sử làm thông tin đối chiếu.

### 2.1. Thông số & Định mức (Metrics & Thresholds)

- **[METRIC-01] Thời gian tối thiểu hủy ca:** Cho phép hủy ca học thử tối thiểu 2 giờ trước giờ bắt đầu của ca học để đảm bảo công tác chuẩn bị học liệu của giáo viên.
- **[METRIC-02] Giới hạn thời gian xử lý đổi lịch:** Các phiếu ở trạng thái **Cần đổi lịch** cần được điều phối viên xử lý ghép ca mới trong vòng 24 giờ kể từ khi nhận được yêu cầu từ hệ thống quản lý khách hàng để tránh làm gián đoạn trải nghiệm của học sinh.

---

## 3. Cấu trúc Các trường nhập liệu

**Bố cục:** 1 Cột dọc.

### 3.1. Hộp thoại Hủy lịch

| Tên trường | Loại hiển thị | Bắt buộc | Trường dữ liệu | Ghi chú & Quy tắc |
| :--- | :--- | :--- | :--- | :--- |
| Cảnh báo rủi ro | Vùng cảnh báo (Chỉ đọc) | — | Thông báo cảnh báo | Nền màu đỏ mờ cảnh báo hành động không thể hoàn tác. |
| Lý do hủy | Danh sách thả xuống | Có | Lý do | Khách bận, Đã chốt sale sớm, Trung tâm hủy, GV nghỉ đột xuất, Khác. |
| Ghi chú | Ô nhập văn bản dài | Không | Chi tiết ghi chú | Tối đa 500 ký tự. |

### 3.2. Hộp thoại Đổi buổi học

| Tên trường | Loại hiển thị | Bắt buộc | Trường dữ liệu | Ghi chú & Quy tắc |
| :--- | :--- | :--- | :--- | :--- |
| Lớp cũ (đã giải phóng) | Khối thông tin (Chỉ đọc) | — | Tên lớp cũ, ca cũ, thời gian cũ | Chỉ hiển thị nếu phiếu học thử đang ở trạng thái Cần đổi lịch hoặc đã từng gán ca học trước đó. Nền màu vàng/cam mờ cảnh báo. |
| Chọn khoảng ngày | Bộ chọn khoảng ngày | Không | Khoảng ngày học thử | Lọc nhanh các ca học của lớp diễn ra trong khoảng ngày được chọn. |
| Danh sách lớp khả dụng | Khối danh sách co giãn (dạng đóng mở) | Có | Lớp, ca khả dụng | Bấm mở rộng từng lớp để hiển thị các ca học chi tiết. Ca học đầy sĩ số bị mờ đi. |
| Hộp kiểm chọn ca | Ô tích chọn (Hộp kiểm) | Có | Ca học đã chọn | Chỉ được phép chọn duy nhất 1 ca học. Việc tích chọn ca học mới sẽ tự động hủy tích ca học cũ. |
| Ghi chú cho giáo viên | Ô nhập văn bản dài | Không | Ghi chú gửi giáo viên | Nhập lưu ý đặc biệt gửi cho giáo viên dạy buổi học đó (tối đa 500 ký tự). |

### 3.3. Ví dụ Dữ liệu mẫu

| Tình huống | Dữ liệu đầu vào | Kết quả mong đợi |
| :--- | :--- | :--- |
| Hủy thành công | Lý do: "Khách bận", Ghi chú: "Phụ huynh báo bé bị ốm đột xuất" | Trạng thái chuyển sang Đã hủy, ca cũ giải phóng, hộp thoại đóng và ghi nhận nhật ký hoạt động. |
| Hủy thiếu lý do | Lý do: (bỏ trống) | Nút Xác nhận hủy bị mờ đi, chặn không cho thực thi. |
| Xử lý đổi lịch thành công | Chọn buổi học mới: Lớp "Cambridge Starter A1", Ca "Starter S2" | Trạng thái chuyển sang Chờ xác nhận, ca học mới được lưu, ca học cũ chuyển vào phần thông tin lớp cũ giải phóng. |

### 3.4. Nút hành động

*   **Tại Hộp thoại Hủy lịch:**
    *   **Đóng:** Nút viền nhạt. Đóng hộp thoại và giữ nguyên thông tin.
    *   **Xác nhận hủy:** Nút màu đỏ nổi bật. Chỉ kích hoạt khi đã chọn Lý do hủy. Bấm vào sẽ cập nhật trạng thái Đã hủy, giải phóng ca học và đóng hộp thoại.
*   **Tại Hộp thoại Đổi buổi học:**
    *   **Hủy:** Nút viền nhạt. Đóng hộp thoại và giữ nguyên thông tin.
    *   **Lưu thay đổi:** Nút màu nhấn nổi bật. Chỉ kích hoạt khi đã chọn ít nhất 1 ca học mới. Bấm vào sẽ cập nhật ca học mới, đổi trạng thái phiếu về Chờ xác nhận, lưu ca cũ và đóng hộp thoại.

---

## 4. Mô tả chi tiết (Màn hình & Luồng)

### 4.1. Mô tả Màn hình

*   **Hộp thoại Hủy lịch:** Hiển thị dưới dạng một cửa sổ nổi nhỏ ở giữa màn hình. Phía trên cùng có biểu tượng cảnh báo và thông điệp nền màu đỏ nhạt để nhân viên cân nhắc kỹ. Giữa hộp thoại là danh sách thả xuống chọn lý do hủy và ô nhập ghi chú bổ sung. Dưới cùng là hai nút Đóng và Xác nhận hủy.
*   **Hộp thoại Đổi buổi học:** Hiển thị dưới dạng cửa sổ nổi lớn ở giữa màn hình. Phía trên cùng hiển thị tiêu đề "Đổi buổi học". Bên dưới tiêu đề là khối thông tin "Lớp cũ (đã giải phóng)" hiển thị tĩnh chi tiết lớp học cũ bị hủy gán trên nền màu cam/vàng mờ để Giáo vụ đối chiếu. Phần thân hộp thoại hiển thị danh sách các lớp học khả dụng có cấu trúc co giãn dạng đóng mở, tích hợp cùng bộ chọn khoảng ngày nằm ngang ở phía trên. Mỗi dòng ca học trong danh sách có một hộp kiểm để Giáo vụ tích chọn. Dưới cùng là ô ghi chú lớn gửi cho giáo viên và hai nút Hủy, Lưu thay đổi ở góc dưới bên phải.
*   **Trạng thái Đổi buổi trên giao diện chính:** Trên bảng danh sách chính, các phiếu ở trạng thái **Cần đổi lịch** sẽ hiển thị nhãn trạng thái màu đỏ để cảnh báo. Phần thông tin ca học sẽ hiển thị ở dạng trống kèm theo dòng ghi chú "Chưa chọn buổi học".
*   **Chi tiết phiếu cần đổi lịch:** Khi bấm vào xem chi tiết phiếu ở trạng thái **Cần đổi lịch**, giao diện hiển thị một vùng cảnh báo màu vàng phía trên thông báo "Phiếu yêu cầu đổi lịch từ hệ thống quản lý khách hàng". Ở phần Lớp & Buổi học sẽ xuất hiện nút "Đổi buổi" nổi bật để Giáo vụ thực hiện xử lý ghép lớp mới.

### 4.2. Luồng Hoạt động (Workflow)

#### Luồng 1: Hủy lịch học thử trực tiếp trên ERP
1.  Giáo vụ bấm nút **Hủy lịch** trên dòng danh sách hoặc tại bảng thông tin chi tiết của phiếu học thử.
2.  Hộp thoại Hủy lịch mở ra. Mặc định nút **Xác nhận hủy** ở trạng thái vô hiệu hóa (mờ đi).
3.  Giáo vụ chọn một lý do từ danh sách thả xuống. Nút **Xác nhận hủy** chuyển sang trạng thái khả dụng.
4.  Giáo vụ nhập thêm ghi chú bổ sung (nếu có) và bấm nút **Xác nhận hủy**.
5.  Hệ thống cập nhật trạng thái phiếu thành **Đã hủy**, giải phóng ca học đang gán, tạo một bản ghi mới trong nhật ký hoạt động của phiếu, đóng hộp thoại và tải lại danh sách chính.


#### Luồng 2: Xử lý đổi lịch học thử đồng bộ từ CRM
1.  Hệ thống quản lý khách hàng (CRM) đồng bộ thông tin đổi lịch sang ERP. Hệ thống ERP tự động cập nhật trạng thái phiếu thành **Cần đổi lịch** và xóa thông tin ca học hiện tại của phiếu học thử đó để giải phóng chỗ học.
2.  Giáo vụ lọc danh sách theo trạng thái **Cần đổi lịch** để định vị các phiếu cần xử lý gấp.
3.  Giáo vụ bấm chọn phiếu để mở bảng thông tin chi tiết, sau đó bấm nút **Đổi buổi** tại mục Lớp & Buổi học.
4.  Hộp thoại ghép lớp (mô tả ở `US-ENR02-03`) mở ra. Hộp thoại hiển thị thông tin ca học cũ đã bị giải phóng ở một góc riêng để làm căn cứ tham chiếu.
5.  Giáo vụ thực hiện tìm kiếm và chọn ca học mới phù hợp trong danh sách, sau đó bấm **Lưu thay đổi**.
6.  Hệ thống cập nhật ca học mới được chọn, chuyển trạng thái phiếu về **Chờ xác nhận**, lưu trữ ca học cũ vào mục lịch sử "Lớp cũ đã giải phóng", ghi nhận lịch sử hoạt động và đóng hộp thoại.

---

## 5. Corner Cases (Trường hợp góc cạnh & Đặc biệt)

| # | Tình huống đặc biệt (Corner Case) | Cách xử lý chi tiết | Ghi chú / Trạng thái |
| :--- | :--- | :--- | :--- |
| 5.1 | Giáo vụ cố tình hủy lịch học thử đã hoàn thành hoặc vắng mặt | Hệ thống ẩn hoàn toàn nút "Hủy lịch" trên cả dòng danh sách và bảng chi tiết, ngăn chặn mọi thao tác thay đổi trạng thái. | Chặn thao tác |
| 5.2 | Phiếu ở trạng thái Cần đổi lịch nhưng không tìm được ca học phù hợp | Hệ thống cho phép Giáo vụ thay đổi bộ lọc thời gian để tìm lớp ở tuần khác, hoặc giữ nguyên trạng thái Cần đổi lịch để chờ cập nhật tiếp từ CRM/Sales mà không bắt buộc phải lưu. | |
| 5.3 | Bấm ra ngoài hộp thoại Hủy lịch hoặc hộp thoại Đổi buổi khi đang nhập dở | Ngăn chặn việc tự động đóng hộp thoại để tránh mất thông tin đang nhập dở. Người dùng bắt buộc phải bấm nút Đóng/Hủy để xác nhận tắt. | Bảo vệ dữ liệu |
| 5.4 | Mất kết nối internet khi đang thực thi thao tác | Hệ thống hiển thị thông báo lỗi kết nối mạng, chặn đóng hộp thoại và giữ nguyên mọi dữ liệu đã chọn/nhập để Giáo vụ có thể bấm gửi lại khi có mạng. | Chống mất dữ liệu |
| 5.5 | Trùng lặp thao tác xử lý đổi buổi đồng thời với cập nhật từ CRM | Khi Giáo vụ bấm Lưu ca mới, nếu hệ thống kiểm tra thấy thông tin phiếu đã bị thay đổi ở CRM so với lúc Giáo vụ mở màn hình, hệ thống sẽ chặn lưu, báo lỗi xung đột dữ liệu và yêu cầu tải lại trang. | Xung đột đồng thời |
| 5.6 | Hủy ca học sát giờ quy định (dưới 2 giờ trước giờ học) | Hệ thống hiển thị thêm một cảnh báo phụ nhắc nhở Giáo vụ về việc hủy sát giờ học, nhưng vẫn cho phép thực thi để giải phóng chỗ học kịp thời cho ca học đó. | Cảnh báo vận hành |
| 5.7 | Phiếu đang ở trạng thái Bị từ chối ghép muốn thực hiện hủy lịch | Hệ thống vẫn hiển thị nút Hủy lịch và cho phép chuyển hẳn sang Đã hủy để giải phóng hồ sơ học thử. | |
| 5.8 | Ghi chú hủy lịch vượt quá giới hạn ký tự | Hệ thống chặn không cho nhập tiếp khi đạt giới hạn 500 ký tự hoặc hiển thị viền đỏ báo lỗi và chặn bấm Xác nhận hủy nếu sao chép dán đoạn văn dài quá quy định. | Kiểm tra độ dài |
| 5.9 | Ca học mới bị đầy sĩ số trong lúc Giáo vụ đang thao tác trên hộp thoại Đổi buổi | Khi Giáo vụ bấm "Lưu thay đổi", hệ thống kiểm tra sĩ số thực tế ca học mới tại thời điểm lưu. Nếu đã đầy (do học viên khác giữ chỗ trước), hệ thống chặn lưu, báo đỏ ca học đó và yêu cầu chọn ca học khả dụng khác. | Sĩ số thời gian thực |
| 5.10 | CRM gửi yêu cầu đổi buổi khi lịch học thử trên ERP đã Hoàn thành hoặc Đã hủy | Hệ thống ERP tự động từ chối cập nhật trạng thái đổi lịch từ CRM, giữ nguyên trạng thái kết thúc của phiếu học thử và gửi phản hồi thông báo ngược lại cho CRM để Sales nắm thông tin. | Chặn thay đổi ngược dòng |

---

## 6. Tiêu chí Nghiệm thu (Acceptance Criteria)

- **AC-1 (Bắt buộc chọn lý do hủy):** Trên hộp thoại hủy lịch, trường Chọn lý do hủy là bắt buộc điền. Nếu để trống lý do, nút Xác nhận hủy bắt buộc phải hiển thị ở trạng thái mờ (vô hiệu hóa).
- **AC-2 (Giải phóng ca học khi hủy):** Sau khi Giáo vụ xác nhận hủy lịch thành công, trạng thái phiếu phải chuyển sang Đã hủy, đồng thời sĩ số của ca học cũ được ghép trước đó phải tự động giảm đi 1 học viên học thử ngay lập tức.
- **AC-3 (Xác nhận rủi ro hủy):** Nút Xác nhận hủy trên hộp thoại hủy lịch bắt buộc phải sử dụng màu đỏ cảnh báo rủi ro và yêu cầu xác nhận trước khi cập nhật.
- **AC-4 (Không tự tạo yêu cầu đổi lịch):** Trên toàn bộ giao diện ERP V1, không hiển thị bất kỳ nút, liên kết hay biểu mẫu nào cho phép người dùng tự tạo yêu cầu đổi lịch thủ công. Trạng thái đổi lịch chỉ xuất hiện do đồng bộ tự động từ hệ thống CRM.
- **AC-5 (Thao tác xử lý đổi buổi):** Đối với các phiếu có trạng thái Cần đổi lịch, giao diện chi tiết phải hiển thị nút Đổi buổi. Khi bấm vào, hệ thống phải mở ra hộp thoại chọn ca học như mô tả trong đặc tả ghép lớp.
- **AC-6 (Lưu thông tin ca học cũ):** Sau khi Giáo vụ xử lý đổi buổi thành công (chọn ca mới và bấm lưu), thông tin ca học cũ bị hủy gán bắt buộc phải được tự động ghi nhận vào mục "Lớp cũ (đã giải phóng)" để hiển thị tĩnh trên giao diện chi tiết.
- **AC-7 (Ghi nhật ký hoạt động):** Mọi hành động Hủy lịch hoặc Đổi buổi thành công đều phải tự động ghi nhận 1 dòng lịch sử tương ứng vào phần Nhật ký hoạt động của phiếu học thử, bao gồm đầy đủ thông tin: thời gian, người thực hiện, hành động và lý do/ghi chú đi kèm.
- **AC-8 (Kiểm soát vai trò người dùng):** Các nút Hủy lịch và Đổi buổi chỉ được phép hiển thị và hoạt động đối với người dùng đăng nhập bằng tài khoản có vai trò Giáo vụ hoặc Quản lý chi nhánh. Các vai trò khác chỉ được xem thông tin tĩnh.
- **AC-9 (Khóa tích chọn ca đã đầy sĩ số khi đổi buổi):** Trên hộp thoại đổi buổi học, toàn bộ ca học của các lớp khả dụng đã đạt tối đa sĩ số chứa phòng bắt buộc phải hiển thị ở trạng thái mờ (vô hiệu hóa) và không cho phép tích chọn hộp kiểm.
- **AC-10 (Đồng bộ sĩ số đồng thời khi đổi buổi thành công):** Ngay sau khi bấm "Lưu thay đổi" đổi buổi thành công, hệ thống phải thực hiện trừ sĩ số lớp học cũ (giải phóng chỗ) và cộng sĩ số ca học mới (giữ chỗ) một cách đồng thời và chính xác.