# TỔNG HỢP YÊU CẦU NGHIỆP VỤ TỪ CHUYÊN MÔN
## [15/9/2026] ĐẶC TẢ BÁO CÁO THÁNG & NHẬN XÉT BUỔI HỌC - MÔN TIẾNG ANH

> **Nguồn thu thập:** Khối Chuyên môn Tiếng Anh (Academic English) & Vận hành Giảng dạy  
> **Ngày ghi nhận:** 15/09/2026  
> **Mục đích:** Đặc tả chi tiết cơ chế tổng hợp dữ liệu, prompt AI và danh hiệu cho môn Tiếng Anh.

---

### PHẦN 1: CƠ CHẾ SINH BÁO CÁO THÁNG MÔN TIẾNG ANH

#### 1. Mục A1 - Nhận xét chung (Thái độ & Nề nếp học tập)
- Nguồn dữ liệu đầu vào: Lấy tổng hợp từ trường Other (Ghi chú khác) của tất cả các buổi học trong tháng.
- Quy chuẩn nhập liệu ở từng buổi: Giáo viên nhập ghi chú Other để nêu rõ Điểm nổi bật và Điểm cần cải thiện của con trong buổi học đó.
- Cơ chế AI xử lý: AI dựa trên toàn bộ chuỗi ghi chú Other trong tháng để xâu chuỗi, tổng hợp và tạo bản thảo trước (gen trước) thành 2 đoạn rõ ràng:
  + Điểm nổi bật: Tổng hợp các mặt tích cực, tiến bộ, thái độ học tập và sự tự tin của con.
  + Điểm cần lưu ý: Tổng hợp những lỗi lặp lại, tốc độ phản xạ hoặc tâm lý cần phụ huynh đồng hành hỗ trợ.
- Thao tác giáo viên: Các cô đọc bản thảo do AI gợi ý và chỉnh sửa lại câu chữ cho sát thực tế trước khi lưu.

#### 2. Mục A2 - Nhận xét kết quả học tập (Kiến thức & Kỹ năng)
- Nguồn dữ liệu đầu vào: Lấy tổng hợp từ kết quả làm Bài tập về nhà (BTVN) trên Ứng dụng (App) và Sách bài tập.
- Cơ chế AI xử lý: AI lấy dữ liệu kết quả làm bài tập trên app trong tháng, phân tích mức độ hoàn thành và đề xuất nội dung báo cáo:
  + Từ vựng & Phonics: Nêu rõ nhóm từ vựng và âm phonics con đã nắm chắc, các từ hoặc âm con còn hay nhầm lẫn.
  + Cấu trúc & Mẫu câu: Đánh giá khả năng phản xạ mẫu câu, ngữ pháp và mức độ vận dụng vào giao tiếp thực tế.
- Thao tác giáo viên: Các cô kiểm tra nội dung đề xuất của AI và chỉnh sửa lại theo thực tế trên lớp.

#### 3. Quy tắc cảnh báo dữ liệu (Warning & Validation Rules)
- Điều kiện tiên quyết: Học sinh phải có kết quả BTVN trên app và các buổi học phải có nhập liệu trường Other.
- Cảnh báo hệ thống: Nếu trong tháng phát sinh buổi học chưa được nhập trường Other hoặc học sinh chưa có dữ liệu làm bài tập trên app, hệ thống sẽ hiển thị cảnh báo (Warning) cho giáo viên:
  + "Cảnh báo: Còn buổi học chưa nhập ghi chú Other hoặc thiếu dữ liệu BTVN trên App".
  + Giáo viên cần hoàn tất nhập liệu các buổi học để AI có đủ dữ liệu đầu vào chính xác, tránh việc AI sinh nhận xét chung chung.

---

### PHẦN 2: THIẾT KẾ 2 PROMPT AI CHO MÔN TIẾNG ANH

#### Prompt 1: Sinh Nhận xét chung (Mục A1) từ dữ liệu trường Other
- Ngữ cảnh: Bạn là trợ lý AI chuyên môn tiếng Anh của hệ thống RinoEdu.
- Dữ liệu đầu vào cung cấp cho AI:
  + Tên học viên: [Tên học viên]
  + Danh sách ghi chú Other của các buổi học trong tháng:
    * Buổi 1: [Nội dung Other buổi 1]
    * Buổi 2: [Nội dung Other buổi 2]
    * Buổi n: [Nội dung Other buổi n]
  + Tone giọng: [Khích lệ / Tích cực / Nghiêm túc]
