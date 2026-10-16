import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { QcIncident, QcComment, QcLog } from '@/mocks/qcChecks'

function mapDbToQcIncident(db: any): QcIncident {
  let comments: QcComment[] = []
  let logs: QcLog[] = []

  try {
    if (db.commentsJson) comments = JSON.parse(db.commentsJson)
  } catch {}

  try {
    if (db.logsJson) logs = JSON.parse(db.logsJson)
  } catch {}

  return {
    id: db.id,
    code: db.code,
    title: db.title,
    targetGroup: db.targetGroup,
    criteria: db.criteria,
    source: db.source,
    branch: db.branch,
    classId: db.classId || undefined,
    className: db.className || undefined,
    subject: db.subject || undefined,
    sessionNumber: db.sessionNumber ?? undefined,
    sessionDate: db.sessionDate || undefined,
    roomId: db.roomId || undefined,
    teacherId: db.teacherId || undefined,
    teacherName: db.teacherName || undefined,
    csmId: db.csmId || undefined,
    csmName: db.csmName || undefined,
    description: db.description,
    severity: db.severity,
    status: db.status,
    recurrenceCount: db.recurrenceCount ?? 0,
    evidence: db.evidence || '',
    evidenceImage: db.evidenceImage || undefined,
    evidenceLink: db.evidenceLink || undefined,
    assignee: db.assignee,
    issuedBy: db.issuedBy,
    createdAt: db.createdAt ? new Date(db.createdAt).toISOString() : new Date().toISOString(),
    deadline: db.deadline || undefined,
    correctiveAction: db.correctiveAction || undefined,
    correctiveEvidence: db.correctiveEvidence || undefined,
    correctiveImage: db.correctiveImage || undefined,
    correctiveLink: db.correctiveLink || undefined,
    completionDate: db.completionDate || undefined,
    closureMethod: db.closureMethod || undefined,
    closedBy: db.closedBy || undefined,
    closedAt: db.closedAt || undefined,
    notes: db.notes || undefined,
    comments,
    logs,
  }
}

// GET /api/qc-incidents/[id]: Lấy thông tin chi tiết sự cố
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const item = await prisma.qcIncident.findFirst({
      where: {
        OR: [{ id }, { code: id }],
      },
    })

    if (!item) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy sự cố chất lượng' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: mapDbToQcIncident(item),
    })
  } catch (error) {
    console.error('Error fetching QC incident by ID:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi khi tải chi tiết sự cố chất lượng' },
      { status: 500 }
    )
  }
}

// PATCH /api/qc-incidents/[id]: Cập nhật trạng thái, khắc phục, thêm bình luận/nhật ký
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Tìm sự cố hiện tại
    const existing = await prisma.qcIncident.findFirst({
      where: {
        OR: [{ id }, { code: id }],
      },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy sự cố để cập nhật' },
        { status: 404 }
      )
    }

    const updateData: Record<string, unknown> = {}

    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.targetGroup !== undefined) updateData.targetGroup = body.targetGroup
    if (body.criteria !== undefined) updateData.criteria = body.criteria
    if (body.severity !== undefined) updateData.severity = body.severity
    if (body.status !== undefined) updateData.status = body.status
    if (body.assignee !== undefined) updateData.assignee = body.assignee
    if (body.deadline !== undefined) updateData.deadline = body.deadline
    if (body.notes !== undefined) updateData.notes = body.notes

    if (body.correctiveAction !== undefined) updateData.correctiveAction = body.correctiveAction
    if (body.correctiveEvidence !== undefined) updateData.correctiveEvidence = body.correctiveEvidence
    if (body.correctiveImage !== undefined) updateData.correctiveImage = body.correctiveImage
    if (body.correctiveLink !== undefined) updateData.correctiveLink = body.correctiveLink
    if (body.completionDate !== undefined) updateData.completionDate = body.completionDate

    if (body.closureMethod !== undefined) updateData.closureMethod = body.closureMethod
    if (body.closedBy !== undefined) updateData.closedBy = body.closedBy
    if (body.closedAt !== undefined) updateData.closedAt = body.closedAt

    // Xử lý comments
    if (body.comments !== undefined) {
      updateData.commentsJson = JSON.stringify(body.comments)
    } else if (body.newComment) {
      let currentComments: QcComment[] = []
      try {
        if (existing.commentsJson) currentComments = JSON.parse(existing.commentsJson)
      } catch {}
      currentComments.push(body.newComment)
      updateData.commentsJson = JSON.stringify(currentComments)
    }

    // Xử lý logs
    if (body.logs !== undefined) {
      updateData.logsJson = JSON.stringify(body.logs)
    } else if (body.newLog) {
      let currentLogs: QcLog[] = []
      try {
        if (existing.logsJson) currentLogs = JSON.parse(existing.logsJson)
      } catch {}
      currentLogs.push(body.newLog)
      updateData.logsJson = JSON.stringify(currentLogs)
    }

    const updated = await prisma.qcIncident.update({
      where: { id: existing.id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      message: 'Cập nhật sự cố thành công',
      data: mapDbToQcIncident(updated),
    })
  } catch (error) {
    console.error('Error updating QC incident in DB:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi khi cập nhật sự cố chất lượng' },
      { status: 500 }
    )
  }
}

// DELETE /api/qc-incidents/[id]: Xóa sự cố chất lượng
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existing = await prisma.qcIncident.findFirst({
      where: {
        OR: [{ id }, { code: id }],
      },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy sự cố để xóa' },
        { status: 404 }
      )
    }

    await prisma.qcIncident.delete({
      where: { id: existing.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Đã xóa sự cố chất lượng',
    })
  } catch (error) {
    console.error('Error deleting QC incident from DB:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi khi xóa sự cố chất lượng' },
      { status: 500 }
    )
  }
}
