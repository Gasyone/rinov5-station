import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const isLocalDev = process.env.NODE_ENV === 'development' && !process.env.VERCEL

interface StoredTopic {
  id: string
  title: string
  category: string
  [key: string]: unknown
}

function getDataFilePath() {
  return path.join(process.cwd(), 'src', 'data', 'explainSpecs.json')
}

function readSpecsData(): Record<string, StoredTopic[]> {
  try {
    const filePath = getDataFilePath()
    if (!fs.existsSync(filePath)) {
      return {}
    }
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    console.error('Failed to read explainSpecs.json:', err)
    return {}
  }
}

function writeSpecsData(data: Record<string, StoredTopic[]>) {
  const filePath = getDataFilePath()
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

// GET: Lấy toàn bộ danh sách hoặc theo screenId
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const screenId = searchParams.get('screenId')
  const data = readSpecsData()

  const result = screenId ? data[screenId] || [] : data

  return NextResponse.json({
    success: true,
    canEdit: isLocalDev,
    data: result,
  })
}

// POST: Tạo mới hoặc cập nhật 1 mục thuyết minh (CHỈ LOCAL)
export async function POST(request: Request) {
  if (!isLocalDev) {
    return NextResponse.json(
      { success: false, error: 'Chỉnh sửa tài liệu chỉ khả dụng ở môi trường Local Development.' },
      { status: 403 }
    )
  }

  try {
    const body = (await request.json()) as { screenId?: string; topic?: StoredTopic }
    const { screenId, topic } = body

    if (!screenId || !topic || !topic.id || !topic.title) {
      return NextResponse.json(
        { success: false, error: 'Thiếu thông tin screenId hoặc dữ liệu topic bắt buộc.' },
        { status: 400 }
      )
    }

    const data = readSpecsData()
    if (!data[screenId]) {
      data[screenId] = []
    }

    const existingIndex = data[screenId].findIndex((item) => item.id === topic.id)
    const timestamp = new Date().toISOString()

    if (existingIndex >= 0) {
      data[screenId][existingIndex] = {
        ...data[screenId][existingIndex],
        ...topic,
        updatedAt: timestamp,
      }
    } else {
      data[screenId].push({
        ...topic,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
    }

    writeSpecsData(data)

    return NextResponse.json({
      success: true,
      message: 'Đã lưu thành công vào cơ sở dữ liệu thuyết minh.',
      data: topic,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi xử lý lưu dữ liệu.'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

// DELETE: Xóa 1 mục thuyết minh (CHỈ LOCAL)
export async function DELETE(request: Request) {
  if (!isLocalDev) {
    return NextResponse.json(
      { success: false, error: 'Chỉnh sửa tài liệu chỉ khả dụng ở môi trường Local Development.' },
      { status: 403 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const screenId = searchParams.get('screenId')
    const topicId = searchParams.get('topicId')

    if (!screenId || !topicId) {
      return NextResponse.json(
        { success: false, error: 'Thiếu screenId hoặc topicId cần xóa.' },
        { status: 400 }
      )
    }

    const data = readSpecsData()
    if (data[screenId]) {
      data[screenId] = data[screenId].filter((item) => item.id !== topicId)
      writeSpecsData(data)
    }

    return NextResponse.json({
      success: true,
      message: 'Đã xóa thành công mục thuyết minh.',
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi khi xóa mục dữ liệu.'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
