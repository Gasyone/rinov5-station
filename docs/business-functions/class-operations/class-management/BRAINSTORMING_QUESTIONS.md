# Câu hỏi Brainstorming & Phản hồi Nghiệp vụ — Quản lý Lớp học (Class Management)

Tài liệu này tổng hợp các câu hỏi nghiệp vụ, phản hồi từ phía khách hàng/người dùng và các đề xuất thiết kế quy trình kỹ thuật.

---

## 1. Khía cạnh Vòng đời & Trạng thái Lớp (Class Lifecycle & Approvals)

- **Q1.1**: Ai (vai trò nào) có quyền phê duyệt một lớp từ trạng thái **Nháp (Draft)** sang **Chờ khai giảng (Pending Start)**? Quản lý chi nhánh hay Trưởng phòng Giáo vụ?
  - **Phản hồi**: Thực hiện theo phân quyền IAM hệ thống (không cần quan tâm chi tiết logic phê duyệt này ở FE).
- **Q1.2**: Khi lớp ở trạng thái **Chờ khai giảng**, nếu không đủ sĩ số và giáo vụ bấm hủy lớp, các học viên đã xếp vào lớp này sẽ tự động chuyển về trạng thái nào (ví dụ: Chờ xếp lớp, hay hoàn phí)?
  - **Phản hồi**: Lớp học chuyển sang trạng thái "Hủy", các học viên trong lớp được đẩy ngược ra danh sách "Chờ xếp lớp". Không can thiệp nghiệp vụ học phí/tài chính trong phân hệ này.
- **Q1.3**: Hệ thống có tự động kích hoạt lớp sang **Đang học (In Progress)** khi buổi học đầu tiên được giáo viên điểm danh/hoàn thành không, hay giáo vụ phải bấm nút kích hoạt thủ công?
  - **Phản hồi**: Sau khi tạo lớp Nháp, Giáo vụ/Admin cấu hình lịch học và gán học viên, sau đó bấm kích hoạt lớp để chuyển trạng thái sang "Chờ khai giảng". Khi giáo viên giảng dạy và hoàn thành điểm danh buổi học đầu tiên, hệ thống sẽ tự động chuyển trạng thái lớp sang "Đang học".
- **Q1.4**: Đối với hành động hủy hoặc đóng lớp, hệ thống có cần ràng buộc thanh toán/tài chính (kiểm tra xem còn buổi học nào chưa dạy hoặc học phí chưa thu không)?
  - **Phản hồi**: Bỏ qua các ràng buộc tài chính/kế toán ở phân hệ này (thuộc phạm vi phân hệ Tài chính).

## 2. Khía cạnh Ràng buộc Xếp lịch & Phân bổ Tài nguyên (Scheduling Constraints)

- **Q2.1**: Quy tắc kiểm tra phòng học và giáo viên thuộc chi nhánh hiện tại có ngoại lệ nào không? (Ví dụ: Giáo viên thỉnh giảng/biệt phái dạy liên cơ sở, hoặc phòng học trực tuyến/zoom dùng chung toàn hệ thống).
  - **Phản hồi**: Cho phép chọn giáo viên từ chi nhánh khác hoặc giáo viên tự do (freelance), không giới hạn chi nhánh của giáo viên. Tuy nhiên, phòng học bắt buộc phải thuộc chi nhánh đã chọn của lớp học.
- **Q2.2**: Khung giờ đăng ký ca học (Shift Registry) hoạt động thế nào? Khi đổi khung giờ ca, hệ thống có tự động xóa các lịch học cũ đã thiết lập ở bước trước để buộc giáo vụ cấu hình lại, hay chỉ hiển thị cảnh báo?
  - **Phản hồi**: Sử dụng danh sách ca học đã đăng ký sẵn từ trước, khi tạo lớp chỉ chọn ca học đó, không xóa dữ liệu lịch học cũ.
- **Q2.3**: Khi thiết lập lịch học tuần (ví dụ: Thứ 2/4/6 lúc 18:00–19:30), hệ thống sẽ tự động sinh danh sách các **Buổi học (Session)** cụ thể cho cả khóa học. Hệ thống có tự động bỏ qua các ngày nghỉ lễ (Holidays) được cấu hình chung trên hệ thống không?
  - **Phản hồi**: Hiện tại chưa hỗ trợ tự động bỏ qua ngày nghỉ lễ khi sinh lịch học (bỏ qua thiết lập này). Cho phép giáo vụ thay đổi lịch học các buổi học riêng lẻ nếu trùng ngày lễ.

## 3. Khía cạnh Quản lý Học viên & Roster (Student Assignment)

- **Q3.1**: Định nghĩa thế nào là học viên **"Phù hợp với lớp" (Suitable)** để hiển thị trong tab lọc? Có phải dựa trên các tiêu chí: Trình độ (Level), Độ tuổi, Khung thời gian rảnh (Free time matching), hay Lịch sử học tập?
  - **Phản hồi**: Học viên phù hợp là học viên có thời gian rảnh trùng với lịch học của lớp. Cho phép chọn cả học viên có trình độ khác với trình độ quy định của lớp học.
