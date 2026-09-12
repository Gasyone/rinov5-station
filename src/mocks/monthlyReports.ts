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
    'BÁO CÁO HỌC TẬP CHUYÊN SÂU THÁNG 4 VÀ KẾ HOẠCH HỌC TẬP THÁNG 5',
    '01/04/2026 đến 30/04/2026',
    'CHIẾN BINH BỨT PHÁ',
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
    'BÁO CÁO HỌC TẬP CHUYÊN SÂU THÁNG 3 VÀ KẾ HOẠCH HỌC TẬP THÁNG 4',
    '01/03/2026 đến 31/03/2026',
    'NGÔI SAO CHĂM NGOAN',
    'Ms.Chloe',
    false,
    'Điểm nổi bật: Con chủ động giơ tay phát biểu và hoàn thành bài tập sớm nhất lớp.\n\nĐiểm cần lưu ý: Cần rèn luyện tính kiên nhẫn khi gặp bài toán suy luận nhiều bước.',
    'Kiến thức & Tư duy: Nắm chắc các dạng toán tư duy cơ bản, tính nhẩm nhanh và chính xác.',
    'Tháng tới, con tiếp tục nâng cao kỹ năng tư duy hình học và logic phản xạ.'
  ),

  // 2. Nguyễn Phương Vy (s14)
  createSeedReport(
    'mr-s14-4_5_2026',
    's14',
    'Nguyễn Phương Vy',
    'HV-S14-0',
    'Tháng 4/2026',
    '4_5_2026',
    'BÁO CÁO HỌC TẬP CHUYÊN SÂU THÁNG 4 VÀ KẾ HOẠCH HỌC TẬP THÁNG 5',
    '01/04/2026 đến 30/04/2026',
    'HỌC VIÊN XUẤT SẮC',
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
    'BÁO CÁO HỌC TẬP CHUYÊN SÂU THÁNG 3 VÀ KẾ HOẠCH HỌC TẬP THÁNG 4',
    '01/03/2026 đến 31/03/2026',
    'CHIẾN BINH TIẾN BỘ',
    'Teacher Mark & Ms.Chloe',
    false
  ),

  // 3. Nguyễn An (Alex) (s1 / s1-act-0 / HV-S4-10)
  createSeedReport(
    'mr-s1-4_5_2026',
    's1',
    'Alex (Nguyễn An)',
    'HV-S4-10',
    'Tháng 4/2026',
    '4_5_2026',
    'BÁO CÁO HỌC TẬP CHUYÊN SÂU THÁNG 4 VÀ KẾ HOẠCH HỌC TẬP THÁNG 5',
    '01/04/2026 đến 30/04/2026',
    'CHIẾN BINH BỨT PHÁ',
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
    'BÁO CÁO HỌC TẬP CHUYÊN SÂU THÁNG 3 VÀ KẾ HOẠCH HỌC TẬP THÁNG 4',
    '01/03/2026 đến 31/03/2026',
    'HỌC VIÊN XUẤT SẮC',
    'Ms.Chloe',
    false
  ),

  // 4. Phạm Bình Nguyên (Lemon)
  createSeedReport(
    'mr-lemon-4_5_2026',
    's3',
    'Phạm Bình Nguyên (Lemon)',
    'HV-S18-8',
    'Tháng 4/2026',
    '4_5_2026',
    'BÁO CÁO HỌC TẬP CHUYÊN SÂU THÁNG 4 VÀ KẾ HOẠCH HỌC TẬP THÁNG 5',
    '01/04/2026 đến 30/04/2026',
    'CHIẾN BINH BỨT PHÁ',
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
    'BÁO CÁO HỌC TẬP CHUYÊN SÂU THÁNG 4 VÀ KẾ HOẠCH HỌC TẬP THÁNG 5',
    '01/04/2026 đến 30/04/2026',
    'CHIẾN BINH BỨT PHÁ',
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
    'BÁO CÁO HỌC TẬP CHUYÊN SÂU THÁNG 3 VÀ KẾ HOẠCH HỌC TẬP THÁNG 4',
    '01/03/2026 đến 31/03/2026',
    'HỌC VIÊN XUẤT SẮC',
    'Ms.Chloe',
    false
  ),

  // 6. Lê Nguyễn Bảo Hân (Hannah) (học viên đầu danh sách chăm sóc học viên)
  createSeedReport(
    'mr-baohan-4_5_2026',
    's-baohan',
    'Lê Nguyễn Bảo Hân',
    '10700325',
    'Tháng 4/2026',
    '4_5_2026',
    'BÁO CÁO HỌC TẬP CHUYÊN SÂU THÁNG 4 VÀ KẾ HOẠCH HỌC TẬP THÁNG 5',
    '01/04/2026 đến 30/04/2026',
    'CHIẾN BINH BỨT PHÁ',
    'Ms.Chloe',
    true
  ),
  createSeedReport(
    'mr-baohan-3_4_2026',
    's-baohan',
    'Lê Nguyễn Bảo Hân',
    '10700325',
    'Tháng 3/2026',
    '3_4_2026',
    'BÁO CÁO HỌC TẬP CHUYÊN SÂU THÁNG 3 VÀ KẾ HOẠCH HỌC TẬP THÁNG 4',
    '01/03/2026 đến 31/03/2026',
    'NGÔI SAO CHĂM NGOAN',
    'Ms.Chloe',
    false
  ),
]

