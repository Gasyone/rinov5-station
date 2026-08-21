export interface DigiLessonItem {
  lessonId: string
  lessonName: string
  lessonNumber: number
  durationMinutes: number // 30 mins (25m study + 5m break)
  status?: 'completed' | 'in_progress' | 'skipped' | 'pending'
  score?: number
}

export interface DigiStudentPackage {
  packageId: string
  packageName: string
  totalLessonsCount: number
  availableLessons: DigiLessonItem[]
}

export interface DigiStudentProfile {
  id: string
  name: string
  englishName?: string
  phoneMasked: string
  branch: string
  packages: DigiStudentPackage[]
  // Backwards compatibility properties
  packageName: string
  availableLessons: DigiLessonItem[]
}

export interface DigiStudentBooking {
  id: string
  studentId: string
  studentName: string
  studentEnglishName?: string
  studentPhoneMasked: string
  packageName: string
  branch: string
  
  // Lessons & Duration
  selectedLessons: DigiLessonItem[]
  totalLessons: number
  totalMinutes: number // totalLessons * 30 mins
  
  // Time & Room
  date: string // YYYY-MM-DD
  startTime: string // HH:mm
  endTime: string // HH:mm
  roomName: string
  deviceCode?: string // Optional
  
  // Operational Status
  status: 'da_xep_lich' | 'dang_hoc' | 'completed' | 'da_vang' | 'cancelled'
  checkInAt?: string
  completedAt?: string
  notes?: string
  supervisor?: string
}

export const DIGI_TIME_SLOTS = [
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
]

