import { Panel, InfoField } from '@/components/shared'
import type { Student } from '@/mocks/students'

interface StudentDetailOverviewProps {
  student: Student
  onUpdateStudent?: (val: Student) => void
}

export function StudentDetailOverview({
  student,
}: StudentDetailOverviewProps) {
  const studentCode = `STU-00${student.id.replace('s', '')}`

  // Read-only view with directly editable dropdowns
  return (
    <div className="space-y-6 pt-0">
      {/* 1. Personal Info */}
      <Panel title="Thông tin học viên">
        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoField
            label="Mã học viên (Student Code)"
            value={studentCode}
          />
          <InfoField
            label="CID"
            value={student.id}
          />
          <InfoField
            label="Mã Code hệ thống"
            value="4809440"
          />
          <InfoField
            label="Mã học sinh"
            value="177245"
          />
          <InfoField
            label="Họ và tên"
            value={student.name}
          />
          <InfoField
            label="Ngày sinh"
            value={new Date(student.dob).toLocaleDateString('vi-VN')}
          />
          <InfoField
            label="Giới tính"
            value={student.gender === 'Male' ? 'Nam' : student.gender === 'Female' ? 'Nữ' : 'Khác'}
          />
          <InfoField
            label="Trình độ học tập"
            value={`${student.level} ${student.subLevel ? `(${student.subLevel})` : ''}`}
          />
          <InfoField
            label="Số điện thoại"
            value={student.phone || 'Dùng SĐT phụ huynh'}
            valueClassName={!student.phone ? 'text-muted-foreground font-normal italic text-xs' : ''}
          />
          <InfoField
            label="Email liên hệ"
            value={student.email || 'Dùng email phụ huynh'}
            valueClassName={!student.email ? 'text-muted-foreground font-normal italic text-xs' : ''}
          />
          <InfoField
            label="Trạng thái"
            value={student.status === 'active' ? 'Đang học' : student.status}
          />
          <InfoField
            label="Điểm tích lũy (Points)"
            value="120 Rino Points"
            valueClassName="text-amber-600 font-bold"
          />
        </div>
      </Panel>
    </div>
  )
}
