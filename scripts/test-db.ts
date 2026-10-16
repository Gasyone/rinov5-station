import { prisma } from '../src/lib/prisma'

async function test() {
  console.log('--- KIỂM TRA KẾT NỐI VÀ THAO TÁC CƠ SỞ DỮ LIỆU SQLITE ---')

  // 1. Đọc số lượng hiện tại
  const countBefore = await prisma.student.count()
  console.log(`✓ Số lượng học viên hiện tại trong DB: ${countBefore}`)

  // 2. Thêm mới 1 học viên thật vào DB
  const testStudent = await prisma.student.create({
    data: {
      id: `TEST-${Date.now()}`,
      name: 'Nguyễn Văn Test Thật',
      englishName: 'Kevin Test',
      phone: '0988776655',
      email: 'test.student@rino.edu.vn',
      gender: 'Male',
      dob: '2016-05-12',
      branch: 'CS1',
      packageName: 'Tiếng Anh Thiếu Nhi A1',
      packageSessions: 36,
      usedSessions: 0,
      remainingSessions: 36,
      status: 'wait_for_assignment',
      notes: 'Học viên nhập thử nghiệm từ hệ thống',
    },
  })
  console.log(`✓ Thêm mới thành công học viên: ID=${testStudent.id}, Tên=${testStudent.name}`)

  // 3. Đọc lại từ DB để kiểm tra
  const countAfter = await prisma.student.count()
  console.log(`✓ Số lượng học viên sau khi thêm: ${countAfter} (Tăng ${countAfter - countBefore})`)

  // 4. Cập nhật học viên vừa tạo
  const updatedStudent = await prisma.student.update({
    where: { id: testStudent.id },
    data: { notes: 'Đã cập nhật ghi chú qua Database thật!' },
  })
  console.log(`✓ Cập nhật thành công: Notes="${updatedStudent.notes}"`)

  // 5. Dọn dẹp bản ghi test
  await prisma.student.delete({ where: { id: testStudent.id } })
  console.log(`✓ Dọn dẹp bản ghi test thành công!`)
  console.log('--- TOÀN BỘ QUY TRÌNH DB & BE HOẠT ĐỘNG HOÀN HẢO ---')
}

test()
  .catch((e) => {
    console.error('Lỗi kiểm tra DB:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