export const MOCK_DIGI_STUDENTS: DigiStudentProfile[] = [
  {
    id: 's-baohan',
    name: 'Lê Nguyễn Bảo Hân',
    englishName: 'Bella',
    phoneMasked: '0987****21',
    branch: 'RinoEdu Linh Đàm',
    packageName: 'Digi English Primary (48 bài)',
    availableLessons: [
      { lessonId: 'LES-ENG-05', lessonName: 'Bài 5: Phonics Sound /a/ & Short Vowels', lessonNumber: 5, durationMinutes: 30 },
      { lessonId: 'LES-ENG-06', lessonName: 'Bài 6: Phonics Sound /b/ & Consonants', lessonNumber: 6, durationMinutes: 30 },
      { lessonId: 'LES-ENG-07', lessonName: 'Bài 7: Sight Words Unit 2', lessonNumber: 7, durationMinutes: 30 },
      { lessonId: 'LES-ENG-08', lessonName: 'Bài 8: Story Reading & Mini Quiz', lessonNumber: 8, durationMinutes: 30 },
    ],
    packages: [
      {
        packageId: 'PKG-ENG-PRI',
        packageName: 'Digi English Primary (48 bài)',
        totalLessonsCount: 48,
        availableLessons: [
          { lessonId: 'LES-ENG-05', lessonName: 'Bài 5: Phonics Sound /a/ & Short Vowels', lessonNumber: 5, durationMinutes: 30 },
          { lessonId: 'LES-ENG-06', lessonName: 'Bài 6: Phonics Sound /b/ & Consonants', lessonNumber: 6, durationMinutes: 30 },
          { lessonId: 'LES-ENG-07', lessonName: 'Bài 7: Sight Words Unit 2', lessonNumber: 7, durationMinutes: 30 },
          { lessonId: 'LES-ENG-08', lessonName: 'Bài 8: Story Reading & Mini Quiz', lessonNumber: 8, durationMinutes: 30 },
        ],
      },
      {
        packageId: 'PKG-MATH-TD',
        packageName: 'Digi Math Tư Duy (36 bài)',
        totalLessonsCount: 36,
        availableLessons: [
          { lessonId: 'LES-MATH-03', lessonName: 'Bài 3: Tư duy logic hình học & Phép cộng', lessonNumber: 3, durationMinutes: 30 },
          { lessonId: 'LES-MATH-04', lessonName: 'Bài 4: Bảng nhân nhẩm 2 & 3', lessonNumber: 4, durationMinutes: 30 },
          { lessonId: 'LES-MATH-05', lessonName: 'Bài 5: Phép chia căn bản trong phạm vi 20', lessonNumber: 5, durationMinutes: 30 },
        ],
      },
    ],
  },
  {
    id: 's-trannam',
    name: 'Trần Bảo Nam',
    englishName: 'Tom',
    phoneMasked: '0912****88',
    branch: 'RinoEdu Linh Đàm',
    packageName: 'Digi Math Tư Duy (36 bài)',
    availableLessons: [
      { lessonId: 'LES-MATH-08', lessonName: 'Bài 8: Số học logic & Bảng cửu chương 3', lessonNumber: 8, durationMinutes: 30 },
      { lessonId: 'LES-MATH-09', lessonName: 'Bài 9: Phép nhân nhẩm cơ bản', lessonNumber: 9, durationMinutes: 30 },
      { lessonId: 'LES-MATH-10', lessonName: 'Bài 10: Toán đố thực tế & Trắc nghiệm', lessonNumber: 10, durationMinutes: 30 },
      { lessonId: 'LES-MATH-11', lessonName: 'Bài 11: Phép chia & Tính nhẩm nhanh', lessonNumber: 11, durationMinutes: 30 },
      { lessonId: 'LES-MATH-12', lessonName: 'Bài 12: Hình học không gian & Tư duy logic', lessonNumber: 12, durationMinutes: 30 },
      { lessonId: 'LES-MATH-13', lessonName: 'Bài 13: Bài toán quy luật & Dãy số', lessonNumber: 13, durationMinutes: 30 },
    ],
    packages: [
      {
        packageId: 'PKG-MATH-TD',
        packageName: 'Digi Math Tư Duy (36 bài)',
        totalLessonsCount: 36,
        availableLessons: [
          { lessonId: 'LES-MATH-08', lessonName: 'Bài 8: Số học logic & Bảng cửu chương 3', lessonNumber: 8, durationMinutes: 30 },
          { lessonId: 'LES-MATH-09', lessonName: 'Bài 9: Phép nhân nhẩm cơ bản', lessonNumber: 9, durationMinutes: 30 },
          { lessonId: 'LES-MATH-10', lessonName: 'Bài 10: Toán đố thực tế & Trắc nghiệm', lessonNumber: 10, durationMinutes: 30 },
          { lessonId: 'LES-MATH-11', lessonName: 'Bài 11: Phép chia & Tính nhẩm nhanh', lessonNumber: 11, durationMinutes: 30 },
          { lessonId: 'LES-MATH-12', lessonName: 'Bài 12: Hình học không gian & Tư duy logic', lessonNumber: 12, durationMinutes: 30 },
          { lessonId: 'LES-MATH-13', lessonName: 'Bài 13: Bài toán quy luật & Dãy số', lessonNumber: 13, durationMinutes: 30 },
        ],
      },
      {
        packageId: 'PKG-STEM-ROB',
        packageName: 'Digi STEM Robotics (24 bài)',
        totalLessonsCount: 24,
        availableLessons: [
          { lessonId: 'LES-STEM-04', lessonName: 'Bài 4: Lập trình Robot né vật cản', lessonNumber: 4, durationMinutes: 30 },
          { lessonId: 'LES-STEM-05', lessonName: 'Bài 5: Đèn LED RGB & Còi chíp thông minh', lessonNumber: 5, durationMinutes: 30 },
          { lessonId: 'LES-STEM-06', lessonName: 'Bài 6: Điều khiển Robot theo đường kẻ (Line Follower)', lessonNumber: 6, durationMinutes: 30 },
          { lessonId: 'LES-STEM-07', lessonName: 'Bài 7: Chế tạo cánh tay Robot gắp vật thể', lessonNumber: 7, durationMinutes: 30 },
        ],
      },
    ],
  },
  {
    id: 's-vuminh',
    name: 'Vũ Quốc Minh',
    englishName: 'Max',
    phoneMasked: '0903****12',
    branch: 'RinoEdu Linh Đàm',
    packageName: 'Digi STEM Robotics (24 bài)',
    availableLessons: [
      { lessonId: 'LES-STEM-01', lessonName: 'Bài 1: Làm quen phần mềm mô phỏng Robot', lessonNumber: 1, durationMinutes: 30 },
      { lessonId: 'LES-STEM-02', lessonName: 'Bài 2: Khối lệnh di chuyển cơ bản', lessonNumber: 2, durationMinutes: 30 },
      { lessonId: 'LES-STEM-03', lessonName: 'Bài 3: Cảm biến khoảng cách & Vòng lặp', lessonNumber: 3, durationMinutes: 30 },
    ],
    packages: [
      {
        packageId: 'PKG-STEM-ROB',
        packageName: 'Digi STEM Robotics (24 bài)',
        totalLessonsCount: 24,
        availableLessons: [
          { lessonId: 'LES-STEM-01', lessonName: 'Bài 1: Làm quen phần mềm mô phỏng Robot', lessonNumber: 1, durationMinutes: 30 },
          { lessonId: 'LES-STEM-02', lessonName: 'Bài 2: Khối lệnh di chuyển cơ bản', lessonNumber: 2, durationMinutes: 30 },
          { lessonId: 'LES-STEM-03', lessonName: 'Bài 3: Cảm biến khoảng cách & Vòng lặp', lessonNumber: 3, durationMinutes: 30 },
        ],
      },
      {
        packageId: 'PKG-ENG-PRI',
        packageName: 'Digi English Primary (48 bài)',
        totalLessonsCount: 48,
        availableLessons: [
          { lessonId: 'LES-ENG-09', lessonName: 'Bài 9: Grammar Present Simple Practice', lessonNumber: 9, durationMinutes: 30 },
          { lessonId: 'LES-ENG-10', lessonName: 'Bài 10: Listening Comprehension Quiz', lessonNumber: 10, durationMinutes: 30 },
        ],
      },
    ],
  },
  {
    id: 's-phaman',
    name: 'Phạm Bình An',
    englishName: 'Alex',
    phoneMasked: '0944****55',
    branch: 'RinoEdu Linh Đàm',
    packageName: 'Digi English Starter (48 bài)',
    availableLessons: [
      { lessonId: 'LES-ENG-03', lessonName: 'Bài 3: Colors and Shapes in English', lessonNumber: 3, durationMinutes: 30 },
      { lessonId: 'LES-ENG-04', lessonName: 'Bài 4: Numbers 1 to 20 Practice', lessonNumber: 4, durationMinutes: 30 },
    ],
    packages: [
      {
        packageId: 'PKG-ENG-STA',
        packageName: 'Digi English Starter (48 bài)',
        totalLessonsCount: 48,
        availableLessons: [
          { lessonId: 'LES-ENG-03', lessonName: 'Bài 3: Colors and Shapes in English', lessonNumber: 3, durationMinutes: 30 },
          { lessonId: 'LES-ENG-04', lessonName: 'Bài 4: Numbers 1 to 20 Practice', lessonNumber: 4, durationMinutes: 30 },
        ],
      },
      {
        packageId: 'PKG-MATH-CT',
        packageName: 'Digi Math Cấp Tốc (30 bài)',
        totalLessonsCount: 30,
        availableLessons: [
          { lessonId: 'LES-MATH-05', lessonName: 'Bài 5: Phép trừ có nhớ phạm vi 50', lessonNumber: 5, durationMinutes: 30 },
          { lessonId: 'LES-MATH-06', lessonName: 'Bài 6: Toán đố logic vui nhộn', lessonNumber: 6, durationMinutes: 30 },
        ],
      },
    ],
  },
  {
    id: 's-hoanglong',
    name: 'Hoàng Phi Long',
    englishName: 'Leo',
    phoneMasked: '0933****77',
    branch: 'RinoEdu Nguyễn Tuân',
    packageName: 'Digi Math Cấp Tốc (30 bài)',
    availableLessons: [
      { lessonId: 'LES-MATH-01', lessonName: 'Bài 1: Khởi động tư duy số học', lessonNumber: 1, durationMinutes: 30 },
      { lessonId: 'LES-MATH-02', lessonName: 'Bài 2: Tính nhanh cộng trừ trong phạm vi 100', lessonNumber: 2, durationMinutes: 30 },
    ],
    packages: [
      {
        packageId: 'PKG-MATH-CT',
        packageName: 'Digi Math Cấp Tốc (30 bài)',
        totalLessonsCount: 30,
        availableLessons: [
          { lessonId: 'LES-MATH-01', lessonName: 'Bài 1: Khởi động tư duy số học', lessonNumber: 1, durationMinutes: 30 },
          { lessonId: 'LES-MATH-02', lessonName: 'Bài 2: Tính nhanh cộng trừ trong phạm vi 100', lessonNumber: 2, durationMinutes: 30 },
        ],
      },
      {
        packageId: 'PKG-ENG-STA',
        packageName: 'Digi English Starter (48 bài)',
        totalLessonsCount: 48,
        availableLessons: [
          { lessonId: 'LES-ENG-07', lessonName: 'Bài 7: Fruits & Vegetables Vocabulary', lessonNumber: 7, durationMinutes: 30 },
          { lessonId: 'LES-ENG-08', lessonName: 'Bài 8: Daily Action Verbs Listening', lessonNumber: 8, durationMinutes: 30 },
        ],
      },
    ],
  },
  {
    id: 's-phuonglinh',
    name: 'Nguyễn Phương Linh',
    englishName: 'Ling',
    phoneMasked: '0988****33',
    branch: 'RinoEdu Linh Đàm',
    packageName: 'Digi English Primary (48 bài)',
    availableLessons: [
      { lessonId: 'LES-ENG-01', lessonName: 'Bài 1: Phonics Starter & Alphabet', lessonNumber: 1, durationMinutes: 30 },
      { lessonId: 'LES-ENG-02', lessonName: 'Bài 2: Short Vowels & Listening Practice', lessonNumber: 2, durationMinutes: 30 },
    ],
    packages: [
      {
        packageId: 'PKG-ENG-PRI',
        packageName: 'Digi English Primary (48 bài)',
        totalLessonsCount: 48,
        availableLessons: [
          { lessonId: 'LES-ENG-01', lessonName: 'Bài 1: Phonics Starter & Alphabet', lessonNumber: 1, durationMinutes: 30 },
          { lessonId: 'LES-ENG-02', lessonName: 'Bài 2: Short Vowels & Listening Practice', lessonNumber: 2, durationMinutes: 30 },
        ],
      },
      {
        packageId: 'PKG-MATH-TD',
        packageName: 'Digi Math Tư Duy (36 bài)',
        totalLessonsCount: 36,
        availableLessons: [
          { lessonId: 'LES-MATH-01', lessonName: 'Bài 1: Số học logic & Hình học phẳng', lessonNumber: 1, durationMinutes: 30 },
          { lessonId: 'LES-MATH-02', lessonName: 'Bài 2: Phép cộng trừ nhẩm phạm vi 50', lessonNumber: 2, durationMinutes: 30 },
        ],
      },
    ],
  },
  {
    id: 's-khanhlinh',
    name: 'Ngô Khánh Linh',
    englishName: 'Chloe',
    phoneMasked: '0978****99',
    branch: 'RinoEdu Linh Đàm',
    packageName: 'Digi English Primary (48 bài)',
    availableLessons: [
      { lessonId: 'LES-ENG-01', lessonName: 'Bài 1: Alphabet Sounds', lessonNumber: 1, durationMinutes: 30 },
      { lessonId: 'LES-ENG-02', lessonName: 'Bài 2: Vowels Practice', lessonNumber: 2, durationMinutes: 30 },
    ],
    packages: [
      {
        packageId: 'PKG-ENG-PRI',
        packageName: 'Digi English Primary (48 bài)',
        totalLessonsCount: 48,
        availableLessons: [
          { lessonId: 'LES-ENG-01', lessonName: 'Bài 1: Alphabet Sounds', lessonNumber: 1, durationMinutes: 30 },
          { lessonId: 'LES-ENG-02', lessonName: 'Bài 2: Vowels Practice', lessonNumber: 2, durationMinutes: 30 },
        ],
      },
    ],
  },
  {
    id: 's-thuydang',
    name: 'Đặng Thùy Dương',
    englishName: 'Daisy',
    phoneMasked: '0965****33',
    branch: 'RinoEdu Linh Đàm',
    packageName: 'Digi English Primary (48 bài)',
    availableLessons: [
      { lessonId: 'LES-ENG-07', lessonName: 'Bài 7: Sight Words Unit 2', lessonNumber: 7, durationMinutes: 30 },
      { lessonId: 'LES-ENG-08', lessonName: 'Bài 8: Story Reading & Quiz', lessonNumber: 8, durationMinutes: 30 },
    ],
    packages: [
      {
        packageId: 'PKG-ENG-PRI',
        packageName: 'Digi English Primary (48 bài)',
        totalLessonsCount: 48,
        availableLessons: [
          { lessonId: 'LES-ENG-07', lessonName: 'Bài 7: Sight Words Unit 2', lessonNumber: 7, durationMinutes: 30 },
          { lessonId: 'LES-ENG-08', lessonName: 'Bài 8: Story Reading & Quiz', lessonNumber: 8, durationMinutes: 30 },
        ],
      },
    ],
  },
  {
    id: 's-minhanh',
    name: 'Lê Minh Anh',
    englishName: 'Mia',
    phoneMasked: '0908****66',
    branch: 'RinoEdu Linh Đàm',
    packageName: 'Digi Math Tư Duy (36 bài)',
    availableLessons: [
      { lessonId: 'LES-MATH-01', lessonName: 'Bài 1: Số học logic', lessonNumber: 1, durationMinutes: 30 },
      { lessonId: 'LES-MATH-02', lessonName: 'Bài 2: Phép tính nhanh', lessonNumber: 2, durationMinutes: 30 },
    ],
    packages: [
      {
        packageId: 'PKG-MATH-TD',
        packageName: 'Digi Math Tư Duy (36 bài)',
        totalLessonsCount: 36,
        availableLessons: [
          { lessonId: 'LES-MATH-01', lessonName: 'Bài 1: Số học logic', lessonNumber: 1, durationMinutes: 30 },
          { lessonId: 'LES-MATH-02', lessonName: 'Bài 2: Phép tính nhanh', lessonNumber: 2, durationMinutes: 30 },
        ],
      },
    ],
  },
  {
    id: 's-haidang',
    name: 'Nguyễn Hải Đăng',
    englishName: 'Harry',
    phoneMasked: '0934****22',
    branch: 'RinoEdu Linh Đàm',
    packageName: 'Digi English Starter (48 bài)',
    availableLessons: [
      { lessonId: 'LES-ENG-05', lessonName: 'Bài 5: Family & Friends', lessonNumber: 5, durationMinutes: 30 },
    ],
    packages: [
      {
        packageId: 'PKG-ENG-STA',
        packageName: 'Digi English Starter (48 bài)',
        totalLessonsCount: 48,
        availableLessons: [
          { lessonId: 'LES-ENG-05', lessonName: 'Bài 5: Family & Friends', lessonNumber: 5, durationMinutes: 30 },
        ],
      },
    ],
  },
  {
    id: 's-tuananh',
    name: 'Bùi Tuấn Anh',
    englishName: 'David',
    phoneMasked: '0918****44',
    branch: 'RinoEdu Linh Đàm',
    packageName: 'Digi STEM Robotics (24 bài)',
    availableLessons: [
      { lessonId: 'LES-STEM-01', lessonName: 'Bài 1: Làm quen mô phỏng Robot', lessonNumber: 1, durationMinutes: 30 },
    ],
    packages: [
      {
        packageId: 'PKG-STEM-ROB',
        packageName: 'Digi STEM Robotics (24 bài)',
        totalLessonsCount: 24,
        availableLessons: [
          { lessonId: 'LES-STEM-01', lessonName: 'Bài 1: Làm quen mô phỏng Robot', lessonNumber: 1, durationMinutes: 30 },
        ],
      },
    ],
  },
  {
    id: 's-mylinh',
    name: 'Trần Mỹ Linh',
    englishName: 'Sarah',
    phoneMasked: '0915****66',
    branch: 'RinoEdu Nguyễn Tuân',
    packageName: 'Digi Math Tư Duy (36 bài)',
    availableLessons: [
      { lessonId: 'LES-MATH-04', lessonName: 'Bài 4: Phép tính nhân nhẩm 3 & 4', lessonNumber: 4, durationMinutes: 30 },
      { lessonId: 'LES-MATH-05', lessonName: 'Bài 5: Toán đố logic tư duy cao', lessonNumber: 5, durationMinutes: 30 },
    ],
    packages: [
      {
        packageId: 'PKG-MATH-TD',
        packageName: 'Digi Math Tư Duy (36 bài)',
        totalLessonsCount: 36,
        availableLessons: [
          { lessonId: 'LES-MATH-04', lessonName: 'Bài 4: Phép tính nhân nhẩm 3 & 4', lessonNumber: 4, durationMinutes: 30 },
          { lessonId: 'LES-MATH-05', lessonName: 'Bài 5: Toán đố logic tư duy cao', lessonNumber: 5, durationMinutes: 30 },
        ],
      },
    ],
  },
  {
    id: 's-giahuy',
    name: 'Vũ Gia Huy',
    englishName: 'Lucas',
    phoneMasked: '0977****11',
    branch: 'RinoEdu Linh Đàm',
    packageName: 'Digi STEM Robotics (24 bài)',
    availableLessons: [
      { lessonId: 'LES-STEM-02', lessonName: 'Bài 2: Lập trình khối lệnh xoay góc', lessonNumber: 2, durationMinutes: 30 },
      { lessonId: 'LES-STEM-03', lessonName: 'Bài 3: Cảm biến chạm và hồng ngoại', lessonNumber: 3, durationMinutes: 30 },
    ],
    packages: [
      {
        packageId: 'PKG-STEM-ROB',
        packageName: 'Digi STEM Robotics (24 bài)',
        totalLessonsCount: 24,
        availableLessons: [
          { lessonId: 'LES-STEM-02', lessonName: 'Bài 2: Lập trình khối lệnh xoay góc', lessonNumber: 2, durationMinutes: 30 },
          { lessonId: 'LES-STEM-03', lessonName: 'Bài 3: Cảm biến chạm và hồng ngoại', lessonNumber: 3, durationMinutes: 30 },
        ],
      },
    ],
  },
]

