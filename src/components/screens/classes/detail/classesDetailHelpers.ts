import type { ClassRecord } from '@/mocks/classRecords'
import { mockStudents } from '@/mocks/students'
import type { RosterStudent, RoadmapSession, StudentTag } from './classesDetailTypes'
import { stableHash } from './classesSessionDetailHelpers'

// Mask phone to format 090****294
export function maskPhone(phone?: string): string {
  if (!phone) return '—'
  const clean = phone.replace(/\s+/g, '')
  if (clean.length < 7) return clean
  return `${clean.substring(0, 3)}****${clean.substring(clean.length - 3)}`
}

// Strip teacher honorifics ("Cô", "Thầy", "GV") from teacher names
export function cleanTeacherName(teacherName?: string): string {
  if (!teacherName) return ''
  return teacherName
    .replace(/(^|\s+)(Cô|Thầy|GV)\s+/gi, '$1')
    .trim()
}

// Strip assistant title ("Trợ giảng", "TA") from assistant names
export function cleanAssistantName(assistantName?: string): string {
  if (!assistantName) return ''
  return assistantName
    .replace(/(^|\s+)(Trợ giảng|TA)\s+/gi, '$1')
    .trim()
}

// Filter students roster by tag
export function filterRosterStudents(
  students: RosterStudent[],
  filter: 'all' | 'active' | 'new' | 'trial' | 'reserve_transfer' | 'inactive'
): RosterStudent[] {
  return students.filter((student) => {
    if (filter === 'active') return student.status === 'active'
    if (filter === 'new') return student.status === 'new'
    if (filter === 'trial') return student.status === 'trial'
    if (filter === 'reserve_transfer') return student.status === 'reserve' || student.status === 'transferred'
    if (filter === 'inactive') return student.status === 'dropout' || student.status === 'session_ended'
    return true
  })
}

function generateParents(parentName: string, parentPhone: string) {
  const isFather = parentName.includes('Văn') || 
                   parentName.includes('Nam') || 
                   parentName.includes('H') || 
                   parentName.includes('C') || 
                   parentName.includes('L') ||
                   parentName.endsWith('A')
  
  const relationship1 = isFather ? 'Bố' : 'Mẹ'
  const name1 = parentName
  const phone1 = parentPhone

  const isSecondFather = !isFather
  let name2 = ''
  if (isSecondFather) {
    name2 = parentName
      .replace(/Thị|Lan|Mai|Hoa|B/g, 'Văn')
      .replace('K', 'Hùng')
      .replace('G', 'Dũng')
      .replace('H', 'Khánh')
    if (name2 === parentName) {
      name2 = 'Nguyễn Văn Nam'
    }
  } else {
    name2 = parentName
      .replace(/Văn|Nam|H|C|L/g, 'Thị')
      .replace('A', 'Lan')
      .replace('D', 'Phương')
    if (name2 === parentName) {
      name2 = 'Trần Thị Lan'
    }
  }

  const lastDigit = Number(parentPhone.slice(-1))
  const phone2 = parentPhone.slice(0, -1) + (isNaN(lastDigit) ? '5' : (lastDigit === 9 ? '8' : String(lastDigit + 1)))

  return [
    { name: name1, phone: phone1, relationship: relationship1 },
    { name: name2, phone: phone2, relationship: isSecondFather ? 'Bố' : 'Mẹ' }
  ]
}

function generateMockNote(status: string, index: number): string {
  const notesMap: Record<string, string[]> = {
    active: [
      "Học viên tiếp thu bài nhanh, rất năng nổ phát biểu bài. Tuy nhiên cần chú ý sửa thêm lỗi phát âm đuôi.",
      "Làm bài tập đầy đủ, thái độ học tập tích cực. Rất thích chơi các mini game tiếng Anh trên lớp.",
      "Hơi trầm tính, ít khi chủ động giơ tay phát biểu nhưng làm bài tập viết rất tốt."
    ],
    trial: [
      "Học thử buổi đầu tiên. Tiếp thu khá tốt, hào hứng tham gia hoạt động nhóm. Phụ huynh mong muốn được cập nhật tiến độ sau mỗi buổi học.",
      "Buổi học thử. Còn hơi nhút nhát, cần giáo viên gọi tên nhiều để tăng tính tương tác."
    ],
    reserve: [
      "Bảo lưu tạm thời 2 tháng vì lý do gia đình đi du lịch nước ngoài dài ngày. Sẽ kích hoạt học lại từ tháng sau."
    ],
    transferred: [
      "Đã chuyển sang từ lớp cùng trình độ khác do đổi lịch học thêm văn hóa ở trường."
    ],
    new: [
      "Học viên mới ghi danh chưa tham gia buổi nào. Cần giáo vụ gửi tài liệu hướng dẫn và add vào group lớp."
    ],
    dropout: [
      "Gia đình xin cho học viên nghỉ học vì không sắp xếp được thời gian đưa đón."
    ],
    session_ended: [
      "Học viên đã hoàn thành số buổi đăng ký. Phụ huynh đang cân nhắc việc gia hạn thêm gói học phí 6 tháng tiếp theo."
    ]
  }
  const list = notesMap[status] || ["Học viên học tập bình thường, không có ghi chú đặc biệt."]
  return list[index % list.length]
}

