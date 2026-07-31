import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FieldLabel } from '@/components/shared'
import { InlineSelect } from '@/components/controls'
import type { RoomRecord } from './calendarRoomTypes'
import { toast } from 'sonner'

interface CalendarRoomAssignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  room: RoomRecord | null
  initialTimeSlot?: string
}

export function CalendarRoomAssignDialog({
  open,
  onOpenChange,
  room,
  initialTimeSlot = '18:00 - 19:30',
}: CalendarRoomAssignDialogProps) {
  const [selectedClass, setSelectedClass] = useState('CLS-IELTS-001')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(initialTimeSlot)

  const classOptions = [
    { value: 'CLS-IELTS-001', label: 'CLS-IELTS-001 (IELTS Junior 1A - Cô Lan)' },
    { value: 'CLS-MATH-002', label: 'CLS-MATH-002 (Toán Tư Duy A2 - Thầy Hùng)' },
    { value: 'CLS-STEM-003', label: 'CLS-STEM-003 (STEM Robotics Intro - Thầy Tuấn)' },
  ]

  const timeOptions = [
    { value: '09:00 - 11:30', label: 'Ca Sáng (09:00 - 11:30)' },
    { value: '14:00 - 17:00', label: 'Ca Chiều (14:00 - 17:00)' },
    { value: '18:00 - 19:30', label: 'Ca Tối 1 (18:00 - 19:30)' },
    { value: '19:45 - 21:15', label: 'Ca Tối 2 (19:45 - 21:15)' },
  ]

  const handleSubmit = () => {
    toast.success(`Đã gán lớp ${selectedClass} vào ${room?.roomName || 'phòng'} (${selectedTimeSlot})`)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Gán lớp học vào phòng</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-sm">
          <FieldLabel label="Phòng học chọn">
            <div className="font-semibold text-foreground p-2 rounded bg-muted/40 border mt-1">
              {room ? `${room.roomName} (Sức chứa ${room.capacity} chỗ)` : 'Chưa chọn phòng'}
            </div>
          </FieldLabel>

          <FieldLabel label="Khung giờ ca học">
            <InlineSelect
              options={timeOptions}
              value={selectedTimeSlot}
              onValueChange={setSelectedTimeSlot}
              ariaLabel="Khung giờ ca học"
            />
          </FieldLabel>

          <FieldLabel label="Chọn lớp học phân công">
            <InlineSelect
              options={classOptions}
              value={selectedClass}
              onValueChange={setSelectedClass}
              ariaLabel="Chọn lớp học"
            />
          </FieldLabel>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>Xác nhận Gán phòng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
