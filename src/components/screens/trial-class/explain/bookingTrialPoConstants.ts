import {
  PoSectionSpec,
  AcceptanceCriteriaItem,
  CornerCaseItem,
  BusinessRuleItem,
  DataSourceItem,
} from './bookingTrialPoTypes'

export const STORAGE_KEY_PO_SECTIONS = 'rinov5_po_explain_booking_trial_v2'

export function createEmptyAc(): AcceptanceCriteriaItem {
  return {
    id: 'ac_' + Math.random().toString(36).substring(2, 9),
    scenario: '',
    given: '',
    when: '',
    then: '',
  }
}

export function createEmptyCornerCase(): CornerCaseItem {
  return {
    id: 'cc_' + Math.random().toString(36).substring(2, 9),
    code: '',
    title: '',
    scenario: '',
    handling: '',
  }
}

export function createEmptyBusinessRule(): BusinessRuleItem {
  return {
    id: 'br_' + Math.random().toString(36).substring(2, 9),
    code: '',
    title: '',
    rule: '',
  }
}

export function createEmptyDataSource(): DataSourceItem {
  return {
    id: 'ds_' + Math.random().toString(36).substring(2, 9),
    entity: '',
    fields: '',
    notes: '',
  }
}

export const DEFAULT_PO_SECTIONS: PoSectionSpec[] = [
  {
    id: 'lead-banner',
    code: 'SEC-BT-01',
    title: 'Banner thông tin Lead & Nguồn tiếp nhận',
    subtitle: 'Hiển thị tóm tắt thông tin học viên, phụ huynh, SĐT và cơ sở gốc',
    targetSelector: '[data-po-section="lead-banner"]',
    intent: 'Giúp nhân viên đối chiếu nhanh thông tin Lead từ CRM trước khi thao tác đặt lịch học thử',
    dataSources: [],
    acceptanceCriteriaList: [],
    cornerCasesList: [],
    businessRulesList: [],
    poNotes: '',
  },
  {
    id: 'program-select',
    code: 'SEC-BT-02',
    title: 'Dropdown Chọn Chương trình học',
    subtitle: 'Lựa chọn chương trình học thử cho học sinh',
    targetSelector: '[data-po-section="program-select"]',
    intent: 'Lọc các lớp và ca học tương ứng với lộ trình và môn học mà học viên quan tâm',
    dataSources: [],
    acceptanceCriteriaList: [],
    cornerCasesList: [],
    businessRulesList: [],
    poNotes: '',
  },
  {
    id: 'school-select',
    code: 'SEC-BT-03',
    title: 'Dropdown Chọn Cơ sở tiếp nhận',
    subtitle: 'Lựa chọn chi nhánh/trung tâm học sinh sẽ tham gia học thử',
    targetSelector: '[data-po-section="school-select"]',
    intent: 'Xác định địa điểm trung tâm để tra cứu lịch ca học và kiểm tra khoảng cách di chuyển',
    dataSources: [],
    acceptanceCriteriaList: [],
    cornerCasesList: [],
    businessRulesList: [],
    poNotes: '',
  },
  {
    id: 'nearest-centers',
    code: 'SEC-BT-04',
    title: 'Gợi ý Cơ sở gần nhất theo định vị',
    subtitle: 'Danh sách 3 trung tâm gần nhất kèm khoảng cách (km)',
    targetSelector: '[data-po-section="nearest-centers"]',
    intent: 'Hỗ trợ nhân viên tư vấn nhanh cơ sở thuận tiện nhất cho phụ huynh dựa trên địa chỉ Lead',
    dataSources: [],
    acceptanceCriteriaList: [],
    cornerCasesList: [],
    businessRulesList: [],
    poNotes: '',
  },
  {
    id: 'schedule-date-filter',
    code: 'SEC-BT-05',
    title: 'Bộ lọc thời gian & Preset ngày',
    subtitle: 'Phím tắt 7 ngày tới, 14 ngày tới hoặc chọn khoảng ngày tự do',
    targetSelector: '[data-po-section="schedule-date-filter"]',
    intent: 'Thu hẹp danh sách các ca học mở trong khoảng thời gian phụ huynh mong muốn',
    dataSources: [],
    acceptanceCriteriaList: [],
    cornerCasesList: [],
    businessRulesList: [],
    poNotes: '',
  },
  {
    id: 'schedule-session-list',
    code: 'SEC-BT-06',
    title: 'Danh sách ca học & Kiểm tra sĩ số',
    subtitle: 'Accordion lớp học (CLS), ngày học, giờ học, sĩ số và giáo viên',
    targetSelector: '[data-po-section="schedule-session-list"]',
    intent: 'Cho phép người dùng chọn chính xác 1 ca học thử còn chỗ trống và xem trước giáo trình bài học',
    dataSources: [],
    acceptanceCriteriaList: [],
    cornerCasesList: [],
    businessRulesList: [],
    poNotes: '',
  },
  {
    id: 'notes',
    code: 'SEC-BT-07',
    title: 'Ô nhập Ghi chú ca học thử',
    subtitle: 'Nhập ghi chú đặc biệt cho giáo viên và vận hành trung tâm',
    targetSelector: '[data-po-section="notes"]',
    intent: 'Lưu trữ các lưu ý về tính cách bé, kỳ vọng phụ huynh hoặc tình trạng sức khỏe',
    dataSources: [],
    acceptanceCriteriaList: [],
    cornerCasesList: [],
    businessRulesList: [],
    poNotes: '',
  },
  {
    id: 'contact-select',
    code: 'SEC-BT-08',
    title: 'Thông tin & Lựa chọn Phụ huynh',
    subtitle: 'Xem/chọn phụ huynh, số điện thoại và nút Thêm phụ huynh mới',
    targetSelector: '[data-po-section="contact-select"]',
    intent: 'Xác định người liên hệ chính chịu trách nhiệm thanh toán và đưa đón học sinh',
    dataSources: [],
    acceptanceCriteriaList: [],
    cornerCasesList: [],
    businessRulesList: [],
    poNotes: '',
  },
  {
    id: 'child-select',
    code: 'SEC-BT-09',
    title: 'Thông tin & Lựa chọn Học viên',
    subtitle: 'Chọn bé tham gia học thử hoặc bấm thêm bé mới cho phụ huynh',
    targetSelector: '[data-po-section="child-select"]',
    intent: 'Gán hồ sơ học sinh trực tiếp vào ca học thử để theo dõi học lực và chuyển đổi sau này',
    dataSources: [],
    acceptanceCriteriaList: [],
    cornerCasesList: [],
    businessRulesList: [],
    poNotes: '',
  },
  {
    id: 'summary-card',
    code: 'SEC-BT-10',
    title: 'Khối Tóm tắt thông tin đặt lịch',
    subtitle: 'Xem lại toàn bộ thông tin buổi học thử trước khi gửi',
    targetSelector: '[data-po-section="summary-card"]',
    intent: 'Đảm bảo nhân viên không nhầm lẫn môn học, ca học hoặc cơ sở trước khi chốt lịch',
    dataSources: [],
    acceptanceCriteriaList: [],
    cornerCasesList: [],
    businessRulesList: [],
    poNotes: '',
  },
  {
    id: 'sms-zns-toggle',
    code: 'SEC-BT-11',
    title: 'Tùy chọn Tự động gửi SMS / Zalo ZNS',
    subtitle: 'Checkbox kích hoạt gửi tin nhắn xác nhận cho phụ huynh',
    targetSelector: '[data-po-section="sms-zns-toggle"]',
    intent: 'Tự động gửi tin nhắn mẫu Zalo ZNS / SMS kèm địa chỉ và giờ học tới số điện thoại phụ huynh',
    dataSources: [],
    acceptanceCriteriaList: [],
    cornerCasesList: [],
    businessRulesList: [],
    poNotes: '',
  },
  {
    id: 'submit-btn',
    code: 'SEC-BT-12',
    title: 'Nút Tạo booking học thử ngay',
    subtitle: 'Thực thi tạo phiếu đặt lịch học thử vào hệ thống',
    targetSelector: '[data-po-section="submit-btn"]',
    intent: 'Kiểm tra tính hợp lệ của toàn bộ form và ghi nhận ca học thử vào cơ sở dữ liệu',
    dataSources: [],
    acceptanceCriteriaList: [],
    cornerCasesList: [],
    businessRulesList: [],
    poNotes: '',
  },
  {
    id: 'success-view',
    code: 'SEC-BT-13',
    title: 'Màn hình Xác nhận Đặt lịch thành công',
    subtitle: 'Hiển thị mã phiếu, tóm tắt lịch hẹn và các hành động tiếp theo',
    targetSelector: '[data-po-section="success-view"]',
    intent: 'Cung cấp thông tin xác nhận cuối cùng, sao chép tin nhắn Zalo gửi phụ huynh và điều hướng',
    dataSources: [],
    acceptanceCriteriaList: [],
    cornerCasesList: [],
    businessRulesList: [],
    poNotes: '',
  },
]

