import { getStudentPhotos, type StudentGalleryPhoto } from './studentPhotos'

export interface WeekReviewItem {
  weekNum: number
  title: string
  content: string
  docLink?: string
  thumbnailUrl?: string
}

export interface StudentMonthlyReport {
  id: string
  studentId: string
  studentName: string
  studentCode?: string
  monthKey: string // e.g. "Tháng 4/2026"
  monthOptionValue: string // e.g. "4_5_2026"
  monthTitle: string
  dateStr: string
  awardBadge: string
  teacherName: string
  
  // Section A: Báo cáo học tập chuyên sâu
  sectionA1Content: string
  sectionA2Content: string
  sectionAContent?: string

  // Thư viện ảnh hoạt động đính kèm báo cáo trong tháng
  galleryPhotos?: StudentGalleryPhoto[]

  // Section B: Kế hoạch học tập cải thiện
  sectionB1Content: string
  sectionB2StartLesson: number
  sectionB2EndLesson: number
  sectionB2Weeks: WeekReviewItem[]
  sectionB2Content?: string
  sectionBContent?: string

  isCurrent?: boolean
  status: 'saved' | 'draft'
  createdAt: string
  updatedAt: string
}

export interface MonthlyReportMonthOption {
  value: string
  label: string
  current: string
  next: string
  dateStr: string
  monthKey: string
}

export const MONTH_OPTIONS: MonthlyReportMonthOption[] = [
  { value: '4_5_2026', label: 'Báo cáo Tháng 4 & Kế hoạch Tháng 5/2026', current: 'Tháng 4', next: 'Tháng 5', dateStr: '01/04/2026 đến 30/04/2026', monthKey: 'Tháng 4/2026' },
  { value: '5_6_2026', label: 'Báo cáo Tháng 5 & Kế hoạch Tháng 6/2026', current: 'Tháng 5', next: 'Tháng 6', dateStr: '01/05/2026 đến 31/05/2026', monthKey: 'Tháng 5/2026' },
  { value: '6_7_2026', label: 'Báo cáo Tháng 6 & Kế hoạch Tháng 7/2026', current: 'Tháng 6', next: 'Tháng 7', dateStr: '01/06/2026 đến 30/06/2026', monthKey: 'Tháng 6/2026' },
  { value: '7_8_2026', label: 'Báo cáo Tháng 7 & Kế hoạch Tháng 8/2026', current: 'Tháng 7', next: 'Tháng 8', dateStr: '01/07/2026 đến 31/07/2026', monthKey: 'Tháng 7/2026' },
  { value: '3_4_2026', label: 'Báo cáo Tháng 3 & Kế hoạch Tháng 4/2026', current: 'Tháng 3', next: 'Tháng 4', dateStr: '01/03/2026 đến 31/03/2026', monthKey: 'Tháng 3/2026' },
  { value: '2_3_2026', label: 'Báo cáo Tháng 2 & Kế hoạch Tháng 3/2026', current: 'Tháng 2', next: 'Tháng 3', dateStr: '01/02/2026 đến 28/02/2026', monthKey: 'Tháng 2/2026' },
  { value: '1_2_2026', label: 'Báo cáo Tháng 1 & Kế hoạch Tháng 2/2026', current: 'Tháng 1', next: 'Tháng 2', dateStr: '01/01/2026 đến 31/01/2026', monthKey: 'Tháng 1/2026' },
]

export const FIXED_PARENT_NOTICE = `Con sẽ phát phiếu và tranh học của phần ôn luyện riêng vào buổi tới. Con luyện tập phiếu bài tập, sau đó dựa trên tranh ảnh trên phiếu, con sẽ chỉ tranh trên phiếu, đọc to. Ba mẹ hỗ trợ con quay và gửi video qua zalo cho cô hàng tuần. Ba mẹ có thể cho con đến sớm để cô kiểm tra bài con mỗi buổi nhé.

Trân trọng cảm ơn!`

