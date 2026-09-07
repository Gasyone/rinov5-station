export interface JobTitle {
  id: string
  code: string
  name: string
  department: string
  targetHeadcount: number
  description: string
  status: 'active' | 'inactive'
  assignedEmployeeIds: string[]
  createdAt: string
}

export const mockJobTitles: JobTitle[] = [
  {
    id: 'jt_branch_manager',
    code: 'BM',
    name: 'Giám đốc cơ sở',
    department: 'Ban Giám đốc',
    targetHeadcount: 3,
    description: 'Chịu trách nhiệm toàn diện về vận hành, chỉ tiêu doanh thu, nhân sự và chất lượng đào tạo tại cơ sở.',
    status: 'active',
    assignedEmployeeIds: ['e1', 'e6'],
    createdAt: '2023-01-10',
  },
  {
    id: 'jt_teacher_en',
    code: 'TEACHER_EN',
    name: 'Giáo viên Tiếng Anh',
    department: 'Phòng Đào tạo',
    targetHeadcount: 6,
    description: 'Giảng dạy các chương trình tiếng Anh tổng quát, tiếng Anh giao tiếp và ngữ pháp chuyên sâu theo giáo trình.',
    status: 'active',
    assignedEmployeeIds: ['e4', 't4', 't5', 'sc5', 'sc6'],
    createdAt: '2023-01-15',
  },
  {
    id: 'jt_teacher_native',
    code: 'TEACHER_NATIVE',
    name: 'Giáo viên Bản ngữ',
    department: 'Phòng Đào tạo',
    targetHeadcount: 4,
    description: 'Chuyên gia giảng dạy phát âm, phản xạ giao tiếp quốc tế và các lớp luyện thi chứng chỉ nâng cao.',
    status: 'active',
    assignedEmployeeIds: ['t1', 't2', 't3', 't6'],
    createdAt: '2023-02-01',
  },
  {
    id: 'jt_teacher_ielts',
    code: 'TEACHER_IELTS',
    name: 'Giáo viên IELTS',
    department: 'Phòng Đào tạo',
    targetHeadcount: 5,
    description: 'Giảng dạy luyện thi IELTS theo các band điểm mục tiêu, chấm sửa bài viết và luyện kỹ năng nói chuyên biệt.',
    status: 'active',
    assignedEmployeeIds: ['e3', 'sc1', 'nt1', 'ld1'],
    createdAt: '2023-03-01',
  },
  {
    id: 'jt_teacher_toeic',
    code: 'TEACHER_TOEIC',
    name: 'Giáo viên TOEIC',
    department: 'Phòng Đào tạo',
    targetHeadcount: 3,
    description: 'Giảng dạy các lớp ôn thi chuẩn đầu ra TOEIC 2 kỹ năng và 4 kỹ năng quốc tế.',
    status: 'active',
    assignedEmployeeIds: ['sc2'],
    createdAt: '2023-03-15',
  },
  {
    id: 'jt_teaching_assistant',
    code: 'TA',
    name: 'Trợ giảng Đào tạo',
    department: 'Phòng Đào tạo',
    targetHeadcount: 8,
    description: 'Hỗ trợ giáo viên trong giờ dạy, theo dõi nền nếp học viên, kèm cặp học sinh yếu và hỗ trợ chấm bài tập về nhà.',
    status: 'active',
    assignedEmployeeIds: ['tg_sc1', 'tg_sc2', 'tg_nt1', 'tg_nt2', 'tg_ld1', 'tg_ld2', 'tg_ld3'],
    createdAt: '2023-04-01',
  },
  {
    id: 'jt_cs_specialist',
    code: 'CS_SPECIALIST',
    name: 'Chuyên viên Chăm sóc Khách hàng',
    department: 'Customer Care',
    targetHeadcount: 6,
    description: 'Tiếp nhận phản ánh, chăm sóc học viên định kỳ, tư vấn lộ trình học tập và hỗ trợ thủ tục tái ký học phí.',
    status: 'active',
    assignedEmployeeIds: ['e5', 'sc3', 'sc4', 'nt3', 'ld3', 'ld4'],
    createdAt: '2023-04-10',
  },
  {
    id: 'jt_sales_executive',
    code: 'SALES_EXEC',
    name: 'Chuyên viên Tư vấn Tuyển sinh',
    department: 'Phòng Tuyển sinh',
    targetHeadcount: 4,
    description: 'Tư vấn khóa học, sắp xếp lịch kiểm tra xếp lớp, giải đáp lộ trình và hướng dẫn hoàn tất thủ tục đăng ký.',
    status: 'active',
    assignedEmployeeIds: ['e2', 'e12'],
    createdAt: '2023-05-01',
  },
  {
    id: 'jt_accountant',
    code: 'ACCOUNTANT',
    name: 'Kế toán Cơ sở',
    department: 'Kế toán & Tài chính',
    targetHeadcount: 2,
    description: 'Quản lý thu chi học phí, xuất hóa đơn chứng từ, đối soát công nợ và hỗ trợ bảng kê tính thù lao dạy.',
    status: 'active',
    assignedEmployeeIds: ['e8'],
    createdAt: '2023-05-15',
  },
  {
    id: 'jt_it_support',
    code: 'IT_SUPPORT',
    name: 'Kỹ thuật viên IT & Thiết bị',
    department: 'IT & Kỹ thuật',
    targetHeadcount: 2,
    description: 'Bảo trì đường truyền mạng, máy tính phòng học Digi, thiết bị tương tác và hỗ trợ kỹ thuật tại các cơ sở.',
    status: 'active',
    assignedEmployeeIds: ['e9'],
    createdAt: '2023-06-01',
  },
  {
    id: 'jt_receptionist',
    code: 'RECEPTIONIST',
    name: 'Lễ tân & Hành chính',
    department: 'Hành chính & Lễ tân',
    targetHeadcount: 2,
    description: 'Đón tiếp học viên và phụ huynh tại sảnh, điều phối phòng học hàng ngày và xử lý thư tín liên lạc.',
    status: 'active',
    assignedEmployeeIds: ['e7'],
    createdAt: '2023-06-15',
  },
  {
    id: 'jt_academic_lead',
    code: 'ACADEMIC_LEAD',
    name: 'Trưởng bộ môn Tiếng Anh',
    department: 'Phòng Đào tạo',
    targetHeadcount: 2,
    description: 'Nghiên cứu phát triển giáo trình, đào tạo phương pháp sư phạm cho đội ngũ giáo viên và dự giờ định kỳ.',
    status: 'inactive',
    assignedEmployeeIds: [],
    createdAt: '2023-07-01',
  },
]

