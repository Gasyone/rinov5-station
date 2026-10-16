import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { ClassRecord, ScheduleSlot, SubstituteTeacher, TeacherHistoryEntry, NextSessionInfo } from '@/mocks/classRecords'

// GET /api/classes: Lấy danh sách lớp học từ Supabase PostgreSQL
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')?.toLowerCase() || ''
    const branch = searchParams.get('branch') || 'all'
    const status = searchParams.get('status') || 'all'

    const classesFromDb = await prisma.classRecord.findMany({
      orderBy: { createdAt: 'desc' },
    })

    let classes: ClassRecord[] = classesFromDb.map((c) => {
      let scheduleSlots: ScheduleSlot[] = []
      let substituteTeachers: SubstituteTeacher[] = []
      let teacherHistory: TeacherHistoryEntry[] = []
      let nextSession: NextSessionInfo | undefined = undefined
      let lastSession: NextSessionInfo | undefined = undefined

      try {
        if (c.scheduleSlotsJson) scheduleSlots = JSON.parse(c.scheduleSlotsJson)
      } catch {}
      try {
        if (c.substituteTeachersJson) substituteTeachers = JSON.parse(c.substituteTeachersJson)
      } catch {}
      try {
        if (c.teacherHistoryJson) teacherHistory = JSON.parse(c.teacherHistoryJson)
      } catch {}
      try {
        if (c.nextSessionJson) nextSession = JSON.parse(c.nextSessionJson)
      } catch {}
      try {
        if (c.lastSessionJson) lastSession = JSON.parse(c.lastSessionJson)
      } catch {}

      return {
        id: c.id,
        code: c.code,
        name: c.name,
        level: c.level,
        subLevel: c.subLevel || undefined,
        branch: c.branch || 'RinoEdu Linh Đàm',
        teacher: c.teacher || 'Chưa gán',
        teacherPhone: c.teacherPhone || '',
        room: c.room || 'A101',
        schedule: c.schedule || 'T2/4/6 18:00–19:30',
        scheduleSlots,
        startDate: c.startDate || '2026-06-01',
        endDate: c.endDate || '2026-09-01',
        maxStudents: c.maxStudents,
        enrolledStudents: c.enrolledStudents,
        status: c.status as ClassRecord['status'],
        tuitionFee: c.tuitionFee,
        notes: c.notes || undefined,
        substituteTeachers,
        nextSession,
        lastSession,
        learningPath: c.learningPath || undefined,
        syllabus: c.syllabus || undefined,
        trialStudents: c.trialStudents,
        classType: (c.classType as 'Chính thức' | 'Workshop') || 'Chính thức',
        classRatio: c.classRatio || undefined,
        teacherType: c.teacherType || undefined,
        assistant: c.assistant || undefined,
        assistantPhone: c.assistantPhone || undefined,
        grade: c.grade || undefined,
        attendanceRate: c.attendanceRate ?? undefined,
        homeworkRate: c.homeworkRate ?? undefined,
        avgTestScore: c.avgTestScore ?? undefined,
        specialCareCount: c.specialCareCount ?? 0,
        newStudents: 0,
        teacherHistory,
      }
    })

    if (branch !== 'all') {
      classes = classes.filter((c) => c.branch === branch)
    }
    if (status !== 'all') {
      classes = classes.filter((c) => c.status === status)
    }
    if (search.trim()) {
      classes = classes.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.code.toLowerCase().includes(search) ||
          c.teacher.toLowerCase().includes(search) ||
          c.room.toLowerCase().includes(search)
      )
    }

    return NextResponse.json({
      success: true,
      total: classes.length,
      data: classes,
    })
  } catch (error) {
    console.error('Error fetching classes from DB:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi khi tải danh sách lớp học từ cơ sở dữ liệu' },
      { status: 500 }
    )
  }
}

