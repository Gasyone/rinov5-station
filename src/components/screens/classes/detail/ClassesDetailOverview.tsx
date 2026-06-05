'use client'

import { useMemo } from 'react'
import { InfoField, Panel, FieldLabel } from '@/components/shared'
import { Input } from '@/components/ui/input'
import { InlineSelect, SearchableCombobox } from '@/components/controls'
import { 
  Users, 
  Compass 
} from 'lucide-react'
import type { ClassRecord } from '@/mocks/classRecords'
import { CLASS_LEVELS } from '@/mocks/classRecords'
import { mockTeachers } from '@/mocks/teacherRecords'
import {
  getRoomsForBranch,
  CURRICULUM_FRAMES,
  CLASS_TYPES,
  CLASS_RATIOS,
  TEACHER_TYPES,
  getCurriculumDetails,
} from '../classesCreateTypes'

interface ClassesDetailOverviewProps {
  cls: ClassRecord
  isEditing?: boolean
  editFormState?: ClassRecord | null
  onEditStateChange?: (val: ClassRecord) => void
  hideClassType?: boolean
}

export function ClassesDetailOverview({ 
  cls,
  isEditing = false,
  editFormState,
  onEditStateChange,
  hideClassType = false
}: ClassesDetailOverviewProps) {
  // Sort teachers alphabetically (Vietnamese locale-aware)
  const sortedTeachers = useMemo(() => [...mockTeachers].sort((a, b) => a.name.localeCompare(b.name, 'vi')), [])
  
  const teacherComboboxOptions = useMemo(() => {
    return sortedTeachers.map((t) => ({
      id: t.id,
      label: t.name,
      subLabel: `${t.code} • ${t.phone}`,
      initials: t.name.split(' ').map((n) => n[0]).slice(-2).join('').toUpperCase()
    }))
  }, [sortedTeachers])

  const handleFieldChange = (field: keyof ClassRecord, value: ClassRecord[keyof ClassRecord]) => {
    if (onEditStateChange && editFormState) {
      onEditStateChange({
        ...editFormState,
        [field]: value
      })
    }
  }



  // Handle teacher change specifically to populate name and phone
  const handleTeacherChange = (teacherId: string) => {
    const teacherObj = mockTeachers.find((t) => t.id === teacherId)
    if (teacherObj && editFormState && onEditStateChange) {
      onEditStateChange({
        ...editFormState,
        teacher: teacherObj.name,
        teacherPhone: teacherObj.phone
      })
    }
  }



  if (isEditing && editFormState) {
    return (
      <div className="space-y-6 pt-4">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Panel: Thông tin hành chính */}
          <Panel title="Thông tin hành chính" icon={<Compass className="h-4 w-4" />} className="p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="col-span-2 grid grid-cols-2 gap-4">
                <FieldLabel label="Tên lớp học" required>
                  <Input 
                    value={editFormState.name || ''} 
                    onChange={(e) => handleFieldChange('name', e.target.value)} 
                    className="h-9 bg-background"
                  />
                </FieldLabel>
                <FieldLabel label="Mã lớp học" required>
                  <Input 
                    value={editFormState.code || ''} 
                    onChange={(e) => handleFieldChange('code', e.target.value)} 
                    className="h-9 bg-background"
                  />
                </FieldLabel>
              </div>

              <FieldLabel label="Khung chương trình">
                {editFormState.status === 'nhap' ? (
                  <InlineSelect
                    value={editFormState.syllabus || ''}
                    options={CURRICULUM_FRAMES}
                    placeholder="Chọn khung chương trình"
                    onValueChange={(val) => {
                      const details = getCurriculumDetails(val)
                      if (details && onEditStateChange) {
                        onEditStateChange({
                          ...editFormState,
                          syllabus: val,
                          level: details.subject,
                          subLevel: details.subLevel,
                        })
                      } else {
                        handleFieldChange('syllabus', val)
                      }
                    }}
                    className="w-full justify-between h-9 bg-background"
                    variant="solid"
                  />
                ) : (
                  <div className="h-9 flex items-center text-xs font-semibold text-foreground px-1 bg-transparent border-none">
                    {editFormState.syllabus || 'Chưa gán'}
                  </div>
                )}
              </FieldLabel>
              {!hideClassType && (
                <FieldLabel label="Loại hình lớp">
                  {editFormState.status === 'nhap' ? (
                    <InlineSelect
                      value={editFormState.classType || 'Chính thức'}
                      options={CLASS_TYPES}
                      placeholder="Chọn loại lớp"
                      onValueChange={(val) => handleFieldChange('classType', val)}
                      className="w-full justify-between h-9 bg-background"
                      variant="solid"
                    />
                  ) : (
                    <div className="h-9 flex items-center text-xs font-semibold text-foreground px-1 bg-transparent border-none">
                      {editFormState.classType || 'Chính thức'}
                    </div>
                  )}
                </FieldLabel>
              )}

              <FieldLabel label="Môn học (Trình độ chính)">
                {editFormState.status === 'nhap' ? (
                  <InlineSelect
                    value={editFormState.level || ''}
                    options={CLASS_LEVELS.map((l) => ({ value: l, label: l }))}
                    placeholder="Chọn trình độ"
                    onValueChange={(val) => handleFieldChange('level', val)}
                    className="w-full justify-between h-9 bg-background"
                    variant="solid"
                  />
                ) : editFormState.syllabus ? (
                  <div className="h-9 flex items-center text-xs font-semibold text-foreground px-1 bg-transparent border-none">
                    {editFormState.level || '—'}
                  </div>
                ) : (
                  <InlineSelect
                    value={editFormState.level || ''}
                    options={CLASS_LEVELS.map((l) => ({ value: l, label: l }))}
                    placeholder="Chọn trình độ"
                    onValueChange={(val) => handleFieldChange('level', val)}
                    className="w-full justify-between h-9 bg-background"
                    variant="solid"
                  />
                )}
              </FieldLabel>
              <FieldLabel label="Trình độ phụ">
                {editFormState.status === 'nhap' ? (
                  <InlineSelect
                    value={editFormState.subLevel || ''}
                    options={CLASS_LEVELS.map((l) => ({ value: l, label: l }))}
                    placeholder="Chọn trình độ"
                    onValueChange={(val) => handleFieldChange('subLevel', val)}
                    className="w-full justify-between h-9 bg-background"
                    variant="solid"
                  />
                ) : editFormState.syllabus ? (
                  <div className="h-9 flex items-center text-xs font-semibold text-foreground px-1 bg-transparent border-none">
                    {editFormState.subLevel || '—'}
                  </div>
                ) : (
                  <InlineSelect
                    value={editFormState.subLevel || ''}
                    options={CLASS_LEVELS.map((l) => ({ value: l, label: l }))}
                    placeholder="Chọn trình độ"
                    onValueChange={(val) => handleFieldChange('subLevel', val)}
                    className="w-full justify-between h-9 bg-background"
                    variant="solid"
                  />
                )}
              </FieldLabel>

              <FieldLabel label="Sĩ số (Tỷ lệ)">
                {editFormState.status === 'nhap' ? (
                  <InlineSelect
                    value={editFormState.classRatio || ''}
                    options={CLASS_RATIOS}
                    placeholder="Chọn tỷ lệ"
                    onValueChange={(val) => handleFieldChange('classRatio', val)}
                    className="w-full justify-between h-9 bg-background"
                    variant="solid"
                  />
                ) : (
                  <div className="h-9 flex items-center text-xs font-semibold text-foreground px-1 bg-transparent border-none">
                    {editFormState.classRatio || '—'}
                  </div>
                )}
              </FieldLabel>
              <FieldLabel label="Loại giáo viên">
                {editFormState.status === 'nhap' ? (
                  <InlineSelect
                    value={editFormState.teacherType || ''}
                    options={TEACHER_TYPES}
                    placeholder="Chọn loại giáo viên"
                    onValueChange={(val) => handleFieldChange('teacherType', val)}
                    className="w-full justify-between h-9 bg-background"
                    variant="solid"
                  />
                ) : (
                  <div className="h-9 flex items-center text-xs font-semibold text-foreground px-1 bg-transparent border-none">
                    {editFormState.teacherType || '—'}
                  </div>
                )}
              </FieldLabel>

              <div className="col-span-2">
                <FieldLabel label="Cơ sở đào tạo">
                  {editFormState.status === 'nhap' ? (
                    <InlineSelect
                      value={editFormState.branch || ''}
                      options={['RinoEdu Linh Đàm', 'RinoEdu Nguyễn Tuân', 'RinoEdu Smart City'].map((b) => ({ value: b, label: b }))}
                      placeholder="Chọn chi nhánh"
                      onValueChange={(val) => {
                        handleFieldChange('branch', val)
                        handleFieldChange('room', '')
                      }}
                      className="w-full justify-between h-9 bg-background"
                      variant="solid"
                    />
                  ) : (
                    <div className="h-9 flex items-center text-xs font-semibold text-foreground px-1 bg-transparent border-none">
                      {editFormState.branch || '—'}
                    </div>
                  )}
                </FieldLabel>
              </div>

              <FieldLabel label="Ngày khai giảng">
                {editFormState.status === 'nhap' ? (
                  <Input
                    type="date"
                    value={editFormState.startDate || ''}
                    onChange={(e) => handleFieldChange('startDate', e.target.value)}
                    className="h-9 bg-background animate-none"
                  />
                ) : (
                  <div className="h-9 flex items-center text-xs font-semibold text-foreground px-1 bg-transparent border-none">
                    {editFormState.startDate && editFormState.startDate !== '---'
                      ? new Date(editFormState.startDate).toLocaleDateString('vi-VN')
                      : '—'}
                  </div>
                )}
              </FieldLabel>
              <FieldLabel label="Ngày bế giảng dự kiến">
                <Input 
                  type="date"
                  value={editFormState.endDate || ''}
                  onChange={(e) => handleFieldChange('endDate', e.target.value)}
                  className="h-9 bg-background"
                />
              </FieldLabel>
            </div>
          </Panel>

          {/* Panel: Cơ cấu giảng dạy mặc định */}
          <Panel title="Cơ cấu giảng dạy mặc định" icon={<Users className="h-4 w-4" />} className="p-4">
            <div className="grid gap-4 sm:grid-cols-1">
              <FieldLabel label="Giáo viên chủ nhiệm">
                <SearchableCombobox
                  options={teacherComboboxOptions}
                  value={mockTeachers.find((t) => t.name === editFormState.teacher)?.id || ''}
                  onChange={handleTeacherChange}
                  placeholder="Chọn giáo viên..."
                />
              </FieldLabel>

              <FieldLabel label="Trợ giảng chỉ định">
                <SearchableCombobox
                  options={teacherComboboxOptions}
                  value={mockTeachers.find((t) => t.name === editFormState.assistant)?.id || ''}
                  onChange={(assistantId) => {
                    if (!assistantId) {
                      if (onEditStateChange) {
                        onEditStateChange({
                          ...editFormState,
                          assistant: '',
                          assistantPhone: ''
                        })
                      }
                      return
                    }
                    const assistantObj = mockTeachers.find((t) => t.id === assistantId)
                    if (assistantObj && onEditStateChange) {
                      onEditStateChange({
                        ...editFormState,
                        assistant: assistantObj.name,
                        assistantPhone: assistantObj.phone
                      })
                    }
                  }}
                  placeholder="Chọn trợ giảng..."
                />
              </FieldLabel>

              <FieldLabel label="Phòng học cố định">
                <InlineSelect
                  value={editFormState.room || ''}
                  options={getRoomsForBranch(editFormState.branch || '')}
                  placeholder={editFormState.branch ? "Chọn phòng học..." : "Vui lòng chọn trường trước"}
                  onValueChange={(val) => handleFieldChange('room', val)}
                  disabled={!editFormState.branch}
                  className="w-full justify-between h-9 bg-background"
                  variant="solid"
                />
              </FieldLabel>

              <FieldLabel label="Trạng thái phân bổ">
                <div className="h-9 flex items-center text-xs font-semibold text-foreground px-1 bg-transparent border-none text-muted-foreground font-normal">
                  Đầy đủ nhân sự (Đã kiểm tra lịch trùng)
                </div>
              </FieldLabel>
            </div>
          </Panel>
        </div>
      </div>
    )
  }

  // Read-only view
  return (
    <div className="space-y-6 pt-4">
      {/* 2. Basic administrative properties */}
      <div className="grid gap-6 md:grid-cols-2">
        <Panel title="Thông tin hành chính" icon={<Compass className="h-4 w-4" />} className="p-4">
          <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
            <InfoField label="Khung chương trình" value={cls.syllabus || '—'} />
            {!hideClassType && <InfoField label="Loại hình lớp" value={cls.classType || 'Chính thức'} />}
            <InfoField label="Môn học (Trình độ chính)" value={`${cls.level || '—'}`} />
            <InfoField label="Trình độ phụ" value={`${cls.subLevel || '—'}`} />
            <InfoField label="Cơ sở đào tạo" value={cls.branch} />
            <InfoField label="Ngày khai giảng" value={cls.startDate && cls.startDate !== '---' ? new Date(cls.startDate).toLocaleDateString('vi-VN') : '—'} />
            <InfoField label="Ngày bế giảng dự kiến" value={cls.endDate && cls.endDate !== '---' ? new Date(cls.endDate).toLocaleDateString('vi-VN') : '—'} />
            <InfoField label="Sĩ số (Tỷ lệ)" value={cls.classRatio || '—'} />
            <InfoField label="Loại giáo viên" value={cls.teacherType || '—'} />
          </div>
        </Panel>

        <Panel title="Cơ cấu giảng dạy mặc định" icon={<Users className="h-4 w-4" />} className="p-4">
          <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
            <InfoField label="Giáo viên chủ nhiệm" value={cls.teacher} supporting={`SĐT: ${cls.teacherPhone}`} />
            <InfoField label="Trợ giảng chỉ định" value={cls.assistant || 'Chưa gán'} supporting={cls.assistantPhone ? `SĐT: ${cls.assistantPhone}` : undefined} />
            <InfoField label="Phòng học cố định" value={cls.room} />
            <InfoField label="Trạng thái phân bổ" value="Đầy đủ nhân sự" supporting="Đã kiểm tra lịch trùng" />
          </div>
        </Panel>
      </div>
    </div>
  )
}
