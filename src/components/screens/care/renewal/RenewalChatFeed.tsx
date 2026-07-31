'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import { useCallStore } from '@/stores/useCallStore'
import { useAuthStore } from '@/stores/useAuthStore'
import {
  type StudentCareAlert,
  type CareInteractionLog,
  type FamilyContact,
} from '@/mocks/careAlerts'
import { getStatusBadgeClass } from '@/lib/statusColors'
import {
  Phone,
  MessageSquare,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  Save,
  ChevronDown,
  Filter,
  AlertTriangle,
  History,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import {
  getRenewalClassification,
  getRenewalClassificationLabel,
  getHistoryLogsForStudent,
  type RenewalClassification,
  type HistoryLog,
  stableHash,
} from './renewalHelpers'

interface RenewalChatFeedProps {
  student: StudentCareAlert
  contacts: FamilyContact[]
  formattedPhone: string
  primaryContact: FamilyContact | undefined
  onRefresh?: () => void
}

export function RenewalChatFeed({
  student,
  contacts,
  formattedPhone,
  onRefresh,
}: RenewalChatFeedProps) {
  const startCall = useCallStore((state) => state.startCall)
  const currentUser = useAuthStore((state) => state.user)

  // Contacts list setup
  const contactsList = useMemo(() => {
    if (contacts && contacts.length > 0) {
      return contacts.map((c) => ({
        name: c.name,
        relationship: c.relationship,
        phone: c.phone || formattedPhone || '0912 345 678',
        isPrimary: c.isPrimary,
      }))
    }
    return [
      { name: 'Lê Thu Thủy', relationship: 'Mẹ', phone: formattedPhone || '0981 511 122', isPrimary: true },
      { name: 'Nguyễn Văn Hùng', relationship: 'Bố', phone: '0987 654 321', isPrimary: false },
    ]
  }, [contacts, formattedPhone])

  const [selectedContactIndex, setSelectedContactIndex] = useState(0)

  const selectedContact = useMemo(() => {
    return contactsList[selectedContactIndex] || contactsList[0]
  }, [contactsList, selectedContactIndex])

  // Renewal status state
  const initialClassification = useMemo(() => getRenewalClassification(student), [student])
  const [renewalClassification, setRenewalClassification] = useState<RenewalClassification>(initialClassification)

  // Interaction Form state
  const [chatChannel, setChatChannel] = useState<'telephone' | 'zalo' | 'direct'>('zalo')
  const [interactionNote, setInteractionNote] = useState('')
  const [parentOpinion, setParentOpinion] = useState('')
  const [callbackTime, setCallbackTime] = useState<string>('2026-07-20T14:00')
  const [selectedStaffFilter, setSelectedStaffFilter] = useState('all')
  const [feedTab, setFeedTab] = useState<'history' | 'roadmap'>('history')

  // History logs setup
  const baseLogs = useMemo(() => getHistoryLogsForStudent(student.studentId), [student.studentId])
  const [localLogs, setLocalLogs] = useState<HistoryLog[]>([])

  // Combined logs
  const allLogs = useMemo(() => {
    return [...localLogs, ...baseLogs]
  }, [localLogs, baseLogs])

  const filteredLogs = useMemo(() => {
    if (selectedStaffFilter === 'all') return allLogs
    return allLogs.filter((log) => log.staff.toLowerCase().includes(selectedStaffFilter.toLowerCase()))
  }, [allLogs, selectedStaffFilter])

  // Reset local state when student changes
  const [lastStudentId, setLastStudentId] = useState<string | null>(null)
  if (student.studentId !== lastStudentId) {
    setLastStudentId(student.studentId)
    setRenewalClassification(getRenewalClassification(student))
    setInteractionNote('')
    setParentOpinion('')
  }

  const handleStartCall = () => {
    startCall({
      studentId: student.studentId,
      studentName: student.studentName,
      parentPhone: selectedContact.phone,
      parentName: `${selectedContact.name} (${selectedContact.relationship})`,
    })
  }

  const handleSaveInteraction = (isComplete = false) => {
    if (!interactionNote.trim() && !parentOpinion.trim()) {
      toast.error('Vui lòng nhập nội dung trao đổi hoặc ý kiến phụ huynh trước khi lưu!')
      return
    }

    const staffName = currentUser?.name || 'AnhNT33 (CSM)'
    const now = new Date()
    const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`

    const newLog: HistoryLog = {
      action: isComplete ? 'Hoàn thành trao đổi tái phí' : 'Ghi nhận tương tác tái phí',
      staff: `${staffName}`,
      date: dateStr,
      note: `${interactionNote.trim()}${parentOpinion ? ` | Ý kiến PH: ${parentOpinion.trim()}` : ''}`,
      channel: chatChannel === 'telephone' ? 'telephone' : 'zalo',
      duration: chatChannel === 'telephone' ? '2 phút 30 giây' : undefined,
      tag: 'CSTP',
      semantic: renewalClassification === 'tai_phi' ? 'success' : renewalClassification === 'that_bai' ? 'error' : 'warning',
    }

    // Update mock student object
    student.interactionNotes = interactionNote
    ;(student as StudentCareAlert & { renewalClassification?: RenewalClassification }).renewalClassification = renewalClassification

    setLocalLogs((prev) => [newLog, ...prev])
    setInteractionNote('')
    setParentOpinion('')

    toast.success(isComplete ? 'Đã hoàn thành và lưu thông tin tái phí!' : 'Đã lưu ghi chú tương tác tái phí thành công!')
    if (onRefresh) onRefresh()
  }

  const classificationOptions: { value: RenewalClassification; label: string; badgeClass: string }[] = [
    { value: 'chua_lien_he', label: 'Chưa liên hệ', badgeClass: getStatusBadgeClass('chua_lien_he') },
    { value: 'can_nhac', label: 'Cân nhắc', badgeClass: getStatusBadgeClass('can_nhac') },
    { value: 'tiem_nang', label: 'Tiềm năng', badgeClass: getStatusBadgeClass('tiem_nang') },
    { value: 'hen_tai', label: 'Hẹn tái', badgeClass: getStatusBadgeClass('hen_tai') },
    { value: 'tai_phi', label: 'Đã tái phí', badgeClass: getStatusBadgeClass('tai_phi') },
    { value: 'that_bai', label: 'Thất bại', badgeClass: getStatusBadgeClass('that_bai') },
  ]

  const currentClassificationObj = classificationOptions.find((c) => c.value === renewalClassification) || classificationOptions[0]

  return (
    <div className="flex h-full min-h-0 flex-col bg-card border border-border rounded-xl shadow-xs overflow-hidden">
      {/* Top Header Bar */}
      <div className="shrink-0 p-3 bg-muted/30 border-b border-border space-y-2.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Family Contact Selection Dropdown */}
          <div className="flex items-center gap-2 min-w-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs font-semibold gap-1.5 bg-background">
                  <span className="text-muted-foreground">PH v</span>
                  <span className="truncate">{selectedContact.name} ({selectedContact.relationship}) - {selectedContact.phone}</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-60 ml-0.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-72">
                <div className="p-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Danh sách liên hệ gia đình
                </div>
                {contactsList.map((contact, idx) => (
                  <DropdownMenuItem
                    key={idx}
                    onClick={() => setSelectedContactIndex(idx)}
                    className={cn('text-xs flex items-center justify-between cursor-pointer', idx === selectedContactIndex && 'font-semibold text-primary')}
                  >
                    <span>{contact.name} ({contact.relationship})</span>
                    <span className="font-mono text-muted-foreground">{contact.phone}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Quick Call Button */}
            <Button
              size="sm"
              className="h-8 text-xs font-semibold gap-1.5 bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
              onClick={handleStartCall}
            >
              <Phone className="h-3.5 w-3.5 fill-current" />
              <span>Gọi điện</span>
            </Button>
          </div>

          {/* Current Renewal Status Badge */}
          <Badge className={cn('px-2.5 py-1 text-xs font-bold shadow-none rounded-md border-none', currentClassificationObj.badgeClass)}>
            {currentClassificationObj.label}
          </Badge>
        </div>

        {/* Interaction Channel Bar & Callback Picker */}
        <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
          {/* Channel Selector */}
          <div className="flex items-center gap-1 bg-background border border-border p-0.5 rounded-lg">
            <button
              type="button"
              onClick={() => setChatChannel('zalo')}
              className={cn(
                'flex items-center gap-1 h-7 px-2.5 rounded-md text-xs font-medium transition-all cursor-pointer',
                chatChannel === 'zalo'
                  ? 'bg-sky-600 text-white font-semibold shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Zalo</span>
            </button>
            <button
              type="button"
              onClick={() => setChatChannel('telephone')}
              className={cn(
                'flex items-center gap-1 h-7 px-2.5 rounded-md text-xs font-medium transition-all cursor-pointer',
                chatChannel === 'telephone'
                  ? 'bg-emerald-600 text-white font-semibold shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Gọi điện</span>
            </button>
            <button
              type="button"
              onClick={() => setChatChannel('direct')}
              className={cn(
                'flex items-center gap-1 h-7 px-2.5 rounded-md text-xs font-medium transition-all cursor-pointer',
                chatChannel === 'direct'
                  ? 'bg-amber-600 text-white font-semibold shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Gặp mặt</span>
            </button>
          </div>

          {/* Callback appointment schedule */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-background border border-border px-2.5 py-1 rounded-lg">
            <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="text-[11px] font-medium shrink-0">Lịch hẹn:</span>
            <input
              type="datetime-local"
              value={callbackTime}
              onChange={(e) => setCallbackTime(e.target.value)}
              className="bg-transparent text-foreground text-xs font-mono font-medium focus:outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Action Form Panel */}
      <div className="shrink-0 p-3 space-y-3 bg-background border-b border-border">
        {/* Textarea 1: Summary Note */}
        <div className="space-y-1">
          <Textarea
            placeholder="Nhập ghi chú tóm tắt nội dung đã trao đổi tái phí..."
            value={interactionNote}
            onChange={(e) => setInteractionNote(e.target.value)}
            className="min-h-[64px] text-xs resize-none bg-muted/20 border-border focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        {/* Input 2: Parent Feedback */}
        <div className="space-y-1">
          <Input
            placeholder="✎ Nhập phản hồi / ý kiến của phụ huynh..."
            value={parentOpinion}
            onChange={(e) => setParentOpinion(e.target.value)}
            className="h-8 text-xs bg-muted/20 border-border placeholder:text-amber-700/70 dark:placeholder:text-amber-400/70 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        {/* Classification Selector & Action Buttons */}
        <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
          {/* Classification Quick Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-muted-foreground">Phân loại Tái phí:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 text-xs font-semibold gap-1 bg-background">
                  <Badge className={cn('h-4 text-[9px] font-bold px-1.5 shadow-none rounded', currentClassificationObj.badgeClass)}>
                    {currentClassificationObj.label}
                  </Badge>
                  <ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-44">
                {classificationOptions.map((opt) => (
                  <DropdownMenuItem
                    key={opt.value}
                    onClick={() => setRenewalClassification(opt.value)}
                    className="text-xs flex items-center justify-between cursor-pointer"
                  >
                    <span>{opt.label}</span>
                    {opt.value === renewalClassification && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSaveInteraction(true)}
              className="h-8 text-xs font-semibold gap-1.5 text-sky-700 border-sky-300 hover:bg-sky-50 dark:text-sky-400 dark:border-sky-800 dark:hover:bg-sky-950/40"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Hoàn thành</span>
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => handleSaveInteraction(false)}
              className="h-8 text-xs font-semibold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Lưu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Feed Sub-Header: Staff Filter & Tabs */}
      <div className="shrink-0 px-3 py-2 bg-muted/40 border-b border-border flex items-center justify-between gap-2">
        {/* Filter Staff */}
        <div className="flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium">Lọc:</span>
          <select
            value={selectedStaffFilter}
            onChange={(e) => setSelectedStaffFilter(e.target.value)}
            className="h-7 text-xs bg-background border border-border rounded-md px-2 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">Tất cả phụ trách</option>
            <option value="AnhNT33">AnhNT33 (CSM)</option>
            <option value="MinhLH">MinhLH (CSM)</option>
            <option value="GV">Giáo viên (GV)</option>
          </select>
        </div>

        {/* Tab Buttons: History vs Roadmap */}
        <div className="flex items-center gap-1 bg-background border border-border p-0.5 rounded-md">
          <button
            type="button"
            onClick={() => setFeedTab('history')}
            className={cn(
              'h-6 px-2.5 text-[11px] font-semibold rounded transition-all cursor-pointer',
              feedTab === 'history'
                ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Lịch sử ({filteredLogs.length})
          </button>
          <button
            type="button"
            onClick={() => setFeedTab('roadmap')}
            className={cn(
              'h-6 px-2.5 text-[11px] font-semibold rounded transition-all cursor-pointer',
              feedTab === 'roadmap'
                ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Mốc chăm sóc
          </button>
        </div>
      </div>

      {/* History Log Timeline Feed */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3 scrollbar-thin">
        {feedTab === 'roadmap' ? (
          <div className="p-4 rounded-xl bg-muted/20 border border-border space-y-3">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <Sparkles className="h-4 w-4" />
              <span>Lộ trình tư vấn Tái phí kiến nghị</span>
            </div>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="p-2.5 rounded-lg bg-background border border-border">
                <div className="font-semibold text-foreground">Bước 1: Báo cáo kết quả học tập (Trước 30 ngày)</div>
                <p className="mt-0.5">Gửi bảng điểm & nhận xét của GV chủ nhiệm qua Zalo. Trao đổi về tỷ lệ chuyên cần.</p>
              </div>
              <div className="p-2.5 rounded-lg bg-background border border-border">
                <div className="font-semibold text-foreground">Bước 2: Tư vấn gói học Level-Up (Trước 15 ngày)</div>
                <p className="mt-0.5">Đề xuất gói tiếp theo với lộ trình tăng cường kỹ năng. Áp dụng ưu đãi Early Bird.</p>
              </div>
              <div className="p-2.5 rounded-lg bg-background border border-border">
                <div className="font-semibold text-foreground">Bước 3: Chốt hợp đồng & Hoàn tất đóng phí</div>
                <p className="mt-0.5">Hỗ trợ phụ huynh chuyển khoản hoặc cọc giữ chỗ trước ngày hết hạn học phí.</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Highlighted Alert Banner if Student has academic warning */}
            {(student.careAlert === 'C90B' || student.homeworkCompletion < 70) && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>Cảnh báo học thuật đặc biệt</span>
                </div>
                <p className="text-xs text-amber-900/90 dark:text-amber-300 font-medium">
                  {student.careAlert === 'C90B' ? 'HT-01: Điểm Kiểm tra dưới chuẩn' : 'Tỷ lệ hoàn thành BTVN chưa đạt ngưỡng 70%'}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-amber-700/80 dark:text-amber-400/80">
                  <Clock className="h-3 w-3" />
                  <span>Lịch sử 2 lần gọi nhớ / không liên hệ trước đó</span>
                </div>
              </div>
            )}

            {/* List of Interaction Logs */}
            {filteredLogs.map((log, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-background border border-border shadow-2xs space-y-2 text-xs">
                {/* Top info line */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="text-foreground">{log.staff}</span>
                    <Badge
                      className={cn(
                        'h-4 text-[9px] font-bold px-1.5 uppercase shadow-none border-none',
                        log.channel === 'telephone'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400'
                      )}
                    >
                      {log.channel === 'telephone' ? 'CALL' : 'ZALO'}
                    </Badge>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">{log.date}</span>
                </div>

                {/* Tag & Action */}
                <div className="flex items-center gap-1.5">
                  <Badge
                    className={cn(
                      'text-[9px] font-bold py-0.5 px-1.5 rounded shadow-none border-none uppercase',
                      log.tag === 'CSTP'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : log.tag === 'ĐB'
                        ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300'
                        : 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300'
                    )}
                  >
                    {log.tag}
                  </Badge>
                  <span className="font-semibold text-foreground text-[11px]">{log.action}</span>
                </div>

                {/* Interaction Note Details */}
                <div className="p-2.5 rounded-lg bg-muted/30 border border-border/60 text-foreground text-[11px] leading-relaxed">
                  {log.note}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
