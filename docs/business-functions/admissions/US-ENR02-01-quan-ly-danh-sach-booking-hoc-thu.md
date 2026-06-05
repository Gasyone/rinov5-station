---
id: US-ENR02-01
title: "Quản lý danh sách Booking Học thử"
bf: BF-ENR-02
domain: CAP-ADM
status: draft
tags: [enrollment, trial, list]
---

# US-ENR02-01: Quản lý danh sách Booking Học thử

> **Tham chiếu:** BF-ENR-02 · `[POLICY-DS-03]` · Giao diện Mẫu §4.2 (Danh sách)

## 1. Yêu cầu Người dùng (User Story)

**Là một** Tư vấn viên, Giáo vụ hoặc Quản lý chi nhánh,
**tôi muốn** xem danh sách phiếu đăng ký học thử của học viên, thực hiện tìm kiếm, lọc nhanh theo chi nhánh, theo trạng thái và bộ lọc nâng cao,
**để** nắm bắt chính xác tiến độ xếp lớp, phát hiện các ca cần đổi lịch, xem kết quả nhận xét của giáo viên và thực hiện các bước chăm sóc tiếp theo nhằm nâng cao tỷ lệ chốt lớp dài hạn.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai độc lập với các phân hệ quản lý lớp học chính thức.
> - [x] **N**egotiable — Các trường thông tin hiển thị và nút thao tác nhanh có thể tùy biến linh hoạt.
> - [x] **V**aluable — Giúp điều phối viên và nhân viên tư vấn theo dõi chặt chẽ học viên trải nghiệm.
> - [x] **E**stimable — Đã xác định rõ cấu trúc dữ liệu, các thẻ trạng thái và bảng lọc.
> - [x] **S**mall — Hoàn thành trong một đợt phát triển.
> - [x] **T**est-able — Có tiêu chí nghiệm thu cụ thể ở mục 6.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1.  **[RULE-LIST-01] Thẻ lọc trạng thái chính:**
    *   Màn hình danh sách chính cung cấp các thẻ lọc trạng thái để lọc nhanh: **Tất cả**, **Chờ xác nhận**, **Từ chối ghép**, **Đã ghép lớp**, **Cần đổi lịch**, **Hoàn thành**, và **Đã hủy** (bao gồm cả các trường hợp học sinh không đến học thử được gộp vào đây).
    *   *Đối với màn hình nâng cấp (V2):* Thanh công cụ tích hợp thêm thẻ lọc ảo **"Chưa gán lớp"** để lọc nhanh các phiếu đăng ký học thử chưa có ca học nào được gán (bất kể trạng thái chính là gì).
2.  **[RULE-LIST-02] Tìm kiếm đa trường:** Ô tìm kiếm hỗ trợ tìm kiếm nhanh (không phân biệt chữ hoa hay chữ thường) trên các thông tin: Mã phiếu học thử, Tên buổi học thử, Tên học viên, Mã khách hàng, Số điện thoại gia đình, và tên Chương trình học.
3.  **[RULE-LIST-03] Bộ lọc kết hợp đồng thời (AND logic):** Tất cả các điều kiện lọc gồm: Cơ sở, Thẻ trạng thái chính, Ô tìm kiếm và Bảng lọc nâng cao hoạt động đồng thời. Danh sách chỉ hiển thị các bản ghi thỏa mãn tất cả các điều kiện lọc đang chọn.
4.  **[RULE-LIST-04] Cập nhật số đếm:** Khi chọn lọc theo chi nhánh/cơ sở, số lượng thống kê hiển thị trên các thẻ trạng thái chính sẽ tự động tính toán lại và cập nhật tương ứng theo dữ liệu của cơ sở đã chọn.
5.  **[RULE-LIST-05] Bảo mật thông tin khách hàng:** Số điện thoại gia đình hiển thị trên bảng danh sách sẽ được ẩn một phần ở giữa để bảo vệ thông tin khách hàng (ví dụ: `0912****78`). Hệ thống cung cấp nút sao chép nhanh bên cạnh để nhân viên sao chép số điện thoại gốc khi cần gọi điện chăm sóc.
6.  **[RULE-LIST-06] Mở chi tiết dạng bảng nổi:** Khi nhấn vào một dòng bất kỳ trên bảng danh sách chính, hệ thống sẽ mở bảng nổi hiển thị chi tiết thông tin của phiếu học thử đó (đặc tả tại `US-ENR02-05`) trượt từ bên phải sang thay vì chuyển sang một trang mới, giúp giữ nguyên ngữ cảnh làm việc cho nhân viên.
7.  **[RULE-LIST-07] Trả kết quả nhận xét học thử:**
    *   Cột Nhận xét hiển thị động dựa trên trạng thái thực tế của phiếu học thử để nhân viên tư vấn dễ dàng tiếp cận kết quả đánh giá.
    *   Khi ca học thử ở trạng thái **Hoàn thành**, cột hiển thị nút "Xem nhận xét" dạng liên kết nổi bật có biểu tượng. Khi nhấn nút này, hệ thống sẽ mở ra một tab mới trên trình duyệt dẫn tới trang báo cáo chi tiết nhận xét mà không làm mất trang danh sách hiện tại.
    *   Khi ca học thử đã được gán nhưng giáo viên chưa hoàn tất nhận xét, cột hiển thị dòng chữ mờ "Chờ nhận xét".
    *   Khi chưa có ca học nào được gán cho học sinh, cột hiển thị dấu gạch ngang mờ "—".

