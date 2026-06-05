'use client'

import { Phone, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getStatusBadgeClass } from '@/lib/statusColors'

export interface CareScheduleItem {
  id: string
  studentId: string
  studentName: string
  parentName: string
  phone: string
  scheduleTime: string
  touchpointType: 'Cuộc gọi 2 buổi đầu' | 'Cuộc gọi định kỳ tháng' | 'Cuộc gọi đột xuất C90B'
  notes: string
  status: 'Chờ gọi' | 'Đã gọi' | 'KNM' | 'Hẹn gọi lại'
}

interface CareScheduleTableProps {
  items: CareScheduleItem[]
  selectedIds: Set<string>
  onToggleRow: (id: string) => void
  onCall: (item: CareScheduleItem) => void
}

export function CareScheduleTable({ items, selectedIds, onToggleRow, onCall }: CareScheduleTableProps) {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox />
            </TableHead>
            <TableHead className="min-w-40 text-xs font-semibold">Học viên / Phụ huynh</TableHead>
            <TableHead className="min-w-36 text-xs font-semibold">Thời gian hẹn</TableHead>
            <TableHead className="min-w-44 text-xs font-semibold">Loại cuộc gọi / Điểm chạm</TableHead>
            <TableHead className="min-w-56 text-xs font-semibold">Nội dung cần trao đổi</TableHead>
            <TableHead className="min-w-28 text-xs font-semibold text-center">Trạng thái</TableHead>
            <TableHead className="w-24 text-right text-xs font-semibold sticky right-0 bg-background z-10">Tác vụ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center text-xs text-muted-foreground">
                Không có lịch hẹn chăm sóc học viên nào trong ngày được chọn.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => {
              return (
                <TableRow key={item.id} className="text-xs hover:bg-muted/40 transition-colors">
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(item.id)}
                      onCheckedChange={() => onToggleRow(item.id)}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-foreground">{item.studentName}</span>
                      <span className="text-[10px] text-muted-foreground">
                        PH: {item.parentName} • {item.phone}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      <span className="font-mono text-[11px] font-semibold text-foreground">
                        {item.scheduleTime}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`text-[9px] px-1.5 h-4.5 font-bold ${
                        item.touchpointType === 'Cuộc gọi 2 buổi đầu'
                          ? getStatusBadgeClass('new')
                          : item.touchpointType === 'Cuộc gọi định kỳ tháng'
                            ? getStatusBadgeClass('info')
                            : getStatusBadgeClass('high')
                      }`}
                    >
                      {item.touchpointType}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <p className="text-[10px] text-muted-foreground max-w-sm leading-relaxed" title={item.notes}>
                      {item.notes}
                    </p>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge 
                      variant="outline" 
                      className={`text-[9px] px-1.5 h-4.5 font-semibold ${
                        item.status === 'Đã gọi'
                          ? getStatusBadgeClass('success')
                          : item.status === 'KNM'
                            ? getStatusBadgeClass('error')
                            : item.status === 'Hẹn gọi lại'
                              ? getStatusBadgeClass('warning')
                              : getStatusBadgeClass('neutral')
                      }`}
                    >
                      {item.status === 'Đã gọi' && <CheckCircle className="h-2.5 w-2.5 mr-1 text-emerald-500" />}
                      {item.status === 'KNM' && <AlertCircle className="h-2.5 w-2.5 mr-1 text-red-500" />}
                      {item.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right sticky right-0 bg-background/95 backdrop-blur-xs z-10">
                    <Button
                      size="sm"
                      variant={item.status === 'Đã gọi' ? 'outline' : 'default'}
                      onClick={() => onCall(item)}
                      disabled={item.status === 'Đã gọi'}
                      className="h-7 text-[10px] font-semibold gap-1 px-2.5"
                    >
                      <Phone className="h-3 w-3" />
                      {item.status === 'Đã gọi' ? 'Đã liên hệ' : 'Bắt đầu gọi'}
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
