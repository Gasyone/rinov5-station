'use client'

import { useState } from 'react'
import {
  Camera,
  CheckCircle2,
  PackageCheck,
  Users,
  X,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FieldLabel } from '@/components/shared'
import type { OrderFulfillmentRecord } from '@/mocks/orderFulfillments'

interface OrderFulfillmentBulkActionDialogProps {
  selectedRecords: OrderFulfillmentRecord[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (data: {
    handoverBy: string
    notes: string
    podImage?: string
    handoverDate: string
  }) => void
}

export function OrderFulfillmentBulkActionDialog({
  selectedRecords,
  open,
  onOpenChange,
  onConfirm,
}: OrderFulfillmentBulkActionDialogProps) {
  const [handoverBy, setHandoverBy] = useState<string>('Lễ tân cơ sở')
  const [notes, setNotes] = useState<string>('Bàn giao hàng loạt tại cơ sở')
  const [podImage, setPodImage] = useState<string>('')

  const totalProductsCount = selectedRecords.reduce((acc, r) => {
    return acc + r.products.reduce((pAcc, p) => pAcc + (p.quantity || 1), 0)
  }, 0)

  const handleConfirm = () => {
    const now = new Date()
    const handoverDate = now.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })

    onConfirm({
      handoverBy,
      notes,
      podImage: podImage.trim() || undefined,
      handoverDate,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto p-5 text-xs text-foreground">
        <DialogHeader className="pr-6 pb-2 border-b space-y-1">
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-emerald-700 dark:text-emerald-400">
            <PackageCheck className="h-5 w-5" />
            <span>Xác nhận bàn giao hàng loạt</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Cập nhật trạng thái <strong>Đã bàn giao</strong> cho{' '}
            <span className="font-semibold text-foreground">
              {selectedRecords.length} phiếu
            </span>{' '}
            được chọn ({totalProductsCount} món quà/vật phẩm).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* TÓM TẮT DANH SÁCH HỌC VIÊN ĐƯỢC CHỌN */}
          <div className="p-3 bg-muted/40 rounded-xl border border-border/70 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-primary" />
                <span>Danh sách học viên nhận ({selectedRecords.length})</span>
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                Tổng {totalProductsCount} món
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {selectedRecords.map((r) => (
                <span
                  key={r.id}
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-background border border-border/80 text-foreground font-medium"
                >
                  <span>{r.studentName}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    ({r.products.length} món)
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* FORM NHẬP THÔNG TIN BÀN GIAO */}
          <div className="space-y-3">
            <FieldLabel label="Người thực hiện bàn giao" required>
              <Input
                value={handoverBy}
                onChange={(e) => setHandoverBy(e.target.value)}
                placeholder="Ví dụ: Thu Hà (Lễ tân), Thầy Hùng (GV)..."
                className="h-8 text-xs"
              />
            </FieldLabel>

            <FieldLabel label="Ghi chú bàn giao chung">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ví dụ: Phát quà Trung thu tại lớp, Trao quà bốc thăm trúng thưởng Open Day..."
                className="text-xs resize-none min-h-[60px]"
                rows={2}
              />
            </FieldLabel>

            {/* ẢNH CHỨNG TỪ POD TẬP THỂ */}
            <FieldLabel label="Ảnh chụp bàn giao tập thể / Biên bản ký nhận (tùy chọn)">
              <div className="flex gap-2">
                <Input
                  value={podImage}
                  onChange={(e) => setPodImage(e.target.value)}
                  placeholder="Dán link ảnh chụp chung hoặc biên bản giấy..."
                  className="h-8 text-xs flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs shrink-0 cursor-pointer"
                  onClick={() =>
                    setPodImage(
                      'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=500&auto=format&fit=crop&q=80'
                    )
                  }
                >
                  <Camera className="h-3.5 w-3.5 mr-1" />
                  Ảnh mẫu
                </Button>
              </div>
            </FieldLabel>

            {podImage && (
              <div className="relative w-32 h-20 rounded-md overflow-hidden border border-border group">
                  <img
                    src={podImage}
                    alt="Ảnh POD tập thể"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setPodImage('')}
                    className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Xóa ảnh"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
            )}
          </div>
        </div>

        <DialogFooter className="pt-2 border-t gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button
            type="button"
            size="sm"
            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 cursor-pointer"
            onClick={handleConfirm}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Xác nhận bàn giao ({selectedRecords.length} phiếu)</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
