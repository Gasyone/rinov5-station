'use client'

import {
  GraduationCap,
  Plus,
  Trash2,
  Pencil,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ChildItem,
  BIRTH_YEAR_OPTIONS,
  COURSE_OPTIONS,
  POPULAR_SCHOOL_OPTIONS,
} from './crmCustomerCreateTypes'
import { SearchSelect, CreatableSearchSelect, SmallLabel } from './CrmCustomerCreateSearchSelect'

interface CrmCustomerChildSectionProps {
  childList: ChildItem[]
  setChildren: React.Dispatch<React.SetStateAction<ChildItem[]>>
}

export function CrmCustomerChildSection({
  childList,
  setChildren,
}: CrmCustomerChildSectionProps) {
  const currentYear = 2026

  const handleChildBirthYearChange = (childId: string, year: string) => {
    const y = parseInt(year, 10)
    const calculatedAge = !isNaN(y) && y <= currentYear ? String(currentYear - y) : ''
    setChildren((prev) =>
      prev.map((c) =>
        c.id === childId ? { ...c, birthYear: year, age: calculatedAge } : c
      )
    )
  }

  const handleAddChild = () => {
    const newId = `child-${Date.now()}`
    setChildren((prev) => [
      ...prev.map((c) => ({ ...c, isCollapsed: true })),
      {
        id: newId,
        name: '',
        currentSchool: '',
        birthYear: '',
        age: '',
        academicPerformance: '',
        phone: '',
        course: '',
        vuihocAccount: '',
        isCollapsed: false,
      },
    ])
  }

  const handleToggleCollapseChild = (childId: string) => {
    setChildren((prev) =>
      prev.map((c) => (c.id === childId ? { ...c, isCollapsed: !c.isCollapsed } : c))
    )
  }

  const handleRemoveChild = (id: string) => {
    if (childList.length <= 1) return
    setChildren((prev) => prev.filter((c) => c.id !== id))
  }

  const mainChild = childList[0]
  const additionalChildren = childList.slice(1)

  return (
    <div className="flex flex-col gap-2.5">
      {/* ============================================================ */}
      {/* THẺ KHỐI 1: BÉ 1 (HỌC VIÊN CHÍNH) */}
      {/* ============================================================ */}
      {mainChild && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-3.5 border border-border shadow-xs space-y-2.5">
          {/* Header dòng đầu: Tiêu đề bên trái, nút "+ Thêm con" bên phải */}
          <div className="flex items-center justify-between pb-1.5 border-b border-border/70">
            <div className="flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 text-blue-600" />
              <h3 className="text-xs font-semibold text-foreground">2. Thông Tin Học Viên (Con)</h3>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-6 px-2 text-xs font-medium text-emerald-700 bg-emerald-50/70 border-emerald-300 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 cursor-pointer gap-1"
              onClick={handleAddChild}
            >
              <Plus className="h-3 w-3" />
              <span>Thêm con</span>
            </Button>
          </div>

          {mainChild.isCollapsed ? (
            /* THẺ GOM BÉ 1 */
            <div className="flex items-center justify-between pt-1 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-[10.5px] shrink-0">
                  1
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground truncate text-xs">
                      {mainChild.name.trim() || 'Bé 1 (Chưa nhập tên)'}
                    </span>
                    {mainChild.birthYear && (
                      <span className="text-xs px-1.5 py-0.2 rounded bg-primary/10 text-primary font-medium shrink-0">
                        {mainChild.birthYear} {mainChild.age ? `(${mainChild.age} tuổi)` : ''}
                      </span>
                    )}
                    {!mainChild.birthYear && mainChild.age && (
                      <span className="text-xs px-1.5 py-0.2 rounded bg-primary/10 text-primary font-medium shrink-0">
                        {mainChild.age} tuổi
                      </span>
                    )}
                  </div>
                  {(mainChild.course || mainChild.currentSchool) ? (
                    <p className="text-[10.5px] text-muted-foreground truncate">
                      {[mainChild.course, mainChild.currentSchool].filter(Boolean).join(' • ')}
                    </p>
                  ) : (
                    <p className="text-[10.5px] text-muted-foreground/60 italic truncate">
                      Chưa nhập khóa học / trường học
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6.5 px-2 text-xs font-medium text-primary hover:bg-primary/10 gap-1 cursor-pointer shrink-0 ml-1.5"
                onClick={() => handleToggleCollapseChild(mainChild.id)}
              >
                <Pencil className="h-2.5 w-2.5" />
                <span>Sửa</span>
              </Button>
            </div>
          ) : (
            /* FORM BÉ 1 */
            <div className="space-y-2.5">
              <div className="flex items-center justify-between pb-0.5">
                <span className="text-xs font-semibold text-foreground">
                  Học viên chính (Bé 1)
                </span>
                {childList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleToggleCollapseChild(mainChild.id)}
                    className="text-[10.5px] text-primary hover:underline cursor-pointer"
                  >
                    Thu gọn
                  </button>
                )}
              </div>

              <div>
                <SmallLabel label="Tên con" required />
                <Input
                  value={mainChild.name}
                  onChange={(e) => {
                    const val = e.target.value
                    setChildren((prev) =>
                      prev.map((item) => (item.id === mainChild.id ? { ...item, name: val } : item))
                    )
                  }}
                  placeholder="Nhập tên của con..."
                  className="h-7.5 text-xs bg-background placeholder:text-xs placeholder:text-muted-foreground/50 placeholder:font-normal"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <SmallLabel label="Năm sinh của con" required />
                  <SearchSelect
                    value={mainChild.birthYear}
                    onValueChange={(val) => handleChildBirthYearChange(mainChild.id, val)}
                    options={BIRTH_YEAR_OPTIONS}
                    placeholder="Chọn năm sinh..."
                  />
                </div>
                <div>
                  <SmallLabel label="Độ tuổi của con (sửa tay được)" />
                  <Input
                    value={mainChild.age}
                    onChange={(e) => {
                      const val = e.target.value
                      setChildren((prev) =>
                        prev.map((item) => (item.id === mainChild.id ? { ...item, age: val } : item))
                      )
                    }}
                    placeholder="VD: 6 tuổi..."
                    className="h-7.5 text-xs bg-background placeholder:text-xs placeholder:text-muted-foreground/50 placeholder:font-normal font-medium"
                  />
                </div>
              </div>

              {/* TRƯỜNG ĐANG HỌC: SEARCHABLE & CREATABLE */}
              <div>
                <SmallLabel label="Trường đang học hiện tại của học viên" />
                <CreatableSearchSelect
                  value={mainChild.currentSchool}
                  onValueChange={(val) => {
                    setChildren((prev) =>
                      prev.map((item) => (item.id === mainChild.id ? { ...item, currentSchool: val } : item))
                    )
                  }}
                  options={POPULAR_SCHOOL_OPTIONS}
                  placeholder="Chọn hoặc nhập tên trường..."
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <SmallLabel label="Khoá học quan tâm" />
                  <SearchSelect
                    value={mainChild.course}
                    onValueChange={(val) => {
                      setChildren((prev) =>
                        prev.map((item) => (item.id === mainChild.id ? { ...item, course: val } : item))
                      )
                    }}
                    options={COURSE_OPTIONS}
                    placeholder="Chọn khoá học..."
                  />
                </div>
                <div>
                  <SmallLabel label="Học lực hiện tại" />
                  <Input
                    value={mainChild.academicPerformance}
                    onChange={(e) => {
                      const val = e.target.value
                      setChildren((prev) =>
                        prev.map((item) => (item.id === mainChild.id ? { ...item, academicPerformance: val } : item))
                      )
                    }}
                    placeholder="Giỏi / Khá / TB..."
                    className="h-7.5 text-xs bg-background placeholder:text-xs placeholder:text-muted-foreground/50 placeholder:font-normal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <SmallLabel label="SĐT riêng của con (nếu có)" />
                  <Input
                    value={mainChild.phone}
                    onChange={(e) => {
                      const val = e.target.value
                      setChildren((prev) =>
                        prev.map((item) => (item.id === mainChild.id ? { ...item, phone: val } : item))
                      )
                    }}
                    placeholder="SĐT riêng..."
                    className="h-7.5 text-xs bg-background placeholder:text-xs placeholder:text-muted-foreground/50 placeholder:font-normal"
                  />
                </div>
                <div>
                  <SmallLabel label="Tài khoản Vuihoc" />
                  <Input
                    value={mainChild.vuihocAccount}
                    onChange={(e) => {
                      const val = e.target.value
                      setChildren((prev) =>
                        prev.map((item) => (item.id === mainChild.id ? { ...item, vuihocAccount: val } : item))
                      )
                    }}
                    placeholder="Tài khoản online..."
                    className="h-7.5 text-xs bg-background placeholder:text-xs placeholder:text-muted-foreground/50 placeholder:font-normal"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* CÁC THẺ KHỐI SECTION RIÊNG BIỆT CHO BÉ 2, 3... */}
      {/* ============================================================ */}
      {additionalChildren.map((ch, idx) => (
        <div
          key={ch.id}
          className="bg-white dark:bg-zinc-900 rounded-xl p-3.5 border border-border shadow-xs space-y-2.5 animate-in fade-in slide-in-from-top-1"
        >
          {ch.isCollapsed ? (
            /* THẺ GOM BÉ BỔ SUNG */
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-[10.5px] shrink-0">
                  {idx + 2}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground truncate text-xs">
                      {ch.name.trim() || `Bé ${idx + 2} (Chưa nhập tên)`}
                    </span>
                    {ch.birthYear && (
                      <span className="text-xs px-1.5 py-0.2 rounded bg-primary/10 text-primary font-medium shrink-0">
                        {ch.birthYear} {ch.age ? `(${ch.age} tuổi)` : ''}
                      </span>
                    )}
                    {!ch.birthYear && ch.age && (
                      <span className="text-xs px-1.5 py-0.2 rounded bg-primary/10 text-primary font-medium shrink-0">
                        {ch.age} tuổi
                      </span>
                    )}
                  </div>
                  {(ch.course || ch.currentSchool) ? (
                    <p className="text-[10.5px] text-muted-foreground truncate">
                      {[ch.course, ch.currentSchool].filter(Boolean).join(' • ')}
                    </p>
                  ) : (
                    <p className="text-[10.5px] text-muted-foreground/60 italic truncate">
                      Chưa nhập khóa học / trường học
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 px-1.5 text-xs font-medium text-primary hover:bg-primary/10 gap-1 cursor-pointer"
                  onClick={() => handleToggleCollapseChild(ch.id)}
                >
                  <Pencil className="h-2.5 w-2.5" />
                  <span>Sửa</span>
                </Button>
                <button
                  type="button"
                  onClick={() => handleRemoveChild(ch.id)}
                  className="p-1 rounded text-rose-500 hover:bg-rose-50 cursor-pointer"
                  title="Xóa bé này"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ) : (
            /* FORM BÉ BỔ SUNG */
            <div className="space-y-2.5">
              <div className="flex items-center justify-between pb-1 border-b border-border/60">
                <span className="text-xs font-semibold text-foreground">
                  Thông tin bé {idx + 2}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleToggleCollapseChild(ch.id)}
                    className="text-[10.5px] text-primary hover:underline cursor-pointer"
                  >
                    Thu gọn
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveChild(ch.id)}
                    className="text-rose-500 hover:text-rose-700 cursor-pointer p-0.5"
                    title="Xóa bé này"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <div>
                <SmallLabel label="Tên con" required />
                <Input
                  value={ch.name}
                  onChange={(e) => {
                    const val = e.target.value
                    setChildren((prev) =>
                      prev.map((item) => (item.id === ch.id ? { ...item, name: val } : item))
                    )
                  }}
                  placeholder="Nhập tên của con..."
                  className="h-7.5 text-xs bg-background placeholder:text-xs placeholder:text-muted-foreground/50 placeholder:font-normal"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <SmallLabel label="Năm sinh" required />
                  <SearchSelect
                    value={ch.birthYear}
                    onValueChange={(val) => handleChildBirthYearChange(ch.id, val)}
                    options={BIRTH_YEAR_OPTIONS}
                    placeholder="Chọn năm sinh..."
                  />
                </div>
                <div>
                  <SmallLabel label="Độ tuổi (sửa tay được)" />
                  <Input
                    value={ch.age}
                    onChange={(e) => {
                      const val = e.target.value
                      setChildren((prev) =>
                        prev.map((item) => (item.id === ch.id ? { ...item, age: val } : item))
                      )
                    }}
                    placeholder="VD: 6 tuổi..."
                    className="h-7.5 text-xs bg-background placeholder:text-xs placeholder:text-muted-foreground/50 placeholder:font-normal font-medium"
                  />
                </div>
              </div>

              {/* TRƯỜNG ĐANG HỌC: SEARCHABLE & CREATABLE */}
              <div>
                <SmallLabel label="Trường đang học" />
                <CreatableSearchSelect
                  value={ch.currentSchool}
                  onValueChange={(val) => {
                    setChildren((prev) =>
                      prev.map((item) => (item.id === ch.id ? { ...item, currentSchool: val } : item))
                    )
                  }}
                  options={POPULAR_SCHOOL_OPTIONS}
                  placeholder="Chọn hoặc nhập tên trường..."
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <SmallLabel label="Khoá học" />
                  <SearchSelect
                    value={ch.course}
                    onValueChange={(val) => {
                      setChildren((prev) =>
                        prev.map((item) => (item.id === ch.id ? { ...item, course: val } : item))
                      )
                    }}
                    options={COURSE_OPTIONS}
                    placeholder="Chọn khoá học..."
                  />
                </div>
                <div>
                  <SmallLabel label="Học lực" />
                  <Input
                    value={ch.academicPerformance}
                    onChange={(e) => {
                      const val = e.target.value
                      setChildren((prev) =>
                        prev.map((item) => (item.id === ch.id ? { ...item, academicPerformance: val } : item))
                      )
                    }}
                    placeholder="Giỏi / Khá / TB..."
                    className="h-7.5 text-xs bg-background placeholder:text-xs placeholder:text-muted-foreground/50 placeholder:font-normal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <SmallLabel label="SĐT riêng" />
                  <Input
                    value={ch.phone}
                    onChange={(e) => {
                      const val = e.target.value
                      setChildren((prev) =>
                        prev.map((item) => (item.id === ch.id ? { ...item, phone: val } : item))
                      )
                    }}
                    placeholder="SĐT riêng..."
                    className="h-7.5 text-xs bg-background placeholder:text-xs placeholder:text-muted-foreground/50 placeholder:font-normal"
                  />
                </div>
                <div>
                  <SmallLabel label="Tài khoản Vuihoc" />
                  <Input
                    value={ch.vuihocAccount}
                    onChange={(e) => {
                      const val = e.target.value
                      setChildren((prev) =>
                        prev.map((item) => (item.id === ch.id ? { ...item, vuihocAccount: val } : item))
                      )
                    }}
                    placeholder="Tài khoản online..."
                    className="h-7.5 text-xs bg-background placeholder:text-xs placeholder:text-muted-foreground/50 placeholder:font-normal"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
