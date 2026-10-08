import type { ClassRecord } from '@/mocks/classRecords'
import type { Student } from '@/mocks/students'
import { mockStudents } from '@/mocks/students'
import { mockBookingTests } from '@/mocks/bookingTests'
import { mockLeads } from '@/mocks/crmLeads'

/**
 * Checks if a class is suitable for a student based on branch, level, and active enrollment status
 */
export function isClassSuitable(
  cls: ClassRecord,
  studentBranch: string,
  studentLevel?: string
): boolean {
  // 1. Branch match (cùng cơ sở đã chọn theo gói)
  const isBranchMatch = !studentBranch || cls.branch === studentBranch

  // 2. Level match (khớp hoặc tương thích trình độ đã test)
  let isLevelMatch = true
  if (studentLevel) {
    const sLevel = studentLevel.toLowerCase().trim()
    const cLevel = (cls.level || '').toLowerCase().trim()
    const cName = (cls.name || '').toLowerCase()

    isLevelMatch =
      cLevel.includes(sLevel) ||
      sLevel.includes(cLevel) ||
      (sLevel.includes('ielts') && (cLevel.includes('ielts') || cName.includes('ielts'))) ||
      (sLevel.includes('toán') && (cLevel.includes('toán') || cName.includes('toán'))) ||
      (sLevel.includes('level') && cLevel.includes('level')) ||
      (sLevel.includes('beginner') && cLevel.includes('beginner'))
  }

  // 3. Status match: Lớp đang mở hoặc chờ khai giảng
  const isActiveStatus = cls.status === 'dang_hoc' || cls.status === 'cho_khai_giang'

  return isBranchMatch && isLevelMatch && isActiveStatus
}

/**
 * Sorts classes putting suitable classes at the very top
 */
export function sortClassesWithSuitableFirst(
  classes: ClassRecord[],
  studentBranch: string,
  studentLevel?: string
): ClassRecord[] {
  return [...classes].sort((a, b) => {
    const aSuitable = isClassSuitable(a, studentBranch, studentLevel) ? 1 : 0
    const bSuitable = isClassSuitable(b, studentBranch, studentLevel) ? 1 : 0
    if (aSuitable !== bSuitable) {
      return bSuitable - aSuitable // Suitable first
    }
    return a.name.localeCompare(b.name, 'vi')
  })
}

/**
 * Masks phone number in middle e.g. 091****111 per security rules
 */
export function formatPhoneMask(phone?: string): string {
  if (!phone) return '—'
  const clean = phone.replace(/\s+/g, '')
  if (clean.length < 7) return phone
  const start = clean.slice(0, 3)
  const end = clean.slice(-3)
  return `${start}****${end}`
}

/**
 * Formats full phone number with spaces for readable display e.g. 0912 345 678
 */
export function formatPhoneDisplay(phone?: string): string {
  if (!phone) return '—'
  const clean = phone.replace(/\s+/g, '')
  if (clean.length === 10) {
    return `${clean.slice(0, 4)} ${clean.slice(4, 7)} ${clean.slice(7)}`
  }
  return phone
}

/**
 * Splits formatted session date string into date and session topic/name parts
 */
export function parseSessionDateParts(dateStr: string): { dateStr: string; sessionContent: string } {
  if (!dateStr) return { dateStr: '', sessionContent: '' }
  const match = dateStr.match(/^(.*?)\s*\((Buổi.*?)\)$/)
  if (match) {
    return {
      dateStr: match[1].trim(),
      sessionContent: match[2].trim(),
    }
  }
  return { dateStr, sessionContent: '' }
}

/**
 * Calculates student age from date of birth
 */
export function calculateStudentAge(dob?: string): string {
  if (!dob) return '8 tuổi'
  const birthYear = new Date(dob).getFullYear()
  const currentYear = new Date().getFullYear()
  const age = currentYear - birthYear
  return age > 0 ? `${age} tuổi` : '8 tuổi'
}

/**
 * Formats birth year
 */
export function getBirthYear(dob?: string): string {
  if (!dob) return '2016'
  const year = new Date(dob).getFullYear()
  return isNaN(year) ? '2016' : String(year)
}

