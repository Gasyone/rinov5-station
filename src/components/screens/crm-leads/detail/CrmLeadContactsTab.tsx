'use client'

import { useMemo } from 'react'
import { Plus, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { mockLeads, type Lead } from '@/mocks/crmLeads'
import { CrmLeadParentCard, type ParentContact } from './CrmLeadParentCard'
import { CrmLeadChildCard, type ChildPersonaItem } from './CrmLeadChildCard'

interface CrmLeadContactsTabProps {
  lead: Lead
  onAddParent?: () => void
  onAddChild?: () => void
  onSwitchLead?: (leadId: string) => void
  onOpenFullProfile?: () => void
}

export function CrmLeadContactsTab({
  lead,
  onAddParent,
  onAddChild,
  onSwitchLead,
  onOpenFullProfile,
}: CrmLeadContactsTabProps) {
  // 1. CHÂN DUNG PHỤ HUYNH & THÔNG TIN BUYER PERSONA
  const primaryContact: ParentContact = {
    name: lead.parentName || 'Nguyễn Thu Hà',
    role: lead.parentRole || 'Mẹ',
    phone: lead.phone || '0912345678',
    email: lead.email || 'thu.ha@gmail.com',
    occupation: lead.parentOccupation || 'Kế toán trưởng - FPT Software',
    financialSegment: lead.financialSegment || 'Khá giả (Thu nhập > 40 triệu/tháng)',
    budgetPerMonth: lead.budgetPerMonth || '3.000.000đ - 5.000.000đ/tháng',
    decisionMakerRole: lead.decisionMakerRole || 'Mẹ toàn quyền quyết định tài chính & chương trình',
    preferredContactMethod: lead.preferredContactMethod || 'Ưu tiên Zalo trong giờ hành chính',
    bestTimeToCall: lead.bestTimeToCall || '12h00 - 13h30 hoặc sau 18h30 (Không nghe số lạ buổi sáng)',
    parentExpectation:
      lead.parentExpectation ||
      'Con tự tin phản xạ giao tiếp tự nhiên, phát âm chuẩn quốc tế và thi lấy chứng chỉ Cambridge',
    parentPainPoint:
      lead.parentPainPoint ||
      'Trước đây học trung tâm cũ sĩ số đông (18-20 bé), giáo viên ít tương tác nên con bị nhút nhát và sợ nói',
    parentPersonalityNote:
      lead.parentPersonalityNote ||
      'Mẹ rất kỹ tính, chu đáo; thích xem số liệu minh bạch, báo cáo tiến độ học tập hàng tuần; thích trao đổi qua Zalo có hình ảnh lớp',
    preferredChannel: lead.preferredContactMethod || 'Ưu tiên Zalo',
    zaloStatus: 'Đã kết bạn Zalo',
    isPrimary: true,
    address: lead.address || 'Phường Bến Nghé, Quận 1, TP.HCM',
    province: lead.province || 'TP.HCM',
    district: lead.district || 'Quận 1',
    ward: lead.ward || 'Phường Bến Nghé',
    street: lead.streetAddress || 'Đồng Khởi, Bến Nghé',
    mapLink:
      lead.mapLink ||
      `https://maps.google.com/?q=${encodeURIComponent(
        lead.address || 'Phường Bến Nghé, Quận 1, TP.HCM'
      )}`,
    note:
      lead.parentPersonalityNote ||
      'Mẹ là người quyết định chính về chương trình học và tài chính gia đình. Ưu tiên nhắn Zalo trong giờ hành chính.',
  }

  const otherParents: ParentContact[] = (
    lead.otherParents || [
      {
        name: 'Trần Văn Sơn',
        role: 'Bố',
        phone: '091161999',
        email: 'vanson.tran@example.com',
        occupation: 'Kỹ sư Xây dựng - Vinaconex',
        preferredChannel: 'Ưu tiên Gọi điện',
        zaloStatus: 'Chưa kết bạn Zalo',
        address: lead.address || 'Phường Bến Nghé, Quận 1, TP.HCM',
        note: 'Bố hay đi công tác xa, chỉ gọi vào buổi tối sau 19h00 khi cần trao đổi gấp.',
      },
    ]
  ).map((p): ParentContact => ({
    name: p.name,
    role: p.role,
    phone: p.phone,
    email: p.email,
    isPrimary: false,
    occupation: p.occupation || 'Kỹ sư Xây dựng - Vinaconex',
    financialSegment: p.financialSegment,
    budgetPerMonth: p.budgetPerMonth,
    decisionMakerRole: p.decisionMakerRole,
    preferredContactMethod: p.preferredContactMethod,
    bestTimeToCall: p.bestTimeToCall,
    parentExpectation: p.parentExpectation,
    parentPainPoint: p.parentPainPoint,
    parentPersonalityNote: p.parentPersonalityNote,
    preferredChannel: p.preferredChannel || 'Ưu tiên Gọi điện',
    zaloStatus: p.zaloStatus || 'Chưa kết bạn Zalo',
    address: p.address || lead.address || 'Cùng địa chỉ gia đình',
    mapLink:
      lead.mapLink ||
      `https://maps.google.com/?q=${encodeURIComponent(
        lead.address || 'Phường Bến Nghé, Quận 1, TP.HCM'
      )}`,
    note: p.note || 'Bố hay đi công tác, chỉ gọi vào buổi tối khi cần trao đổi gấp.',
  }))

  const allParents: ParentContact[] = [primaryContact, ...otherParents]

  // 2. TÌM KIẾM TẤT CẢ HỌC VIÊN CON TRONG CÙNG GIA ĐÌNH & CHÂN DUNG HỌC TẬP
  const familyLeads = useMemo(() => {
    const matched = mockLeads.filter(
      (l) =>
        (lead.parentId && l.parentId === lead.parentId) ||
        (lead.phone && l.phone === lead.phone)
    )
    if (matched.length > 0) return matched
    return [lead]
  }, [lead])

  const allChildren: ChildPersonaItem[] = useMemo(() => {
    return familyLeads
      .map((ch, idx): ChildPersonaItem => {
        const isCurrent = ch.id === lead.id
        const isMain = idx === 0 || ch.id === 'lead-001'
        const isAn = ch.studentName.includes('An')
        const isBinh = ch.studentName.includes('Bình')

        const code = ch.code || (idx === 0 ? 'LD-10291-A' : 'LD-10291-B')
        const englishName = isCurrent
          ? lead.studentEnglishName || 'Alex'
          : isAn
            ? 'Alex'
            : isBinh
              ? 'Leo'
              : ''
        const birthYear = ch.birthYear || 2026 - ch.studentAge
        const birthDate = isAn
          ? '15/05/2018'
          : isBinh
            ? '20/09/2014'
            : `10/06/${birthYear}`
        const gender = isCurrent
          ? lead.studentGender || 'Nam'
          : 'Nam'
        const grade = isCurrent
          ? lead.studentCurrentGrade || 'Lớp 3'
          : isAn
            ? 'Lớp 3'
            : isBinh
              ? 'Lớp 7'
              : `Lớp ${ch.studentAge - 5}`
        const school =
          ch.schoolName || (isAn ? 'Tiểu học Đinh Tiên Hoàng' : 'THCS Thanh Xuân')
        const targetSubject =
          ch.targetSubject ||
          (isAn
            ? 'Anh văn Nhi đồng (SuperKids)'
            : 'Luyện thi Flyers & Toán tư duy')

        let statusLabel = 'Đang tư vấn'
        if (ch.status === 'chuyen_doi') statusLabel = 'Đã nhập học'
        else if (ch.testStatus === 'completed') statusLabel = 'Đã test đầu vào'
        else if (ch.testStatus === 'scheduled') statusLabel = 'Hẹn trải nghiệm'
        else if (ch.status === 'that_bai') statusLabel = 'Dừng chăm sóc'

        const testResultText = ch.testScore
          ? `Đạt ${ch.testScore} • ${ch.testResultLevel || 'Level B2 (Cô Emma)'}`
          : ch.testDate
            ? `Lịch test: ${ch.testDate} ${ch.testTime || '18:00'} (${ch.testerTeacherName || 'Thầy Alex'})`
            : 'Chưa xếp lịch kiểm tra đầu vào'

        const studentPhone =
          ch.studentPhone && ch.studentPhone !== '--'
            ? ch.studentPhone
            : isAn
              ? `${lead.phone} (Dùng SĐT Mẹ)`
              : '0988776655 (SĐT riêng của bé)'

        const personality = isCurrent
          ? lead.studentPersonality ||
            'Ngoan ngoãn, thích được khen ngợi, ban đầu hơi nhút nhát nhưng khi hòa nhập sẽ rất năng nổ'
          : isAn
            ? 'Ngoan ngoãn, thích được khen ngợi'
            : 'Tự giác, ham học hỏi, tập trung tốt'

        const interests = isCurrent
          ? lead.studentInterests ||
            'Mê lắp ráp Lego Technic, thích vẽ truyện tranh và xem phim hoạt hình tiếng Anh Paw Patrol'
          : isAn
            ? 'Lego Technic, vẽ truyện tranh, xem phim hoạt hình tiếng Anh'
            : 'Chơi cờ vua, lập trình Scratch, đọc sách khoa học'

        const learningStyle = isCurrent
          ? lead.studentLearningStyle ||
            'Trực quan (Visual) & Vận động (Kinesthetic) - Thích học qua flashcard hình ảnh và minigame tương tác'
          : isAn
            ? 'Trực quan & Vận động tương tác'
            : 'Logic & Phân tích độc lập'

        const strengths = isCurrent
          ? lead.studentStrengths ||
            'Ghi nhớ từ vựng qua hình ảnh cực nhanh, phát âm âm đuôi chuẩn, hào hứng khi chơi game thi đua'
          : isAn
            ? 'Ghi nhớ từ vựng nhanh, phát âm chuẩn'
            : 'Tư duy ngữ pháp vững, phản xạ đọc hiểu nhanh'

        const weaknesses = isCurrent
          ? lead.studentWeaknesses ||
            'Còn ngại nói câu dài khi đứng trước đám đông, viết chính tả hay quên mạo từ (a/an/the)'
          : isAn
            ? 'Ngại nói câu dài, dễ mất tập trung nếu bài quá dễ'
            : 'Kỹ năng viết luận học thuật cần mài giũa thêm'

        const learningGoal = isCurrent
          ? lead.studentLearningGoal ||
            'Tự tin thuyết trình tiếng Anh 3 phút trước lớp, đạt 14/15 khiên Cambridge Starters vào cuối năm học'
          : isAn
            ? 'Tự tin giao tiếp, thi chứng chỉ Cambridge'
            : 'Đạt giải Học sinh giỏi tiếng Anh và thi chứng chỉ KET/PET'

        const notes =
          ch.lastNote ||
          (isAn
            ? 'Bé tiếp thu nhanh qua hình ảnh và âm thanh, yêu thích môi trường học tương tác năng động.'
            : 'Học lực Giỏi, tự giác cao, cần rèn thêm kỹ năng viết luận tiếng Anh học thuật.')

        return {
          id: ch.id,
          code,
          name: ch.studentName,
          englishName,
          age: ch.studentAge,
          birthYear,
          birthDate,
          gender,
          school,
          grade,
          targetSubject,
          status: ch.status,
          statusLabel,
          testResultText,
          studentPhone,
          personality,
          interests,
          learningStyle,
          strengths,
          weaknesses,
          learningGoal,
          notes,
          isMain,
          isCurrent,
        }
      })
      .sort((a, b) => (a.isCurrent ? -1 : b.isCurrent ? 1 : 0))
  }, [familyLeads, lead])

  // Handlers
  const handleCopy = (phone: string, name: string) => {
    navigator.clipboard
      .writeText(phone)
      .then(() => toast.success(`Đã sao chép SĐT ${name}: ${phone}`))
      .catch(() => toast.error('Không thể sao chép SĐT'))
  }

  const handleCall = (phone: string, name: string) => {
    toast.info(`Đang kích hoạt cuộc gọi tới ${name} (${phone})...`)
    window.open(`tel:${phone}`, '_self')
  }

  const handleZalo = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, '')
    toast.info(`Mở cửa sổ chat Zalo với ${name}...`)
    window.open(`https://zalo.me/${cleanPhone}`, '_blank')
  }

  const handleOpenInNewTab = (childId: string, childName: string, childCode: string) => {
    toast.info(`Đang mở hồ sơ ${childName} (${childCode}) trong tab mới...`)
    window.open(`/app/crm_leads/${childId}`, '_blank')
  }

  return (
    <div className="space-y-4 text-xs text-left select-none">
      {/* ============================================================ */}
      {/* 1. SECTION: CHÂN DUNG PHỤ HUYNH (BUYER PERSONA)            */}
      {/* ============================================================ */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between pb-0.5">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-bold text-foreground">Chân dung Phụ huynh (Buyer Persona)</h3>
            <span className="text-xs text-muted-foreground font-semibold">
              ({allParents.length})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenFullProfile && (
              <Button
                size="sm"
                variant="outline"
                onClick={onOpenFullProfile}
                className="h-7 text-xs font-semibold text-primary border-primary/30 hover:bg-primary/10 cursor-pointer rounded-lg flex items-center gap-1.5"
                title="Xem toàn bộ hồ sơ chi tiết khi tạo Lead"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Hồ sơ chi tiết</span>
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={onAddParent}
              className="h-7 text-xs font-semibold text-primary border-primary/30 hover:bg-primary/10 cursor-pointer rounded-lg flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Thêm phụ huynh</span>
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {allParents.map((parent, idx) => (
            <CrmLeadParentCard
              key={`${parent.phone}-${idx}`}
              parent={parent}
              onCopy={handleCopy}
              onCall={handleCall}
              onZalo={handleZalo}
            />
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. SECTION: CHÂN DUNG HỌC VIÊN (LEARNER PROFILE 360°)       */}
      {/* ============================================================ */}
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between pb-0.5">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-bold text-foreground">Chân dung Học viên (Learner Profile)</h3>
            <span className="text-xs text-muted-foreground font-semibold">
              ({allChildren.length})
            </span>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={onAddChild}
            className="h-7 text-xs font-semibold text-primary border-primary/30 hover:bg-primary/10 cursor-pointer rounded-lg flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Thêm học viên</span>
          </Button>
        </div>

        <div className="space-y-3">
          {allChildren.map((child, idx) => (
            <CrmLeadChildCard
              key={`${child.id}-${child.name}-${idx}`}
              child={child}
              onSwitchLead={onSwitchLead}
              onOpenInNewTab={handleOpenInNewTab}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
