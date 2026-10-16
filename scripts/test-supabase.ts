import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Đang kết nối tới Supabase...')
    await prisma.$connect()
    console.log('>>> KẾT NỐI SUPABASE THÀNH CÔNG RỰC RỠ! <<<')
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('>>> LỖI KẾT NỐI:', msg)
  } finally {
    await prisma.$disconnect()
  }
}

main()
