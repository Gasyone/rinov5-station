import type {
  DropRecord,
  SalesCycle,
  OpsHandoffInfo,
  CareInteraction,
} from '@/components/screens/crm-leads/detail/crmLeadDetailTypes'

export type LeadStatus =
  // Standardized Lifecycle Pipeline
  | 'moi_tiep_nhan'
  | 'dang_tu_van'
  | 'hen_trai_nghiem'
  | 'cho_chot'
  | 'chuyen_doi'
  | 'that_bai'
  | 'tam_dung'
  // Backward compatibility legacy statuses
  | 'chua_tiep_can'
  | 'dang_cham_soc'
  | 'danh_gia_trai_nghiem'
  | 'tiem_nang'


export interface LeadChild {
  id: string
  name: string
  age: number
  birthYear?: number
  targetSubject: string
  notes?: string
}

export interface HistoricalTestRecord {
  id: string
  cycleTitle?: string
  date: string
  time?: string
  branch?: string
  score: string
  resultLevel: string
  teacherName: string
  status: 'completed' | 'no_show' | 'cancelled' | 'scheduled'
  notes?: string
}

export interface HistoricalTrialRecord {
  id: string
  cycleTitle?: string
  date: string
  time?: string
  className: string
  branch?: string
  teacherName?: string
  status: 'completed' | 'no_show' | 'cancelled' | 'scheduled'
  feedback?: string
}

export interface HistoricalOrderRecord {
  orderCode: string
  orderDate: string
  packageName: string
  amount: string
  status: 'paid' | 'partial' | 'refunded'
  paymentTerm: string
}

export interface LeadPackage {
  id: string
  name: string
  amount: string
  duration?: string
  subject?: string
}

export interface Lead {
  id: string
  code: string
  studentName: string // Tên Học viên làm chủ thể của Lead
  studentAge: number
  birthYear?: number
  targetSubject: string // Chương trình học sinh quan tâm
  parentId: string // Mã định danh Phụ huynh
  parentName: string // Tên Phụ huynh đại diện
  parentRole?: string // Mẹ / Bố / Người giám hộ
  phone: string
  address: string
  email?: string
  familySiblings?: string[] // Danh sách các anh chị em khác cùng Phụ huynh
  source: 'facebook' | 'hotline' | 'event' | 'referral' | 'website'
  status: LeadStatus
  subStatus?: string // Trạng thái phụ
  assignedTo: string
  branch: string
  createdAt: string
  slaDeadline?: string // Hạn SLA xử lý theo trạng thái
  lastNote?: string

  // Thông tin Lead quay lại (Returning Lead) & Lịch sử khảo sát trước
  isReturningLead?: boolean
  returningReason?: string
  previousTest?: HistoricalTestRecord
  previousTrial?: HistoricalTrialRecord
  testHistory?: HistoricalTestRecord[]
  trialHistory?: HistoricalTrialRecord[]
  previousOrders?: HistoricalOrderRecord[]

  // Chi tiết buổi Test / Đánh giá năng lực
  initialLevel?: string // Trình độ ban đầu khi tạo test
  testStatus?: 'scheduled' | 'completed' | 'no_show'
  testDate?: string
  testTime?: string
  testBranch?: string
  testResultLevel?: string
  testScore?: string
  testerTeacherName?: string // Tên Giáo viên phỏng vấn/test

  // Chi tiết Lớp học thử
  trialStatus?: 'scheduled' | 'completed' | 'no_show'
  trialClassName?: string
  trialDate?: string
  trialTime?: string
  trialFeedback?: string

  // Thông tin Cơ hội bán hàng & Đơn hàng đăng ký (Opportunity Deal & Order Info)
  orderCode?: string // Mã đơn hàng (e.g. OD-9230)
  orderDate?: string // Ngày tạo đơn hàng (e.g. 10/08/2026 hoặc 2026-08-10)
  orderStatus?: 'unpaid' | 'pending_payment' | 'paid' | 'partial' | 'draft'
  paymentTerm?: string // Lần thanh toán e.g. Cọc 50%, Đã cọc 5 triệu, Thanh toán 100%, Chưa cọc
  expectedPackage?: string
  expectedAmount?: string
  winProbability?: number // % Khả năng chốt đơn
  packages?: LeadPackage[] // Danh sách các gói học học viên đăng ký trong đơn hàng

  // Mở rộng: Quản lý Vòng đời đa chu kỳ, Điểm rơi & Bàn giao Vận hành
  salesCycles?: SalesCycle[]
  currentCycleId?: string
  dropRecord?: DropRecord
  opsHandoff?: OpsHandoffInfo
  careInteractions?: CareInteraction[]

  // Thông tin mở rộng từ Form tạo khách hàng
  trainingType?: string
  industryGroup?: string
  productGroup?: string
  marketingStaff?: string
  schoolName?: string
  academicAbility?: string
  studentPhone?: string
  vuihocAccount?: string
  province?: string
  district?: string
  ward?: string
  streetAddress?: string
  mapLink?: string
  ordersCount?: number
  totalSpend?: string
  otherParents?: {
    name: string
    phone: string
    role: string
    email?: string
    occupation?: string
    financialSegment?: string
    budgetPerMonth?: string
    decisionMakerRole?: string
    preferredContactMethod?: string
    bestTimeToCall?: string
    parentExpectation?: string
    parentPainPoint?: string
    parentPersonalityNote?: string
    preferredChannel?: string
    zaloStatus?: string
    address?: string
    note?: string
  }[]
  otherChildren?: { name: string; birthYear?: number; age?: number; school?: string; targetSubject?: string }[]

  // ========================================================
  // CHÂN DUNG PHỤ HUYNH (Buyer / Parent Persona)
  // ========================================================
  parentOccupation?: string // Nghề nghiệp, đơn vị công tác
  financialSegment?: string // Phân khúc: Tiêu chuẩn, Khá giả, VIP cao cấp
  budgetPerMonth?: string // Ngân sách dự kiến/tháng cho giáo dục
  decisionMakerRole?: string // Người quyết định tài chính: Mẹ toàn quyền, Bố duyệt, Bố mẹ đồng thuận
  preferredContactMethod?: string // Kênh ưu tiên: Zalo, Gọi điện, Gặp trực tiếp
  bestTimeToCall?: string // Giờ vàng tiếp cận: Sau 18h, Giờ trưa 11h30-13h, Giờ hành chính
  parentExpectation?: string // Kỳ vọng lớn nhất với Rino
  parentPainPoint?: string // Nỗi đau / Rào cản lớn nhất của phụ huynh
  parentPersonalityNote?: string // Ghi chú tâm lý & phong cách giao tiếp của phụ huynh

  // ========================================================
  // CHÂN DUNG HỌC VIÊN (Student / Learner Profile)
  // ========================================================
  studentEnglishName?: string // Tên tiếng Anh của bé (Alex, Jenny...)
  studentGender?: 'Nam' | 'Nữ' // Giới tính
  studentCurrentGrade?: string // Khối lớp học trên trường (Lớp 3, Lớp 7...)
  studentStrengths?: string // Điểm mạnh năng lực & phản xạ
  studentWeaknesses?: string // Điểm cần cải thiện & hạn chế
  studentPersonality?: string // Tính cách của con (Hướng ngoại, nhút nhát, hiếu động...)
  studentInterests?: string // Sở thích cá nhân (Vẽ tranh, Lego, Roblox, thể thao...)
  studentLearningStyle?: string // Phong cách tiếp thu (Trực quan, Vận động tương tác, Âm nhạc...)
  studentLearningGoal?: string // Mục tiêu học tập cụ thể của con
}



