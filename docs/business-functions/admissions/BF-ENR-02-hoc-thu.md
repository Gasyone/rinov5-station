---
title: "BF-ENR-02: Học thử ghép buổi"
type: "Business Function"
domain: "CAP-ADM"
status: "Active"
tags: [enrollment, trial, booking]
---

# BF-ENR-02: Học thử ghép buổi (Trial Session)

> **Phân hệ thuộc:** CAP-ADM (Tuyển sinh & Thương mại)
> **Giai đoạn:** 1 - Tuyển sinh
> **Nhóm chức năng:** Quản lý học thử
> **Mã màn hình:** `trial_class` (V1) & `trial_class_v2` (V2)

---

## 1. Mô tả tổng quan

Phân hệ quản lý toàn bộ vòng đời của một lịch học thử theo mô hình ghép buổi. Khách hàng tiềm năng hoặc học viên mới sẽ được sắp xếp tham gia trải nghiệm trực tiếp vào **đúng 1 buổi học duy nhất** của một lớp học chính thức đang vận hành để đánh giá mức độ phù hợp trước khi quyết định đăng ký học chính thức dài hạn.

Nghiệp vụ này đóng vai trò quyết định trong việc chuyển đổi khách hàng tiềm năng thành học viên chính thức bằng cách hiển thị các nhận xét, đánh giá trực quan được lấy về từ giáo viên, tạo cơ sở dữ liệu thuyết phục để nhân viên tư vấn liên hệ chốt hợp đồng chốt sale.

---

## 2. Đối tượng sử dụng (Vai trò)

*   **Nhân viên Tư vấn (Sales):** Ghi nhận nhu cầu học thử của khách hàng từ hệ thống quản lý khách hàng hoặc tạo trực tiếp trên hệ thống (đối với bản V2), theo dõi trạng thái và kết quả học thử để thực hiện chăm sóc và chốt hợp đồng.
*   **Giáo vụ / Quản lý Chi nhánh (Coordinator):** Phê duyệt/Từ chối xếp lớp, thực hiện xếp ca học thử cho khách vào lớp phù hợp, giải quyết các yêu cầu hủy lịch học thử hoặc điều phối đổi buổi học.
*   **Giáo viên (Teacher):** Tiến hành giảng dạy buổi học thử (việc điểm danh và nhận xét thực hiện tại phân hệ quản lý buổi học).

---

## 3. Ranh giới Nghiệp vụ (Scope)

### Có bao gồm (In Scope)
*   Ghi nhận nhu cầu học thử (chương trình, môn học, cơ sở, ghi chú).
*   Quản lý danh sách đăng ký học thử theo các trạng thái vòng đời thực tế.
*   Thực hiện ghép nối học viên vào một lớp và **1 ca học cụ thể** (lọc theo khoảng ngày mong muốn).
*   Duyệt ghép lớp: Hành động chấp thuận ghép hoặc từ chối ghép ca học thử của Giáo vụ/Quản lý chi nhánh.
*   Xử lý điều phối: Đổi buổi học sang ca học khác, hoặc hủy lịch học thử trực tiếp trên hệ thống.
*   **Hiển thị kết quả (Chỉ xem):** Lấy dữ liệu điểm danh, số sao đánh giá và liên kết nhận xét của Giáo viên từ phân hệ quản lý buổi học về để hiển thị tĩnh trên màn hình học thử.

### Không bao gồm (Out of Scope)
*   Tổ chức lớp học thử riêng biệt chỉ gồm toàn học sinh học thử → Xử lý tại phân hệ quản lý lớp học.
*   Tạo đơn hàng học phí dài hạn → Xử lý tại phân hệ bán hàng.
*   Xếp lịch học thử nhiều buổi cho phiên bản V1 → V1 chỉ hỗ trợ **tối đa 1 buổi học thử**.
*   Chuyển đổi hồ sơ khách hàng tiềm năng trực tiếp thành học viên chính thức dài hạn → Việc này diễn ra trên hệ thống quản lý khách hàng hoặc do luồng ghi danh của phân hệ quản lý học viên thực hiện khi phát sinh đơn hàng thành công.
*   **Vận hành điểm danh và viết nhận xét của Giáo viên:** Toàn bộ việc điểm danh (Có mặt/Vắng mặt) và nhập nội dung đánh giá năng lực của học sinh học thử thuộc phạm vi phân hệ quản lý buổi học, không nằm trong phân hệ này.
*   **Yêu cầu đổi lịch (chờ dời ca giải phóng lớp cũ):** V1 không hỗ trợ quy trình trung gian gửi yêu cầu đổi lịch (chuyển trạng thái chờ dời ca không gán lớp). V1 thực hiện đổi buổi trực tiếp sang ca học mới.

---

## 4. Mô hình Dữ liệu Nghiệp vụ (Data Entities)

| Tên Thực thể | Trường định danh | Thuộc tính quan trọng | Ràng buộc quan hệ | Diễn giải |
| :--- | :--- | :--- | :--- | :--- |
| **Lịch Học thử** | Mã học thử | Ca ghép duy nhất, Trạng thái, Kết quả đánh giá (chỉ xem), Người tạo, Người phụ trách | Trỏ về Mã khách hàng & Mã buổi học | Phiếu quản lý ca học thử của một học viên/khách hàng tiềm năng. |

### 4.1. Vòng đời Trạng thái chuẩn hóa (Status Lifecycle)

Sơ đồ dưới đây xác định vòng đời nghiệp vụ chuẩn của một lịch học thử V1:

