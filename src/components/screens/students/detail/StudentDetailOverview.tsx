'use client'

import { useState, useMemo } from 'react'
import { Users, Phone, Copy, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Panel, InfoField, FieldLabel, PersonnelCell, type PersonnelItem } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { InlineSelect, MultiBranchSelect } from '@/components/controls'
import type { Student } from '@/mocks/students'
import { getStudentFamilyMembers } from './studentDetailHelpers'

interface StudentDetailOverviewProps {
  student: Student
  isEditing?: boolean
  editFormState?: Student | null
  onEditStateChange?: (val: Student) => void
}

const maskPhone = (phone: string) => {
  if (!phone) return '-'
  return phone.length >= 7 
    ? phone.slice(0, 3) + '****' + phone.slice(-3) 
    : phone
}

const mockStaffPool: PersonnelItem[] = [
  { id: 'st1', name: 'CSM Minh Phương', role: 'Quản lý CSKH', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=MinhPhuong', phone: '0987654321', email: 'minhphuong.csm@rinoedu.vn' },
  { id: 'st2', name: 'Trần Thị Sale', role: 'Tư vấn Tuyển sinh', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=TranSale', phone: '0912345678', email: 'sale.tran@rinoedu.vn' },
  { id: 'st3', name: 'Giáo vụ Phương Lan', role: 'Vận hành Lớp học', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=PhuongLan', phone: '0901234567', email: 'phuonglan.giaovu@rinoedu.vn' },
  { id: 'st4', name: 'Thầy Phạm Giảng', role: 'Giáo viên Chủ nhiệm', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=PhamGiang', phone: '0934567890', email: 'phamgiang.gv@rinoedu.vn' },
  { id: 'st5', name: 'Ms. Emily Watson', role: 'Giáo viên Bản ngữ', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Emily', phone: '0977888999', email: 'emily.watson@rinoedu.vn' },
  { id: 'st6', name: 'Kế toán Thu Phương', role: 'Thu ngân & Học phí', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=ThuPhuong', phone: '0966555444', email: 'thuphuong.ketoan@rinoedu.vn' },
]

export function StudentDetailOverview({
  student,
  isEditing = false,
  editFormState,
  onEditStateChange
}: StudentDetailOverviewProps) {
  const [copiedKey, setCopiedKey] = useState('')
  const studentCode = `STU-00${student.id.replace('s', '')}`
  const familyMembers = getStudentFamilyMembers(student)

  // Generate dynamic interacted staff based on student id
  const interactedStaff = useMemo<PersonnelItem[]>(() => {
    const hash = student.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    // Dynamic selection of 1 to 3 staff members to showcase both single and stacked rendering modes
    const count = (hash % 3) + 1 // 1, 2, or 3 staff members
    const list: PersonnelItem[] = []
    for (let i = 0; i < count; i++) {
      list.push(mockStaffPool[(hash + i * 2) % mockStaffPool.length])
    }
    return list
  }, [student.id])

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      toast.success('Đã sao chép số điện thoại!')
      setTimeout(() => setCopiedKey(''), 2000)
    } catch {
      toast.error('Không thể sao chép số điện thoại!')
    }
  }

  const handleFieldChange = (field: keyof Student, value: Student[keyof Student]) => {
    if (onEditStateChange && editFormState) {
      onEditStateChange({
        ...editFormState,
        [field]: value
      })
    }
  }

  if (isEditing && editFormState) {
    return (
      <div className="space-y-6 pt-4">
        {/* 1. Personal Info - Edit Mode */}
        <Panel title="Thông tin học viên">
          <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            <FieldLabel label="Mã học viên">
              <div className="h-9 flex items-center text-xs font-semibold text-foreground px-1 bg-transparent border-none">
                {studentCode}
              </div>
            </FieldLabel>
            <FieldLabel label="Họ và tên">
              <div className="h-9 flex items-center text-xs font-semibold text-foreground px-1 bg-transparent border-none">
                {student.name}
              </div>
            </FieldLabel>
            <FieldLabel label="Ngày sinh">
              <div className="h-9 flex items-center text-xs font-semibold text-foreground px-1 bg-transparent border-none">
                {new Date(student.dob).toLocaleDateString('vi-VN')}
              </div>
            </FieldLabel>
            <FieldLabel label="Giới tính">
              <div className="h-9 flex items-center text-xs font-semibold text-foreground px-1 bg-transparent border-none">
                {student.gender === 'Male' ? 'Nam' : student.gender === 'Female' ? 'Nữ' : 'Khác'}
              </div>
            </FieldLabel>
            <FieldLabel label="Số điện thoại">
              <div className="h-9 flex items-center text-xs font-semibold text-foreground px-1 bg-transparent border-none">
                {student.phone || 'Dùng SĐT phụ huynh'}
              </div>
            </FieldLabel>
            <FieldLabel label="Email liên hệ">
              <div className="h-9 flex items-center text-xs font-semibold text-foreground px-1 bg-transparent border-none">
                {student.email || 'Dùng email phụ huynh'}
              </div>
            </FieldLabel>
          </div>
        </Panel>

        {/* 2. Academic Competence - Edit Mode */}
        <Panel title="Học lực">
          <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Editable: Lớp (Trường phổ thông) */}
            <FieldLabel label="Lớp">
              <InlineSelect
                value={editFormState.schoolClass || ''}
                options={['Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5', 'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12'].map((g) => ({ value: g, label: g }))}
                placeholder="Chọn lớp"
                onValueChange={(val) => handleFieldChange('schoolClass', val)}
                className="w-full justify-between h-9 bg-background"
                variant="solid"
              />
            </FieldLabel>

            {/* Editable: Trình độ (Level) */}
            <FieldLabel label="Trình độ (Level)">
              <InlineSelect
                value={editFormState.level || ''}
                options={['IELTS', 'TOEIC', 'Beginner', 'STEM', 'Math', 'Japanese'].map((l) => ({ value: l, label: l }))}
                placeholder="Chọn trình độ"
                onValueChange={(val) => handleFieldChange('level', val)}
                className="w-full justify-between h-9 bg-background"
                variant="solid"
              />
            </FieldLabel>

            {/* Editable: Sub-level */}
            <FieldLabel label="Sub-level">
              <InlineSelect
                value={editFormState.subLevel || ''}
                options={['A1', 'A2', 'B1', 'B2', 'C1', 'C2', '5.0-5.5', '5.5-6.0', '6.0-6.5', '6.5-7.0', '7.0-7.5', '7.5+'].map((sl) => ({ value: sl, label: sl }))}
                placeholder="Chọn sub-level"
                onValueChange={(val) => handleFieldChange('subLevel', val)}
                className="w-full justify-between h-9 bg-background"
                variant="solid"
              />
            </FieldLabel>
          </div>
        </Panel>

        {/* 3. Interacted Staff & Branches - Edit Mode */}
        <Panel title="Nhân sự tương tác & Cơ sở" icon={<Users className="h-4 w-4" />}>
          <div className="grid gap-6 sm:grid-cols-2 mt-2">
            {/* Editable: Cơ sở theo học */}
            <FieldLabel label="Cơ sở theo học">
              <MultiBranchSelect
                value={editFormState.branches || []}
                onValueChange={(val) => handleFieldChange('branches', val)}
                className="h-9 bg-background animate-none"
              />
            </FieldLabel>

            {/* Personnel Cell */}
            <FieldLabel label="Nhân sự đã tương tác">
              <div className="flex items-center h-9">
                <PersonnelCell items={interactedStaff} size="md" mode="auto" />
              </div>
            </FieldLabel>
          </div>
        </Panel>

        {/* 4. Family Info */}
        <Panel title="Gia đình" icon={<Users className="h-4.5 w-4.5" />}>
          <div className="grid gap-4 sm:grid-cols-2 mt-1">
            {familyMembers.map((member) => (
              <div
                key={member.phone}
                className="flex flex-col justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-2xs transition-all hover:bg-muted/30 hover:border-primary/45 hover:shadow-xs group cursor-default"
              >
                {/* Row 1: Name, Relationship & Actions */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{member.name}</span>
                    <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full shrink-0">
                      {member.relationship}
                    </span>
                  </div>
                  <div className="flex shrink-0 gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      aria-label={`Gọi ${member.name}`}
                      onClick={() => toast.success(`Đang thực hiện cuộc gọi CSKH tới: ${member.name} (${member.phone})`)}
                      className="h-7 w-7 hover:bg-primary/10 hover:text-primary rounded-md"
                    >
                      <Phone className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      aria-label={`Sao chép số điện thoại của ${member.name}`}
                      onClick={() => void handleCopy(member.phone, member.phone)}
                      className="h-7 w-7 hover:bg-primary/10 hover:text-primary rounded-md"
                    >
                      {copiedKey === member.phone ? (
                        <CheckCircle className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Row 2: ID & Masked Phone (Left), Email (Right) */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-muted-foreground border-t border-border/40 pt-2.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Badge variant="outline" className="rounded-md font-mono text-[9px] px-1.5 py-0 border-border bg-muted/40 text-muted-foreground shrink-0">
                      {member.id}
                    </Badge>
                    <span className="text-xs">{maskPhone(member.phone)}</span>
                  </div>
                  {member.email && (
                    <span className="truncate text-xs opacity-90 hover:text-foreground transition-colors max-w-[200px]" title={member.email}>
                      {member.email}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    )
  }

  // Read-only view
  return (
    <div className="space-y-6 pt-4">
      {/* 1. Personal Info */}
      <Panel title="Thông tin học viên">
        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoField
            label="Mã học viên"
            value={studentCode}
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
            label="Số điện thoại"
            value={student.phone || 'Dùng SĐT phụ huynh'}
            valueClassName={!student.phone ? 'text-muted-foreground font-normal italic text-xs' : ''}
          />
          <InfoField
            label="Email liên hệ"
            value={student.email || 'Dùng email phụ huynh'}
            valueClassName={!student.email ? 'text-muted-foreground font-normal italic text-xs' : ''}
          />
        </div>
      </Panel>

      {/* 2. Academic Competence */}
      <Panel title="Học lực">
        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoField
            label="Lớp"
            value={student.schoolClass || '—'}
          />
          <InfoField
            label="Trình độ"
            value={student.level || '—'}
          />
          <InfoField
            label="Sub-level"
            value={student.subLevel || '—'}
          />
        </div>
      </Panel>

      {/* 3. Interacted Staff & Branches */}
      <Panel title="Nhân sự tương tác & Cơ sở" icon={<Users className="h-4 w-4" />}>
        <div className="grid gap-6 sm:grid-cols-2 mt-2">
          <InfoField
            label="Cơ sở theo học"
            value={
              student.branches && student.branches.length > 0 ? (
                <div className="flex flex-wrap gap-1 mt-1">
                  {student.branches.map((b) => (
                    <Badge key={b} variant="secondary" className="text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      {b}
                    </Badge>
                  ))}
                </div>
              ) : (
                '—'
              )
            }
          />
          <InfoField
            label="Nhân sự đã tương tác"
            value={
              <div className="flex items-center h-9">
                <PersonnelCell items={interactedStaff} size="md" mode="auto" />
              </div>
            }
          />
        </div>
      </Panel>

      {/* 4. Family Info */}
      <Panel title="Gia đình" icon={<Users className="h-4.5 w-4.5" />}>
        <div className="grid gap-4 sm:grid-cols-2 mt-1">
          {familyMembers.map((member) => (
            <div
              key={member.phone}
              className="flex flex-col justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-2xs transition-all hover:bg-muted/30 hover:border-primary/45 hover:shadow-xs group cursor-default"
            >
              {/* Row 1: Name, Relationship & Actions */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{member.name}</span>
                  <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full shrink-0">
                    {member.relationship}
                  </span>
                </div>
                <div className="flex shrink-0 gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Gọi ${member.name}`}
                    onClick={() => toast.success(`Đang thực hiện cuộc gọi CSKH tới: ${member.name} (${member.phone})`)}
                    className="h-7 w-7 hover:bg-primary/10 hover:text-primary rounded-md"
                  >
                    <Phone className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Sao chép số điện thoại của ${member.name}`}
                    onClick={() => void handleCopy(member.phone, member.phone)}
                    className="h-7 w-7 hover:bg-primary/10 hover:text-primary rounded-md"
                  >
                    {copiedKey === member.phone ? (
                      <CheckCircle className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Row 2: ID & Masked Phone (Left), Email (Right) */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-muted-foreground border-t border-border/40 pt-2.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Badge variant="outline" className="rounded-md font-mono text-[9px] px-1.5 py-0 border-border bg-muted/40 text-muted-foreground shrink-0">
                    {member.id}
                  </Badge>
                  <span className="text-xs">{maskPhone(member.phone)}</span>
                </div>
                {member.email && (
                  <span className="truncate text-xs opacity-90 hover:text-foreground transition-colors max-w-[200px]" title={member.email}>
                    {member.email}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}