- Yêu cầu cho AI:
  1. Phân tích toàn bộ các ghi chú Other của từng buổi học.
  2. Lọc ra các điểm mạnh xuất hiện lặp lại để viết thành đoạn "Điểm nổi bật" (từ 2-3 câu).
  3. Lọc ra các điểm con còn gặp khó khăn, ngập ngừng hoặc cần cải thiện để viết thành đoạn "Điểm cần lưu ý" (từ 2-3 câu).
  4. Sử dụng ngôn ngữ sư phạm ấm áp, xưng hô "con" và "cô", tuyệt đối trung thực với dữ liệu được cung cấp.
- Cấu trúc kết quả đầu ra:
  Điểm nổi bật: [Nội dung AI sinh]
  Điểm cần lưu ý: [Nội dung AI sinh]

#### Prompt 2: Sinh Nhận xét kết quả học tập (Mục A2) từ kết quả BTVN trên App
- Ngữ cảnh: Bạn là trợ lý AI phân tích kết quả học tập tiếng Anh của hệ thống RinoEdu.
- Dữ liệu đầu vào cung cấp cho AI:
  + Tên học viên: [Tên học viên]
  + Phạm vi bài học trong tháng: [Bài học X đến Bài học Y]
  + Thống kê kết quả BTVN trên App:
    * Tỷ lệ hoàn thành bài tập: [Số buổi hoàn thành / Tổng số buổi]
    * Điểm trung bình phần Từ vựng: [Điểm số] - Các từ đạt điểm cao / Các từ hay sai
    * Điểm trung bình phần Phonics/Phát âm: [Điểm số] - Âm đọc chuẩn / Âm còn nhầm lẫn
    * Điểm trung bình phần Mẫu câu & Ngữ pháp: [Điểm số] - Mẫu câu thành thạo / Cấu trúc chưa vững
- Yêu cầu cho AI:
  1. Đánh giá cụ thể mức độ tiếp thu kiến thức dựa trên kết quả làm bài tập thực tế của con.
  2. Tách rõ 2 phần: "Từ vựng & Phonics" và "Cấu trúc & Mẫu câu".
  3. Nêu đích danh các từ vựng, âm đọc hoặc mẫu câu cụ thể mà con đã nhớ tốt hoặc cần luyện thêm để phụ huynh dễ dàng đồng hành tại nhà.
- Cấu trúc kết quả đầu ra:
  Từ vựng & Phonics: [Nội dung AI sinh]
  Cấu trúc & Mẫu câu: [Nội dung AI sinh]

---

### PHẦN 3: DANH SÁCH DANH HIỆU HÀNG THÁNG (AWARD BADGES) CHO MÔN TIẾNG ANH

1. HỌC VIÊN XUẤT SẮC
- Tiêu chí: Chuyên cần 100%, hoàn thành 100% BTVN trên app đạt điểm cao, phản xạ giao tiếp tự tin và phát âm chuẩn xác trong tất cả các buổi học.
- Ý nghĩa: Vinh danh học viên dẫn đầu, có thành tích học tập toàn diện nhất tháng.

2. CHIẾN BINH BỨT PHÁ
- Tiêu chí: Có sự tiến bộ vượt bậc so với tháng trước (từ rụt rè chuyển sang chủ động phát biểu, điểm số bài tập trên app cải thiện rõ rệt).
- Ý nghĩa: Động viên tinh thần nỗ lực bứt phá giới hạn bản thân của học viên.

3. NGÔI SAO CHĂM NGOAN
- Tiêu chí: Đi học đầy đủ, đúng giờ, luôn chủ động hoàn thành bài tập về nhà trên app trước hạn, thái độ học tập tích cực và hợp tác tốt với giáo viên.
- Ý nghĩa: Biểu dương ý thức kỷ luật và tính tự giác cao trong học tập.

4. CHIẾN BINH TIẾN BỘ
- Tiêu chí: Có nỗ lực lớn và khắc phục được các điểm yếu được cô nhắc nhở trong tháng (như sửa được âm nuốt, nhớ được các từ vựng khó, nói to rõ ràng hơn).
- Ý nghĩa: Ghi nhận từng bước tiến bộ cụ thể của học viên.

5. NGÔI SAO SÁNG TẠO
- Tiêu chí: Thể hiện sự tự tin trong các hoạt động đóng vai (Role-play), thuyết trình tranh ảnh hoặc đặt được những câu hỏi tiếng Anh thú vị ngoài bài học.
- Ý nghĩa: Khuyến khích tư duy ngôn ngữ mở và sự tự tin thể hiện bản thân.

6. ĐẠI SỨ GIAO TIẾP
- Tiêu chí: Luôn chủ động sử dụng tiếng Anh trong lớp, phản xạ nhanh và tương tác tích cực với thầy cô và bạn bè suốt buổi học.
- Ý nghĩa: Khích lệ tinh thần dám nói, dám giao tiếp bằng tiếng Anh.
