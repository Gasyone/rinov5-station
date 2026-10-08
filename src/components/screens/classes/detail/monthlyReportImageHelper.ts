import { parseEvaluationContent } from './FormattedEvaluationContent'
import { DEFAULT_SECTION_B2_WEEKS, type WeekReviewItem } from './monthlyReportHelpers'

export interface MonthlyReportImageOptions {
  student: {
    id?: string
    name: string
    code?: string
    avatar?: string
    level?: string
  }
  monthTitle: string
  nextMonthTitle?: string
  dateStr: string
  awardBadge?: string
  teacherName?: string
  subject?: string
  roadmap?: string
  level?: string
  metrics?: {
    attendanceRatio: string
    lateCount: number
    homeworkRatio: string
    homeworkAvg: string
    testScore: number | null
    priorTestScore: number | null
  }
  sectionA1Content?: string
  sectionA2Content?: string
  sectionB1Content?: string
  sectionB2Weeks?: WeekReviewItem[]
}

// Hàm chia dòng văn bản Canvas theo độ rộng pixel tối đa
function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  if (!text) return []
  const paragraphs = text.split('\n')
  const lines: string[] = []

  for (const paragraph of paragraphs) {
    if (paragraph.trim() === '') {
      continue
    }
    const words = paragraph.split(' ')
    let currentLine = ''

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word
      const metrics = ctx.measureText(testLine)
      if (metrics.width > maxWidth && currentLine !== '') {
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    }
    if (currentLine) {
      lines.push(currentLine)
    }
  }

  return lines
}

// Vẽ hình ngôi sao 4 cánh hoặc lấp lánh (sparkles)
function drawSparkle(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  fillColor: string
) {
  ctx.save()
  ctx.fillStyle = fillColor
  ctx.beginPath()
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2
    ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius)
    const nextAngle = angle + Math.PI / 4
    ctx.lineTo(cx + Math.cos(nextAngle) * (radius * 0.35), cy + Math.sin(nextAngle) * (radius * 0.35))
  }
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

// Hàm tải ảnh an toàn cho Canvas
function loadCanvasImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(null)
      return
    }
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

// Kiểm tra ảnh có an toàn để xuất trên Canvas mà không bị dính lỗi CORS (Tainted Canvas) không
function isImageCanvasSafe(img: HTMLImageElement): boolean {
  if (typeof document === 'undefined') return false
  try {
    const testCanvas = document.createElement('canvas')
    testCanvas.width = 1
    testCanvas.height = 1
    const testCtx = testCanvas.getContext('2d')
    if (!testCtx) return false
    testCtx.drawImage(img, 0, 0, 1, 1)
    testCanvas.toDataURL()
    return true
  } catch {
    return false
  }
}

/**
 * Xuất ảnh báo cáo học tập tháng (Infographic)
 * Tự động tải file PNG về máy tính ngay lập tức mà không cần mở modal.
 */