export const MOCK_AVAILABLE_DEVICES = [
  'PC-01',
  'PC-02',
  'PC-03',
  'PC-04',
  'iPad-01',
  'iPad-02',
  'iPad-03',
]

export const MOCK_ROOMS_CAPACITY: Record<string, number> = {
  'Phòng tự học Digi': 10,
  'Phòng Digi': 10,
  'Phòng Lab Digi': 15,
  'Phòng 101': 8,
  'Phòng 102': 10,
  'Phòng 201': 12,
  'Phòng 202': 6,
}

export const INITIAL_DIGI_BOOKINGS: DigiStudentBooking[] = [
  {
    id: 'DG-2608-001',
    studentId: 's-baohan',
    studentName: 'Lê Nguyễn Bảo Hân',
    studentEnglishName: 'Bella',
    studentPhoneMasked: '0987****21',
    packageName: 'Digi English Primary (48 bài)',
    branch: 'RinoEdu Linh Đàm',
    selectedLessons: [
      { lessonId: 'LES-ENG-05', lessonName: 'Bài 5: Phonics Sound /a/', lessonNumber: 5, durationMinutes: 30, status: 'completed' },
      { lessonId: 'LES-ENG-06', lessonName: 'Bài 6: Phonics Sound /b/', lessonNumber: 6, durationMinutes: 30, status: 'in_progress' },
    ],
    totalLessons: 2,
    totalMinutes: 60,
    date: '2026-08-19',
    startTime: '18:00',
    endTime: '19:00',
    roomName: 'Phòng tự học Digi',
    deviceCode: 'PC-01',
    status: 'dang_hoc',
    checkInAt: '17:58',
  },
  {
    id: 'DG-2608-002',
    studentId: 's-trannam',
    studentName: 'Trần Bảo Nam',
    studentEnglishName: 'Tom',
    studentPhoneMasked: '0912****88',
    packageName: 'Digi Math Tư Duy (36 bài)',
    branch: 'RinoEdu Linh Đàm',
    selectedLessons: [
      { lessonId: 'LES-MATH-08', lessonName: 'Bài 8: Số học logic', lessonNumber: 8, durationMinutes: 30, status: 'completed' },
    ],
    totalLessons: 1,
    totalMinutes: 30,
    date: '2026-08-19',
    startTime: '18:00',
    endTime: '18:30',
    roomName: 'Phòng tự học Digi',
    status: 'completed',
    checkInAt: '18:00',
    completedAt: '18:30',
  },
  {
    id: 'DG-2608-003',
    studentId: 's-vuminh',
    studentName: 'Vũ Quốc Minh',
    studentEnglishName: 'Max',
    studentPhoneMasked: '0903****12',
    packageName: 'Digi STEM Robotics (24 bài)',
    branch: 'RinoEdu Linh Đàm',
    selectedLessons: [
      { lessonId: 'LES-STEM-01', lessonName: 'Bài 1: Làm quen mô phỏng Robot', lessonNumber: 1, durationMinutes: 30, status: 'completed' },
      { lessonId: 'LES-STEM-02', lessonName: 'Bài 2: Khối lệnh di chuyển', lessonNumber: 2, durationMinutes: 30, status: 'in_progress' },
      { lessonId: 'LES-STEM-03', lessonName: 'Bài 3: Cảm biến khoảng cách', lessonNumber: 3, durationMinutes: 30, status: 'pending' },
    ],
    totalLessons: 3,
    totalMinutes: 90,
    date: '2026-08-19',
    startTime: '18:30',
    endTime: '20:00',
    roomName: 'Phòng tự học Digi',
    deviceCode: 'iPad-02',
    status: 'dang_hoc',
    checkInAt: '18:28',
  },
  {
    id: 'DG-2608-004',
    studentId: 's-phaman',
    studentName: 'Phạm Bình An',
    studentEnglishName: 'Alex',
    studentPhoneMasked: '0944****55',
    packageName: 'Digi English Starter (48 bài)',
    branch: 'RinoEdu Linh Đàm',
    selectedLessons: [
      { lessonId: 'LES-ENG-03', lessonName: 'Bài 3: Colors and Shapes', lessonNumber: 3, durationMinutes: 30, status: 'pending' },
      { lessonId: 'LES-ENG-04', lessonName: 'Bài 4: Numbers 1 to 20', lessonNumber: 4, durationMinutes: 30, status: 'pending' },
    ],
    totalLessons: 2,
    totalMinutes: 60,
    date: '2026-08-19',
    startTime: '18:30',
    endTime: '19:30',
    roomName: 'Phòng tự học Digi',
    deviceCode: 'PC-03',
    status: 'da_xep_lich',
  },
  {
    id: 'DG-2608-005',
    studentId: 's-hoanglong',
    studentName: 'Hoàng Phi Long',
    studentEnglishName: 'Leo',
    studentPhoneMasked: '0933****77',
    packageName: 'Digi Math Cấp Tốc (30 bài)',
    branch: 'RinoEdu Linh Đàm',
    selectedLessons: [
      { lessonId: 'LES-MATH-01', lessonName: 'Bài 1: Khởi động tư duy số học', lessonNumber: 1, durationMinutes: 30, status: 'completed' },
      { lessonId: 'LES-MATH-02', lessonName: 'Bài 2: Tính nhanh trong phạm vi 100', lessonNumber: 2, durationMinutes: 30, status: 'completed' },
      { lessonId: 'LES-MATH-03', lessonName: 'Bài 3: Tư duy logic hình học', lessonNumber: 3, durationMinutes: 30, status: 'skipped' },
    ],
    totalLessons: 3,
    totalMinutes: 90,
    date: '2026-08-19',
    startTime: '18:00',
    endTime: '19:30',
    roomName: 'Phòng tự học Digi',
    deviceCode: 'PC-01',
    status: 'dang_hoc',
    checkInAt: '18:05',
  },
  {
    id: 'DG-2608-006',
    studentId: 's-thuydang',
    studentName: 'Đặng Thùy Dương',
    studentEnglishName: 'Daisy',
    studentPhoneMasked: '0965****33',
    packageName: 'Digi English Primary (48 bài)',
    branch: 'RinoEdu Linh Đàm',
    selectedLessons: [
      { lessonId: 'LES-ENG-07', lessonName: 'Bài 7: Sight Words Unit 2', lessonNumber: 7, durationMinutes: 30, status: 'pending' },
      { lessonId: 'LES-ENG-08', lessonName: 'Bài 8: Story Reading & Quiz', lessonNumber: 8, durationMinutes: 30, status: 'pending' },
    ],
    totalLessons: 2,
    totalMinutes: 60,
    date: '2026-08-19',
    startTime: '19:00',
    endTime: '20:00',
    roomName: 'Phòng tự học Digi',
    deviceCode: 'iPad-02',
    status: 'da_xep_lich',
  },
  {
    id: 'DG-2608-007',
    studentId: 's-khanhlinh',
    studentName: 'Ngô Khánh Linh',
    studentEnglishName: 'Chloe',
    studentPhoneMasked: '0978****99',
    packageName: 'Digi English Primary (48 bài)',
    branch: 'RinoEdu Linh Đàm',
    selectedLessons: [
      { lessonId: 'LES-ENG-01', lessonName: 'Bài 1: Alphabet Sounds', lessonNumber: 1, durationMinutes: 30, status: 'completed' },
      { lessonId: 'LES-ENG-02', lessonName: 'Bài 2: Vowels Practice', lessonNumber: 2, durationMinutes: 30, status: 'pending' },
    ],
    totalLessons: 2,
    totalMinutes: 60,
    date: '2026-08-19',
    startTime: '18:00',
    endTime: '19:00',
    roomName: 'Phòng tự học Digi',
    deviceCode: 'PC-02',
    status: 'dang_hoc',
    checkInAt: '18:02',
  },
  {
    id: 'DG-2608-008',
    studentId: 's-tuananh',
    studentName: 'Bùi Tuấn Anh',
    studentEnglishName: 'David',
    studentPhoneMasked: '0918****44',
    packageName: 'Digi STEM Robotics (24 bài)',
    branch: 'RinoEdu Linh Đàm',
    selectedLessons: [
      { lessonId: 'LES-STEM-01', lessonName: 'Bài 1: Làm quen mô phỏng', lessonNumber: 1, durationMinutes: 30, status: 'pending' },
    ],
    totalLessons: 1,
    totalMinutes: 30,
    date: '2026-08-19',
    startTime: '18:30',
    endTime: '19:00',
    roomName: 'Phòng tự học Digi',
    deviceCode: 'PC-04',
    status: 'da_xep_lich',
  },
  {
    id: 'DG-2608-009',
    studentId: 's-minhanh',
    studentName: 'Lê Minh Anh',
    studentEnglishName: 'Mia',
    studentPhoneMasked: '0908****66',
    packageName: 'Digi Math Tư Duy (36 bài)',
    branch: 'RinoEdu Linh Đàm',
    selectedLessons: [
      { lessonId: 'LES-MATH-01', lessonName: 'Bài 1: Số học logic', lessonNumber: 1, durationMinutes: 30, status: 'pending' },
      { lessonId: 'LES-MATH-02', lessonName: 'Bài 2: Phép tính nhanh', lessonNumber: 2, durationMinutes: 30, status: 'pending' },
    ],
    totalLessons: 2,
    totalMinutes: 60,
    date: '2026-08-19',
    startTime: '19:00',
    endTime: '20:00',
    roomName: 'Phòng tự học Digi',
    status: 'da_xep_lich',
  },
  {
    id: 'DG-2608-010',
    studentId: 's-haidang',
    studentName: 'Nguyễn Hải Đăng',
    studentEnglishName: 'Harry',
    studentPhoneMasked: '0934****22',
    packageName: 'Digi English Starter (48 bài)',
    branch: 'RinoEdu Linh Đàm',
    selectedLessons: [
      { lessonId: 'LES-ENG-05', lessonName: 'Bài 5: Family & Friends', lessonNumber: 5, durationMinutes: 30, status: 'pending' },
    ],
    totalLessons: 1,
    totalMinutes: 30,
    date: '2026-08-19',
    startTime: '19:30',
    endTime: '20:00',
    roomName: 'Phòng tự học Digi',
    deviceCode: 'iPad-01',
    status: 'da_xep_lich',
  },
]

