'use client'

import { Input } from '@/components/ui/input'
import { FieldLabel, Panel } from '@/components/shared'
import { BranchSelect, InlineSelect, SubjectSelect } from '@/components/controls'
import { CLASS_LEVELS, CLASS_SUBJECTS } from '@/mocks/classRecords'
import {
  CURRICULUM_FRAMES,
  CLASS_RATIOS,
  TEACHER_TYPES,
  GRADE_OPTIONS,
  getRoomsForBranch,
} from './classesCreateTypes'

interface ClassesCreateBasicInfoProps {
  classNameStr: string
  setClassName: (val: string) => void
  classCode: string
  setClassCode: (val: string) => void
  subject: string
  onSubjectChange: (val: string) => void
  curriculumFrame: string
  onSyllabusChange: (val: string) => void
  classRatio: string
  setClassRatio: (val: string) => void
  teacherType: string
  setTeacherType: (val: string) => void
  branch: string
  setBranch: (val: string) => void
  setRoom: (val: string) => void
  room: string
  teacherId?: string
  setTeacherId?: (val: string) => void
  level: string
  setLevel: (val: string) => void
  subLevel: string
  setSubLevel: (val: string) => void
  grade?: string
  setGrade?: (val: string) => void
  startDate: string
  setStartDate: (val: string) => void
  endDate: string
  setEndDate: (val: string) => void
  validationErrors: Record<string, string>
  setValidationErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
  branchOptions: string[]
}

export function ClassesCreateBasicInfo({
  classNameStr,
  setClassName,
  classCode,
  setClassCode,
  subject,
  onSubjectChange,
  curriculumFrame,
  onSyllabusChange,
  classRatio,
  setClassRatio,
  teacherType,
  setTeacherType,
  branch,
  setBranch,
  setRoom,
  room,
  level,
  setLevel,
  subLevel,
  setSubLevel,
  grade = '',
  setGrade,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  validationErrors,
  setValidationErrors,
  branchOptions,
}: ClassesCreateBasicInfoProps) {
  const isMathSubject = subject === 'Toán' || subject === 'math' || subject.toLowerCase().includes('toán')
  return (
    <Panel title="Thông tin cơ bản" className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FieldLabel label="Tên lớp" required>
          <Input
            value={classNameStr}
            onChange={(e) => {
              setClassName(e.target.value)
              if (validationErrors.className) {
                setValidationErrors((prev) => {
                  const copy = { ...prev }
                  delete copy.className
                  return copy
                })
              }
            }}
            placeholder="VD: IELTS Junior 1A"
          />
          {validationErrors.className && (
            <span className="text-[11px] text-red-500 font-semibold mt-1 block">
              {validationErrors.className}
            </span>
          )}
        </FieldLabel>
        <FieldLabel label="Mã lớp">
          <Input
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
            placeholder="Hệ thống tự động sinh..."
          />
        </FieldLabel>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FieldLabel label="Môn học" required>
          <SubjectSelect
            value={subject}
            subjects={CLASS_SUBJECTS}
            variant="inline"
            includeAll={false}
            placeholder="Chọn môn học"
            onValueChange={(val) => {
              onSubjectChange(val)
              if (validationErrors.subject) {
                setValidationErrors((prev) => {
                  const copy = { ...prev }
                  delete copy.subject
                  return copy
                })
              }
            }}
            disabled={!!curriculumFrame}
            className="w-full justify-between"
          />
          {validationErrors.subject && (
            <span className="text-[11px] text-red-500 font-semibold mt-1 block">
              {validationErrors.subject}
            </span>
          )}
        </FieldLabel>
        <FieldLabel label="Chương trình" required error={validationErrors.curriculumFrame}>
          <InlineSelect
            value={curriculumFrame}
            options={CURRICULUM_FRAMES}
            placeholder="Chọn chương trình"
            onValueChange={onSyllabusChange}
            className={`w-full justify-between ${
              validationErrors.curriculumFrame
                ? 'border-destructive text-destructive focus:ring-destructive'
                : ''
            }`}
            variant="solid"
          />
          {validationErrors.curriculumFrame && (
            <span className="text-[11px] text-red-500 font-semibold mt-1 block">
              {validationErrors.curriculumFrame}
            </span>
          )}
        </FieldLabel>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FieldLabel label="Sĩ số">
          <InlineSelect
            value={classRatio}
            options={CLASS_RATIOS}
            placeholder="Chọn tỷ lệ"
            onValueChange={setClassRatio}
            className="w-full justify-between"
            variant="solid"
          />
        </FieldLabel>
        <FieldLabel label="Loại giáo viên">
          <InlineSelect
            value={teacherType}
            options={TEACHER_TYPES}
            placeholder="Chọn loại giáo viên"
            onValueChange={setTeacherType}
            className="w-full justify-between"
            variant="solid"
          />
        </FieldLabel>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FieldLabel label="Cơ sở" required>
          <BranchSelect
            value={branch}
            branches={branchOptions}
            variant="inline"
            includeAll={false}
            onValueChange={(val) => {
              setBranch(val)
              setRoom('')
              if (validationErrors.branch) {
                setValidationErrors((prev) => {
                  const copy = { ...prev }
                  delete copy.branch
                  return copy
                })
              }
            }}
            className="w-full justify-between"
          />
          {validationErrors.branch && (
            <span className="text-[11px] text-red-500 font-semibold mt-1 block">
              {validationErrors.branch}
            </span>
          )}
        </FieldLabel>
        <FieldLabel label="Phòng học cố định">
          <InlineSelect
            value={room}
            options={getRoomsForBranch(branch)}
            placeholder={branch ? 'Chọn phòng học...' : 'Vui lòng chọn trường trước'}
            onValueChange={setRoom}
            disabled={!branch}
            className="w-full justify-between"
            variant="solid"
          />
        </FieldLabel>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FieldLabel label="Trình độ chính">
          <InlineSelect
            value={level}
            options={CLASS_LEVELS.map((l: string) => ({ value: l, label: l }))}
            placeholder="Chọn trình độ"
            onValueChange={setLevel}
            disabled={!!curriculumFrame}
            className="w-full justify-between"
            variant="solid"
          />
        </FieldLabel>
        <FieldLabel label="Trình độ phụ">
          <InlineSelect
            value={subLevel}
            options={CLASS_LEVELS.map((l: string) => ({ value: l, label: l }))}
            placeholder="Chọn trình độ"
            onValueChange={setSubLevel}
            disabled={!!curriculumFrame}
            className="w-full justify-between"
            variant="solid"
          />
        </FieldLabel>
      </div>

      {isMathSubject && (
        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
          <FieldLabel label="Khối lớp truyền thống">
            <InlineSelect
              value={grade}
              options={GRADE_OPTIONS}
              placeholder="Chọn khối lớp (1 - 12)"
              onValueChange={(val) => setGrade?.(val)}
              className="w-full justify-between"
              variant="solid"
            />
          </FieldLabel>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <FieldLabel label="Ngày bắt đầu" required>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value)
              if (validationErrors.startDate) {
                setValidationErrors((prev) => {
                  const copy = { ...prev }
                  delete copy.startDate
                  return copy
                })
              }
            }}
          />
          {validationErrors.startDate && (
            <span className="text-[11px] text-red-500 font-semibold mt-1 block">
              {validationErrors.startDate}
            </span>
          )}
        </FieldLabel>
        <FieldLabel label="Ngày bế giảng dự kiến">
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </FieldLabel>
      </div>
    </Panel>
  )
}
