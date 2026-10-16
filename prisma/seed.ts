import { PrismaClient } from '@prisma/client'
import { mockStudents } from '../src/mocks/students'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Bắt đầu nạp dữ liệu Seed từ mock students vào SQLite ---')

  // Xóa dữ liệu cũ nếu có
  await prisma.student.deleteMany({})

  let count = 0
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
    count++
  }

  console.log(`--- Đã nạp thành công ${count} học viên vào Database SQLite ---`)
}

main()
  .catch((e) => {
    console.error('Lỗi khi nạp dữ liệu:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
