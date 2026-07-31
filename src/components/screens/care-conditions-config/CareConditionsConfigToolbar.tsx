'use client'

import React from 'react'
import { Plus, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusTiles, StatusTile } from '@/components/shared'
import { ToolbarSelect, ExpandableSearch } from '@/components/controls'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { CareConditionsFilterState } from './careConditionsTypes'

interface CareConditionsConfigToolbarProps {
  filters: CareConditionsFilterState
  onFilterChange: (filters: CareConditionsFilterState) => void
  statusTiles: StatusTile<string>[]
  totalCount: number
  onOpenCreateDialog: () => void
  onExportData: () => void
}

export const CareConditionsConfigToolbar: React.FC<CareConditionsConfigToolbarProps> = ({
  filters,
  onFilterChange,
  statusTiles,
  onOpenCreateDialog,
  onExportData,
}) => {
  return (
    <div className="flex flex-col gap-2 py-0.5 shrink-0">
      {/* ROW 1: TOOLBAR SELECTS WITH DIVIDERS ON LEFT, SEARCH & ACTION BUTTONS ON RIGHT */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        
        {/* TOOLBAR SELECTS ON LEFT WITH VERTICAL DIVIDERS */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Lọc theo Nguồn chỉ số */}
          <ToolbarSelect
            value={filters.metricSource || 'all'}
            options={[
              { value: 'all', label: 'Tất cả Nguồn chỉ số', selectedLabel: 'Tất cả Nguồn' },
              { value: 'curriculum_path', label: 'Lộ trình - Khung chương trình' },
              { value: 'class_db', label: 'CSDL Lớp học' },
              { value: 'attendance_session', label: 'CSDL Buổi học' },
              { value: 'exam_grade', label: 'CSDL Điểm Kiểm tra' },
              { value: 'homework_db', label: 'CSDL BTVN' },
              { value: 'attitude_rating', label: 'CSDL Thái độ' },
              { value: 'subscription_package', label: 'Gói đăng ký' },
              { value: 'periodic_time', label: 'Định kỳ thời gian' },
              { value: 'student_account', label: 'Học viên & Tài khoản' },
            ]}
            onValueChange={(val) => onFilterChange({ ...filters, metricSource: val })}
            className="h-8 text-xs min-w-[150px]"
          />

          <div className="h-4 w-px bg-border hidden sm:block shrink-0" />

          {/* Lọc theo Vai trò chính */}
          <ToolbarSelect
            value={filters.primaryRole}
            options={[
              { value: 'all', label: 'Tất cả Vai trò', selectedLabel: 'Tất cả Vai trò' },
              { value: 'CS', label: 'CS (Chuyên viên CS)' },
              { value: 'GV', label: 'GV (Giáo viên chủ nhiệm)' },
            ]}
            onValueChange={(val) => onFilterChange({ ...filters, primaryRole: val })}
            className="h-8 text-xs min-w-[140px]"
          />

          <div className="h-4 w-px bg-border hidden sm:block shrink-0" />

          {/* Lọc theo Mức ưu tiên */}
          <ToolbarSelect
            value={filters.priority}
            options={[
              { value: 'all', label: 'Tất cả Mức ưu tiên', selectedLabel: 'Tất cả Mức ưu tiên' },
              { value: 'urgent', label: 'Khẩn cấp' },
              { value: 'high', label: 'Cao' },
              { value: 'medium', label: 'Trung bình' },
              { value: 'low', label: 'Thường' },
            ]}
            onValueChange={(val) => onFilterChange({ ...filters, priority: val })}
            className="h-8 text-xs min-w-[150px]"
          />
        </div>

        {/* EXPANDABLE SEARCH TOGGLE & ACTION BUTTONS ON RIGHT */}
        <div className="flex items-center gap-2 shrink-0">
          <ExpandableSearch
            value={filters.search}
            onValueChange={(val) => onFilterChange({ ...filters, search: val })}
            placeholder="Tìm theo Mã hoặc Tên..."
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onExportData}
            className="h-8 text-xs font-medium gap-1.5 cursor-pointer shadow-2xs border-border"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Xuất dữ liệu</span>
          </Button>

          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={onOpenCreateDialog}
            className="h-8 text-xs font-medium gap-1.5 cursor-pointer shadow-2xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Thêm điều kiện mới</span>
          </Button>
        </div>
      </div>

      {/* ROW 2: STATUS TILES ON LEFT, RADIO BUTTONS FOR STATUS FILTER ON RIGHT */}
      <div className="flex items-center justify-between gap-3 flex-wrap py-0.5">
        <StatusTiles
          tiles={statusTiles}
          activeId={filters.nature || 'all'}
          onSelect={(id) => onFilterChange({ ...filters, nature: id })}
          className="py-0 flex-1 min-w-0"
        />

        {/* RADIO BUTTONS DÒNG TAB: ÁP DỤNG / NGỪNG ÁP DỤNG / TẤT CẢ */}
        <div className="flex items-center gap-3 text-xs shrink-0 pl-3 border-l border-border py-0.5">
          <span className="text-muted-foreground font-medium text-[11px] hidden sm:inline">Trạng thái:</span>
          <RadioGroup
            value={filters.status}
            onValueChange={(val) => onFilterChange({ ...filters, status: val as 'all' | 'active' | 'inactive' })}
            className="flex items-center gap-3"
          >
            <div className="flex items-center gap-1.5 cursor-pointer">
              <RadioGroupItem value="all" id="status-all" className="cursor-pointer" />
              <label htmlFor="status-all" className="text-xs font-medium text-foreground cursor-pointer select-none">
                Tất cả
              </label>
            </div>
            <div className="flex items-center gap-1.5 cursor-pointer">
              <RadioGroupItem value="active" id="status-active" className="cursor-pointer" />
              <label htmlFor="status-active" className="text-xs font-medium text-foreground cursor-pointer select-none">
                Áp dụng
              </label>
            </div>
            <div className="flex items-center gap-1.5 cursor-pointer">
              <RadioGroupItem value="inactive" id="status-inactive" className="cursor-pointer" />
              <label htmlFor="status-inactive" className="text-xs font-medium text-muted-foreground cursor-pointer select-none">
                Ngừng áp dụng
              </label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  )
}