export async function downloadMonthlyReportImage(options: MonthlyReportImageOptions): Promise<void> {
  const {
    student,
    monthTitle,
    nextMonthTitle,
    dateStr,
    awardBadge,
    teacherName = 'Ms.Chloe',
    subject = 'Toán tư duy',
    roadmap = 'Toán Tư Duy Archimedes',
    level = 'Lớp 4',
    metrics = {
      attendanceRatio: '6/7',
      lateCount: 0,
      homeworkRatio: '6/7',
      homeworkAvg: '7.5',
      testScore: 8.5,
      priorTestScore: 8.0,
    },
    sectionA1Content = '',
    sectionA2Content = '',
    sectionB1Content = '',
    sectionB2Weeks,
  } = options

  // Danh sách các tuần ôn tập riêng (lấy tối đa 4 tuần theo thiết kế)
  const weeksToRender = (
    sectionB2Weeks && sectionB2Weeks.length > 0
      ? sectionB2Weeks
      : DEFAULT_SECTION_B2_WEEKS
  ).slice(0, 4)

  const cardH = 56
  const cardGap = 8
  const b2TotalH = weeksToRender.length * cardH + Math.max(0, weeksToRender.length - 1) * cardGap

  const reportBoxY = 386
  // b2StartY = 908 (Section A: ~314px, Section B heading + B1: ~136px)
  const reportBoxH = (908 + b2TotalH + 22) - reportBoxY
  const footY = reportBoxY + reportBoxH + 16
  const footH = 52
  const height = footY + footH + 48

  const width = 1080
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Canvas context không khả dụng.')
  }

  // Tải trước Logo RinoEdu và các thumbnail bài học tuần an toàn song song
  const [rinoLogo, weekThumbnails] = await Promise.all([
    loadCanvasImage('/rinoedu-logo.png'),
    Promise.all(
      weeksToRender.map(async (w) => {
        if (!w.thumbnailUrl) return null
        try {
          const img = await loadCanvasImage(w.thumbnailUrl)
          if (img && isImageCanvasSafe(img)) {
            return img
          }
          return null
        } catch {
          return null
        }
      })
    ),
  ])

  // Tên viết tắt Avatar (2 chữ cái cuối)
  const sInitials = student.name
    .trim()
    .split(' ')
    .slice(-2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()

  const cleanBadge = (awardBadge || '').replace(/^[^\p{L}\p{N}]+/u, '').trim()

  // 1. NỀN TỔNG THỂ (Gradient kem - xám ấm sang trọng)
  const bgGrad = ctx.createLinearGradient(0, 0, width, height)
  bgGrad.addColorStop(0, '#FFFDF8')
  bgGrad.addColorStop(0.35, '#FAF6EE')
  bgGrad.addColorStop(1, '#F3ECE0')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, width, height)

  // Khung viền đôi ngoài tinh tế
  ctx.strokeStyle = '#EAD8C2'
  ctx.lineWidth = 4
  ctx.strokeRect(18, 18, width - 36, height - 36)
  ctx.strokeStyle = '#D97706'
  ctx.lineWidth = 1.5
  ctx.strokeRect(24, 24, width - 48, height - 48)

  const contentX = 48
  const contentW = width - contentX * 2 // 984px

  // 2. GỘP SECTION RINO EDU & THÔNG TIN HỌC VIÊN (CHIA TRÁI - PHẢI)
  const headerY = 44
  const headerH = 112
  const headerGrad = ctx.createLinearGradient(contentX, headerY, contentX + contentW, headerY + headerH)
  headerGrad.addColorStop(0, '#EA580C')
  headerGrad.addColorStop(1, '#C2410C')
  ctx.fillStyle = headerGrad
  ctx.beginPath()
  ctx.roundRect(contentX, headerY, contentW, headerH, 14)
  ctx.fill()
  ctx.strokeStyle = 'rgba(254, 215, 170, 0.35)'
  ctx.lineWidth = 1
  ctx.stroke()

  // ── PHẦN TRÁI: THƯƠNG HIỆU RINO EDU (CÓ LOGO RINOEDU) & THÔNG TIN KỲ BÁO CÁO ──
  const logoBoxX = contentX + 20
  const logoBoxY = headerY + 28
  const logoBoxSize = 56

  // Khung chứa Logo RinoEdu màu trắng
  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.roundRect(logoBoxX, logoBoxY, logoBoxSize, logoBoxSize, 12)
  ctx.fill()
  ctx.shadowColor = 'rgba(0, 0, 0, 0.08)'
  ctx.shadowBlur = 6
  ctx.shadowOffsetY = 2

  if (rinoLogo) {
    ctx.drawImage(rinoLogo, logoBoxX + 6, logoBoxY + 6, logoBoxSize - 12, logoBoxSize - 12)
  } else {
    // Fallback nếu ảnh logo không tải được: Logo chữ R cách điệu
    ctx.fillStyle = '#EA580C'
    ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('R', logoBoxX + logoBoxSize / 2, logoBoxY + 36)
    ctx.textAlign = 'left'
  }
  ctx.shadowColor = 'transparent'

  const leftTextX = logoBoxX + logoBoxSize + 14
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 19.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.fillText('RINO EDU • HỌC VIỆN ĐÀO TẠO', leftTextX, headerY + 38)

  ctx.fillStyle = '#FED7AA'
  ctx.font = '600 13.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.fillText(`BÁO CÁO TIẾN TRÌNH HỌC TẬP • ${monthTitle.toUpperCase()}`, leftTextX, headerY + 64)

  ctx.fillStyle = '#FFEDD5'
  ctx.font = '500 12.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.fillText(`Thời gian: ${dateStr}`, leftTextX, headerY + 88)

  // Vạch ngăn cách dọc ở giữa chia Trái - Phải
  const dividerX = contentX + 472
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)'
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(dividerX, headerY + 16)
  ctx.lineTo(dividerX, headerY + headerH - 16)
  ctx.stroke()

  // ── PHẦN PHẢI: THÔNG TIN HỌC VIÊN CĂN PHẢI & AVATAR ĐẶT Ở CẠNH PHẢI ──
  const avCenterRadius = 29
  const avCenterX = contentX + contentW - 52
  const avCenterY = headerY + 56

  // 1. Avatar Circle trắng nổi bật đặt ở cạnh phải cùng
  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.arc(avCenterX, avCenterY, avCenterRadius, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#EA580C'
  ctx.font = 'bold 21px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(sInitials, avCenterX, avCenterY + 7.5)

  // 2. Thông tin học sinh căn phải (text-align: right)
  const sTextRightX = avCenterX - 42
  ctx.textAlign = 'right'

  // Tên học sinh
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 21px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.fillText(student.name, sTextRightX, headerY + 36)

  // Môn học & Lớp
  ctx.fillStyle = '#FED7AA'
  ctx.font = '500 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  const studentCodeStr = student.code ? ` (${student.code})` : ''
  const courseDesc = [subject, roadmap, level].filter(Boolean).join(' • ')
  ctx.fillText(`${courseDesc || subject}${studentCodeStr}`, sTextRightX, headerY + 63)

  // Giáo viên phụ trách (và Danh hiệu nếu có)
  ctx.fillStyle = '#FFEDD5'
  ctx.font = '500 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  let teacherBadgeText = `GV phụ trách: ${teacherName}`
  if (cleanBadge) {
    teacherBadgeText += ` • 🏆 ${cleanBadge}`
  }
  ctx.fillText(teacherBadgeText, sTextRightX, headerY + 89)

  ctx.textAlign = 'left'

  // 3. BANNER LỜI CHÚC MỪNG & GHI NHẬN (Chuẩn 100% Khối Đầu Cột Phải Landing Page)
  const bannerY = 172
  const bannerH = 92
  ctx.fillStyle = '#FFFBEB'
  ctx.beginPath()
  ctx.roundRect(contentX, bannerY, contentW, bannerH, 14)
  ctx.fill()
  ctx.strokeStyle = '#FCD34D'
  ctx.lineWidth = 1.2
  ctx.stroke()

  // Sparkles Icon Container
  const iconBoxX = contentX + 22
  const iconBoxY = bannerY + 24
  ctx.fillStyle = 'rgba(245, 158, 11, 0.15)'
  ctx.beginPath()
  ctx.roundRect(iconBoxX, iconBoxY, 44, 44, 10)
  ctx.fill()
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)'
  ctx.lineWidth = 1
  ctx.stroke()
  drawSparkle(ctx, iconBoxX + 22, iconBoxY + 22, 14, '#D97706')

  // Nội dung Lời chúc mừng
  ctx.fillStyle = '#78350F'
  ctx.font = '500 14.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  const bannerText = `Rino Edu chúc mừng con ${student.name} đã hoàn thành tốt kỳ học vừa qua tại môn ${subject} (${roadmap})! Dưới đây là phần đánh giá năng lực chi tiết và định hướng rèn luyện từ giáo viên phụ trách ${teacherName}.`
  const bannerLines = wrapCanvasText(ctx, bannerText, contentW - 100)
  let bLineY = bannerY + 36
  bannerLines.slice(0, 3).forEach((line) => {
    ctx.fillText(line, contentX + 80, bLineY)
    bLineY += 23
  })

  // 4. KHỐI 3 THẺ CHỈ SỐ THỐNG KÊ (Chuẩn MonthlyReportStatsCards: Chỉ số trên, Text dưới)
  const statsY = 280
  const statCardW = (contentW - 24) / 3 // 320px
  const statCardH = 90

  // Card 1: Chuyên cần (Emerald)
  ctx.fillStyle = '#ECFDF5'
  ctx.beginPath()
  ctx.roundRect(contentX, statsY, statCardW, statCardH, 12)
  ctx.fill()
  ctx.strokeStyle = '#A7F3D0'
  ctx.lineWidth = 1
  ctx.stroke()

  // Chỉ số lên trên (Top row: Tỉ lệ & Muộn)
  ctx.fillStyle = '#047857'
  ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.fillText(metrics.attendanceRatio, contentX + 18, statsY + 44)

  ctx.fillStyle = '#D97706'
  ctx.font = '600 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(`Muộn: ${metrics.lateCount}`, contentX + statCardW - 18, statsY + 42)
  ctx.textAlign = 'left'

  // Text xuống dưới (Bottom row: Nhãn danh mục)
  ctx.fillStyle = '#065F46'
  ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.fillText('CHUYÊN CẦN', contentX + 18, statsY + 72)

  // Card 2: Bài tập về nhà (Sky)
  const stat2X = contentX + statCardW + 12
  ctx.fillStyle = '#F0F9FF'
  ctx.beginPath()
  ctx.roundRect(stat2X, statsY, statCardW, statCardH, 12)
  ctx.fill()
  ctx.strokeStyle = '#BAE6FD'
  ctx.lineWidth = 1
  ctx.stroke()

  // Chỉ số lên trên (Top row: Tỉ lệ & Trung bình)
  ctx.fillStyle = '#0284C7'
  ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.fillText(metrics.homeworkRatio, stat2X + 18, statsY + 44)

  ctx.fillStyle = '#0369A1'
  ctx.font = '600 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(`Trung bình: ${metrics.homeworkAvg}`, stat2X + statCardW - 18, statsY + 42)
  ctx.textAlign = 'left'

  // Text xuống dưới (Bottom row: Nhãn danh mục)
  ctx.fillStyle = '#075985'
  ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.fillText('BÀI TẬP VỀ NHÀ', stat2X + 18, statsY + 72)

  // Card 3: Kiểm tra định kỳ (Violet)
  const stat3X = stat2X + statCardW + 12
  ctx.fillStyle = '#F5F3FF'
  ctx.beginPath()
  ctx.roundRect(stat3X, statsY, statCardW, statCardH, 12)
  ctx.fill()
  ctx.strokeStyle = '#DDD6FE'
  ctx.lineWidth = 1
  ctx.stroke()

  // Chỉ số lên trên (Top row: Điểm & Điểm trước)
  ctx.fillStyle = '#6D28D9'
  ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.fillText(metrics.testScore !== null ? metrics.testScore.toFixed(1) : '8.5', stat3X + 18, statsY + 44)

  ctx.fillStyle = '#7C3AED'
  ctx.font = '600 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(`Trước: ${metrics.priorTestScore !== null ? metrics.priorTestScore.toFixed(1) : '8.0'}`, stat3X + statCardW - 18, statsY + 42)
  ctx.textAlign = 'left'

  // Text xuống dưới (Bottom row: Nhãn danh mục)
  ctx.fillStyle = '#5B21B6'
  ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.fillText('KIỂM TRA ĐỊNH KỲ', stat3X + 18, statsY + 72)

  // 5. KHUNG BÁO CÁO CHI TIẾT (SECTION A + SECTION B)
  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.roundRect(contentX, reportBoxY, contentW, reportBoxH, 16)
  ctx.fill()
  ctx.strokeStyle = '#E2E8F0'
  ctx.lineWidth = 1.2
  ctx.stroke()

  // ── SECTION A: ĐÁNH GIÁ QUÁ TRÌNH HỌC TẬP ──
  let curY = reportBoxY + 32

  // Badge [A] + Tiêu đề Section A
  ctx.fillStyle = 'rgba(234, 88, 12, 0.12)'
  ctx.beginPath()
  ctx.roundRect(contentX + 24, curY - 18, 28, 28, 6)
  ctx.fill()
  ctx.fillStyle = '#EA580C'
  ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('A', contentX + 38, curY + 2)
  ctx.textAlign = 'left'

  ctx.fillStyle = '#0F172A'
  ctx.font = 'bold 17px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.fillText(`ĐÁNH GIÁ QUÁ TRÌNH HỌC TẬP • ${monthTitle.toUpperCase()}`, contentX + 62, curY + 2)

  curY += 26

  // 1. Nhận xét chung (A1)
  ctx.fillStyle = '#1E293B'
  ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.fillText('1. Nhận xét chung', contentX + 24, curY)
  curY += 10

  // Hộp chứa A1
  const boxInnerW = contentW - 48
  const a1Items = parseEvaluationContent(sectionA1Content, 'general')
  const a1BoxY = curY
  const a1BoxH = 144

  ctx.fillStyle = '#F8FAFC'
  ctx.beginPath()
  ctx.roundRect(contentX + 24, a1BoxY, boxInnerW, a1BoxH, 10)
  ctx.fill()
  ctx.strokeStyle = '#E2E8F0'
  ctx.lineWidth = 1
  ctx.stroke()

  let textY = a1BoxY + 24
  if (a1Items.length > 0) {
    a1Items.slice(0, 2).forEach((item) => {
      const isPositive = item.label.toLowerCase().includes('nổi bật') || item.label.toLowerCase().includes('mạnh') || item.label.toLowerCase().includes('tốt')
      ctx.fillStyle = isPositive ? '#047857' : '#B45309'
      ctx.font = 'bold 13.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      ctx.fillText(`• ${item.label}`, contentX + 38, textY)
      textY += 19

      ctx.fillStyle = '#334155'
      ctx.font = '400 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      const lines = wrapCanvasText(ctx, item.body, boxInnerW - 36)
      lines.slice(0, 2).forEach((line) => {
        ctx.fillText(line, contentX + 38, textY)
        textY += 18
      })
      textY += 5
    })
  } else {
    ctx.fillStyle = '#334155'
    ctx.font = '400 13.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    const lines = wrapCanvasText(ctx, sectionA1Content || 'Con có tinh thần học tập tích cực, tập trung nghe giảng và hoàn thành bài tập đầy đủ.', boxInnerW - 36)
    lines.slice(0, 4).forEach((line) => {
      ctx.fillText(line, contentX + 38, textY)
      textY += 20
    })
  }

  curY = a1BoxY + a1BoxH + 18

  // 2. Nhận xét về kết quả học tập (A2)
  ctx.fillStyle = '#1E293B'
  ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.fillText('2. Nhận xét về kết quả học tập', contentX + 24, curY)
  curY += 10

  const a2Items = parseEvaluationContent(sectionA2Content, 'academic')
  const a2BoxY = curY
  const a2BoxH = 144

  ctx.fillStyle = '#F8FAFC'
  ctx.beginPath()
  ctx.roundRect(contentX + 24, a2BoxY, boxInnerW, a2BoxH, 10)
  ctx.fill()
  ctx.strokeStyle = '#E2E8F0'
  ctx.lineWidth = 1
  ctx.stroke()

  textY = a2BoxY + 24
  if (a2Items.length > 0) {
    a2Items.slice(0, 2).forEach((item) => {
      const isSkill = item.label.toLowerCase().includes('kỹ năng') || item.label.toLowerCase().includes('cấu trúc')
      ctx.fillStyle = isSkill ? '#7E22CE' : '#0284C7'
      ctx.font = 'bold 13.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      ctx.fillText(`• ${item.label}`, contentX + 38, textY)
      textY += 19

      ctx.fillStyle = '#334155'
      ctx.font = '400 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      const lines = wrapCanvasText(ctx, item.body, boxInnerW - 36)
      lines.slice(0, 2).forEach((line) => {
        ctx.fillText(line, contentX + 38, textY)
        textY += 18
      })
      textY += 5
    })
  } else {
    ctx.fillStyle = '#334155'
    ctx.font = '400 13.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    const lines = wrapCanvasText(ctx, sectionA2Content || 'Nắm vững kiến thức trọng tâm bài học, giải bài tập tự tin và hoàn thành tốt nhiệm vụ học tập.', boxInnerW - 36)
    lines.slice(0, 4).forEach((line) => {
      ctx.fillText(line, contentX + 38, textY)
      textY += 20
    })
  }

  curY = a2BoxY + a2BoxH + 22

  // ── SECTION B: KẾ HOẠCH HỌC TẬP THÁNG TỚI ──
  // Badge [B] + Tiêu đề Section B
  ctx.fillStyle = 'rgba(217, 119, 6, 0.12)'
  ctx.beginPath()
  ctx.roundRect(contentX + 24, curY - 18, 28, 28, 6)
  ctx.fill()
  ctx.fillStyle = '#D97706'
  ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('B', contentX + 38, curY + 2)
  ctx.textAlign = 'left'

  ctx.fillStyle = '#0F172A'
  ctx.font = 'bold 17px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  const nextMonthText = nextMonthTitle ? nextMonthTitle.toUpperCase() : 'THÁNG TỚI'
  ctx.fillText(`KẾ HOẠCH HỌC TẬP THÁNG TỚI • ${nextMonthText}`, contentX + 62, curY + 2)

  curY += 24

  // 1. Nội dung bài học tháng tới (B1)
  ctx.fillStyle = '#1E293B'
  ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.fillText('1. Nội dung bài học và mục tiêu rèn luyện', contentX + 24, curY)
  curY += 10

  const b1BoxY = curY
  const b1BoxH = 54

  ctx.fillStyle = '#F8FAFC'
  ctx.beginPath()
  ctx.roundRect(contentX + 24, b1BoxY, boxInnerW, b1BoxH, 10)
  ctx.fill()
  ctx.strokeStyle = '#E2E8F0'
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.fillStyle = '#334155'
  ctx.font = '400 13.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  const b1Lines = wrapCanvasText(
    ctx,
    sectionB1Content || 'Tháng tới con tiếp tục nâng cao phản xạ tư duy toán học.',
    boxInnerW - 36
  )
  if (b1Lines.length <= 1) {
    ctx.fillText(b1Lines[0] || 'Tháng tới con tiếp tục nâng cao phản xạ tư duy toán học.', contentX + 38, b1BoxY + 32)
  } else {
    ctx.fillText(b1Lines[0], contentX + 38, b1BoxY + 23)
    ctx.fillText(b1Lines[1], contentX + 38, b1BoxY + 43)
  }

  // 2. Nội dung ôn tập riêng (B2)
  curY = b1BoxY + b1BoxH + 18
  ctx.fillStyle = '#1E293B'
  ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.fillText('2. Nội dung ôn tập riêng', contentX + 24, curY)
  curY += 10

  const thumbSize = 42

  weeksToRender.forEach((w, wIdx) => {
    const cardY = curY + wIdx * (cardH + cardGap)

    // Khung thẻ tuần
    ctx.fillStyle = '#F8FAFC'
    ctx.beginPath()
    ctx.roundRect(contentX + 24, cardY, boxInnerW, cardH, 9)
    ctx.fill()
    ctx.strokeStyle = '#E2E8F0'
    ctx.lineWidth = 1
    ctx.stroke()

    // 1. Thumbnail ảnh bên phải
    const thumbX = contentX + 24 + boxInnerW - 10 - thumbSize
    const thumbY = cardY + (cardH - thumbSize) / 2
    const safeThumb = weekThumbnails[wIdx]

    ctx.save()
    ctx.beginPath()
    ctx.roundRect(thumbX, thumbY, thumbSize, thumbSize, 7)
    ctx.clip()

    if (safeThumb) {
      ctx.drawImage(safeThumb, thumbX, thumbY, thumbSize, thumbSize)
    } else {
      ctx.fillStyle = '#F1F5F9'
      ctx.fillRect(thumbX, thumbY, thumbSize, thumbSize)
      ctx.fillStyle = '#64748B'
      ctx.font = '18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('📚', thumbX + thumbSize / 2, thumbY + thumbSize / 2 + 6)
      ctx.textAlign = 'left'
    }
    ctx.restore()

    ctx.strokeStyle = '#E2E8F0'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.roundRect(thumbX, thumbY, thumbSize, thumbSize, 7)
    ctx.stroke()

    // 2. Nội dung văn bản bên trái (Tiêu đề in đậm + Nội dung text thường)
    const textStartX = contentX + 38
    const textMaxW = boxInnerW - thumbSize - 34
    const prefix = `${w.title || `Tuần ${w.weekNum}`}: `

    ctx.font = 'bold 13.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    const prefixW = ctx.measureText(prefix).width

    ctx.font = '400 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    const fullText = `${prefix}${w.content}`
    const wLines = wrapCanvasText(ctx, fullText, textMaxW)

    if (wLines.length <= 1) {
      const singleY = cardY + 33
      ctx.fillStyle = '#0F172A'
      ctx.font = 'bold 13.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      ctx.fillText(prefix, textStartX, singleY)

      ctx.fillStyle = '#334155'
      ctx.font = '400 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      const rest = wLines[0]?.startsWith(prefix) ? wLines[0].slice(prefix.length) : (w.content || '')
      ctx.fillText(rest, textStartX + prefixW, singleY)
    } else {
      const line1Y = cardY + 23
      const line2Y = cardY + 43

      ctx.fillStyle = '#0F172A'
      ctx.font = 'bold 13.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      ctx.fillText(prefix, textStartX, line1Y)

      ctx.fillStyle = '#334155'
      ctx.font = '400 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      const rest1 = wLines[0]?.startsWith(prefix) ? wLines[0].slice(prefix.length) : wLines[0]
      ctx.fillText(rest1, textStartX + prefixW, line1Y)

      ctx.fillText(wLines[1], textStartX, line2Y)
    }
  })

  // 6. CHÂN TRANG (CHỈ GIỮ 1 DÒNG SLOGAN DUY NHẤT & THU GỌN ẢNH)
  ctx.fillStyle = '#F8FAFC'
  ctx.beginPath()
  ctx.roundRect(contentX, footY, contentW, footH, 12)
  ctx.fill()
  ctx.strokeStyle = '#CBD5E1'
  ctx.lineWidth = 1
  ctx.stroke()

  const sloganText = `"RinoEdu đồng hành cùng con ${student.name} trên hành trình bứt phá năng lực & tư duy!"`
  ctx.fillStyle = '#0F172A'
  ctx.textAlign = 'center'
  let sloganFontSize = 14.5
  ctx.font = `italic 500 ${sloganFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
  while (ctx.measureText(sloganText).width > contentW - 48 && sloganFontSize > 11) {
    sloganFontSize -= 0.5
    ctx.font = `italic 500 ${sloganFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
  }
  ctx.fillText(sloganText, contentX + contentW / 2, footY + 31.5)
  ctx.textAlign = 'left'

  // Chuyển canvas thành DataURL và tải file PNG trực tiếp về máy tính
  const dataUrl = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  const sanitizedName = student.name.replace(/\s+/g, '_')
  const sanitizedMonth = monthTitle.replace(/\s+/g, '_')
  link.download = `Bao_Cao_Hoc_Tap_${sanitizedName}_${sanitizedMonth}.png`
  link.href = dataUrl
  link.click()
}
