'use client'

import { useState, useMemo } from 'react'
import {
  User,
  Plus,
  Trash2,
  Pencil,
  MapPin,
  ExternalLink,
  Tag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  ParentItem,
  PARENT_ROLE_CHIPS,
  PROVINCE_OPTIONS,
  DISTRICT_OPTIONS,
  WARD_OPTIONS,
  DEFAULT_WARDS,
} from './crmCustomerCreateTypes'
import { SearchSelect, SmallLabel } from './CrmCustomerCreateSearchSelect'

interface CrmCustomerParentSectionProps {
  parents: ParentItem[]
  setParents: React.Dispatch<React.SetStateAction<ParentItem[]>>
  province: string
  setProvince: (v: string) => void
  district: string
  setDistrict: (v: string) => void
  ward: string
  setWard: (v: string) => void
  addressDetail: string
  setAddressDetail: (v: string) => void
  mapCoordinates: string
  setMapCoordinates: (v: string) => void
}

export function CrmCustomerParentSection({
  parents,
  setParents,
  province,
  setProvince,
  district,
  setDistrict,
  ward,
  setWard,
  addressDetail,
  setAddressDetail,
  mapCoordinates,
  setMapCoordinates,
}: CrmCustomerParentSectionProps) {
  const [customRoleInputOpen, setCustomRoleInputOpen] = useState<Record<string, boolean>>({})

  const availableDistricts = useMemo(() => {
    return DISTRICT_OPTIONS[province] || DISTRICT_OPTIONS['TP. Hồ Chí Minh'] || []
  }, [province])

  const availableWards = useMemo(() => {
    return WARD_OPTIONS[district] || DEFAULT_WARDS
  }, [district])

  const fullAddressSearchQuery = useMemo(() => {
    return [addressDetail, ward, district, province].filter(Boolean).join(', ')
  }, [addressDetail, ward, district, province])

  const handleOpenGoogleMaps = () => {
    if (mapCoordinates.trim()) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapCoordinates)}`, '_blank')
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddressSearchQuery || 'TP. Hồ Chí Minh')}`, '_blank')
    }
  }

  const handleAddParent = () => {
    const newId = `parent-${Date.now()}`
    setParents((prev) => [
      ...prev.map((p) => ({ ...p, isCollapsed: true })),
      {
        id: newId,
        name: '',
        phone: '',
        email: '',
        role: 'Bố',
        isCollapsed: false,
      },
    ])
  }

  const handleToggleCollapseParent = (id: string) => {
    setParents((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isCollapsed: !p.isCollapsed } : p))
    )
  }

  const handleRemoveParent = (id: string) => {
    if (parents.length <= 1) return
    setParents((prev) => prev.filter((p) => p.id !== id))
  }

  const handleSelectRole = (parentId: string, role: string) => {
    if (role === 'Khác') {
      setCustomRoleInputOpen((prev) => ({ ...prev, [parentId]: true }))
    } else {
      setCustomRoleInputOpen((prev) => ({ ...prev, [parentId]: false }))
    }
    setParents((prev) =>
      prev.map((p) => (p.id === parentId ? { ...p, role } : p))
    )
  }

  const mainParent = parents[0]
  const additionalParents = parents.slice(1)

  return (
    <div className="flex flex-col gap-2.5">
      {/* ============================================================ */}
      {/* THẺ KHỐI 1: PHỤ HUYNH CHÍNH (LIÊN HỆ CHÍNH) */}
      {/* ============================================================ */}
      {mainParent && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-3.5 border border-border shadow-xs space-y-2.5">
          {/* Header dòng đầu: Tiêu đề bên trái, nút "+ Thêm phụ huynh" bên phải */}
          <div className="flex items-center justify-between pb-1.5 border-b border-border/70">
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4 text-primary" />
              <h3 className="text-xs font-semibold text-foreground">1. Phụ Huynh &amp; Liên Hệ</h3>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-6 px-2 text-xs font-medium text-primary bg-primary/5 border-primary/25 hover:bg-primary/10 cursor-pointer gap-1"
              onClick={handleAddParent}
            >
              <Plus className="h-3 w-3" />
              <span>Thêm phụ huynh</span>
            </Button>
          </div>

          {mainParent.isCollapsed ? (
            /* THẺ GOM PHỤ HUYNH CHÍNH */
            <div className="flex items-center justify-between pt-1 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[10.5px] shrink-0">
                  P1
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground truncate text-xs">
                      {mainParent.name.trim() || '[Chưa nhập họ tên]'}
                    </span>
                    <span className="text-xs px-1.5 py-0.2 rounded bg-primary/10 text-primary font-medium shrink-0">
                      {mainParent.role}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-muted-foreground truncate">
                    {mainParent.phone ? `SĐT: ${mainParent.phone}` : 'Chưa có SĐT'} {mainParent.email ? `• ${mainParent.email}` : ''}
                  </p>
                  {fullAddressSearchQuery && (
                    <p className="text-xs text-muted-foreground/80 truncate">
                      📍 {fullAddressSearchQuery}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6.5 px-2 text-xs font-medium text-primary hover:bg-primary/10 gap-1 cursor-pointer shrink-0 ml-1.5"
                onClick={() => handleToggleCollapseParent(mainParent.id)}
              >
                <Pencil className="h-2.5 w-2.5" />
                <span>Sửa</span>
              </Button>
            </div>
          ) : (
            /* FORM PHỤ HUYNH CHÍNH */
            <div className="space-y-2.5">
              <div className="flex items-center justify-between pb-0.5">
                <span className="text-xs font-semibold text-foreground">
                  Phụ huynh đại diện (Liên hệ chính)
                </span>
                {parents.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleToggleCollapseParent(mainParent.id)}
                    className="text-[10.5px] text-primary hover:underline cursor-pointer"
                  >
                    Thu gọn
                  </button>
                )}
              </div>

              <div>
                <SmallLabel label="Họ và tên người liên hệ / phụ huynh" />
                <Input
                  value={mainParent.name}
                  onChange={(e) => {
                    const val = e.target.value
                    setParents((prev) =>
                      prev.map((item) => (item.id === mainParent.id ? { ...item, name: val } : item))
                    )
                  }}
                  placeholder="Nhập họ và tên..."
                  className="h-7.5 text-xs bg-background placeholder:text-xs placeholder:text-muted-foreground/50 placeholder:font-normal"
                />
              </div>

              {/* SĐT liên hệ và Email cùng 1 hàng */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <SmallLabel label="SĐT liên hệ" />
                  <Input
                    value={mainParent.phone}
                    onChange={(e) => {
                      const val = e.target.value
                      setParents((prev) =>
                        prev.map((item) => (item.id === mainParent.id ? { ...item, phone: val } : item))
                      )
                    }}
                    placeholder="09xxxxxxxx"
                    className="h-7.5 text-xs bg-background placeholder:text-xs placeholder:text-muted-foreground/50 placeholder:font-normal"
                  />
                </div>
                <div>
                  <SmallLabel label="Email liên hệ" />
                  <Input
                    type="email"
                    value={mainParent.email}
                    onChange={(e) => {
                      const val = e.target.value
                      setParents((prev) =>
                        prev.map((item) => (item.id === mainParent.id ? { ...item, email: val } : item))
                      )
                    }}
                    placeholder="email@example.com"
                    className="h-7.5 text-xs bg-background placeholder:text-xs placeholder:text-muted-foreground/50 placeholder:font-normal"
                  />
                </div>
              </div>

              {/* DÒNG RIÊNG: VAI TRÒ NGƯỜI LIÊN HỆ */}
              <div className="space-y-1 pt-0.5">
                <SmallLabel label="Vai trò người liên hệ" />
                <div className="flex flex-wrap items-center gap-1.5">
                  {PARENT_ROLE_CHIPS.map((roleChip) => {
                    const isSelected = mainParent.role === roleChip
                    return (
                      <button
                        key={roleChip}
                        type="button"
                        onClick={() => handleSelectRole(mainParent.id, roleChip)}
                        className={cn(
                          'px-2.5 py-0.5 rounded-full text-xs transition-colors cursor-pointer border',
                          isSelected
                            ? 'bg-primary text-primary-foreground border-primary font-medium shadow-2xs'
                            : 'bg-background text-muted-foreground border-border/80 hover:bg-muted/60 hover:text-foreground'
                        )}
                      >
                        {roleChip}
                      </button>
                    )
                  })}
                </div>

                {/* Ô nhập vai trò tùy chỉnh khi chọn "Khác" */}
                {(customRoleInputOpen[mainParent.id] ||
                  !PARENT_ROLE_CHIPS.includes(mainParent.role as (typeof PARENT_ROLE_CHIPS)[number])) && (
                  <div className="flex items-center gap-1.5 pt-1 animate-in fade-in">
                    <Tag className="h-3 w-3 text-muted-foreground shrink-0" />
                    <Input
                      value={mainParent.customRole || (mainParent.role !== 'Khác' ? mainParent.role : '')}
                      onChange={(e) => {
                        const val = e.target.value
                        setParents((prev) =>
                          prev.map((item) =>
                            item.id === mainParent.id
                              ? { ...item, customRole: val, role: val || 'Khác' }
                              : item
                          )
                        )
                      }}
                      placeholder="Nhập vai trò khác (VD: Anh, Chị, Dì, Chú, Người giám hộ...)"
                      className="h-7 text-xs bg-background flex-1 placeholder:text-xs placeholder:text-muted-foreground/50 placeholder:font-normal"
                    />
                  </div>
                )}
              </div>

              {/* ĐỊA CHỈ CƯ TRÚ & ĐỊNH VỊ */}
              <div className="pt-2 border-t border-border/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 font-medium text-foreground">
                    <MapPin className="h-3.5 w-3.5 text-rose-500" />
                    <span>Địa chỉ cư trú &amp; Định vị</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenGoogleMaps}
                    className="flex items-center gap-1 text-primary hover:underline text-[10.5px] cursor-pointer"
                    title="Mở định vị Google Maps theo địa chỉ"
                  >
                    <span>Mở Map</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <SmallLabel label="Tỉnh / Thành phố" />
                    <SearchSelect
                      value={province}
                      onValueChange={(val) => {
                        setProvince(val)
                        const dists = DISTRICT_OPTIONS[val]
                        if (dists && dists[0]) setDistrict(dists[0].value)
                      }}
                      options={PROVINCE_OPTIONS}
                    />
                  </div>
                  <div>
                    <SmallLabel label="Quận / Huyện" />
                    <SearchSelect
                      value={district}
                      onValueChange={setDistrict}
                      options={availableDistricts}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <SmallLabel label="Phường / Xã" />
                    <SearchSelect
                      value={ward}
                      onValueChange={setWard}
                      options={availableWards}
                    />
                  </div>
                  <div>
                    <SmallLabel label="Số nhà, tên đường" />
                    <Input
                      value={addressDetail}
                      onChange={(e) => setAddressDetail(e.target.value)}
                      placeholder="Số nhà, ngõ..."
                      className="h-7.5 text-xs bg-background placeholder:text-xs placeholder:text-muted-foreground/50 placeholder:font-normal"
                    />
                  </div>
                </div>

                <div>
                  <SmallLabel label="Tọa độ vị trí / Link Map (Lat, Long)" />
                  <Input
                    value={mapCoordinates}
                    onChange={(e) => setMapCoordinates(e.target.value)}
                    placeholder="VD: 10.7769, 106.7009 hoặc link Google Map..."
                    className="h-7.5 text-xs bg-background font-mono placeholder:text-xs placeholder:text-muted-foreground/50 placeholder:font-normal"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* CÁC THẺ KHỐI SECTION RIÊNG BIỆT CHO PHỤ HUYNH 2, 3... */}
      {/* ============================================================ */}
      {additionalParents.map((p, idx) => (
        <div
          key={p.id}
          className="bg-white dark:bg-zinc-900 rounded-xl p-3.5 border border-border shadow-xs space-y-2.5 animate-in fade-in slide-in-from-top-1"
        >
          {p.isCollapsed ? (
            /* THẺ GOM PHỤ HUYNH BỔ SUNG */
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[10.5px] shrink-0">
                  P{idx + 2}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground truncate text-xs">
                      {p.name.trim() || `[Chưa nhập tên PH ${idx + 2}]`}
                    </span>
                    <span className="text-xs px-1.5 py-0.2 rounded bg-muted text-muted-foreground shrink-0">
                      {p.role}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-muted-foreground truncate">
                    {p.phone ? `SĐT: ${p.phone}` : 'Chưa có SĐT'} {p.email ? `• ${p.email}` : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 px-1.5 text-xs font-medium text-primary hover:bg-primary/10 gap-1 cursor-pointer"
                  onClick={() => handleToggleCollapseParent(p.id)}
                >
                  <Pencil className="h-2.5 w-2.5" />
                  <span>Sửa</span>
                </Button>
                <button
                  type="button"
                  onClick={() => handleRemoveParent(p.id)}
                  className="p-1 rounded text-rose-500 hover:bg-rose-50 cursor-pointer"
                  title="Xóa phụ huynh này"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ) : (
            /* FORM PHỤ HUYNH BỔ SUNG */
            <div className="space-y-2.5">
              <div className="flex items-center justify-between pb-1 border-b border-border/60">
                <span className="text-xs font-semibold text-foreground">
                  Thông tin Phụ huynh {idx + 2}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleToggleCollapseParent(p.id)}
                    className="text-[10.5px] text-primary hover:underline cursor-pointer"
                  >
                    Thu gọn
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveParent(p.id)}
                    className="text-rose-500 hover:text-rose-700 cursor-pointer p-0.5"
                    title="Xóa phụ huynh này"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <div>
                <SmallLabel label="Họ và tên" />
                <Input
                  value={p.name}
                  onChange={(e) => {
                    const val = e.target.value
                    setParents((prev) =>
                      prev.map((item) => (item.id === p.id ? { ...item, name: val } : item))
                    )
                  }}
                  placeholder="Họ tên..."
                  className="h-7.5 text-xs bg-background placeholder:text-xs placeholder:text-muted-foreground/50 placeholder:font-normal"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <SmallLabel label="SĐT" />
                  <Input
                    value={p.phone}
                    onChange={(e) => {
                      const val = e.target.value
                      setParents((prev) =>
                        prev.map((item) => (item.id === p.id ? { ...item, phone: val } : item))
                      )
                    }}
                    placeholder="09xxxxxxxx"
                    className="h-7.5 text-xs bg-background placeholder:text-xs placeholder:text-muted-foreground/50 placeholder:font-normal"
                  />
                </div>
                <div>
                  <SmallLabel label="Email" />
                  <Input
                    type="email"
                    value={p.email}
                    onChange={(e) => {
                      const val = e.target.value
                      setParents((prev) =>
                        prev.map((item) => (item.id === p.id ? { ...item, email: val } : item))
                      )
                    }}
                    placeholder="email@example.com"
                    className="h-7.5 text-xs bg-background placeholder:text-xs placeholder:text-muted-foreground/50 placeholder:font-normal"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <SmallLabel label="Vai trò" />
                <div className="flex flex-wrap items-center gap-1">
                  {PARENT_ROLE_CHIPS.map((roleChip) => (
                    <button
                      key={roleChip}
                      type="button"
                      onClick={() => handleSelectRole(p.id, roleChip)}
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-[10.5px] border cursor-pointer',
                        p.role === roleChip
                          ? 'bg-primary text-primary-foreground border-primary font-medium'
                          : 'bg-background text-muted-foreground border-border/80 hover:bg-muted/60'
                      )}
                    >
                      {roleChip}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