export function getJobTitles(filters?: {
  search?: string
  department?: string
  status?: string
}): JobTitle[] {
  return mockJobTitles.filter((item) => {
    if (filters?.search) {
      const q = filters.search.trim().toLowerCase()
      const matchName = item.name.toLowerCase().includes(q)
      const matchCode = item.code.toLowerCase().includes(q)
      if (!matchName && !matchCode) return false
    }
    if (filters?.department && filters.department !== 'all' && item.department !== filters.department) {
      return false
    }
    if (filters?.status && filters.status !== 'all' && item.status !== filters.status) {
      return false
    }
    return true
  })
}

export function getJobTitleById(id: string): JobTitle | undefined {
  return mockJobTitles.find((item) => item.id === id)
}

export function addJobTitle(newTitle: Omit<JobTitle, 'id' | 'assignedEmployeeIds' | 'createdAt'>): JobTitle {
  const created: JobTitle = {
    ...newTitle,
    id: `jt_${Date.now()}`,
    assignedEmployeeIds: [],
    createdAt: new Date().toISOString().split('T')[0],
  }
  mockJobTitles.unshift(created)
  return created
}

export function updateJobTitle(id: string, updates: Partial<JobTitle>): JobTitle | undefined {
  const index = mockJobTitles.findIndex((item) => item.id === id)
  if (index === -1) return undefined
  mockJobTitles[index] = { ...mockJobTitles[index], ...updates }
  return mockJobTitles[index]
}

export function deleteJobTitle(id: string): boolean {
  const index = mockJobTitles.findIndex((item) => item.id === id)
  if (index === -1) return false
  mockJobTitles.splice(index, 1)
  return true
}

export function assignEmployeeToJobTitle(jobTitleId: string, employeeId: string): boolean {
  const title = getJobTitleById(jobTitleId)
  if (!title) return false
  if (!title.assignedEmployeeIds.includes(employeeId)) {
    title.assignedEmployeeIds.push(employeeId)
    return true
  }
  return false
}

export function removeEmployeeFromJobTitle(jobTitleId: string, employeeId: string): boolean {
  const title = getJobTitleById(jobTitleId)
  if (!title) return false
  const index = title.assignedEmployeeIds.indexOf(employeeId)
  if (index !== -1) {
    title.assignedEmployeeIds.splice(index, 1)
    return true
  }
  return false
}