// ── Mock tag catalog ──
const MOCK_TAG_CATALOG: Omit<StudentTag, 'id' | 'note' | 'assignedBy' | 'assignedDate'>[] = [
  { tagType: 'new_student', emoji: '🆕', label: 'Học viên mới', color: 'teal', description: 'Học viên mới vào lớp, cần quan tâm đặc biệt trong 3 buổi đầu.', isAutomatic: true },
  { tagType: 'vip', emoji: '⭐', label: 'VIP', color: 'amber', description: 'Phụ huynh / học viên quan trọng, cần chăm sóc đặc biệt.', isAutomatic: false },
  { tagType: 'attention', emoji: '⚠️', label: 'Cần chú ý', color: 'rose', description: 'Học viên có vấn đề học tập hoặc hành vi cần theo dõi.', isAutomatic: false },
  { tagType: 'makeup', emoji: '🔄', label: 'Học bù', color: 'violet', description: 'Học viên đang học bù từ lớp / buổi khác.', isAutomatic: true },
  { tagType: 'trial', emoji: '🎯', label: 'Học thử', color: 'sky', description: 'Học viên đang trong giai đoạn học thử.', isAutomatic: true },
  { tagType: 'teacher_note', emoji: '📌', label: 'Ghi chú GV', color: 'slate', description: 'Giáo viên đánh dấu để nhớ ghi chú riêng.', isAutomatic: false },
  { tagType: 'excellent', emoji: '🏆', label: 'Xuất sắc', color: 'emerald', description: 'Học viên có thành tích nổi bật trong học tập.', isAutomatic: false },
]

const MOCK_TAG_NOTES: Record<string, string> = {
  vip: 'Con của phụ huynh giới thiệu nhiều học viên khác.',
  attention: 'Em hay mất tập trung, cần nhắc nhở thường xuyên.',
  teacher_note: 'Nhớ hỏi em về bài kiểm tra tuần trước.',
  excellent: 'Điểm số tốt liên tục 3 buổi gần nhất.',
}

const MOCK_ASSIGNERS = ['Mỹ Linh', 'Thành Đạt', 'Hệ thống']

function generateMockTags(studentId: string): StudentTag[] {
  const hash = stableHash(studentId)
  const tags: StudentTag[] = []

  // Deterministic: ~40% of students get at least one tag
  if (hash % 5 > 1) return tags

  // Pick 1-3 tags based on hash
  const tagCount = (hash % 3) + 1
  const startIdx = hash % MOCK_TAG_CATALOG.length

  for (let i = 0; i < tagCount; i++) {
    const catalog = MOCK_TAG_CATALOG[(startIdx + i) % MOCK_TAG_CATALOG.length]
    const assigner = catalog.isAutomatic ? 'Hệ thống' : MOCK_ASSIGNERS[(hash + i) % MOCK_ASSIGNERS.length]
    tags.push({
      ...catalog,
      id: `tag-${studentId}-${catalog.tagType}`,
      note: MOCK_TAG_NOTES[catalog.tagType],
      assignedBy: assigner,
      assignedDate: `0${((hash + i) % 9) + 1}/07/2026`,
    })
  }

  return tags
}