/**
 * Student Assessment & Parent info bundle for the Right Panel
 */
export interface StudentAssessmentDetails {
  studentName: string
  studentCode: string
  ageText: string
  genderText: string
  schoolClass: string
  schoolName: string
  currentLevel: string
  isTestLevel: boolean
  testScoreSummary?: string
  testResultLink?: string
  learningPath: string
  parentName: string
  parentPhone: string
  parentAddress: string
  branch: string
  initialNotes?: string
}

/**
 * Retrieves full assessment details and parent information for a student
 */
export function getStudentAssessmentDetails(
  studentProp?: Student | null,
  studentNameParam?: string,
  studentCodeParam?: string,
  studentBranchParam?: string,
  studentLevelParam?: string,
  isTestLevelParam?: boolean
): StudentAssessmentDetails {
  // Find matching student
  const student =
    studentProp ||
    mockStudents.find(
      (s) =>
        (studentCodeParam && (s.id === studentCodeParam || s.id.replace('s-', '') === studentCodeParam.replace('STU-00-', ''))) ||
        (studentNameParam && s.name.toLowerCase() === studentNameParam.toLowerCase())
    ) ||
    mockStudents[0]

  const sName = student?.name || studentNameParam || 'Học viên'
  const sCode = studentCodeParam || (student ? (student.id.startsWith('s-') ? `STU-00-${student.id.replace('s-', '')}` : `STU-00${student.id}`) : 'STU-001')
  const sBranch = student?.branch || studentBranchParam || 'RinoEdu Nguyễn Tuân'
  const sLevel = studentLevelParam || student?.level || 'Level 1'

  // Find linked assessment / test booking
  const testMatch = mockBookingTests.find(
    (t) =>
      t.childName.toLowerCase() === sName.toLowerCase() ||
      (student?.phone && t.phone === student.phone) ||
      (student?.parentPhone && t.phone === student.parentPhone)
  )

  // Find linked lead
  const leadMatch = mockLeads.find(
    (l) =>
      l.studentName.toLowerCase() === sName.toLowerCase() ||
      (student?.phone && l.phone === student.phone) ||
      (student?.parentPhone && l.phone === student.parentPhone)
  )

  const dob = student?.dob || testMatch?.dob || '2016-05-18'
  const age = calculateStudentAge(dob)
  const birthYear = getBirthYear(dob)
  const ageText = `${age} (${birthYear})`

  const genderText =
    student?.gender === 'Female' || testMatch?.gender === 'Female' || testMatch?.gender === 'Nữ'
      ? 'Nữ'
      : 'Nam'

  const schoolClass =
    student?.schoolClass ||
    'Lớp 3'

  const schoolName =
    testMatch?.schoolName ||
    leadMatch?.schoolName ||
    'Tiểu học Lương Định Của (Quận 3)'

  // Trình độ hiện tại của học viên (Trình độ phụ trong ngoặc nếu có)
  const effectiveSubLevel =
    student?.subLevel ||
    testMatch?.testResult?.subLevel

  const currentLevel =
    effectiveSubLevel
      ? `${sLevel} (${effectiveSubLevel.replace(/^Sub-level\s*/i, '')})`
      : sLevel

  // Mặc định không phải là trình độ test! Chỉ là test khi được chỉ định hoặc khi học viên mới làm test/chờ xếp lớp
  const isTestLevel =
    isTestLevelParam !== undefined
      ? isTestLevelParam
      : Boolean(
          testMatch?.testResult &&
          (student?.status === 'wait_for_assignment' || student?.status === 'trial')
        )

  let testScoreSummary: string | undefined = undefined
  let testResultLink: string | undefined = undefined

  if (testMatch?.testResult) {
    const parts: string[] = []
    if (testMatch.testResult.speaking) parts.push(`Speaking: ${testMatch.testResult.speaking}`)
    if (testMatch.testResult.lwr) parts.push(`L/W/R: ${testMatch.testResult.lwr}`)
    testScoreSummary = parts.length > 0 ? parts.join(' • ') : 'Đạt chuẩn kiểm tra đầu vào'
    testResultLink = testMatch.resultLink || `/app/booking-test?testId=${testMatch.id}`
  } else if (leadMatch?.academicPerformance) {
    testScoreSummary = `Học lực: ${leadMatch.academicPerformance}`
  }

  const learningPath =
    testMatch?.testResult?.path ||
    student?.learningPath ||
    student?.curriculum ||
    'Lộ trình Cambridge Young Learners chuẩn'

  const parentName =
    student?.parentName ||
    testMatch?.parentName ||
    leadMatch?.parentName ||
    'Nguyễn Thu Trang (Mẹ)'

  const parentPhone =
    student?.parentPhone ||
    testMatch?.phone ||
    leadMatch?.phone ||
    '0912345678'

  const parentAddress =
    testMatch?.address ||
    leadMatch?.address ||
    'Phường Võ Thị Sáu, Quận 3, TP.HCM'

  const initialNotes =
    student?.notes ||
    testMatch?.msg ||
    (testMatch?.notes && testMatch.notes.length > 0 ? testMatch.notes[0].text : undefined) ||
    'Tiếp thu nhanh, cần tăng phản xạ tương tác'

  return {
    studentName: sName,
    studentCode: sCode,
    ageText,
    genderText,
    schoolClass,
    schoolName,
    currentLevel,
    isTestLevel,
    testScoreSummary,
    testResultLink,
    learningPath,
    parentName,
    parentPhone,
    parentAddress,
    branch: sBranch,
    initialNotes,
  }
}

