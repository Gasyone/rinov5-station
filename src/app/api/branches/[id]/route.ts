import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const branch = await prisma.branch.findUnique({
      where: { id },
    })

    if (!branch) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy cơ sở' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...branch,
        rooms: branch.roomsJson ? JSON.parse(branch.roomsJson) : [],
        assignedStaff: branch.staffJson ? JSON.parse(branch.staffJson) : [],
        businessHours: branch.businessHoursJson ? JSON.parse(branch.businessHoursJson) : {},
        history: branch.historyJson ? JSON.parse(branch.historyJson) : [],
      },
    })
  } catch (error) {
    console.error('Error fetching branch:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi khi tải chi tiết cơ sở' },
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
    if (body.code !== undefined) updateData.code = body.code
    if (body.type !== undefined) updateData.type = body.type
    if (body.typeLabel !== undefined) updateData.typeLabel = body.typeLabel
    if (body.status !== undefined) updateData.status = body.status
    if (body.statusLabel !== undefined) updateData.statusLabel = body.statusLabel
    if (body.region !== undefined) updateData.region = body.region
    if (body.province !== undefined) updateData.province = body.province
    if (body.district !== undefined) updateData.district = body.district
    if (body.address !== undefined) updateData.address = body.address
    if (body.phone !== undefined) updateData.phone = body.phone
    if (body.email !== undefined) updateData.email = body.email
    if (body.managerName !== undefined) updateData.managerName = body.managerName
    if (body.managerPhone !== undefined) updateData.managerPhone = body.managerPhone
    if (body.managerEmail !== undefined) updateData.managerEmail = body.managerEmail
    if (body.roomCount !== undefined) updateData.roomCount = body.roomCount
    if (body.totalCapacity !== undefined) updateData.totalCapacity = body.totalCapacity
    if (body.rooms !== undefined) updateData.roomsJson = JSON.stringify(body.rooms)
    if (body.assignedStaff !== undefined) updateData.staffJson = JSON.stringify(body.assignedStaff)
    if (body.businessHours !== undefined) updateData.businessHoursJson = JSON.stringify(body.businessHours)
    if (body.history !== undefined) updateData.historyJson = JSON.stringify(body.history)

    const updated = await prisma.branch.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      message: 'Cập nhật cơ sở thành công',
      data: {
        ...updated,
        rooms: updated.roomsJson ? JSON.parse(updated.roomsJson) : [],
        assignedStaff: updated.staffJson ? JSON.parse(updated.staffJson) : [],
        businessHours: updated.businessHoursJson ? JSON.parse(updated.businessHoursJson) : {},
        history: updated.historyJson ? JSON.parse(updated.historyJson) : [],
      },
    })
  } catch (error) {
    console.error('Error updating branch:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi khi cập nhật cơ sở' },
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
    await prisma.branch.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Đã xóa cơ sở thành công',
    })
  } catch (error) {
    console.error('Error deleting branch:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi khi xóa cơ sở' },
      { status: 500 }
    )
  }
}