// Generate dynamic mock roster based on class record
export function generateMockRoster(cls: ClassRecord): RosterStudent[] {
  // Pull students with same level if possible
  const levelStudents = mockStudents.filter((s) => s.level === cls.level || s.branch === cls.branch)
  const pool = levelStudents.length >= 5 ? levelStudents : mockStudents

  const roster: RosterStudent[] = []
  
  // Fill enrolled active students
  const activeCount = cls.status === 'nhap' ? (cls.enrolledStudents || 0) : Math.max(1, cls.enrolledStudents)
  for (let i = 0; i < activeCount; i++) {
    const s = pool[i % pool.length]
    const pName = s.parentName || 'Nguyễn Văn Phụ Huynh'
    const pPhone = s.parentPhone || '0901234567'
    let displayName = s.name
    if (i === 0) displayName = `Alex (${s.name})`
    else if (i === 2) displayName = `Annie (${s.name})`
    else if (i === 3) displayName = `Lemon (${s.name})`

    const sessionLabel =
      i === 4 ? 'buoi_1' :
      i === 5 ? 'buoi_2' :
      i === 6 ? 'buoi_3' :
      i === 7 ? 'buoi_cuoi' : undefined

    roster.push({
      id: `${s.id}-act-${i}`,
      name: displayName,
      code: `HV-${s.id.toUpperCase()}-${i}`,
      status: 'active',
      dob: s.dob || '2008-05-12',
      parentName: pName,
      parentPhone: pPhone,
      enrollmentDate: s.enrollmentDate || cls.startDate,
      parents: generateParents(pName, pPhone),
      note: generateMockNote('active', i),
      avatar: s.avatar,
      sessionLabel,
      level: s.level,
      tags: generateMockTags(`${s.id}-act-${i}`),
    })
  }

  // Add some trial students if applicable
  const hasTrialDefault = (stableHash(cls.id) % 3 !== 0) // ~67% of classes default to having trial students
  const trialCount = cls.trialStudents !== undefined 
    ? cls.trialStudents 
    : (cls.status === 'dang_hoc' && hasTrialDefault ? 1 : 0)
  for (let i = 0; i < trialCount; i++) {
    const s = pool[(activeCount + i) % pool.length]
    const pName = s.parentName || 'Nguyễn Văn Phụ Huynh'
    const pPhone = s.parentPhone || '0902345678'
    roster.push({
      id: `${s.id}-tri-${i}`,
      name: `${s.name} (Trial)`,
      code: `HV-${s.id.toUpperCase()}-T-${i}`,
      status: 'trial',
      dob: s.dob || '2009-08-15',
      parentName: pName,
      parentPhone: pPhone,
      enrollmentDate: cls.startDate,
      parents: generateParents(pName, pPhone),
      note: generateMockNote('trial', i),
      avatar: s.avatar,
      level: s.level
    })
  }

  // Add 1 Reserved and 1 Transferred student for demonstration if class is In Progress
  if (cls.status === 'dang_hoc') {
    const s1 = pool[(activeCount + trialCount) % pool.length]
    const pName1 = s1.parentName || 'Lê Thị Mẹ'
    const pPhone1 = '0909876543'
    roster.push({
      id: `${s1.id}-res`,
      name: s1.name,
      code: `HV-${s1.id.toUpperCase()}-R`,
      status: 'reserve',
      dob: s1.dob || '2007-03-20',
      parentName: pName1,
      parentPhone: pPhone1,
      enrollmentDate: cls.startDate,
      parents: generateParents(pName1, pPhone1),
      note: generateMockNote('reserve', 0),
      avatar: s1.avatar,
      level: s1.level
    })

    const s2 = pool[(activeCount + trialCount + 1) % pool.length]
    const pName2 = s2.parentName || 'Trần Văn Bố'
    const pPhone2 = '0905556667'
    roster.push({
      id: `${s2.id}-tra`,
      name: s2.name,
      code: `HV-${s2.id.toUpperCase()}-C`,
      status: 'transferred',
      dob: s2.dob || '2006-11-22',
      parentName: pName2,
      parentPhone: pPhone2,
      enrollmentDate: cls.startDate,
      parents: generateParents(pName2, pPhone2),
      note: generateMockNote('transferred', 0),
      avatar: s2.avatar,
      level: s2.level
    })

    // Add newly enrolled students if applicable (~50% chance based on class ID)
    const hasNewStudents = stableHash(cls.id) % 2 === 0
    if (hasNewStudents) {
      // Add 2 newly enrolled students (never attended a class)
      const s3 = pool[(activeCount + trialCount + 2) % pool.length]
      const pName3 = s3.parentName || 'Nguyễn Phú Hộ'
      const pPhone3 = '0901112223'
      roster.push({
        id: `${s3.id}-new-1`,
        name: `${s3.name} (Mới)`,
        code: `HV-${s3.id.toUpperCase()}-N1`,
        status: 'new',
        dob: s3.dob || '2009-01-10',
        parentName: pName3,
        parentPhone: pPhone3,
        enrollmentDate: cls.startDate,
        parents: generateParents(pName3, pPhone3),
        note: generateMockNote('new', 0),
        avatar: s3.avatar,
        level: s3.level
      })

      const s4 = pool[(activeCount + trialCount + 3) % pool.length]
      const pName4 = s4.parentName || 'Vương Gia Bố'
      const pPhone4 = '0903334445'
      roster.push({
        id: `${s4.id}-new-2`,
        name: `${s4.name} (Mới)`,
        code: `HV-${s4.id.toUpperCase()}-N2`,
        status: 'new',
        dob: s4.dob || '2008-12-15',
        parentName: pName4,
        parentPhone: pPhone4,
        enrollmentDate: cls.startDate,
        parents: generateParents(pName4, pPhone4),
        note: generateMockNote('new', 1),
        avatar: s4.avatar,
        level: s4.level
      })
    }

    // Add 1 Dropout (Đã nghỉ học) and 1 Session Ended (Hết buổi)
    const s5 = pool[(activeCount + trialCount + 4) % pool.length]
    const pName5 = s5.parentName || 'Phan Bùi Phụ Huynh'
    const pPhone5 = '0907778889'
    roster.push({
      id: `${s5.id}-dro`,
      name: `${s5.name} (Nghỉ)`,
      code: `HV-${s5.id.toUpperCase()}-D`,
      status: 'dropout',
      dob: s5.dob || '2007-06-18',
      parentName: pName5,
      parentPhone: pPhone5,
      enrollmentDate: cls.startDate,
      parents: generateParents(pName5, pPhone5),
      note: generateMockNote('dropout', 0),
      avatar: s5.avatar,
      level: s5.level
    })

    const s6 = pool[(activeCount + trialCount + 5) % pool.length]
    const pName6 = s6.parentName || 'Đỗ Hoàng Bố'
    const pPhone6 = '0908889990'
    roster.push({
      id: `${s6.id}-end`,
      name: `${s6.name} (Hết buổi)`,
      code: `HV-${s6.id.toUpperCase()}-E`,
      status: 'session_ended',
      dob: s6.dob || '2008-04-05',
      parentName: pName6,
      parentPhone: pPhone6,
      enrollmentDate: cls.startDate,
      parents: generateParents(pName6, pPhone6),
      note: generateMockNote('session_ended', 0),
      avatar: s6.avatar,
      level: s6.level
    })
  }

  return roster
}

