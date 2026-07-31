# BIỂU MẪU THAO TÁC CHĂM SÓC HỌC VIÊN VÀ PHỤ HUYNH (GIAI ĐOẠN 1 - MVP)

**Mã tài liệu:** BM-CSKH-01  
**Thuộc quy trình:** Quy trình quản lý chăm sóc học viên và phụ huynh (`QT-CSKH-01`)  
**Tài liệu liên quan:** Phụ lục danh mục điều kiện chăm sóc (`PL-CSKH-01`), Lộ trình triển khai phân kỳ (`RM-CARE-01`)  
**Thay thế & Hợp nhất:** Biểu mẫu Yêu cầu chăm sóc (`BM-CSKH-01` cũ) và Biểu mẫu Ghi nhận chăm sóc (`BM-CSKH-02` cũ)  
**Phiên bản:** 1.0 (Áp dụng cho Giai đoạn 1 - MVP)  
**Ngày hiệu lực:** 01/08/2026  
**Đơn vị quản lý:** Bộ phận Chăm sóc khách hàng & Bộ phận Chuyên môn  
**Người lập:** Ban Dự án Rinov5  
**Người kiểm tra:** Quản lý Vận hành CARE  
**Người phê duyệt:** Giám đốc Sản phẩm  

---

## 1. Mục đích và Định hướng Thiết kế Giai đoạn 1

Tài liệu này quy định **Cấu trúc Biểu mẫu Thao tác Chăm sóc Hợp nhất** được áp dụng trong **Giai đoạn 1 (MVP)**.

Theo mô hình Enterprise chuẩn (Giai đoạn 3), hệ thống sử dụng 2 biểu mẫu tách biệt: *Biểu mẫu Yêu cầu (BM-01)* để phân công việc và *Biểu mẫu Ghi nhận (BM-02)* để lưu nhật ký cuộc gọi. Tuy nhiên, trong Giai đoạn 1 MVP, để tối giản hóa thao tác và áp dụng nguyên tắc **"Thao tác một điểm (Single Touchpoint)"**, hệ thống **HỢP NHẤT CẢ 2 BIỂU MẪU NÀY thành một Hộp thoại thông tin nổi (Popup Thao tác)** duy nhất trên màn hình danh sách.

Mục đích của việc hợp nhất bao gồm:
1. Nhân sự (Giáo viên / CSKH) chỉ cần nhấp chuột 1 lần vào dòng công việc trên màn hình để vừa xem thông tin được giao, vừa nhập kết quả liên hệ.
2. Tránh việc nhân sự phải di chuyển qua lại giữa nhiều biểu mẫu hoặc màn hình khác nhau.
3. Bảo đảm lưu trữ đầy đủ nội dung thông tin được giao, kết quả trao đổi và phản hồi của phụ huynh trong cùng một bản ghi.

---

## 2. Phạm vi Sử dụng và Đối tượng Thao tác

* **Phạm vi áp dụng:** Áp dụng cho toàn bộ hoạt động liên hệ (qua điện thoại, nhắn tin hoặc gặp trực tiếp) đối với các công việc chăm sóc thuộc Giai đoạn 1.
* **Đối tượng thao tác:** 
  - **Giáo viên phụ trách lớp:** Thao tác trên các công việc liên quan đến học tập và bài tập.
  - **Nhân sự CSKH cơ sở:** Thao tác trên các công việc liên quan đến chuyên cần, dịch vụ và rủi ro dừng học.

---

## 3. Cấu trúc Chi tiết Hộp thoại Thao tác Chăm sóc (Popup UI Schema)

Giao diện Hộp thoại thông tin nổi được chia thành 4 phần thông tin chính:

