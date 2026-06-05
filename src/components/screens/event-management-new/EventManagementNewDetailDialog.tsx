'use client'

import { useState, useEffect } from 'react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { BackButton, Panel, InfoField, MetricTile, ConfirmDialog } from '@/components/shared'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { 
  EventItem, 
  AttendeeItem, 
  getAttendeesByEventId, 
  toggleCheckInStatus, 
  toggleParentCheckIn,
  toggleChildCheckIn,
  addAttendeeToEvent, 
  updateEvent,
  cancelEvent,
  getEventDetail
} from '@/mocks/eventManagement'
import { formatDateTime, calculatePercentage } from './eventManagementNewHelpers'
import { EventManagementNewAddGuest } from './EventManagementNewAddGuest'
import { 
  Search, 
  UserPlus, 
  Calendar, 
  MapPin, 
  User, 
  Clock, 
  ClipboardList, 
  AlertTriangle,
  Play,
  CheckSquare
} from 'lucide-react'

interface EventManagementNewDetailDialogProps {
  isOpen: boolean
  eventId: string | null
  onClose: () => void
  onEventUpdated: () => void
}

export function EventManagementNewDetailDialog({ isOpen, eventId, onClose, onEventUpdated }: EventManagementNewDetailDialogProps) {
  const [event, setEvent] = useState<EventItem | null>(null)
  const [attendees, setAttendees] = useState<AttendeeItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'cho_checkin' | 'checkin' | 'waitlist'>('all')
  const [showAddGuest, setShowAddGuest] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [cancelReasonText, setCancelReasonText] = useState('')

  // Load event details & attendees list
  useEffect(() => {
    Promise.resolve().then(() => {
      if (isOpen && eventId) {
        const data = getAttendeesByEventId(eventId)
        setAttendees(data)
        const evt = getEventDetail(eventId)
        if (evt) {
          setEvent(evt)
        }
      } else {
        setEvent(null)
        setAttendees([])
      }
      setSearchQuery('')
      setStatusFilter('all')
    })
  }, [isOpen, eventId])

  if (!event) return null

  const handleParentCheckIn = (attendeeId: string, checkedIn: boolean) => {
    const updated = toggleParentCheckIn(event.id, attendeeId, checkedIn)
    setAttendees(updated)
    refreshEvent()
  }

  const handleChildCheckIn = (attendeeId: string, checkedIn: boolean) => {
    const updated = toggleChildCheckIn(event.id, attendeeId, checkedIn)
    setAttendees(updated)
    refreshEvent()
  }

  const handleCancelRsvp = (attendeeId: string) => {
    const updated = toggleCheckInStatus(event.id, attendeeId, 'cancelled')
    setAttendees(updated)
    refreshEvent()
  }

  const handleAddGuest = (guest: { name: string; phone: string; email?: string; childName?: string; childAge?: number; trialStation?: string }) => {
    const updated = addAttendeeToEvent(event.id, guest)
    setAttendees(updated)
    refreshEvent()
  }

  const handleStartEvent = () => {
    updateEvent(event.id, { status: 'dang_dien_ra' })
    refreshEvent()
  }

  const handleCompleteEvent = () => {
    updateEvent(event.id, { status: 'ket_thuc' })
    refreshEvent()
  }

  const handleCancelEventSubmit = () => {
    if (!cancelReasonText.trim()) return
    cancelEvent(event.id, cancelReasonText)
    setShowCancelConfirm(false)
    refreshEvent()
  }

  const refreshEvent = () => {
    const evt = getEventDetail(event.id)
    if (evt) {
      setEvent(evt)
    }
    onEventUpdated()
  }

  // Filter attendees list
  const filteredAttendees = attendees.filter(att => {
    if (statusFilter !== 'all' && att.status !== statusFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return att.name.toLowerCase().includes(q) || att.phone.includes(searchQuery)
    }
    return true
  })

  const attendanceRate = calculatePercentage(event.checkedInCount, event.registeredCount)

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
        <SheetContent side="right" className="w-full sm:max-w-full lg:max-w-[85vw] flex flex-col p-0 gap-0">
          
          {/* Header Bar */}
          <div className="border-b px-6 py-4 flex items-center justify-between bg-muted/20">
            <div className="flex items-center gap-3">
              <BackButton onClick={onClose} label="Quay lại" />
              <div className="h-4 w-px bg-border hidden sm:block" />
              <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded hidden sm:inline-block">
                {event.id}
              </span>
              <Badge className={getStatusBadgeClass(event.status)}>
                {event.statusLabel}
              </Badge>
            </div>
            
            {/* Quick action buttons based on status */}
            <div className="flex items-center gap-2">
              {event.status === 'mo_dang_ky' && (
                <Button size="sm" variant="outline" className="text-primary hover:bg-primary/5 gap-1.5" onClick={handleStartEvent}>
                  <Play className="h-4 w-4 fill-primary" /> Bắt đầu Sự kiện
                </Button>
              )}
              {event.status === 'dang_dien_ra' && (
                <Button size="sm" variant="outline" className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 border-emerald-200 gap-1.5" onClick={handleCompleteEvent}>
                  <CheckSquare className="h-4 w-4" /> Kết thúc Sự kiện
                </Button>
              )}
              {event.status !== 'ket_thuc' && event.status !== 'huy' && (
                <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/5 hover:text-destructive" onClick={() => setShowCancelConfirm(true)}>
                  Hủy sự kiện
                </Button>
              )}
            </div>
          </div>

          {/* Main content grid */}
          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-10 overflow-hidden">
            
            {/* Left Column - Metadata (30%) */}
            <div className="lg:col-span-3 border-r p-6 overflow-y-auto bg-muted/5 space-y-6">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold tracking-tight">{event.title}</h2>
                <p className="text-xs text-muted-foreground font-mono">{event.id}</p>
              </div>

              {event.status === 'huy' && event.cancelReason && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-1.5 text-xs">
                  <span className="font-semibold text-destructive flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" /> Sự kiện bị hủy bỏ
                  </span>
                  <p className="text-muted-foreground">{event.cancelReason}</p>
                </div>
              )}

              <Panel title="Thông tin cơ bản">
                <div className="space-y-4">
                  <InfoField 
                    label="Chi nhánh" 
                    value={
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                        {event.branch}
                      </span>
                    } 
                  />
                  <InfoField 
                    label="Thời gian tổ chức" 
                    value={
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                        {formatDateTime(event.startDate)}
                      </span>
                    } 
                  />
                  <InfoField 
                    label="Thời gian kết thúc" 
                    value={
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                        {formatDateTime(event.endDate)}
                      </span>
                    } 
                  />
                  <InfoField 
                    label="Địa điểm cụ thể" 
                    value={
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                        {event.location}
                      </span>
                    } 
                  />
                  <InfoField 
                    label="Ban tổ chức" 
                    value={
                      <span className="flex items-center gap-1.5">
                        <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                        {event.organizer}
                      </span>
                    } 
                  />
                </div>
              </Panel>

              {event.description && (
                <Panel title="Mô tả ngắn">
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </Panel>
              )}
            </div>

            {/* Right Column - Interaction & Tabs (70%) */}
            <div className="lg:col-span-7 flex flex-col min-h-0 overflow-hidden">
              <Tabs defaultValue="reception" className="flex-1 flex flex-col min-h-0">
                <div className="border-b px-6">
                  <TabsList className="h-12 bg-transparent gap-6 p-0 border-b-0">
                    <TabsTrigger value="reception" className="h-full border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-1 text-sm font-medium">
                      Đón tiếp & Điểm danh
                    </TabsTrigger>
                    <TabsTrigger value="agenda" className="h-full border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-1 text-sm font-medium">
                      Lịch trình (Agenda)
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-6">
                  
                  {/* Tab 1: Reception and Guest List */}
                  <TabsContent value="reception" className="mt-0 space-y-6 outline-none">
                    
                    {/* Metric Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <MetricTile
                        label="Phụ huynh tham dự"
                        value={event.status === 'nhap' ? '0' : String(attendees.filter(att => att.parentCheckedIn && att.status !== 'cancelled').length)}
                        trend={{ value: `Đăng ký: ${attendees.filter(att => att.status !== 'cancelled').length}`, positive: true }}
                      />
                      <MetricTile
                        label="Con trải nghiệm học thử"
                        value={event.status === 'nhap' ? '0' : String(attendees.filter(att => att.childCheckedIn && att.childName && att.status !== 'cancelled').length)}
                        trend={{ value: `Đăng ký con: ${attendees.filter(att => att.childName && att.status !== 'cancelled').length}`, positive: true }}
                      />
                      <MetricTile
                        label="Tỷ lệ tham dự"
                        value={event.status === 'nhap' ? '0%' : `${attendanceRate}%`}
                        trend={{ value: "Hiệu suất đón tiếp", positive: true }}
                      />
                    </div>

                    {/* Toolbar inside Guest list */}
                    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2">
                      <div className="flex flex-1 items-center gap-2 w-full">
                        <div className="relative flex-1 max-w-sm">
                          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Tìm tên hoặc SĐT khách mời..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 h-9"
                            disabled={event.status === 'nhap'}
                          />
                        </div>

                        {/* Status filters */}
                        <select 
                          value={statusFilter} 
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value as 'all' | 'cho_checkin' | 'checkin' | 'waitlist')}
                          className="h-9 border border-input rounded-md px-3 text-xs bg-background"
                          disabled={event.status === 'nhap'}
                        >
                          <option value="all">Tất cả trạng thái</option>
                          <option value="cho_checkin">Chờ check-in</option>
                          <option value="checkin">Đã tham dự</option>
                          <option value="waitlist">Danh sách chờ</option>
                          <option value="cancelled">Đã hủy</option>
                        </select>
                      </div>

                      {event.status !== 'ket_thuc' && event.status !== 'huy' && event.status !== 'nhap' && (
                        <Button size="sm" className="w-full sm:w-auto h-9 gap-1.5" onClick={() => setShowAddGuest(true)}>
                          <UserPlus className="h-4 w-4" /> Thêm khách mời
                        </Button>
                      )}
                    </div>

                    {/* Attendees list main view */}
                    {event.status === 'nhap' ? (
                      <div className="border border-dashed rounded-lg p-12 text-center text-xs text-muted-foreground">
                        <ClipboardList className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                        Sự kiện đang ở trạng thái Nháp. Vui lòng công bố sự kiện để mở cổng đăng ký khách mời.
                      </div>
                    ) : filteredAttendees.length > 0 ? (
                      <div className="border rounded-md overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-muted/50 font-medium border-b">
                            <tr>
                              <th className="p-3">Phụ huynh (Người đăng ký)</th>
                              <th className="p-3">Học sinh đi kèm (Học thử)</th>
                              <th className="p-3">Số điện thoại</th>
                              <th className="p-3">Điểm danh Phụ huynh</th>
                              <th className="p-3">Điểm danh Học sinh</th>
                              <th className="p-3 text-right">Hành động</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {filteredAttendees.map(att => (
                              <tr key={att.id} className="hover:bg-muted/30 transition-colors group">
                                <td className="p-3">
                                  <div className="space-y-0.5">
                                    <p className="font-semibold text-foreground">{att.name}</p>
                                    {att.email && <p className="text-[10px] text-muted-foreground">{att.email}</p>}
                                  </div>
                                </td>
                                <td className="p-3">
                                  {att.childName ? (
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-medium text-foreground">{att.childName}</span>
                                        <Badge variant="outline" className="text-[9px] h-4.5 rounded-full border-purple-200 bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400">
                                          {att.childAge} tuổi
                                        </Badge>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <span className="text-[10px] text-muted-foreground">Trạm:</span>
                                        <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 dark:bg-purple-950/20 px-1.5 py-0.5 rounded">
                                          {att.trialStation}
                                        </span>
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground italic text-[11px]">Không đăng ký con</span>
                                  )}
                                </td>
                                <td className="p-3 text-muted-foreground font-mono">{att.phone}</td>
                                <td className="p-3">
                                  {event.status === 'dang_dien_ra' && att.status !== 'cancelled' ? (
                                    <label className="flex items-center gap-2 cursor-pointer w-max">
                                      <input 
                                        type="checkbox" 
                                        checked={att.parentCheckedIn ?? false} 
                                        onChange={(e) => handleParentCheckIn(att.id, e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                      />
                                      <span className={`text-[11px] font-semibold ${att.parentCheckedIn ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                                        {att.parentCheckedIn ? `Đã đến (${att.parentCheckInTime})` : 'Chờ check-in'}
                                      </span>
                                    </label>
                                  ) : (
                                    <Badge className={getStatusBadgeClass(att.status)}>
                                      {att.statusLabel}
                                    </Badge>
                                  )}
                                </td>
                                <td className="p-3">
                                  {att.childName ? (
                                    event.status === 'dang_dien_ra' && att.status !== 'cancelled' ? (
                                      <label className="flex items-center gap-2 cursor-pointer w-max">
                                        <input 
                                          type="checkbox" 
                                          checked={att.childCheckedIn ?? false} 
                                          onChange={(e) => handleChildCheckIn(att.id, e.target.checked)}
                                          className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                        />
                                        <span className={`text-[11px] font-semibold ${att.childCheckedIn ? 'text-purple-600' : 'text-muted-foreground'}`}>
                                          {att.childCheckedIn ? `Đã đến (${att.childCheckInTime})` : 'Chờ check-in'}
                                        </span>
                                      </label>
                                    ) : (
                                      <span className="text-[11px] text-muted-foreground font-semibold">
                                        {att.childCheckedIn ? `Đã đến (${att.childCheckInTime || '—'})` : 'Chờ check-in'}
                                      </span>
                                    )
                                  ) : (
                                    <span className="text-[11px] text-muted-foreground">—</span>
                                  )}
                                </td>
                                <td className="p-3 text-right">
                                  {att.status !== 'cancelled' && event.status !== 'ket_thuc' && (
                                    <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-destructive hover:bg-destructive/5 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleCancelRsvp(att.id)}>
                                      Hủy vé
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="border border-dashed rounded-lg p-12 text-center text-xs text-muted-foreground">
                        Không tìm thấy khách mời nào phù hợp với bộ lọc hiện tại.
                      </div>
                    )}
                  </TabsContent>

                  {/* Tab 2: Agenda Lịch trình */}
                  <TabsContent value="agenda" className="mt-0 outline-none">
                    {event.agenda && event.agenda.length > 0 ? (
                      <div className="relative pl-6 border-l-2 border-muted space-y-8 py-2">
                        {event.agenda.map((ag) => (
                          <div key={ag.id} className="relative space-y-1.5">
                            {/* Dot indicator */}
                            <span className="absolute -left-[31px] top-1.5 h-4.5 w-4.5 rounded-full border-2 border-background bg-primary flex items-center justify-center">
                              <span className="h-1.5 w-1.5 rounded-full bg-background" />
                            </span>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                              <span className="text-xs font-mono font-semibold text-primary">{ag.timeLabel}</span>
                              {ag.speaker && (
                                <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded w-max sm:w-auto">
                                  Phụ trách: {ag.speaker}
                                </span>
                              )}
                            </div>
                            
                            <h4 className="text-sm font-semibold text-foreground">{ag.title}</h4>
                            {ag.description && (
                              <p className="text-xs text-muted-foreground whitespace-pre-wrap pr-4 leading-relaxed">
                                {ag.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border border-dashed rounded-lg p-12 text-center text-xs text-muted-foreground">
                        Sự kiện này chưa thiết lập khung lịch trình (Agenda) chi tiết.
                      </div>
                    )}
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Add Guest Modal Component */}
      <EventManagementNewAddGuest
        isOpen={showAddGuest}
        onClose={() => setShowAddGuest(false)}
        onAdd={handleAddGuest}
      />

      {/* Cancel Event Confirm dialog */}
      <ConfirmDialog
        open={showCancelConfirm}
        onOpenChange={setShowCancelConfirm}
        title="Bạn có chắc chắn muốn hủy sự kiện này?"
        description="Mọi vé đăng ký của khách mời sẽ tự động chuyển sang trạng thái đã hủy. Hành động này không thể hoàn tác."
        confirmLabel="Hủy sự kiện"
        cancelLabel="Đóng"
        onConfirm={handleCancelEventSubmit}
      >
        <div className="mt-4 space-y-1.5">
          <label className="text-xs font-medium text-foreground">Lý do hủy sự kiện *</label>
          <Input 
            placeholder="Nhập lý do chi tiết..."
            value={cancelReasonText}
            onChange={(e) => setCancelReasonText(e.target.value)}
          />
        </div>
      </ConfirmDialog>
    </>
  )
}
