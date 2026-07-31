'use client'

import { useState, useMemo } from 'react'
import { Users, Phone, Copy, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Panel, InfoField, PersonnelCell, type PersonnelItem } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MultiBranchSelect } from '@/components/controls'
import type { Student } from '@/mocks/students'
import { getStudentFamilyMembers } from './studentDetailHelpers'

interface StudentDetailOverviewProps {
  student: Student
  onUpdateStudent?: (val: Student) => void
}

const maskPhone = (phone: string) => {
  if (!phone) return '-'
  return phone.length >= 7 
    ? phone.slice(0, 3) + '****' + phone.slice(-3) 
    : phone
}

const mockStaffPool: PersonnelItem[] = [
  { id: 'st1', name: 'CSM Minh Phương', role: 'Quản lý CS', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=MinhPhuong', phone: '0987654321', email: 'minhphuong.csm@rinoedu.vn' },
  { id: 'st2', name: 'Trần Thị Sale', role: 'Tư vấn Tuyển sinh', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=TranSale', phone: '0912345678', email: 'sale.tran@rinoedu.vn' },
  { id: 'st3', name: 'Giáo vụ Phương Lan', role: 'Vận hành Lớp học', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=PhuongLan', phone: '0901234567', email: 'phuonglan.giaovu@rinoedu.vn' },
  { id: 'st4', name: 'Thầy Phạm Giảng', role: 'Giáo viên Chủ nhiệm', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=PhamGiang', phone: '0934567890', email: 'phamgiang.gv@rinoedu.vn' },
  { id: 'st5', name: 'Ms. Emily Watson', role: 'Giáo viên Bản ngữ', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Emily', phone: '0977888999', email: 'emily.watson@rinoedu.vn' },
  { id: 'st6', name: 'Kế toán Thu Phương', role: 'Thu ngân & Học phí', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=ThuPhuong', phone: '0966555444', email: 'thuphuong.ketoan@rinoedu.vn' },
]

export function StudentDetailOverview({
  student,
  onUpdateStudent
}: StudentDetailOverviewProps) {
  const [copiedKey, setCopiedKey] = useState('')
  const studentCode = `STU-00${student.id.replace('s', '')}`
  const familyMembers = getStudentFamilyMembers(student)

  // Generate dynamic interacted staff based on student id
  const interactedStaff = useMemo<PersonnelItem[]>(() => {
    const hash = student.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    // Dynamic selection of 1 to 3 staff members to showcase both single and stacked rendering modes
    const count = (hash % 3) + 1 // 1, 2, or 3 staff members
    const list: PersonnelItem[] = []
    for (let i = 0; i < count; i++) {
      list.push(mockStaffPool[(hash + i * 2) % mockStaffPool.length])
    }
    return list
  }, [student.id])

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      toast.success('Đã sao chép số điện thoại!')
      setTimeout(() => setCopiedKey(''), 2000)
    } catch {
      toast.error('Không thể sao chép số điện thoại!')
    }
  }

  // Read-only view with directly editable dropdowns
  return (
    <div className="space-y-6 pt-0">
      {/* 1. Personal Info */}
      <Panel title="Thông tin học viên">
        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoField
            label="Mã học viên (Student Code)"
            value={studentCode}
          />
          <InfoField
            label="CID"
            value={student.id}
          />
          <InfoField
            label="Mã Code hệ thống"
            value="4809440"
          />
          <InfoField
            label="Mã học sinh"
            value="177245"
          />
          <InfoField
            label="Họ và tên"
            value={student.name}
          />
          <InfoField
            label="Ngày sinh"
            value={new Date(student.dob).toLocaleDateString('vi-VN')}
          />
          <InfoField
            label="Giới tính"
            value={student.gender === 'Male' ? 'Nam' : student.gender === 'Female' ? 'Nữ' : 'Khác'}
          />
          <InfoField
            label="Trình độ học tập"
            value={`${student.level} ${student.subLevel ? `(${student.subLevel})` : ''}`}
          />
          <InfoField
            label="Số điện thoại"
            value={student.phone || 'Dùng SĐT phụ huynh'}
            valueClassName={!student.phone ? 'text-muted-foreground font-normal italic text-xs' : ''}
          />
          <InfoField
            label="Email liên hệ"
            value={student.email || 'Dùng email phụ huynh'}
            valueClassName={!student.email ? 'text-muted-foreground font-normal italic text-xs' : ''}
          />
          <InfoField
            label="Trạng thái"
            value={student.status === 'active' ? 'Đang học' : student.status}
          />
          <InfoField
            label="Điểm tích lũy (Points)"
            value="120 Rino Points"
            valueClassName="text-amber-600 font-bold"
          />
        </div>
      </Panel>
    </div>
  )
}
