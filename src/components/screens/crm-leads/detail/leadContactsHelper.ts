import type { Lead } from '@/mocks/crmLeads'
import type { ParentContact } from './CrmLeadParentCard'
import type { ChildPersonaItem, StudentSubjectItem } from './CrmLeadChildCard'

export interface RawFamilyMember {
  id: string
  studentName: string
  studentAge: number
  relationship?: string
  status?: Lead['status']
  testStatus?: string
  testDate?: string
  testTime?: string
  testScore?: string
  testResultLevel?: string
  testerTeacherName?: string
  schoolName?: string
  targetSubject?: string
  isMainLead?: boolean
  studentPhone?: string
  code?: string
  birthYear?: number
  lastNote?: string
}

export function buildPrimaryParent(lead: Lead): ParentContact {
  const isAn = lead.studentName?.includes('An') || lead.id === 'lead-001'
  const nearestBranch = lead.branch || 'RinoEdu Linh Đàm'
  const nearestBranchDistance = `Cách ${nearestBranch.replace('RinoEdu ', 'CS ')} ~1.2 km`

  return {
    name: lead.parentName || (isAn ? 'Nguyễn Thu Hà' : 'Chưa cập nhật'),
    role: lead.parentRole || (isAn ? 'Mẹ' : 'Phụ huynh'),
    phone: lead.phone || '',
    email: lead.email || '',
    occupation: lead.parentOccupation || '',
    financialSegment: lead.financialSegment || '',
    budgetPerMonth: lead.budgetPerMonth || '',
    decisionMakerRole: lead.decisionMakerRole || '',
    preferredContactMethod: lead.preferredContactMethod || '',
    bestTimeToCall: lead.bestTimeToCall || '',
    parentExpectation: lead.parentExpectation || '',
    parentPainPoint: lead.parentPainPoint || '',
    parentPersonalityNote: lead.parentPersonalityNote || '',
    preferredChannel: lead.preferredContactMethod || '',
    zaloStatus: (lead as unknown as Record<string, unknown>).zaloStatus as string || '',
    isPrimary: true,
    address: lead.address || 'Phường Bến Nghé, Quận 1, TP.HCM',
    province: lead.province || 'TP.HCM',
    district: lead.district || 'Quận 1',
    ward: lead.ward || 'Phường Bến Nghé',
    street: lead.streetAddress || '',
    mapLink:
      lead.mapLink ||
      `https://maps.google.com/?q=${encodeURIComponent(
        lead.address || 'Phường Bến Nghé, Quận 1, TP.HCM'
      )}`,
    note: lead.lastNote || lead.parentPersonalityNote || '',
    facebook: '',
    instagram: '',
    zaloPhone: lead.phone || '',
    nearestBranch,
    nearestBranchDistance,
  }
}

export function buildOtherParents(lead: Lead): ParentContact[] {
  const isAn = lead.studentName?.includes('An') || lead.id === 'lead-001'
  const nearestBranch = lead.branch || 'RinoEdu Linh Đàm'
  const nearestBranchDistance = `Cách ${nearestBranch.replace('RinoEdu ', 'CS ')} ~1.2 km`

  if (!isAn && !lead.otherParents) {
    return []
  }

  const rawOthers =
    lead.otherParents || [
      {
        name: 'Trần Văn Sơn',
        role: 'Bố',
        phone: '091161999',
        email: 'vanson.tran@example.com',
        occupation: '',
        preferredChannel: '',
        zaloStatus: '',
        address: lead.address || 'Phường Bến Nghé, Quận 1, TP.HCM',
        note: '',
      },
      {
        name: 'Hoàng Thị Lan',
        role: 'Bà ngoại',
        phone: '0903123888',
        email: 'lan.hoang@gmail.com',
        occupation: '',
        preferredChannel: '',
        zaloStatus: '',
        address: 'Phường Bến Nghé, Quận 1, TP.HCM',
        note: '',
      },
    ]

  return rawOthers.map(
    (p): ParentContact => ({
      name: p.name,
      role: p.role,
      phone: p.phone,
      email: p.email,
      isPrimary: false,
      occupation: p.occupation || '',
      financialSegment: p.financialSegment || '',
      budgetPerMonth: p.budgetPerMonth || '',
      decisionMakerRole: p.decisionMakerRole || '',
      preferredContactMethod: p.preferredContactMethod || p.preferredChannel || '',
      bestTimeToCall: p.bestTimeToCall || '',
      parentExpectation: p.parentExpectation || '',
      parentPainPoint: p.parentPainPoint || '',
      parentPersonalityNote: p.parentPersonalityNote || p.note || '',
      preferredChannel: p.preferredChannel || '',
      zaloStatus: p.zaloStatus || '',
      address: (p.address && p.address !== 'Cùng địa chỉ gia đình') ? p.address : (lead.address || 'Phường Bến Nghé, Quận 1, TP.HCM'),
      mapLink:
        lead.mapLink ||
        `https://maps.google.com/?q=${encodeURIComponent(
          lead.address || 'Phường Bến Nghé, Quận 1, TP.HCM'
        )}`,
      note: p.note,
      facebook: '',
      instagram: undefined,
      zaloPhone: p.phone,
      nearestBranch,
      nearestBranchDistance,
    })
  )
}