### 2.1. Thông số & Định mức (Metrics & Thresholds)

- **[METRIC-01] Hiệu năng hiển thị:** Thời gian kết xuất danh sách tối đa không quá 1.5 giây với 1,000 bản ghi trên trình duyệt của người dùng.
- **[METRIC-02] Định mức phân trang:** Số lượng dòng hiển thị mặc định là 20 bản ghi trên mỗi trang.

---

## 3. Cấu trúc Giao diện & Dữ liệu

### 3.1. Thanh công cụ

| Thành phần | Loại hiển thị | Logic | Ghi chú |
| :--- | :--- | :--- | :--- |
| Chọn Cơ sở | Danh sách thả xuống | Lọc theo chi nhánh được chọn | Mặc định: "Tất cả cơ sở". |
| Ô tìm kiếm | Ô nhập chữ | Quét 6 trường định danh | Gợi ý: "Tìm mã, tên HV, SĐT...". |
| Nút Lọc nâng cao | Nút biểu tượng kèm số lượng | Mở bảng bộ lọc bên phải | Hiển thị số lượng bộ lọc đang áp dụng. |
| Nút Tạo Booking | Nút màu nhấn | Mở biểu mẫu tạo mới (US-ENR02-02) | Chỉ hiển thị ở phiên bản nâng cấp (V2). |

### 3.2. Khối lọc Trạng thái

| Thành phần | Nhóm màu | Điều kiện | Ghi chú |
| :--- | :--- | :--- | :--- |
| Tất cả | Mặc định | Bỏ lọc trạng thái | |
| Chờ xác nhận | Cảnh báo (vàng) | Trạng thái Chờ xác nhận | Mặc định khi vừa nhận thông tin từ CRM. |
| Chưa gán lớp | Cảnh báo (vàng) | Không có ca học nào được gán | Thẻ ảo (chỉ hiển thị ở bản V2). |
| Từ chối ghép | Tiêu cực (đỏ) | Trạng thái Từ chối ghép | |
| Đã ghép lớp | Tích cực (xanh lá) | Trạng thái Đã ghép lớp | |
| Cần đổi lịch | Tiêu cực (đỏ) | Trạng thái Cần đổi lịch | Biểu thị yêu cầu đổi lịch đồng bộ từ CRM. |
| Hoàn thành | Hoàn tất (xanh lam) | Trạng thái Hoàn thành | |
| Đã hủy | Trung tính (xám) | Trạng thái Đã hủy | Bao gồm cả trường hợp học sinh không đến. |

### 3.3. Bảng danh sách chính

*Bấm vào dòng -> Mở bảng nổi chi tiết (US-ENR02-05)*

| Cột | Loại hiển thị | Trường Dữ liệu | Ghi chú |
| :--- | :--- | :--- | :--- |
| Ô chọn | Hộp kiểm | Chọn một hoặc nhiều bản ghi | Cố định bên trái. |
| Booking / Tên | Chữ đậm + mã số | Tên buổi học thử và Mã phiếu | Kèm nhãn môn học. |
| Học viên | Chữ + mã phụ | Tên học sinh và Mã khách hàng | |
| Phụ huynh | Chữ + Nút sao chép | Tên phụ huynh, Số điện thoại đã ẩn và nút sao chép | Sao chép SĐT gốc khi bấm vào biểu tượng. |
| Lần | Chữ | Số lần đăng ký học thử của học sinh | Ví dụ: Lần 1, Lần 2. |
| Chương trình | Chữ | Tên chương trình học | |
| Lớp ghép | Chữ | Tên lớp + mã lớp | Hiển thị "Chưa ghép" nếu trống. |
| Buổi học | Chữ | Tên ca học thử duy nhất | Hiển thị "—" nếu trống. |
| Ngày giờ | Chữ | Ngày và giờ của ca học thử | Ví dụ: 20/05/2026 18:00 |
| Nhận xét | Nút liên kết nổi bật | Đường dẫn xem đánh giá nhận xét | Ở trạng thái Hoàn thành hiển thị nút bấm "Xem nhận xét" mở tab mới. Đang chờ hiển thị "Chờ nhận xét". Trống hiển thị "—". |
| Phụ trách | Nhóm ảnh tròn xếp chồng | Ảnh của người tạo và người phụ trách | Người phụ trách lấy theo Giáo viên của lớp. |
| Trạng thái | Nhãn màu | Trạng thái hiện tại | Theo bộ màu chuẩn từ hệ thống. |

