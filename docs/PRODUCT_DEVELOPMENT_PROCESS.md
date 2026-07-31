# Quy trình Phát triển Sản phẩm (Product Development Process)

**Do the Right Product — Xác nhận đang xây đúng sản phẩm** | **Do the Product Right — Xác nhận tài liệu đủ rõ để triển khai**

---

## Tổng quan quy trình

Toàn bộ quy trình được kiểm soát thông qua **02 Quality Gates (Cổng kiểm soát chất lượng)**, tương ứng với 02 bộ tiêu chí đánh giá tài liệu sản phẩm.

```text
Ý tưởng / Yêu cầu
       │
       ▼
┌─────────────────────────────────────┐
│  Giai đoạn 1. Do the Right Product  │
│  (Hiểu vấn đề → Hiểu người dùng)    │
│   └── 3.1 Feature Scope + BR        │
│        └── Phân loại 🔴 Risk / 🟢 Standard
│   ── 3.2 User Flow + Wireframe/UI   │
└────────────────┬────────────────────┘
                 │
                 ▼
        ┌──────────────────────────────┐
        │  Quality Gate 1              │
        │  🔴 Risk → AI verify → PM    │
        │  🟢 Standard → AI verify → OK│
        └───────────────┬──────────────┘
                        │
                Approved for Product Spec
                        │
                        ▼
┌──────────────────────────────────────┐
│  Giai đoạn 2. Do the Product Right   │
│  (Hoàn thiện tài liệu → Review)      │
└────────────────┬─────────────────────┘
                 │
                 ▼
        ┌──────────────────────────────┐
        │  Quality Gate 2  ← Tech Lead  │
        │ (Checklist B)                │
        └───────┬──────────────────────┘
                │
        Ready for Development
                │
                ▼
┌──────────────────────────────────────┐
│  Giai đoạn 3. Development & Testing  │
│  (Dev → QA → PO UAT)                 │
└────────────────┬─────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────┐
│  Giai đoạn 4. Measure & Learn        │
│  (KPI? Bài học? → Quay lại GĐ 1)     │
└──────┬──────────────┬────────────────┘
       │              │
       ▼              └──→ Quay lại Giai đoạn 1
  Tiếp tục theo dõi
```

> **Chu trình cải tiến liên tục:** Nếu KPI không đạt hoặc phát hiện cơ hội mới $\rightarrow$ quay lại Giai đoạn 1.

---

## Giai đoạn 1 – Do the Right Product
*Mục tiêu: Xác định đúng vấn đề và thiết kế đúng giải pháp trước khi đầu tư phát triển.*

### Bước 1. Hiểu vấn đề
Làm rõ:
* Bối cảnh
* Vấn đề hiện tại
* Mục tiêu
* Giá trị mang lại
* KPI (nếu có)

*Đầu ra:* **Problem Statement**, **Objective**

### Bước 2. Hiểu người dùng
Làm rõ:
* Ai sử dụng?
* Khi nào sử dụng?
* Nhu cầu thực sự là gì?
* Khó khăn hiện tại là gì?

*Đầu ra:* **Persona**, **Use Case**

### Bước 3. Thiết kế giải pháp
#### 📋 3.1 — Xác định phạm vi & quy tắc nghiệp vụ
* **Feature Scope:** Danh sách chức năng có ID, priority (Must/Should/Could)
* **Business Rules:** Liệt kê rõ ràng, bao gồm điều kiện, ngoại lệ
* **Phân loại 🔴 Risk / 🟢 Standard** dựa trên 5 tiêu chí bên dưới:

| # | Tiêu chí | 0 — 🟢 Standard | 1 — 🔴 Risk |
|---|---|---|---|
| **A** | **Phạm vi ảnh hưởng hệ thống** | 1 module, không đổi kiến trúc | $\ge$ 2 module hoặc thay đổi kiến trúc / database |
| **B** | **Tác động tài chính** | Không ảnh hưởng doanh thu, chi phí, hợp đồng | Liên quan doanh thu, chi phí vận hành hoặc nghĩa vụ pháp lý |
| **C1**| **Loại thay đổi nghiệp vụ** | Cập nhật tính năng đã có | Revamp toàn bộ |
| **C2**| **Độ mới nghiệp vụ** | Nghiệp vụ đã hiểu rõ | Nghiệp vụ mới chưa có tiền lệ |
| **D** | **Phụ thuộc bên ngoài** | Không phụ thuộc bên thứ 3 | Phụ thuộc đối tác ngoài / API ngoài / module chưa sẵn sàng |

* **Cách tính:** 0 điểm $\rightarrow$ 🟢 **Standard** | $\ge 1$ điểm $\rightarrow$ 🔴 **Risk**
* **Ai gắn nhãn?** PO dựa trên đánh giá của team (Tech Lead xác nhận A, D). Có thể thay đổi sau bước 3.2.

---

#### 📐 3.2 — Thiết kế chi tiết
* **User Flow:** Sơ đồ luồng từ đầu đến cuối (vẽ bằng Mermaid)
* **Wireframe / UI:** Thiết kế ở mức đủ chi tiết (có thể dùng AI hỗ trợ)
* **Luồng tương tác chính**

*(Song song với 3.2 — PO/Design thực hiện cho cả 2 nhánh)*

---

## Quality Gate 1
* **Mục tiêu:** Xác nhận đội ngũ đang xây đúng sản phẩm
* **Đánh giá theo:** **Checklist A – Do the Right Product**
* **Phân luồng phê duyệt:**
  * 🔴 **Risk:** AI verify $\rightarrow$ **PM phê duyệt**
  * 🟢 **Standard:** AI verify $\rightarrow$ **Tự động thông qua (Auto-pass)**
* **Người tham gia:** PO (chuẩn bị tài liệu); Design Lead (xác nhận trải nghiệm); Tech Lead (đánh giá tính khả thi)
* **Time-box:** 🔴 Risk: $\le 0.5$ ngày | 🟢 Standard: $\le 2$ giờ
* **Tiêu chí đạt:** Đạt Checklist A; đúng luồng phê duyệt tương ứng.

### Checklist A – Do the Right Product
1. **Vì sao phải làm?** Vấn đề cần giải quyết? Bối cảnh, mục tiêu, giá trị rõ ràng.
2. **Làm cho ai?** Đối tượng, pain-point. Persona và Use Case được mô tả.
3. **Người dùng sẽ sử dụng thế nào?** User Flow từ đầu đến cuối, có sơ đồ Mermaid kèm theo.
4. **Business Rules?** Liệt kê rõ ràng, bao gồm điều kiện, ngoại lệ.
5. **Feature Scope?** Có ID, priority, phân biệt làm ngay/làm sau. Đã gắn nhãn Risk/Standard.
6. **Thiết kế giao diện dễ dùng?** Đạt bộ 6 tiêu chí UI/UX bên dưới.
7. **Người dùng nhận giá trị gì?** KPI target: baseline, mục tiêu, cách đo lường.

### Checklist đánh giá UI/UX (tiêu chí 6)
* [ ] Thông tin và hành động quan trọng được ưu tiên hiển thị.
* [ ] Chỉ hiển thị thông tin cần thiết, không trùng lặp.
* [ ] Thông tin liên quan được nhóm và bố trí hợp lý.
* [ ] Thuật ngữ, biểu tượng và cách tương tác nhất quán.
* [ ] Tác vụ chính $\le 3$ bước (tác vụ đơn giản); phức tạp có lý do.
* [ ] Bảng dữ liệu chỉ cột cần thiết, hạn chế cuộn ngang.

---

## Giai đoạn 2 – Do the Product Right
*Mục tiêu: Chi tiết hóa giải pháp thành tài liệu đủ rõ để Dev và QA triển khai.*