export interface PlacementZaloMessageParams {
  studentName: string
  studentCode: string
  parentName?: string
  packageName: string
  pkgRemainingSessions: number
  className: string
  classRoom?: string
  branch: string
  startSessionDate: string
  teacherName?: string
  isTransfer?: boolean
  oldClassName?: string
}

/**
 * Generates Zalo summary message text for parents
 * Formatted gracefully for official class placement or class transfer
 */
export function generatePlacementZaloMessage({
  studentName,
  studentCode,
  parentName,
  packageName,
  pkgRemainingSessions,
  className,
  classRoom,
  branch,
  startSessionDate,
  teacherName,
  isTransfer = false,
  oldClassName,
}: PlacementZaloMessageParams): string {
  const parentGreeting = parentName ? `Quý phụ huynh ${parentName}` : 'Quý phụ huynh Nguyễn Thu Trang'
  const roomText = classRoom && classRoom !== '—' ? classRoom : 'B201'
  const teacherText = teacherName || 'Nguyễn Mạnh Hùng & Hoàng Thị Mai'
  const startDateText = startSessionDate || 'Thứ 2, 11/05/2026 (Buổi 4: Grammar Structures in Writing/Speaking)'

  if (isTransfer) {
    // Mẫu tin nhắn chuyển đổi lớp học (Trạng thái Chờ chuyển lớp)
    const lines = [
      `🔄 THÔNG BÁO ĐIỀU CHỈNH & CHUYỂN ĐỔI LỚP HỌC - RINOEDU 🔄`,
      `Kính gửi ${parentGreeting},`,
      `Hệ thống RinoEdu xin gửi thông tin cập nhật chuyển đổi lớp học của học viên:`,
      `👤 Học viên: ${studentName} (${studentCode})`,
      `📦 Gói học: ${packageName} (Số buổi: ${pkgRemainingSessions} buổi)`,
      ...(oldClassName ? [`🔁 Lớp cũ: ${oldClassName}`] : []),
      `🏫 Lớp chuyển đến: ${className}`,
      `⏰ Buổi bắt đầu: ${startDateText}`,
      `📍 Cơ sở: ${branch}`,
      `🚪 Phòng học: ${roomText}`,
      `👩‍🏫 Giáo viên phụ trách: ${teacherText}`,
      `👉 Lưu ý: Ba/Mẹ vui lòng đưa bé đến trước giờ học 10 phút để nhận học liệu và làm quen lớp mới nhé ạ!`,
    ]
    return lines.join('\n')
  }

  // Mẫu tin nhắn xếp lớp học chính thức (Trạng thái Chờ xếp lớp)
  const lines = [
    `🌟 XÁC NHẬN XẾP LỚP HỌC CHÍNH THỨC - RINOEDU 🌟`,
    `Kính gửi ${parentGreeting},`,
    `Hệ thống RinoEdu xin gửi thông tin phân bổ lớp học chính thức của học viên:`,
    `👤 Học viên: ${studentName} (${studentCode})`,
    `📦 Gói học: ${packageName} (Số buổi: ${pkgRemainingSessions} buổi)`,
    `🏫 Lớp học: ${className}`,
    `⏰ Buổi bắt đầu: ${startDateText}`,
    `📍 Cơ sở: ${branch}`,
    `🚪 Phòng học: ${roomText}`,
    `👩‍🏫 Giáo viên phụ trách: ${teacherText}`,
    `👉 Lưu ý: Ba/Mẹ vui lòng đưa bé đến trước giờ học 10 phút để nhận học liệu nhé ạ!`,
  ]
  return lines.join('\n')
}