export function buildChildContacts(lead: Lead): ChildPersonaItem[] {
  const rawFamily = (lead as unknown as Record<string, unknown>).familyMembers as RawFamilyMember[] | undefined
  const familyLeads: RawFamilyMember[] =
    rawFamily && rawFamily.length > 0
      ? rawFamily
      : [
          {
            id: lead.id,
            studentName: lead.studentName || 'Bé An',
            studentAge: lead.studentAge || 8,
            relationship: 'Con chính',
            status: lead.status,
            testStatus: lead.testStatus,
            testDate: lead.testDate,
            testScore: lead.testScore || '88/100',
            testResultLevel: 'Level B2 (Cô Emma)',
            schoolName: lead.schoolName || 'Tiểu học Lương Định Của (Quận 3)',
            targetSubject: lead.targetSubject || 'Anh văn Nhi đồng (SuperKids)',
            isMainLead: true,
            studentPhone: lead.studentPhone || lead.phone,
          },
          {
            id: 'child-002',
            studentName: 'Bé Bình',
            studentAge: 12,
            relationship: 'Em/Anh ruột',
            status: 'dang_tu_van' as Lead['status'],
            testStatus: 'scheduled',
            testDate: '2026-08-25',
            testTime: '18:00',
            testerTeacherName: 'Thầy Alex',
            schoolName: 'THCS Nguyễn Du',
            targetSubject: 'Luyện thi Flyers & Toán tư duy',
            isMainLead: false,
            studentPhone: '0988776655',
          },
        ]

  return familyLeads
    .map((ch: RawFamilyMember, idx: number) => {
      const isCurrent = ch.id === lead.id
      const isAn = ch.studentName.includes('An')
      const isBinh = ch.studentName.includes('Bình')
      const code = ch.code || (idx === 0 ? 'LD-10291-A' : 'LD-10291-B')
      const englishName = isCurrent
        ? lead.studentEnglishName || 'Alex'
        : isAn
          ? 'Alex'
          : isBinh
            ? 'Leo'
            : ''
      const birthYear = ch.birthYear || 2026 - ch.studentAge
      const birthDate = isAn ? '15/05/2018' : isBinh ? '20/09/2014' : `10/06/${birthYear}`
      const gender = isCurrent ? lead.studentGender || 'Nam' : 'Nam'
      const grade = isCurrent
        ? lead.studentCurrentGrade || 'Lớp 3'
        : isAn
          ? 'Lớp 3'
          : isBinh
            ? 'Lớp 7'
            : `Lớp ${ch.studentAge - 5}`
      const school = ch.schoolName || lead.schoolName || (isAn ? 'Tiểu học Lương Định Của (Quận 3)' : 'THCS Nguyễn Du')
      const targetSubject =
        ch.targetSubject ||
        (isAn ? 'Anh văn Nhi đồng (SuperKids)' : 'Luyện thi Flyers & Toán tư duy')

      let statusLabel = 'Đang tư vấn'
      if (ch.status === 'chuyen_doi') statusLabel = 'Đã nhập học'
      else if (ch.testStatus === 'completed') statusLabel = 'Đã test đầu vào'
      else if (ch.testStatus === 'scheduled') statusLabel = 'Hẹn trải nghiệm'
      else if (ch.status === 'that_bai') statusLabel = 'Dừng chăm sóc'

      const testResultText = ch.testScore
        ? `Đạt ${ch.testScore} • ${ch.testResultLevel || 'Level B2 (Cô Emma)'}`
        : ch.testDate
          ? `Lịch test: ${ch.testDate} ${ch.testTime || '18:00'} (${ch.testerTeacherName || 'Thầy Alex'})`
          : 'Chưa xếp lịch kiểm tra đầu vào'

      const studentPhone =
        ch.studentPhone && ch.studentPhone !== '--'
          ? ch.studentPhone
          : isAn
            ? `${lead.phone} (Dùng SĐT Mẹ)`
            : '0988776655 (SĐT riêng của bé)'

      const personality = isCurrent ? (lead.studentPersonality || '') : ''
      const interests = isCurrent ? (lead.studentInterests || '') : ''
      const learningStyle = isCurrent ? (lead.studentLearningStyle || '') : ''
      const strengths = isCurrent ? (lead.studentStrengths || '') : ''
      const weaknesses = isCurrent ? (lead.studentWeaknesses || '') : ''
      const learningGoal = isCurrent ? (lead.studentLearningGoal || '') : ''
      const notes = ch.lastNote || lead.lastNote || ''

      const isNewLeadWithoutBooking =
        (lead.status === 'moi_tiep_nhan' || lead.status === 'chua_tiep_can' || lead.id === 'lead-008') &&
        !lead.testStatus &&
        !lead.testDate &&
        !lead.trialStatus &&
        !lead.trialDate

      const subjects: StudentSubjectItem[] = isAn
        ? [
            {
              id: 'sub-01',
              subjectName: 'Anh văn Nhi đồng (SuperKids)',
              courseLevel: 'SuperKids Level 2',
              branch: lead.branch || 'RinoEdu Linh Đàm',
              trainingType: 'Trực tiếp tại trung tâm',
              status: 'hen_trai_nghiem',
              statusLabel: 'Hẹn trải nghiệm',
              hasTestBooking: true,
              hasTrialBooking: true,

              // Placement Test chuẩn theo /app/booking_test (media_1789031000711.png & media_1789031010639.png)
              testLevel: 'Level 2B',
              testSubLevel: 'B',
              testPath: 'SuperKids Starter -> Level 2B',
              testProgram: 'Anh văn Nhi đồng (SuperKids)',
              testTargetLevel: 'Flyers Intensive Cấp độ 3',
              testDate: '10/08/2026',
              testTime: '18:00',
              testBranch: lead.branch || 'RinoEdu Linh Đàm',
              testTeacher: 'Cô Emma (CS)',
              speakingGv: '6.5/8',
              speakingAi: '6/8',
              speakingAttempt: '1',
              lwrScoreText: 'Starters - 27/40 - 1.5',
              testScore: '8.5/10',
              testRadarSkills: {
                reflex: 31,
                pronunciation: 75,
                vocabGrammar: 65,
                readingWriting: 70,
                listening: 80,
              },
              testStrengths: 'Ghi nhớ từ vựng qua hình ảnh tốt, phản xạ nhanh với các chủ đề động vật, đồ ăn...',
              testImprovements: 'Cần luyện tập thêm về Phản xạ (31%), Phát âm. Chú ý tránh nói tiếng Anh xen lẫn tiếng Việt.',
              ipadTestLink: 'https://rinoedu.ai/ipad-assessment/LD-10291-A',
              detailReportLink: '/app/booking_test/results/E0001',

              // Trial Class chuẩn theo /app/trial_class
              trialTicketId: 'TR-2605-001',
              trialClassName: 'Cambridge Starter A1',
              trialClassId: 'CLS-001',
              trialSessionName: 'Starter S1',
              trialProgram: 'Cambridge Starter',
              trialSubject: 'Tiếng Anh',
              trialStatus: 'pending_approval',
              trialStatusLabel: 'Chờ xác nhận',
              trialDate: 'T4 20/05/2026',
              trialTime: '18:00 - 19:30',
              trialBranch: 'RinoEdu Nguyễn Tuân',
              trialTeacher: 'Bùi Phương Anh',
              trialOwner: 'Ms. Sarah',
              trialAttendanceStatus: 'Chưa ghép lớp',
              trialAttempt: 'Lần 1',
              trialCreator: 'Lan Anh (Sale)',
              trialRating: 5,
              trialRatingLabel: 'Excellent',
              trialResult: 'Đạt - Bé tương tác sôi nổi, tiếp thu bài nhanh',
              trialReportLink: '/app/trial_class/feedback/TR-2605-001',
              recommendedClass: 'Cambridge Starter A1',
              teacherFeedback:
                'Con rất tốt trong phần Từ vựng (4/5) và Phát âm (4/5) - cô khen con vì đã nhớ bài rất nhanh! Phần Ngữ pháp và Nói cần luyện tập thêm để phản xạ tự nhiên hơn.',
              trialFeedbackSections: {
                whatLearned: [
                  'Con đã học về các từ vựng: hen, horse 🐔 🐴',
                  'Luyện tập cấu trúc câu: "What is that? It\'s a hen."',
                  'Học âm Ff với các từ: fish, fork 🐟 🍴',
                ],
                highlights: [
                  'Con rất tốt trong phần Từ vựng (4/5) và Phát âm (4/5) - cô khen con vì đã nhớ bài rất nhanh! 🌟',
                ],
                improvements: [
                  'Phần Ngữ pháp (2/5) và Nói (2/5) con cần luyện tập thêm để phản xạ tự nhiên hơn nhé.',
                  'Con hãy cố gắng đặt câu đầy đủ và luyện nói nhiều hơn để cải thiện khả năng giao tiếp nha! 🗣️',
                ],
                reminders: [
                  'Con hãy ôn lại các từ vựng và cấu trúc đã học để ghi nhớ lâu hơn nhé!',
                ],
              },
            },
            {
              id: 'sub-02',
              subjectName: 'Toán tư duy & Logic (MathKids)',
              courseLevel: 'Tư duy Tiểu học Cấp 2',
              branch: lead.branch || 'RinoEdu Linh Đàm',
              trainingType: 'Trực tiếp tại trung tâm',
              status: 'danh_gia_trai_nghiem',
              statusLabel: 'Đã test đầu vào',
              hasTestBooking: true,
              hasTrialBooking: true,

              testLevel: 'Level 3A',
              testSubLevel: 'A',
              testPath: 'MathKids Basic -> Level 3A',
              testProgram: 'Toán tư duy & Logic (MathKids)',
              testTargetLevel: 'Tư duy Tiểu học Cấp 2',
              testDate: '12/08/2026',
              testTime: '18:30',
              testBranch: lead.branch || 'RinoEdu Linh Đàm',
              testTeacher: 'Thầy Quang Huy',
              speakingGv: '7.0/8',
              speakingAi: '7.5/8',
              speakingAttempt: '1',
              lwrScoreText: 'Logic 3 - 35/40 - 2.0',
              testScore: '9.2/10',
              testRadarSkills: {
                reflex: 85,
                pronunciation: 90,
                vocabGrammar: 80,
                readingWriting: 90,
                listening: 85,
              },
              testStrengths: 'Tư duy hình học không gian và tính nhẩm cực tốt.',
              testImprovements: 'Cần cẩn thận hơn khi giải các bài toán đố có nhiều bước logic.',
              ipadTestLink: 'https://rinoedu.ai/ipad-assessment/LD-10291-B',
              detailReportLink: '/app/booking_test/results/E0002',

              trialTicketId: 'TR-2605-004',
              trialClassName: 'Math Thinking M1',
              trialClassId: 'CLS-004',
              trialSessionName: 'Logic S1',
              trialProgram: 'Math Thinking',
              trialSubject: 'Toán',
              trialStatus: 'confirmed',
              trialStatusLabel: 'Đã xác nhận',
              trialDate: 'T3 19/05/2026',
              trialTime: '18:30 - 20:00',
              trialBranch: 'RinoEdu Linh Đàm',
              trialTeacher: 'Thầy Quang Huy',
              trialOwner: 'Ms. Sarah',
              trialAttendanceStatus: 'Chưa điểm danh',
              trialAttempt: 'Lần 1',
              trialCreator: 'Thanh Vân (Sale)',
              trialRating: 5,
              trialRatingLabel: 'Very Good',
              trialResult: 'Tư duy hình khối tốt, tính nhẩm nhanh',
              trialReportLink: '/app/trial_class/feedback/TR-2605-004',
              recommendedClass: 'Math Thinking M1',
              teacherFeedback:
                'Bé có năng khiếu tính toán nhẩm và phân tích quy luật hình học, tập trung cao độ khi giải các câu đố logic tương tác.',
              trialFeedbackSections: {
                whatLearned: [
                  'Nhận biết quy luật dãy số Fibonacci cơ bản 🔢',
                  'Tư duy ghép khối đa giác Tangram 🧩',
                ],
                highlights: [
                  'Tư duy hình học và logic nhạy bén, hoàn thành thử thách số học trước thời gian quy định! 🏆',
                ],
                improvements: [
                  'Cần rèn luyện thêm tính kiên nhẫn khi gặp bài toán đố phức tạp.',
                ],
                reminders: [
                  'Làm phiếu bài tập logic trang 12-14 trước buổi học sau.',
                ],
              },
            },
          ]
        : [
            {
              id: 'sub-01',
              subjectName: lead.id === 'lead-009' ? 'Anh văn Nhi đồng (SuperKids)' : (lead.targetSubject || 'Tiếng Anh (Flyers Intensive)'),
              courseLevel: lead.id === 'lead-009' ? 'SuperKids Level 2' : 'Flyers Intensive Cấp độ 3',
              branch: lead.branch || 'RinoEdu Linh Đàm',
              trainingType: 'Trực tiếp tại trung tâm',
              status: isNewLeadWithoutBooking ? lead.status : 'dang_tu_van',
              statusLabel: isNewLeadWithoutBooking ? 'Mới tiếp nhận' : 'Đang tư vấn',
              hasTestBooking: !isNewLeadWithoutBooking,
              hasTrialBooking: !isNewLeadWithoutBooking,
              testScore: isNewLeadWithoutBooking ? 'Chưa kiểm tra' : '8.5/10',
              testLevel: isNewLeadWithoutBooking ? undefined : 'Level 3B',
              testSubLevel: isNewLeadWithoutBooking ? undefined : 'B',
              testPath: 'Flyers Preparation -> Level 3B',
              speakingGv: isNewLeadWithoutBooking ? undefined : '6.5/8',
              speakingAi: isNewLeadWithoutBooking ? undefined : '6/8',
              speakingAttempt: isNewLeadWithoutBooking ? undefined : '1',
              lwrScoreText: isNewLeadWithoutBooking ? undefined : 'Flyers - 28/40',
              testDate: isNewLeadWithoutBooking ? undefined : '25/08/2026',
              testRadarSkills: {
                reflex: 50,
                pronunciation: 50,
                vocabGrammar: 50,
                readingWriting: 50,
                listening: 50,
              },
              testStrengths: 'Ghi nhớ từ vựng nhanh qua ngữ cảnh, tự giác học tập.',
              testImprovements: 'Cần rèn thêm kỹ năng viết luận tiếng Anh học thuật và phản xạ giao tiếp.',
              ipadTestLink: 'https://rinoedu.ai/ipad-assessment/LD-10291-A',
              detailReportLink: '/app/booking_test/results/E0001',
              trialStatus: 'Hẹn test xếp lớp ngày 25/08',
              trialDate: '25/08/2026 18:00',
              trialTeacher: 'Thầy Alex',
              trialRating: 4,
              trialRatingLabel: 'Good',
              trialResult: 'Chờ kiểm tra đầu vào',
              trialReportLink: '/app/trial_class',
              recommendedClass: 'FLY-T3T5-19H',
              teacherFeedback:
                'Học lực Khá Giỏi ở trường THCS, tự giác cao, cần rèn thêm kỹ năng viết luận tiếng Anh học thuật.',
              trialFeedbackSections: {
                whatLearned: [
                  'Ôn tập cấu trúc câu điều kiện loại 1 & 2 📘',
                  'Luyện tập kỹ năng Đọc hiểu văn bản Cambridge Flyers 📝',
                  'Thực hành phát âm chuẩn ngữ điệu câu hỏi',
                ],
                highlights: [
                  'Nắm vững kiến thức ngữ pháp cơ bản, tự tin phát biểu ý kiến! 🌟',
                ],
                improvements: [
                  'Phần Viết câu phức và phản xạ Nói tự nhiên cần luyện tập thêm.',
                ],
                reminders: [
                  'Hoàn thiện bài tập viết luận trang 18 trước buổi kiểm tra tiếp theo.',
                ],
              },
            },
            {
              id: 'sub-02',
              subjectName: 'Toán tư duy & Logic (MathKids)',
              courseLevel: 'Tư duy Tiểu học Cấp độ 2',
              branch: lead.branch || 'RinoEdu Linh Đàm',
              trainingType: 'Trực tiếp tại trung tâm',
              status: isNewLeadWithoutBooking ? lead.status : 'danh_gia_trai_nghiem',
              statusLabel: isNewLeadWithoutBooking ? 'Mới tiếp nhận' : 'Đã test đầu vào',
              hasTestBooking: !isNewLeadWithoutBooking,
              hasTrialBooking: !isNewLeadWithoutBooking,
              testScore: isNewLeadWithoutBooking ? 'Chưa kiểm tra' : '8.8/10',
              testLevel: isNewLeadWithoutBooking ? undefined : 'Level 2A',
              testSubLevel: isNewLeadWithoutBooking ? undefined : 'A',
              testPath: 'MathKids Basic -> Level 2A',
              speakingGv: isNewLeadWithoutBooking ? undefined : '8.0/8',
              speakingAi: isNewLeadWithoutBooking ? undefined : '7.5/8',
              speakingAttempt: isNewLeadWithoutBooking ? undefined : '1',
              lwrScoreText: isNewLeadWithoutBooking ? undefined : 'Logic 2 - 32/40',
              testDate: isNewLeadWithoutBooking ? undefined : '22/08/2026',
              testRadarSkills: {
                reflex: 80,
                pronunciation: 85,
                vocabGrammar: 75,
                readingWriting: 85,
                listening: 80,
              },
              testStrengths: 'Tư duy số học và hình khối không gian nhạy bén, tính nhẩm nhanh.',
              testImprovements: 'Cần cẩn thận hơn khi giải bài toán đố có nhiều bước logic.',
              ipadTestLink: 'https://rinoedu.ai/ipad-assessment/LD-10291-B',
              detailReportLink: '/app/booking_test/results/E0002',
              trialStatus: 'Đã hoàn thành 01 buổi trải nghiệm',
              trialDate: '24/08/2026 19:30',
              trialTeacher: 'Thầy Quang Huy',
              trialRating: 5,
              trialRatingLabel: 'Excellent',
              trialResult: 'Đạt - Phản xạ tính nhẩm tốt, thích thú với trò chơi logic',
              trialReportLink: '/app/trial_class/feedback/TR-2605-002',
              recommendedClass: 'MK2-T7CN-09H',
              teacherFeedback:
                'Bé có tư duy số học và hình khối không gian rất nhanh nhạy, phản xạ giải đố tốt.',
              trialFeedbackSections: {
                whatLearned: [
                  'Quy luật dãy số logic và hình khối Tangram 🧩',
                  'Tính nhẩm nhanh phương pháp bàn tính Soroban cơ bản 🔢',
                ],
                highlights: [
                  'Tư duy hình học và logic nhạy bén, hoàn thành thử thách số học trước thời gian! 🏆',
                ],
                improvements: [
                  'Cần rèn luyện thêm tính kiên nhẫn khi gặp bài toán đố phức tạp.',
                ],
                reminders: [
                  'Làm bài tập phiếu số 4 trước buổi học chính thức.',
                ],
              },
            },
          ]

      return {
        id: ch.id,
        code,
        name: ch.studentName,
        englishName,
        age: ch.studentAge,
        birthYear,
        birthDate,
        gender,
        school,
        grade,
        academicPerformance: (ch as unknown as Record<string, unknown>).academicPerformance as string || lead.academicAbility || (isAn ? 'Giỏi / Tốt nghiệp loại Ưu' : 'Học sinh Giỏi (THCS)'),
        currentLevel: isAn ? 'Đã học qua 1 năm tiếng Anh cơ bản (Pre-Starters)' : 'Vững ngữ pháp lớp 6',
        targetSubject,
        status: ch.status || lead.status || 'dang_tu_van',
        statusLabel,
        testResultText,
        studentPhone,
        personality,
        interests,
        learningStyle,
        strengths,
        weaknesses,
        learningGoal,
        notes,
        isMain: ch.isMainLead,
        isCurrent,
        productGroup: lead.productGroup || 'Tiếng Anh Thiếu Nhi',
        branch: lead.branch || 'RinoEdu Linh Đàm',
        trainingType: lead.trainingType || 'Tự học',
        industryGroup: lead.industryGroup || 'Tiểu học',
        subjects,
      }
    })
    .sort((a: ChildPersonaItem, b: ChildPersonaItem) => (a.isCurrent ? -1 : b.isCurrent ? 1 : 0))
}