function normalizeName(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[()]/g, '')
    .trim()
}

/**
 * Lấy danh sách các báo cáo tháng của một học viên
 * Hỗ trợ tìm kiếm theo studentId, studentCode hoặc studentName
 */
export function getStudentMonthlyReports(studentIdOrName?: string): StudentMonthlyReport[] {
  if (!studentIdOrName) return []

  const target = studentIdOrName.trim()
  const normTarget = normalizeName(target)

  // 1. Tìm chính xác theo studentId
  let found = mockMonthlyReports.filter(
    (r) => r.studentId === target || target.startsWith(r.studentId) || r.studentId.startsWith(target)
  )

  // 2. Tìm theo studentCode
  if (found.length === 0) {
    found = mockMonthlyReports.filter(
      (r) => r.studentCode && r.studentCode.toLowerCase() === target.toLowerCase()
    )
  }

  // 3. Tìm theo studentName
  if (found.length === 0) {
    found = mockMonthlyReports.filter((r) => {
      const normReportName = normalizeName(r.studentName)
      return normReportName.includes(normTarget) || normTarget.includes(normReportName)
    })
  }

  // 4. Nếu học viên chưa có báo cáo sẵn, tự động sinh báo cáo mặc định chuẩn chỉnh cho học viên đó
  if (found.length === 0) {
    const defaultCurrent = createSeedReport(
      `mr-${target}-4_5_2026`,
      target,
      target,
      'HV-DEMO',
      'Tháng 4/2026',
      '4_5_2026',
      'BÁO CÁO HỌC TẬP CHUYÊN SÂU THÁNG 4 VÀ KẾ HOẠCH HỌC TẬP THÁNG 5',
      '01/04/2026 đến 30/04/2026',
      'CHIẾN BINH BỨT PHÁ',
      'Ms.Chloe',
      true
    )

    const defaultPrev = createSeedReport(
      `mr-${target}-3_4_2026`,
      target,
      target,
      'HV-DEMO',
      'Tháng 3/2026',
      '3_4_2026',
      'BÁO CÁO HỌC TẬP CHUYÊN SÂU THÁNG 3 VÀ KẾ HOẠCH HỌC TẬP THÁNG 4',
      '01/03/2026 đến 31/03/2026',
      'NGÔI SAO CHĂM NGOAN',
      'Ms.Chloe',
      false
    )

    mockMonthlyReports.push(defaultCurrent, defaultPrev)
    found = [defaultCurrent, defaultPrev]
  }

  // Sắp xếp báo cáo mới nhất (isCurrent) lên đầu
  return [...found].sort((a, b) => (b.isCurrent ? 1 : 0) - (a.isCurrent ? 1 : 0))
}