export const DEFAULT_SECTION_B2_WEEKS: WeekReviewItem[] = [
  {
    weekNum: 1,
    title: 'Tuần 1',
    content: 'Luyện phiếu bài tập với từ vựng “see” và “hear”. Sau đó con sẽ thực hiện luyện tập mẫu câu “I see with my eyes” và “I hear with my ears”.',
    docLink: 'https://drive.google.com/file/d/1AOasROm35C5mZk1bgoxmJunmf4GdYAh5/view?usp=drive_link',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=400&auto=format&fit=crop',
  },
  {
    weekNum: 2,
    title: 'Tuần 2',
    content: 'Luyện phiếu bài tập Letter T với từ vựng tiger và tent. Luyện nói mẫu câu “I can see a tiger.” và “ I can see a tent.”',
    docLink: 'https://drive.google.com/file/d/14oxsjCpMEL2NCsLlamNOpvVkVi6Q_Smq/view?usp=drive_link',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400&auto=format&fit=crop',
  },
  {
    weekNum: 3,
    title: 'Tuần 3',
    content: 'Luyện tập thuyết trình với mẫu câu “I see/hear/smell/touch with my ….” với tranh đính kèm.',
    docLink: 'https://drive.google.com/file/d/1AOasROm35C5mZk1bgoxmJunmf4GdYAh5/view?usp=drive_link',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=400&auto=format&fit=crop',
  },
  {
    weekNum: 4,
    title: 'Tuần 4',
    content: 'Luyện tập thuyết trình với letter Tt tại tranh sau, sử dụng mẫu câu “I can see a … . It’s + color”.',
    docLink: 'https://drive.google.com/file/d/14oxsjCpMEL2NCsLlamNOpvVkVi6Q_Smq/view?usp=drive_link',
    thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=400&auto=format&fit=crop',
  },
]

export const DEFAULT_SECTION_A1_TEXT = `Điểm nổi bật: Con có thái độ học tập tích cực và hợp tác tốt trong lớp. Khi đã hiểu yêu cầu, con vẫn cố gắng hoàn thành task và theo kịp hoạt động của lớp. Con có xu hướng quan sát khá kỹ trước khi tham gia, cho thấy con học theo hướng cẩn thận và muốn làm đúng trước khi trả lời. 

Điểm cần lưu ý: Hiện tại tốc độ phản xạ lại câu hỏi và tham gia hoạt động của con còn chậm hơn so với nhịp chung của lớp, đặc biệt ở các hoạt động luyện tập hội thoại. Con khá sợ nói sai và ngại trả lời dù đã biết đáp án. Qua quan sát, cô nhận thấy con có tâm lý sợ bị chú ý và thiếu tự tin khi bị nhận xét góp ý, nên thường chọn im lặng để tránh sai thay vì thử trả lời. Điều này khiến khả năng phản xạ ngôn ngữ của con chưa phát huy hết khả năng thật sự.`

export const DEFAULT_SECTION_A2_TEXT = `Từ vựng & Phonics: Con nhớ khá tốt các từ vựng: touch, smell và Letter U: umbrella, up. Tuy nhiên con vẫn còn nhầm lẫn các từ see, hear và chưa nhớ chắc Letter T: tiger, tent.

Cấu trúc & Mẫu câu: Con hiện chưa phản xạ được mẫu câu I see with my … và vẫn cần cô nhắc lại nhiều lần trước khi có thể sử dụng đúng cấu trúc.`

export const DEFAULT_SECTION_B1_TEXT = `Tháng tới, các con sẽ học 2 chủ đề mới: Zoo Animals và Fun Shapes với nhiều hoạt động hấp dẫn:
Học từ vựng về động vật: bears, elephants, giraffes, lions
Học từ vựng về hình khối: circle, square, star, triangle
Luyện mẫu câu: Do you like bears? / What shape is it?
Học phát âm: Vv với violin, vase; Ww với watch, window; Xx với box, fox
Đọc truyện ngắn và luyện hội thoại: How old are you?, This is for you.
Tham gia hoạt động CLIL: vận động với climb, stomp và ôn số đếm
Làm mini project: làm mặt nạ động vật và làm búp bê.`

// Base realistic seed reports for demonstration
function createSeedReport(
  id: string,
  studentId: string,
  studentName: string,
  studentCode: string,
  monthKey: string,
  monthOptionValue: string,
  monthTitle: string,
  dateStr: string,
  awardBadge: string,
  teacherName: string,
  isCurrent: boolean,
  sectionA1: string = DEFAULT_SECTION_A1_TEXT,
  sectionA2: string = DEFAULT_SECTION_A2_TEXT,
  sectionB1: string = DEFAULT_SECTION_B1_TEXT,
  weeks: WeekReviewItem[] = DEFAULT_SECTION_B2_WEEKS
): StudentMonthlyReport {
  return {
    id,
    studentId,
    studentName,
    studentCode,
    monthKey,
    monthOptionValue,
    monthTitle,
    dateStr,
    awardBadge,
    teacherName,
    sectionA1Content: sectionA1,
    sectionA2Content: sectionA2,
    sectionAContent: `${sectionA1}\n\n${sectionA2}`,
    galleryPhotos: getStudentPhotos(studentId).slice(0, 4),
    sectionB1Content: sectionB1,
    sectionB2StartLesson: 8,
    sectionB2EndLesson: 10,
    sectionB2Weeks: weeks,
    sectionB2Content: 'Kế hoạch ôn tập 4 tuần theo bài học trọng tâm',
    sectionBContent: `${sectionB1}\n\nKế hoạch ôn tập 4 tuần bổ trợ tại nhà`,
    isCurrent,
    status: 'saved',
    createdAt: '2026-04-28',
    updatedAt: '2026-04-28',
  }
}