/**
 * Derives package type from Subject, Class Type, and Teacher Type
 */
export function derivePackageTypeInfo(
  packageName: string,
  subject?: string,
  level?: string
): string {
  const pName = packageName.toLowerCase()
  const sSub = (subject || '').toLowerCase()
  const sLvl = (level || '').toLowerCase()

  // 1. Môn học
  let subjectText = 'Tiếng Anh'
  if (pName.includes('toán') || sSub.includes('toán') || sSub.includes('math') || sLvl.includes('toán')) {
    subjectText = 'Toán Tư Duy'
  } else if (pName.includes('stem') || sSub.includes('stem')) {
    subjectText = 'STEM Robotics'
  } else if (pName.includes('nhật') || sSub.includes('japanese')) {
    subjectText = 'Tiếng Nhật'
  } else if (pName.includes('ielts') || sLvl.includes('ielts')) {
    subjectText = 'Tiếng Anh IELTS'
  } else if (pName.includes('giao tiếp')) {
    subjectText = 'Tiếng Anh Giao Tiếp'
  }

  // 2. Loại lớp
  let classTypeText = 'Lớp tiêu chuẩn'
  if (pName.includes('1:1') || pName.includes('1 kèm 1')) {
    classTypeText = 'Gia sư 1:1'
  } else if (pName.includes('1:6') || pName.includes('1-6')) {
    classTypeText = 'Nhóm nhỏ 1:6'
  } else if (pName.includes('1:4') || pName.includes('1-4')) {
    classTypeText = 'Nhóm 1:4'
  } else if (pName.includes('bổ trợ') || pName.includes('bo tro')) {
    classTypeText = 'Lớp bổ trợ'
  } else if (pName.includes('gia sư') || pName.includes('gia su')) {
    classTypeText = 'Gia sư nhóm'
  }

  // 3. Loại giáo viên
  let teacherTypeText = 'Giáo viên Việt Nam'
  if (pName.includes('bản ngữ') || pName.includes('native')) {
    teacherTypeText = 'Giáo viên Bản ngữ'
  } else if (pName.includes('ielts') && (pName.includes('8.') || pName.includes('7.5') || pName.includes('cao cấp'))) {
    teacherTypeText = 'Giáo viên IELTS 8.0+'
  }

  return `${subjectText} • ${classTypeText} • ${teacherTypeText}`
}

export interface SessionLessonDetails {
  topic: string
  words?: string
  sentences?: string
  phonics?: string
}

/**
 * Derives rich lesson content (Chủ đề, Từ vựng, Mẫu câu, Ngữ âm/Hoạt động)
 */
