'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { FieldLabel } from '@/components/shared'
import { FileText, Pencil } from 'lucide-react'

interface StudentCareReportLinkDialogsProps {
  isReportDialogOpen: boolean
  setIsReportDialogOpen: (open: boolean) => void
  isEditReportOpen: boolean
  setIsEditReportOpen: (open: boolean) => void
  isEnglish: boolean
  reportTitle: string
  setReportTitle: (title: string) => void
  reportUrl: string
  setReportUrl: (url: string) => void
  reportNotes: string
  setReportNotes: (notes: string) => void
  editReportTitle: string
  editReportUrl: string
  setEditReportUrl: (url: string) => void
  handleCreateReport: (e: React.FormEvent) => void
  handleSaveEditReport: (e: React.FormEvent) => void
}

export function StudentCareReportLinkDialogs({
  isReportDialogOpen,
  setIsReportDialogOpen,
  isEditReportOpen,
  setIsEditReportOpen,
  isEnglish,
  reportTitle,
  setReportTitle,
  reportUrl,
  setReportUrl,
  reportNotes,
  setReportNotes,
  editReportTitle,
  editReportUrl,
  setEditReportUrl,
  handleCreateReport,
  handleSaveEditReport,
}: StudentCareReportLinkDialogsProps) {
  return (
    <>
      {/* Create Report Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="sm:max-w-[420px] select-none text-left">
          <form onSubmit={handleCreateReport}>
            <DialogHeader>
              <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
                <FileText className="h-4 w-4 text-violet-500" />
                Tạo báo cáo định kỳ hàng tháng
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <FieldLabel label="Tên báo cáo">
                <Input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder={
                    isEnglish
                      ? `VD: Báo cáo Tiếng Anh - Tháng ${String(new Date().getMonth() + 1).padStart(2, '0')}/${new Date().getFullYear()}`
                      : `VD: Báo cáo môn Toán - Tháng ${String(new Date().getMonth() + 1).padStart(2, '0')}/${new Date().getFullYear()}`
                  }
                  className="text-xs focus-visible:ring-violet-500 h-9"
                />
              </FieldLabel>

              <FieldLabel 
                label="Đường liên kết báo cáo (Google Docs URL)" 
                description="Mặc định sẽ sử dụng link mẫu của Google Docs nếu bỏ trống."
              >
                <Input
                  type="url"
                  value={reportUrl}
                  onChange={(e) => setReportUrl(e.target.value)}
                  placeholder="https://docs.google.com/document/d/..."
                  className="text-xs focus-visible:ring-violet-500 h-9"
                />
              </FieldLabel>

              <FieldLabel label="Ghi chú / Nhận xét báo cáo">
                <Textarea
                  value={reportNotes}
                  onChange={(e) => setReportNotes(e.target.value)}
                  placeholder="Nhập ghi chú hoặc đánh giá tổng quát cho báo cáo tháng này..."
                  className="text-xs min-h-[80px] max-h-[140px] focus-visible:ring-violet-500 py-2 px-3 resize-none leading-relaxed"
                />
              </FieldLabel>
            </div>

            <DialogFooter className="mt-2.5 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsReportDialogOpen(false)}
                className="text-xs h-8 cursor-pointer shadow-none"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                size="sm"
                className="text-xs h-8 bg-violet-600 hover:bg-violet-700 text-white font-bold cursor-pointer"
              >
                Lưu báo cáo
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Report Dialog */}
      <Dialog open={isEditReportOpen} onOpenChange={setIsEditReportOpen}>
        <DialogContent className="sm:max-w-[420px] select-none text-left">
          <form onSubmit={handleSaveEditReport}>
            <DialogHeader>
              <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
                <Pencil className="h-4 w-4 text-violet-500" />
                Chỉnh sửa liên kết báo cáo
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <FieldLabel label="Tên báo cáo" description="Tên của báo cáo định kỳ.">
                <Input
                  type="text"
                  value={editReportTitle}
                  disabled
                  className="text-xs bg-muted/30 focus-visible:ring-transparent h-9 cursor-not-allowed select-none"
                />
              </FieldLabel>

              <FieldLabel 
                label="Đường liên kết báo cáo (Google Docs URL)" 
                description="Nhập liên kết mới cho báo cáo này."
              >
                <Input
                  type="url"
                  required
                  value={editReportUrl}
                  onChange={(e) => setEditReportUrl(e.target.value)}
                  placeholder="https://docs.google.com/document/d/..."
                  className="text-xs focus-visible:ring-violet-500 h-9"
                />
              </FieldLabel>
            </div>

            <DialogFooter className="mt-2.5 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditReportOpen(false)}
                className="text-xs h-8 cursor-pointer shadow-none"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                size="sm"
                className="text-xs h-8 bg-violet-600 hover:bg-violet-700 text-white font-bold cursor-pointer"
              >
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
