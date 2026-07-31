---
name: product_process_checker
description: Verifies business documentation files (CAP, BF, US, FLOW) in the Rinov5 project against the Product Development Process checklists (Quality Gate 1 / Checklist A and Quality Gate 2 / Checklist B) and UI/UX design criteria.
---

# Kỹ năng Kiểm duyệt Tài liệu Nghiệp vụ theo Product Development Process

Kỹ năng này hướng dẫn AI Agent thực hiện rà soát, đánh giá và kiểm tra chất lượng các tài liệu nghiệp vụ (bao gồm Capability - CAP, Business Function - BF, User Story - US, và End-to-End Flow - FLOW) trước khi xuất bản lên Confluence hoặc đưa sang bộ phận Phát triển (Dev) và Kiểm thử (QA).

---

## 1. Cách kích hoạt và sử dụng tự động

Khi người dùng yêu cầu kiểm tra tài liệu, Agent sẽ tự động chạy script Node.js được tích hợp sẵn để phân tích cú pháp và phát hiện lỗi:

```bash
node .agents/skills/product_process_checker/scripts/check_document.mjs <duong_dan_tai_lieu>
```

---

## 2. Các Tiêu chí và Checklist cần kiểm tra thủ công

Ngoài việc chạy script, Agent cần đọc tài liệu và kiểm chứng các tiêu chí chiều sâu nghiệp vụ:

### 2.1. Phân loại Nhánh Quy trình (Standard vs Risk)
Dựa trên 5 tiêu chí để tính điểm rủi ro (0 điểm $\rightarrow$ 🟢 **Standard** | $\ge 1$ điểm $\rightarrow$ 🔴 **Risk**):
1. **A. Phạm vi ảnh hưởng:** Ảnh hưởng $\ge 2$ module hoặc thay đổi kiến trúc/database? (1 điểm)
2. **B. Tác động tài chính:** Liên quan doanh thu, chi phí, hoặc nghĩa vụ pháp lý? (1 điểm)
3. **C1. Loại thay đổi:** Revamp toàn bộ chức năng/giao diện cũ? (1 điểm)
4. **C2. Độ mới nghiệp vụ:** Nghiệp vụ mới hoàn toàn chưa từng làm? (1 điểm)
5. **D. Phụ thuộc bên ngoài:** Phụ thuộc bên thứ 3 hoặc API đối tác bên ngoài? (1 điểm)

> [!IMPORTANT]
> - **🟢 Nhánh Standard:** AI verify đạt chuẩn chất lượng $\rightarrow$ Tự động thông qua (Auto-pass).
> - **🔴 Nhánh Risk:** AI verify đạt $\rightarrow$ Bắt buộc PM (Project Manager) ký duyệt trên Confluence.

---

### 2.2. Quality Gate 1 – Checklist A (Xác nhận xây đúng sản phẩm)
- **Vì sao phải làm?** Mục tiêu giải quyết bài toán nghiệp vụ gì rõ ràng.
- **Làm cho ai?** Persona rõ ràng (BM, Giáo vụ, Giáo viên, v.v.) và Use case tương ứng.
- **Người dùng sử dụng thế nào?** Có sơ đồ luồng sử dụng `Mermaid` từ đầu đến cuối.
- **Business Rules?** Các điều kiện ràng buộc và ngoại lệ của nghiệp vụ.
- **Feature Scope?** Bảng chức năng có ID, mức ưu tiên Must/Should/Could và nhãn Risk/Standard.
- **Thiết kế UI/UX dễ dùng?** Đạt 6 tiêu chuẩn:
  1. Ưu tiên thông tin quan trọng hiển thị nổi bật.
  2. Tối giản nội dung, không hiển thị trùng lặp.
  3. Nhóm các thông tin liên quan và bố trí hợp lý.
  4. Thuật ngữ nghiệp vụ, icon và cách tương tác nhất quán.
  5. Thao tác chính $\le 3$ bước (cho tác vụ đơn giản).
  6. Bảng dữ liệu tinh gọn (hạn chế cuộn ngang).
- **KPI đo lường:** Xác định chỉ số baseline, mục tiêu kỳ vọng và cách đo lường.

---

### 2.3. Quality Gate 2 – Checklist B (Xác nhận tài liệu đủ rõ để Dev)
- **Acceptance Criteria (AC):** Tối thiểu $\ge 3$ AC/chức năng, định dạng Giả sử - Khi - Thì (Given - When - Then), phủ đầy đủ cả Happy, Alternate, và Exception paths.
- **Exception Flow:** Luồng ngoại lệ xử lý khi mất mạng, sai dữ liệu, sai quyền, hoặc timeout.
- **Validation Rules:** Định nghĩa rõ ràng cho từng trường thông tin nhập liệu (bắt buộc/không, định dạng, độ dài, unique).
- **Phân quyền người dùng (Permission Matrix):** Bảng vai trò tương ứng với quyền xem/thêm/sửa/xóa/duyệt.
- **Yêu cầu phi chức năng:** Thời gian phản hồi kỳ vọng, bảo mật, v.v.
- **API Spec:** Cấu trúc gói tin request/response (nếu có).
- **Open Questions = 0:** Không còn câu hỏi bỏ ngỏ trong tài liệu.
- **Dependencies = 0:** Không còn mối phụ thuộc kỹ thuật chưa có phương án xử lý.

---

### 2.4. Ngôn ngữ Tự nhiên Nghiệp vụ (POLICY-DS-05)
Tài liệu nghiệp vụ phải được diễn đạt bằng **ngôn ngữ tự nhiên 100%**, tuyệt đối không chứa biệt ngữ kỹ thuật:
- Sử dụng *Máy chủ/Hệ thống* thay cho *API / Backend*.
- Sử dụng *Giao diện/Màn hình hiển thị* thay cho *UI / Frontend*.
- Sử dụng *Hộp thoại nổi / Bảng thông tin nổi* thay cho *Modal / Dialog / Popup*.
- Sử dụng *Ô nhập liệu / Trường nhập thông tin* thay cho *Input / Field / Textbox*.
- Sử dụng *Rê chuột / Di chuột* thay cho *Hover*.
- Sử dụng *Bố cục co giãn / Bo góc nhẹ / Có bóng mờ* thay cho *CSS specs (padding, border-radius, shadow)*.

---

## 3. Quy trình thực hiện báo cáo kết quả

Khi nhận lệnh kiểm duyệt, Agent thực hiện theo 3 bước:
1. **Chạy script tự động:** Thực thi command Node.js đối với tài liệu cần kiểm duyệt.
2. **Đọc và đối chiếu thủ công:** Rà soát các mục mà script chưa thể kiểm chứng sâu (như logic nghiệp vụ, tính khả thi, độ hoàn thiện của Mermaid).
3. **Xuất báo cáo (Compliance Report):** Gửi kết quả dưới dạng bảng chi tiết các điểm Đạt/Không đạt và các đề xuất chỉnh sửa cụ thể cho người dùng.