### Bước 4. Hoàn thiện tài liệu
Bổ sung:
* **Acceptance Criteria**
* **Validation Rules**
* **Exception Flow**
* **Non-functional Requirements**
* **API Specification (nếu có)**
* Giải quyết **Open Questions** & **Dependencies**

### Bước 5. Review liên phòng ban
PO $\rightarrow$ Design $\rightarrow$ Tech Lead $\rightarrow$ QA $\rightarrow$ PO cập nhật tài liệu.

---

## Quality Gate 2
* **Mục tiêu:** Xác nhận tài liệu sẵn sàng để phát triển
* **Đánh giá theo:** **Checklist B – Do the Product Right**
* **Người phê duyệt:** **Tech Lead**
* **Người tham gia:** PO, Tech Lead, QA Lead. PM phân xử nếu có bất đồng (disagreement).
* **Time-box:** $\le 0.5$ ngày làm việc
* **Tiêu chí đạt:** Đạt Checklist B; Open Questions = 0; Dependencies = 0; Dev+QA thống nhất.

### Checklist B – Do the Product Right
1. **Acceptance Criteria:** $\ge 3$ AC/chức năng, định dạng Given/When/Then, có cả happy + unhappy path.
2. **Exception Flow:** Xử lý: dữ liệu sai, mất kết nối, quyền không đủ, timeout.
3. **Validation Rules:** Từng trường: bắt buộc/không, định dạng, min/max, unique.
4. **Permission:** Ma trận: vai trò được xem/thêm/sửa/xóa/duyệt.
5. **Non-functional Req.:** Thời gian phản hồi, số người dùng đồng thời, bảo mật.
6. **API:** Request/response, error code cho endpoint liên quan.
7. **Open Questions = 0:** Tồn đọng đã giải quyết hoặc có hướng xử lý.
8. **Dependencies = 0:** Không còn dependency hoặc có plan rõ ràng.

*(Áp dụng N/A cho các mục không liên quan)*

---

## Giai đoạn 3 – Development & Testing
Sau khi vượt qua Gate 2:
1. Dev phát triển
2. QA kiểm thử
3. PO UAT (User Acceptance Test)
4. Khắc phục các vấn đề phát hiện

### Quản lý thay đổi (Change Management)
* **Minor Change (Thay đổi nhỏ):**
  * Không thay đổi Business Rule
  * Không thay đổi User Flow
  * Không mở rộng phạm vi chức năng
  * *Xử lý:* PO + Tech Lead thống nhất, QA được notify để cập nhật test case. Không cần quay lại Quality Gate.
* **Major Change (Thay đổi lớn):**
  * Thay đổi Business Flow
  * Thay đổi Business Rule
  * Thay đổi phạm vi chức năng
  * Ảnh hưởng sang module khác
  * *Xử lý:* Quay lại Quality Gate 1 để đánh giá lại từ đầu.

---

## Giai đoạn 4 – Measure & Learn
Sau khi phát hành, đánh giá:
* Người dùng có sử dụng không?
* KPI có đạt không? (so sánh với target đã thiết lập tại Gate 1)
* Có lỗi nghiêm trọng không?
* Người dùng phản hồi thế nào?
* Có cơ hội cải tiến không?

> **Feedback Loop:** Bài học + dữ liệu $\rightarrow$ đầu vào vòng tiếp theo. Nếu KPI không đạt $\rightarrow$ quay lại Giai đoạn 1.

---

## Nguyên tắc vận hành
* **Gate 1:** Chúng ta có đang xây đúng sản phẩm không?
* **Gate 2:** Chúng ta đã mô tả đủ rõ để xây đúng chưa?
* **Sau Release:** Sản phẩm có thực sự tạo ra giá trị không?

*Nếu câu trả lời là "Chưa" $\rightarrow$ quay lại Giai đoạn 1 để bắt đầu vòng cải tiến mới.*