/**
 * Lấy báo cáo tháng gần nhất của học viên
 */
export function getLatestStudentMonthlyReport(studentIdOrName?: string): StudentMonthlyReport | undefined {
  const reports = getStudentMonthlyReports(studentIdOrName)
  return reports[0]
}

/**
 * Lấy báo cáo tháng theo report ID hoặc theo student ID/Name
 */
export function getMonthlyReportById(
  idOrStudentId?: string,
  monthOptionValue?: string
): StudentMonthlyReport {
  if (!idOrStudentId) return mockMonthlyReports[0]

  // 1. Tìm chính xác theo Report ID
  const exactById = mockMonthlyReports.find((r) => r.id === idOrStudentId)
  if (exactById) {
    if (monthOptionValue && exactById.monthOptionValue !== monthOptionValue) {
      const byMonth = mockMonthlyReports.find(
        (r) => r.studentId === exactById.studentId && r.monthOptionValue === monthOptionValue
      )
      if (byMonth) return byMonth
    }
    return exactById
  }

  // 2. Tìm theo student ID / student Code / student Name
  const studentReports = getStudentMonthlyReports(idOrStudentId)
  if (studentReports.length > 0) {
    if (monthOptionValue) {
      const matchMonth = studentReports.find(
        (r) => r.monthOptionValue === monthOptionValue || r.monthKey.includes(monthOptionValue)
      )
      if (matchMonth) return matchMonth
    }
    return studentReports[0]
  }

  return mockMonthlyReports[0]
}

/**
 * Thêm mới hoặc Cập nhật báo cáo tháng của học viên
 * Đồng bộ dữ liệu CSDL mock tức thì và kích hoạt notification
 */
export function saveStudentMonthlyReport(
  data: Partial<StudentMonthlyReport> & {
    studentId: string
    monthOptionValue?: string
    monthKey?: string
  }
): StudentMonthlyReport {
  const monthOpt = MONTH_OPTIONS.find(
    (m) => m.value === data.monthOptionValue || m.monthKey === data.monthKey
  ) || MONTH_OPTIONS[0]

  const monthKey = data.monthKey || monthOpt.monthKey
  const monthOptionValue = data.monthOptionValue || monthOpt.value
  const monthTitle = data.monthTitle || `BÁO CÁO HỌC TẬP CHUYÊN SÂU ${monthOpt.current.toUpperCase()} VÀ KẾ HOẠCH HỌC TẬP ${monthOpt.next.toUpperCase()}`
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
    awardBadge: data.awardBadge || 'CHIẾN BINH BỨT PHÁ',
    teacherName: data.teacherName || 'Ms.Chloe',
    sectionA1Content: data.sectionA1Content !== undefined ? data.sectionA1Content : DEFAULT_SECTION_A1_TEXT,
    sectionA2Content: data.sectionA2Content !== undefined ? data.sectionA2Content : DEFAULT_SECTION_A2_TEXT,
    sectionAContent: data.sectionAContent || `${data.sectionA1Content || DEFAULT_SECTION_A1_TEXT}\n\n${data.sectionA2Content || DEFAULT_SECTION_A2_TEXT}`,
    sectionB1Content: data.sectionB1Content !== undefined ? data.sectionB1Content : DEFAULT_SECTION_B1_TEXT,
    sectionB2StartLesson: data.sectionB2StartLesson ?? 8,
    sectionB2EndLesson: data.sectionB2EndLesson ?? 10,
    sectionB2Weeks: data.sectionB2Weeks && data.sectionB2Weeks.length > 0 ? data.sectionB2Weeks : DEFAULT_SECTION_B2_WEEKS,
    sectionB2Content: data.sectionB2Content || 'Kế hoạch ôn tập 4 tuần',
    sectionBContent: data.sectionBContent || `${data.sectionB1Content || DEFAULT_SECTION_B1_TEXT}\n\nKế hoạch ôn tập 4 tuần bổ trợ tại nhà`,
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