```text
┌───────────────────────────────────────────────────────────────────────────┐
│ HỘP THOẠI THAO TÁC CHĂM SÓC HỌC VIÊN                                      │
├───────────────────────────────────────────────────────────────────────────┤
│ PHẦN A. THÔNG TIN YÊU CẦU (Tự động hiển thị từ hệ thống)                  │
│ • Mã công việc | Học viên: [Họ tên] | Lớp: [Mã lớp] | Hạn xử lý: [Giờ, Ngày] │
│ • Nội dung phát sinh: [Danh sách điều kiện phát sinh cộng dồn]            │
├───────────────────────────────────────────────────────────────────────────┤
│ PHẦN B. KẾT QUẢ LIÊN HỆ THỰC TẾ (Nhân sự chọn/nhập)                       │
│ • Thời điểm liên hệ: [Tự động ghi nhận ngày giờ hiện tại]                  │
│ • Người được liên hệ: [Họ tên Phụ huynh / Quan hệ]                       │
│ • Kết quả liên hệ: (Ô chọn) [Liên hệ thành công / Phụ huynh bận / Khác]    │
│ • Kênh liên hệ: (Ô chọn) [Điện thoại / Tin nhắn / Gặp trực tiếp]          │
├───────────────────────────────────────────────────────────────────────────┤
│ PHẦN C. NỘI DUNG TRAO ĐỔI VÀ Ý KIẾN PHỤ HUYNH (Nhân sự nhập)              │
│ • Tóm tắt nội dung đã trao đổi: [Ô nhập văn bản]                         │
│ • Ý kiến / Nguyện vọng của phụ huynh: [Ô nhập văn bản]                    │
├───────────────────────────────────────────────────────────────────────────┤
│ PHẦN D. HÀNH ĐỘNG TIẾP THEO VÀ CẬP NHẬT TRẠNG THÁI (Nhân sự chọn)          │
│ • Trạng thái mới: (Ô chọn) [🟢 Hoàn thành | 🟡 Đang xử lý | 🔴 Chuyển QL]│
│ • Ngày hẹn gọi lại (nếu hẹn lại): [Ô chọn ngày giờ]                       │
│ • Ghi chú chuyển cấp (nếu chuyển QL): [Ô nhập văn bản]                    │
├───────────────────────────────────────────────────────────────────────────┤
│ [ Nút Hủy ]                                        [ Nút Lưu Ghi Nhận ]   │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Từ điển Dữ liệu Nghiệp vụ (Data Dictionary Table)

Dưới đây là chi tiết các trường thông tin trong Biểu mẫu thao tác hợp nhất Giai đoạn 1:

| STT | Tên trường thông tin | Kiểu dữ liệu | Bắt buộc nhập | Quy tắc dữ liệu & Hướng dẫn sử dụng (Validation Rule) |
| :---: | :--- | :---: | :---: | :--- |
| **1** | Mã công việc chăm sóc | Chuỗi ký tự | Tự động | Hệ thống tự động liên kết mã công việc đang mở. |
| **2** | Thông tin học viên & Lớp | Văn bản tĩnh | Tự động | Tự động hiển thị Họ tên học viên, Mã lớp và Tên phụ huynh mặc định. |
| **3** | Nội dung điều kiện phát sinh | Danh sách tĩnh | Tự động | Tự động hiển thị danh sách các điều kiện chăm sóc đã cộng dồn. |
| **4** | Hạn xử lý (SLA) | Ngày & Giờ | Tự động | Hiển thị thời hạn mục tiêu cần hoàn thành liên hệ. |
| **5** | Thời điểm thực hiện | Ngày & Giờ | Tự động | Hệ thống tự động ghi nhận ngày giờ thực tế khi nhân sự bấm mở hộp thoại. |
| **6** | Kênh liên hệ | Danh sách chọn | **Bắt buộc** | Chọn 1 trong các kênh: `Điện thoại`, `Tin nhắn`, `Gặp trực tiếp`, `Khác`. |
| **7** | Người được liên hệ | Chuỗi ký tự | **Bắt buộc** | Nhập họ tên phụ huynh/người giám hộ trực tiếp trao đổi (Mặc định gợi ý tên bố/mẹ). |
| **8** | Mối quan hệ với học viên | Danh sách chọn | **Bắt buộc** | Chọn: `Bố`, `Mẹ`, `Người giám hộ`, `Học viên trực tiếp`, `Khác`. |
| **9** | Kết quả liên hệ | Danh sách chọn | **Bắt buộc** | Chọn 1 trong các kết quả: <br>• `Liên hệ thành công`<br>• `Phụ huynh bận, hẹn gọi lại`<br>• `Không nghe máy / Không trả lời tin nhắn`<br>• `Sai số điện thoại / Thuê bao` |
| **10** | Tóm tắt nội dung trao đổi | Văn bản nhiều dòng | *Theo điều kiện* | **Bắt buộc nhập** khi Kết quả liên hệ là `Liên hệ thành công`. Ghi ngắn gọn thông tin đã cung cấp cho phụ huynh. |
| **11** | Ý kiến / Phản hồi phụ huynh | Văn bản nhiều dòng | *Theo điều kiện* | **Bắt buộc nhập** khi Kết quả liên hệ là `Liên hệ thành công`. Ghi nhận nguyên nhân, quan điểm hoặc nguyện vọng của phụ huynh. |
| **12** | Trạng thái công việc mới | Danh sách chọn | **Bắt buộc** | Chọn 1 trong 3 trạng thái: <br>• 🟢 `Hoàn thành` (Khi liên hệ thành công và đã thống nhất)<br>• 🟡 `Đang xử lý` (Khi chưa liên hệ được hoặc hẹn gọi lại)<br>• 🔴 `Chuyển Quản lý` (Khi cần chuyển cấp khẩn) |
| **13** | Ngày hẹn gọi lại | Ngày & Giờ | *Theo điều kiện* | **Bắt buộc chọn** khi Kết quả liên hệ là `Phụ huynh bận, hẹn gọi lại` hoặc Trạng thái mới là `Đang xử lý`. |
| **14** | Ghi chú chuyển cấp | Văn bản nhiều dòng | *Theo điều kiện* | **Bắt buộc nhập** khi Trạng thái mới là `Chuyển Quản lý`. Nêu rõ lý do cần Quản lý hỗ trợ (ví dụ: học viên có nguy cơ xin nghỉ học). |

---

## 5. Quy tắc Ràng buộc Kiểm tra Dữ liệu (Validation Rules)

Để bảo đảm chất lượng dữ liệu nhật ký chăm sóc, hệ thống tự động kiểm tra các ràng buộc sau khi người dùng bấm **[Lưu Ghi Nhận]**:

1. **Trường hợp Liên hệ thành công và Chuyển trạng thái Hoàn thành:**
   - Bắt buộc phải nhập đầy đủ *Tóm tắt nội dung trao đổi* (Tối thiểu 10 ký tự) và *Ý kiến / Phản hồi phụ huynh* (Tối thiểu 10 ký tự).
   - Hệ thống không cho phép lưu nếu ghi chú chung chung kiểu "đã gọi", "đã trao đổi".

2. **Trường hợp Phụ huynh bận hoặc Hẹn gọi lại:**
   - Bắt buộc phải chọn *Ngày hẹn gọi lại* (Thời gian hẹn phải lớn hơn thời điểm hiện tại).
   - Trạng thái công việc tự động duy trì ở mức 🟡 **Đang xử lý**.

3. **Trường hợp Không liên hệ được (Không nghe máy / Thuê bao):**
   - Không bắt buộc nhập *Ý kiến phụ huynh*.
   - Trạng thái công việc tự động giữ ở mức 🟡 **Đang xử lý** và đếm số lần liên hệ thất bại.

4. **Trường hợp Chuyển Quản lý xử lý:**
   - Bắt buộc phải nhập *Ghi chú chuyển cấp* giải thích lý do cần Quản lý tham gia.
   - Hệ thống tự động phát thông báo tới màn hình làm việc của Quản lý cơ sở.

---

## 6. Quy trình Vận hành và Lưu trữ Dữ liệu

1. **Một lần liên hệ = Một dòng nhật ký:** Mỗi lần nhân sự lưu hộp thoại thao tác, hệ thống ghi lại một bản ghi nhật ký tương tác gắn liền với hồ sơ công việc của học viên.
2. **Cập nhật lịch sử học viên:** Toàn bộ nội dung trao đổi và ý kiến phụ huynh được tự động hiển thị trong phần **Lịch sử chăm sóc** tại màn hình chi tiết học viên.
3. **Cập nhật danh sách công việc:** Công việc sau khi lưu sẽ lập tức cập nhật màu sắc trạng thái tương ứng (Xanh lá: Hoàn thành | Vàng: Đang xử lý | Đỏ: Chuyển Quản lý) trên Bảng danh sách làm việc của nhân sự.

---

## 7. Kết luận

Biểu mẫu Thao tác Chăm sóc Hợp nhất `BM-CSKH-01` phiên bản Giai đoạn 1 (MVP) là giải pháp thiết kế tinh gọn giúp Giáo viên và Nhân sự CSKH tiết kiệm tối đa thời gian thao tác, chỉ cần thực hiện trên một giao diện duy nhất mà vẫn bảo đảm lưu trữ 100% dữ liệu nghiệp vụ chuẩn xác.
