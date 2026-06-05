import type { ClassRecord } from '@/mocks/classRecords'
import { mockStudents } from '@/mocks/students'
import type { RosterStudent, RoadmapSession } from './classesDetailTypes'

// Mask phone to format 090****294
export function maskPhone(phone?: string): string {
  if (!phone) return '—'
  const clean = phone.replace(/\s+/g, '')
  if (clean.length < 7) return clean
  return `${clean.substring(0, 3)}****${clean.substring(clean.length - 3)}`
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

// Generate dynamic mock roster based on class record
export function generateMockRoster(cls: ClassRecord): RosterStudent[] {
  // Pull students with same level if possible
  const levelStudents = mockStudents.filter((s) => s.level === cls.level || s.branch === cls.branch)
  const pool = levelStudents.length >= 5 ? levelStudents : mockStudents

  const roster: RosterStudent[] = []
  
  // Fill enrolled active students
  const activeCount = Math.max(1, cls.enrolledStudents)
  for (let i = 0; i < activeCount; i++) {
    const s = pool[i % pool.length]
    const pName = s.parentName || 'Nguyễn Văn Phụ Huynh'
    const pPhone = s.parentPhone || '0901234567'
    roster.push({
      id: `s-${cls.id}-${i}`,
      name: s.name,
      code: `HV-${s.id.toUpperCase()}`,
      status: 'active',
      dob: s.dob || '2008-05-12',
      parentName: pName,
      parentPhone: pPhone,
      enrollmentDate: s.enrollmentDate || cls.startDate,
      parents: generateParents(pName, pPhone),
      note: generateMockNote('active', i)
    })
  }

  // Add some trial students if applicable
  const trialCount = cls.trialStudents || (cls.status === 'dang_hoc' ? 1 : 0)
  for (let i = 0; i < trialCount; i++) {
    const s = pool[(activeCount + i) % pool.length]
    const pName = s.parentName || 'Nguyễn Văn Phụ Huynh'
    const pPhone = s.parentPhone || '0902345678'
    roster.push({
      id: `s-trial-${cls.id}-${i}`,
      name: `${s.name} (Trial)`,
      code: `HV-${s.id.toUpperCase()}-T`,
      status: 'trial',
      dob: s.dob || '2009-08-15',
      parentName: pName,
      parentPhone: pPhone,
      enrollmentDate: cls.startDate,
      parents: generateParents(pName, pPhone),
      note: generateMockNote('trial', i)
    })
  }

  // Add 1 Reserved and 1 Transferred student for demonstration if class is In Progress
  if (cls.status === 'dang_hoc') {
    const s1 = pool[(activeCount + trialCount) % pool.length]
    const pName1 = s1.parentName || 'Lê Thị Mẹ'
    const pPhone1 = '0909876543'
    roster.push({
      id: `s-res-${cls.id}`,
      name: s1.name,
      code: `HV-${s1.id.toUpperCase()}-R`,
      status: 'reserve',
      dob: s1.dob || '2007-03-20',
      parentName: pName1,
      parentPhone: pPhone1,
      enrollmentDate: cls.startDate,
      parents: generateParents(pName1, pPhone1),
      note: generateMockNote('reserve', 0)
    })

    const s2 = pool[(activeCount + trialCount + 1) % pool.length]
    const pName2 = s2.parentName || 'Trần Văn Bố'
    const pPhone2 = '0905556667'
    roster.push({
      id: `s-tran-${cls.id}`,
      name: s2.name,
      code: `HV-${s2.id.toUpperCase()}-C`,
      status: 'transferred',
      dob: s2.dob || '2006-11-22',
      parentName: pName2,
      parentPhone: pPhone2,
      enrollmentDate: cls.startDate,
      parents: generateParents(pName2, pPhone2),
      note: generateMockNote('transferred', 0)
    })

    // Add 2 newly enrolled students (never attended a class)
    const s3 = pool[(activeCount + trialCount + 2) % pool.length]
    const pName3 = s3.parentName || 'Nguyễn Phú Hộ'
    const pPhone3 = '0901112223'
    roster.push({
      id: `s-new-1-${cls.id}`,
      name: `${s3.name} (Mới)`,
      code: `HV-${s3.id.toUpperCase()}-N1`,
      status: 'new',
      dob: s3.dob || '2009-01-10',
      parentName: pName3,
      parentPhone: pPhone3,
      enrollmentDate: cls.startDate,
      parents: generateParents(pName3, pPhone3),
      note: generateMockNote('new', 0)
    })

    const s4 = pool[(activeCount + trialCount + 3) % pool.length]
    const pName4 = s4.parentName || 'Vương Gia Bố'
    const pPhone4 = '0903334445'
    roster.push({
      id: `s-new-2-${cls.id}`,
      name: `${s4.name} (Mới)`,
      code: `HV-${s4.id.toUpperCase()}-N2`,
      status: 'new',
      dob: s4.dob || '2008-12-15',
      parentName: pName4,
      parentPhone: pPhone4,
      enrollmentDate: cls.startDate,
      parents: generateParents(pName4, pPhone4),
      note: generateMockNote('new', 1)
    })

    // Add 1 Dropout (Đã nghỉ học) and 1 Session Ended (Hết buổi)
    const s5 = pool[(activeCount + trialCount + 4) % pool.length]
    const pName5 = s5.parentName || 'Phan Bùi Phụ Huynh'
    const pPhone5 = '0907778889'
    roster.push({
      id: `s-drop-${cls.id}`,
      name: `${s5.name} (Nghỉ)`,
      code: `HV-${s5.id.toUpperCase()}-D`,
      status: 'dropout',
      dob: s5.dob || '2007-06-18',
      parentName: pName5,
      parentPhone: pPhone5,
      enrollmentDate: cls.startDate,
      parents: generateParents(pName5, pPhone5),
      note: generateMockNote('dropout', 0)
    })

    const s6 = pool[(activeCount + trialCount + 5) % pool.length]
    const pName6 = s6.parentName || 'Đỗ Hoàng Bố'
    const pPhone6 = '0908889990'
    roster.push({
      id: `s-ended-${cls.id}`,
      name: `${s6.name} (Hết buổi)`,
      code: `HV-${s6.id.toUpperCase()}-E`,
      status: 'session_ended',
      dob: s6.dob || '2008-04-05',
      parentName: pName6,
      parentPhone: pPhone6,
      enrollmentDate: cls.startDate,
      parents: generateParents(pName6, pPhone6),
      note: generateMockNote('session_ended', 0)
    })
  }

  return roster
}

// Generate dynamic 12-session linear learning roadmap
export function generateRoadmapSessions(cls: ClassRecord): RoadmapSession[] {
  if (!cls.syllabus || cls.syllabus === '—' || cls.syllabus === '') {
    return []
  }
  const topics = [
    { topic: 'Orientation & Diagnostic Test', desc: 'Giới thiệu nội quy lớp học, làm bài đánh giá năng lực đầu vào và phân tích kỹ năng.' },
    { topic: 'Unit 1: Essential Listening & Vocabulary', desc: 'Phương pháp nghe keywords và làm quen với chủ đề Daily Activities.' },
    { topic: 'Unit 2: Speaking Foundation & Pronunciation', desc: 'Luyện phát âm chuẩn IPA, thực hành giao tiếp Part 1 cơ bản.' },
    { topic: 'Unit 3: Grammar Structures in Writing', desc: 'Các cấu trúc câu phức, câu ghép nâng cao dùng trong văn viết.' },
    { topic: 'Unit 4: Reading Strategies & Skimming', desc: 'Kỹ thuật đọc lướt (Skimming) và quét (Scanning) tìm thông tin cốt lõi.' },
    { topic: 'Unit 5: Substitute Session - Speaking Practice', desc: 'Thực hành hội thoại nhóm phản xạ nhanh theo chủ đề Environment.' },
    { topic: 'Unit 6: Listening Strategies - Part 2 & 3', desc: 'Nghe hiểu hội thoại nhiều người nói, phương pháp tránh bẫy thông tin nhiễu.' },
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
    
    // Determine status: 
    // Session 1 to 3 completed. Session 4 is ongoing. Session 5 is rescheduled. Session 6 is cancelled. Session 7+ is upcoming
    let status: 'completed' | 'ongoing' | 'upcoming' | 'rescheduled' | 'cancelled' = 'upcoming'
    if (sessionNum <= 3) {
      status = 'completed'
    } else if (sessionNum === 4) {
      status = 'ongoing'
    } else if (sessionNum === 5) {
      status = 'rescheduled'
    } else if (sessionNum === 6) {
      status = 'cancelled'
    }

    // Substitute teacher mock
    let substituteTeacherName: string | undefined = undefined
    if (sessionNum === 5) {
      substituteTeacherName = 'Cô Mai'
    }

    // Classroom mock
    let room = cls.room
    if (sessionNum === 2) room = 'A102' // mock room change

    const descText = sessionNum === 6 
      ? 'Buổi học bị hủy do trùng lịch nghỉ lễ quốc gia.' 
      : topics[i].desc;

    sessions.push({
      id: `session-${cls.id}-${sessionNum}`,
      sessionNumber: sessionNum,
      date: dateStr,
      startTime: '18:00',
      endTime: '19:30',
      topic: topics[i].topic,
      description: descText,
      room,
      defaultRoom: cls.room,
      teacherName: cls.teacher,
      substituteTeacherName,
      status,
      materials: sessionNum === 6 ? [] : [
        { name: `Slide bài giảng Buổi ${sessionNum}`, url: '#' },
        { name: `Bài tập về nhà Buổi ${sessionNum}`, url: '#' }
      ],
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
  if (sessions.every(s => s.status === 'completed' || s.status === 'rescheduled' || s.status === 'cancelled')) {
    return 'completed'
  }
  if (sessions.some(s => s.status === 'ongoing')) {
    return 'ongoing'
  }
  return 'upcoming'
}