- **Q3.2**: **Học viên học thử (Trial Student)** tham gia lớp học có bị tính vào sĩ số tối đa của lớp không? Sĩ số của học viên Trial có ảnh hưởng đến doanh thu hoặc tính lương của giáo viên không?
  - **Phản hồi**: Học viên học thử có tính vào sĩ số tối đa của lớp. Bỏ qua logic tính lương giáo viên.
- **Q3.3**: Khi thêm học viên vào lớp học đang có trạng thái **Đang học**, hệ thống có cần tính toán lộ trình bù bài cho học viên đó (vì học viên vào muộn sau các buổi đầu) không?
  - **Phản hồi**: Không tính toán lộ trình bù tự động. Học viên sẽ học chung với lớp từ buổi tiếp theo. Việc học bù các buổi đã qua sẽ được sắp xếp thủ công sau.

## 4. Khía cạnh Khung chương trình & Lộ trình (Syllabus & Learning Path)

- **Q4.1**: Khi gán Khung chương trình (Syllabus) vào Lớp nháp, hệ thống tự động tải danh sách môn học và trình độ. Giáo vụ có được phép sửa lại các thông tin này thủ công không, hay bắt buộc phải lấy 100% từ Syllabus?
  - **Phản hồi**: Các thông tin môn học và trình độ chỉ nạp ra từ Syllabus ở chế độ Read-only, giáo vụ không được phép chỉnh sửa thủ công.
- **Q4.2**: Tính năng **"Gán lộ trình học tập" (Assign Learning Path)** trong màn hình chi tiết lớp học sẽ hoạt động như thế nào? Có phải là chọn một mẫu lộ trình giảng dạy cho cả lớp, hay là thiết lập lộ trình riêng biệt cho từng học viên trong Roster?
  - **Phản hồi**: Gán lộ trình giảng dạy chung cho cả lớp tại màn hình chi tiết lớp học. Lộ trình này làm cơ sở để tự động tạo và ghép tên bài học tương ứng vào các buổi học (Session).
- **Q4.3**: Nếu phòng Học thuật cập nhật hoặc ban hành phiên bản Syllabus mới khi lớp **Đang học**, lớp học hiện tại có được phép cập nhật lên phiên bản mới không, hay bắt buộc phải chạy hết phiên bản cũ để đảm bảo tính nhất quán?
  - **Phản hồi**: Cho phép cập nhật phiên bản Syllabus mới. Phiên bản mới sẽ áp dụng cho các buổi học chưa diễn ra ở tương lai, các buổi học đã kết thúc ở quá khứ giữ nguyên lịch sử.

## 5. Khía cạnh Nhật ký hoạt động & Bảo mật (Audit Logs & Security)

- **Q5.1**: Tab **"Logs"** trong màn hình chi tiết lớp học cần ghi nhận những hoạt động nào? (Ví dụ: Thay đổi trạng thái lớp, thêm/xóa học viên khỏi roster, thay đổi lịch học tuần, hay thay đổi giáo viên giảng dạy).
  - **Phản hồi**: Ghi nhận toàn bộ các tương tác liên quan đến lớp học (ngoại trừ các tương tác riêng lẻ trong buổi học). Ghi rõ thông tin: Ai thực hiện, hành động gì, thời gian nào.
- **Q5.2**: Có cần phân quyền truy cập tab Logs và tab Ghi chú theo vai trò (ví dụ: Giáo viên chỉ được xem logs liên quan đến chuyên môn, còn Quản lý được xem toàn bộ logs hệ thống) không?
  - **Phản hồi**: Có phân quyền theo vai trò người dùng, tuy nhiên hầu như tất cả vai trò tham gia quản lý lớp đều được phép xem logs này.
- **Q5.3**: Quy tắc **"Không thay đổi thông tin cơ bản khi lớp đã có học viên"**: Thông tin cơ bản cụ thể gồm những trường nào (Tên lớp, Môn học, Khung chương trình, Chi nhánh)? Nếu giáo vụ gõ sai tên lớp và muốn sửa lại thì quy trình phê duyệt thế nào?
  - **Đề xuất giải pháp**:
    1.  **Thông tin bất biến (Không được phép chỉnh sửa sau khi có học viên trong roster)**: *Môn học, Khung chương trình (Syllabus) và Chi nhánh*. Nếu muốn thay đổi các trường này, bắt buộc giáo vụ phải chuyển học viên sang lớp khác hoặc hủy lớp hiện tại để tạo lớp mới.
    2.  **Thông tin cho phép chỉnh sửa**: *Tên lớp học* (để sửa lỗi chính tả/chuẩn hóa tên gọi) và *Sĩ số tối đa* (cho phép tăng sĩ số để nhận thêm học viên nhưng không được giảm xuống dưới số học viên hiện tại).
    3.  **Lịch sử thay đổi**: Mọi hành động chỉnh sửa tên lớp hoặc sĩ số đều phải tự động ghi nhận vào tab Logs của lớp học.

