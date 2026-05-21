---
id: QS-CAP-CARE
title: "Chuyên sâu CAP-CARE — Validate SR Chăm sóc"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "PERSONA-CSM, PERSONA-BRANCH_MANAGER"
target_output: ["SR-CSM-001 validate", "SR-CSM-002 validate", "SR-BM-001 validate", "US bổ sung"]
duration: "30 phút"
status: "Active"
tags: [questionnaire, care, csm, retention, validate]
---

# QS-CAP-CARE: Chuyên sâu Chăm sóc Học viên

> **Mục tiêu:** Validate 3 SR đã viết (CSM-001, CSM-002, BM-001) + khám phá workflow thật.
> **Persona:** CSM (chính) + BM (phụ).
> **Thời lượng:** 30 phút.
> **Output:** Validate SR, bổ sung AC, phát hiện US mới.

---

## 1. Hướng dẫn

- Mở 3 file SR trước buổi phỏng vấn.
- Focus vào workflow THẬT của CSM hôm nay — không hỏi "bạn muốn gì" mà hỏi "bạn LÀM gì".
- Ghi lại mọi tool/Excel/giấy mà CSM đang dùng thay cho hệ thống.

---

## 2. Workflow Hiện tại (15 phút)

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| C1 | Mỗi sáng bạn bắt đầu ca chăm sóc bằng việc gì? | Mở | ___ | SR-CSM-001 validate |
| C2 | Bạn biết HV nào cần gọi hôm nay bằng cách nào? | Chọn nhiều | ☐ Excel tự lập ☐ Hệ thống cũ ☐ BM giao ☐ Tự nhớ ☐ Khác: ___ | SR-CSM-001 §2 |
| C3 | Bạn phân loại HV cần gọi thành mấy nhóm? Nhóm nào? | Mở | ___ | SR-CSM-001 §4 AC-01 |
| C4 | Khi gọi 1 HV, bạn cần xem thông tin gì trước khi nhấc máy? | Chọn nhiều | ☐ Lớp đang học ☐ Lịch sử điểm danh ☐ Cuộc gọi cuối ☐ Đơn hàng ☐ Ticket cũ ☐ Khác: ___ | SR-CSM-001 §4 AC-02 |
| C5 | Mất bao lâu để mở được thông tin đó? | Chọn 1 | ○ < 30s ○ 30s-1p ○ 1-3p ○ > 3p | SR-CSM-001 §4 AC-05 |
| C6 | Sau cuộc gọi, bạn ghi kết quả ở đâu? | Chọn nhiều | ☐ Hệ thống ☐ Excel ☐ Sổ tay ☐ Không ghi | BF-CARE-01 validate |
| C7 | Trung bình 1 ngày bạn xử lý bao nhiêu HV? | Số | ___ HV | SR-CSM-001 §5 Performance |

---

## 3. Tái phí / Retention (10 phút)

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| R1 | Bạn biết HV nào sắp hết hạn bằng cách nào? | Chọn nhiều | ☐ Hệ thống báo ☐ Excel tự theo dõi ☐ BM nhắc ☐ Phụ huynh hỏi | SR-CSM-002 validate |
| R2 | Khi liên hệ HV sắp hết hạn, bạn nói gì? Có template không? | Mở | ___ | SR-CSM-002 §4 AC-03 |
| R3 | Bao nhiêu % HV sắp hết hạn bạn liên hệ được trong tuần đầu? | Chọn 1 | ○ < 30% ○ 30-60% ○ 60-80% ○ > 80% | BR-001 §5 baseline |
| R4 | Khi HV từ chối tái phí, bạn ghi lý do ở đâu? | Chọn nhiều | ☐ Hệ thống ☐ Excel ☐ Không ghi | BF-CARE-02 validate |
| R5 | Lý do từ chối phổ biến nhất là gì? | Chọn nhiều | ☐ Học phí cao ☐ Chuyển nhà ☐ Không hài lòng GV ☐ Con không muốn học ☐ Khác: ___ | BF-CARE-02 §4.2 |
| R6 | Bạn có đề xuất gói/combo khác khi HV từ chối gói cũ không? | Có/Không | ○ Có (mô tả) ○ Không | SR-CSM-002 §4 AC-02 |

---

## 4. Validate SR-BM-001 — Cảnh báo At-risk (5 phút, hỏi BM)

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| BM1 | Bạn biết cơ sở có bao nhiêu HV at-risk bằng cách nào? | Chọn nhiều | ☐ CSM báo ☐ Tự xem hệ thống ☐ Cuối tuần tổng hợp ☐ Không biết | SR-BM-001 validate |
| BM2 | Bạn muốn thấy thông tin gì trên Dashboard mỗi sáng? | Chọn nhiều | ☐ Số HV at-risk ☐ Số sắp hết hạn ☐ Ticket SLA gần hết ☐ Renewal rate ☐ Khác: ___ | SR-BM-001 §4 AC-01 |
| BM3 | Khi thấy số at-risk cao, bạn làm gì? | Mở | ___ | SR-BM-001 §4 AC-02 drill-down |
| BM4 | Bạn có cần so sánh số liệu giữa các CSM không? | Có/Không | ○ Có ○ Không | SR-BM-001 scope |

---

## 5. Kết thúc (2 phút)

| # | Câu hỏi | Ghi vào |
|---|---------|---------|
| E1 | Nếu hệ thống mới chỉ giải quyết 1 vấn đề cho bạn, chọn gì? | SR priority |
| E2 | Có workflow nào bạn làm mà tôi chưa hỏi? | US tiềm năng |

---

## 6. Output Mapping

| Câu hỏi | Kết quả → Cập nhật | Hành động |
|---------|---------------------|-----------|
| C1-C7 | SR-CSM-001 | Validate AC, bổ sung data thật |
| R1-R6 | SR-CSM-002 + BF-CARE-02 | Validate AC, bổ sung lý do từ chối |
| BM1-BM4 | SR-BM-001 | Validate scope + AC |
| E1-E2 | BACKLOG / SR mới | Phát hiện mới |
| Mọi câu | PERSONA-CSM §4 | Cập nhật "A Day in the Life" bằng data thật |