// Generate dynamic 12-session linear learning roadmap
export function generateRoadmapSessions(cls: ClassRecord): RoadmapSession[] {
  if (!cls.syllabus || cls.syllabus === '—' || cls.syllabus === '') {
    return []
  }
  const isMath = cls.level?.toLowerCase().includes('math') || cls.name?.toLowerCase().includes('math')
  const topics = isMath ? [
    { topic: 'Orientation & Number Sense', desc: 'Làm quen với các chữ số, tập đếm và các khái niệm toán học cơ bản đầu tiên.' },
    { topic: 'Unit 1: Basic Shapes and Sorting', desc: 'Phân loại các khối hình học cơ bản như hình vuông, tròn, tam giác.' },
    { topic: 'Addition within 10', desc: 'Phương pháp thực hiện phép tính cộng trong phạm vi 10 sử dụng giáo cụ trực quan.' },
    { topic: 'Subtraction within 10', desc: 'Phương pháp thực hiện phép tính trừ trong phạm vi 10 và các bài toán thực tế đơn giản.' },
    { topic: 'Unit 2: Length and Comparison', desc: 'So sánh độ dài ngắn, lớn nhỏ, cao thấp của các vật thể và số lượng.' },
    { topic: 'Logic & Patterns', desc: 'Tìm hiểu quy luật của các chuỗi hình vẽ, chuỗi số lượng và phát triển tư duy logic.' },
    { topic: 'Basic Word Problems', desc: 'Làm quen với cách phân tích đề bài toán có lời văn ngắn và tìm phép tính thích hợp.' },
    { topic: 'Mid-term Assessment & Math Quiz', desc: 'Bài kiểm tra năng lực giữa kỳ đánh giá tư duy hình ảnh và tính toán của học viên.' },
    { topic: 'Unit 3: Addition & Subtraction within 20', desc: 'Mở rộng phép toán cộng trừ trong phạm vi 20 và luyện tập tính nhẩm nhanh.' },
    { topic: 'Time and Calendar Basics', desc: 'Làm quen với cách xem giờ chẵn trên đồng hồ và các ngày trong tuần.' },
    { topic: 'Unit 4: Geometry & Spatial Thinking', desc: 'Xác định vị trí trên, dưới, trái, phải và xếp hình từ các mảnh ghép cơ bản.' },
    { topic: 'Course Graduation & Feedback Review', desc: 'Tổng kết kết quả học tập toán học, trao chứng chỉ và tư vấn lộ trình tiếp theo.' }
  ] : [
    { topic: 'Orientation & Diagnostic Test', desc: 'Giới thiệu nội quy lớp học, làm bài đánh giá năng lực đầu vào và phân tích kỹ năng.' },
    { topic: 'Phonics lab: Nguyên âm ngắn', desc: 'Phương pháp nghe keywords và làm quen với chủ đề Daily Activities.' },
    { topic: 'Vocabulary for Academic Topics', desc: 'Nội dung chi tiết buổi học số 3 của lớp IELTS A1.' },
    { topic: 'Grammar Structures in Writing/Speaking', desc: 'Nội dung chi tiết buổi học số 4 của lớp IELTS A1.' },
    { topic: 'Reading Strategies & Skimming/Scanning', desc: 'Nội dung chi tiết buổi học số 5 của lớp IELTS A1.' },
    { topic: 'Listening Practice: Everyday Conversations', desc: 'Nội dung chi tiết buổi học số 6 của lớp IELTS A1.' },
    { topic: 'Speaking Practice: Part 2 Cue Cards', desc: 'Nội dung chi tiết buổi học số 7 của lớp IELTS A1.' },
    { topic: 'Mid-term Assessment & Review', desc: 'Bài kiểm tra giữa kỳ đánh giá 4 kỹ năng và buổi nhận xét cá nhân học viên.' },
    { topic: 'Unit 7: Advanced Reading & Summary Skills', desc: 'Bài đọc dài chuyên ngành khoa học, cách tóm tắt và nối tiêu đề đoạn văn.' },
    { topic: 'Unit 8: Writing Task 2 Outline & Body', desc: 'Cách lập dàn ý luận điểm chặt chẽ và viết đoạn thân bài thuyết phục.' },
    { topic: 'Full Practice Mock Test', desc: 'Làm đề thi thử trọn vẹn trong áp lực phòng thi thực tế.' },
    { topic: 'Course Graduation & Feedback Review', desc: 'Tổng kết kết quả khóa học, trao chứng chỉ và tư vấn lộ trình học tập tiếp theo.' }
  ]

  const baseDate = new Date(cls.startDate)
  const sessions: RoadmapSession[] = []

  for (let i = 0; i < 12; i++) {
    const sessionNum = i + 1
    const sessionDate = new Date(baseDate)
    sessionDate.setDate(baseDate.getDate() + i * 2) // mock: 2 days between sessions
    const dateStr = `${sessionDate.getDate().toString().padStart(2, '0')}/${(sessionDate.getMonth() + 1).toString().padStart(2, '0')}/${sessionDate.getFullYear()}`
    
    // Session 1 to 3 completed. Session 4 is ongoing. Session 5 is upcoming with substitute teacher.
    // Session 6 and 7 are cancelled so the detail tab mirrors the Figma card variants.
    let status: RoadmapSession['status'] = 'upcoming'
    if (sessionNum <= 3) {
      status = 'completed'
    } else if (sessionNum === 4) {
      status = 'ongoing'
    } else if (sessionNum === 6 || sessionNum === 7) {
      status = 'cancelled'
    }

    // Substitute teacher mock
    let substituteTeacherName: string | undefined = undefined
    if (sessionNum === 5) {
      substituteTeacherName = 'Cô Mai'
    }

    // Rescheduled date mock for session 8
    let originalDate: string | undefined = undefined
    let rescheduleDate: string | undefined = undefined
    if (sessionNum === 8) {
      originalDate = '13/05/2026'
      rescheduleDate = dateStr
    }

    // Classroom mock
    let room = cls.room
    if (sessionNum === 2) room = 'A102' // mock room change

    // Description (Note): Only completed sessions have pre-filled teacher remarks with @mentions
    let description = ''
    if (sessionNum === 1) {
      description = '@Nguyễn Hoàng Vũ tiếp thu bài nhanh, làm bài chuẩn 9/10. @Bảo Ngọc cần rèn thêm phần Speaking.'
    } else if (sessionNum === 2) {
      description = '@Trần Đức Anh hăng hái phát biểu trong giờ. @Hoàng Anh Tuấn nghỉ học có phép.'
    } else if (sessionNum === 3) {
      description = '@Phạm Minh Khoa làm bài kiểm tra đạt 8.5/10. @Lê Thanh Hằng hoàn thành tốt phần Listening.'
    }

    sessions.push({
      id: `session-${cls.id}-${sessionNum}`,
      sessionNumber: sessionNum,
      date: dateStr,
      startTime: '18:00',
      endTime: '19:30',
      topic: topics[i].topic,
      description,
      room,
      defaultRoom: cls.room,
      teacherName: cls.teacher,
      substituteTeacherName,
      originalDate,
      rescheduleDate,
      status,
      materials: (() => {
        // Only completed sessions have post-class attached photos/materials
        if (status !== 'completed') return []
        
        const baseMaterials = [
          { name: `Slide bài giảng Buổi ${sessionNum} (Slide.pdf)`, url: `https://storage.rinoedu.vn/materials/slide-buoi-${sessionNum}.pdf` },
          { name: `Bài tập về nhà Buổi ${sessionNum} (BTVN.docx)`, url: `https://storage.rinoedu.vn/homework/btvn-buoi-${sessionNum}.docx` }
        ]

        if (sessionNum === 1) {
          return [
            ...baseMaterials,
            { name: `Link làm bài online IELTS Mock Test ${sessionNum}`, url: `https://lms.rinoedu.vn/tests/ielts-mock-${sessionNum}` },
            { name: `Ảnh chụp bảng từ vựng quan trọng Buổi ${sessionNum}.png`, url: `https://storage.rinoedu.vn/images/board-${sessionNum}.png` }
          ]
        }
        if (sessionNum === 2) {
          return [
            ...baseMaterials,
            { name: `Video hướng dẫn phát âm Buổi ${sessionNum}.mp4`, url: `https://storage.rinoedu.vn/videos/pronunciation-${sessionNum}.mp4` }
          ]
        }
        return [
          ...baseMaterials,
          { name: `Bảng điểm chi tiết đợt đánh giá Buổi ${sessionNum}.xlsx`, url: `https://storage.rinoedu.vn/reports/scores-${sessionNum}.xlsx` }
        ]
      })(),
      syllabusName: cls.syllabus || 'Lộ trình mặc định ban đầu'
    })
  }

  return sessions
}

