'use client'

import { useState } from 'react'
import { PlusCircle, BookOpen, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { FieldLabel, Panel } from '@/components/shared'
import { InlineSelect, StudentCombobox, SubjectSelect, type StudentOption } from '@/components/controls'
import { RenewalCareRecord } from './renewalTypes'
import { toast } from 'sonner'

interface RenewalAddDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  studentOptions: StudentOption[]
  onAdd: (record: Omit<RenewalCareRecord, 'id' | 'renewalStatus' | 'subStatus' | 'resultType' | 'interactionLogs'>) => void
}

const RENEWAL_SUBJECTS = ['Toán tư duy', 'Tiếng Anh'] as const
type RenewalSubject = (typeof RENEWAL_SUBJECTS)[number]

export function RenewalAddDialog({
  open,
  onOpenChange,
  studentOptions,
  onAdd
}: RenewalAddDialogProps) {
  const [studentId, setStudentId] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<StudentOption | null>(null)
  
  const [subject, setSubject] = useState<RenewalSubject>('Toán tư duy')
  const [classCode, setClassCode] = useState('')
  const [expirationDate, setExpirationDate] = useState('')
  const [csStaff, setCsStaff] = useState('AnhNTN33')
  const [level, setLevel] = useState('Einstein 0')
  const [subLevel, setSubLevel] = useState('A')
  const [remainingSessions, setRemainingSessions] = useState(2)
  const [totalSessions, setTotalSessions] = useState(72)
  const [startDate, setStartDate] = useState(() => {
    const d = new Date()
    d.setMonth(d.getMonth() - 6)
    return d.toISOString().split('T')[0].split('-').reverse().join('/')
  })
  const [realtimeStatus, setRealtimeStatus] = useState<'Đang học' | 'Chờ chuyển lớp' | 'Hết buổi'>('Đang học')
  const [teacherCode, setTeacherCode] = useState('GV_HuiLT20')
  const [schedule, setSchedule] = useState('T4 - 17:30-19:30')
  const [attendanceRatio, setAttendanceRatio] = useState('8/8')
  const [homeworkCompletion, setHomeworkCompletion] = useState(85)
  const [lastTestScore, setLastTestScore] = useState(8.5)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentId || !selectedStudent) {
      toast.error('Vui lòng chọn học viên.')
      return
    }
    if (!classCode.trim()) {
      toast.error('Vui lòng nhập mã lớp.')
      return
    }
    if (!expirationDate) {
      toast.error('Vui lòng chọn ngày hết hạn học phí.')
      return
    }

    onAdd({
      studentId,
      studentName: selectedStudent.label,
      customerCode: selectedStudent.phone ? `CUST_${studentId}` : undefined,
      subject,
      classCode: classCode.trim().toUpperCase(),
      expirationDate, // Format YYYY-MM-DD
      level: level.trim(),
      subLevel: subLevel.trim(),
      startDate,
      realtimeStatus,
      teacherCode: teacherCode.trim(),
      schedule: schedule.trim(),
      remainingSessions: Number(remainingSessions),
      totalSessions: Number(totalSessions),
      attendanceRatio,
      homeworkCompletion: Number(homeworkCompletion),
      lastTestScore: Number(lastTestScore),
      priorTestScore: Number((lastTestScore - 0.5).toFixed(1)),
      csStaff: csStaff.trim(),
      studentFolderLink: 'https://docs.google.com/document/d/rinov5-student-folder-new'
    })

    // Reset Form
    setStudentId('')
    setSelectedStudent(null)
    setClassCode('')
    setExpirationDate('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-h-[90vh] overflow-y-auto sm:max-w-4xl p-0 gap-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="px-6 py-5 border-b border-border">
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-primary" />
            Thêm Học viên vào Chiến dịch Tái phí
          </DialogTitle>
          <DialogDescription className="text-xs">
            Chủ động lập hồ sơ chăm sóc tái phí học viên cận hết phí hoặc quá hạn để theo dõi lịch sử tương tác.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 min-h-0 flex flex-col">
          <div className="p-6 grid gap-6 md:grid-cols-2">
            
            {/* Left Column: Student & Course */}
            <div className="space-y-4">
              <Panel title="Thông tin Học viên & Lớp học" icon={<BookOpen className="h-4 w-4 text-primary" />}>
                <div className="space-y-3.5 pt-1">
                  <FieldLabel label="Học viên" required description="Chọn học viên hiện có từ cơ sở dữ liệu.">
                    <StudentCombobox
                      options={studentOptions}
                      value={studentId}
                      onChange={(val, selected) => {
                        setStudentId(val)
                        setSelectedStudent(selected)
                      }}
                      placeholder="Tìm theo tên học viên hoặc SĐT..."
                      className="text-xs"
                    />
                  </FieldLabel>

                  <div className="grid grid-cols-2 gap-3">
                    <FieldLabel label="Môn học / Phân hệ" required>
                      <SubjectSelect
                        value={subject}
                        subjects={[...RENEWAL_SUBJECTS]}
                        variant="inline"
                        includeAll={false}
                        onValueChange={(val) => setSubject(val as RenewalSubject)}
                        className="h-9 border-solid text-xs shadow-xs"
                      />
                    </FieldLabel>

                    <FieldLabel label="Mã lớp học" required>
                      <Input
                        value={classCode}
                        onChange={(e) => setClassCode(e.target.value)}
                        placeholder="Ví dụ: LD_TOAN_00010"
                        className="h-9 text-xs border border-input bg-background focus-visible:ring-[3px]"
                        required
                      />
                    </FieldLabel>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FieldLabel label="Hạn hết học phí" required description="Chọn mốc thời gian hết phí.">
                      <Input
                        type="date"
                        value={expirationDate}
                        onChange={(e) => setExpirationDate(e.target.value)}
                        className="h-9 text-xs border border-input bg-background focus-visible:ring-[3px] font-mono"
                        required
                      />
                    </FieldLabel>

                    <FieldLabel label="Trạng thái học vụ">
                      <InlineSelect
                        value={realtimeStatus}
                        onValueChange={(val) => setRealtimeStatus(val as 'Đang học' | 'Chờ chuyển lớp' | 'Hết buổi')}
                        options={[
                          { value: 'Đang học', label: 'Đang học bình thường' },
                          { value: 'Chờ chuyển lớp', label: 'Chờ chuyển lớp' },
                          { value: 'Hết buổi', label: 'Hết buổi / Chờ phí' }
                        ]}
                        className="h-9 border-solid text-xs shadow-xs"
                      />
                    </FieldLabel>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FieldLabel label="Ngày bắt đầu học">
                      <Input
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        placeholder="DD/MM/YYYY"
                        className="h-9 text-xs border border-input bg-background focus-visible:ring-[3px]"
                      />
                    </FieldLabel>

                    <FieldLabel label="Giáo viên chính">
                      <Input
                        value={teacherCode}
                        onChange={(e) => setTeacherCode(e.target.value)}
                        placeholder="Mã GV (Ví dụ: GV_HuiLT20)"
                        className="h-9 text-xs border border-input bg-background focus-visible:ring-[3px]"
                      />
                    </FieldLabel>
                  </div>

                  <FieldLabel label="Lịch học của lớp">
                    <Input
                      value={schedule}
                      onChange={(e) => setSchedule(e.target.value)}
                      placeholder="Ví dụ: T4 - 17:30-19:30"
                      className="h-9 text-xs border border-input bg-background focus-visible:ring-[3px]"
                    />
                  </FieldLabel>
                </div>
              </Panel>
            </div>

            {/* Right Column: Level & Academic Stats */}
            <div className="space-y-4">
              <Panel title="Trình độ & Chỉ số học thuật" icon={<ShieldAlert className="h-4 w-4 text-primary" />}>
                <div className="space-y-3.5 pt-1">
                  <div className="grid grid-cols-2 gap-3">
                    <FieldLabel label="Cấp độ (Level)">
                      <Input
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        placeholder="Einstein 0"
                        className="h-9 text-xs border border-input bg-background focus-visible:ring-[3px]"
                      />
                    </FieldLabel>

                    <FieldLabel label="Nhánh cấp độ (Sub-level)">
                      <Input
                        value={subLevel}
                        onChange={(e) => setSubLevel(e.target.value)}
                        placeholder="A"
                        className="h-9 text-xs border border-input bg-background focus-visible:ring-[3px]"
                      />
                    </FieldLabel>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FieldLabel label="Số buổi còn lại">
                      <Input
                        type="number"
                        min="0"
                        value={remainingSessions}
                        onChange={(e) => setRemainingSessions(Number(e.target.value))}
                        className="h-9 text-xs border border-input bg-background focus-visible:ring-[3px]"
                      />
                    </FieldLabel>

                    <FieldLabel label="Tổng số buổi gói phí">
                      <Input
                        type="number"
                        min="1"
                        value={totalSessions}
                        onChange={(e) => setTotalSessions(Number(e.target.value))}
                        className="h-9 text-xs border border-input bg-background focus-visible:ring-[3px]"
                      />
                    </FieldLabel>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <FieldLabel label="Chuyên cần">
                      <Input
                        value={attendanceRatio}
                        onChange={(e) => setAttendanceRatio(e.target.value)}
                        placeholder="8/8"
                        className="h-9 text-xs border border-input bg-background focus-visible:ring-[3px] font-mono text-center"
                      />
                    </FieldLabel>

                    <FieldLabel label="Tỷ lệ BTVN (%)">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={homeworkCompletion}
                        onChange={(e) => setHomeworkCompletion(Number(e.target.value))}
                        className="h-9 text-xs border border-input bg-background focus-visible:ring-[3px] font-mono text-center"
                      />
                    </FieldLabel>

                    <FieldLabel label="Điểm test">
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={lastTestScore}
                        onChange={(e) => setLastTestScore(Number(e.target.value))}
                        className="h-9 text-xs border border-input bg-background focus-visible:ring-[3px] font-mono text-center"
                      />
                    </FieldLabel>
                  </div>

                  <FieldLabel label="Chuyên viên CSKH phụ trách" required>
                    <Input
                      value={csStaff}
                      onChange={(e) => setCsStaff(e.target.value)}
                      placeholder="Mã CSM (Ví dụ: AnhNTN33)"
                      className="h-9 text-xs border border-input bg-background focus-visible:ring-[3px]"
                      required
                    />
                  </FieldLabel>
                </div>
              </Panel>
            </div>

          </div>

          <DialogFooter className="px-6 py-4 border-t border-border bg-muted/20 flex gap-2 justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="text-xs h-9 cursor-pointer"
            >
              Hủy bỏ
            </Button>
            <Button 
              type="submit"
              variant="default"
              className="text-xs h-9 font-semibold bg-primary text-white hover:bg-primary/90 cursor-pointer"
            >
              Thêm học viên tái phí
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