## 6. Các câu hỏi mở rộng & Đề xuất Quy trình (Extended Questions & Proposals)

- **Q6.1**: **Đồng bộ Lịch học lớp và Buổi học (Session Schedule Sync)**: Khi lớp ở trạng thái **Đang học**, nếu giáo vụ thay đổi Lịch học tuần (ví dụ: chuyển từ T2/4/6 sang T3/5), hệ thống có tự động thay đổi lịch của tất cả các buổi học (Session) chưa diễn ra trong tương lai không? Nếu có một số buổi học cụ thể đã được điều chỉnh ngày thủ công trước đó, thay đổi hàng loạt này có ghi đè các buổi đó không?
  - **Phản hồi**: Hầu như không thay đổi lịch học, trừ một vài trường hợp đặc biệt, và có lưu lại lịch sử thay đổi các buổi học đó.
  - **Đề xuất giải pháp khi thay đổi lịch tuần**:
    1.  *Ngày áp dụng*: Khi đổi lịch tuần, giáo vụ chọn ngày bắt đầu áp dụng mới (ví dụ: từ thứ Hai tuần sau).
    2.  *Phân tách trạng thái buổi*: Hệ thống giữ nguyên các buổi học đã diễn ra ở quá khứ (Completed/In Progress).
    3.  *Đồng bộ tương lai*: Dời ngày các buổi học ở tương lai (Scheduled) theo quy tắc lịch mới. Đối với các buổi tương lai đã được đổi lịch thủ công trước đó (có ghi nhận cờ "Đã điều chỉnh"), hiển thị danh sách cho giáo vụ tích chọn: "Ghi đè theo lịch tuần mới" hoặc "Giữ nguyên ngày đã điều chỉnh".
- **Q6.2**: **Trạng thái học viên rút/bảo lưu/chuyển lớp (Reserve & Transfer)**: Khi một học viên thực hiện bảo lưu hoặc chuyển sang lớp khác, thông tin của họ có tiếp tục hiển thị trong tab "Học viên" của lớp cũ với trạng thái tương ứng (Bảo lưu/Đã chuyển) để đối chiếu lịch sử, hay họ sẽ bị xóa hoàn toàn khỏi roster của lớp đó?
  - **Phản hồi**: Vẫn hiển thị học viên đó trong danh sách Roster của lớp và có nhãn/badge trạng thái tương ứng (Bảo lưu, Chuyển lớp, Đã rút). Hỗ trợ bộ lọc trạng thái học viên (Tất cả, Đang học, Bảo lưu/Chuyển) để giáo vụ dễ đối chiếu lịch sử sĩ số.
- **Q6.3**: **Mối quan hệ Giáo viên chủ nhiệm & Giáo viên giảng dạy**: Giáo viên chủ nhiệm (Class Manager) có được tự động phân công làm Giáo viên giảng dạy cho tất cả các buổi học của lớp học không? Khi phân công giáo viên giảng dạy thay thế (Substitute teacher) cho một ngày học, thông tin này sẽ được lưu ở cấp độ Buổi học (Session) hay có cần hiển thị tóm tắt ở cấp độ Lớp học (Class Detail) không?
  - **Phản hồi**: Lưu thông tin dạy thay ở cấp độ Buổi học, không cần hiển thị tóm tắt ở cấp độ Lớp học. Hành động thay đổi giáo viên buổi học sẽ được ghi lại trong Logs của lớp học.
- **Q6.4**: **Xử lý Mismatch Lộ trình và Khung chương trình (Syllabus vs Learning Path)**: Khi gán lộ trình học tập, nếu số lượng bài học trong lộ trình nhiều hơn hoặc ít hơn số lượng Buổi học dự kiến (được tính từ Ngày bắt đầu, Ngày kết thúc và Lịch tuần), hệ thống sẽ xử lý như thế nào? Có sinh thêm buổi học để khớp lộ trình hay cắt bớt bài học?
  - **Phản hồi**: Giáo vụ kiểm tra lại hệ thống cũ.
  - **Đề xuất giải pháp dự phòng**:
    1.  *Cảnh báo lệch*: Khi gán lộ trình có $N$ bài học vào lớp có $M$ buổi học dự kiến ($N \neq M$), hệ thống hiển thị cảnh báo đỏ/vàng trên màn hình thiết lập lộ trình.
    2.  *Nếu lộ trình ngắn hơn ($N < M$)*: Các buổi học từ $1$ đến $N$ được gán bài học tương ứng. Các buổi từ $N+1$ đến $M$ sẽ được hệ thống gán mặc định chủ đề là "Review/Assessment/Project" (Ôn tập & Báo cáo) hoặc để trống.
    3.  *Nếu lộ trình dài hơn ($N > M$)*: Gán bài học đến buổi thứ $M$. Hệ thống gợi ý giáo vụ chọn một trong hai phương án: (A) Tự động dời ngày kết thúc lớp học để sinh thêm $N - M$ buổi học mới; hoặc (B) Chọn gộp một số bài học ngắn vào cùng một buổi học.