export interface RoadmapPhase {
  phaseNumber: number
  syllabusName: string
  startSession: number
  endSession: number
  sessions: RoadmapSession[]
  status: 'completed' | 'ongoing' | 'upcoming'
}

export function groupSessionsIntoPhases(sessions: RoadmapSession[]): RoadmapPhase[] {
  if (sessions.length === 0) return []
  const phases: RoadmapPhase[] = []
  let currentPhaseSessions: RoadmapSession[] = [sessions[0]]
  let currentSyllabus = sessions[0].syllabusName || 'Lộ trình mặc định ban đầu'

  for (let i = 1; i < sessions.length; i++) {
    const session = sessions[i]
    const syllabus = session.syllabusName || 'Lộ trình mặc định ban đầu'
    if (syllabus === currentSyllabus) {
      currentPhaseSessions.push(session)
    } else {
      phases.push({
        phaseNumber: phases.length + 1,
        syllabusName: currentSyllabus,
        startSession: currentPhaseSessions[0].sessionNumber,
        endSession: currentPhaseSessions[currentPhaseSessions.length - 1].sessionNumber,
        sessions: currentPhaseSessions,
        status: getPhaseStatus(currentPhaseSessions)
      })
      currentPhaseSessions = [session]
      currentSyllabus = syllabus
    }
  }
  phases.push({
    phaseNumber: phases.length + 1,
    syllabusName: currentSyllabus,
    startSession: currentPhaseSessions[0].sessionNumber,
    endSession: currentPhaseSessions[currentPhaseSessions.length - 1].sessionNumber,
    sessions: currentPhaseSessions,
    status: getPhaseStatus(currentPhaseSessions)
  })

  return phases
}

