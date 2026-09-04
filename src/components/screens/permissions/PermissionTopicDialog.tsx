'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FieldLabel } from '@/components/shared'
import type { PermissionTopic } from './permissionsTypes'

interface PermissionTopicDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  topic?: PermissionTopic | null
  onSave: (topicData: { name: string; code: string; description?: string }) => void
}

export function PermissionTopicDialog({
  open,
  onOpenChange,
  topic,
  onSave,
}: PermissionTopicDialogProps) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      if (topic) {
        setName(topic.name)
        setCode(topic.code)
        setDescription(topic.description || '')
      } else {
        setName('')
        setCode('')
        setDescription('')
      }
      setError('')
    }
  }, [open, topic])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Vui lòng nhập tên Topic phân loại')
      return
    }

    const finalCode =
      code.trim() ||
      'TOPIC_' +
        name
          .trim()
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, '_')

    onSave({
      name: name.trim(),
      code: finalCode,
      description: description.trim(),
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">
            {topic ? 'Chỉnh sửa Topic Phân loại' : 'Thêm mới Topic Phân loại'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <FieldLabel label="Tên Topic phân loại" required>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (error) setError('')
              }}
              placeholder="VD: Sale Tuyển sinh, CSKH, Đào tạo..."
              autoFocus
            />
            {error && <span className="text-xs text-rose-500 mt-1 block">{error}</span>}
          </FieldLabel>

          <FieldLabel label="Mã Topic (Tùy chọn)">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="VD: TOPIC_SALE_ENROLLMENT (để trống sẽ tự sinh)"
            />
          </FieldLabel>

          <FieldLabel label="Mô tả phạm vi nhóm">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ghi chú tóm tắt về đối tượng áp dụng của nhóm quyền này..."
              rows={3}
            />
          </FieldLabel>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy bỏ
            </Button>
            <Button type="submit">
              {topic ? 'Lưu thay đổi' : 'Tạo Topic'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
