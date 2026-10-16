import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Branch, BranchRoom, BranchStaffMember, BranchHistoryItem } from '@/mocks/branches'

// GET /api/branches: Lấy danh sách cơ sở từ Supabase PostgreSQL
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')?.toLowerCase() || ''
    const status = searchParams.get('status') || 'all'
    const region = searchParams.get('region') || 'all'
    const type = searchParams.get('type') || 'all'

    const branchesFromDb = await prisma.branch.findMany({
      orderBy: { createdAt: 'desc' },
    })

    let branches: Branch[] = branchesFromDb.map((b) => {
      let rooms: BranchRoom[] = []
      let assignedStaff: BranchStaffMember[] = []
      let businessHours = {
        openTime: '08:00',
        closeTime: '21:30',
        daysOfWeek: 'Thứ 2 - Chủ Nhật',
      }
      let history: BranchHistoryItem[] = []

      try {
        if (b.roomsJson) rooms = JSON.parse(b.roomsJson)
      } catch {}
      try {
        if (b.staffJson) assignedStaff = JSON.parse(b.staffJson)
      } catch {}
      try {
        if (b.businessHoursJson) businessHours = JSON.parse(b.businessHoursJson)
      } catch {}
      try {
        if (b.historyJson) history = JSON.parse(b.historyJson)
      } catch {}

      return {
        id: b.id,
        code: b.code,
        name: b.name,
        type: b.type as Branch['type'],
        typeLabel: b.typeLabel || (b.type === 'headquarters' ? 'Trụ sở chính' : 'Trung tâm Đào tạo'),
        region: b.region || 'Miền Bắc - Hà Nội',
        province: b.province || 'Hà Nội',
        district: b.district || '',
        address: b.address || '',
        phone: b.phone || '',
        email: b.email || '',
        coordinates: b.coordinates || '',
        status: b.status as Branch['status'],
        statusLabel: b.statusLabel || (b.status === 'active' ? 'Đang hoạt động' : b.status === 'setup' ? 'Mới thiết lập' : 'Tạm dừng'),
        managerId: b.managerId || '',
        managerName: b.managerName || 'Chưa phân công',
        managerPhone: b.managerPhone || '',
        managerEmail: b.managerEmail || '',
        managerAvatar: b.managerAvatar || undefined,
        roomCount: b.roomCount,
        totalCapacity: b.totalCapacity,
        activeClassesCount: b.activeClassesCount,
        activeStudentsCount: b.activeStudentsCount,
        businessHours,
        rooms,
        assignedStaff,
        history,
        createdAt: b.createdAt.toISOString().slice(0, 10),
        updatedAt: b.updatedAt.toISOString().slice(0, 10),
      }
    })

    if (status !== 'all') {
      branches = branches.filter((b) => b.status === status)
    }
    if (region !== 'all') {
      branches = branches.filter((b) => b.region === region)
    }
    if (type !== 'all') {
      branches = branches.filter((b) => b.type === type)
    }
    if (search.trim()) {
      branches = branches.filter(
        (b) =>
          b.name.toLowerCase().includes(search) ||
          b.code.toLowerCase().includes(search) ||
          b.address.toLowerCase().includes(search) ||
          b.phone.includes(search)
      )
    }

    return NextResponse.json({
      success: true,
      total: branches.length,
      data: branches,
    })
  } catch (error) {
    console.error('Error fetching branches from DB:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi khi tải danh sách cơ sở từ cơ sở dữ liệu' },
      { status: 500 }
    )
  }
}

// POST /api/branches: Khởi tạo cơ sở mới vào Supabase
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      code,
      type,
      typeLabel,
      region,
      province,
      district,
      address,
      phone,
      email,
      managerName,
      managerPhone,
      managerEmail,
      roomCount,
      totalCapacity,
      rooms,
      businessHours,
    } = body

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { success: false, message: 'Tên cơ sở là bắt buộc' },
        { status: 400 }
      )
    }

    const branchCode = (code?.trim() || `BR_${Date.now().toString().slice(-4)}`).toUpperCase()
    const branchId = `br-${Date.now()}`

    const initialHistory: BranchHistoryItem[] = [
      {
        id: `h-${Date.now()}`,
        timestamp: new Date().toLocaleString('vi-VN'),
        actor: 'Admin Hệ thống',
        action: 'Khởi tạo cơ sở',
        details: 'Tạo mới chi nhánh cơ sở vật chất từ hệ thống Station',
      },
    ]

    const newBranchDb = await prisma.branch.create({
      data: {
        id: branchId,
        code: branchCode,
        name: name.trim(),
        type: type || 'training_center',
        typeLabel: typeLabel || 'Trung tâm Đào tạo',
        region: region || 'Miền Bắc - Hà Nội',
        province: province || 'Hà Nội',
        district: district || '',
        address: address?.trim() || '',
        phone: phone?.trim() || '',
        email: email?.trim() || '',
        coordinates: '',
        status: 'setup',
        statusLabel: 'Mới thiết lập',
        managerId: 'emp-new',
        managerName: managerName?.trim() || 'Chưa phân công',
        managerPhone: managerPhone?.trim() || '',
        managerEmail: managerEmail?.trim() || '',
        roomCount: Number(roomCount) || (Array.isArray(rooms) ? rooms.length : 1),
        totalCapacity: Number(totalCapacity) || 20,
        activeClassesCount: 0,
        activeStudentsCount: 0,
        roomsJson: JSON.stringify(rooms || []),
        staffJson: JSON.stringify([]),
        businessHoursJson: JSON.stringify(
          businessHours || {
            openTime: '08:00',
            closeTime: '21:30',
            daysOfWeek: 'Thứ 2 - Chủ Nhật',
          }
        ),
        historyJson: JSON.stringify(initialHistory),
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Khởi tạo cơ sở thành công',
        data: {
          id: newBranchDb.id,
          code: newBranchDb.code,
          name: newBranchDb.name,
          type: newBranchDb.type,
          typeLabel: newBranchDb.typeLabel,
          region: newBranchDb.region,
          province: newBranchDb.province,
          district: newBranchDb.district,
          address: newBranchDb.address,
          phone: newBranchDb.phone,
          email: newBranchDb.email,
          status: newBranchDb.status,
          statusLabel: newBranchDb.statusLabel,
          managerName: newBranchDb.managerName,
          managerPhone: newBranchDb.managerPhone,
          managerEmail: newBranchDb.managerEmail,
          roomCount: newBranchDb.roomCount,
          totalCapacity: newBranchDb.totalCapacity,
          activeClassesCount: 0,
          activeStudentsCount: 0,
          rooms: rooms || [],
          businessHours: businessHours || {
            openTime: '08:00',
            closeTime: '21:30',
            daysOfWeek: 'Thứ 2 - Chủ Nhật',
          },
          history: initialHistory,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating branch in DB:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi khi lưu cơ sở vào cơ sở dữ liệu' },
      { status: 500 }
    )
  }
}
