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

// GET /api/qc-incidents: Lấy danh sách sự cố chất lượng từ Supabase
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const branch = searchParams.get('branch')
    const status = searchParams.get('status')
    const targetGroup = searchParams.get('targetGroup')
    const severity = searchParams.get('severity')
    const source = searchParams.get('source')
    const search = searchParams.get('search')?.toLowerCase().trim()

    const where: any = {}
    if (branch && branch !== 'all') where.branch = branch
    if (status && status !== 'all') where.status = status
    if (targetGroup && targetGroup !== 'all') where.targetGroup = targetGroup
    if (severity && severity !== 'all') where.severity = severity
    if (source && source !== 'all') where.source = source

    const incidentsFromDb = await prisma.qcIncident.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    let mapped = incidentsFromDb.map(mapDbToQcIncident)

    if (search) {
      mapped = mapped.filter(
        (i) =>
          i.code.toLowerCase().includes(search) ||
          i.title.toLowerCase().includes(search) ||
          i.description.toLowerCase().includes(search) ||
          (i.className && i.className.toLowerCase().includes(search)) ||
          (i.teacherName && i.teacherName.toLowerCase().includes(search)) ||
          (i.csmName && i.csmName.toLowerCase().includes(search)) ||
          (i.assignee && i.assignee.toLowerCase().includes(search))
      )
    }

    return NextResponse.json({
      success: true,
      total: mapped.length,
      data: mapped,
    })
  } catch (error) {
    console.error('Error fetching QC incidents from DB:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi khi tải danh sách sự cố chất lượng từ cơ sở dữ liệu' },
      { status: 500 }
    )
  }
}

// POST /api/qc-incidents: Tạo mới sự cố chất lượng (đơn lẻ hoặc theo lô)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const nowIso = new Date().toISOString()
    const currentYear = new Date().getFullYear()

    // Đếm số lượng sự cố hiện có để sinh mã tiếp theo
    const count = await prisma.qcIncident.count()

    // Trường hợp 1: Tạo theo lô (Batch form từ QcCheckCreateDialog)
    if (Array.isArray(body.incidents)) {
      const { branch, inspectorId, inspectorName = 'Kiểm tra viên', incidents } = body
      const createdIncidents: QcIncident[] = []

      for (let idx = 0; idx < incidents.length; idx++) {
        const item = incidents[idx]
        const codeNumber = count + idx + 1
        const code = `QC-${currentYear}-${codeNumber.toString().padStart(3, '0')}`
        const title = item.title || item.description?.slice(0, 50) || 'Sự cố kiểm tra'

        const initialLog: QcLog = {
          id: `log_${Date.now()}_${idx}`,
          userId: inspectorId || 'ins_01',
          userName: inspectorName,
          action: 'Ghi nhận sự cố',
          details: `Ghi nhận vi phạm: ${title}`,
          createdAt: nowIso,
        }

        const created = await prisma.qcIncident.create({
          data: {
            code,
            title,
            targetGroup: item.targetGroup || 'operations',
            criteria: item.criteria || 'student_care',
            source: 'manual',
            severity: item.severity || 'medium',
            status: 'open',
            branch: branch || item.branch || 'RinoEdu Nguyễn Tuân',
            className: item.className || null,
            sessionNumber: item.sessionNumber ?? null,
            roomId: item.roomId || null,
            teacherName: item.teacherName || null,
            csmName: item.csmName || null,
            description: item.description || '',
            recurrenceCount: item.recurrenceCount ?? 0,
            evidence: item.evidence || 'Ghi nhận trực tiếp lúc kiểm tra',
            evidenceImage: item.evidenceImage || null,
            evidenceLink: item.evidenceLink || null,
            assignee: item.assignee || 'Bộ phận liên quan',
            issuedBy: inspectorName,
            deadline:
              item.deadline ||
              new Date(
                Date.now() + (item.severity === 'critical' || item.severity === 'high' ? 24 : 48) * 60 * 60 * 1000
              ).toISOString(),
            notes: item.notes || null,
            commentsJson: JSON.stringify([]),
            logsJson: JSON.stringify([initialLog]),
          },
        })

        createdIncidents.push(mapDbToQcIncident(created))
      }

      return NextResponse.json({
        success: true,
        message: `Đã tạo thành công ${createdIncidents.length} sự cố`,
        data: createdIncidents,
      })
    }

    // Trường hợp 2: Tạo đơn lẻ
    const codeNumber = count + 1
    const code = body.code || `QC-${currentYear}-${codeNumber.toString().padStart(3, '0')}`
    const title = body.title || body.description?.slice(0, 50) || 'Sự cố kiểm tra'
    const issuedBy = body.issuedBy || 'Kiểm tra viên'

    const initialLog: QcLog = {
      id: `log_${Date.now()}`,
      userId: body.userId || 'ins_01',
      userName: issuedBy,
      action: 'Ghi nhận sự cố',
      details: `Ghi nhận vi phạm: ${title}`,
      createdAt: nowIso,
    }

    const created = await prisma.qcIncident.create({
      data: {
        code,
        title,
        targetGroup: body.targetGroup || 'operations',
        criteria: body.criteria || 'student_care',
        source: body.source || 'manual',
        severity: body.severity || 'medium',
        status: body.status || 'open',
        branch: body.branch || 'RinoEdu Nguyễn Tuân',
        classId: body.classId || null,
        className: body.className || null,
        subject: body.subject || null,
        sessionNumber: body.sessionNumber ?? null,
        sessionDate: body.sessionDate || null,
        roomId: body.roomId || null,
        teacherId: body.teacherId || null,
        teacherName: body.teacherName || null,
        csmId: body.csmId || null,
        csmName: body.csmName || null,
        description: body.description || '',
        recurrenceCount: body.recurrenceCount ?? 0,
        evidence: body.evidence || 'Ghi nhận trực tiếp lúc kiểm tra',
        evidenceImage: body.evidenceImage || null,
        evidenceLink: body.evidenceLink || null,
        assignee: body.assignee || 'Bộ phận liên quan',
        issuedBy,
        deadline: body.deadline || null,
        correctiveAction: body.correctiveAction || null,
        correctiveEvidence: body.correctiveEvidence || null,
        correctiveImage: body.correctiveImage || null,
        correctiveLink: body.correctiveLink || null,
        completionDate: body.completionDate || null,
        closureMethod: body.closureMethod || null,
        closedBy: body.closedBy || null,
        closedAt: body.closedAt || null,
        notes: body.notes || null,
        commentsJson: JSON.stringify(body.comments || []),
        logsJson: JSON.stringify(body.logs || [initialLog]),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Đã tạo sự cố thành công',
      data: mapDbToQcIncident(created),
    })
  } catch (error) {
    console.error('Error creating QC incident in DB:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi khi tạo sự cố chất lượng vào cơ sở dữ liệu' },
      { status: 500 }
    )
  }
}
