'use client'

import { useMemo, useState } from 'react'
import {
  Phone,
  Mail,
  Copy,
  Check,
  Star,
  ExternalLink
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useUserProfileStore } from '@/stores/useUserProfileStore'
import { mockStudents } from '@/mocks/students'
import { mockTeachers } from '@/mocks/teacherRecords'
import { mockEmployees } from '@/mocks/employees'
import {
  mockTeacherAssignments,
  mockQualityReviews,
  mockTeacherNotes,
  mockActivityLogs
} from '@/mocks/teacherDetail'
import { AppAvatar } from './AppAvatar'
import { getStatusBadgeClass } from '@/lib/statusColors'

export function UserProfileDialog() {
  const { isOpen, userId, userType, openProfile, closeProfile } = useUserProfileStore()
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleCopy = async (text: string, field: string) => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      toast.success(`Đã sao chép ${field}!`)
      setTimeout(() => setCopiedField(null), 2000)
    } catch {
      toast.error('Không thể sao chép!')
    }
  }

  const handleCall = (name: string, phone: string) => {
    toast.success(`Đang kết nối cuộc gọi CS tới ${name} (${phone})...`)
  }

  // Lookups based on type and query (id or name)
  const data = useMemo(() => {
    if (!isOpen || !userId || !userType) return null

    const q = userId.toLowerCase()

    if (userType === 'student') {
      const student = mockStudents.find((s) => s.id.toLowerCase() === q || s.name.toLowerCase() === q)
      if (!student) return null
      return {
        type: 'student' as const,
        payload: student,
        classes: mockStudents.filter((s) => s.parentName === student.parentName), // Siblings
      }
    }

    if (userType === 'teacher') {
      let teacher = mockTeachers.find((t) => t.id.toLowerCase() === q || t.name.toLowerCase() === q)
      const employee = mockEmployees.find((e) => e.id.toLowerCase() === q || e.name.toLowerCase() === q)

      if (!teacher && employee) {
        // Map employee to teacher format if teaching position
        teacher = {
          id: employee.id,
          code: `GV-${employee.id.toUpperCase()}`,
          name: employee.name,
          email: employee.email,
          phone: employee.phone,
          branch: employee.branch,
          subjects: ['English'],
          status: employee.status === 'active' ? 'active' : 'resigned',
          totalStudents: 0,
          totalClasses: 0,
          rating: 5.0,
          startDate: employee.hireDate,
        }
      }

      if (!teacher) return null

      // Fetch teacher assignments, notes, reviews, logs
      const assignments = mockTeacherAssignments.filter((a) => a.teacherId === teacher.id)
      const reviews = mockQualityReviews.filter((r) => r.teacherId === teacher.id)
      const notes = mockTeacherNotes.filter((n) => n.teacherId === teacher.id)
      const logs = mockActivityLogs.filter((l) => l.teacherId === teacher.id)

      return {
        type: 'teacher' as const,
        payload: teacher,
        assignments,
        reviews,
        notes,
        logs,
      }
    }

    if (userType === 'parent') {
      // Find a student that has this parent name
      const matchedStudent = mockStudents.find(
        (s) => s.parentName && (s.parentName.toLowerCase() === q || s.parentPhone === userId)
      )
      if (!matchedStudent || !matchedStudent.parentName) return null

      // Find all students (children) belonging to this parent
      const children = mockStudents.filter((s) => s.parentName === matchedStudent.parentName)

      return {
        type: 'parent' as const,
        payload: {
          name: matchedStudent.parentName,
          phone: matchedStudent.parentPhone || '—',
          email: `${matchedStudent.parentName.toLowerCase().replace(/\s+/g, '')}@parent.rino.edu`,
          branch: matchedStudent.branch,
        },
        children,
      }
    }

    if (userType === 'staff') {
      const employee = mockEmployees.find((e) => e.id.toLowerCase() === q || e.name.toLowerCase() === q)
      if (!employee) return null
      return {
        type: 'staff' as const,
        payload: employee,
      }
    }

    return null
  }, [isOpen, userId, userType])

  if (!isOpen || !data) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeProfile()}>
      <DialogContent className="max-w-[720px] p-0 overflow-hidden rounded-2xl border bg-background shadow-2xl z-50">
        <DialogHeader className="sr-only">
          <DialogTitle>Hồ sơ cá nhân</DialogTitle>
        </DialogHeader>

        {/* 1. Header Banner Gradient */}
        {data.type === 'teacher' && (
          <div className="h-24 bg-gradient-to-r from-indigo-600 via-indigo-500 to-slate-700 w-full" />
        )}
        {data.type === 'student' && (
          <div className="h-24 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-700 w-full" />
        )}
        {data.type === 'parent' && (
          <div className="h-24 bg-gradient-to-r from-violet-600 via-violet-500 to-purple-700 w-full" />
        )}
        {data.type === 'staff' && (
          <div className="h-24 bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-700 w-full" />
        )}

        {/* 2. Profile Overlapping Header */}
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 mb-4">
            <AppAvatar
              src={
                data.type === 'student'
                  ? data.payload.avatar
                  : data.type === 'staff'
                  ? data.payload.avatar
                  : undefined
              }
              name={data.payload.name}
              size="2xl"
              shape="circle"
              className="border-4 border-background shadow-lg bg-background"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-bold text-foreground truncate">{data.payload.name}</h3>
                {data.type === 'teacher' && (
                  <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-300 dark:border-indigo-900 rounded-md">
                    {data.payload.code}
                  </Badge>
                )}
                {data.type === 'student' && (
                  <Badge className={getStatusBadgeClass(data.payload.status)}>
                    Học viên
                  </Badge>
                )}
                {data.type === 'parent' && (
                  <Badge className="bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/20 dark:text-violet-300 dark:border-violet-900 rounded-md">
                    Phụ huynh
                  </Badge>
                )}
                {data.type === 'staff' && (
                  <Badge className="bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/20 dark:text-sky-300 dark:border-sky-900 rounded-md">
                    Nhân sự
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {data.type === 'teacher' && `Giáo viên · ${data.payload.branch}`}
                {data.type === 'student' && `Học sinh · ${data.payload.branch}`}
                {data.type === 'parent' && `Phụ huynh · ${data.payload.branch}`}
                {data.type === 'staff' && `${data.payload.position} · ${data.payload.branch}`}
              </p>
            </div>

            {/* Quick Contact Buttons */}
            {data.payload.phone && data.payload.phone !== '—' && (
              <div className="flex gap-2 shrink-0 self-start sm:self-auto">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCall(data.payload.name, data.payload.phone || '')}
                  className="rounded-xl border-emerald-200 text-emerald-600 bg-emerald-50/20 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <Phone className="h-4 w-4 mr-1.5" /> Gọi điện
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(data.payload.phone || '', 'Số điện thoại')}
                  className="rounded-xl"
                >
                  {copiedField === 'Số điện thoại' ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* 3. Tab content details */}
          <div className="border-t pt-4">
            {/* TEACHER PROFILE TABS */}
            {data.type === 'teacher' && (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4 rounded-xl">
                  <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                  <TabsTrigger value="classes">Lớp phụ trách</TabsTrigger>
                  <TabsTrigger value="reviews">QC & Đánh giá</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Thông tin cơ bản</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Chuyên môn:</span>
                          <span className="font-semibold text-foreground">{data.payload.subjects.join(', ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ngày bắt đầu:</span>
                          <span className="font-semibold text-foreground">{data.payload.startDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Đánh giá chung:</span>
                          <span className="font-semibold text-amber-500 flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-amber-500" /> {data.payload.rating}/5.0
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email:</span>
                          <span className="font-semibold text-foreground font-mono truncate max-w-[200px]" title={data.payload.email}>
                            {data.payload.email}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Thống kê lớp học</h4>
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="p-2.5 rounded-lg bg-background border">
                          <div className="text-lg font-bold text-primary">{data.payload.totalClasses}</div>
                          <div className="text-[10px] text-muted-foreground uppercase font-bold mt-0.5">Đang dạy</div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-background border">
                          <div className="text-lg font-bold text-primary">{data.payload.totalStudents}</div>
                          <div className="text-[10px] text-muted-foreground uppercase font-bold mt-0.5">Học viên</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {data.notes && data.notes.length > 0 && (
                    <div className="rounded-xl border p-4 space-y-2.5 bg-yellow-50/20 border-yellow-200/50">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-yellow-700 dark:text-yellow-400">Ghi chú quản lý</h4>
                      <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                        {data.notes.map((note) => (
                          <div key={note.id} className="text-xs leading-relaxed text-foreground border-b border-border/40 pb-1.5 last:border-0 last:pb-0">
                            <div className="flex justify-between text-[10px] text-muted-foreground mb-0.5">
                              <span>Tác giả: {note.author}</span>
                              <span>{note.date}</span>
                            </div>
                            <p className="italic">{note.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="classes" className="space-y-4">
                  <div className="border rounded-xl overflow-hidden max-h-[280px] overflow-y-auto">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="bg-muted border-b">
                          <th className="p-3 font-semibold text-muted-foreground">Lớp học</th>
                          <th className="p-3 font-semibold text-muted-foreground">Lịch học</th>
                          <th className="p-3 font-semibold text-muted-foreground">Phòng</th>
                          <th className="p-3 font-semibold text-muted-foreground text-center">Sĩ số</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.assignments && data.assignments.length > 0 ? (
                          data.assignments.map((cls) => (
                            <tr key={cls.id} className="border-b last:border-0 hover:bg-muted/10">
                              <td className="p-3 font-semibold text-foreground">
                                <div>{cls.className}</div>
                                <div className="text-[10px] text-muted-foreground font-mono">{cls.classCode}</div>
                              </td>
                              <td className="p-3 text-muted-foreground">{cls.schedule}</td>
                              <td className="p-3 text-foreground font-medium">{cls.room}</td>
                              <td className="p-3 text-center text-foreground font-semibold">{cls.studentCount}/{cls.maxStudents}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="p-6 text-center text-muted-foreground italic">
                              Chưa có lớp học được phân công.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-4">
                  <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                    {data.reviews && data.reviews.length > 0 ? (
                      data.reviews.map((rev) => (
                        <div key={rev.id} className="rounded-xl border p-4 bg-muted/10 space-y-2.5">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-xs font-bold text-foreground">Đánh giá chuyên môn</span>
                              <span className="text-[10px] text-muted-foreground block">Người kiểm định: {rev.reviewer} &middot; {rev.date}</span>
                            </div>
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900 rounded-md font-bold">
                              {rev.score} / 5.0
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground whitespace-pre-wrap italic">&ldquo;{rev.feedback}&rdquo;</p>
                          {rev.improvementSuggestions && (
                            <div className="text-[11px] text-indigo-600 dark:text-indigo-400 bg-indigo-50/30 dark:bg-indigo-950/10 p-2 rounded-lg leading-relaxed">
                              <span className="font-bold">Đề xuất cải tiến: </span>
                              {rev.improvementSuggestions}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-sm text-muted-foreground italic p-6 border border-dashed rounded-xl">
                        Chưa có lịch sử kiểm tra chất lượng giảng dạy.
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            )}

            {/* STUDENT PROFILE TABS */}
            {data.type === 'student' && (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4 rounded-xl">
                  <TabsTrigger value="overview">Lộ trình học</TabsTrigger>
                  <TabsTrigger value="parents">Phụ huynh</TabsTrigger>
                  <TabsTrigger value="classes">Lớp tham gia</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Học thuật</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Trình độ:</span>
                          <span className="font-semibold text-foreground">{data.payload.level} {data.payload.subLevel ? `(${data.payload.subLevel})` : ''}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Lộ trình:</span>
                          <span className="font-semibold text-foreground">{data.payload.learningPath || 'Chưa thiết lập'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ngày nhập học:</span>
                          <span className="font-semibold text-foreground">{data.payload.enrollmentDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Chương trình:</span>
                          <span className="font-semibold text-foreground truncate max-w-[150px]" title={data.payload.curriculum}>
                            {data.payload.curriculum || 'Chưa gán'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Thông tin gói học</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Gói đăng ký:</span>
                          <span className="font-semibold text-foreground truncate max-w-[150px]">{data.payload.packageName || 'Chưa đăng ký'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Số buổi học:</span>
                          <span className="font-semibold text-foreground">
                            {data.payload.remainingSessions !== undefined && data.payload.totalSessions !== undefined
                              ? `${data.payload.remainingSessions} / ${data.payload.totalSessions} buổi còn lại`
                              : 'Chưa có thông tin'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sale phụ trách:</span>
                          <span className="font-semibold text-foreground">{data.payload.saleName || '—'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {data.payload.notes && (
                    <div className="rounded-xl border p-4 space-y-2 bg-yellow-50/20 border-yellow-200/50">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-yellow-700 dark:text-yellow-400">Ghi chú học tập</h4>
                      <p className="text-xs text-foreground italic leading-relaxed whitespace-pre-wrap">{data.payload.notes}</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="parents" className="space-y-4">
                  <div className="rounded-xl border p-4 space-y-4 bg-muted/10">
                    <div className="flex items-center gap-3">
                      <AppAvatar name={data.payload.parentName || 'PH'} size="lg" shape="circle" />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-foreground">
                          {data.payload.parentName || 'Chưa cập nhật thông tin phụ huynh'}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">Người bảo hộ & liên hệ chính</p>
                      </div>
                      {data.payload.parentName && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openProfile(data.payload.parentName!, 'parent')}
                          className="text-xs text-primary gap-1"
                        >
                          Xem hồ sơ PH <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}
                    </div>

                    <div className="border-t pt-3 space-y-2.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5" /> Số điện thoại:
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground font-mono">{data.payload.parentPhone || '—'}</span>
                          {data.payload.parentPhone && (
                            <Button
                              size="icon-xs"
                              variant="ghost"
                              onClick={() => handleCopy(data.payload.parentPhone!, 'Số điện thoại')}
                              className="h-5 w-5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                            >
                              {copiedField === 'Số điện thoại' ? (
                                <Check className="h-3 w-3 text-emerald-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5" /> Email liên hệ:
                        </span>
                        <span className="font-semibold text-foreground font-mono">
                          {data.payload.email || '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="classes" className="space-y-4">
                  <div className="border rounded-xl overflow-hidden max-h-[280px] overflow-y-auto">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="bg-muted border-b">
                          <th className="p-3 font-semibold text-muted-foreground">Lớp học</th>
                          <th className="p-3 font-semibold text-muted-foreground">Giáo viên</th>
                          <th className="p-3 font-semibold text-muted-foreground">Tiến độ</th>
                          <th className="p-3 font-semibold text-muted-foreground text-center">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.payload.enrolledClasses && data.payload.enrolledClasses.length > 0 ? (
                          data.payload.enrolledClasses.map((cls) => (
                            <tr key={cls.classCode} className="border-b last:border-0 hover:bg-muted/10">
                              <td className="p-3 font-semibold text-foreground">
                                <div>{cls.className}</div>
                                <div className="text-[10px] text-muted-foreground font-mono">{cls.classCode}</div>
                              </td>
                              <td className="p-3 text-muted-foreground font-medium">{cls.teacherName}</td>
                              <td className="p-3 text-foreground font-semibold">{cls.progress}</td>
                              <td className="p-3 text-center">
                                <Badge className={getStatusBadgeClass(cls.status)}>
                                  {cls.status}
                                </Badge>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="p-6 text-center text-muted-foreground italic">
                              Chưa ghi danh vào lớp học nào.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            )}

            {/* PARENT PROFILE TABS */}
            {data.type === 'parent' && (
              <Tabs defaultValue="children" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4 rounded-xl">
                  <TabsTrigger value="children">Danh sách học viên liên kết</TabsTrigger>
                  <TabsTrigger value="contact">Thông tin liên hệ</TabsTrigger>
                </TabsList>

                <TabsContent value="children" className="space-y-3">
                  <p className="text-xs text-muted-foreground italic mb-2">
                    Nhấp vào học viên để chuyển đổi trực tiếp sang xem hồ sơ của học viên đó:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[250px] overflow-y-auto pr-1">
                    {data.children && data.children.length > 0 ? (
                      data.children.map((child) => (
                        <div
                          key={child.id}
                          onClick={() => openProfile(child.id, 'student')}
                          className="flex items-center gap-3 p-3 rounded-xl border bg-muted/20 hover:bg-muted/50 cursor-pointer transition-colors"
                        >
                          <AppAvatar src={child.avatar} name={child.name} size="md" shape="circle" />
                          <div className="min-w-0 flex-1">
                            <h5 className="text-xs font-bold text-foreground truncate">{child.name}</h5>
                            <p className="text-[10px] text-muted-foreground mt-0.5 font-mono truncate">
                              {child.id} &middot; {child.level}
                            </p>
                          </div>
                          <Badge className="text-[9px] scale-90" variant="secondary">
                            Con
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-sm text-muted-foreground italic p-6 col-span-2">
                        Chưa có học viên nào liên kết.
                      </p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="contact" className="space-y-4">
                  <div className="rounded-xl border p-4 space-y-3 bg-muted/20">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Thông tin người giám hộ</h4>
                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Tên phụ huynh:</span>
                        <span className="font-semibold text-foreground">{data.payload.name}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Số điện thoại:</span>
                        <span className="font-semibold text-foreground font-mono">{data.payload.phone}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Email hệ thống:</span>
                        <span className="font-semibold text-foreground font-mono">{data.payload.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Chi nhánh quản lý:</span>
                        <span className="font-semibold text-foreground">{data.payload.branch}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}

            {/* STAFF PROFILE TABS */}
            {data.type === 'staff' && (
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4 rounded-xl">
                  <TabsTrigger value="details">Thông tin nhân sự</TabsTrigger>
                  <TabsTrigger value="contract">Hợp đồng & Làm việc</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Hồ sơ cá nhân</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Giới tính:</span>
                          <span className="font-semibold text-foreground">{data.payload.gender === 'Male' ? 'Nam' : 'Nữ'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ngày sinh:</span>
                          <span className="font-semibold text-foreground">{data.payload.dob}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Địa chỉ:</span>
                          <span className="font-semibold text-foreground truncate max-w-[150px]" title={data.payload.address}>
                            {data.payload.address || 'Chưa cập nhật'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Thông tin nội bộ</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phòng ban:</span>
                          <span className="font-semibold text-foreground">{data.payload.department}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Vị trí chức danh:</span>
                          <span className="font-semibold text-foreground">{data.payload.position}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Trạng thái:</span>
                          <span className="font-semibold uppercase text-foreground text-[10px]">
                            {data.payload.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="contract" className="space-y-4">
                  <div className="rounded-xl border p-4 space-y-3 bg-muted/20">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Chi tiết hợp đồng</h4>
                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Ngày nhận việc:</span>
                        <span className="font-semibold text-foreground">{data.payload.hireDate}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Loại hợp đồng:</span>
                        <span className="font-semibold text-foreground">{data.payload.contractType}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Liên hệ khẩn cấp:</span>
                        <span className="font-semibold text-foreground font-mono">{data.payload.emergencyContact || 'Chưa đăng ký'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email nội bộ:</span>
                        <span className="font-semibold text-foreground font-mono truncate max-w-[250px]">{data.payload.email}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