function getPhaseStatus(sessions: RoadmapSession[]): 'completed' | 'ongoing' | 'upcoming' {
  if (sessions.every(s => s.status === 'completed' || s.status === 'cancelled' || s.status === 'absent')) {
    return 'completed'
  }
  if (sessions.some(s => s.status === 'ongoing')) {
    return 'ongoing'
  }
  return 'upcoming'
}

export function validateClassForOpening(cls: ClassRecord, roster: RosterStudent[]): string[] {
  const errors: string[] = []

  if (!cls.name || !cls.name.trim()) {
    errors.push('Tên lớp không được để trống')
  }
  if (!cls.branch || !cls.branch.trim() || cls.branch === 'all') {
    errors.push('Chưa chọn chi nhánh/trường')
  }
  if (!cls.level || !cls.level.trim()) {
    errors.push('Chưa chọn môn học/trình độ')
  }
  if (!cls.startDate || cls.startDate === '---' || cls.startDate === '') {
    errors.push('Chưa chọn ngày bắt đầu')
  }
  if (!cls.syllabus || !cls.syllabus.trim() || cls.syllabus === '—') {
    errors.push('Chưa chọn chương trình')
  }
  if (roster.length === 0) {
    errors.push('Lớp học cần có ít nhất 1 học viên xếp lớp (Roster)')
  }

  if (!cls.scheduleSlots || cls.scheduleSlots.length === 0) {
    errors.push('Vui lòng kích hoạt ít nhất 1 ngày học trong tuần')
  } else {
    cls.scheduleSlots.forEach((slot, index) => {
      const roomVal = slot.room || cls.room
      if (!roomVal || roomVal === '---' || roomVal === 'Chưa gán') {
        errors.push(`Vui lòng chọn phòng học cho ca học thứ ${index + 1} (${slot.dayOfWeek})`)
      }

      const hasTeacher = (slot.teachers && slot.teachers.length > 0) || (cls.teacher && cls.teacher !== 'Chưa xếp lớp' && cls.teacher !== 'Chưa gán' && cls.teacher !== '—')
      if (!hasTeacher) {
        errors.push(`Vui lòng phân công phụ trách cho ca học thứ ${index + 1} (${slot.dayOfWeek})`)
      }
    })
  }

  return errors
}

