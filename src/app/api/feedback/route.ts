import { NextResponse } from 'next/server'

interface FeedbackPayload {
  title?: string
  type?: string
  priority?: string
  description: string
  screenName: string
  currentUrl: string
  requesterName?: string
  requesterEmail?: string
  requesterRole?: string
  createdAt?: string
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

    if (!body.description?.trim()) {
      return NextResponse.json(
        { ok: false, error: 'Vui lòng nhập nội dung yêu cầu điều chỉnh.' },
        { status: 400 }
      )
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN || '8204368272:AAFTuk31Tdu7w1ASI1VrQp_SSlcdocsWIM8'
    const chatId = process.env.TELEGRAM_CHAT_ID || '-5550156881'

    const timeStr = body.createdAt || new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
    const requester = body.requesterName?.trim() || 'Ẩn danh'

    const telegramMessage = `
<b>[YÊU CẦU ĐIỀU CHỈNH - RINOV5 STATION]</b>
━━━━━━━━━━━━━━━━━━━━
• <b>Màn hình:</b> ${escapeHtml(body.screenName || 'Chung')}
• <b>Thời gian:</b> ${escapeHtml(timeStr)}
• <b>Link:</b> <a href="${escapeHtml(body.currentUrl)}">${escapeHtml(body.currentUrl)}</a>
• <b>Người gửi:</b> ${escapeHtml(requester)}

<b>Nội dung:</b>
${escapeHtml(body.description)}
━━━━━━━━━━━━━━━━━━━━
`.trim()

    if (botToken && chatId) {
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