### 3.4. Thao tác khi rê chuột vào dòng

| Nút | Loại | Logic | Điều kiện |
| :--- | :--- | :--- | :--- |
| Chấp thuận ghép | Nút biểu tượng | Duyệt nhanh sang trạng thái Đã ghép lớp | Chỉ xuất hiện ở dòng có trạng thái Chờ xác nhận. |
| Từ chối ghép | Nút biểu tượng | Từ chối nhanh sang trạng thái Từ chối ghép | Chỉ xuất hiện ở dòng có trạng thái Chờ xác nhận. |
| Đổi buổi học | Nút biểu tượng | Mở hộp thoại xếp lớp (US-ENR02-03) | Xuất hiện ở dòng có ca ghép và trạng thái hoạt động (Chờ xác nhận hoặc Đã ghép lớp). |
| Gọi điện | Nút biểu tượng | Gọi điện nhanh bằng tổng đài ảo | Luôn hiển thị khi di chuột qua cột Phụ huynh. |

### 3.5. Bảng lọc nâng cao

| Thành phần | Loại | Dữ liệu | Ghi chú |
| :--- | :--- | :--- | :--- |
| Nhóm Cơ sở | Hộp kiểm | Danh sách chi nhánh | |
| Nhóm Trạng thái | Hộp kiểm | Danh sách trạng thái | |
| Nhóm Ngày trong tuần | Hộp kiểm | Thứ Hai ... Chủ Nhật | |
| Nhóm Môn học | Hộp kiểm | Danh sách môn học | |
| Nhóm Chương trình | Hộp kiểm | Danh sách chương trình | |

### 3.6. Phân trang

Chuẩn `[20, 50, 100]` bản ghi/trang. Mặc định là 20 dòng.

---

## 4. Mô tả chi tiết (Màn hình & Luồng)

### 4.1. Mô tả Màn hình

*   **Bố cục giao diện chính:** Giao diện được sắp xếp gọn gàng theo chiều dọc, tối ưu hóa mật độ hiển thị để giảm thiểu thao tác cuộn trang của người dùng.
    *   **Thanh công cụ trên cùng:** Chứa bộ chọn Cơ sở dạng thả xuống bên trái và ô tìm kiếm nhanh co giãn nằm bên phải, cạnh bên là nút mở bảng lọc nâng cao.
    *   **Hàng thẻ trạng thái (Status Tiles):** Nằm ngay dưới thanh công cụ, hiển thị trực quan tổng số lượng phiếu học thử tương ứng với từng bộ lọc trạng thái. Thẻ đang được chọn sẽ hiển thị viền đậm và thay đổi màu nền để nhận diện.
    *   **Bảng dữ liệu chính:** Chiếm diện tích trung tâm, hiển thị đầy đủ thông tin ca học đơn của học viên. Cột đầu tiên là hộp kiểm chọn dòng, cột cuối cùng là nhãn trạng thái có màu sắc tiêu chuẩn. Khi di chuột vào dòng dữ liệu, các nút biểu tượng thao tác nhanh (Chấp thuận, Từ chối, Đổi buổi, Gọi điện) sẽ xuất hiện mờ ở các cột tương ứng.
    *   **Thanh phân trang cố định:** Nằm ở chân trang, hiển thị tổng số kết quả lọc và cho phép chọn số dòng hiển thị trên một trang.
*   **Bảng lọc nâng cao (Filter Sheet):** Khi bấm nút Lọc nâng cao trên thanh công cụ, một bảng dọc sẽ trượt ra mượt mà từ cạnh phải màn hình, chứa các nhóm lựa chọn hộp kiểm theo Cơ sở, Trạng thái, Ngày trong tuần, Môn học, và Chương trình học để Giáo vụ tích chọn lọc sâu.

### 4.2. Luồng Hoạt động (Workflow)