export function determineRosterStudentStatus(
  originalStatus: string,
  sessionStatus: RoadmapSession['status']
): RosterStudent['status'] {
  if (sessionStatus === 'upcoming' || sessionStatus === 'ongoing') {
    return 'new'
  }
  if (originalStatus === 'trial') {
    return 'trial'
  }
  return 'active'
}

/**
 * Validates a class record for opening or saving active details.
 * Returns a key-value record of field-specific errors.
 */
export function validateClassForm(
  cls: ClassRecord,
  rosterLength: number
): Record<string, string> {
  const errors: Record<string, string> = {}
  
  if (!cls.name || !cls.name.trim()) {
    errors.name = 'Tên lớp không được để trống'
  }
  if (!cls.branch || !cls.branch.trim() || cls.branch === 'all') {
    errors.branch = 'Chưa chọn chi nhánh/trường'
  }
  if (!cls.level || !cls.level.trim()) {
    errors.level = 'Chưa chọn môn học/trình độ'
  }
  if (!cls.startDate || cls.startDate === '---' || cls.startDate === '') {
    errors.startDate = 'Chưa chọn ngày bắt đầu'
  }
  if (!cls.syllabus || !cls.syllabus.trim() || cls.syllabus === '—') {
    errors.syllabus = 'Chưa chọn chương trình'
  }
  if (rosterLength === 0) {
    errors.roster = 'Lớp học cần có ít nhất 1 học viên xếp lớp (Roster)'
  }

  if (!cls.scheduleSlots || cls.scheduleSlots.length === 0) {
    errors.schedule = 'Vui lòng kích hoạt ít nhất 1 ngày học trong tuần'
    if (!cls.room) {
      errors.room = 'Chưa chọn phòng học cố định'
    }
    if (!cls.teacher) {
      errors.teacher = 'Chưa chọn giáo viên chủ nhiệm'
    }
  } else {
    cls.scheduleSlots.forEach((slot, index) => {
      const roomVal = slot.room || cls.room
      if (!roomVal || roomVal === '---' || roomVal === 'Chưa gán') {
        errors[`room_${index}`] = `Vui lòng chọn phòng học cho ca học thứ ${index + 1} (${slot.dayOfWeek})`
        errors.room = 'Vui lòng chọn phòng học cố định'
      }
      const hasTeacher =
        (slot.teachers && slot.teachers.length > 0) ||
        (cls.teacher &&
          cls.teacher !== 'Chưa xếp lớp' &&
          cls.teacher !== 'Chưa gán' &&
          cls.teacher !== '—')
      if (!hasTeacher) {
        errors[`teacher_${index}`] = `Vui lòng phân công phụ trách cho ca học thứ ${index + 1} (${slot.dayOfWeek})`
        errors.teacher = 'Vui lòng chọn giáo viên chủ nhiệm'
      }
    })
  }

  return errors
}

