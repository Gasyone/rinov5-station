import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const cls = await prisma.classRecord.findFirst({
      where: {
        OR: [{ id }, { code: id }],
      },
    })

    if (!cls) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy lớp học' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...cls,
        scheduleSlots: cls.scheduleSlotsJson ? JSON.parse(cls.scheduleSlotsJson) : [],
        substituteTeachers: cls.substituteTeachersJson ? JSON.parse(cls.substituteTeachersJson) : [],
        teacherHistory: cls.teacherHistoryJson ? JSON.parse(cls.teacherHistoryJson) : [],
        nextSession: cls.nextSessionJson ? JSON.parse(cls.nextSessionJson) : undefined,
        lastSession: cls.lastSessionJson ? JSON.parse(cls.lastSessionJson) : undefined,
      },
    })
  } catch (error) {
    console.error('Error fetching class:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi khi tải thông tin lớp học' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const updateData: Record<string, unknown> = {}

    if (body.name !== undefined) updateData.name = body.name
    if (body.level !== undefined) updateData.level = body.level
    if (body.subLevel !== undefined) updateData.subLevel = body.subLevel
    if (body.grade !== undefined) updateData.grade = body.grade
    if (body.branch !== undefined) updateData.branch = body.branch
    if (body.room !== undefined) updateData.room = body.room
    if (body.teacher !== undefined) updateData.teacher = body.teacher
    if (body.teacherPhone !== undefined) updateData.teacherPhone = body.teacherPhone
    if (body.assistant !== undefined) updateData.assistant = body.assistant
    if (body.assistantPhone !== undefined) updateData.assistantPhone = body.assistantPhone
    if (body.schedule !== undefined) updateData.schedule = body.schedule
    if (body.startDate !== undefined) updateData.startDate = body.startDate
    if (body.endDate !== undefined) updateData.endDate = body.endDate
    if (body.status !== undefined) updateData.status = body.status
    if (body.maxStudents !== undefined) updateData.maxStudents = body.maxStudents
    if (body.enrolledStudents !== undefined) updateData.enrolledStudents = body.enrolledStudents
    if (body.tuitionFee !== undefined) updateData.tuitionFee = body.tuitionFee
    if (body.totalSessions !== undefined) updateData.totalSessions = body.totalSessions
    if (body.completedSessions !== undefined) updateData.completedSessions = body.completedSessions
    if (body.notes !== undefined) updateData.notes = body.notes
    if (body.learningPath !== undefined) updateData.learningPath = body.learningPath
    if (body.syllabus !== undefined) updateData.syllabus = body.syllabus
    if (body.classType !== undefined) updateData.classType = body.classType
    if (body.scheduleSlots !== undefined) updateData.scheduleSlotsJson = JSON.stringify(body.scheduleSlots)
    if (body.substituteTeachers !== undefined) updateData.substituteTeachersJson = JSON.stringify(body.substituteTeachers)
    if (body.teacherHistory !== undefined) updateData.teacherHistoryJson = JSON.stringify(body.teacherHistory)
    if (body.nextSession !== undefined) updateData.nextSessionJson = JSON.stringify(body.nextSession)
    if (body.lastSession !== undefined) updateData.lastSessionJson = JSON.stringify(body.lastSession)

    const updated = await prisma.classRecord.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      message: 'Cập nhật lớp học thành công',
      data: {
        ...updated,
        scheduleSlots: updated.scheduleSlotsJson ? JSON.parse(updated.scheduleSlotsJson) : [],
        substituteTeachers: updated.substituteTeachersJson ? JSON.parse(updated.substituteTeachersJson) : [],
        teacherHistory: updated.teacherHistoryJson ? JSON.parse(updated.teacherHistoryJson) : [],
        nextSession: updated.nextSessionJson ? JSON.parse(updated.nextSessionJson) : undefined,
        lastSession: updated.lastSessionJson ? JSON.parse(updated.lastSessionJson) : undefined,
      },
    })
  } catch (error) {
    console.error('Error updating class:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi khi cập nhật lớp học' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.classRecord.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Đã xóa lớp học thành công',
    })
  } catch (error) {
    console.error('Error deleting class:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi khi xóa lớp học' },
      { status: 500 }
    )
  }
}