export function getDefaultStudentSubjects(branch?: string): StudentSubjectItem[] {
  return [
    {
      id: 'sub-01',
      subjectName: 'Anh văn Nhi đồng (SuperKids)',
      courseLevel: 'SuperKids Level 2',
      branch: branch || 'RinoEdu Linh Đàm',
      trainingType: 'Trực tiếp tại trung tâm',
      status: 'hen_trai_nghiem',
      statusLabel: 'Hẹn trải nghiệm',
      hasTestBooking: true,
      hasTrialBooking: true,

      testLevel: 'Level 2B',
      testSubLevel: 'B',
      testPath: 'SuperKids Starter -> Level 2B',
      testProgram: 'Anh văn Nhi đồng (SuperKids)',
      testTargetLevel: 'Flyers Intensive Cấp độ 3',
      testDate: '10/08/2026',
      testTime: '18:00',
      testBranch: branch || 'RinoEdu Linh Đàm',
      testTeacher: 'Cô Emma (CS)',
      speakingGv: '6.5/8',
      speakingAi: '6/8',
      speakingAttempt: '1',
      lwrScoreText: 'Starters - 27/40 - 1.5',
      testScore: '8.5/10',
      testRadarSkills: {
        reflex: 31,
        pronunciation: 75,
        vocabGrammar: 65,
        readingWriting: 70,
        listening: 80,
      },
      testStrengths: 'Ghi nhớ từ vựng qua hình ảnh tốt, phản xạ nhanh với các chủ đề động vật, đồ ăn...',
      testImprovements: 'Cần luyện tập thêm về Phản xạ (31%), Phát âm. Chú ý tránh nói tiếng Anh xen lẫn tiếng Việt.',
      ipadTestLink: 'https://rinoedu.ai/ipad-assessment/LD-10291-A',
      detailReportLink: '/app/booking_test/results/E0001',

      trialTicketId: 'TR-2605-001',
      trialClassName: 'Cambridge Starter A1',
      trialClassId: 'CLS-001',
      trialSessionName: 'Starter S1',
      trialProgram: 'Cambridge Starter',
      trialSubject: 'Tiếng Anh',
      trialStatus: 'pending_approval',
      trialStatusLabel: 'Chờ xác nhận',
      trialDate: 'T4 20/05/2026',
      trialTime: '18:00 - 19:30',
      trialBranch: 'RinoEdu Nguyễn Tuân',
      trialTeacher: 'Bùi Phương Anh',
      trialOwner: 'Ms. Sarah',
      trialAttendanceStatus: 'Chưa ghép lớp',
      trialAttempt: 'Lần 1',
      trialCreator: 'Lan Anh (Sale)',
      trialRating: 5,
      trialRatingLabel: 'Excellent',
      trialResult: 'Đạt - Bé tương tác sôi nổi, tiếp thu bài nhanh',
      trialReportLink: '/app/trial_class/feedback/TR-2605-001',
      recommendedClass: 'Cambridge Starter A1',
      teacherFeedback:
        'Con rất tốt trong phần Từ vựng (4/5) và Phát âm (4/5) - cô khen con vì đã nhớ bài rất nhanh! Phần Ngữ pháp và Nói cần luyện tập thêm để phản xạ tự nhiên hơn.',
      trialFeedbackSections: {
        whatLearned: [
          'Con đã học về các từ vựng: hen, horse 🐔 🐴',
          'Luyện tập cấu trúc câu: "What is that? It\'s a hen."',
          'Học âm Ff với các từ: fish, fork 🐟 🍴',
        ],
        highlights: [
          'Con rất tốt trong phần Từ vựng (4/5) và Phát âm (4/5) - cô khen con vì đã nhớ bài rất nhanh! 🌟',
        ],
        improvements: [
          'Phần Ngữ pháp (2/5) và Nói (2/5) con cần luyện tập thêm để phản xạ tự nhiên hơn nhé.',
          'Con hãy cố gắng đặt câu đầy đủ và luyện nói nhiều hơn để cải thiện khả năng giao tiếp nha! 🗣️',
        ],
        reminders: [
          'Con hãy ôn lại các từ vựng và cấu trúc đã học để ghi nhớ lâu hơn nhé!',
        ],
      },
    },
    {
      id: 'sub-02',
      subjectName: 'Toán tư duy & Logic (MathKids)',
      courseLevel: 'Tư duy Tiểu học Cấp độ 2',
      branch: branch || 'RinoEdu Linh Đàm',
      trainingType: 'Trực tiếp tại trung tâm',
      status: 'danh_gia_trai_nghiem',
      statusLabel: 'Đã test đầu vào',
      hasTestBooking: true,
      hasTrialBooking: true,

      testLevel: 'Level 2A',
      testSubLevel: 'A',
      testPath: 'MathKids Basic -> Level 2A',
      testProgram: 'Toán tư duy & Logic (MathKids)',
      testTargetLevel: 'Tư duy Tiểu học Cấp độ 2',
      testDate: '22/08/2026',
      testTime: '18:30',
      testBranch: branch || 'RinoEdu Linh Đàm',
      testTeacher: 'Thầy Quang Huy',
      speakingGv: '8.0/8',
      speakingAi: '7.5/8',
      speakingAttempt: '1',
      lwrScoreText: 'Logic 2 - 32/40',
      testScore: '8.8/10',
      testRadarSkills: {
        reflex: 80,
        pronunciation: 85,
        vocabGrammar: 75,
        readingWriting: 85,
        listening: 80,
      },
      testStrengths: 'Tư duy số học và hình khối không gian nhạy bén, tính nhẩm nhanh.',
      testImprovements: 'Cần cẩn thận hơn khi giải bài toán đố có nhiều bước logic.',
      ipadTestLink: 'https://rinoedu.ai/ipad-assessment/LD-10291-B',
      detailReportLink: '/app/booking_test/results/E0002',

      trialStatus: 'Đã hoàn thành 01 buổi trải nghiệm',
      trialDate: '24/08/2026 19:30',
      trialTeacher: 'Thầy Quang Huy',
      trialRating: 5,
      trialRatingLabel: 'Very Good',
      trialResult: 'Tư duy hình khối tốt, tính nhẩm nhanh',
      trialReportLink: '/app/trial_class/feedback/TR-2605-002',
      recommendedClass: 'MK2-T7CN-09H',
      teacherFeedback:
        'Bé có năng khiếu tính toán nhẩm và phân tích quy luật hình học, tập trung cao độ khi giải các câu đố logic tương tác.',
      trialFeedbackSections: {
        whatLearned: [
          'Nhận biết quy luật dãy số Fibonacci cơ bản 🔢',
          'Tư duy ghép khối đa giác Tangram 🧩',
        ],
        highlights: [
          'Tư duy hình học và logic nhạy bén, hoàn thành thử thách số học trước thời gian quy định! 🏆',
        ],
        improvements: [
          'Cần rèn luyện thêm tính kiên nhẫn khi gặp bài toán đố phức tạp.',
        ],
        reminders: [
          'Làm phiếu bài tập logic trang 12-14 trước buổi học sau.',
        ],
      },
    },
  ]
}
