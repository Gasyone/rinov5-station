---
id: TRACEABILITY-VIEWS
title: "Bảng Truy vết Tự động (Dataview Views)"
domain: Business
status: foundation
tags: [traceability, dataview, obsidian]
---

# Bảng Truy vết Tự động (Traceability Views)

> **Cách dùng:** Mở file này trong **Obsidian** với plugin `Dataview` đã cài đặt. Mỗi khối query bên dưới sẽ tự render thành bảng/danh sách live, đọc trực tiếp từ frontmatter của các file Markdown khác trong vault.
>
> **Yêu cầu:** Các file BR / SR / Persona / US / BF / CAP cần có frontmatter chuẩn (xem template trong `docs/templates/`).
>
> **Khi không có Obsidian:** Chạy `node scripts/check-traceability.mjs` ở terminal để kiểm tra cùng các quy tắc.

---

## 1. Tổng quan kho tài liệu

```dataview
TABLE WITHOUT ID
  type as "Loại",
  length(rows) as "Số lượng"
FROM "docs"
WHERE type
GROUP BY type
SORT type ASC
```

---

## 2. Persona — Bản đồ Stakeholder

### 2.1. Toàn bộ Persona đã định nghĩa

```dataview
TABLE
  title as "Tên Persona",
  status as "Trạng thái"
FROM "docs/00-business/PERSONAS"
WHERE type = "Persona"
SORT file.name ASC
```

### 2.2. Reverse Validation #3 — Persona "giả tưởng"

> Persona chưa được tham chiếu bởi bất kỳ SR nào → không phục vụ ai → cần xem lại.

```dataview
LIST
FROM "docs/00-business/PERSONAS"
WHERE type = "Persona"
  AND length(filter(file.inlinks, (l) => contains(string(l), "SR-"))) = 0
```

---

## 3. Business Requirements — Tier 0

### 3.1. Toàn bộ BR

```dataview
TABLE
  title as "Tiêu đề",
  priority as "Ưu tiên",
  status as "Trạng thái"
FROM "docs/00-business/BR"
WHERE type = "Business Requirement"
SORT priority DESC, file.name ASC
```

### 3.2. Reverse Validation #1 — BR chưa có CAP triển khai

> BR chưa được trace tới CAP nào → là **gap nghiệp vụ**.

```dataview
LIST
FROM "docs/00-business/BR"
WHERE type = "Business Requirement"
  AND length(filter(file.outlinks, (l) => contains(string(l), "CAP-"))) = 0
```

### 3.3. BR chưa có SR phái sinh

> BR đã viết nhưng chưa có nhóm Persona nào nêu nhu cầu cụ thể → có thể quá trừu tượng.

```dataview
LIST
FROM "docs/00-business/BR"
WHERE type = "Business Requirement"
  AND length(filter(file.inlinks, (l) => contains(string(l), "SR-"))) = 0
```

---

## 4. Stakeholder Requirements — Tier 0

### 4.1. SR theo từng Persona

```dataview
TABLE
  parent_br as "BR cha",
  priority as "Ưu tiên",
  status as "Trạng thái"
FROM "docs/00-business/SR"
WHERE type = "Stakeholder Requirement"
GROUP BY persona
SORT persona ASC
```

### 4.2. Reverse Validation #4 — SR mồ côi (thiếu BR cha)

> SR phải trace ngược về 1 BR. Nếu thiếu → không có lý do kinh doanh để build.

```dataview
LIST
FROM "docs/00-business/SR"
WHERE type = "Stakeholder Requirement"
  AND (parent_br = null OR parent_br = "")
```

### 4.3. SR chưa có US phái sinh (chưa được lập kế hoạch triển khai)

```dataview
LIST
FROM "docs/00-business/SR"
WHERE type = "Stakeholder Requirement"
  AND length(filter(file.inlinks, (l) => contains(string(l), "US-"))) = 0
```

---

## 5. User Stories — Tier 4 (đối soát ngược lên SR)

### 5.1. Reverse Validation #2 — US "lạc trôi" (không trace về SR)

> US đã viết nhưng không có SR cha → có khả năng là **scope creep** hoặc **over-engineering**.

```dataview
LIST
FROM "docs/business-functions"
WHERE type = "User Story"
  AND (sr = null OR sr = "")
```

### 5.2. US theo từng BF

```dataview
TABLE WITHOUT ID
  bf as "BF",
  length(rows) as "Số US",
  rows.file.link as "Danh sách US"
FROM "docs/business-functions"
WHERE type = "User Story"
GROUP BY bf
SORT bf ASC
```

---

## 6. Reverse Validation #5 — Capability–Persona Decoupling Check

> Một CAP không nên có nhiều phiên bản chỉ vì khác Persona. Khác biệt theo Persona phải xử lý qua RBAC + Data Scope, không tạo bản sao CAP/BF.

### 6.1. CAP/BF có "trùng tên" theo nghi vấn

> Tự động phát hiện các BF có từ khóa giống nhau (VD: `quan-ly-hoc-vien`) — cảnh báo để review thủ công.

```dataview
TABLE WITHOUT ID
  file.link as "Tài liệu",
  domain as "CAP",
  status as "Trạng thái"
FROM "docs/business-functions"
WHERE type = "Business Function"
  AND (
    contains(file.name, "quan-ly-hoc-vien") OR
    contains(file.name, "quan-ly-giao-vien") OR
    contains(file.name, "quan-ly-nhan-su") OR
    contains(file.name, "quan-ly-don-hang")
  )
SORT file.name ASC
```

---

## 7. Quan hệ Capability ↔ BR (đo độ phủ)

```dataview
TABLE WITHOUT ID
  domain as "CAP",
  length(rows) as "Số BF",
  length(filter(rows, (r) => r.parent_br)) as "Số BF trace BR"
FROM "docs/business-functions"
WHERE type = "Business Function"
GROUP BY domain
SORT domain ASC
```

---

## 8. Hướng dẫn Bổ sung

- **Khi thấy 1 dòng "mồ côi":** mở file đó, kiểm tra frontmatter, bổ sung field thiếu (`parent_br`, `persona`, `bf`, `sr`...).
- **Khi muốn thêm view mới:** copy 1 khối query bên trên, đổi `FROM` và `WHERE` cho phù hợp.
- **Cú pháp Dataview:** xem [https://blacksmithgu.github.io/obsidian-dataview](https://blacksmithgu.github.io/obsidian-dataview) — chỉ cần biết `TABLE`, `LIST`, `FROM`, `WHERE`, `GROUP BY`, `SORT`.
- **CI/CD:** muốn chạy các kiểm tra này tự động (không cần Obsidian), dùng `node scripts/check-traceability.mjs` — cùng quy tắc, output format-friendly cho terminal.
