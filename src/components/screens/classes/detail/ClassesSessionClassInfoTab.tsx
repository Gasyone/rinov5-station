'use client'

import React from 'react'
import { InfoField } from '@/components/shared'
import { cn } from '@/lib/utils'
import type { ClassRecord } from '@/mocks/classRecords'
import type { RoadmapSession } from './classesDetailTypes'
import { cleanTeacherName } from './classesDetailHelpers'

interface ClassesSessionClassInfoTabProps {
  cls: ClassRecord
  session: RoadmapSession
  sessions: RoadmapSession[]
}

export function ClassesSessionClassInfoTab({
  cls,
  session,
  sessions,
}: ClassesSessionClassInfoTabProps) {
  const completedCount = sessions.filter((s) => s.status === 'completed').length
  const activeTeacher = cleanTeacherName(session.substituteTeacherName || session.teacherName)
  const originalTeacher = cleanTeacherName(session.teacherName)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Section 1: Thông tin lớp */}
      <div className="space-y-3">
        <h4 className="font-bold text-xs text-primary uppercase font-mono tracking-wider">Thông tin lớp</h4>
        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 py-2">
          <InfoField label="Tên lớp" value={cls.name} />
          <InfoField label="Mã lớp" value={cls.code} />
          <InfoField label="Cơ sở" value={cls.branch} />
          <InfoField label="Môn học" value={cls.level} />
          <InfoField label="Trình độ" value={cls.subLevel || '—'} />
          <InfoField label="Trình độ phụ" value={cls.subLevel || '—'} />
          {(cls.grade || cls.level?.toLowerCase().includes('math') || cls.level?.toLowerCase().includes('toán')) && (
            <InfoField label="Lớp" value={cls.grade || '—'} />
          )}
          <InfoField label="Loại hình lớp" value={cls.classType || '—'} />
          <InfoField label="Chương trình" value={cls.syllabus || '—'} />
          <InfoField label="Lộ trình" value={cls.learningPath || '—'} />
          <InfoField label="Khung chương trình" value={cls.syllabus || '—'} />
        </div>
      </div>

      {/* Section 2: Giảng dạy */}
      <div className="space-y-3">
        <h4 className="font-bold text-xs text-primary uppercase font-mono tracking-wider">Giảng dạy</h4>
        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 py-2">
          {/* Giáo viên chủ nhiệm with avatar */}
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Phụ trách</div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex h-7 w-7 items-center justify-center rounded-full border bg-primary/10 text-primary text-[10px] font-bold shrink-0">
                {cls.teacher.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">{cls.teacher}</div>
                {cls.teacherPhone && <div className="text-xs text-muted-foreground truncate">SĐT: {cls.teacherPhone}</div>}
              </div>
            </div>
          </div>
          {/* Giáo viên giảng dạy with avatar */}
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Giáo viên giảng dạy</div>
            <div className="flex items-center gap-2 mt-1">
              <div className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full border text-[10px] font-bold shrink-0",
                session.substituteTeacherName
                  ? "border-amber-200 bg-amber-100 text-amber-700"
                  : "bg-primary/10 text-primary"
              )}>
                {activeTeacher.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">
                  {activeTeacher}
                </div>
                {session.substituteTeacherName && (
                  <div className="text-[10px] text-amber-600 font-medium">Dạy thay (GV chính: {originalTeacher})</div>
                )}
              </div>
            </div>
          </div>

          {/* Lịch học cố định — liệt kê từng dòng */}
          <div className="sm:col-span-2 min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-1.5">Lịch học cố định</div>
            {cls.scheduleSlots && cls.scheduleSlots.length > 0 ? (
              <div className="space-y-1">
                {cls.scheduleSlots.map((slot, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <span className="inline-flex items-center rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary shrink-0 min-w-[52px] justify-center">
                      {slot.dayOfWeek}
                    </span>
                    <span className="font-mono font-semibold text-foreground">
                      {slot.startTime}–{slot.endTime}
                    </span>
                    {slot.room && slot.room !== '—' && (
                      <span className="text-muted-foreground">• {slot.room}</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm font-semibold">{cls.schedule || '—'}</div>
            )}
          </div>

          <InfoField label="Phòng học cố định" value={cls.room} />
          <InfoField label="Sĩ số học viên" value={`${cls.enrolledStudents} / ${cls.maxStudents} (${Math.round((cls.enrolledStudents / cls.maxStudents) * 100)}%)`} />
          <InfoField label="Ngày khai giảng" value={cls.startDate && cls.startDate !== '---' ? new Date(cls.startDate).toLocaleDateString('vi-VN') : '—'} />
          <InfoField label="Ngày bế giảng dự kiến" value={cls.endDate && cls.endDate !== '---' ? new Date(cls.endDate).toLocaleDateString('vi-VN') : '—'} />
        </div>
      </div>
    </div>
  )
}