/**
 * Calculates end time given start time string "HH:mm" and duration minutes
 */
export function calculateEndTime(startTime: string, durationMinutes: number): string {
  if (!startTime) return '18:30'
  const [hStr, mStr] = startTime.split(':')
  const totalMin = parseInt(hStr, 10) * 60 + parseInt(mStr, 10) + durationMinutes
  const endH = Math.floor(totalMin / 60) % 24
  const endM = totalMin % 60
  return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`
}

/**
 * Checks remaining capacity for a given room, date, and time range
 */
export function getRoomRemainingCapacity(
  bookings: DigiStudentBooking[],
  roomName: string,
  date: string,
  startTime: string,
  endTime: string
): { maxCapacity: number; occupiedCount: number; remaining: number } {
  const maxCapacity = MOCK_ROOMS_CAPACITY[roomName] || 10
  
  // Count active/scheduled bookings in the same room & overlapping time
  const occupiedCount = bookings.filter((b) => {
    // Treat 'Phòng Digi' and 'Phòng tự học Digi' consistently
    const matchesRoom =
      b.roomName === roomName ||
      (roomName === 'Phòng tự học Digi' && b.roomName === 'Phòng Digi') ||
      (roomName === 'Phòng Digi' && b.roomName === 'Phòng tự học Digi')
    if (!matchesRoom || b.date !== date) return false
    if (b.status === 'cancelled' || b.status === 'da_vang') return false
    // Time overlap check: startA < endB && endA > startB
    return b.startTime < endTime && b.endTime > startTime
  }).length

  const remaining = Math.max(0, maxCapacity - occupiedCount)
  return { maxCapacity, occupiedCount, remaining }
}