export function getSessionLessonDetails(
  sessionNumber: number,
  topic: string,
  className?: string
): SessionLessonDetails {
  const isMath =
    (className || '').toLowerCase().includes('toán') ||
    (className || '').toLowerCase().includes('math')
  const isStem =
    (className || '').toLowerCase().includes('stem') ||
    (className || '').toLowerCase().includes('robot')

  if (isMath) {
    const mathTopics = [
      {
        words: 'Số tự nhiên, Phép cộng, Số hạng, Tổng',
        sentences: 'Phương pháp cộng trong phạm vi 10 và đố vui.',
        phonics: 'Thực hành thao tác que tính & thẻ số',
      },
      {
        words: 'Phép trừ, Số bị trừ, Số trừ, Hiệu',
        sentences: 'Phương pháp trừ trong phạm vi 10 và bài toán đố.',
        phonics: 'Thực hành tách gộp nhóm đồ vật',
      },
      {
        words: 'Hình tròn, Hình vuông, Tam giác, Khối hộp',
        sentences: 'Nhận biết và gọi tên chính xác các khối hình học.',
        phonics: 'Lắp ráp sa bàn hình học không gian',
      },
      {
        words: 'Dài hơn, Ngắn hơn, Cao hơn, Thấp hơn',
        sentences: 'So sánh kích thước và đo lường trực quan.',
        phonics: 'Hoạt động đo đạc đồ dùng học tập',
      },
      {
        words: 'Quy luật, Dãy số, Chuỗi logic xen kẽ',
        sentences: 'Phát hiện quy luật chuỗi hình ảnh và điền số tiếp theo.',
        phonics: 'Trò chơi tìm mảnh ghép logic phù hợp',
      },
    ]
    const item = mathTopics[(sessionNumber - 1) % mathTopics.length]
    return {
      topic: topic || `Bài ${sessionNumber}: Khám phá toán học tư duy`,
      words: item.words,
      sentences: item.sentences,
      phonics: item.phonics,
    }
  }

  if (isStem) {
    const stemTopics = [
      {
        words: 'Motor, Gear, Axle, Speed',
        sentences: 'How do gears transfer motion in mechanics?',
        phonics: 'Thực hành lắp ráp mô hình quay bánh răng',
      },
      {
        words: 'Ultrasonic Sensor, Light, Loop',
        sentences: 'Programming robot to stop before obstacles.',
        phonics: 'Thử nghiệm cảm biến siêu âm khoảng cách',
      },
      {
        words: 'Line follower, Logic, Algorithm',
        sentences: 'Robot follows the track smoothly and accurately.',
        phonics: 'Thử thách đường đua xe tự hành',
      },
    ]
    const item = stemTopics[(sessionNumber - 1) % stemTopics.length]
    return {
      topic: topic || `Bài ${sessionNumber}: Khám phá STEM Robotics`,
      words: item.words,
      sentences: item.sentences,
      phonics: item.phonics,
    }
  }

  // English / IELTS / Default (as displayed in screenshot)
  const englishTopics = [
    {
      topic: 'Bài 1: Khởi động & Khám phá chủ đề',
      words: 'Vocabulary, Expression, Basic patterns',
      sentences: 'Daily conversation practice.',
      phonics: 'Phát âm chuẩn & tương tác tự tin',
    },
    {
      topic: 'Bài 2: Thực hành giao tiếp & Tương tác nhóm',
      words: 'Key vocabulary, Speaking phrases',
      sentences: 'Role-play in real classroom situations.',
      phonics: 'Thực hành phản xạ tương tác',
    },
    {
      topic: 'Bài 3: Cấu trúc ngữ pháp & Luyện viết câu',
      words: 'Grammar words, Connectors, Collocations',
      sentences: 'Complex sentence structures in speaking & writing.',
      phonics: 'Luyện ngữ điệu & trọng âm câu',
    },
    {
      topic: 'Bài 4: Chiến thuật đọc hiểu & Bắt từ khóa',
      words: 'Academic words, Skimming clues, Synonyms',
      sentences: 'Strategies for identifying main ideas quickly.',
      phonics: 'Phát âm chuẩn IPA & nối âm',
    },
    {
      topic: 'Bài 5: Ôn tập & Dự án trải nghiệm nhóm',
      words: 'Project vocabulary, Presentation words',
      sentences: 'Group discussion & presentation challenge.',
      phonics: 'Thuyết trình tự tin trước đám đông',
    },
  ]
  const item = englishTopics[(sessionNumber - 1) % englishTopics.length]
  return {
    topic:
      sessionNumber === 1
        ? 'Bài 1: Khởi động & Khám phá chủ đề'
        : topic && !topic.startsWith('Buổi')
        ? topic
        : item.topic,
    words: item.words,
    sentences: item.sentences,
    phonics: item.phonics,
  }
}