export function getSavedPoSections(): PoSectionSpec[] {
  if (typeof window === 'undefined') return DEFAULT_PO_SECTIONS
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PO_SECTIONS)
    if (!raw) return DEFAULT_PO_SECTIONS
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) {
      return DEFAULT_PO_SECTIONS.map((defSec) => {
        const found = parsed.find((p: PoSectionSpec) => p.id === defSec.id)
        if (!found) return defSec
        return {
          ...defSec,
          ...found,
          dataSources: found.dataSources || [],
          acceptanceCriteriaList: found.acceptanceCriteriaList || [],
          cornerCasesList: found.cornerCasesList || [],
          businessRulesList: found.businessRulesList || [],
          poNotes: found.poNotes ?? '',
        }
      })
    }
  } catch {
    // Fallback
  }
  return DEFAULT_PO_SECTIONS
}

export function savePoSections(sections: PoSectionSpec[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY_PO_SECTIONS, JSON.stringify(sections))
  } catch {
    // Ignore error
  }
}

export function resetPoSections(): PoSectionSpec[] {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY_PO_SECTIONS)
    } catch {
      // Ignore error
    }
  }
  return DEFAULT_PO_SECTIONS
}

export function exportPoSpecToMarkdown(
  sections: PoSectionSpec[],
  filterSectionId?: string
): string {
  const targetSections = filterSectionId
    ? sections.filter((s) => s.id === filterSectionId)
    : sections

  const lines: string[] = []

  lines.push('# ĐẶC TẢ NGHIỆP VỤ PO — MÀN HÌNH ĐẶT LỊCH HỌC THỬ')
  lines.push(`*Thời gian xuất: ${new Date().toLocaleString('vi-VN')}*`)
  lines.push('')

  targetSections.forEach((sec, idx) => {
    lines.push(`## ${idx + 1}. [${sec.code}] ${sec.title}`)
    lines.push(`- **Mô tả / Ý đồ:** ${sec.intent || sec.subtitle}`)
    lines.push(`- **Target Selector:** \`${sec.targetSelector}\``)
    lines.push('')

    // 1. Data Sources
    lines.push('### 1. Nguồn dữ liệu & Trường thông tin')
    if (sec.dataSources.length === 0) {
      lines.push('*Chưa có dữ liệu nguồn được thiết lập.*')
    } else {
      lines.push('| Thực thể / Bảng | Danh sách trường | Ghi chú xử lý |')
      lines.push('| :--- | :--- | :--- |')
      sec.dataSources.forEach((ds) => {
        lines.push(
          `| ${ds.entity || '—'} | ${ds.fields || '—'} | ${ds.notes || '—'} |`
        )
      })
    }
    lines.push('')

    // 2. Acceptance Criteria (BDD)
    lines.push('### 2. Tiêu chí nghiệm thu (Acceptance Criteria - BDD)')
    if (sec.acceptanceCriteriaList.length === 0) {
      lines.push('*Chưa có tiêu chí nghiệm thu.*')
    } else {
      sec.acceptanceCriteriaList.forEach((ac, acIdx) => {
        lines.push(`#### AC-${acIdx + 1}: ${ac.scenario || 'Kịch bản chưa đặt tên'}`)
        lines.push(`- **Giả sử (Given):** ${ac.given || '—'}`)
        lines.push(`- **Khi (When):** ${ac.when || '—'}`)
        lines.push(`- **Thì (Then):** ${ac.then || '—'}`)
        lines.push('')
      })
    }

    // 3. Corner Cases
    lines.push('### 3. Trường hợp biên (Corner Cases & Ngoại lệ)')
    if (sec.cornerCasesList.length === 0) {
      lines.push('*Chưa có trường hợp biên.*')
    } else {
      lines.push('| Mã | Tình huống (Scenario) | Cách xử lý (Handling) |')
      lines.push('| :--- | :--- | :--- |')
      sec.cornerCasesList.forEach((cc) => {
        lines.push(
          `| ${cc.code || 'CASE-X'} | ${cc.scenario || '—'} | ${cc.handling || '—'} |`
        )
      })
    }
    lines.push('')

    // 4. Business Rules
    lines.push('### 4. Quy tắc nghiệp vụ (Business Rules)')
    if (sec.businessRulesList.length === 0) {
      lines.push('*Chưa có quy tắc nghiệp vụ.*')
    } else {
      lines.push('| Mã quy tắc | Tên quy tắc | Nội dung quy tắc / Điều kiện |')
      lines.push('| :--- | :--- | :--- |')
      sec.businessRulesList.forEach((br) => {
        lines.push(
          `| ${br.code || 'BR-X'} | ${br.title || '—'} | ${br.rule || '—'} |`
        )
      })
    }
    lines.push('')

    // 5. PO Notes
    if (sec.poNotes && sec.poNotes.trim()) {
      lines.push('### 5. Ghi chú bổ sung của PO')
      lines.push(sec.poNotes.trim())
      lines.push('')
    }

    lines.push('---')
    lines.push('')
  })

  return lines.join('\n')
}
