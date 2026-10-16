import { PrismaClient } from '@prisma/client'
import { mockStudents } from '../src/mocks/students'
import { mockBranches } from '../src/mocks/branches'
import { mockClassRecords } from '../src/mocks/classRecords'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Bắt đầu nạp dữ liệu Seed vào Supabase PostgreSQL ---')

  // 1. Seed Students
  console.log('Seeding Students...')
  await prisma.student.deleteMany({})
  let studentCount = 0
  for (const s of mockStudents) {
    const raw = s as unknown as Record<string, unknown>
    await prisma.student.create({
      data: {
        id: s.id,
        name: s.name,
        englishName: s.englishName || null,
        email: s.email || null,
        phone: s.phone || null,
        avatar: s.avatar || null,
        gender: s.gender || 'Female',
        dob: s.dob || null,
        status: s.status || 'wait_for_assignment',
        branch: s.branch || 'CS1',
        schoolName: (raw.schoolName as string) || null,
        parentName: (raw.parentName as string) || null,
        parentPhone: (raw.parentPhone as string) || null,
        packageName: s.packageName || null,
        packageSessions: (raw.packageSessions as number) ?? 0,
        usedSessions: (raw.usedSessions as number) ?? 0,
        remainingSessions: (raw.remainingSessions as number) ?? 0,
        notes: (raw.notes as string) || null,
        placementAttempt: s.placementAttempt ?? 1,
        enrolledClassesJson: s.enrolledClasses ? JSON.stringify(s.enrolledClasses) : null,
      },
    })
    studentCount++
  }
  console.log(`Đã nạp ${studentCount} học viên.`)

  // 2. Seed Branches
  console.log('Seeding Branches...')
  await prisma.branch.deleteMany({})
  let branchCount = 0
  for (const b of mockBranches) {
    await prisma.branch.create({
      data: {
        id: b.id,
        code: b.code,
        name: b.name,
        type: b.type,
        typeLabel: b.typeLabel,
        region: b.region,
        province: b.province,
        district: b.district,
        address: b.address,
        phone: b.phone,
        email: b.email,
        coordinates: b.coordinates,
        status: b.status,
        statusLabel: b.statusLabel,
        managerId: b.managerId,
        managerName: b.managerName,
        managerPhone: b.managerPhone,
        managerEmail: b.managerEmail,
        managerAvatar: b.managerAvatar || null,
        roomCount: b.roomCount,
        totalCapacity: b.totalCapacity,
        activeClassesCount: b.activeClassesCount,
        activeStudentsCount: b.activeStudentsCount,
        roomsJson: JSON.stringify(b.rooms || []),
        staffJson: JSON.stringify(b.assignedStaff || []),
        businessHoursJson: JSON.stringify(b.businessHours || {}),
        historyJson: JSON.stringify(b.history || []),
      },
    })
    branchCount++
  }
  console.log(`Đã nạp ${branchCount} cơ sở.`)

  // 3. Seed ClassRecords
  console.log('Seeding ClassRecords...')
  await prisma.classRecord.deleteMany({})
  let classCount = 0
  for (const c of mockClassRecords) {
    await prisma.classRecord.create({
      data: {
        id: c.id,
        code: c.code,
        name: c.name,
        level: c.level,
        subLevel: c.subLevel || null,
        subject: (c as unknown as { subject?: string }).subject || 'Tiếng Anh',
        grade: c.grade || null,
        branch: c.branch,
        room: c.room,
        teacher: c.teacher,
        teacherPhone: c.teacherPhone || null,
        assistant: c.assistant || null,
        assistantPhone: c.assistantPhone || null,
        schedule: c.schedule,
        startDate: c.startDate,
        endDate: c.endDate,
        status: c.status,
        maxStudents: c.maxStudents,
        enrolledStudents: c.enrolledStudents,
        tuitionFee: c.tuitionFee || 0,
        trialStudents: c.trialStudents || 0,
        specialCareCount: c.specialCareCount || 0,
        attendanceRate: c.attendanceRate ?? 100,
        homeworkRate: c.homeworkRate ?? 100,
        avgTestScore: c.avgTestScore ?? 0,
        classType: c.classType || 'Chính thức',
        classRatio: c.classRatio || null,
        teacherType: c.teacherType || null,
        learningPath: c.learningPath || null,
        syllabus: c.syllabus || null,
        notes: c.notes || null,
        scheduleSlotsJson: JSON.stringify(c.scheduleSlots || []),
        substituteTeachersJson: JSON.stringify(c.substituteTeachers || []),
        teacherHistoryJson: JSON.stringify(c.teacherHistory || []),
        nextSessionJson: c.nextSession ? JSON.stringify(c.nextSession) : null,
        lastSessionJson: c.lastSession ? JSON.stringify(c.lastSession) : null,
      },
    })
    classCount++
  }
  console.log(`Đã nạp ${classCount} lớp học.`)

  console.log('--- Hoàn tất nạp toàn bộ Seed vào Supabase PostgreSQL ---')
}

main()
  .catch((e) => {
    console.error('Lỗi khi nạp dữ liệu:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