```mermaid
stateDiagram-v2
    [*] --> pending_approval : Tạo mới nhu cầu (Chờ xác nhận)
    pending_approval --> confirmed : Chấp thuận ghép lớp
    pending_approval --> rejected : Từ chối ghép lớp
    
    confirmed --> cancelled : Hủy lịch học thử (giải phóng ca / vắng mặt)
    confirmed --> completed : Hoàn thành nhận xét (đồng bộ tự động)
    
    rejected --> pending_approval : Chọn ca học mới
    rejected --> cancelled : Hủy lịch
    
    completed --> [*]
    cancelled --> [*]
    
    state pending_approval as "Chờ xác nhận"
    state confirmed as "Đã ghép lớp"
    state rejected as "Từ chối ghép"
    state completed as "Hoàn thành"
    state cancelled as "Đã hủy"
```

**Quy tắc chuyển đổi trạng thái:**

| Từ trạng thái | Sang trạng thái | Điều kiện bắt buộc | Vai trò được phép |
| :--- | :--- | :--- | :--- |
| **Chờ xác nhận** | **Đã ghép lớp** | Giáo vụ kiểm tra lớp học phù hợp và bấm "Chấp thuận ghép lớp". | Giáo vụ / Quản lý |
| **Chờ xác nhận** | **Từ chối ghép** | Lớp học không phù hợp, Giáo vụ bấm "Từ chối ghép lớp". | Giáo vụ / Quản lý |
| **Từ chối ghép** | **Chờ xác nhận** | Chọn ca học mới phù hợp cho học sinh và bấm "Lưu thay đổi". | Giáo vụ / Quản lý |
| **Đã ghép lớp** | **Chờ xác nhận** | Giáo vụ thực hiện đổi buổi học trực tiếp sang ca mới. | Giáo vụ / Quản lý |
| **Đã ghép lớp** | **Hoàn thành** | *Đồng bộ tự động:* Giáo viên hoàn tất nộp phiếu nhận xét học thử tại phân hệ quản lý buổi học. | Hệ thống |
| **Đã ghép lớp** | **Đã hủy** | *Hủy lịch hoặc Đồng bộ tự động:* Giáo vụ hủy lịch học thử hoặc Giáo viên điểm danh vắng mặt học thử tại phân hệ quản lý buổi học. | Giáo vụ / Hệ thống |

---

## 5. Quy tắc Nghiệp vụ Tổng thể (Business Rules)

### 5.1. Quy tắc giới hạn số lần đặt lịch học thử
1.  **[RULE-ENR-02-01] Giới hạn số lần:** Một học viên chỉ được phép đặt lịch học thử tối đa **2 lần trong vòng 3 tháng**.
2.  **[RULE-ENR-02-02] Phân bổ giáo viên:** Trong 2 lần học thử này, bắt buộc phải gồm **1 lần ghép với Giáo viên Việt Nam** và **1 lần ghép với Giáo viên Nước ngoài** để học viên có trải nghiệm toàn diện.
3.  **[RULE-ENR-02-03] Cơ chế tính chu kỳ:** Chu kỳ 3 tháng được kích hoạt và tính từ ngày hệ thống phát sinh booking học thử đầu tiên của học viên.
4.  **[RULE-ENR-02-04] Giới hạn đồng thời:** Học viên chỉ được phép có **tối đa 1 lịch học thử đang hoạt động** (ở các trạng thái Chờ xác nhận, Đã ghép lớp) tại một thời điểm. Không được phép tạo nhiều lịch gối đầu.

### 5.2. Đồng bộ dữ liệu nhận xét
5.  **[RULE-ENR-02-05] Đồng bộ kết quả đánh giá:** Hệ thống tự động kéo dữ liệu điểm danh, số sao đánh giá và liên kết báo cáo nhận xét chi tiết của buổi học thử được giáo viên nhập bên phân hệ quản lý buổi học về để hiển thị tĩnh trên chi tiết học thử, đồng thời tự động gửi liên kết nhận xét này sang hệ thống quản lý khách hàng cho nhân viên chăm sóc.

---

## 6. Danh sách Yêu cầu Người dùng (User Stories)

| Mã Yêu cầu | Tên Yêu cầu | Loại màn hình | Trạng thái |
| :--- | :--- | :--- | :--- |
| **US-ENR02-01** | [Quản lý danh sách Booking Học thử](file:///C:/Users/Jacky%20Tran/Documents/Rinov5/docs/business-functions/admissions/US-ENR02-01-quan-ly-danh-sach-booking-hoc-thu.md) | Bảng danh sách chính | Đang hoạt động |
| **US-ENR02-02** | [Tạo mới Booking học thử](file:///C:/Users/Jacky%20Tran/Documents/Rinov5/docs/business-functions/admissions/US-ENR02-02-tao-moi-booking-hoc-thu.md) | Bảng nổi tạo mới (V2) | Đang hoạt động |
| **US-ENR02-03** | [Thao tác Ghép lớp và ca học](file:///C:/Users/Jacky%20Tran/Documents/Rinov5/docs/business-functions/admissions/US-ENR02-03-thao-tac-ghep-lop-va-buoi-hoc.md) | Hộp thoại xếp ca học | Đang hoạt động |
| **US-ENR02-04** | [Xử lý ngoại lệ Booking](file:///C:/Users/Jacky Tran/Documents/Rinov5/docs/business-functions/admissions/US-ENR02-04-xu-ly-ngoai-le-booking.md) | Hộp thoại thao tác | Đang hoạt động |
| **US-ENR02-05** | [Xem và cập nhật Chi tiết Booking](file:///C:/Users/Jacky%20Tran/Documents/Rinov5/docs/business-functions/admissions/US-ENR02-05-chi-tiet-booking-hoc-thu.md) | Bảng nổi chi tiết | Đang hoạt động |