1.  **Xem danh sách:** Giáo vụ truy cập màn hình. Hệ thống tự động tải danh sách phiếu học thử thuộc cơ sở Giáo vụ đang quản lý, chọn thẻ trạng thái mặc định là "Tất cả".
2.  **Lọc dữ liệu:**
    *   Giáo vụ bấm trực tiếp vào các thẻ trạng thái (ví dụ thẻ "Cần đổi lịch") để lọc nhanh danh sách.
    *   Giáo vụ nhập mã học sinh hoặc số điện thoại vào ô tìm kiếm nhanh, danh sách tự động lọc kết quả tương ứng.
    *   Giáo vụ mở bảng lọc nâng cao, tích chọn các ngày trong tuần (ví dụ Thứ Bảy, Chủ Nhật) và môn học "Tiếng Anh" để xem lịch học thử cuối tuần.
3.  **Duyệt nhanh trên dòng:** Đối với các phiếu học thử có trạng thái "Chờ xác nhận", Giáo vụ di chuột qua dòng và bấm trực tiếp vào biểu tượng dấu tích xanh để Chấp thuận ghép lớp, hoặc dấu nhân đỏ để Từ chối ghép lớp mà không cần mở chi tiết phiếu.
4.  **Xem nhận xét giáo viên:** Đối với các ca học đã chuyển sang trạng thái "Hoàn thành", nhân viên tư vấn bấm vào liên kết "Xem nhận xét" ở cột Nhận xét. Hệ thống tự động mở một tab mới trên trình duyệt hiển thị chi tiết đánh giá năng lực của giáo viên.
5.  **Xem chi tiết đầy đủ:** Khi muốn xem lịch sử hoạt động hoặc các thông tin gia đình chi tiết hơn, người dùng bấm vào dòng tương ứng để mở bảng nổi chi tiết (US-ENR02-05) trượt từ cạnh phải màn hình sang.

---

## 5. Corner Cases (Trường hợp góc cạnh & Đặc biệt)

| # | Tình huống đặc biệt (Corner Case) | Cách xử lý chi tiết | Ghi chú / Trạng thái |
| :--- | :--- | :--- | :--- |
| 5.1 | Không có dữ liệu học thử trong hệ thống | Hiển thị màn hình trống với hình minh họa hướng dẫn rõ ràng và nút tải lại dữ liệu. | Áp dụng mẫu EmptyState |
| 5.2 | Tìm kiếm không trả về kết quả phù hợp | Hiển thị bảng trống kèm thông báo không tìm thấy kết quả phù hợp. Giữ nguyên tổng số ở thanh trạng thái chính. | |
| 5.3 | Mất kết nối khi đang tải danh sách | Hiển thị thông báo lỗi kết nối và nút bấm để người dùng thử tải lại dữ liệu. | Áp dụng mẫu ErrorState |
| 5.4 | Quyền hạn truy cập bị giới hạn | Hệ thống ẩn hoặc vô hiệu hóa các nút duyệt nhanh (Chấp thuận/Từ chối ghép) và nút Đổi buổi đối với người dùng không có vai trò Giáo vụ hoặc Quản lý chi nhánh. | Phân quyền truy cập |
| 5.5 | Sao chép số điện thoại đã mã hóa | Số điện thoại hiển thị dạng ẩn một phần `0912****78` để bảo vệ thông tin khách hàng, nhưng khi Giáo vụ bấm nút Sao chép, bộ nhớ tạm phải lưu được số điện thoại gốc nguyên vẹn (ví dụ `0912345678`). | Bảo mật khách hàng |
| 5.6 | Đồng bộ số đếm trên thẻ trạng thái khi áp dụng lọc nâng cao | Khi người dùng chọn lọc nâng cao (ví dụ môn học "Toán"), số liệu đếm hiển thị trên các thẻ trạng thái phía trên phải tự động cập nhật lại theo đúng số lượng bản ghi thực tế của bộ lọc hiện tại. | Thống kê động |
| 5.7 | Phân trang khi kết quả lọc ít hơn kích thước trang | Nếu tổng số kết quả lọc được ít hơn kích thước trang (ví dụ 12 bản ghi trên trang 20 dòng), bộ phân trang hiển thị "Trang 1/1" và các nút chuyển trang trước/sau bị vô hiệu hóa (mờ đi). | Kiểm soát phân trang |
| 5.8 | Hover hiển thị các nút thao tác trên thiết bị di động (cảm ứng) | Trên màn hình di động/máy tính bảng (không có con trỏ chuột), các nút thao tác nhanh (duyệt, từ chối, đổi buổi) phải được chuyển thành hiển thị trực tiếp hoặc tích hợp vào menu thao tác ba chấm. | Thích ứng thiết bị |
| 5.9 | Trùng lặp trạng thái khi thao tác trên nhiều tab trình duyệt | Giáo vụ mở danh sách trên 2 tab. Tab 1 bấm duyệt chấp thuận. Tại Tab 2 dòng đó vẫn hiển thị nút duyệt nhanh, nếu Giáo vụ bấm tiếp, hệ thống kiểm tra thấy trạng thái đã thay đổi, chặn thao tác, thông báo lỗi và tải lại dòng đó. | Xung đột đồng thời |
| 5.10 | Xóa toàn bộ bộ lọc khi đang lọc nhiều điều kiện kết hợp | Khi bấm nút "Xóa tất cả bộ lọc", hệ thống phải reset toàn bộ các điều kiện trong bảng lọc nâng cao, ô tìm kiếm và cơ sở về mặc định, đưa danh sách hiển thị về trang đầu tiên. | Reset bộ lọc |

