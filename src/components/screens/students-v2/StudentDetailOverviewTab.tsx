'use client'

import { useState, useMemo } from 'react'
import { Panel, InfoField, FieldLabel, PersonnelCell, type PersonnelItem } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { InlineSelect, MultiBranchSelect } from '@/components/controls'
import type { Student } from '@/mocks/students'
import { useCallStore } from '@/stores/useCallStore'
import { Phone, Copy, CheckCircle, Users } from 'lucide-react'
import { toast } from 'sonner'
import { getStudentFamilyMembersV2 } from './studentsV2Helpers'

interface StudentDetailOverviewTabProps {
  student: Student
  isEditing?: boolean
  editFormState?: Student | null
  onEditStateChange?: (val: Student) => void
}

const mockStaffPool: PersonnelItem[] = [
  { id: 'st1', name: 'CSM Minh Phương', role: 'Quản lý CSKH', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=MinhPhuong', phone: '0987654321', email: 'minhphuong.csm@rinoedu.vn' },
  { id: 'st2', name: 'Trần Thị Sale', role: 'Tư vấn Tuyển sinh', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=TranSale', phone: '0912345678', email: 'sale.tran@rinoedu.vn' },
  { id: 'st3', name: 'Giáo vụ Phương Lan', role: 'Vận hành Lớp học', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=PhuongLan', phone: '0901234567', email: 'phuonglan.giaovu@rinoedu.vn' },
  { id: 'st4', name: 'Thầy Phạm Giảng', role: 'Giáo viên Chủ nhiệm', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=PhamGiang', phone: '0934567890', email: 'phamgiang.gv@rinoedu.vn' },
  { id: 'st5', name: 'Ms. Emily Watson', role: 'Giáo viên Bản ngữ', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Emily', phone: '0977888999', email: 'emily.watson@rinoedu.vn' },
]

export function StudentDetailOverviewTab({
  student,
  isEditing = false,
  editFormState,
  onEditStateChange,
}: StudentDetailOverviewTabProps) {
  const [copiedKey, setCopiedKey] = useState('')

  const studentCode = `STU-00${student.id.replace('s', '')}`
  const familyMembers = useMemo(() => getStudentFamilyMembersV2(student), [student])

  // Generate dynamic interacted staff based on student id
  const interactedStaff = useMemo<PersonnelItem[]>(() => {
    const hash = student.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const count = (hash % 3) + 1
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

  const handleFieldChange = <K extends keyof Student>(field: K, value: Student[K]) => {
    if (onEditStateChange && editFormState) {
      onEditStateChange({
        ...editFormState,
        [field]: value,
      })
    }
  }

  const maskPhone = (phone: string) => {
    if (!phone) return '-'
    return phone.length >= 7 
      ? phone.slice(0, 3) + '****' + phone.slice(-3) 
      : phone
  }

  if (isEditing && editFormState) {
    return (
      <div className="space-y-6 pt-2">
        {/* 1. Personal Info - Edit Mode */}
        <Panel title="Thông tin học viên">
          <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            <FieldLabel label="Mã học viên">
              <div className="h-9 flex items-center text-sm font-semibold text-foreground px-1">
                {studentCode}
              </div>
            </FieldLabel>
            <FieldLabel label="Họ và tên">
              <div className="h-9 flex items-center text-sm font-semibold text-foreground px-1">
                {student.name}
              </div>
            </FieldLabel>
            <FieldLabel label="Ngày sinh">
              <div className="h-9 flex items-center text-sm font-semibold text-foreground px-1">
                {new Date(student.dob).toLocaleDateString('vi-VN')}
              </div>
            </FieldLabel>
            <FieldLabel label="Giới tính">
              <div className="h-9 flex items-center text-sm font-semibold text-foreground px-1">
                {student.gender === 'Male' ? 'Nam' : student.gender === 'Female' ? 'Nữ' : 'Khác'}
              </div>
            </FieldLabel>
            <FieldLabel label="Số điện thoại">
              <div className="h-9 flex items-center text-sm font-semibold text-foreground px-1">
                {student.phone || 'Dùng SĐT phụ huynh'}
              </div>
            </FieldLabel>
            <FieldLabel label="Email liên hệ">
              <div className="h-9 flex items-center text-sm font-semibold text-foreground px-1">
                {student.email || 'Dùng email phụ huynh'}
              </div>
            </FieldLabel>
          </div>
        </Panel>

        {/* 2. Academic Competence - Edit Mode */}
        <Panel title="Học lực">
          <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            <FieldLabel label="Lớp phổ thông">
              <InlineSelect
                value={editFormState.schoolClass || ''}
                options={['Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5', 'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12'].map((g) => ({ value: g, label: g }))}
                placeholder="Chọn lớp"
                onValueChange={(val) => handleFieldChange('schoolClass', val)}
                className="w-full justify-between h-9 bg-background"
                variant="solid"
              />
            </FieldLabel>

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
            <FieldLabel label="Cơ sở theo học">
              <MultiBranchSelect
                value={editFormState.branches || [student.branch]}
                onValueChange={(val) => handleFieldChange('branches', val)}
                className="h-9 bg-background animate-none"
              />
            </FieldLabel>

            <FieldLabel label="Nhân sự đã tương tác">
              <div className="flex items-center h-9">
                <PersonnelCell items={interactedStaff} size="md" mode="auto" />
              </div>
            </FieldLabel>
          </div>
        </Panel>

        {/* 4. Family Info - Edit Mode */}
        <Panel title="Gia đình" icon={<Users className="h-4.5 w-4.5" />}>
          <div className="grid gap-4 sm:grid-cols-2 mt-1">
            {familyMembers.map((member) => (
              <div
                key={member.phone}
                className="flex flex-col justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-2xs transition-all hover:bg-muted/30 hover:border-primary/45 hover:shadow-xs group cursor-default"
              >
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
                      onClick={() => toast.success(`Đang thực hiện cuộc gọi tới: ${member.name} (${member.phone})`)}
                      className="h-7 w-7 hover:bg-primary/10 hover:text-primary rounded-md"
                    >
                      <Phone className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
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

  // Read-only Mode
  return (
    <div className="space-y-6 pt-2">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Panel title="Thông tin cá nhân & Liên hệ">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoField label="Họ và tên" value={student.name} />
            <InfoField label="Mã học viên" value={studentCode} />
            <InfoField
              label="Giới tính"
              value={student.gender === 'Male' ? 'Nam' : student.gender === 'Female' ? 'Nữ' : 'Khác'}
            />
            <InfoField label="Ngày sinh" value={new Date(student.dob).toLocaleDateString('vi-VN')} />
            <InfoField label="Số điện thoại" value={student.phone || 'Dùng SĐT phụ huynh'} />
            <InfoField label="Ngày ghi danh" value={new Date(student.enrollmentDate).toLocaleDateString('vi-VN')} />
          </div>
        </Panel>

        <Panel title="Thông tin phụ huynh / Người giám hộ">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoField label="Họ tên phụ huynh" value={student.parentName || '-'} />
            <InfoField 
              label="Số điện thoại" 
              value={
                <span className="flex items-center gap-1.5">
                  <span>{student.parentPhone || '-'}</span>
                  {student.parentPhone && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Bắt đầu gọi điện"
                      onClick={() =>
                        useCallStore.getState().startCall({
                          studentId: student.id,
                          studentName: student.name,
                          parentPhone: student.parentPhone || '0987654321',
                          parentName: student.parentName || `Phụ huynh em ${student.name}`,
                        })
                      }
                      className="h-5 w-5 p-0 bg-transparent text-emerald-600 hover:text-emerald-700 shrink-0"
                    >
                      <Phone className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </span>
              } 
            />
            <InfoField label="Mối quan hệ" value={student.parentName ? 'Bố/Mẹ' : '-'} />
            <InfoField label="Email liên hệ" value={student.email.replace('an@', 'parent.an@')} />
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Panel title="Học lực">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoField label="Lớp phổ thông" value={student.schoolClass || '—'} />
            <InfoField label="Trình độ (Level)" value={student.level || '—'} />
            <InfoField label="Sub-level" value={student.subLevel || '—'} />
          </div>
        </Panel>

        <Panel title="Nhân sự tương tác & Cơ sở" icon={<Users className="h-4 w-4" />}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  <Badge variant="secondary" className="text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    {student.branch}
                  </Badge>
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
      </div>

      {/* Gia đình */}
      <Panel title="Gia đình" icon={<Users className="h-4.5 w-4.5" />}>
        <div className="grid gap-4 sm:grid-cols-2 mt-1">
          {familyMembers.map((member) => (
            <div
              key={member.phone}
              className="flex flex-col justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-2xs transition-all hover:bg-muted/30 hover:border-primary/45 hover:shadow-xs group cursor-default"
            >
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
                    onClick={() => toast.success(`Đang thực hiện cuộc gọi tới: ${member.name} (${member.phone})`)}
                    className="h-7 w-7 hover:bg-primary/10 hover:text-primary rounded-md"
                  >
                    <Phone className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
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
