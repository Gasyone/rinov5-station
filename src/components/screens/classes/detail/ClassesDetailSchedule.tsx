'use client'

import { useState } from 'react'
import { Calendar, Clock, MapPin, User, Plus, Trash2, Pencil } from 'lucide-react'
import { Panel, ConfirmDialog } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { ClassesAddScheduleDialog } from './ClassesAddScheduleDialog'
import type { ClassRecord, ScheduleSlot } from '@/mocks/classRecords'

interface ClassesDetailScheduleProps {
  cls: ClassRecord
  onUpdateSchedule?: (slots: ScheduleSlot[]) => void
  validationErrors?: Record<string, string>
}

export function ClassesDetailSchedule({ cls, onUpdateSchedule, validationErrors }: ClassesDetailScheduleProps) {
  // Local state to keep slots list interactive for the demo
  const [slots, setSlots] = useState<ScheduleSlot[]>(() => 
    cls.scheduleSlots && cls.scheduleSlots.length > 0
      ? cls.scheduleSlots
      : [
          { dayOfWeek: 'Thứ 2', date: '02/06', startTime: '18:00', endTime: '19:30', room: cls.room, teachers: [cls.teacher] },
          { dayOfWeek: 'Thứ 4', date: '04/06', startTime: '18:00', endTime: '19:30', room: cls.room, teachers: [cls.teacher] },
          { dayOfWeek: 'Thứ 6', date: '06/06', startTime: '18:00', endTime: '19:30', room: cls.room, teachers: [cls.teacher] }
        ]
  )

  // Dialog States
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)

  const handleDeleteTrigger = (index: number) => {
    setDeleteIndex(index)
    setIsConfirmDeleteOpen(true)
  }

  const handleDeleteSlot = () => {
    if (deleteIndex === null) return
    const updatedSlots = slots.filter((_, idx) => idx !== deleteIndex)
    setSlots(updatedSlots)
    
    if (onUpdateSchedule) {
      onUpdateSchedule(updatedSlots)
    }

    setDeleteIndex(null)
    setIsConfirmDeleteOpen(false)
  }

  const handleSaveNewSchedule = (newSlots: ScheduleSlot[]) => {
    setSlots(newSlots)
    if (onUpdateSchedule) {
      onUpdateSchedule(newSlots)
    }
  }

  return (
    <div className="space-y-6 pt-4">
      
      <Panel 
        title="Lịch học cố định hàng tuần" 
        icon={<Calendar className="h-4 w-4" />} 
        className="p-4"
        actions={
          <Button 
            size="xs" 
            variant="outline" 
            onClick={() => setIsAddOpen(true)}
            className="rounded-lg text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Thêm lịch cố định
          </Button>
        }
      >


        <div className="grid gap-3">
          {validationErrors?.schedule && (
            <div className="p-3 rounded-xl border border-destructive bg-destructive/5 text-xs text-destructive font-semibold">
              {validationErrors.schedule}
            </div>
          )}

          {slots.length > 0 ? (
            slots.map((slot, index) => {
              const hasRoomError = !!validationErrors?.[`room_${index}`]
              const hasTeacherError = !!validationErrors?.[`teacher_${index}`]
              return (
                <div 
                  key={index} 
                  className={`grid grid-cols-1 md:grid-cols-12 items-center p-3.5 border rounded-xl bg-transparent border-muted gap-4 relative group hover:bg-muted/10 hover:border-muted-foreground/30 transition-all hover:shadow-2xs ${
                    hasRoomError || hasTeacherError ? 'border-destructive/50 bg-destructive/5' : ''
                  }`}
                >
                  
                  {/* Day and time */}
                  <div className="flex items-center justify-between gap-3 md:col-span-4 min-w-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`h-9 w-9 shrink-0 rounded-xl flex items-center justify-center border ${
                        hasRoomError || hasTeacherError 
                          ? 'bg-destructive/10 text-destructive border-destructive/20' 
                          : 'bg-primary/10 text-primary border-primary/20'
                      }`}>
                        <Calendar className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0">
                        <h5 className={`text-sm font-bold truncate ${hasRoomError || hasTeacherError ? 'text-destructive' : 'text-foreground'}`}>{slot.dayOfWeek}</h5>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5 font-mono">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
                          <span className="truncate">{slot.startTime} – {slot.endTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => setIsAddOpen(true)}
                        className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg h-8 w-8"
                        title="Sửa lịch học"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => handleDeleteTrigger(index)}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg h-8 w-8"
                        title="Xóa lịch học"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Classroom & Teacher allocated */}
                  <div className="grid grid-cols-2 gap-2 md:gap-4 text-xs md:col-span-8 pr-0 md:pr-10 w-full">
                    <div className={`flex items-center gap-2 min-w-0 p-1 rounded-lg ${hasRoomError ? 'border border-destructive/50 bg-destructive/5 text-destructive' : ''}`}>
                      <span className={`p-1.5 rounded-lg flex items-center justify-center shrink-0 ${hasRoomError ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'}`}>
                        <MapPin className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0">
                        <p className={`text-[10px] font-medium uppercase tracking-wider truncate ${hasRoomError ? 'text-destructive/80' : 'text-muted-foreground'}`}>Phòng học</p>
                        <p className="font-semibold truncate">{slot.room || cls.room || 'Chưa gán'}</p>
                        {hasRoomError && <span className="text-[9px] text-destructive block mt-0.5">{validationErrors[`room_${index}`]}</span>}
                      </div>
                    </div>

                    <div className={`flex items-center gap-2 min-w-0 p-1 rounded-lg ${hasTeacherError ? 'border border-destructive/50 bg-destructive/5 text-destructive' : ''}`}>
                      <span className={`p-1.5 rounded-lg flex items-center justify-center shrink-0 ${hasTeacherError ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'}`}>
                        <User className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0">
                        <p className={`text-[10px] font-medium uppercase tracking-wider truncate ${hasTeacherError ? 'text-destructive/80' : 'text-muted-foreground'}`}>Giảng viên chính</p>
                        <p className="font-semibold truncate">{slot.teachers?.[0] || cls.teacher || 'Chưa gán'}</p>
                        {hasTeacherError && <span className="text-[9px] text-destructive block mt-0.5">{validationErrors[`teacher_${index}`]}</span>}
                      </div>
                    </div>
                  </div>

                </div>
              )})
          ) : (
            <div className="p-8 border border-dashed rounded-xl flex flex-col items-center justify-center text-center bg-muted/5 py-12">
              <Calendar className="h-8 w-8 text-muted-foreground/40 mb-2" />
              <h4 className="text-sm font-bold text-foreground">Chưa xếp lịch học cố định</h4>
              <p className="text-xs text-muted-foreground max-w-xs mt-1">
                Lớp này hiện không có lịch học cố định hàng tuần. Bấm vào nút bên trên để tạo lịch.
              </p>
            </div>
          )}
        </div>
      </Panel>

      {/* High-fidelity dialog for setting schedule & teacher allocation */}
      {isAddOpen && (
        <ClassesAddScheduleDialog
          open={isAddOpen}
          onOpenChange={setIsAddOpen}
          cls={{ ...cls, scheduleSlots: slots }}
          onSave={handleSaveNewSchedule}
        />
      )}

      {/* Safety Confirm Dialog for Deleting Slot */}
      <ConfirmDialog
        open={isConfirmDeleteOpen}
        onOpenChange={setIsConfirmDeleteOpen}
        title="Xác nhận xóa lịch học cố định?"
        description={
          deleteIndex !== null && slots[deleteIndex] ? (
            <span>
              Bạn có chắc chắn muốn xóa lịch học cố định vào <strong>{slots[deleteIndex].dayOfWeek} ({slots[deleteIndex].startTime} - {slots[deleteIndex].endTime})</strong>? Hành động này sẽ không thể hoàn tác trong phiên làm việc này.
            </span>
          ) : undefined
        }
        confirmLabel="Xóa lịch học"
        variant="destructive"
        onConfirm={handleDeleteSlot}
      />

    </div>
  )
}
