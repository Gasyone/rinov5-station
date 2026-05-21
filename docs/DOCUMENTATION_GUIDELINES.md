---
id: DOCUMENTATION_GUIDELINES
title: Documentation Guidelines (4-Tier Model)
domain: Architecture
status: core
tags: [architecture, guideline, documentation]
---

# Hướng dẫn Phân cấp Tài liệu Dự án (Documentation Guidelines)

Tài liệu này quy định cách thức viết, phân cấp và liên kết các tài liệu kiến trúc trong dự án Rinov5 EdTech ERP, nhằm đảm bảo tính nhất quán và dễ bảo trì.

## 1. Mô hình Phân cấp 4 Tầng (4-Tier Documentation)

Hệ thống tài liệu được chia thành 4 tầng với mức độ chi tiết tăng dần. Bất kỳ sự thay đổi logic nào cũng phải tuân theo cấu trúc phân cấp này, không lặp lại nội dung đã định nghĩa ở tầng cao hơn.

### Tier 1: Đạo luật Trung tâm (Enterprise Standards)
- **File:** `docs/ENTERPRISE_STANDARDS.md`
- **Vai trò:** Định nghĩa các nguyên tắc cốt lõi, chuẩn ngành và chính sách bảo mật áp dụng cho **toàn bộ hệ thống**. 
- **Quy tắc:** Mọi nguyên tắc phải được gắn mã định danh, ví dụ: `[POLICY-IAM-02]`.

### Tier 2: Lãnh địa Nghiệp vụ (Capabilities - CAP)
- **File:** `docs/business-functions/CAP-*.md`
- **Vai trò:** Nhóm các nghiệp vụ liên quan thành một khối (Capability) theo mô hình kinh doanh. Xác định mục tiêu, ranh giới dữ liệu và sự tương tác giữa các Lãnh địa.
- **Quy tắc:** Phải khai báo danh sách các Policy (từ Tier 1) mà CAP này phải tuân thủ. Không giải thích lại nội dung của Policy.

### Tier 3: Chức năng Cụ thể (Business Functions - BF)
- **File:** `docs/business-functions/BF-*.md`
- **Vai trò:** Đặc tả luồng nghiệp vụ (End-to-end flow), đối tượng sử dụng, và cấu trúc dữ liệu chính của một tính năng lớn.
- **Quy tắc:** Trong phần "Quy tắc nghiệp vụ" (Business Rules), chia làm hai:
  1. *Luật kế thừa:* Chỉ ghi mã tham chiếu `[POLICY-...]`.
  2. *Luật cục bộ:* Quy tắc đặc thù chỉ áp dụng riêng cho BF này.

### Tier 4: Yêu cầu Kỹ thuật (User Stories - US)
- **File:** `docs/business-functions/US-*.md`
- **Vai trò:** Tài liệu chi tiết dành cho lập trình viên (Developer/QA) để triển khai code. Chứa Acceptance Criteria, API constraints, UI/UX behavior.

---

## 2. Quy ước đặt tên (Naming Conventions)

- **CAP:** `CAP-[DOMAIN]-[name].md` (VD: `CAP-SYS-system-governance.md`)
- **BF:** `BF-[MODULE]-[number]-[name].md` (VD: `BF-SYS-01-identity-lifecycle.md`)
- **US:** `US-[MODULE]-[number]-[name].md` (VD: `US-SYS-04-01-setup-roles.md`)
- **Policy:** `POLICY-[DOMAIN]-[number]` (VD: `POLICY-MDM-01`)

## 3. Cách thức tham chiếu chéo (Cross-Referencing)

Để tránh rác dữ liệu, khi một tài liệu ở Tier 3 cần nhắc đến một khái niệm ở Tier 1, KHÔNG copy lại định nghĩa. 
Hãy sử dụng cú pháp: *Tuân thủ theo `[POLICY-IAM-02]` (Default Deny).*
Độc giả (hoặc AI Agent) sẽ tự động đối chiếu mã Policy này trong `ENTERPRISE_STANDARDS.md`.
