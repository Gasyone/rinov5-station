# Tài liệu Dự án Rinov5 (Rinov5 Documentation)

> [!IMPORTANT]
> **Nguồn sự thật duy nhất (Single Source of Truth - SSOT):** Toàn bộ tài liệu nghiệp vụ (Capabilities - CAP, Business Functions - BF, User Stories - US, FLOW) của dự án Rinov5 đã được chuyển lên **Confluence** của tổ chức.
> Không thực hiện chỉnh sửa, biên tập tài liệu nghiệp vụ trực tiếp trong mã nguồn Git của dự án này nữa.

---

## 🏢 Thông tin Space Confluence

- **Space chính:** `Product Rino`
- **Space Key:** `PS`
- **Domain:** [Rinoedu AI Confluence](https://rinoeduai.atlassian.net/wiki)

---

## 🤖 Hướng dẫn dành cho AI Coding Agent (Instructions for AI Agents)

Khi làm việc trong dự án này, bạn **KHÔNG ĐƯỢC** viết code giao diện hoặc logic nếu chưa đọc User Story tương ứng. Do tài liệu đã chuyển lên Confluence, bạn bắt buộc phải dùng công cụ **Confluence MCP** (`atlassian` server) để tìm kiếm và đọc tài liệu.

### 🔍 Bước 1: Tìm kiếm tài liệu bằng `confluence_search`
Sử dụng công cụ `confluence_search` (thuộc MCP server `atlassian`) để tìm kiếm trang tài liệu dựa trên Mã US hoặc từ khóa nghiệp vụ.
- **Tham số `cql` gợi ý:**
  - Tìm theo mã US: `title ~ "US-CLS02-02"`
  - Tìm theo từ khóa: `text ~ "ghép lớp"` hoặc `title ~ "Lớp học"`
  
### 📖 Bước 2: Đọc chi tiết nội dung trang bằng `confluence_get_page`
Sau khi tìm thấy ID của trang từ kết quả tìm kiếm (ví dụ: `83853370`):
- Gọi công cụ `confluence_get_page` với tham số `pageId` tương ứng để lấy toàn bộ nội dung tài liệu.
- Đọc kỹ phần **User Review Required**, **Business Rules**, **UI & States**, và **Acceptance Criteria (AC)** để tiến hành code chính xác.

---

## 🛠️ Các tài liệu kỹ thuật được giữ lại trong Git

Các tài liệu dưới đây được lưu giữ trực tiếp trong Git do có liên kết chặt chẽ với cấu trúc code nguồn:
1. [docs/DESIGN_SYSTEM.md](file:///c:/Users/Jacky%20Tran/Documents/Rinov5/docs/DESIGN_SYSTEM.md) - Hướng dẫn Quy chuẩn Thiết kế & Mapping Component.
2. [docs/DESIGN_SYSTEM_STANDARD.md](file:///c:/Users/Jacky%20Tran/Documents/Rinov5/docs/DESIGN_SYSTEM_STANDARD.md) - Các tiêu chí chất lượng của hệ thống thiết kế.
3. [docs/ENTERPRISE_STANDARDS.md](file:///c:/Users/Jacky%20Tran/Documents/Rinov5/docs/ENTERPRISE_STANDARDS.md) - Đạo luật nền tảng và chính sách nghiệp vụ hệ thống.
4. [docs/DOCUMENTATION_GUIDELINES.md](file:///c:/Users/Jacky%20Tran/Documents/Rinov5/docs/DOCUMENTATION_GUIDELINES.md) - Hướng dẫn chung về phân tầng tài liệu.
5. [docs/skills/DOCUMENT_WRITING_SKILL.md](file:///c:/Users/Jacky%20Tran/Documents/Rinov5/docs/skills/DOCUMENT_WRITING_SKILL.md) - Quy chuẩn viết tài liệu nghiệp vụ (dành cho việc soạn thảo trực tiếp trên Confluence hoặc khi cần thiết).
