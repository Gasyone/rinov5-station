'use client'

import { MapPin, Users, BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { StatusBadge } from '@/components/shared'
import type { ClassRecord } from '@/mocks/classRecords'
import { CLASS_STATUS_LABELS } from '@/mocks/classRecords'
import { PersonnelHoverCard } from '@/components/shared/PersonnelHoverCard'
import { SyllabusProfileHoverCard } from '../classes/SyllabusProfileHoverCard'
import { getClassAcademicStats, getClassTeachers } from './myClassesHelpers'
import { StudentCareHoverCard } from './StudentCareHoverCard'

interface MyClassCardProps {
  cls: ClassRecord
  onOpenDetail: (cls: ClassRecord, tab?: string) => void
}

export function MyClassCard({ cls, onOpenDetail }: MyClassCardProps) {
  const capacityPct = cls.maxStudents > 0 ? Math.round((cls.enrolledStudents / cls.maxStudents) * 100) : 0
  const academicStats = getClassAcademicStats(cls)
  const teachers = getClassTeachers(cls)

  return (
    <div className="group relative flex flex-col justify-between h-full overflow-hidden rounded-lg border bg-card p-3 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40 text-card-foreground">
      {/* Top Body Wrapper (Flex-1) */}
      <div className="flex-1 flex flex-col gap-1.5 min-h-0">
        {/* Top Header section */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between gap-1.5 flex-wrap">
            <div className="flex items-center gap-1 min-w-0">
              <span className="font-mono text-[10px] font-semibold text-muted-foreground bg-muted/60 px-1.5 py-0.2 rounded border border-border/40 shrink-0">
                {cls.code}
              </span>
              <Badge variant="outline" className="text-[9px] font-bold px-1.5 py-0 h-4 shrink-0">
                {cls.level}
              </Badge>
              {cls.subLevel && (
                <span className="text-[10px] text-muted-foreground font-medium truncate">
                  {cls.subLevel}
                </span>
              )}
            </div>
            <StatusBadge status={cls.status} label={CLASS_STATUS_LABELS[cls.status]} className="shrink-0 text-[10px] px-1.5 py-0.2" />
          </div>

          {/* Class Name (Left) --- Teachers (Right) */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <h3
              onClick={() => onOpenDetail(cls, 'overview')}
              className="text-sm font-bold text-foreground tracking-tight group-hover:text-primary transition-colors cursor-pointer truncate min-w-0"
              title={cls.name}
            >
              {cls.name}
            </h3>

            {/* Teacher(s) on the right */}
            <div className="flex items-center gap-1.5 shrink-0">
              {teachers.length === 1 ? (
                /* 1 Teacher: Avatar + Name with PersonnelHoverCard */
                <PersonnelHoverCard person={teachers[0]} align="end">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-foreground/90 hover:text-primary transition-colors cursor-pointer max-w-[140px] truncate">
                    <Avatar className="h-5 w-5 border border-border/60 shrink-0">
                      <AvatarImage src={teachers[0].avatar || undefined} alt={teachers[0].name} />
                      <AvatarFallback className="text-[8px] font-bold">
                        {teachers[0].name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate" title={teachers[0].name}>
                      {teachers[0].name}
                    </span>
                  </div>
                </PersonnelHoverCard>
              ) : (
                /* 2+ Teachers: ONLY Avatars with PersonnelHoverCard */
                <div className="flex items-center gap-1">
                  {teachers.map((t) => (
                    <PersonnelHoverCard key={t.id || t.name} person={t} align="end">
                      <div className="cursor-pointer transition-transform hover:scale-110">
                        <Avatar className="h-5.5 w-5.5 border border-border/60 shadow-2xs">
                          <AvatarImage src={t.avatar || undefined} alt={t.name} />
                          <AvatarFallback className="text-[8px] font-bold">
                            {t.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </PersonnelHoverCard>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Body Details */}
        <div className="space-y-1.5 text-[11px]">
          {/* Sĩ số & Capacity Progress Bar */}
          <div className="space-y-1 pt-0.5 border-t border-border/40">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground flex items-center gap-1">
                <Users className="h-3 w-3 text-muted-foreground" />
                Sĩ số lớp:
              </span>
              <span className="font-semibold text-foreground">
                {cls.enrolledStudents}/{cls.maxStudents} Học viên{' '}
                <span className={`text-[10px] ${capacityPct >= 90 ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                  ({capacityPct}%)
                </span>
              </span>
            </div>
            <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  capacityPct >= 90 ? 'bg-destructive' : capacityPct >= 70 ? 'bg-amber-500' : 'bg-primary'
                }`}
                style={{ width: `${Math.min(capacityPct, 100)}%` }}
              />
            </div>
          </div>

          {/* 📊 Thống kê Học thuật (3 chỉ số) */}
          <div className="rounded-md border border-border/50 bg-muted/20 p-1.5">
            <div className="grid grid-cols-3 gap-1 text-center divide-x divide-border/40">
              <div className="px-1 space-y-0.2">
                <span className="text-[9px] text-muted-foreground block font-medium">Chuyên cần</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                  {academicStats.attendanceRate}%
                </span>
              </div>
              <div className="px-1 space-y-0.2">
                <span className="text-[9px] text-muted-foreground block font-medium">BTVN</span>
                <span className="font-bold text-sky-600 dark:text-sky-400 text-xs">
                  {academicStats.homeworkRate}%
                </span>
              </div>
              <div className="px-1 space-y-0.2">
                <span className="text-[9px] text-muted-foreground block font-medium">Điểm TB</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 text-xs">
                  {academicStats.avgTestScore}/10
                </span>
              </div>
            </div>
          </div>

          {/* Location & Syllabus */}
          <div className="flex items-center justify-between gap-1.5 text-muted-foreground pt-0.5">
            <div className="flex items-center gap-1.5 min-w-0 truncate">
              <MapPin className="h-3 w-3 shrink-0 text-primary/70" />
              <span className="truncate">
                <strong className="text-foreground font-semibold">{cls.room || 'Chưa gán phòng'}</strong>
                <span className="mx-1">•</span>
                {cls.branch}
              </span>
            </div>

            {/* Khung chương trình */}
            <SyllabusProfileHoverCard cls={cls}>
              <div className="inline-flex items-center gap-1 text-[10.5px] text-muted-foreground hover:text-primary transition-colors cursor-pointer shrink-0 max-w-[130px]">
                <BookOpen className="h-3 w-3 text-primary shrink-0" />
                <span className="truncate font-medium" title={cls.syllabus}>
                  {cls.syllabus && cls.syllabus !== '—' ? cls.syllabus : 'Chưa gán CT'}
                </span>
              </div>
            </SyllabusProfileHoverCard>
          </div>
        </div>
      </div>

      {/* Footer Area: ALWAYS PINNED AT BOTTOM (mt-auto shrink-0) */}
      <div className="pt-1.5 border-t border-border/40 shrink-0 mt-auto">
        {/* 👥 Chăm sóc (Normal Larger Avatars, HoverCard for Care Badges) */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground shrink-0">
            Chăm sóc
          </span>
          <div className="flex items-center gap-1 overflow-hidden">
            {academicStats.specialStudents.map((st) => (
              <StudentCareHoverCard key={st.id} student={st}>
                <div className="relative cursor-pointer transition-transform hover:scale-105 shrink-0">
                  <Avatar className="h-7 w-7 border border-border/60 shadow-2xs">
                    <AvatarImage src={st.avatar} alt={st.name} />
                    <AvatarFallback className="text-[9px] font-bold">
                      {st.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {st.type === 'at_risk' && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-destructive text-[8px] text-white font-bold ring-2 ring-background">
                      !
                    </span>
                  )}
                </div>
              </StudentCareHoverCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
