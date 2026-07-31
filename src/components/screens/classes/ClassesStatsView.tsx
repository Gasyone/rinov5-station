'use client'

import { useState } from 'react'
import { BookOpen, GraduationCap, Percent, School, Users } from 'lucide-react'
import { MetricTile } from '@/components/shared'
import { SegmentedControl } from '@/components/controls'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ClassRecord } from '@/mocks/classRecords'
import { getClassLevelLabel, getSubjectByLevel } from './classesHelpers'
import { ClassesStatsTrendChart } from './ClassesStatsTrendChart'

interface ClassesStatsViewProps {
  classes: ClassRecord[]
}

const subjectLabelMap: Record<string, string> = {
  english: 'Tiếng Anh',
  math: 'Toán học',
  japanese: 'Tiếng Nhật',
  stem: 'STEM Robotics',
  other: 'Khác',
}

export function ClassesStatsView({ classes }: ClassesStatsViewProps) {
  const [periodType, setPeriodType] = useState<'week' | 'month' | 'quarter' | 'custom'>('month')
  const [startDate, setStartDate] = useState('2026-05-01')
  const [endDate, setEndDate] = useState('2026-06-30')

  // Filter classes dynamically based on custom date range if 'custom' is active
  const filteredClassesByPeriod = classes.filter((c) => {
    if (periodType !== 'custom') return true
    if (!c.startDate) return false
    return c.startDate >= startDate && c.startDate <= endDate
  })

  // 1. Calculate overall metrics
  const totalClasses = filteredClassesByPeriod.length
  const totalStudents = filteredClassesByPeriod.reduce((sum, c) => sum + (c.enrolledStudents || 0), 0)
  const avgStudents = totalClasses > 0 ? Number((totalStudents / totalClasses).toFixed(1)) : 0

  // 2. Group by level
  const levelGroups: Record<string, { classCount: number; totalStudents: number }> = {}
  filteredClassesByPeriod.forEach((c) => {
    const lvl = c.level || 'Chưa xác định'
    if (!levelGroups[lvl]) {
      levelGroups[lvl] = { classCount: 0, totalStudents: 0 }
    }
    levelGroups[lvl].classCount += 1
    levelGroups[lvl].totalStudents += c.enrolledStudents || 0
  })

  const levelStats = Object.entries(levelGroups)
    .map(([level, data]) => ({
      level,
      label: getClassLevelLabel(level),
      classCount: data.classCount,
      totalStudents: data.totalStudents,
      avgStudents: data.classCount > 0 ? Number((data.totalStudents / data.classCount).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.totalStudents - a.totalStudents)

  // 3. Group by subject
  const subjectGroups: Record<string, { classCount: number; totalStudents: number }> = {}
  filteredClassesByPeriod.forEach((c) => {
    const sub = getSubjectByLevel(c.level) || 'other'
    if (!subjectGroups[sub]) {
      subjectGroups[sub] = { classCount: 0, totalStudents: 0 }
    }
    subjectGroups[sub].classCount += 1
    subjectGroups[sub].totalStudents += c.enrolledStudents || 0
  })

  const subjectStats = Object.entries(subjectGroups)
    .map(([subject, data]) => ({
      subject,
      label: subjectLabelMap[subject] || subject,
      classCount: data.classCount,
      totalStudents: data.totalStudents,
      avgStudents: data.classCount > 0 ? Number((data.totalStudents / data.classCount).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.totalStudents - a.totalStudents)

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto px-4 py-3 lg:px-6">
      {/* Time Period Filter Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4 shrink-0">
        <div>
          <h3 className="text-base font-semibold text-foreground">Chu kỳ đo lường thống kê</h3>
          <p className="text-xs text-muted-foreground">Chọn chu kỳ hoặc tùy chỉnh khoảng thời gian để đo lường sĩ số</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SegmentedControl
            value={periodType}
            options={[
              { value: 'week', label: 'Tuần' },
              { value: 'month', label: 'Tháng' },
              { value: 'quarter', label: 'Quý' },
              { value: 'custom', label: 'Tùy chọn' },
            ]}
            onValueChange={(val) => setPeriodType(val as 'week' | 'month' | 'quarter' | 'custom')}
          />
          {periodType === 'custom' && (
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-8 text-xs w-36 bg-background"
              />
              <span className="text-xs text-muted-foreground">—</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-8 text-xs w-36 bg-background"
              />
            </div>
          )}
        </div>
      </div>

      {/* Overview KPI Tiles */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 shrink-0">
        <MetricTile
          label="Tổng số lớp học"
          value={totalClasses}
          icon={School}
        />
        <MetricTile
          label="Tổng số học sinh"
          value={totalStudents}
          icon={Users}
        />
        <MetricTile
          label="Sĩ số trung bình / lớp"
          value={`${avgStudents} hs`}
          icon={Percent}
        />
      </div>

      {/* Trend Chart Component */}
      <div className="shrink-0">
        <ClassesStatsTrendChart
          periodType={periodType}
          currentClassesCount={totalClasses}
          currentStudentsCount={totalStudents}
          currentAvgStudents={avgStudents}
        />
      </div>

      {/* Detailed breakdown table cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 pb-6">
        {/* Level Stats Card */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Thống kê theo trình độ
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-x-auto min-h-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Trình độ</TableHead>
                  <TableHead className="text-right font-semibold">Số lớp</TableHead>
                  <TableHead className="text-right font-semibold">Tổng học sinh</TableHead>
                  <TableHead className="text-right font-semibold">Sĩ số TB / lớp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {levelStats.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                      Không có dữ liệu trình độ
                    </TableCell>
                  </TableRow>
                ) : (
                  levelStats.map((stat) => (
                    <TableRow key={stat.level} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">{stat.label}</TableCell>
                      <TableCell className="text-right">{stat.classCount}</TableCell>
                      <TableCell className="text-right">{stat.totalStudents}</TableCell>
                      <TableCell className="text-right font-semibold text-primary">
                        {stat.avgStudents}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Subject Stats Card */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Thống kê theo môn học
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-x-auto min-h-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Môn học</TableHead>
                  <TableHead className="text-right font-semibold">Số lớp</TableHead>
                  <TableHead className="text-right font-semibold">Tổng học sinh</TableHead>
                  <TableHead className="text-right font-semibold">Sĩ số TB / lớp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjectStats.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                      Không có dữ liệu môn học
                    </TableCell>
                  </TableRow>
                ) : (
                  subjectStats.map((stat) => (
                    <TableRow key={stat.subject} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">{stat.label}</TableCell>
                      <TableCell className="text-right">{stat.classCount}</TableCell>
                      <TableCell className="text-right">{stat.totalStudents}</TableCell>
                      <TableCell className="text-right font-semibold text-primary">
                        {stat.avgStudents}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
