'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Settings, Play, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Panel, FieldLabel } from '@/components/shared'
import { InlineSelect } from '@/components/controls'
import { getStatusBadgeClass } from '@/lib/statusColors'

export function CareRuleEngineScreen() {
  const [rules, setRules] = useState([
    {
      id: 'R-01',
      title: 'Tự động tạo Ticket khi nghỉ học liên tiếp không phép',
      description: 'Khi học viên vắng học liên tiếp 3 buổi không có lý do được phê duyệt.',
      category: 'Chuyên cần (Attendance)',
      priority: 'high',
      active: true,
      conditionValue: '3',
    },
    {
      id: 'R-02',
      title: 'Tự động tạo Ticket cảnh báo chậm đóng phí học tập',
      description: 'Khi học viên chưa hoàn tất học phí quá 7 ngày kể từ khi bắt đầu khóa học mới.',
      category: 'Học phí (Billing)',
      priority: 'medium',
      active: true,
      conditionValue: '7',
    },
    {
      id: 'R-03',
      title: 'Tự động tạo Ticket nhắc hẹn Booking Test',
      description: 'Khi học viên có lịch kiểm tra đầu vào nhưng không có mặt hoặc trễ quá 15 phút.',
      category: 'Tuyển sinh (Admissions)',
      priority: 'high',
      active: false,
      conditionValue: '15',
    },
  ])

  const handleToggleRule = (id: string, val: boolean) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: val } : r))
    )
    toast.success(val ? 'Đã kích hoạt quy tắc tự động' : 'Đã tạm dừng quy tắc tự động')
  }

  const handleRunRuleManually = (title: string) => {
    toast.info(`Hệ thống đang quét toàn bộ cơ sở dữ liệu để chạy quy tắc: "${title}"`)
    setTimeout(() => {
      toast.success('Hoàn thành quét: Không có thêm học viên nào vi phạm quy tắc này.')
    }, 1200)
  }

  const getPriorityText = (prio: string) => {
    switch (prio) {
      case 'high':
        return 'Cao'
      case 'medium':
        return 'Trung bình'
      default:
        return 'Thấp'
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="border-b px-4 py-4 lg:px-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            Quy tắc Chăm sóc Học viên tự động
          </h1>
          <p className="text-xs text-muted-foreground">
            Thiết lập các điều kiện kích hoạt sinh phiếu hỗ trợ chăm sóc (Support Tickets) tự động cho CSM
          </p>
        </div>
        <Button size="sm">
          <Settings className="h-4 w-4 mr-1" /> Lưu cấu hình
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-4 lg:p-6 space-y-6">
        <Panel title="Danh sách các quy tắc kích hoạt tự động">
          <div className="space-y-4">
            {rules.map((rule) => (
              <Card key={rule.id} className="p-4 border hover:border-muted-foreground/30 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-foreground">{rule.title}</span>
                      <Badge variant="outline" className={getStatusBadgeClass(rule.priority)}>
                        Mức độ: {getPriorityText(rule.priority)}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px]">
                        {rule.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{rule.description}</p>
                    
                    <div className="pt-2 flex items-center gap-4 flex-wrap text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Giá trị ngưỡng kích hoạt:</span>
                        <span className="font-semibold text-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                          {rule.conditionValue} {rule.id === 'R-01' ? 'buổi' : rule.id === 'R-02' ? 'ngày' : 'phút'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-start">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">Kích hoạt:</span>
                      <Switch
                        checked={rule.active}
                        onCheckedChange={(checked) => handleToggleRule(rule.id, checked)}
                      />
                    </div>
                    <Button
                      size="icon-sm"
                      variant="outline"
                      title="Chạy quét thử nghiệm ngay"
                      onClick={() => handleRunRuleManually(rule.title)}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Panel>

        <Panel title="Cấu hình nâng cao">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel label="Số lượng ticket tối đa đồng thời trên học viên">
                <InlineSelect
                  value="2"
                  onValueChange={() => {}}
                  options={[
                    { value: '1', label: 'Tối đa 1 ticket' },
                    { value: '2', label: 'Tối đa 2 tickets (Khuyến nghị)' },
                    { value: '3', label: 'Không giới hạn' },
                  ]}
                  ariaLabel="Chọn số lượng ticket tối đa"
                />
              </FieldLabel>
            </div>

            <div>
              <FieldLabel label="Kênh thông báo cho CSM khi sinh ticket">
                <InlineSelect
                  value="all"
                  onValueChange={() => {}}
                  options={[
                    { value: 'system', label: 'Chỉ thông báo hệ thống' },
                    { value: 'all', label: 'Hệ thống + Email' },
                  ]}
                  ariaLabel="Chọn kênh thông báo"
                />
              </FieldLabel>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  )
}