// Initial mock database of monthly reports
export const mockMonthlyReports: StudentMonthlyReport[] = [
  // 1. Trần Minh Châu (s13)
  createSeedReport(
    'mr-s13-4_5_2026',
    's13',
    'Trần Minh Châu',
    'HV-S13-0',
    'Tháng 4/2026',
    '4_5_2026',
    'BÁO CÁO HỌC TẬP THÁNG 4 VÀ KẾ HOẠCH HỌC TẬP THÁNG 5',
    '01/04/2026 đến 30/04/2026',
    '🚀 NGÔI SAO BỨT PHÁ',
    'Ms.Chloe',
    true
  ),
  createSeedReport(
    'mr-s13-3_4_2026',
    's13',
    'Trần Minh Châu',
    'HV-S13-0',
    'Tháng 3/2026',
    '3_4_2026',
    'BÁO CÁO HỌC TẬP THÁNG 3 VÀ KẾ HOẠCH HỌC TẬP THÁNG 4',
    '01/03/2026 đến 31/03/2026',
    '⭐️ NGÔI SAO CHĂM CHỈ',
    'Ms.Chloe',
    false,
    'Điểm nổi bật: Con chủ động giơ tay phát biểu và hoàn thành bài tập sớm nhất lớp.\n\nĐiểm cần lưu ý: Cần rèn luyện tính kiên nhẫn khi gặp bài toán suy luận nhiều bước.',
    'Kiến thức & Tư duy: Nắm chắc các dạng toán tư duy cơ bản, tính nhẩm nhanh và chính xác.',
    'Tháng tới, con tiếp tục nâng cao kỹ năng tư duy hình học và logic phản xạ.'
  ),
  createSeedReport(
    'mr-s13-2_3_2026',
    's13',
    'Trần Minh Châu',
    'HV-S13-0',
    'Tháng 2/2026',
    '2_3_2026',
    'BÁO CÁO HỌC TẬP THÁNG 2 VÀ KẾ HOẠCH HỌC TẬP THÁNG 3',
    '01/02/2026 đến 28/02/2026',
    '🛡️ CHIẾN BINH KIÊN TRÌ',
    'Ms.Chloe',
    false,
    'Điểm nổi bật: Con hòa đồng, bắt nhịp rất nhanh với các hoạt động thảo luận nhóm.\n\nĐiểm cần lưu ý: Cần kiểm tra lại kết quả cẩn thận trước khi nộp bài.',
    'Kiến thức & Tư duy: Thực hành tốt các bài toán logic que tính và đếm hình phẳng cơ bản.',
    'Tháng tới, con tiếp tục rèn thói quen tự kiểm tra bài và tính nhẩm nhanh.'
  ),

  // 2. Nguyễn Phương Vy (s14)
  createSeedReport(
    'mr-s14-4_5_2026',
    's14',
    'Nguyễn Phương Vy',
    'HV-S14-0',
    'Tháng 4/2026',
    '4_5_2026',
    'BÁO CÁO HỌC TẬP THÁNG 4 VÀ KẾ HOẠCH HỌC TẬP THÁNG 5',
    '01/04/2026 đến 30/04/2026',
    '🌟 SIÊU SAO TOÁN HỌC',
    'Teacher Mark & Ms.Chloe',
    true
  ),
  createSeedReport(
    'mr-s14-3_4_2026',
    's14',
    'Nguyễn Phương Vy',
    'HV-S14-0',
    'Tháng 3/2026',
    '3_4_2026',
    'BÁO CÁO HỌC TẬP THÁNG 3 VÀ KẾ HOẠCH HỌC TẬP THÁNG 4',
    '01/03/2026 đến 31/03/2026',
    '🏆 CAO THỦ GIẢI TOÁN',
    'Teacher Mark & Ms.Chloe',
    false
  ),
  createSeedReport(
    'mr-s14-2_3_2026',
    's14',
    'Nguyễn Phương Vy',
    'HV-S14-0',
    'Tháng 2/2026',
    '2_3_2026',
    'BÁO CÁO HỌC TẬP THÁNG 2 VÀ KẾ HOẠCH HỌC TẬP THÁNG 3',
    '01/02/2026 đến 28/02/2026',
    '⭐️ NGÔI SAO BỨT PHÁ',
    'Teacher Mark & Ms.Chloe',
    false,
    'Điểm nổi bật: Con học tập chăm chỉ và đạt điểm kiểm tra đầu vào xuất sắc.',
    'Kiến thức & Kỹ năng: Tiếp thu bài nhanh, khả năng quan sát và suy luận sắc bén.',
    'Tháng tới con duy trì nhịp độ học tập và thử sức với các bài toán mở rộng.'
  ),

  // 3. Nguyễn An (Alex) (s1 / s1-act-0 / HV-S4-10)
  createSeedReport(
    'mr-s1-4_5_2026',
    's1',
    'Alex (Nguyễn An)',
    'HV-S4-10',
    'Tháng 4/2026',
    '4_5_2026',
    'BÁO CÁO HỌC TẬP THÁNG 4 VÀ KẾ HOẠCH HỌC TẬP THÁNG 5',
    '01/04/2026 đến 30/04/2026',
    '🚀 NGÔI SAO BỨT PHÁ',
    'Ms.Chloe',
    true
  ),
  createSeedReport(
    'mr-s1-3_4_2026',
    's1',
    'Alex (Nguyễn An)',
    'HV-S4-10',
    'Tháng 3/2026',
    '3_4_2026',
    'BÁO CÁO HỌC TẬP THÁNG 3 VÀ KẾ HOẠCH HỌC TẬP THÁNG 4',
    '01/03/2026 đến 31/03/2026',
    '🌟 SIÊU SAO TIẾNG ANH',
    'Ms.Chloe',
    false,
    'Điểm nổi bật: Con rất hào hứng với các hoạt động đọc truyện và diễn kịch tiếng Anh.\n\nĐiểm cần lưu ý: Cần chú ý thêm phát âm âm đuôi.',
    'Từ vựng & Phonics: Ghi nhớ tốt các từ vựng chủ đề Animals và Colours.',
    'Tháng tới con sẽ luyện tập thuyết trình ngắn về chủ đề My Pet.'
  ),
  createSeedReport(
    'mr-s1-2_3_2026',
    's1',
    'Alex (Nguyễn An)',
    'HV-S4-10',
    'Tháng 2/2026',
    '2_3_2026',
    'BÁO CÁO HỌC TẬP THÁNG 2 VÀ KẾ HOẠCH HỌC TẬP THÁNG 3',
    '01/02/2026 đến 28/02/2026',
    '⭐️ NGÔI SAO CHĂM CHỈ',
    'Ms.Chloe',
    false,
    'Điểm nổi bật: Con rất tích cực giao lưu tiếng Anh cùng giáo viên bản ngữ.\n\nĐiểm cần lưu ý: Cần tập trung hơn khi làm bài viết độc lập.',
    'Từ vựng & Phonics: Nhớ tốt các từ vựng chủ đề School và Family.',
    'Tháng tới con tiếp tục nâng cao phản xạ giao tiếp tự tin trước lớp.'
  ),

  // 4. Phạm Bình Nguyên (Lemon)
  createSeedReport(
    'mr-lemon-4_5_2026',
    's3',
    'Phạm Bình Nguyên (Lemon)',
    'HV-S18-8',
    'Tháng 4/2026',
    '4_5_2026',
    'BÁO CÁO HỌC TẬP THÁNG 4 VÀ KẾ HOẠCH HỌC TẬP THÁNG 5',
    '01/04/2026 đến 30/04/2026',
    '🚀 NGÔI SAO BỨT PHÁ',
    'Ms.Chloe',
    true
  ),

  // 5. Băng Hồng Phúc (Annie) (từ ảnh thực tế)
  createSeedReport(
    'mr-phuc-4_5_2026',
    's-phuc',
    'Băng Hồng Phúc',
    'HV-S18-2',
    'Tháng 4/2026',
    '4_5_2026',
    'BÁO CÁO HỌC TẬP THÁNG 4 VÀ KẾ HOẠCH HỌC TẬP THÁNG 5',
    '01/04/2026 đến 30/04/2026',
    '🚀 NGÔI SAO BỨT PHÁ',
    'Ms.Chloe',
    true
  ),
  createSeedReport(
    'mr-phuc-3_4_2026',
    's-phuc',
    'Băng Hồng Phúc',
    'HV-S18-2',
    'Tháng 3/2026',
    '3_4_2026',
    'BÁO CÁO HỌC TẬP THÁNG 3 VÀ KẾ HOẠCH HỌC TẬP THÁNG 4',
    '01/03/2026 đến 31/03/2026',
    '🌟 SIÊU SAO TOÁN HỌC',
    'Ms.Chloe',
    false
  ),
  createSeedReport(
    'mr-phuc-2_3_2026',
    's-phuc',
    'Băng Hồng Phúc',
    'HV-S18-2',
    'Tháng 2/2026',
    '2_3_2026',
    'BÁO CÁO HỌC TẬP THÁNG 2 VÀ KẾ HOẠCH HỌC TẬP THÁNG 3',
    '01/02/2026 đến 28/02/2026',
    '🚀 NGÔI SAO BỨT PHÁ',
    'Ms.Chloe',
    false,
    'Điểm nổi bật: Con lắng nghe cô giáo và hoàn thành tốt phiếu bài tập trên lớp.',
    'Tư duy toán học: Hiểu nhanh các quy tắc dãy số có quy luật và hình học trực quan.',
    'Tháng tới con tiếp tục rèn tính cẩn thận và tốc độ giải bài.'
  ),

  // 6. Lê Nguyễn Bảo Hân (Hannah) (Báo cáo mẫu trắng tinh để người dùng tự điền từ đầu)
  {
    id: 'mr-baohan-4_5_2026',
    studentId: 's-baohan',
    studentName: 'Lê Nguyễn Bảo Hân',
    studentCode: '10700325',
    monthKey: 'Tháng 4/2026',
    monthOptionValue: '4_5_2026',
    monthTitle: 'BÁO CÁO HỌC TẬP THÁNG 4 VÀ KẾ HOẠCH HỌC TẬP THÁNG 5',
    dateStr: '01/04/2026 đến 30/04/2026',
    awardBadge: '', // Trắng để người dùng tự chọn
    teacherName: 'Ms.Chloe',
    sectionA1Content: '', // Trắng để người dùng tự điền
    sectionA2Content: '', // Trắng để người dùng tự điền
    sectionAContent: '',
    galleryPhotos: [], // Trắng chưa chọn ảnh
    sectionB1Content: '', // Trắng để người dùng tự điền
    sectionB2StartLesson: 8,
    sectionB2EndLesson: 10,
    sectionB2Weeks: [],
    sectionB2Content: '',
    sectionBContent: '',
    isCurrent: true,
    status: 'draft',
    createdAt: '2026-04-28',
    updatedAt: '2026-04-28',
  },
  createSeedReport(
    'mr-baohan-3_4_2026',
    's-baohan',
    'Lê Nguyễn Bảo Hân',
    '10700325',
    'Tháng 3/2026',
    '3_4_2026',
    'BÁO CÁO HỌC TẬP THÁNG 3 VÀ KẾ HOẠCH HỌC TẬP THÁNG 4',
    '01/03/2026 đến 31/03/2026',
    '⭐️ NGÔI SAO CHĂM CHỈ',
    'Ms.Chloe',
    false,
    'Điểm nổi bật: Con đi học đầy đủ và tập trung nghe giảng.\n\nĐiểm cần lưu ý: Cần tự tin hơn khi phát biểu.',
    'Kiến thức & Tư duy: Nắm tốt các phép tính cơ bản trong phạm vi 20.\n\nKỹ năng giải toán: Cần rèn thêm kỹ năng giải toán có lời văn.',
    'Tháng tới con tiếp tục nâng cao phản xạ tư duy toán học.'
  ),
  createSeedReport(
    'mr-baohan-2_3_2026',
    's-baohan',
    'Lê Nguyễn Bảo Hân',
    '10700325',
    'Tháng 2/2026',
    '2_3_2026',
    'BÁO CÁO HỌC TẬP THÁNG 2 VÀ KẾ HOẠCH HỌC TẬP THÁNG 3',
    '01/02/2026 đến 28/02/2026',
    '🚀 NGÔI SAO BỨT PHÁ',
    'Ms.Chloe',
    false,
    'Điểm nổi bật: Con rất thích thú với các hình ảnh trực quan và câu đố toán học vui nhộn.\n\nĐiểm cần lưu ý: Cần thêm thời gian để làm quen với các phép so sánh số lớn.',
    'Kiến thức & Tư duy: Nhận biết tốt các dạng hình học phẳng và số học trong phạm vi 10.',
    'Tháng tới con sẽ rèn luyện thêm kỹ năng cộng trừ có nhớ trong phạm vi 20.'
  ),

  // 7. Đặng Thùy Dương (s29 / 30 / 2024029) - Tiếng Anh Level 1
  createSeedReport(
    'mr-s29-4_5_2026',
    's29',
    'Đặng Thùy Dương',
    '2024029',
    'Tháng 4/2026',
    '4_5_2026',
    'BÁO CÁO HỌC TẬP THÁNG 4 VÀ KẾ HOẠCH HỌC TẬP THÁNG 5',
    '01/04/2026 đến 30/04/2026',
    '🚀 NGÔI SAO BỨT PHÁ',
    'Teacher Mark & Ms.Chloe',
    true,
    'Điểm nổi bật: Con tự tin phát biểu, ngữ điệu nói tự nhiên và phát âm chuẩn các âm đuôi /s/, /t/, /d/. Trong các hoạt động đóng vai hội thoại nhóm, con luôn chủ động dẫn dắt bạn học.\n\nĐiểm cần lưu ý: Cần chú ý tốc độ nói khi thuyết trình chủ đề dài để tránh nói vấp hoặc nuốt âm.',
    'Từ vựng & Ngữ pháp: Nắm vững từ vựng chủ đề Environmental Conservation và sử dụng tốt các mẫu câu so sánh hơn, so sánh nhất. Bài kiểm tra giữa kỳ đạt 8.5/10 điểm xuất sắc.',
    'Tháng 5/2026, con sẽ tiếp tục hoàn thiện kỹ năng thuyết trình tự tin trước đám đông và làm quen với dạng bài viết luận ngắn 80-100 từ theo chuẩn Cambridge Flyers.'
  ),
  createSeedReport(
    'mr-s29-3_4_2026',
    's29',
    'Đặng Thùy Dương',
    '2024029',
    'Tháng 3/2026',
    '3_4_2026',
    'BÁO CÁO HỌC TẬP THÁNG 3 VÀ KẾ HOẠCH HỌC TẬP THÁNG 4',
    '01/03/2026 đến 31/03/2026',
    '🌟 SIÊU SAO TIẾNG ANH',
    'Teacher Mark & Ms.Chloe',
    false,
    'Điểm nổi bật: Con tham gia rất sôi nổi các trò chơi ngôn ngữ, phản xạ nghe hiểu câu hỏi của thầy giáo bản ngữ rất nhanh nhẹn.\n\nĐiểm cần lưu ý: Cần rèn thêm tính kiên nhẫn khi đọc hiểu các đoạn văn dài có nhiều từ mới.',
    'Phonics & Speaking: Phát âm chuẩn xác các nguyên âm đôi, ngữ điệu câu hỏi và câu cảm thán rất tự nhiên. Đạt điểm 8.0/10 ở bài kiểm tra định kỳ Unit 4.',
    'Tháng tới con sẽ thực hiện dự án thuyết trình nhóm "My Dream City" và ôn tập chuyên sâu các thì cơ bản (Hiện tại đơn, Quá khứ đơn).'
  ),
  createSeedReport(
    'mr-s29-2_3_2026',
    's29',
    'Đặng Thùy Dương',
    '2024029',
    'Tháng 2/2026',
    '2_3_2026',
    'BÁO CÁO HỌC TẬP THÁNG 2 VÀ KẾ HOẠCH HỌC TẬP THÁNG 3',
    '01/02/2026 đến 28/02/2026',
    '⭐️ NGÔI SAO CHĂM CHỈ',
    'Teacher Mark & Ms.Chloe',
    false,
    'Điểm nổi bật: Con đi học chuyên cần 100%, nộp bài tập về nhà đầy đủ và tương tác rất tích cực với giáo viên nước ngoài.\n\nĐiểm cần lưu ý: Đôi khi còn e dè khi nói chuyện 1-1 với giáo viên bản xứ.',
    'Từ vựng & Mẫu câu: Ghi nhớ tốt các từ vựng chủ đề Daily Routines và School Activities. Khả năng nghe hiểu câu lệnh cơ bản tốt.',
    'Tháng tới con tiếp tục mở rộng vốn từ vựng học thuật và rèn phản xạ giao tiếp tự tin hơn.'
  ),

  // 8. Phan Bảo Ngọc (s30 / 31 / 2024030) - Tiếng Anh Level 1
  createSeedReport(
    'mr-s30-4_5_2026',
    's30',
    'Phan Bảo Ngọc',
    '2024030',
    'Tháng 4/2026',
    '4_5_2026',
    'BÁO CÁO HỌC TẬP THÁNG 4 VÀ KẾ HOẠCH HỌC TẬP THÁNG 5',
    '01/04/2026 đến 30/04/2026',
    '🚀 NGÔI SAO BỨT PHÁ',
    'Teacher Mark & Ms.Chloe',
    true,
    'Điểm nổi bật: Con rất tích cực tham gia các hoạt động nghe - nói và đóng kịch tiếng Anh.\n\nĐiểm cần lưu ý: Cần cẩn thận hơn với ngữ pháp thì quá khứ đơn.',
    'Từ vựng & Kỹ năng: Nhớ từ vựng tốt, phản xạ nghe nói lưu loát và phát âm chuẩn.',
    'Tháng tới con tiếp tục phát triển kỹ năng đọc hiểu và chuẩn bị cho bài kiểm tra cuối khóa.'
  ),
  createSeedReport(
    'mr-s30-3_4_2026',
    's30',
    'Phan Bảo Ngọc',
    '2024030',
    'Tháng 3/2026',
    '3_4_2026',
    'BÁO CÁO HỌC TẬP THÁNG 3 VÀ KẾ HOẠCH HỌC TẬP THÁNG 4',
    '01/03/2026 đến 31/03/2026',
    '⭐️ NGÔI SAO CHĂM CHỈ',
    'Teacher Mark & Ms.Chloe',
    false
  ),

  // 9. Hoàng Minh Khôi (s15 / 16 / 2024015) - Tiếng Anh Level 4
  createSeedReport(
    'mr-s15-4_5_2026',
    's15',
    'Hoàng Minh Khôi',
    '2024015',
    'Tháng 4/2026',
    '4_5_2026',
    'BÁO CÁO HỌC TẬP THÁNG 4 VÀ KẾ HOẠCH HỌC TẬP THÁNG 5',
    '01/04/2026 đến 30/04/2026',
    '🌟 SIÊU SAO TIẾNG ANH',
    'Teacher Mark & Ms.Chloe',
    true,
    'Điểm nổi bật: Kỹ năng tranh biện và thuyết trình tiếng Anh rất chững chạc, vốn từ vựng phong phú.',
    'Nghe & Đọc: Đạt điểm tối đa phần thi nghe hiểu và đọc hiểu văn bản nâng cao.',
    'Tháng tới con tiếp tục chuẩn bị luyện thi chứng chỉ Cambridge PET.'
  ),
  createSeedReport(
    'mr-s15-3_4_2026',
    's15',
    'Hoàng Minh Khôi',
    '2024015',
    'Tháng 3/2026',
    '3_4_2026',
    'BÁO CÁO HỌC TẬP THÁNG 3 VÀ KẾ HOẠCH HỌC TẬP THÁNG 4',
    '01/03/2026 đến 31/03/2026',
    '🏆 CAO THỦ TIẾNG ANH',
    'Teacher Mark & Ms.Chloe',
    false
  ),
]

