import { NextResponse } from 'next/server'

interface FeedbackPayload {
  title?: string
  type?: string
  priority?: string
  description?: string
  screenName: string
  currentUrl: string
  requesterName?: string
  requesterEmail?: string
  requesterRole?: string
  createdAt?: string
  screenshotBase64?: string
  actionTrail?: string[]
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export async function POST(request: Request) {
  try {
    const body: FeedbackPayload = await request.json()

    const descriptionText = body.description?.trim() || 'Người dùng gửi báo lỗi nhanh từ màn hình ' + (body.screenName || 'hệ thống')

    const botToken = process.env.TELEGRAM_BOT_TOKEN || '8204368272:AAFTuk31Tdu7w1ASI1VrQp_SSlcdocsWIM8'
    const chatId = process.env.TELEGRAM_CHAT_ID || '-5550156881'

    const timeStr = body.createdAt || new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
    const requester = body.requesterName?.trim() || 'Ẩn danh'
    const typeLabel =
      body.type === 'bug'
        ? '🐛 BÁO LỖI KỸ THUẬT'
        : body.type === 'ui_ux'
        ? '🎨 ĐIỀU CHỈNH GIAO DIỆN'
        : body.type === 'feature'
        ? '⚙️ YÊU CẦU TÍNH NĂNG'
        : '💡 ĐÓNG GÓP Ý KIẾN'

    const priorityLabel =
      body.priority === 'urgent'
        ? '🚨 KHẨN CẤP (P0 - Chặn thao tác)'
        : body.priority === 'high'
        ? '⚠️ CAO (P1)'
        : body.priority === 'low'
        ? '🔽 THẤP (P3)'
        : 'ℹ️ BÌNH THƯỜNG (P2)'

    const trailText =
      body.actionTrail && body.actionTrail.length > 0
        ? `\n\n<b>📜 Thao tác trước đó:</b>\n` +
          body.actionTrail
            .slice(0, 6)
            .map((item, idx) => `${idx + 1}. ${escapeHtml(item)}`)
            .join('\n')
        : ''

    const telegramMessage = `
<b>[${typeLabel} - RINOV5 STATION]</b>
━━━━━━━━━━━━━━━━━━━━
• <b>Tiêu đề:</b> ${escapeHtml(body.title || 'Báo lỗi hệ thống')}
• <b>Mức độ:</b> ${escapeHtml(priorityLabel)}
• <b>Màn hình:</b> ${escapeHtml(body.screenName || 'Chung')}
• <b>Thời gian:</b> ${escapeHtml(timeStr)}
• <b>Đường dẫn:</b> <a href="${escapeHtml(body.currentUrl)}">${escapeHtml(body.currentUrl)}</a>
• <b>Người gửi:</b> ${escapeHtml(requester)} ${body.requesterEmail ? `(${escapeHtml(body.requesterEmail)})` : ''} [${escapeHtml(body.requesterRole || 'N/A')}]

<b>Nội dung chi tiết:</b>
${escapeHtml(descriptionText)}${trailText}
━━━━━━━━━━━━━━━━━━━━
`.trim()

    if (botToken && chatId) {
      let sentSuccess = false

      // Try sending with photo first if screenshot is present
      if (body.screenshotBase64) {
        try {
          const base64Data = body.screenshotBase64.replace(/^data:image\/\w+;base64,/, '')
          const buffer = Buffer.from(base64Data, 'base64')
          const blob = new Blob([buffer], { type: 'image/jpeg' })

          const formData = new FormData()
          formData.append('chat_id', chatId)
          const caption = telegramMessage.length > 1000
            ? telegramMessage.slice(0, 995) + '...'
            : telegramMessage
          formData.append('caption', caption)
          formData.append('parse_mode', 'HTML')
          formData.append('photo', blob, 'screenshot.jpg')

          const photoRes = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
            method: 'POST',
            body: formData,
          })
          const photoData = await photoRes.json()
          if (photoRes.ok && photoData.ok) {
            sentSuccess = true
          } else {
            console.warn('sendPhoto failed, falling back to sendMessage:', photoData)
          }
        } catch (e) {
          console.warn('Error sending photo, falling back to sendMessage:', e)
        }
      }

      // Fallback to text message if no photo or photo failed
      if (!sentSuccess) {
        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`
        const res = await fetch(telegramUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: telegramMessage,
            parse_mode: 'HTML',
            disable_web_page_preview: false,
          }),
        })

        const resData = await res.json()
        if (!res.ok || !resData.ok) {
          console.error('Telegram API error:', resData)
          return NextResponse.json({
            ok: false,
            error: resData.description || 'Không thể gửi tin nhắn tới Telegram Bot.',
            isTelegramError: true,
          }, { status: 500 })
        }
      }
    }

    return NextResponse.json({
      ok: true,
      message: 'Đã gửi yêu cầu điều chỉnh thành công về nhóm Telegram!',
    })
  } catch (error) {
    console.error('Error handling feedback:', error)
    return NextResponse.json(
      { ok: false, error: 'Đã xảy ra lỗi máy chủ khi gửi phản hồi.' },
      { status: 500 }
    )
  }
}