---

## 6. Tiêu chí Nghiệm thu (Acceptance Criteria)

- **AC-1 (Bố cục chuẩn):** Giao diện hiển thị đầy đủ các vùng chức năng theo cấu trúc: Chọn cơ sở và ô tìm kiếm phía trên → Khối thẻ trạng thái thống kê số lượng → Bảng danh sách chính → Phân trang ở dưới cùng.
- **AC-2 (Bộ lọc cơ sở và cập nhật số đếm):** Thay đổi Cơ sở ở danh sách thả xuống phải lọc chính xác danh sách dữ liệu tương ứng của cơ sở đó, đồng thời số liệu đếm trên các thẻ trạng thái chính phải được tự động cập nhật lại.
- **AC-3 (Tìm kiếm đa trường không phân biệt chữ hoa thường):** Nhập từ khóa tìm kiếm (mã phiếu, tên học viên, số điện thoại...) phải lọc danh sách thực thời. Kết quả trả về chứa từ khóa tìm kiếm và không phân biệt chữ hoa hay chữ thường.
- **AC-4 (Lọc kết hợp đồng thời):** Chọn lọc kết hợp nhiều điều kiện (Cơ sở + Thẻ trạng thái + Bộ lọc nâng cao) phải thực hiện lọc đồng thời (AND) và chỉ trả về kết quả thỏa mãn tất cả các điều kiện đó.
- **AC-5 (Mã hóa số điện thoại và sao chép nhanh):** Số điện thoại gia đình trên dòng bảng phải được ẩn 4 chữ số ở giữa dạng `****`. Nút sao chép bên cạnh khi bấm vào phải hiển thị thông báo thành công và lưu đúng số điện thoại gốc vào bộ nhớ tạm.
- **AC-6 (Nút thao tác nhanh khi di chuột):** Khi di chuột (hover) qua dòng dữ liệu có trạng thái "Chờ xác nhận", các nút Chấp thuận ghép (tích xanh) và Từ chối ghép (nhân đỏ) phải xuất hiện để duyệt nhanh. Dòng có trạng thái hoạt động ("Chờ xác nhận" hoặc "Đã ghép lớp") phải xuất hiện nút "Đổi buổi" (mũi tên hai chiều).
- **AC-7 (Cột Nhận xét hiển thị động chính xác):**
  - Nếu trạng thái phiếu là "Hoàn thành", cột Nhận xét hiển thị nút "Xem nhận xét" mở tab mới dẫn tới đường dẫn `/app/trial_class/feedback/${id}`.
  - Nếu đã gán ca học nhưng chưa hoàn thành, hiển thị nhãn "Chờ nhận xét".
  - Nếu chưa gán ca học, hiển thị dấu gạch ngang "—".
- **AC-8 (Bảng nổi chi tiết trượt từ bên phải):** Bấm vào dòng dữ liệu bất kỳ trên bảng phải mở ra bảng nổi hiển thị thông tin chi tiết (US-ENR02-05) trượt từ bên phải màn hình mà không tải lại trang hiện tại.
- **AC-9 (Phân trang ổn định):** Thanh phân trang cho phép chọn kích thước trang `[20, 50, 100]`. Khi bấm chuyển trang hoặc đổi kích thước trang, bảng danh sách phải tải lại dữ liệu tương ứng của trang mới.
- **AC-10 (Xóa bộ lọc nhanh):** Nút "Xóa tất cả" trong bảng lọc nâng cao phải hoạt động chính xác, xóa sạch mọi ô đánh dấu đang chọn và đưa danh sách về trạng thái mặc định của cơ sở đang chọn.