export const mockLeads: Lead[] = [
  {
    id: 'lead-001',
    code: 'LD-10291-A',
    studentName: 'Bé An',
    studentAge: 8,
    birthYear: 2018,
    targetSubject: 'Anh văn Nhi đồng (SuperKids)',
    parentId: 'par-001',
    parentName: 'Nguyễn Thu Hà',
    parentRole: 'Mẹ',
    phone: '0912345678',
    address: 'Phường Bến Nghé, Quận 1, TP.HCM',
    email: 'thu.ha@gmail.com',
    familySiblings: ['Bé Bình (12t)'],
    otherParents: [
      {
        name: 'Trần Văn Sơn',
        role: 'Bố',
        phone: '091161999',
        email: 'vanson.tran@example.com',
        occupation: 'Kỹ sư Xây dựng - Vinaconex',
        preferredChannel: 'Ưu tiên Gọi điện',
        zaloStatus: 'Chưa kết bạn Zalo',
        address: 'Phường Bến Nghé, Quận 1, TP.HCM',
        note: 'Bố hay đi công tác xa, chỉ gọi vào buổi tối sau 19h00 khi cần trao đổi gấp.',
      },
      {
        name: 'Hoàng Thị Lan',
        role: 'Bà ngoại',
        phone: '0903123888',
        email: 'lan.hoang@gmail.com',
        occupation: 'Cán bộ hưu trí ngành Giáo dục',
        preferredChannel: 'Ưu tiên Gọi điện',
        zaloStatus: 'Đã kết bạn Zalo',
        address: 'Phường Bến Nghé, Quận 1, TP.HCM',
        note: 'Bà ngoại thường đưa đón bé vào các buổi chiều; liên hệ khi bố mẹ đang bận họp.',
      },
    ],
    source: 'facebook',
    status: 'danh_gia_trai_nghiem',
    subStatus: 'Đang hẹn test lại (Đợt 2)',
    assignedTo: 'Trần Thị Mai (Sales)',
    branch: 'RinoEdu Linh Đàm',
    createdAt: '2026-08-10',
    lastNote: 'Phụ huynh liên hệ lại sau 6 tháng hoãn, đã hẹn test lại để xếp vào lớp SuperKids Level 2.',
    isReturningLead: true,
    returningReason: 'Quay lại sau 6 tháng hoãn nhập học (Từng test đợt 1 đạt 78/100, học thử SK-01)',
    initialLevel: 'SuperKids Level 1 (Test đợt 1 đạt 78/100)',
    schoolName: 'Tiểu học Lương Định Của (Quận 3)',
    academicAbility: 'Giỏi / Tốt nghiệp loại Ưu',
    vuihocAccount: 'vh_an_2018',

    // Chân dung Phụ huynh (Buyer Persona)
    parentOccupation: 'Kế toán trưởng - FPT Software',
    financialSegment: 'Khá giả (Thu nhập > 40 triệu/tháng)',
    budgetPerMonth: '3.000.000đ - 5.000.000đ/tháng',
    decisionMakerRole: 'Mẹ toàn quyền quyết định tài chính & chương trình',
    preferredContactMethod: 'Ưu tiên Zalo trong giờ hành chính',
    bestTimeToCall: '12h00 - 13h30 hoặc sau 18h30 (Không nghe số lạ buổi sáng)',
    parentExpectation: 'Con tự tin phản xạ giao tiếp tự nhiên, phát âm chuẩn quốc tế và lấy chứng chỉ Starters/Movers',
    parentPainPoint: 'Trước đây học trung tâm cũ sĩ số đông (18-20 bé), giáo viên ít tương tác nên con bị nhút nhát và sợ nói',
    parentPersonalityNote: 'Mẹ rất kỹ tính, chu đáo; thích xem số liệu minh bạch, báo cáo tiến độ học tập hàng tuần; thích trao đổi qua Zalo có hình ảnh lớp',

    // Chân dung Học viên (Student Learner Profile)
    studentEnglishName: 'Alex',
    studentGender: 'Nam',
    studentCurrentGrade: 'Lớp 3 - Trường Tiểu học Đinh Tiên Hoàng',
    studentStrengths: 'Ghi nhớ từ vựng qua hình ảnh cực nhanh, phát âm âm đuôi chuẩn, hào hứng khi chơi game thi đua',
    studentWeaknesses: 'Còn ngại nói câu dài khi đứng trước đám đông, viết chính tả hay quên mạo từ (a/an/the)',
    studentPersonality: 'Ngoan ngoãn, thích được khen ngợi, ban đầu hơi nhút nhát nhưng khi hòa nhập sẽ rất năng nổ',
    studentInterests: 'Mê lắp ráp Lego Technic, thích vẽ truyện tranh và xem phim hoạt hình tiếng Anh Paw Patrol',
    studentLearningStyle: 'Trực quan (Visual) & Vận động (Kinesthetic) - Thích học qua flashcard hình ảnh và minigame tương tác',
    studentLearningGoal: 'Tự tin thuyết trình tiếng Anh 3 phút trước lớp, đạt 14/15 khiên Cambridge Starters vào cuối năm học',
    ordersCount: 2,
    totalSpend: '22.500.000đ',
    trainingType: 'Tự học',
    industryGroup: 'Tiểu học',
    productGroup: 'Tiếng Anh Thiếu Nhi',
    marketingStaff: 'Nguyễn Thị Lan (Marketing)',
    testStatus: 'scheduled',
    testDate: '15/08/2026',
    testTime: '18:00',
    testBranch: 'RinoEdu Linh Đàm',
    testerTeacherName: 'Thầy Alex',
    trialStatus: 'scheduled',
    trialClassName: 'SK-02',
    trialDate: '16/08/2026',
    trialTime: '19:00',
    orderCode: 'OD-9230',
    orderStatus: 'partial',
    paymentTerm: 'Cọc 50%',
    expectedPackage: 'Gói SuperKids 12T',
    expectedAmount: '22.500.000đ',
    winProbability: 75,
    packages: [
      {
        id: 'pkg-001',
        name: 'Gói SuperKids 12T',
        amount: '18.000.000đ',
        duration: '12 tháng (96 buổi)',
        subject: 'Anh văn Nhi đồng (SuperKids)',
      },
      {
        id: 'pkg-002',
        name: 'Gói Kỹ năng Thuyết trình 3T',
        amount: '4.500.000đ',
        duration: '3 tháng (24 buổi)',
        subject: 'Kỹ năng mềm & Thuyết trình',
      },
    ],
    previousTest: {
      id: 'test-001-1',
      cycleTitle: 'Đợt 1 (15/02/2026)',
      date: '15/02/2026',
      time: '18:00',
      branch: 'RinoEdu Linh Đàm',
      score: '78/100',
      resultLevel: 'SuperKids Level 1 (Starters)',
      teacherName: 'Cô Emma',
      status: 'completed',
      notes: 'Bé phản xạ nghe nói tự nhiên, từ vựng cơ bản tốt, phát âm chuẩn nhưng còn rụt rè khi nói câu dài.',
    },
    testHistory: [
      {
        id: 'test-001-1',
        cycleTitle: 'Đợt 1 (15/02/2026 - Chu kỳ 1)',
        date: '15/02/2026',
        time: '18:00',
        branch: 'RinoEdu Linh Đàm',
        score: '78/100',
        resultLevel: 'SuperKids Level 1 (Starters)',
        teacherName: 'Cô Emma',
        status: 'completed',
        notes: 'Bé phản xạ nghe nói tự nhiên, từ vựng cơ bản tốt, phát âm chuẩn nhưng còn rụt rè khi nói câu dài.',
      },
      {
        id: 'test-001-2',
        cycleTitle: 'Đợt 2 (15/08/2026 - Chu kỳ 2)',
        date: '15/08/2026',
        time: '18:00',
        branch: 'RinoEdu Linh Đàm',
        score: 'Chờ đánh giá',
        resultLevel: 'Mục tiêu: SuperKids Level 2',
        teacherName: 'Thầy Alex',
        status: 'scheduled',
        notes: 'Đánh giá lại sự phát triển sau 6 tháng để xếp thẳng vào lớp SuperKids Level 2.',
      },
    ],
    previousTrial: {
      id: 'trial-001-1',
      cycleTitle: 'Chu kỳ 1 (T02/2026)',
      date: '18/02/2026',
      time: '19:00',
      className: 'SK-01',
      branch: 'RinoEdu Linh Đàm',
      teacherName: 'Thầy Alex',
      status: 'completed',
      feedback: 'Bé tiếp thu nhanh, hòa nhập hào hứng với bạn bè. Phụ huynh rất hài lòng nhưng xin hoãn nhập học vì chuyển nhà.',
    },
    trialHistory: [
      {
        id: 'trial-001-1',
        cycleTitle: 'Đợt 1 (18/02/2026)',
        date: '18/02/2026',
        time: '19:00',
        className: 'SK-01',
        branch: 'RinoEdu Linh Đàm',
        teacherName: 'Thầy Alex',
        status: 'completed',
        feedback: 'Bé tiếp thu nhanh, hòa nhập hào hứng với bạn bè. Phụ huynh rất hài lòng nhưng xin hoãn nhập học vì chuyển nhà.',
      },
      {
        id: 'trial-001-2',
        cycleTitle: 'Đợt 2 (16/08/2026)',
        date: '16/08/2026',
        time: '19:00',
        className: 'SK-02',
        branch: 'RinoEdu Linh Đàm',
        teacherName: 'Cô Sarah',
        status: 'scheduled',
      },
    ],
    previousOrders: [
      {
        orderCode: 'OD-7820',
        orderDate: '19/02/2026',
        packageName: 'Cọc giữ suất Ưu đãi Khai giảng SuperKids',
        amount: '2.500.000đ',
        status: 'paid',
        paymentTerm: 'Đã cọc 2.5 triệu',
      },
    ],
    salesCycles: [
      {
        cycleId: 'cycle-001-2',
        cycleNumber: 2,
        title: 'Chu kỳ 2 (T08/2026 - Tái tiếp cận / Năm học mới)',
        status: 'active',
        startDate: '10/08/2026',
        assignedSales: 'Trần Thị Mai (Sales)',
      },
      {
        cycleId: 'cycle-001-1',
        cycleNumber: 1,
        title: 'Chu kỳ 1 (T02/2026 - Hoãn kỳ do sửa nhà)',
        status: 'dropped',
        startDate: '10/02/2026',
        endDate: '22/02/2026',
        assignedSales: 'Lê Hoàng Nam (Sales)',
        outcomeNote: 'Đã test đợt 1 đạt 78/100, học thử SK-01. Gia đình hoãn vì chuyển nhà và sửa chữa, xin bảo lưu kết quả 6 tháng.',
      },
    ],
    currentCycleId: 'cycle-001-2',
    careInteractions: [
      {
        id: 'care-101',
        cycleId: 'cycle-001-2',
        timestamp: '11/08/2026 10:30',
        staffName: 'Trần Thị Mai (Sales)',
        channel: 'call',
        outcome: 'booked_test',
        outcomeLabel: 'Đặt lịch test năng lực đợt 2',
        note: 'Phụ huynh đồng ý cho bé An tham gia bài test lại Thứ 7 lúc 18:00 để kiểm tra sự tiến bộ và xếp vào lớp SuperKids Level 2.',
        nextAppointment: '15/08/2026 18:00',
      },
      {
        id: 'care-102',
        cycleId: 'cycle-001-2',
        timestamp: '10/08/2026 15:45',
        staffName: 'Trần Thị Mai (Sales)',
        channel: 'call',
        outcome: 'interested',
        outcomeLabel: 'Nghe máy quan tâm (Lead quay lại)',
        note: 'Mẹ chủ động gọi lại Hotline sau kỳ nghỉ hè. Gia đình đã ổn định nhà cửa, muốn kích hoạt lại hồ sơ để bé An và anh trai (Bé Bình) cùng đi học.',
      },
      {
        id: 'care-103',
        cycleId: 'cycle-001-1',
        timestamp: '22/02/2026 16:00',
        staffName: 'Lê Hoàng Nam (Sales)',
        channel: 'call',
        outcome: 'rejected',
        outcomeLabel: 'Hoãn nhập học (Chu kỳ 1)',
        note: 'Phụ huynh báo gia đình bắt đầu sửa nhà và bé chuyển trường tiểu học, xin bảo lưu kết quả test đợt 1 (78 điểm) và tiền cọc 2.5 triệu đến đầu năm học mới (T8/2026).',
      },
      {
        id: 'care-104',
        cycleId: 'cycle-001-1',
        timestamp: '18/02/2026 20:15',
        staffName: 'Lê Hoàng Nam (Sales)',
        channel: 'call',
        outcome: 'interested',
        outcomeLabel: 'Chăm sóc sau học thử SK-01',
        note: 'Mẹ khen bé An rất thích Thầy Alex, về nhà hào hứng kể chuyện với bố. Đã hướng dẫn mẹ cọc giữ chỗ 2.5 triệu.',
      },
      {
        id: 'care-105',
        cycleId: 'cycle-001-1',
        timestamp: '15/02/2026 19:00',
        staffName: 'Lê Hoàng Nam (Sales)',
        channel: 'call',
        outcome: 'interested',
        outcomeLabel: 'Báo điểm test đợt 1 (78/100)',
        note: 'Cô Emma đánh giá bé có phản xạ nghe nói tốt, đủ điều kiện vào SuperKids Level 1. Đã hẹn lịch học thử lớp SK-01 vào 18/02.',
      },
      {
        id: 'care-106',
        cycleId: 'cycle-001-1',
        timestamp: '10/02/2026 14:00',
        staffName: 'Lê Hoàng Nam (Sales)',
        channel: 'zalo',
        outcome: 'interested',
        outcomeLabel: 'Tiếp nhận lead lần đầu',
        note: 'Tiếp nhận nhu cầu từ kênh Facebook Ads, đã kết bạn Zalo với mẹ Thu Hà và gửi lộ trình SuperKids.',
      },
    ],
  },
  {
    id: 'lead-002',
    code: 'LD-10291-B',
    studentName: 'Bé Bình',
    studentAge: 12,
    birthYear: 2014,
    targetSubject: 'Luyện thi Flyers',
    parentId: 'par-001',
    parentName: 'Nguyễn Thu Hà',
    parentRole: 'Mẹ',
    phone: '0912345678',
    address: 'Phường Bến Nghé, Quận 1, TP.HCM',
    email: 'thu.ha@gmail.com',
    familySiblings: ['Bé An (8t)'],
    source: 'facebook',
    status: 'danh_gia_trai_nghiem',
    subStatus: 'Đã test đợt 2 (Level B2)',
    assignedTo: 'Trần Thị Mai (Sales)',
    branch: 'RinoEdu Linh Đàm',
    createdAt: '2026-08-10',
    lastNote: 'Đã test đầu vào đợt 2 xong đạt trình độ Flyers Level B2 (88/100), tiến bộ rõ so với đợt 1 (72/100).',
    isReturningLead: true,
    returningReason: 'Từng test đợt 1 (T12/2025: 72/100 Flyers A2), quay lại cùng em gái và test đợt 2 đạt 88/100 Flyers B2',
    initialLevel: 'Flyers Level A2 (Test đợt 1 đạt 72/100)',
    schoolName: 'THCS Nguyễn Du (Quận 1)',
    academicAbility: 'Giỏi Tiếng Anh',
    vuihocAccount: 'vh_binh_2014',
    ordersCount: 1,
    totalSpend: '5.000.000đ',
    testStatus: 'completed',
    testDate: '11/08/2026',
    testResultLevel: 'Flyers Level B2',
    testScore: '88/100',
    testerTeacherName: 'Cô Emma',
    trialStatus: 'completed',
    trialClassName: 'FL-INT',
    trialDate: '12/08/2026',
    trialFeedback: 'Bé tiếp thu nhanh, tương tác tốt với GV bản ngữ',
    orderCode: 'OD-9231',
    orderStatus: 'pending_payment',
    paymentTerm: 'Đã cọc 5 triệu',
    expectedPackage: 'Gói Flyers Intensive 6T',
    expectedAmount: '31.500.000đ',
    winProbability: 90,
    packages: [
      {
        id: 'pkg-003',
        name: 'Gói Flyers Intensive 6T',
        amount: '22.000.000đ',
        duration: '6 tháng (48 buổi)',
        subject: 'Luyện thi Flyers',
      },
      {
        id: 'pkg-004',
        name: 'Gói Luyện đề Cambridge 1-1',
        amount: '6.000.000đ',
        duration: '10 buổi',
        subject: 'Gia sư 1-1 Luyện đề',
      },
      {
        id: 'pkg-005',
        name: 'Gói Phát âm chuẩn IPA',
        amount: '3.500.000đ',
        duration: '1 tháng (8 buổi)',
        subject: 'Phát âm chuyên sâu',
      },
    ],
    previousTest: {
      id: 'test-002-1',
      cycleTitle: 'Đợt 1 (10/12/2025)',
      date: '10/12/2025',
      time: '17:30',
      branch: 'RinoEdu Linh Đàm',
      score: '72/100',
      resultLevel: 'Flyers Level A2',
      teacherName: 'Thầy David',
      status: 'completed',
      notes: 'Ngữ pháp tốt, vốn từ khá, cần rèn luyện thêm kỹ năng Writing và phản xạ Speaking.',
    },
    testHistory: [
      {
        id: 'test-002-1',
        cycleTitle: 'Đợt 1 (10/12/2025 - Chu kỳ 1)',
        date: '10/12/2025',
        time: '17:30',
        branch: 'RinoEdu Linh Đàm',
        score: '72/100',
        resultLevel: 'Flyers Level A2',
        teacherName: 'Thầy David',
        status: 'completed',
        notes: 'Ngữ pháp tốt, vốn từ khá, cần rèn luyện thêm kỹ năng Writing và phản xạ Speaking.',
      },
      {
        id: 'test-002-2',
        cycleTitle: 'Đợt 2 (11/08/2026 - Chu kỳ 2)',
        date: '11/08/2026',
        time: '18:00',
        branch: 'RinoEdu Linh Đàm',
        score: '88/100',
        resultLevel: 'Flyers Level B2',
        teacherName: 'Cô Emma',
        status: 'completed',
        notes: 'Tiến bộ vượt bậc sau tự ôn luyện, tự tin giao tiếp, ngữ pháp chuẩn xác.',
      },
    ],
    previousTrial: {
      id: 'trial-002-1',
      cycleTitle: 'Chu kỳ 1 (T12/2025)',
      date: '12/12/2025',
      time: '18:00',
      className: 'FL-A1',
      branch: 'RinoEdu Linh Đàm',
      teacherName: 'Thầy David',
      status: 'completed',
      feedback: 'Bé nắm vững bài, nhưng gia đình hoãn nhập học để bé thi học kỳ I ở trường.',
    },
    salesCycles: [
      {
        cycleId: 'cycle-002-2',
        cycleNumber: 2,
        title: 'Chu kỳ 2 (T08/2026 - Luyện thi Chuyên sâu Flyers)',
        status: 'active',
        startDate: '10/08/2026',
        assignedSales: 'Trần Thị Mai (Sales)',
      },
      {
        cycleId: 'cycle-002-1',
        cycleNumber: 1,
        title: 'Chu kỳ 1 (T12/2025 - Hoãn đăng ký)',
        status: 'dropped',
        startDate: '05/12/2025',
        endDate: '20/12/2025',
        assignedSales: 'Lê Hoàng Nam (Sales)',
        outcomeNote: 'Đã test đợt 1 (72 điểm). Gia đình tạm hoãn để bé tập trung thi học kỳ I ở trường.',
      },
    ],
    currentCycleId: 'cycle-002-2',
  },
  {
    id: 'lead-003',
    code: 'LD-10292',
    studentName: 'Bé Minh',
    studentAge: 6,
    birthYear: 2020,
    targetSubject: 'Anh văn Mẫu giáo (Kindy)',
    parentId: 'par-002',
    parentName: 'Trần Văn Nam',
    parentRole: 'Bố',
    phone: '0987654321',
    address: 'Phường Đa Kao, Quận 1, TP.HCM',
    email: 'nam.tran@yahoo.com',
    source: 'hotline',
    status: 'chua_tiep_can',
    assignedTo: '',
    branch: 'RinoEdu Linh Đàm',
    createdAt: '2026-08-11',
    lastNote: 'Phụ huynh vừa gọi Hotline hỏi học phí lớp Kindy, chưa có Sale tiếp nhận.',
    expectedPackage: 'Gói Kindy 6T',
    expectedAmount: '12.500.000đ',
    winProbability: 30,
  },
  {
    id: 'lead-004',
    code: 'LD-10293-A',
    studentName: 'Bé Đức',
    studentAge: 10,
    birthYear: 2016,
    targetSubject: 'Anh văn Thiếu nhi (Movers)',
    parentId: 'par-003',
    parentName: 'Phạm Thị Bích',
    parentRole: 'Mẹ',
    phone: '0933112233',
    address: 'Phường Dịch Vọng, Cầu Giấy, Hà Nội',
    email: 'bich.pham@outlook.com',
    familySiblings: ['Bé Linh (7t)'],
    source: 'referral',
    status: 'tiem_nang',
    assignedTo: 'Trần Thị Mai (Sales)',
    branch: 'RinoEdu Nguyễn Tuân',
    createdAt: '2026-08-09',
    lastNote: 'Đã làm thủ tục hẹn nộp tiền mặt ngày 14/08 tại trung tâm.',
    testStatus: 'completed',
    testDate: '10/08/2026',
    testResultLevel: 'Movers Level 3',
    testScore: '90/100',
    testerTeacherName: 'Thầy David',
    trialStatus: 'completed',
    trialClassName: 'MOV-01',
    trialDate: '11/08/2026',
    trialFeedback: 'PH rất hài lòng với môi trường học',
    orderCode: 'OD-9232',
    orderStatus: 'pending_payment',
    paymentTerm: 'Hẹn nộp 100%',
    expectedPackage: 'Gói Movers Bán Trú 1N',
    expectedAmount: '28.000.000đ',
    winProbability: 95,
  },
  {
    id: 'lead-005',
    code: 'LD-10293-B',
    studentName: 'Bé Linh',
    studentAge: 7,
    birthYear: 2019,
    targetSubject: 'Anh văn Nhi đồng (Starters)',
    parentId: 'par-003',
    parentName: 'Phạm Thị Bích',
    parentRole: 'Mẹ',
    phone: '0933112233',
    address: 'Phường Dịch Vọng, Cầu Giấy, Hà Nội',
    email: 'bich.pham@outlook.com',
    familySiblings: ['Bé Đức (10t)'],
    source: 'referral',
    status: 'dang_cham_soc',
    assignedTo: 'Trần Thị Mai (Sales)',
    branch: 'RinoEdu Nguyễn Tuân',
    createdAt: '2026-08-09',
    lastNote: 'Sale Mai đã gọi lần 1 tư vấn lộ trình học song song cùng anh trai.',
    trialStatus: 'scheduled',
    trialClassName: 'STA-04',
    trialDate: '17/08/2026',
    trialTime: '17:30',
    orderCode: 'OD-9233',
    orderStatus: 'unpaid',
    paymentTerm: 'Chưa cọc',
    expectedPackage: 'Gói Starters 6T',
    expectedAmount: '14.000.000đ',
    winProbability: 50,
  },
  {
    id: 'lead-006',
    code: 'LD-10294',
    studentName: 'Bé Bảo',
    studentAge: 14,
    birthYear: 2012,
    targetSubject: 'Luyện thi IELTS Junior',
    parentId: 'par-004',
    parentName: 'Hoàng Quốc Việt',
    parentRole: 'Bố',
    phone: '0908889999',
    address: 'Phường Tân Định, Quận 1, TP.HCM',
    email: 'viet.hoang@company.com',
    source: 'event',
    status: 'chuyen_doi',
    assignedTo: 'Trần Thị Mai (Sales)',
    branch: 'RinoEdu Linh Đàm',
    createdAt: '2026-08-05',
    lastNote: 'Phụ huynh đã thu 100% học phí trọn gói 6 tháng cho bé Bảo.',
    testStatus: 'completed',
    testDate: '06/08/2026',
    testResultLevel: 'IELTS Target 6.0',
    testScore: '92/100',
    testerTeacherName: 'Thầy Mark',
    trialStatus: 'completed',
    trialClassName: 'IELTS-JR01',
    trialDate: '07/08/2026',
    trialFeedback: 'Đã vào học chính thức',
    orderCode: 'OD-9234',
    orderStatus: 'paid',
    paymentTerm: 'Thanh toán 100%',
    expectedPackage: 'Gói IELTS Junior 1N',
    expectedAmount: '38.000.000đ',
    winProbability: 100,
    packages: [
      {
        id: 'pkg-007',
        name: 'Gói IELTS Junior 1N',
        amount: '35.000.000đ',
        duration: '1 năm (96 buổi)',
        subject: 'Luyện thi IELTS Junior',
      },
      {
        id: 'pkg-008',
        name: 'Gói Thi thử Mock Test 4 kỹ năng',
        amount: '3.000.000đ',
        duration: '5 lượt thi chuẩn IDP/BC',
        subject: 'Thi thử & Đánh giá năng lực',
      },
    ],
    salesCycles: [
      {
        cycleId: 'cycle-006-1',
        cycleNumber: 1,
        title: 'Chu kỳ 1 (T08/2026)',
        status: 'converted',
        startDate: '05/08/2026',
        endDate: '08/08/2026',
        assignedSales: 'Trần Thị Mai (Sales)',
        outcomeNote: 'Đã thu 100% học phí gói 1 năm. Bàn giao học vụ xếp lớp.',
      },
    ],
    currentCycleId: 'cycle-006-1',
    opsHandoff: {
      isHandoffCompleted: true,
      studentCode: 'HV-2026-088',
      enrolledDate: '08/08/2026',
      currentClass: 'IELTS-JR01',
      className: 'IELTS Junior Target 6.0 - Khóa T8',
      academicOfficer: 'Cô Hoàng Yến (Giáo vụ)',
      teacherName: 'Thầy Mark & Trợ giảng Lan',
      attendanceRate: '95%',
      sessionsLearned: '8/96 buổi',
      academicStatus: 'studying',
      daysInactive: 0,
      lastActivityDate: '24/08/2026',
      canReactivate: false,
    },
    careInteractions: [
      {
        id: 'care-601',
        cycleId: 'cycle-006-1',
        timestamp: '08/08/2026 11:20',
        staffName: 'Trần Thị Mai (Sales)',
        channel: 'direct',
        outcome: 'interested',
        outcomeLabel: 'Thanh toán thành công',
        note: 'Phụ huynh đến trung tâm nộp 100% học phí 38 triệu. Đã hoàn tất thủ tục bàn giao học sinh sang Ban Giáo Vụ.',
      },
      {
        id: 'care-602',
        cycleId: 'cycle-006-1',
        timestamp: '06/08/2026 19:30',
        staffName: 'Trần Thị Mai (Sales)',
        channel: 'call',
        outcome: 'interested',
        outcomeLabel: 'Báo điểm test năng lực',
        note: 'Báo điểm test 92/100, phụ huynh rất hài lòng và quyết định đăng ký gói 1 năm.',
      },
    ],
  },
  {
    id: 'lead-007',
    code: 'LD-10295',
    studentName: 'Bé Vy',
    studentAge: 9,
    birthYear: 2017,
    targetSubject: 'Anh văn Giao tiếp',
    parentId: 'par-005',
    parentName: 'Đặng Thanh Thủy',
    parentRole: 'Mẹ',
    phone: '0977665544',
    address: 'Phường Nghĩa Tân, Cầu Giấy, Hà Nội',
    source: 'website',
    status: 'that_bai',
    assignedTo: 'Trần Thị Mai (Sales)',
    branch: 'RinoEdu Nguyễn Tuân',
    createdAt: '2026-08-01',
    lastNote: 'Vắng test (No-show), gọi lại phụ huynh báo nhà xa cơ sở không đi được.',
    testStatus: 'no_show',
    testDate: '03/08/2026',
    testerTeacherName: 'Cô Sophia',
    trialStatus: 'no_show',
    trialClassName: 'GT-01',
    trialDate: '04/08/2026',
    expectedPackage: 'Gói Giao Tiếp 3T',
    expectedAmount: '8.000.000đ',
    winProbability: 0,
    salesCycles: [
      {
        cycleId: 'cycle-007-1',
        cycleNumber: 1,
        title: 'Chu kỳ 1 (T08/2026)',
        status: 'dropped',
        startDate: '01/08/2026',
        endDate: '04/08/2026',
        assignedSales: 'Trần Thị Mai (Sales)',
        outcomeNote: 'Rớt tại chặng tư vấn do nhà xa cơ sở.',
      },
    ],
    currentCycleId: 'cycle-007-1',
    dropRecord: {
      stageId: 'dang_tu_van',
      stageLabel: 'Chặng 2: Đang tư vấn',
      reasonId: 'DROP_LOCATION_FAR',
      reasonLabel: 'Nhà quá xa cơ sở, không tiện đưa đón',
      droppedAt: '04/08/2026 16:30',
      droppedBy: 'Trần Thị Mai (Sales)',
      note: 'Gia đình chuyển nhà về ngoại thành nên không thể đưa đón học trực tiếp.',
      reCareDate: '15/11/2026',
    },
    careInteractions: [
      {
        id: 'care-701',
        cycleId: 'cycle-007-1',
        timestamp: '04/08/2026 16:30',
        staffName: 'Trần Thị Mai (Sales)',
        channel: 'call',
        outcome: 'rejected',
        outcomeLabel: 'Báo rớt (Nhà xa)',
        note: 'Gọi điện xác nhận lịch hẹn bù, phụ huynh xin hủy vì chuyển nhà về ngoại thành.',
      },
      {
        id: 'care-702',
        cycleId: 'cycle-007-1',
        timestamp: '03/08/2026 18:30',
        staffName: 'Trần Thị Mai (Sales)',
        channel: 'call',
        outcome: 'no_answer',
        outcomeLabel: 'Vắng test (No-show)',
        note: 'Bé không đến test theo lịch, gọi phụ huynh bận máy.',
      },
    ],
  },
  {
    id: 'lead-008',
    code: 'LD-10296',
    studentName: 'Bé Nam',
    studentAge: 11,
    birthYear: 2015,
    targetSubject: 'Anh văn Thiếu niên (Flyers)',
    parentId: 'par-006',
    parentName: 'Vũ Thị Thanh',
    parentRole: 'Mẹ',
    phone: '0966554433',
    address: 'Phường Hàng Bài, Hoàn Kiếm, Hà Nội',
    source: 'website',
    status: 'chua_tiep_can',
    assignedTo: '',
    branch: 'RinoEdu Linh Đàm',
    createdAt: '2026-08-12',
    lastNote: 'Đăng ký tư vấn trực tuyến qua Website, mới về chưa phân Sale.',
    expectedPackage: 'Gói Flyers 6T',
    expectedAmount: '16.000.000đ',
    winProbability: 40,
  },
  {
    id: 'lead-009',
    code: 'LD-10297',
    studentName: 'Bé Quốc',
    studentAge: 9,
    birthYear: 2017,
    targetSubject: 'Anh văn Nhi đồng (SuperKids)',
    parentId: 'par-007',
    parentName: 'Ngô Tấn Tài',
    parentRole: 'Bố',
    phone: '0911223344',
    address: 'Phường Phạm Ngũ Lão, Quận 1, TP.HCM',
    email: 'tai.ngo@gmail.com',
    source: 'facebook',
    status: 'dang_cham_soc',
    assignedTo: 'Trần Thị Mai (Sales)',
    branch: 'RinoEdu Linh Đàm',
    createdAt: '2026-08-11',
    lastNote: 'Sale Mai đã gọi lần 2 và hẹn gọi lại sau 19h tối.',
    isReturningLead: true,
    returningReason: 'Cựu học viên tốt nghiệp khóa SuperKids 1 (>200 ngày inactive), quay lại đăng ký SuperKids 2',
    initialLevel: 'SuperKids Level 1 (Đã tốt nghiệp T01/2026)',
    schoolName: 'Tiểu học Lương Định Của (Quận 3)',
    academicAbility: 'Giỏi / Tốt nghiệp loại Ưu',
    vuihocAccount: 'vh_quoc_2017',
    ordersCount: 2,
    totalSpend: '14.000.000đ',
    trialStatus: 'scheduled',
    trialClassName: 'SK-01',
    trialDate: '18/08/2026',
    trialTime: '18:30',
    orderCode: 'OD-9235',
    orderStatus: 'partial',
    paymentTerm: 'Cọc 2 triệu',
    expectedPackage: 'Gói SuperKids 6T',
    expectedAmount: '11.000.000đ',
    winProbability: 60,
    previousTest: {
      id: 'test-009-1',
      cycleTitle: 'Đợt 1 (05/10/2025)',
      date: '05/10/2025',
      time: '17:30',
      branch: 'RinoEdu Linh Đàm',
      score: '82/100',
      resultLevel: 'SuperKids Level 1',
      teacherName: 'Thầy Alex',
      status: 'completed',
      notes: 'Bé thông minh, tiếp thu kiến thức tốt, đã hoàn thành xuất sắc khóa học đợt 1.',
    },
    testHistory: [
      {
        id: 'test-009-1',
        cycleTitle: 'Đợt 1 (05/10/2025 - Chu kỳ 1)',
        date: '05/10/2025',
        time: '17:30',
        branch: 'RinoEdu Linh Đàm',
        score: '82/100',
        resultLevel: 'SuperKids Level 1',
        teacherName: 'Thầy Alex',
        status: 'completed',
        notes: 'Bé thông minh, tiếp thu kiến thức tốt, đã hoàn thành xuất sắc khóa học đợt 1.',
      },
    ],
    previousTrial: {
      id: 'trial-009-1',
      cycleTitle: 'Chu kỳ 1 (T10/2025)',
      date: '08/10/2025',
      time: '18:30',
      className: 'SK-K15',
      branch: 'RinoEdu Linh Đàm',
      teacherName: 'Thầy Alex',
      status: 'completed',
      feedback: 'Bé Quốc hòa nhập nhanh, phản xạ tốt, đã học chính thức ngay sau buổi thử.',
    },
    previousOrders: [
      {
        orderCode: 'OD-5512',
        orderDate: '15/10/2025',
        packageName: 'Khóa SuperKids 1 (24 buổi)',
        amount: '12.000.000đ',
        status: 'paid',
        paymentTerm: 'Thanh toán 100%',
      },
    ],
    salesCycles: [
      {
        cycleId: 'cycle-009-2',
        cycleNumber: 2,
        title: 'Chu kỳ 2 (T08/2026 - Tái kích hoạt)',
        status: 'active',
        startDate: '11/08/2026',
        assignedSales: 'Trần Thị Mai (Sales)',
      },
      {
        cycleId: 'cycle-009-1',
        cycleNumber: 1,
        title: 'Chu kỳ 1 (T10/2025 - Đã hoàn thành)',
        status: 'converted',
        startDate: '05/10/2025',
        endDate: '20/01/2026',
        assignedSales: 'Lê Hoàng Nam (Sales)',
        outcomeNote: 'Đã hoàn thành khóa SuperKids 1 và tốt nghiệp ngày 20/01/2026.',
      },
    ],
    currentCycleId: 'cycle-009-2',
    opsHandoff: {
      isHandoffCompleted: true,
      studentCode: 'HV-2025-412',
      enrolledDate: '15/10/2025',
      currentClass: 'SK-01 (Đã hoàn thành)',
      className: 'Lớp SuperKids K15',
      academicOfficer: 'Cô Mai Phương (Giáo vụ)',
      teacherName: 'Thầy Alex',
      attendanceRate: '96%',
      sessionsLearned: '24/24 buổi',
      academicStatus: 'graduated',
      daysInactive: 203, // > 180 ngày không học!
      lastActivityDate: '20/01/2026',
      canReactivate: true,
    },
    careInteractions: [
      {
        id: 'care-901',
        cycleId: 'cycle-009-2',
        timestamp: '11/08/2026 14:00',
        staffName: 'Trần Thị Mai (Sales)',
        channel: 'call',
        outcome: 'callback',
        outcomeLabel: 'Bận hẹn gọi lại sau',
        note: 'Bố nghe máy, nhớ trung tâm cũ, hẹn gọi lại sau 19h tối để trao đổi lộ trình khóa SuperKids 2 tiếp nối.',
        nextAppointment: '11/08/2026 19:30',
      },
      {
        id: 'care-900',
        cycleId: 'cycle-009-1',
        timestamp: '20/01/2026 16:30',
        staffName: 'Lê Hoàng Nam (Sales)',
        channel: 'direct',
        outcome: 'interested',
        outcomeLabel: 'Tổng kết khóa học Chu kỳ 1',
        note: 'Bé Quốc hoàn thành xuất sắc khóa SuperKids 1. Gia đình tạm nghỉ về quê, hẹn khi nào sẵn sàng sẽ quay lại.',
      },
    ],
  },
  {
    id: 'lead-010',
    code: 'LD-10298',
    studentName: 'Bé Hà',
    studentAge: 5,
    birthYear: 2021,
    targetSubject: 'Anh văn Mẫu giáo (Kindy)',
    parentId: 'par-008',
    parentName: 'Bùi Phương Thảo',
    parentRole: 'Mẹ',
    phone: '0955443322',
    address: 'Phường Võ Thị Sáu, Quận 3, TP.HCM',
    email: 'thao.bui@hotmail.com',
    source: 'website',
    status: 'tiem_nang',
    assignedTo: 'Trần Thị Mai (Sales)',
    branch: 'RinoEdu Linh Đàm',
    createdAt: '2026-08-12',
    lastNote: 'Phụ huynh giữ chỗ 24h chờ chuyển khoản học phí Kindy.',
    orderCode: 'OD-9236',
    orderStatus: 'pending_payment',
    paymentTerm: 'Giữ chỗ 24h',
    expectedPackage: 'Gói Kindy Mẫu giáo 12T',
    expectedAmount: '20.000.000đ',
    winProbability: 85,
  },
  {
    id: 'lead-011',
    code: 'LD-10299',
    studentName: 'Bé Tuấn',
    studentAge: 10,
    birthYear: 2016,
    targetSubject: 'Anh văn Thiếu nhi (Movers)',
    parentId: 'par-009',
    parentName: 'Lê Văn Hùng',
    parentRole: 'Bố',
    phone: '0918882211',
    address: 'Phường Nguyễn Cư Trinh, Quận 1, TP.HCM',
    email: 'hung.le@gmail.com',
    source: 'facebook',
    status: 'danh_gia_trai_nghiem',
    assignedTo: 'Trần Thị Mai (Sales)',
    branch: 'RinoEdu Linh Đàm',
    createdAt: '2026-08-10',
    lastNote: 'Đã xếp lịch test tuần này, chưa giao GV test đầu vào.',
    testStatus: 'scheduled',
    testDate: '17/08/2026',
    testTime: '17:00',
    testerTeacherName: 'Thầy Alex',
    trialStatus: 'scheduled',
    trialClassName: 'MOV-02',
    trialDate: '19/08/2026',
    orderCode: 'OD-9237',
    orderStatus: 'unpaid',
    paymentTerm: 'Chưa cọc',
    expectedPackage: 'Gói Movers 12T',
    expectedAmount: '17.500.000đ',
    winProbability: 70,
  },
  {
    id: 'lead-012',
    code: 'LD-10300',
    studentName: 'Bé Trang',
    studentAge: 7,
    birthYear: 2019,
    targetSubject: 'Anh văn Nhi đồng (SuperKids)',
    parentId: 'par-010',
    parentName: 'Đỗ Thị Hương',
    parentRole: 'Mẹ',
    phone: '0934445566',
    address: 'Phường Bến Thành, Quận 1, TP.HCM',
    email: 'huong.do@yahoo.com',
    source: 'hotline',
    status: 'danh_gia_trai_nghiem',
    assignedTo: 'Trần Thị Mai (Sales)',
    branch: 'RinoEdu Linh Đàm',
    createdAt: '2026-08-08',
    lastNote: 'Bé Trang đã test đạt SuperKids Level 2 (85/100).',
    testStatus: 'completed',
    testDate: '09/08/2026',
    testResultLevel: 'SuperKids Level 2',
    testScore: '85/100',
    testerTeacherName: 'Cô Emma',
    trialStatus: 'completed',
    trialClassName: 'SK-01',
    trialDate: '10/08/2026',
    trialFeedback: 'Bé hăng hái phát biểu, tự tin giao tiếp',
    orderCode: 'OD-9238',
    orderStatus: 'pending_payment',
    paymentTerm: 'Cọc 50%',
    expectedPackage: 'Gói SuperKids 1N',
    expectedAmount: '16.500.000đ',
    winProbability: 85,
  },
  {
    id: 'lead-013',
    code: 'LD-10301',
    studentName: 'Bé Phúc',
    studentAge: 5,
    birthYear: 2021,
    targetSubject: 'Anh văn Mẫu giáo (Kindy)',
    parentId: 'par-011',
    parentName: 'Nguyễn Thanh Tùng',
    parentRole: 'Bố',
    phone: '0978889900',
    address: 'Phường Thảo Điền, TP. Thủ Đức, TP.HCM',
    email: 'tung.nguyen@tech.vn',
    source: 'website',
    status: 'danh_gia_trai_nghiem',
    assignedTo: 'Trần Thị Mai (Sales)',
    branch: 'RinoEdu Smart City',
    createdAt: '2026-08-11',
    lastNote: 'Bé Phúc đã test đầu vào đạt Kindy Level 1.',
    testStatus: 'completed',
    testDate: '12/08/2026',
    testResultLevel: 'Kindy Level 1',
    testScore: '90/100',
    testerTeacherName: 'Thầy David',
    orderCode: 'OD-9239',
    orderStatus: 'partial',
    paymentTerm: 'Trả góp 3 kỳ',
    expectedPackage: 'Gói Kindy Mẫu giáo 1N',
    expectedAmount: '18.000.000đ',
    winProbability: 80,
  },
  {
    id: 'lead-014',
    code: 'LD-10302',
    studentName: 'Bé Mai',
    studentAge: 8,
    birthYear: 2018,
    targetSubject: 'Anh văn Nhi đồng (SuperKids)',
    parentId: 'par-012',
    parentName: 'Trịnh Kim Chi',
    parentRole: 'Mẹ',
    phone: '0903332211',
    address: 'Phường Tân Thuận Đông, Quận 7, TP.HCM',
    email: 'chi.trinh@gmail.com',
    source: 'referral',
    status: 'tiem_nang',
    assignedTo: 'Trần Thị Mai (Sales)',
    branch: 'RinoEdu Linh Đàm',
    createdAt: '2026-08-03',
    lastNote: 'Phụ huynh đã cọc 50% giữ suất ưu đãi khai giảng.',
    testStatus: 'completed',
    testDate: '04/08/2026',
    testResultLevel: 'SuperKids Level 1',
    testScore: '94/100',
    testerTeacherName: 'Cô Sarah',
    trialStatus: 'completed',
    trialClassName: 'SK-03',
    trialDate: '05/08/2026',
    trialFeedback: 'Đã cọc học phí',
    orderCode: 'OD-9240',
    orderStatus: 'pending_payment',
    paymentTerm: 'Đã cọc 50%',
    expectedPackage: 'Gói SuperKids Trọn Khóa',
    expectedAmount: '19.000.000đ',
    winProbability: 90,
  },
  {
    id: 'lead-015',
    code: 'LD-10303',
    studentName: 'Bé Hải',
    studentAge: 6,
    birthYear: 2020,
    targetSubject: 'Anh văn Mẫu giáo (Kindy)',
    parentId: 'par-013',
    parentName: 'Đinh Quốc Bảo',
    parentRole: 'Bố',
    phone: '0982221100',
    address: 'Phường An Phú, TP. Thủ Đức, TP.HCM',
    source: 'facebook',
    status: 'tam_dung',
    assignedTo: 'Trần Thị Mai (Sales)',
    branch: 'RinoEdu Smart City',
    createdAt: '2026-08-12',
    lastNote: 'Phụ huynh xin tạm dừng chăm sóc 2 tháng hè do cho bé về quê nghỉ hè.',
    expectedPackage: 'Gói Kindy 6T',
    expectedAmount: '11.500.000đ',
    winProbability: 0,
  },
  {
    id: 'lead-016',
    code: 'LD-10304',
    studentName: 'Bé My',
    studentAge: 11,
    birthYear: 2015,
    targetSubject: 'Anh văn Thiếu niên (Flyers)',
    parentId: 'par-014',
    parentName: 'Hoàng Như Ngọc',
    parentRole: 'Mẹ',
    phone: '0915556677',
    address: 'Phường Trung Hòa, Cầu Giấy, Hà Nội',
    email: 'ngoc.hoang@company.com',
    source: 'event',
    status: 'that_bai',
    assignedTo: 'Trần Thị Mai (Sales)',
    branch: 'RinoEdu Nguyễn Tuân',
    createdAt: '2026-08-07',
    lastNote: 'Số điện thoại sai số không liên lạc được với phụ huynh.',
    expectedPackage: 'Gói Flyers 1N',
    expectedAmount: '21.000.000đ',
    winProbability: 0,
  },
  {
    id: 'lead-017',
    code: 'LD-10305',
    studentName: 'Bé Kiên',
    studentAge: 9,
    birthYear: 2017,
    targetSubject: 'Anh văn Nhi đồng (SuperKids)',
    parentId: 'par-015',
    parentName: 'Phạm Quốc Anh',
    parentRole: 'Bố',
    phone: '0961112233',
    address: 'Phường Yên Hòa, Cầu Giấy, Hà Nội',
    source: 'hotline',
    status: 'that_bai',
    assignedTo: 'Trần Thị Mai (Sales)',
    branch: 'RinoEdu Nguyễn Tuân',
    createdAt: '2026-08-11',
    lastNote: 'Phụ huynh chê học phí cao so với mặt bằng trung tâm khác.',
    expectedPackage: 'Gói SuperKids 12T',
    expectedAmount: '17.000.000đ',
    winProbability: 0,
  },
  {
    id: 'lead-018',
    code: 'LD-10306',
    studentName: 'Bé Lan',
    studentAge: 12,
    birthYear: 2014,
    targetSubject: 'Luyện thi Flyers',
    parentId: 'par-016',
    parentName: 'Võ Thu Trang',
    parentRole: 'Mẹ',
    phone: '0947778899',
    address: 'Phường Quan Hoa, Cầu Giấy, Hà Nội',
    email: 'trang.vo@gmail.com',
    source: 'website',
    status: 'chua_tiep_can',
    assignedTo: 'Trần Thị Mai (Sales)',
    branch: 'RinoEdu Nguyễn Tuân',
    createdAt: '2026-08-06',
    lastNote: 'Đã giao Sale Mai, chưa gọi điện tiếp cận phụ huynh.',
    expectedPackage: 'Gói Flyers Intensive 6T',
    expectedAmount: '15.000.000đ',
    winProbability: 40,
  },
  {
    id: 'lead-019',
    code: 'LD-10307',
    studentName: 'Bé Huy',
    studentAge: 5,
    birthYear: 2021,
    targetSubject: 'Anh văn Mẫu giáo (Kindy)',
    parentId: 'par-017',
    parentName: 'Ngô Hoàng Việt',
    parentRole: 'Bố',
    phone: '0938887766',
    address: 'Phường Nghĩa Đô, Cầu Giấy, Hà Nội',
    source: 'facebook',
    status: 'chuyen_doi',
    assignedTo: 'Lê Hoàng Nam (Sales)',
    branch: 'RinoEdu Nguyễn Tuân',
    createdAt: '2026-08-02',
    lastNote: 'Đã thu 100% học phí lớp Kindy 1 năm.',
    orderCode: 'OD-9241',
    orderStatus: 'paid',
    paymentTerm: 'Thanh toán 100%',
    expectedPackage: 'Gói Kindy 1N',
    expectedAmount: '17.000.000đ',
    winProbability: 100,
  },
  {
    id: 'lead-020',
    code: 'LD-10308',
    studentName: 'Bé Tâm',
    studentAge: 14,
    birthYear: 2012,
    targetSubject: 'Luyện thi IELTS Junior',
    parentId: 'par-018',
    parentName: 'Cao Thị Dung',
    parentRole: 'Mẹ',
    phone: '0979998877',
    address: 'Phường Phú Mỹ, Quận 7, TP.HCM',
    email: 'dung.cao@hcm.gov.vn',
    source: 'referral',
    status: 'danh_gia_trai_nghiem',
    assignedTo: 'Nguyễn Văn Hùng (Sales Manager)',
    branch: 'RinoEdu Linh Đàm',
    createdAt: '2026-08-01',
    lastNote: 'Phụ huynh đã xác nhận đưa bé sang trải nghiệm lớp IELTS.',
    testerTeacherName: 'Thầy David',
    trialStatus: 'scheduled',
    trialClassName: 'IELTS-SPL',
    trialDate: '19/08/2026',
    orderCode: 'OD-9242',
    orderStatus: 'partial',
    paymentTerm: 'Cọc 10 triệu',
    expectedPackage: 'Gói IELTS Special 1N',
    expectedAmount: '38.000.000đ',
    winProbability: 80,
  },
  {
    id: 'lead-021',
    code: 'LD-10309',
    studentName: 'Bé Tuệ Mẫn',
    studentAge: 8,
    birthYear: 2018,
    targetSubject: 'Anh văn Nhi đồng (SuperKids)',
    parentId: 'par-019',
    parentName: 'Lý Lan Hương',
    parentRole: 'Mẹ',
    phone: '0981122334',
    address: 'Phường Hoàng Liệt, Hoàng Mai, Hà Nội',
    email: 'lanhuong.ly@gmail.com',
    source: 'facebook',
    status: 'dang_tu_van',
    subStatus: 'Quay lại từ đối thủ',
    assignedTo: 'Trần Thị Mai (Sales)',
    branch: 'RinoEdu Linh Đàm',
    createdAt: '2026-08-12',
    lastNote: 'Phụ huynh từng test đợt 1 (82 điểm), sau đó chọn học trung tâm đối thủ. Học không tiến bộ nên chủ động liên hệ lại xin học.',
    isReturningLead: true,
    returningReason: 'Từng test 5 tháng trước (82/100), chọn trung tâm khác nhưng không hiệu quả nên quay lại',
    initialLevel: 'SuperKids Level 1 (Test đợt 1 đạt 82/100)',
    schoolName: 'Tiểu học Chu Văn An (Hoàng Mai)',
    academicAbility: 'Khá Giỏi / Phát âm chuẩn',
    ordersCount: 0,
    totalSpend: '0đ',
    expectedPackage: 'Gói SuperKids Chuyên sâu 1N',
    expectedAmount: '24.000.000đ',
    winProbability: 85,
    previousTest: {
      id: 'test-021-1',
      cycleTitle: 'Đợt 1 (10/03/2026)',
      date: '10/03/2026',
      time: '17:30',
      branch: 'RinoEdu Linh Đàm',
      score: '82/100',
      resultLevel: 'SuperKids Level 1',
      teacherName: 'Cô Sarah',
      status: 'completed',
      notes: 'Bé phát âm chuẩn, từ vựng phong phú. Gia đình lúc đó chọn trung tâm gần nhà hơn.',
    },
    testHistory: [
      {
        id: 'test-021-1',
        cycleTitle: 'Đợt 1 (10/03/2026 - Chu kỳ 1)',
        date: '10/03/2026',
        time: '17:30',
        branch: 'RinoEdu Linh Đàm',
        score: '82/100',
        resultLevel: 'SuperKids Level 1',
        teacherName: 'Cô Sarah',
        status: 'completed',
        notes: 'Bé phát âm chuẩn, từ vựng phong phú. Gia đình lúc đó chọn trung tâm gần nhà hơn.',
      },
    ],
    salesCycles: [
      {
        cycleId: 'cycle-021-2',
        cycleNumber: 2,
        title: 'Chu kỳ 2 (T08/2026 - Quay lại từ đối thủ)',
        status: 'active',
        startDate: '12/08/2026',
        assignedSales: 'Trần Thị Mai (Sales)',
      },
      {
        cycleId: 'cycle-021-1',
        cycleNumber: 1,
        title: 'Chu kỳ 1 (T03/2026 - Rớt do chọn đối thủ)',
        status: 'dropped',
        startDate: '08/03/2026',
        endDate: '12/03/2026',
        assignedSales: 'Lê Hoàng Nam (Sales)',
        outcomeNote: 'Bé đạt 82/100 nhưng gia đình chọn trung tâm đối thủ cạnh tranh gần nhà.',
      },
    ],
    currentCycleId: 'cycle-021-2',
    careInteractions: [
      {
        id: 'care-2101',
        cycleId: 'cycle-021-2',
        timestamp: '12/08/2026 14:15',
        staffName: 'Trần Thị Mai (Sales)',
        channel: 'call',
        outcome: 'interested',
        outcomeLabel: 'Tiếp nhận lại (Quay lại)',
        note: 'Mẹ Lan Hương chủ động gọi lại hotline xin tư vấn lại. Mẹ chia sẻ học trung tâm cũ 5 tháng không thấy bé tiến bộ nói phản xạ.',
      },
      {
        id: 'care-2102',
        cycleId: 'cycle-021-1',
        timestamp: '12/03/2026 11:00',
        staffName: 'Lê Hoàng Nam (Sales)',
        channel: 'call',
        outcome: 'rejected',
        outcomeLabel: 'Báo rớt (Chọn đối thủ)',
        note: 'Phụ huynh cảm ơn kết quả test của cô Sarah nhưng báo đã đăng ký trung tâm gần nhà.',
      },
    ],
  },
  {
    id: 'lead-022',
    code: 'LD-10310',
    studentName: 'Bé Đức Anh',
    studentAge: 10,
    birthYear: 2016,
    targetSubject: 'Toán Tư duy (Archimedes)',
    parentId: 'par-020',
    parentName: 'Vũ Mạnh Cường',
    parentRole: 'Bố',
    phone: '0973344556',
    address: 'Phường Nhân Chính, Thanh Xuân, Hà Nội',
    source: 'referral',
    status: 'hen_trai_nghiem',
    subStatus: 'Hẹn học thử cuối tuần',
    assignedTo: 'Lê Hoàng Nam (Sales)',
    branch: 'RinoEdu Nguyễn Tuân',
    createdAt: '2026-08-10',
    lastNote: 'Phụ huynh từng cho bé học thử hè 2025 bị trùng lịch trường, nay năm học mới quay lại học ca T7.',
    isReturningLead: true,
    returningReason: 'Từng học thử Toán tư duy năm ngoái nhưng trùng lịch học chính khóa; nay xếp học ca cuối tuần',
    initialLevel: 'Archimedes Math Level 3',
    schoolName: 'Tiểu học Phan Đình Giót (Thanh Xuân)',
    academicAbility: 'Giỏi Toán / Tư duy logic sắc bén',
    ordersCount: 0,
    totalSpend: '0đ',
    testStatus: 'scheduled',
    testDate: '17/08/2026',
    testTime: '18:30',
    testerTeacherName: 'Thầy Quang',
    trialStatus: 'scheduled',
    trialClassName: 'MATH-ARC02',
    trialDate: '18/08/2026',
    trialTime: '18:30',
    expectedPackage: 'Gói Toán Tư duy Archimedes 1N',
    expectedAmount: '19.500.000đ',
    winProbability: 80,
    previousTrial: {
      id: 'trial-022-1',
      cycleTitle: 'Chu kỳ 1 (T07/2025)',
      date: '25/07/2025',
      time: '18:30',
      className: 'MATH-ARC01',
      branch: 'RinoEdu Nguyễn Tuân',
      teacherName: 'Thầy Quang',
      status: 'completed',
      feedback: 'Bé tư duy logic rất tốt, giải toán sáng tạo nhưng bị trùng lịch học thêm buổi tối ở trường.',
    },
    trialHistory: [
      {
        id: 'trial-022-1',
        cycleTitle: 'Đợt 1 (25/07/2025 - Chu kỳ 1)',
        date: '25/07/2025',
        time: '18:30',
        className: 'MATH-ARC01',
        branch: 'RinoEdu Nguyễn Tuân',
        teacherName: 'Thầy Quang',
        status: 'completed',
        feedback: 'Bé tư duy logic rất tốt, giải toán sáng tạo nhưng bị trùng lịch học thêm buổi tối ở trường.',
      },
      {
        id: 'trial-022-2',
        cycleTitle: 'Đợt 2 (18/08/2026 - Chu kỳ 2)',
        date: '18/08/2026',
        time: '18:30',
        className: 'MATH-ARC02',
        branch: 'RinoEdu Nguyễn Tuân',
        teacherName: 'Thầy Quang',
        status: 'scheduled',
      },
    ],
    salesCycles: [
      {
        cycleId: 'cycle-022-2',
        cycleNumber: 2,
        title: 'Chu kỳ 2 (T08/2026 - Quay lại xếp ca cuối tuần)',
        status: 'active',
        startDate: '10/08/2026',
        assignedSales: 'Lê Hoàng Nam (Sales)',
      },
      {
        cycleId: 'cycle-022-1',
        cycleNumber: 1,
        title: 'Chu kỳ 1 (T07/2025 - Hoãn do trùng lịch)',
        status: 'dropped',
        startDate: '20/07/2025',
        endDate: '28/07/2025',
        assignedSales: 'Lê Hoàng Nam (Sales)',
        outcomeNote: 'Bé học thử tốt nhưng trùng lịch học ở trường chính khóa.',
      },
    ],
    currentCycleId: 'cycle-022-2',
    careInteractions: [
      {
        id: 'care-2201',
        cycleId: 'cycle-022-2',
        timestamp: '10/08/2026 16:30',
        staffName: 'Lê Hoàng Nam (Sales)',
        channel: 'call',
        outcome: 'booked_test',
        outcomeLabel: 'Đặt lịch test & học thử ca T7',
        note: 'Bố Mạnh Cường gọi điện báo năm nay bé đã sắp xếp xong thời khóa biểu trường, muốn cho bé học lớp Toán Archimedes ca Thứ 7.',
        nextAppointment: '17/08/2026 18:30',
      },
      {
        id: 'care-2202',
        cycleId: 'cycle-022-1',
        timestamp: '28/07/2025 10:00',
        staffName: 'Lê Hoàng Nam (Sales)',
        channel: 'call',
        outcome: 'rejected',
        outcomeLabel: 'Báo hoãn (Trùng lịch trường)',
        note: 'Bố xin hoãn vì lịch trường chuyển sang buổi tối trùng ca học của trung tâm. Hẹn năm sau quay lại.',
      },
    ],
  },
]

