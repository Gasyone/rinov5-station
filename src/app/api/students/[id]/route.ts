import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/students/[id]: Lấy thông tin chi tiết 1 học viên
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const student = await prisma.student.findUnique({
      where: { id },
    })

    if (!student) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy học viên' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...student,
        enrolledClasses: student.enrolledClassesJson
          ? JSON.parse(student.enrolledClassesJson)
          : [],
      },
    })
  } catch (error) {
    console.error('Error fetching student details:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi khi lấy thông tin học viên' },
      { status: 500 }
    )
  }
}

// PATCH /api/students/[id]: Cập nhật thông tin học viên trong SQLite
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()

    // Lọc các trường được phép cập nhật
    const updateData: Record<string, unknown> = {}
    if (body.name !== undefined) updateData.name = body.name
    if (body.englishName !== undefined) updateData.englishName = body.englishName
    if (body.avatar !== undefined) updateData.avatar = body.avatar
    if (body.gender !== undefined) updateData.gender = body.gender
    if (body.dob !== undefined) updateData.dob = body.dob
    if (body.phone !== undefined) updateData.phone = body.phone
    if (body.email !== undefined) updateData.email = body.email
    if (body.status !== undefined) updateData.status = body.status
    if (body.notes !== undefined) updateData.notes = body.notes
    if (body.branch !== undefined) updateData.branch = body.branch
    if (body.packageName !== undefined) updateData.packageName = body.packageName
    if (body.enrolledClasses !== undefined) {
      updateData.enrolledClassesJson = JSON.stringify(body.enrolledClasses)
    }

    const updated = await prisma.student.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      message: 'Cập nhật học viên thành công',
      data: {
        ...updated,
        enrolledClasses: updated.enrolledClassesJson
          ? JSON.parse(updated.enrolledClassesJson)
          : [],
      },
    })
  } catch (error) {
    console.error('Error updating student:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi khi cập nhật học viên' },
      { status: 500 }
    )
  }
}

// DELETE /api/students/[id]: Xóa học viên khỏi Database SQLite
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    await prisma.student.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Xóa học viên thành công',
    })
  } catch (error) {
    console.error('Error deleting student:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi khi xóa học viên' },
      { status: 500 }
    )
  }
}