function normalizeName(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[()]/g, '')
    .replace(/[-_]/g, ' ')
    .trim()
}

/**
 * Lấy danh sách các báo cáo tháng của một học viên
 * Hỗ trợ tìm kiếm theo studentId, studentCode hoặc studentName
 */
export function getStudentMonthlyReports(
  studentIdOrName?: string,
  secondIdentifier?: string
): StudentMonthlyReport[] {
  if (!studentIdOrName && !secondIdentifier) return []

  const targets = [studentIdOrName, secondIdentifier].filter(Boolean) as string[]

  for (const rawTarget of targets) {
    const target = rawTarget.trim()
    const targetNoPrefix = target.replace(/^s-/, '')
    const normTarget = normalizeName(target)

    // 1. Tìm theo studentId
    const foundById = mockMonthlyReports.filter((r) => {
      const rId = r.studentId
      const rIdNoPrefix = rId.replace(/^s-/, '')
      return (
        rId === target ||
        rId.toLowerCase() === target.toLowerCase() ||
        rIdNoPrefix.toLowerCase() === targetNoPrefix.toLowerCase() ||
        target.startsWith(`${rId}-`) ||
        rId.startsWith(`${target}-`) ||
        normalizeName(rId) === normTarget
      )
    })
    if (foundById.length > 0) {
      return [...foundById].sort((a, b) => (b.isCurrent ? 1 : 0) - (a.isCurrent ? 1 : 0))
    }

    // 2. Tìm theo studentCode
    const foundByCode = mockMonthlyReports.filter(
      (r) => r.studentCode && r.studentCode.toLowerCase() === target.toLowerCase()
    )
    if (foundByCode.length > 0) {
      return [...foundByCode].sort((a, b) => (b.isCurrent ? 1 : 0) - (a.isCurrent ? 1 : 0))
    }

    // 3. Tìm theo studentName
    const foundByName = mockMonthlyReports.filter((r) => {
      const normReportName = normalizeName(r.studentName)
      return (
        normReportName.includes(normTarget) ||
        normTarget.includes(normReportName) ||
        normReportName.replace(/\s+/g, '').includes(normTarget.replace(/\s+/g, '')) ||
        normTarget.replace(/\s+/g, '').includes(normReportName.replace(/\s+/g, ''))
      )
    })
    if (foundByName.length > 0) {
      return [...foundByName].sort((a, b) => (b.isCurrent ? 1 : 0) - (a.isCurrent ? 1 : 0))
    }
  }

  return []
}

