import fs from 'fs';

const storageHtml = `
<h2>1. NHẬT KÝ THAY ĐỔI &amp; BỐI CẢNH (CHANGELOG &amp; CONTEXT)</h2>

<h3>Lịch sử cập nhật tài liệu (Changelog)</h3>
<table class="wrapped">
  <thead>
    <tr>
      <th>Ngày cập nhật</th>
      <th>Nội dung cập nhật</th>
      <th>Lý do cập nhật</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>15/09/2026</strong></td>
      <td>Khởi tạo tài liệu đặc tả chi tiết cho giao diện Chi tiết buổi học mới: Bổ sung bộ chọn danh sách buổi học thả xuống, khung thông tin buổi học chuẩn hóa 2 cột, khung chương trình (KCT) có nút góp ý và khung nhật ký buổi học gắn thẻ học viên.</td>
      <td>Chuẩn hóa trải nghiệm người dùng, thay thế giao diện cũ đơn điệu; nâng cao năng lực kiểm soát học thuật và tối ưu thao tác chuyển buổi học.</td>
    </tr>
  </tbody>
</table>

<h3>Bối cảnh &amp; So sánh Màn hình Cũ vs. Màn hình Mới</h3>
<p>Trong hoạt động quản lý vận hành trung tâm và lớp học, buổi học là đơn vị thực thi cốt lõi nơi diễn ra việc giảng dạy, điểm danh, truyền tải học liệu và tương tác giữa giáo viên và học viên. Khi theo dõi tiến độ một lớp học, giáo viên, nhân viên chăm sóc học viên và quản lý cơ sở liên tục cần tra cứu thông tin chi tiết từng buổi học.</p>

<table class="wrapped">
  <thead>
    <tr>
      <th>Thành phần giao diện</th>
      <th>Giao diện Cũ (Hạn chế)</th>
      <th>Giao diện Mới (Nâng cấp &amp; Bổ sung)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Điều hướng buổi học</strong></td>
      <td>Chỉ có 2 nút <code>&lt; Buổi trước</code> và <code>Buổi sau &gt;</code> kẹp giữa dòng ngày giờ tĩnh; muốn xem buổi xa phải bấm lặp lại nhiều lần.</td>
      <td><strong>Bộ chọn danh sách buổi học thả xuống (Session Selector Dropdown):</strong> Nhấp vào hiển thị danh sách toàn bộ các buổi học trong lộ trình (số buổi, ngày giờ, chủ đề, trạng thái); cho phép nhảy nhanh đến bất kỳ buổi nào chỉ trong 1 thao tác.</td>
    </tr>
    <tr>
      <td><strong>Phần ghi chú / Nhật ký</strong></td>
      <td>Hoàn toàn chưa có khung ghi chú; giáo viên không có nơi ghi nhận xét tổng quan cho buổi dạy.</td>
      <td><strong>Khung Nhật ký buổi học (Session Diary):</strong> Đặt ngay dưới tiêu đề buổi học, hỗ trợ gõ <code>@</code> để gắn thẻ học viên trong lớp, tự động lưu khi rời ô nhập (onBlur) và tự động co giãn.</td>
    </tr>
    <tr>
      <td><strong>Thông tin buổi học</strong></td>
      <td>Thiếu trường Trợ giảng; Mã lớp không có Tên lớp đi kèm; Quy mô và Cấp độ bị gộp chung một dòng; không có cảnh báo phòng học.</td>
      <td><strong>Khung Thông tin buổi học 2 cột chuẩn hóa:</strong> Hiển thị rõ 5 cặp thông tin (Lịch học - Giờ học; Cơ sở - Phòng học kèm cảnh báo sự cố/phòng gốc; Tên lớp - Mã lớp; Giáo viên kèm chỉ dẫn dạy thay - Trợ giảng; Quy mô - Trình độ).</td>
    </tr>
    <tr>
      <td><strong>Khung chương trình (KCT)</strong></td>
      <td>Khối văn bản dài, không đánh số thứ tự buổi trong KCT; không phân mục rõ từ vựng, ngữ pháp; thiếu kênh góp ý.</td>
      <td><strong>Khung KCT có cấu trúc chuẩn hóa:</strong> Đánh dấu số buổi (ví dụ: <code>Buổi 3</code>); phân chia cấu trúc gạch đầu dòng rõ ràng (- Words, - Sentences, - Phonics/Grammar); danh sách học liệu kèm phân loại trực quan; <strong>Nút [Góp ý]</strong> giúp giáo viên gửi phản hồi trực tiếp cho bộ phận Đào tạo.</td>
    </tr>
  </tbody>
</table>

<h3>Hiểu người dùng &amp; Tình huống sử dụng (User Needs &amp; Use Cases)</h3>
<ul>
  <li><strong>Giáo viên (PERSONA-TEACHER):</strong> Mở nhanh buổi học hôm nay, xem bài giảng KCT cần dạy, kiểm tra phòng học và trợ giảng, sau giờ dạy nhập ngay nhật ký tổng kết và gắn thẻ những học sinh cần chú ý.</li>
  <li><strong>Nhân sự CSM (PERSONA-CSM):</strong> Xem nhật ký của giáo viên để nắm tình hình lớp, tra cứu học liệu và bài tập về nhà để gửi phụ huynh, đồng thời kiểm tra tiến độ đánh giá học kỳ (<code>Semester Eval</code>).</li>
  <li><strong>Quản lý cơ sở (PERSONA-BRANCH-MANAGER):</strong> Kiểm tra ca học có bị đổi phòng bất thường không, giáo viên nào dạy thay, và kiểm soát sĩ số chuyên cần tức thời.</li>
  <li><strong>Phát triển đào tạo (PERSONA-ACADEMIC):</strong> Tiếp nhận ý kiến góp ý của giáo viên về các bài học cụ thể trong KCT để cải tiến giáo trình.</li>
</ul>

<h3>Phạm vi kiểm soát chức năng (Feature Scope)</h3>
<table class="wrapped">
  <thead>
    <tr>
      <th>Mã Yêu Cầu</th>
      <th>Tên Yêu Cầu Chức Năng</th>
      <th>Phân Loại Ưu Tiên</th>
      <th>Mức Độ Rủi Ro</th>
      <th>Ghi Chú</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>REQ-S01</strong></td>
      <td>Thanh điều hướng &amp; Tiêu đề buổi học</td>
      <td>Bắt buộc (Must)</td>
      <td>Tiêu chuẩn (Standard)</td>
      <td>Breadcrumb tên lớp, tiêu đề ca học, huy hiệu loại buổi, huy hiệu trạng thái</td>
    </tr>
    <tr>
      <td><strong>REQ-S02</strong></td>
      <td>Bộ chọn danh sách các buổi học thả xuống</td>
      <td>Bắt buộc (Must)</td>
      <td>Tiêu chuẩn (Standard)</td>
      <td>Dropdown danh sách toàn bộ các buổi học kèm ngày giờ, chủ đề và trạng thái</td>
    </tr>
    <tr>
      <td><strong>REQ-S03</strong></td>
      <td>Khung Ghi chú / Nhật ký buổi học</td>
      <td>Bắt buộc (Must)</td>
      <td>Tiêu chuẩn (Standard)</td>
      <td>Nhập nhận xét, tự động co giãn, tự động lưu khi rời ô nhập</td>
    </tr>
    <tr>
      <td><strong>REQ-S04</strong></td>
      <td>Tính năng Gắn thẻ học viên (@) trong nhật ký</td>
      <td>Bắt buộc (Must)</td>
      <td>Tiêu chuẩn (Standard)</td>
      <td>Bảng nổi gợi ý học viên theo tên/mã, chọn chèn vào văn bản</td>
    </tr>
    <tr>
      <td><strong>REQ-S05</strong></td>
      <td>Khung Thông tin buổi học 2 cột chuẩn hóa</td>
      <td>Bắt buộc (Must)</td>
      <td>Tiêu chuẩn (Standard)</td>
      <td>Hiển thị 5 cặp thông tin vận hành cốt lõi</td>
    </tr>
    <tr>
      <td><strong>REQ-S06</strong></td>
      <td>Cơ chế cảnh báo phòng học &amp; Chỉ dẫn dạy thay</td>
      <td>Nên có (Should)</td>
      <td>Tiêu chuẩn (Standard)</td>
      <td>Biểu tượng cảnh báo phòng học, nhãn phòng gốc, gạch ngang tên giáo viên chính</td>
    </tr>
    <tr>
      <td><strong>REQ-S07</strong></td>
      <td>Khung Chương trình đào tạo (KCT) có cấu trúc</td>
      <td>Bắt buộc (Must)</td>
      <td>Tiêu chuẩn (Standard)</td>
      <td>Hiển thị từ vựng, câu mẫu, phát âm, bài tập, học liệu kèm số buổi</td>
    </tr>
    <tr>
      <td><strong>REQ-S08</strong></td>
      <td>Nút tính năng Góp ý giáo trình KCT</td>
      <td>Nên có (Should)</td>
      <td>Tiêu chuẩn (Standard)</td>
      <td>Mở hộp thoại gửi ý kiến phản hồi về bài học cho bộ phận đào tạo</td>
    </tr>
    <tr>
      <td><strong>REQ-S09</strong></td>
      <td>Nút liên kết Đánh giá học kỳ (Semester Eval)</td>
      <td>Có thể có (Could)</td>
      <td>Tiêu chuẩn (Standard)</td>
      <td>Huy hiệu tiến độ đánh giá định kỳ của lớp học</td>
    </tr>
  </tbody>
</table>

<h3>Quy tắc nghiệp vụ cốt lõi (Business Rules)</h3>
<ul>
  <li><strong>[RULE-CLS-01] Bảo toàn dữ liệu và phân định quyền hạn:</strong> Hộp thoại Chi tiết buổi học chỉ đọc và cập nhật trạng thái ca học, nhật ký giảng dạy và ghi nhận góp ý giáo trình. Toàn bộ logic nghiệp vụ xử lý hệ quả (đổi lịch, trừ quota, chuyển lớp) do cơ sở dữ liệu xử lý.</li>
  <li><strong>[RULE-CLS-02] Dữ liệu dùng chung thống nhất:</strong> Phân hệ vận hành lớp học và hệ thống chăm sóc dùng chung một nguồn cơ sở dữ liệu duy nhất, không sử dụng tiến trình đồng bộ trung gian.</li>
  <li><strong>[RULE-CLS-03] Bảo mật thông tin liên lạc cá nhân:</strong> Trên các bảng chi tiết, số điện thoại của học viên và phụ huynh bắt buộc được che một phần ở giữa (dạng <code>091****111</code>) nhằm chống sao chép hàng loạt trái phép.</li>
  <li><strong>[RULE-CLS-04] Tính toán số liệu chuyên cần theo thời gian thực:</strong> Toàn bộ các thẻ đếm chỉ số trên đầu hộp thoại (Sĩ số, Có mặt, Phép/Vắng, Trễ, Trial) tự động tính toán lại khớp chính xác theo danh sách học viên của buổi học hiện tại.</li>
  <li><strong>[RULE-CLS-05] Thống nhất mã định danh buổi học và lớp học:</strong> Luôn giữ nguyên mã định danh buổi học và mã lớp học được cấp từ hệ thống cơ sở dữ liệu, không tự ý biến đổi định dạng hiển thị.</li>
</ul>

<h2>2. LUỒNG XỬ LÝ CHÍNH (MAIN FLOW - HAPPY PATH)</h2>
<ac:structured-macro ac:name="code">
  <ac:parameter ac:name="language">text</ac:parameter>
  <ac:plain-text-body><![CDATA[sequenceDiagram
    autonumber
    actor U as Người dùng (Giáo viên / CSM / Quản lý)
    participant F as Giao diện (Hộp thoại Chi tiết buổi học)
    participant S as Hệ thống Máy chủ
    participant DB as Cơ sở dữ liệu Vận hành Đào tạo

    U->>F: Nhấp chọn một buổi học trên màn hình Lịch học hoặc Lớp học
    F->>S: Gửi yêu cầu lấy thông tin buổi học, danh sách lộ trình và giáo trình
    S->>S: Kiểm tra quyền truy cập và phạm vi cơ sở của tài khoản
    S->>DB: Gọi đến cơ sở dữ liệu buổi học và cơ sở dữ liệu khung chương trình
    DB-->>S: Trả về gói dữ liệu buổi học, danh sách các ca học và nội dung KCT
    S-->>F: Phản hồi thông tin đầy đủ
    F-->>U: Hiển thị hộp thoại chi tiết buổi học (Thông tin, KCT, Thẻ đếm, Nhật ký)

    opt Người dùng chuyển nhanh sang buổi học khác qua bộ chọn
        U->>F: Nhấp vào ô chọn danh sách buổi học (Dropdown)
        F-->>U: Mở bảng danh sách toàn bộ các buổi học trong lộ trình
        U->>F: Nhấp chọn một buổi học mong muốn
        F->>S: Gửi yêu cầu cập nhật ngữ cảnh sang buổi học mới
        S->>DB: Gọi đến cơ sở dữ liệu buổi học tương ứng
        DB-->>S: Trả về dữ liệu chi tiết của buổi học được chọn
        S-->>F: Cập nhật dữ liệu
        F-->>U: Đồng bộ lại tiêu đề, thông tin buổi, nội dung KCT và nhật ký tương ứng
    end

    opt Giáo viên nhập nhật ký buổi học và gắn thẻ học viên
        U->>F: Nhấp vào khung Nhật ký buổi học và gõ nội dung
        U->>F: Gõ ký tự "@" kèm ký tự tìm kiếm tên học viên
        F-->>U: Hiển thị bảng nổi gợi ý học viên trong lớp
        U->>F: Chọn học viên mong muốn (nhấp chuột hoặc phím Enter)
        F-->>U: Chèn thẻ "@TênHọcViên " vào vị trí con trỏ
        U->>F: Hoàn thành đoạn nhận xét và nhấp ra ngoài ô nhập (rời tiêu điểm)
        F->>S: Tự động gửi gói dữ liệu lưu nhận xét buổi học
        S->>DB: Gọi đến cơ sở dữ liệu buổi học để cập nhật trường nhật ký
        DB-->>S: Xác nhận lưu trữ thành công
        S-->>F: Phản hồi kết quả lưu
        F-->>U: Hiển thị thông báo nhẹ "Đã lưu nhận xét buổi học!"
    end

    opt Giáo viên gửi góp ý về nội dung bài giảng trong KCT
        U->>F: Nhấp vào nút [Góp ý] tại khung KCT
        F-->>U: Mở hộp thoại gửi ý kiến đóng góp giáo trình
        U->>F: Nhập nội dung góp ý và bấm xác nhận gửi
        F->>S: Gửi ý kiến phản hồi về bài giảng
        S->>DB: Gọi đến cơ sở dữ liệu học thuật để lưu phiếu góp ý
        DB-->>S: Xác nhận ghi nhận
        S-->>F: Phản hồi thành công
        F-->>U: Thông báo gửi góp ý thành công cho bộ phận đào tạo
    end]]></ac:plain-text-body>
</ac:structured-macro>

<h2>3. GIAO DIỆN, PHÂN QUYỀN &amp; RÀNG BUỘC KIỂM TRA DỮ LIỆU (UI, PERMISSION &amp; VALIDATION RULES)</h2>

<h3>3.1. Cấu trúc các vùng giao diện &amp; Ràng buộc Quyền hạn (Capability Gating)</h3>
<table class="wrapped">
  <thead>
    <tr>
      <th>Vùng Giao diện / Nút Thao Tác</th>
      <th>Vị Trí &amp; Loại Hiển Thị</th>
      <th>Mã Quyền Yêu Cầu</th>
      <th>Hành Động Khi Đủ Quyền</th>
      <th>Xử Lý Khi Không Đủ Quyền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Xem Chi tiết buổi học</strong></td>
      <td>Hộp thoại nổi toàn màn hình</td>
      <td><code>class.session.view_detail</code></td>
      <td>Mở hộp thoại, xem thông tin buổi và KCT</td>
      <td>Không mở được hộp thoại, hiển thị thông báo lỗi</td>
    </tr>
    <tr>
      <td><strong>Bộ chọn danh sách buổi học</strong></td>
      <td>Đỉnh hộp thoại, menu thả xuống</td>
      <td><code>class.session.view_detail</code></td>
      <td>Mở danh sách chọn ca học bất kỳ</td>
      <td>Vô hiệu hóa tính năng chọn danh sách</td>
    </tr>
    <tr>
      <td><strong>Chỉnh sửa Nhật ký buổi học</strong></td>
      <td>Khung nhập văn bản bên dưới tiêu đề</td>
      <td><code>class.session.edit_note</code></td>
      <td>Nhập văn bản, gắn thẻ @, tự động lưu</td>
      <td>Chuyển sang chế độ chỉ đọc (Readonly)</td>
    </tr>
    <tr>
      <td><strong>Gắn thẻ học viên trong nhật ký</strong></td>
      <td>Bảng nổi gợi ý danh sách học viên</td>
      <td><code>class.session.edit_note</code></td>
      <td>Hiển thị bảng nổi khi gõ @ và chọn học viên</td>
      <td>Không kích hoạt bảng nổi gợi ý</td>
    </tr>
    <tr>
      <td><strong>Báo cáo sự cố / Đổi phòng học</strong></td>
      <td>Nút biểu tượng cảnh báo tại ô Phòng học</td>
      <td><code>class.session.change_room</code></td>
      <td>Nhấp mở hộp thoại yêu cầu đổi phòng học</td>
      <td>Ẩn biểu tượng hoặc chỉ hiển thị cảnh báo tĩnh</td>
    </tr>
    <tr>
      <td><strong>Góp ý nội dung giáo trình KCT</strong></td>
      <td>Nút bấm kèm biểu tượng tại khung KCT</td>
      <td><code>class.session.feedback_syllabus</code></td>
      <td>Nhấp mở hộp thoại gửi ý kiến cho phòng Đào tạo</td>
      <td>Ẩn nút Góp ý khỏi tiêu đề khung KCT</td>
    </tr>
    <tr>
      <td><strong>Truy cập Đánh giá học kỳ</strong></td>
      <td>Nút huy hiệu cam <code>Semester Eval</code></td>
      <td><code>class.evaluation.manage</code></td>
      <td>Mở hộp thoại đánh giá học kỳ của lớp</td>
      <td>Ẩn nút huy hiệu khỏi thanh điều hướng</td>
    </tr>
  </tbody>
</table>

<h3>3.2. Cấu trúc các khối thành phần giao diện chi tiết</h3>

<h4>Khối 1: Thanh điều hướng đỉnh, Bộ chọn buổi &amp; Tiêu đề buổi học</h4>
<ul>
  <li><strong>Thanh điều hướng đỉnh (Top Navigation Bar):</strong>
    <ul>
      <li><em>Nút quay lại &amp; Breadcrumb:</em> Biểu tượng mũi tên trái <code>&lt;</code> kèm chuỗi liên kết <code>[Tên lớp học] / Chi tiết buổi học</code>. Nhấp vào tên lớp mở thông tin lớp học.</li>
      <li><em>Huy hiệu Đánh giá học kỳ:</em> Nút hình viên thuốc màu cam nổi bật <code>Semester Eval (N/M)</code> (ví dụ: <code>Semester Eval (6/17)</code>), nhấp vào mở giao diện đánh giá kỳ.</li>
      <li><em>Cụm điều hướng &amp; Lựa chọn buổi học:</em>
        <ul>
          <li>Nút <code>&lt; Buổi trước</code>: Chuyển về buổi học trước đó. Mờ đi nếu là buổi 1.</li>
          <li><strong>Ô chọn danh sách buổi học thả xuống (Session Selector Dropdown):</strong> Hiển thị ngày và giờ học hiện tại (ví dụ: <code>16/09/2026 (15:30-17:30) v</code>). Khi nhấp vào, mở danh sách xổ xuống gồm tất cả các buổi học của lớp. Mỗi dòng gồm: Số thứ tự buổi, Ngày học, Giờ học, Chủ đề buổi học và Huy hiệu trạng thái ca học.</li>
          <li>Nút <code>Buổi sau &gt;</code>: Chuyển đến buổi kế tiếp. Mờ đi nếu là buổi cuối cùng của lớp.</li>
          <li>Nút đóng <code>X</code>: Đóng hộp thoại.</li>
        </ul>
      </li>
    </ul>
  </li>
  <li><strong>Tiêu đề buổi học &amp; Huy hiệu nhận diện:</strong>
    <ul>
      <li><em>Dòng tiêu đề chính:</em> Phông chữ đậm, nổi bật (ví dụ: <code>Kiểm tra định kỳ: Unit 1 Review &amp; Quiz</code> hoặc <code>Level: 301_Lesson 2: Trò chơi Quy luật vui vẻ + Sách hoạt động</code>).</li>
      <li><em>Huy hiệu trạng thái buổi học:</em> Nhãn màu hiển thị trạng thái vận hành (<code>Chờ diễn ra</code> - xanh dương, <code>Đang diễn ra</code> - vàng hổ phách, <code>Đã kết thúc</code> - xanh lá cây, <code>Đã hủy</code> - xám).</li>
      <li><em>Huy hiệu phân loại buổi học:</em> Nhãn phân loại loại ca học (<code>Buổi kiểm tra</code>, <code>Buổi dự án</code>, <code>Buổi thường</code>, <code>Buổi bù</code>).</li>
    </ul>
  </li>
  <li><strong>Thẻ đếm chỉ số nhanh (Status Tiles):</strong> Gồm 5 thẻ đếm nằm ngang nhỏ gọn:
    <ul>
      <li>Sĩ số: Tổng số học viên chính thức trong lớp (ví dụ: 17).</li>
      <li>Có mặt: Số học viên có mặt / Tổng sĩ số (màu xanh lá, ví dụ: 0/17).</li>
      <li>Phép / Vắng: Số học viên nghỉ có phép · Số học viên nghỉ không phép (màu đỏ, ví dụ: 0·17).</li>
      <li>Trễ: Số học viên vào lớp muộn (màu vàng hổ phách, ví dụ: 0).</li>
      <li>Trial: Số lượng học viên học thử trong buổi này (màu tím, ví dụ: 2).</li>
    </ul>
  </li>
</ul>

<h4>Khối 2: Ghi chú / Nhật ký buổi học (Session Diary)</h4>
<ul>
  <li><strong>Giao diện khung nhập:</strong>
    <ul>
      <li>Biểu tượng cây bút chỉnh sửa màu vàng hổ phách đặt ở đầu dòng.</li>
      <li>Khung văn bản không viền thô cứng, nền trong suốt hài hòa với giao diện, gợi ý văn bản mờ: <code>Nhật ký buổi học: Giáo viên nhập nhận xét chung về buổi học tại đây... (Gõ @ để tag học viên)</code>.</li>
      <li>Tự động giãn chiều cao theo độ dài văn bản nhập vào, cho phép kéo chỉnh kích thước ở góc dưới.</li>
    </ul>
  </li>
  <li><strong>Cơ chế gợi ý gắn thẻ học viên (@):</strong>
    <ul>
      <li>Khi gõ ký tự <code>@</code>, mở bảng nổi ngay bên dưới dòng con trỏ.</li>
      <li>Bảng nổi hiển thị tiêu đề "Tag học viên", ô lọc và danh sách các học viên trong lớp kèm ảnh đại diện, họ tên và mã số học viên.</li>
      <li>Hỗ trợ di chuyển chọn bằng phím mũi tên Lên/Xuống, phím Enter hoặc nhấp chuột để chèn chuỗi <code>@TênHọcViên </code> vào văn bản.</li>
    </ul>
  </li>
  <li><strong>Cơ chế tự động lưu dữ liệu:</strong>
    <ul>
      <li>Khi người dùng dừng gõ và nhấp chuột ra ngoài vùng nhập (rời tiêu điểm), hệ thống tự động lưu nội dung vào cơ sở dữ liệu và hiển thị thông báo phản hồi nhẹ "Đã lưu nhận xét buổi học!".</li>
    </ul>
  </li>
</ul>

<h4>Khối 3: Khung Thông tin buổi học (Cột bên phải)</h4>
<p>Bố cục dạng thẻ chữ nhật bo góc nhẹ, nền trắng sáng, tiêu đề in hoa <code>THÔNG TIN BUỔI HỌC</code>, tổ chức theo lưới 2 cột cân đối:</p>
<ul>
  <li><strong>Cặp 1: Lịch học &amp; Giờ học:</strong>
    <ul>
      <li>Cột trái (Lịch học): Biểu tượng lịch, ngày học theo định dạng cố định <code>dd/mm/yyyy</code>, kèm thứ trong tuần bên dưới (ví dụ: <code>16/09/2026</code> / <code>Thứ 4</code>).</li>
      <li>Cột phải (Giờ học): Khung giờ bắt đầu – kết thúc dạng <code>hh:mm–hh:mm</code> (ví dụ: <code>15:30–17:30</code>).</li>
    </ul>
  </li>
  <li><strong>Cặp 2: Cơ sở &amp; Phòng học:</strong>
    <ul>
      <li>Cột trái (Cơ sở): Biểu tượng tòa nhà, tên cơ sở vận hành (ví dụ: <code>RinoEdu Linh Đàm</code>).</li>
      <li>Cột phải (Phòng học): Tên phòng học được chỉ định (ví dụ: <code>Phòng 1</code>). Nếu phòng hiện tại khác phòng học gốc của lớp, hiển thị nhãn phụ <code>(gốc: Phòng X)</code>. Kèm biểu tượng tam giác cảnh báo màu đỏ/cam để báo cáo sự cố hoặc xin đổi phòng.</li>
    </ul>
  </li>
  <li><strong>Cặp 3: Tên lớp &amp; Mã lớp:</strong>
    <ul>
      <li>Cột trái (Tên lớp): Biểu tượng cuốn sách, tên đầy đủ của lớp học (ví dụ: <code>Tiếng Anh Trial Level 2</code>).</li>
      <li>Cột phải (Mã lớp): Mã định danh lớp học (ví dụ: <code>SA1_TA_T03</code>), dạng chữ màu xanh liên kết. Khi di chuột hiển thị bảng tóm tắt lớp học; khi nhấp chuột mở hộp thoại chi tiết lớp học.</li>
    </ul>
  </li>
  <li><strong>Cặp 4: Giáo viên &amp; Trợ giảng:</strong>
    <ul>
      <li>Cột trái (Giáo viên): Biểu tượng người dùng, tên giáo viên giảng dạy chính. Nếu có giáo viên dạy thay, hiển thị tên giáo viên chính bị gạch ngang và mũi tên trỏ sang tên giáo viên dạy thay màu hổ phách.</li>
      <li>Cột phải (Trợ giảng): Tên trợ giảng phụ trách hỗ trợ buổi học (ví dụ: <code>Thu Hà</code> hoặc dấu gạch ngang <code>—</code> nếu chưa phân công).</li>
    </ul>
  </li>
  <li><strong>Cặp 5: Quy mô &amp; Trình độ:</strong>
    <ul>
      <li>Cột trái (Quy mô): Biểu tượng nhóm người, tỷ lệ phân bổ giáo viên:học sinh chuẩn (ví dụ: <code>1:7</code> hoặc <code>1:10</code>).</li>
      <li>Cột phải (Trình độ): Cấp độ đào tạo của lớp (ví dụ: <code>Level 2</code>, <code>Colombus 4</code>, <code>TOEIC 500+</code>).</li>
    </ul>
  </li>
</ul>

<h4>Khối 4: Khung Chương trình đào tạo (KCT - Cột bên phải)</h4>
<p>Bố cục thẻ thông tin chuyên sâu về mặt học thuật đặt ngay bên dưới khung thông tin buổi học:</p>
<ul>
  <li><strong>Dòng tiêu đề KCT &amp; Nút góp ý:</strong>
    <ul>
      <li>Tiêu đề: Tên khung chương trình in hoa (ví dụ: <code>KCT: IELTS JUNIOR V2.1</code> hoặc <code>KCT: Station_Toán tư duy (Col 4 tuổi)</code>).</li>
      <li><strong>Nút hành động [Góp ý]:</strong> Biểu tượng tin nhắn cảnh báo kèm chữ "Góp ý", nhấp vào cho phép giáo viên phản hồi về chất lượng bài giảng trực tiếp cho bộ phận Đào tạo.</li>
    </ul>
  </li>
  <li><strong>Phần Nội dung buổi học:</strong>
    <ul>
      <li>Tiêu đề phụ: Biểu tượng cuốn sách mở kèm chữ "Nội dung buổi học" bên trái, số thứ tự buổi tương ứng trong giáo trình hiển thị bên phải (ví dụ: <code>Buổi 3</code>).</li>
      <li>Cấu trúc nội dung chuẩn hóa:
        <ul>
          <li><code>- Words:</code> Danh sách từ vựng trọng tâm cần dạy.</li>
          <li><code>- Sentences:</code> Các mẫu câu giao tiếp chính của bài học.</li>
          <li><code>- Phonics:</code> Quy tắc phát âm hoặc điểm ngữ pháp cốt lõi.</li>
          <li>(Đối với môn Toán/Tư duy: <code>- Tư duy Toán học: ...</code>, <code>- Tư duy Logic: ...</code>).</li>
        </ul>
      </li>
    </ul>
  </li>
  <li><strong>Phần Tài liệu &amp; Nhiệm vụ học tập:</strong>
    <ul>
      <li>Tiêu đề bài giảng: Tên bài học trong giáo trình (ví dụ: <code>Kiểm tra định kỳ: Unit 1 Review &amp; Quiz</code>).</li>
      <li>Danh sách các mục học liệu kèm biểu tượng màu nhận diện:
        <ul>
          <li>Slide bài giảng: Biểu tượng tệp màu đỏ, ghi chú <code>File tài liệu tham khảo cho học sinh • Tài liệu tham khảo</code>.</li>
          <li>Bài tập về nhà / Nhiệm vụ thực hành: Biểu tượng dấu kiểm màu xanh lục, ghi chú <code>Bài luyện tập tự học ở nhà • Nhiệm vụ phải làm</code>.</li>
          <li>Bài kiểm tra nhanh (Quiz): Biểu tượng dấu hỏi màu cam, ghi chú <code>Bài kiểm tra nhanh đánh giá năng lực • Nhiệm vụ phải làm</code>.</li>
          <li>File nghe (Audio): Biểu tượng tai nghe màu xanh dương, ghi chú <code>File nghe audio luyện kỹ năng nghe • Tài liệu nghe bổ trợ</code>.</li>
          <li>Dự án / Mini Project: Biểu tượng liên kết màu đỏ kèm nút bấm <code>Project: Link</code> để mở trang bài tập dự án.</li>
        </ul>
      </li>
    </ul>
  </li>
  <li><strong>Phần Thành phần buổi học (Phân bổ thời lượng kịch bản):</strong>
    <ul>
      <li>Liệt kê các phân đoạn hoạt động trong lớp kèm thời lượng định mức (ví dụ: <code>Thành phần buổi học 2 - 10 phút</code>, kịch bản hoạt cảnh).</li>
    </ul>
  </li>
</ul>

<h3>3.3. Bảng quy chuẩn và ràng buộc kiểm tra dữ liệu (Validation Rules)</h3>
<table class="wrapped">
  <thead>
    <tr>
      <th>Trường thông tin</th>
      <th>Kiểu dữ liệu</th>
      <th>Bắt buộc</th>
      <th>Nguồn dữ liệu</th>
      <th>Quy tắc kiểm tra (Validation)</th>
      <th>Quy cách hiển thị</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Mã định danh buổi học (sessionId)</strong></td>
      <td>Chuỗi ký tự</td>
      <td>Bắt buộc</td>
      <td>Cơ sở dữ liệu</td>
      <td>Định danh duy nhất của ca học vật lý trong toàn hệ thống</td>
      <td>Ẩn trên giao diện</td>
    </tr>
    <tr>
      <td><strong>Tiêu đề buổi học (topic)</strong></td>
      <td>Chuỗi ký tự</td>
      <td>Bắt buộc</td>
      <td>Cơ sở dữ liệu</td>
      <td>Tối đa 255 ký tự, lấy từ kế hoạch bài dạy của lớp</td>
      <td>Phông đậm, hiển thị trên đỉnh vùng nội dung</td>
    </tr>
    <tr>
      <td><strong>Trạng thái buổi học (status)</strong></td>
      <td>Giá trị danh mục</td>
      <td>Bắt buộc</td>
      <td>Cơ sở dữ liệu</td>
      <td>Một trong các trạng thái: <code>upcoming</code>, <code>ongoing</code>, <code>completed</code>, <code>cancelled</code></td>
      <td>Nhãn trạng thái màu sắc tương ứng</td>
    </tr>
    <tr>
      <td><strong>Loại buổi học (type)</strong></td>
      <td>Giá trị danh mục</td>
      <td>Bắt buộc</td>
      <td>Cơ sở dữ liệu</td>
      <td>Một trong các loại: <code>standard</code>, <code>test</code>, <code>project</code>, <code>makeup</code></td>
      <td>Nhãn phân loại dạng thẻ viền</td>
    </tr>
    <tr>
      <td><strong>Nhật ký buổi học (note/comment)</strong></td>
      <td>Chuỗi văn bản</td>
      <td>Không</td>
      <td>Giáo viên nhập</td>
      <td>Tối đa 2.000 ký tự; hỗ trợ ký tự gắn thẻ @ học viên</td>
      <td>Khung nhập tự co giãn, tự động lưu khi rời ô nhập</td>
    </tr>
    <tr>
      <td><strong>Phòng học (room)</strong></td>
      <td>Chuỗi ký tự</td>
      <td>Bắt buộc</td>
      <td>Cơ sở dữ liệu</td>
      <td>Tên phòng học thực tế được xếp cho ca học</td>
      <td>Kèm nhãn phòng gốc nếu khác phòng mặc định</td>
    </tr>
    <tr>
      <td><strong>Giáo viên dạy thay (substituteTeacher)</strong></td>
      <td>Chuỗi ký tự</td>
      <td>Không</td>
      <td>Cơ sở dữ liệu</td>
      <td>Tên nhân sự giảng dạy thay thế cho ca học cụ thể</td>
      <td>Hiển thị gạch ngang tên GV chính và trỏ tên GV thay</td>
    </tr>
    <tr>
      <td><strong>Trợ giảng (assistantTeacher)</strong></td>
      <td>Chuỗi ký tự</td>
      <td>Không</td>
      <td>Cơ sở dữ liệu</td>
      <td>Tên nhân sự trợ giảng được điều phối cho buổi học</td>
      <td>Hiển thị tên hoặc dấu gạch ngang nếu chưa có</td>
    </tr>
  </tbody>
</table>

<h2>4. KHỐI CHỨC NĂNG &amp; TIÊU CHÍ NGHIỆM THU (ACTIONS &amp; ACCEPTANCE CRITERIA)</h2>

<h3>Khối chức năng 1: Chọn và Chuyển Buổi Học</h3>
<h4>Action 1.1: Mở danh sách và chọn buổi học trực tiếp</h4>
<ul>
  <li><strong>AC-01 (Happy Path - Nhảy ca học thành công qua danh sách chọn):</strong>
    <ul>
      <li><strong>Giả sử:</strong> Lớp học có tổng cộng 20 buổi học, người dùng đang ở giao diện Chi tiết của Buổi 2.</li>
      <li><strong>Khi:</strong> Người dùng nhấp vào ô chọn danh sách buổi học và chọn "Buổi 15: Ôn tập giữa kỳ (24/10/2026)".</li>
      <li><strong>Thì:</strong> Hộp thoại lập tức đồng bộ hiển thị dữ liệu của Buổi 15 bao gồm: Tiêu đề buổi học, các thẻ đếm chỉ số chuyên cần, thông tin ca học bên phải, nội dung KCT của Buổi 15 và nhật ký tương ứng; ô chọn cập nhật nhãn thành ngày giờ của Buổi 15.</li>
    </ul>
  </li>
  <li><strong>AC-02 (Happy Path - Sử dụng nút Buổi trước / Buổi sau):</strong>
    <ul>
      <li><strong>Giả sử:</strong> Người dùng đang xem Buổi 5 của lớp.</li>
      <li><strong>Khi:</strong> Người dùng nhấp nút "Buổi sau &gt;".</li>
      <li><strong>Thì:</strong> Giao diện chuyển sang hiển thị toàn bộ dữ liệu của Buổi 6; nút "Buổi trước" và "Buổi sau" đều ở trạng thái hoạt động bình thường.</li>
    </ul>
  </li>
  <li><strong>AC-03 (Edge Case - Giới hạn đầu và cuối lộ trình):</strong>
    <ul>
      <li><strong>Giả sử:</strong> Người dùng đang xem Buổi 1 (buổi đầu tiên của lớp).</li>
      <li><strong>Khi:</strong> Quan sát thanh điều hướng.</li>
      <li><strong>Thì:</strong> Nút "&lt; Buổi trước" bị mờ đi và vô hiệu hóa không cho bấm; khi chuyển đến buổi cuối cùng thì nút "Buổi sau &gt;" cũng bị vô hiệu hóa tương tự.</li>
    </ul>
  </li>
</ul>

<h3>Khối chức năng 2: Ghi Nhật Ký Buổi Học &amp; Gắn Thẻ Học Viên</h3>
<h4>Action 2.1: Nhập nhận xét và tự động lưu dữ liệu</h4>
<ul>
  <li><strong>AC-04 (Happy Path - Tự động lưu nhận xét khi rời ô nhập):</strong>
    <ul>
      <li><strong>Giả sử:</strong> Giáo viên đang mở chi tiết buổi học vừa kết thúc, khung nhật ký đang rỗng.</li>
      <li><strong>Khi:</strong> Giáo viên gõ "Cả lớp nắm tốt kiến thức từ vựng hôm nay, làm bài tập nhóm tích cực" và nhấp chuột ra ngoài vùng nhập.</li>
      <li><strong>Thì:</strong> Hệ thống tự động gửi yêu cầu lưu nội dung nhận xét vào cơ sở dữ liệu buổi học và hiển thị thông báo phản hồi nhẹ "Đã lưu nhận xét buổi học!". Khi tải lại giao diện, đoạn nhận xét vẫn được lưu giữ nguyên vẹn.</li>
    </ul>
  </li>
  <li><strong>AC-05 (Happy Path - Gắn thẻ học viên bằng ký tự @):</strong>
    <ul>
      <li><strong>Giả sử:</strong> Giáo viên đang nhập nhận xét trong khung nhật ký.</li>
      <li><strong>Khi:</strong> Giáo viên gõ ký tự "@" và nhập tiếp chữ "Ph".</li>
      <li><strong>Thì:</strong> Bảng nổi bật lên hiển thị danh sách các học viên có tên hoặc mã chứa "Ph" (ví dụ: "Nguyễn Hà Phương", "Phạm Dũng"). Khi giáo viên bấm phím Enter, chuỗi "@Nguyễn Hà Phương " được chèn vào văn bản và bảng nổi đóng lại.</li>
    </ul>
  </li>
  <li><strong>AC-06 (Exception Path - Chặn chỉnh sửa khi không đủ thẩm quyền):</strong>
    <ul>
      <li><strong>Giả sử:</strong> Tài khoản nhân viên lễ tân hoặc người dùng không có quyền <code>class.session.edit_note</code> mở chi tiết buổi học.</li>
      <li><strong>Khi:</strong> Xem khung nhật ký buổi học.</li>
      <li><strong>Thì:</strong> Khung nhập hiển thị ở chế độ chỉ đọc, không thể gõ văn bản và không kích hoạt bảng nổi gắn thẻ @.</li>
    </ul>
  </li>
</ul>

<h3>Khối chức năng 3: Khung Thông Tin Buổi Học &amp; Cảnh Báo Vận Hành</h3>
<h4>Action 3.1: Hiển thị thông tin vận hành và cảnh báo phòng học</h4>
<ul>
  <li><strong>AC-07 (Happy Path - Hiển thị chuẩn hóa 5 cặp thông tin):</strong>
    <ul>
      <li><strong>Giả sử:</strong> Buổi học diễn ra vào ngày 16/09/2026 từ 15:30 đến 17:30 tại cơ sở Linh Đàm.</li>
      <li><strong>Khi:</strong> Người dùng nhìn vào khung Thông tin buổi học.</li>
      <li><strong>Thì:</strong> Giao diện hiển thị rõ ràng 5 cặp thông tin: (1) Lịch học 16/09/2026 Thứ 4 - Giờ học 15:30–17:30, (2) Cơ sở RinoEdu Linh Đàm - Phòng học Phòng 1, (3) Tên lớp Tiếng Anh Trial Level 2 - Mã lớp SA1_TA_T03, (4) Giáo viên Thu Hà - Trợ giảng —, (5) Quy mô 1:7 - Trình độ Level 2.</li>
    </ul>
  </li>
  <li><strong>AC-08 (Happy Path - Cảnh báo phòng học khác phòng mặc định):</strong>
    <ul>
      <li><strong>Giả sử:</strong> Lớp học được thiết lập học tại Phòng 3, nhưng buổi học hôm nay được điều phối chuyển sang Phòng 1 do bảo trì thiết bị.</li>
      <li><strong>Khi:</strong> Người dùng xem dòng Phòng học trên khung thông tin.</li>
      <li><strong>Thì:</strong> Giao diện hiển thị "Phòng 1 (gốc: Phòng 3)" kèm biểu tượng tam giác cảnh báo màu đỏ/cam. Nhấp vào biểu tượng cho phép mở giao diện báo cáo sự cố hoặc đề xuất đổi phòng.</li>
    </ul>
  </li>
  <li><strong>AC-09 (Happy Path - Hiển thị giáo viên dạy thay):</strong>
    <ul>
      <li><strong>Giả sử:</strong> Giáo viên chính thức của lớp là cô Mai Phương nhưng hôm nay thầy Hồng Thiệp dạy thay ca này.</li>
      <li><strong>Khi:</strong> Xem ô Giáo viên trên khung thông tin buổi học.</li>
      <li><strong>Thì:</strong> Tên "Mai Phương" hiển thị nét gạch ngang giữa chữ kèm mũi tên trỏ sang "Hồng Thiệp" màu chữ hổ phách nổi bật.</li>
    </ul>
  </li>
</ul>

<h3>Khối chức năng 4: Khung Chương Trình (KCT) &amp; Góp Ý Giáo Trình</h3>
<h4>Action 4.1: Tra cứu KCT và gửi ý kiến đóng góp</h4>
<ul>
  <li><strong>AC-10 (Happy Path - Cấu trúc KCT mạch lạc theo phân mục):</strong>
    <ul>
      <li><strong>Giả sử:</strong> Buổi học áp dụng khung chương trình "IELTS JUNIOR V2.1", tương ứng Buổi 3 trong giáo trình.</li>
      <li><strong>Khi:</strong> Người dùng kiểm tra khung KCT.</li>
      <li><strong>Thì:</strong> Tiêu đề hiển thị "KCT: IELTS JUNIOR V2.1", tiêu đề phụ hiển thị "Nội dung buổi học" song song với "Buổi 3"; nội dung hiển thị phân định rõ các dòng "- Words:", "- Sentences:", "- Phonics:"; danh sách học liệu liệt kê Slide bài giảng và Bài tập về nhà kèm nhãn phân loại rõ ràng.</li>
    </ul>
  </li>
  <li><strong>AC-11 (Happy Path - Gửi ý kiến phản hồi về bài học):</strong>
    <ul>
      <li><strong>Giả sử:</strong> Giáo viên phát hiện một câu hỏi trong slide bài giảng bị sai đáp án.</li>
      <li><strong>Khi:</strong> Giáo viên nhấp vào nút [Góp ý] tại tiêu đề khung KCT, nhập nội dung "Slide 12 bài giảng Unit 1 câu 3 bị nhầm đáp án B thành C" và bấm gửi.</li>
      <li><strong>Thì:</strong> Hệ thống ghi nhận ý kiến vào cơ sở dữ liệu học thuật, gửi thông báo đến bộ phận Đào tạo và phản hồi xác nhận "Đã gửi góp ý giáo trình thành công!".</li>
    </ul>
  </li>
</ul>

<h2>5. CÁC TRƯỜNG HỢP GÓC CẠNH &amp; LUỒNG NGOẠI LỆ (CORNER CASES &amp; EXCEPTION FLOWS)</h2>
<ul>
  <li><strong>[CASE-01] Mất kết nối mạng khi đang gõ hoặc tự động lưu nhật ký:</strong>
    <br/><em>Tình huống:</em> Giáo viên gõ xong nhận xét buổi học và nhấp ra ngoài, đúng lúc mạng internet của trung tâm bị gián đoạn.
    <br/><em>Cách xử lý:</em> Giao diện giữ nguyên nội dung văn bản trong khung nhập, không xóa dữ liệu, hiển thị biểu tượng cảnh báo kèm thông báo "Không thể lưu nhận xét do mất kết nối mạng. Vui lòng kiểm tra lại đường truyền." Khi mạng phục hồi, giáo viên nhấp ra ngoài lại để hệ thống tự động lưu lại.
  </li>
  <li><strong>[CASE-02] Buổi học chưa được gán Khung chương trình (KCT):</strong>
    <br/><em>Tình huống:</em> Lớp học mới tạo vỏ chưa được giáo vụ gắn giáo trình hoặc buổi học phát sinh đột xuất không nằm trong KCT.
    <br/><em>Cách xử lý:</em> Khung KCT hiển thị thông báo trạng thái nhẹ: "Không có chương trình học nào được gán cho buổi này", nút Góp ý tạm thời bị ẩn.
  </li>
  <li><strong>[CASE-03] Học viên được gắn thẻ @ trong nhật ký sau đó chuyển lớp hoặc thôi học:</strong>
    <br/><em>Tình huống:</em> Nhật ký cũ ghi nhận "@Nguyễn Văn A học tập rất tiến bộ", nhưng sau đó học viên A chuyển sang cơ sở khác hoặc bảo lưu.
    <br/><em>Cách xử lý:</em> Đoạn văn bản gắn thẻ trong nhật ký quá khứ vẫn được bảo lưu nguyên vẹn để giữ tính chân thực của biên bản buổi học; hệ thống không xóa hay làm hỏng định dạng văn bản cũ.
  </li>
  <li><strong>[CASE-04] Lớp học có danh sách buổi học rất dài (&gt; 100 buổi):</strong>
    <br/><em>Tình huống:</em> Các lớp dài hạn tích lũy số lượng buổi học lớn trong cả năm.
    <br/><em>Cách xử lý:</em> Bộ chọn danh sách buổi học thả xuống được trang bị thanh cuộn dọc tối ưu hóa hiệu năng, tự động cuộn đến vị trí của buổi học hiện tại khi mở danh sách, hỗ trợ người dùng tìm kiếm nhanh theo số buổi hoặc ngày học.
  </li>
  <li><strong>[CASE-05] Xung đột chỉnh sửa nhật ký buổi học đồng thời (Concurrent Editing):</strong>
    <br/><em>Tình huống:</em> Cả Giáo viên chính và Trợ giảng cùng mở hộp thoại chi tiết buổi học và sửa nhật ký cùng một thời điểm.
    <br/><em>Cách xử lý:</em> Hệ thống áp dụng cơ chế khóa kiểm soát phiên hoặc ghi nhận phiên lưu sau cùng kèm thông báo "Nội dung nhận xét vừa được cập nhật bởi [Tên nhân sự]. Đang làm mới dữ liệu."
  </li>
  <li><strong>[CASE-06] Buổi học đã bị hủy (Cancelled Session):</strong>
    <br/><em>Tình huống:</em> Buổi học được thông báo hủy do bão hoặc giáo viên có việc đột xuất chưa xếp dạy thay.
    <br/><em>Cách xử lý:</em> Tiêu đề hiển thị huy hiệu trạng thái "Đã hủy" màu xám, khung thông tin buổi học hiển thị lý do hủy (nếu có), các trường nhập nhận xét và điểm danh bị vô hiệu hóa.
  </li>
</ul>

<h2>6. KẾT NỐI DỮ LIỆU DỊCH VỤ VÀ YÊU CẦU PHI CHỨC NĂNG (SERVICE DATA CONTRACT &amp; NON-FUNCTIONAL REQUIREMENTS)</h2>

<h3>6.1. Yêu cầu phi chức năng (Non-functional Requirements)</h3>
<ul>
  <li><strong>Thời gian phản hồi:</strong>
    <ul>
      <li>Tải và hiển thị toàn bộ dữ liệu hộp thoại Chi tiết buổi học không quá 400ms từ bộ nhớ đệm và không quá 900ms từ cơ sở dữ liệu.</li>
      <li>Thao tác chuyển đổi buổi học qua danh sách chọn phản hồi ngay lập tức dưới 200ms.</li>
    </ul>
  </li>
  <li><strong>Bảo mật và an toàn dữ liệu:</strong>
    <ul>
      <li>Áp dụng nguyên tắc che giấu số điện thoại cá nhân phụ huynh và học viên (dạng <code>091****111</code>) khi xuất hiện trên các bảng chi tiết để tránh sao chép hàng loạt thông tin.</li>
      <li>Tuân thủ phân quyền động thông qua mã năng lực nguyên tử (<code>Capability Gating</code>), không gán cứng vai trò quản trị viên hay nhân viên trong mã nguồn.</li>
    </ul>
  </li>
  <li><strong>Tương thích giao diện:</strong> Hộp thoại co giãn linh hoạt theo kích thước màn hình làm việc của giáo viên (từ máy tính bảng 11 inch đến màn hình máy tính bàn độ phân giải cao).</li>
</ul>

<h3>6.2. Kết nối dữ liệu dịch vụ hệ thống (Service &amp; Data Contract)</h3>
<ul>
  <li><strong>Luồng truy vấn chi tiết buổi học:</strong> Gọi đến cơ sở dữ liệu buổi học và cơ sở dữ liệu lớp học theo mã định danh buổi học (<code>sessionId</code>), trả về toàn bộ thông tin vận hành, giáo viên, trợ giảng, phòng học và trạng thái ca học.</li>
  <li><strong>Luồng truy vấn danh sách các buổi học của lớp:</strong> Gọi đến cơ sở dữ liệu lịch trình lớp học theo mã lớp (<code>classCode</code>), trả về danh sách tóm tắt toàn bộ các buổi học trong khóa phục vụ bộ chọn thả xuống.</li>
  <li><strong>Luồng truy vấn nội dung KCT:</strong> Gọi đến cơ sở dữ liệu khung chương trình đào tạo theo mã KCT và số thứ tự buổi học để lấy nội dung từ vựng, câu mẫu, phát âm, danh sách tài liệu và nhiệm vụ học tập.</li>
  <li><strong>Luồng cập nhật nhật ký buổi học:</strong> Gọi đến cơ sở dữ liệu buổi học để cập nhật trường văn bản nhận xét khi giáo viên rời ô nhập.</li>
  <li><strong>Luồng gửi ý kiến góp ý giáo trình:</strong> Gọi đến cơ sở dữ liệu học thuật &amp; đào tạo để tạo bản ghi phiếu góp ý kèm mã giáo trình, số buổi học, mã giáo viên gửi và nội dung kiến nghị.</li>
</ul>
`;

fs.writeFileSync('C:/Users/Jacky Tran/.gemini/antigravity/brain/3f5e26de-d84b-4e3a-9f29-f1c2d592e985/scratch/confluence_storage.html', storageHtml, 'utf-8');
console.log('Successfully generated Confluence storage format file.');
