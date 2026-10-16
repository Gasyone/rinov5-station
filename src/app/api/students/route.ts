import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/students: Lấy danh sách học viên từ Database SQLite
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')?.toLowerCase() || ''
    const branch = searchParams.get('branch') || 'all'
    const status = searchParams.get('status') || 'all'

    // Lấy toàn bộ học viên từ SQLite
    const studentsFromDb = await prisma.student.findMany({
      orderBy: { createdAt: 'desc' },
    })

    // Parse JSON enrolledClasses và map về đúng kiểu Student
    let students = studentsFromDb.map((s) => ({
      id: s.id,
      name: s.name,
      englishName: s.englishName || undefined,
      email: s.email || '',
      phone: s.phone || '',
      avatar: s.avatar || undefined,
      gender: (s.gender as 'Male' | 'Female' | 'Other') || 'Female',
      dob: s.dob || '2015-01-01',
      status: s.status,
      branch: s.branch || 'CS1',
      schoolName: s.schoolName || undefined,
      parentName: s.parentName || undefined,
      parentPhone: s.parentPhone || undefined,
      packageName: s.packageName || undefined,
      packageSessions: s.packageSessions,
      usedSessions: s.usedSessions,
      remainingSessions: s.remainingSessions,
      notes: s.notes || undefined,
      placementAttempt: s.placementAttempt,
      enrolledClasses: s.enrolledClassesJson ? JSON.parse(s.enrolledClassesJson) : [],
    }))

    // Lọc theo điều kiện tìm kiếm và bộ lọc nếu có
    if (branch !== 'all') {
      students = students.filter((s) => s.branch === branch)
    }
    if (status !== 'all') {
      students = students.filter((s) => s.status === status)
    }
    if (search.trim()) {
      students = students.filter(
        (s) =>
          s.name.toLowerCase().includes(search) ||
          (s.englishName && s.englishName.toLowerCase().includes(search)) ||
          s.phone.includes(search) ||
          s.id.toLowerCase().includes(search)
      )
    }

    return NextResponse.json({
      success: true,
      total: students.length,
      data: students,
    })
  } catch (error) {
    console.error('Error fetching students from DB:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi khi tải danh sách học viên từ database' },
      { status: 500 }
    )
  }
}

// POST /api/students: Tạo mới học viên lưu thẳng vào Database SQLite
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      englishName,
      phone,
      email,
      gender,
      dob,
      branch,
      schoolName,
      packageName,
      packageSessions,
      notes,
    } = body

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { success: false, message: 'Tên học viên là bắt buộc' },
        { status: 400 }
      )
    }

    // Tự sinh ID dạng STU-xxx ngẫu nhiên hoặc timestamp
    const customId = `STU-${Date.now().toString().slice(-4)}`

    const newStudent = await prisma.student.create({
      data: {
        id: customId,
        name: name.trim(),
        englishName: englishName?.trim() || null,
        phone: phone?.trim() || null,
        email: email?.trim() || null,
        gender: gender || 'Female',
        dob: dob || '2015-01-01',
        branch: branch || 'CS1',
        schoolName: schoolName?.trim() || null,
        status: 'wait_for_assignment',
        packageName: packageName || 'Tiếng Anh Giao Tiếp',
        packageSessions: Number(packageSessions) || 24,
        usedSessions: 0,
        remainingSessions: Number(packageSessions) || 24,
        notes: notes?.trim() || null,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name.trim())}`,
        enrolledClassesJson: '[]',
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Thêm mới học viên vào cơ sở dữ liệu thành công',
        data: {
          ...newStudent,
          enrolledClasses: [],
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating student in DB:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi khi lưu học viên vào database' },
      { status: 500 }
    )
  }
}