// POST /api/classes: Tạo mới lớp học lưu vào Supabase
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      code,
      level,
      subLevel,
      grade,
      branch,
      room,
      teacher,
      teacherPhone,
      assistant,
      assistantPhone,
      schedule,
      startDate,
      endDate,
      maxStudents,
      enrolledStudents,
      tuitionFee,
      status,
      learningPath,
      syllabus,
      classType,
      classRatio,
      teacherType,
      notes,
      scheduleSlots,
    } = body

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { success: false, message: 'Tên lớp học là bắt buộc' },
        { status: 400 }
      )
    }

    const classCode = (code?.trim() || `CLS-${Date.now().toString().slice(-4)}`).toUpperCase()
    const classId = `cls-${Date.now()}`

    const newClassDb = await prisma.classRecord.create({
      data: {
        id: classId,
        code: classCode,
        name: name.trim(),
        level: level || 'Beginner',
        subLevel: subLevel?.trim() || null,
        grade: grade?.trim() || null,
        branch: branch || 'RinoEdu Linh Đàm',
        room: room || 'A101',
        teacher: teacher || 'Chưa gán',
        teacherPhone: teacherPhone || null,
        assistant: assistant || null,
        assistantPhone: assistantPhone || null,
        schedule: schedule || 'T2/4/6 18:00–19:30',
        startDate: startDate || new Date().toISOString().slice(0, 10),
        endDate: endDate || null,
        maxStudents: Number(maxStudents) || 20,
        enrolledStudents: Number(enrolledStudents) || 0,
        tuitionFee: Number(tuitionFee) || 0,
        status: status || 'cho_khai_giang',
        learningPath: learningPath || null,
        syllabus: syllabus || null,
        classType: classType || 'Chính thức',
        classRatio: classRatio || null,
        teacherType: teacherType || null,
        notes: notes?.trim() || null,
        scheduleSlotsJson: JSON.stringify(scheduleSlots || []),
        substituteTeachersJson: '[]',
        teacherHistoryJson: teacher && teacher !== 'Chưa gán' ? JSON.stringify([
          {
            name: teacher,
            role: 'Chủ nhiệm',
            startDate: startDate || new Date().toISOString().slice(0, 10),
            phone: teacherPhone || '',
            isCurrent: true,
          }
        ]) : '[]',
        trialStudents: 0,
        specialCareCount: 0,
        attendanceRate: 100,
        homeworkRate: 100,
        avgTestScore: 0,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Thêm lớp học vào cơ sở dữ liệu thành công',
        data: {
          id: newClassDb.id,
          code: newClassDb.code,
          name: newClassDb.name,
          level: newClassDb.level,
          subLevel: newClassDb.subLevel || undefined,
          grade: newClassDb.grade || undefined,
          branch: newClassDb.branch,
          room: newClassDb.room,
          teacher: newClassDb.teacher,
          teacherPhone: newClassDb.teacherPhone || '',
          assistant: newClassDb.assistant || undefined,
          assistantPhone: newClassDb.assistantPhone || undefined,
          schedule: newClassDb.schedule,
          startDate: newClassDb.startDate,
          endDate: newClassDb.endDate || '',
          maxStudents: newClassDb.maxStudents,
          enrolledStudents: newClassDb.enrolledStudents,
          status: newClassDb.status as ClassRecord['status'],
          tuitionFee: newClassDb.tuitionFee,
          learningPath: newClassDb.learningPath || undefined,
          syllabus: newClassDb.syllabus || undefined,
          classType: (newClassDb.classType as 'Chính thức' | 'Workshop') || 'Chính thức',
          notes: newClassDb.notes || undefined,
          scheduleSlots: scheduleSlots || [],
          substituteTeachers: [],
          teacherHistory: [],
          trialStudents: 0,
          specialCareCount: 0,
          attendanceRate: 100,
          homeworkRate: 100,
          avgTestScore: 0,
          newStudents: 0,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating class in DB:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi khi lưu lớp học vào cơ sở dữ liệu' },
      { status: 500 }
    )
  }
}