/**
 * Lấy báo cáo tháng gần nhất của học viên
 */
export function getLatestStudentMonthlyReport(target: string): StudentMonthlyReport | undefined {
  const reports = getStudentMonthlyReports(target)
  return reports[0]
}

/**
 * Lấy báo cáo chi tiết theo id hoặc kết hợp studentId + monthOptionValue
 */
export function getMonthlyReportById(
  idOrStudentId: string,
  monthOptionValue?: string
): StudentMonthlyReport {
  const reports = getStudentMonthlyReports(idOrStudentId)
  if (monthOptionValue) {
    const matched = reports.find(
      (r) => r.monthOptionValue === monthOptionValue || r.monthKey.includes(monthOptionValue)
    )
    if (matched) return matched
  }
  return reports[0] || mockMonthlyReports[0]
}

/**
 * Lưu hoặc cập nhật báo cáo tháng của học viên
 */
export function saveStudentMonthlyReport(
  data: Partial<StudentMonthlyReport> & { studentId: string; studentName?: string }
): StudentMonthlyReport {
  const monthOpt = MONTH_OPTIONS.find(
    (m) => m.value === data.monthOptionValue || m.monthKey === data.monthKey
  ) || MONTH_OPTIONS[0]

  const monthKey = data.monthKey || monthOpt.monthKey
  const monthOptionValue = data.monthOptionValue || monthOpt.value
  const monthTitle = data.monthTitle || `BÁO CÁO HỌC TẬP ${monthOpt.current.toUpperCase()} VÀ KẾ HOẠCH HỌC TẬP ${monthOpt.next.toUpperCase()}`
  const dateStr = data.dateStr || monthOpt.dateStr

  const existingIndex = mockMonthlyReports.findIndex(
    (r) =>
      (r.studentId === data.studentId || (data.studentName && normalizeName(r.studentName) === normalizeName(data.studentName))) &&
      (r.monthOptionValue === monthOptionValue || r.monthKey === monthKey)
  )

  const nowStr = new Date().toISOString().split('T')[0]

  const fullReport: StudentMonthlyReport = {
    id: data.id || (existingIndex >= 0 ? mockMonthlyReports[existingIndex].id : `mr-${data.studentId}-${monthOptionValue}`),
    studentId: data.studentId,
    studentName: data.studentName || (existingIndex >= 0 ? mockMonthlyReports[existingIndex].studentName : data.studentId),
    studentCode: data.studentCode || (existingIndex >= 0 ? mockMonthlyReports[existingIndex].studentCode : 'HV-CODE'),
    monthKey,
    monthOptionValue,
    monthTitle,
    dateStr,
    awardBadge: data.awardBadge || '',
    teacherName: data.teacherName || 'Ms.Chloe',
    sectionA1Content: data.sectionA1Content !== undefined ? data.sectionA1Content : '',
    sectionA2Content: data.sectionA2Content !== undefined ? data.sectionA2Content : '',
    sectionAContent: data.sectionAContent || `${data.sectionA1Content || ''}\n\n${data.sectionA2Content || ''}`.trim(),
    galleryPhotos:
      data.galleryPhotos !== undefined
        ? data.galleryPhotos
        : existingIndex >= 0
        ? mockMonthlyReports[existingIndex].galleryPhotos
        : [],
    sectionB1Content: data.sectionB1Content !== undefined ? data.sectionB1Content : '',
    sectionB2StartLesson: data.sectionB2StartLesson ?? 8,
    sectionB2EndLesson: data.sectionB2EndLesson ?? 10,
    sectionB2Weeks: data.sectionB2Weeks || [],
    sectionB2Content: data.sectionB2Content || '',
    sectionBContent: data.sectionBContent || `${data.sectionB1Content || ''}\n\nKế hoạch ôn tập 4 tuần bổ trợ tại nhà`,
    isCurrent: data.isCurrent !== undefined ? data.isCurrent : monthOptionValue === '4_5_2026',
    status: 'saved',
    createdAt: existingIndex >= 0 ? mockMonthlyReports[existingIndex].createdAt : nowStr,
    updatedAt: nowStr,
  }

  if (existingIndex >= 0) {
    mockMonthlyReports[existingIndex] = fullReport
  } else {
    mockMonthlyReports.unshift(fullReport)
  }

  // Phát sự kiện toàn cục để cập nhật mọi component đang lắng nghe
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('rinov5-monthly-reports-updated', {
        detail: {
          studentId: data.studentId,
          studentName: data.studentName,
          report: fullReport,
        },
      })
    )
  }

  return fullReport
}

/**
 * Xóa một báo cáo tháng
 */
export function deleteStudentMonthlyReport(reportId: string): boolean {
  const index = mockMonthlyReports.findIndex((r) => r.id === reportId)
  if (index >= 0) {
    const deleted = mockMonthlyReports.splice(index, 1)[0]
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('rinov5-monthly-reports-updated', {
          detail: { reportId, studentId: deleted.studentId },
        })
      )
    }
    return true
  }
  return false
}