/**
 * Returns formatted log message for updating roadmap session substitute teacher or room
 */
export function getSessionUpdateLogMessage(
  session: RoadmapSession,
  updates: Partial<RoadmapSession>
): string {
  let logMsg = `Đã cập nhật Buổi học ${session.sessionNumber}.`
  const coverOptionsMap: Record<string, string> = {
    'cover-1a': 'Cover 1A - Báo trước ngày học',
    'cover-1b': 'Cover 1B - Báo trong ngày học, trước 17h30',
    'cover-2': 'Cover 2 - Báo 30 phút trước giờ học',
    'cover-3a': 'COVER3A - Add GV cover khi lớp đã diễn ra ( sau mốc ST) - GV không vào lớp',
    'cover-3b':
      'COVER3B - Add GV cover khi lớp đã diễn ra ( sau mốc ST) - GV vào lớp dạy 5-10 phút thì bị lỗi KT',
  }

  if (updates.substituteTeacherName !== undefined) {
    const coverLabel =
      updates.coverType && coverOptionsMap[updates.coverType]
        ? ` [Dạng Cover: ${coverOptionsMap[updates.coverType]}]`
        : ''
    const noteText = updates.coverNote ? ` (Ghi chú: ${updates.coverNote})` : ''
    logMsg = `Buổi học ${session.sessionNumber}: Thay đổi giáo viên giảng dạy thành ${
      updates.substituteTeacherName || session.teacherName
    }${coverLabel}${noteText}.`
  } else if (updates.room !== undefined) {
    const coverLabel =
      updates.coverType && coverOptionsMap[updates.coverType]
        ? ` [Dạng Cover: ${coverOptionsMap[updates.coverType]}]`
        : ''
    const noteText = updates.coverNote ? ` (Ghi chú: ${updates.coverNote})` : ''
    logMsg = `Buổi học ${session.sessionNumber}: Thay đổi phòng học thành ${updates.room}${coverLabel}${noteText}.`
  } else if (updates.materials !== undefined) {
    logMsg = `Buổi học ${session.sessionNumber}: Tải lên giáo án bài giảng mới.`
  }

  return logMsg
}

/**
 * Formats notes relative timestamp (e.g. today -> HH:MM, yesterday -> 'Hôm qua', etc.)
 */
export function formatNoteTimestamp(timestampStr: string): string {
  try {
    const parts = timestampStr.split(' ')
    if (parts.length !== 2) return timestampStr
    const [timePart, datePart] = parts
    const [hours, minutes] = timePart.split(':').map(Number)
    const [day, month, year] = datePart.split('/').map(Number)
    
    const noteDate = new Date(year, month - 1, day, hours, minutes)
    const now = new Date()
    
    const oneDayMs = 24 * 60 * 60 * 1000
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const noteDateStart = new Date(noteDate.getFullYear(), noteDate.getMonth(), noteDate.getDate())
    const diffDays = Math.floor((todayStart.getTime() - noteDateStart.getTime()) / oneDayMs)
    
    if (diffDays === 0) {
      return timePart
    }
    if (diffDays === 1) {
      return 'Hôm qua'
    }
    if (diffDays > 1 && diffDays < 7) {
      return `${diffDays} ngày trước`
    }
    
    const diffWeeks = Math.floor(diffDays / 7)
    if (diffWeeks > 0 && diffWeeks < 4) {
      return `${diffWeeks} tuần trước`
    }
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}`
  } catch {
    return timestampStr
  }
}

/**
 * Determines which tab has the first validation error
 */
export function getFirstTabWithError(errors: Record<string, string>): string {
  if (errors.name || errors.branch || errors.level || errors.startDate || errors.syllabus) {
    return 'overview'
  }
  if (errors.roster) {
    return 'roster'
  }
  if (errors.schedule || Object.keys(errors).some(k => k.startsWith('room_') || k.startsWith('teacher_'))) {
    return 'schedule'
  }
  return 'overview'
}