export function getLeads(filters?: {
  search?: string
  branch?: string
  status?: string
  source?: string
}): Lead[] {
  let result = [...mockLeads]
  if (!filters) return result

  if (filters.branch && filters.branch !== 'all') {
    result = result.filter((item) => item.branch === filters.branch)
  }

  if (filters.status && filters.status !== 'all') {
    result = result.filter((item) => item.status === filters.status)
  }

  if (filters.source && filters.source !== 'all') {
    result = result.filter((item) => item.source === filters.source)
  }

  if (filters.search && filters.search.trim()) {
    const q = filters.search.toLowerCase().trim()
    result = result.filter(
      (item) =>
        item.studentName.toLowerCase().includes(q) ||
        item.parentName.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.phone.includes(q) ||
        item.address.toLowerCase().includes(q) ||
        item.targetSubject.toLowerCase().includes(q)
    )
  }

  return result
}

export function updateLead(leadId: string, updater: Partial<Lead> | ((prev: Lead) => Lead)): void {
  const index = mockLeads.findIndex((l) => l.id === leadId)
  if (index !== -1) {
    if (typeof updater === 'function') {
      mockLeads[index] = updater(mockLeads[index])
    } else {
      mockLeads[index] = { ...mockLeads[index], ...updater }
    }
  }
}
