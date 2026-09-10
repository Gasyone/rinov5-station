'use client'

import { useState, useMemo } from 'react'
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit2,
  Trash2,
  Copy,
  ChevronDown,
  ChevronRight,
  FolderPlus,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { PermissionTopic, PermissionRole } from './permissionsTypes'

interface PermissionRoleSidebarProps {
  topics: PermissionTopic[]
  roles: PermissionRole[]
  selectedRoleId: string | null
  isCreating: boolean
  creatingTopicId?: string
  onSelectRole: (role: PermissionRole) => void
  onCreateNewRole: (topicId: string) => void
  onOpenCreateTopic: () => void
  onEditTopic: (topic: PermissionTopic) => void
  onDeleteTopic: (topic: PermissionTopic) => void
  onDeleteRole: (role: PermissionRole) => void
  onDuplicateRole: (role: PermissionRole) => void
}

export function PermissionRoleSidebar({
  topics,
  roles,
  selectedRoleId,
  isCreating,
  creatingTopicId,
  onSelectRole,
  onCreateNewRole,
  onOpenCreateTopic,
  onEditTopic,
  onDeleteTopic,
  onDeleteRole,
  onDuplicateRole,
}: PermissionRoleSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Trạng thái thu gọn của Topic do người dùng click (mặc định mở tất cả)
  const [collapsedTopics, setCollapsedTopics] = useState<Record<string, boolean>>({})

  // Tính toán Topic có đang mở hay không trong render (không dùng useEffect)
  const isTopicOpen = (topicId: string) => {
    if (isCreating && creatingTopicId === topicId) return true
    const currentRole = roles.find((r) => r.id === selectedRoleId)
    if (currentRole?.topicId === topicId) return true
    return !collapsedTopics[topicId]
  }

  const toggleTopic = (topicId: string) => {
    setCollapsedTopics((prev) => {
      const currentlyOpen = isTopicOpen(topicId)
      return {
        ...prev,
        [topicId]: currentlyOpen,
      }
    })
  }

  // Lọc danh sách Roles theo ô tìm kiếm
  const { filteredTopics, rolesByTopic } = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    const byTopic: Record<string, PermissionRole[]> = {}

    topics.forEach((topic) => {
      let topicRoles = roles.filter((r) => r.topicId === topic.id)

      if (q) {
        topicRoles = topicRoles.filter(
          (r) =>
            r.name.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q)
        )
      }

      byTopic[topic.id] = topicRoles
    })

    const visibleTopics = topics.filter((topic) => {
      if (!q) return true
      return (byTopic[topic.id] || []).length > 0 || topic.name.toLowerCase().includes(q)
    })

    return { filteredTopics: visibleTopics, rolesByTopic: byTopic }
  }, [topics, roles, searchQuery])

  const totalMatchingRoles = useMemo(() => {
    return Object.values(rolesByTopic).reduce((sum, list) => sum + list.length, 0)
  }, [rolesByTopic])

  return (
    <aside className="w-76 lg:w-80 shrink-0 border-r border-border/60 bg-background flex flex-col h-full min-h-0 select-none p-3 space-y-3">
      {/* 1. Header Toolbar của Sidebar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Nhóm quyền
            </span>
            <span className="px-1.5 py-0.2 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
              {roles.length}
            </span>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={onOpenCreateTopic}
            className="h-7 px-2 text-xs font-medium text-muted-foreground hover:text-foreground gap-1 -mr-1"
            title="Thêm Topic phân loại mới"
          >
            <FolderPlus className="h-3.5 w-3.5" />
            <span>Thêm Topic</span>
          </Button>
        </div>

        {/* Ô tìm kiếm nhanh */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm tên nhóm quyền..."
            className="h-8 pl-8 text-xs bg-muted/30 border-border/50 focus-visible:bg-background"
          />
        </div>
      </div>

      {/* 2. ĐÓNG KHUNG SECTION NHÓM QUYỀN (Panel trái theo yêu cầu) */}
      <div className="flex-1 min-h-0 flex flex-col rounded-lg border border-border/70 bg-card/40 overflow-hidden shadow-2xs">
        <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-1">
          {filteredTopics.length === 0 || totalMatchingRoles === 0 ? (
            <div className="py-12 px-4 text-center">
              <p className="text-xs font-medium text-foreground">Không tìm thấy quyền nào</p>
              <p className="text-xs text-muted-foreground mt-0.5">Thử đổi từ khóa tìm kiếm</p>
            </div>
          ) : (
            filteredTopics.map((topic) => {
              const topicRoles = rolesByTopic[topic.id] || []
              const isOpen = isTopicOpen(topic.id)
              const isTopicActiveCreating = isCreating && creatingTopicId === topic.id

              return (
                <div key={topic.id} className="space-y-0.5">
                  {/* Topic Header Accordion */}
                  <div
                    onClick={() => toggleTopic(topic.id)}
                    className="group flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <span className="text-muted-foreground transition-transform">
                        {isOpen ? (
                          <ChevronDown className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5" />
                        )}
                      </span>
                      <span className="text-xs font-bold text-foreground/90 truncate" title={topic.name}>
                        {topic.name}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">
                        ({topicRoles.length})
                      </span>
                    </div>

                    {/* Nút thao tác nhanh trên Topic: Thêm quyền vào topic này & Menu tùy chọn */}
                    <div
                      className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => onCreateNewRole(topic.id)}
                        className="h-6 w-6 text-muted-foreground hover:text-primary rounded"
                        title={`Tạo nhóm quyền mới trong "${topic.name}"`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="h-6 w-6 text-muted-foreground hover:text-foreground rounded"
                          >
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-38 text-xs">
                          <DropdownMenuItem
                            onClick={() => onCreateNewRole(topic.id)}
                            className="gap-2 cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5 text-primary" />
                            Thêm quyền mới
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onEditTopic(topic)}
                            className="gap-2 cursor-pointer"
                          >
                            <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                            Đổi tên Topic
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDeleteTopic(topic)}
                            className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Xóa Topic
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Danh sách Roles thụt lề dưới Topic (BỎ ICON Ở CÁC NHÓM QUYỀN, BỎ MÃ QUYỀN) */}
                  {isOpen && (
                    <div className="ml-3 pl-2.5 border-l border-border/50 space-y-0.5 py-0.5">
                      {isTopicActiveCreating && (
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-semibold">
                          <Plus className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">Tạo quyền mới...</span>
                        </div>
                      )}

                      {topicRoles.length === 0 && !isTopicActiveCreating && (
                        <div className="px-2.5 py-1 text-xs text-muted-foreground/50 italic">
                          Chưa có nhóm quyền
                        </div>
                      )}

                      {topicRoles.map((role) => {
                        const isSelected = !isCreating && selectedRoleId === role.id

                        return (
                          <div
                            key={role.id}
                            onClick={() => onSelectRole(role)}
                            className={cn(
                              'group flex items-center justify-between px-2.5 py-1.5 rounded-md cursor-pointer text-xs transition-colors',
                              isSelected
                                ? 'bg-primary/10 text-primary font-semibold'
                                : 'text-foreground/80 hover:bg-muted/60 hover:text-foreground'
                            )}
                          >
                            {/* Tên nhóm quyền (KHÔNG CÓ ICON, KHÔNG CÓ MÃ QUYỀN) */}
                            <div className="min-w-0 flex-1">
                              <span className="truncate block" title={role.name}>
                                {role.name}
                              </span>
                            </div>

                            <div
                              className="flex items-center gap-1.5 shrink-0 ml-1.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span
                                className={cn(
                                  'inline-flex items-center gap-1 text-xs',
                                  isSelected ? 'text-primary font-bold' : 'text-muted-foreground'
                                )}
                              >
                                <Users className="h-2.5 w-2.5" />
                                {role.userCount}
                              </span>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon-xs"
                                    className="h-5 w-5 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground rounded transition-opacity"
                                  >
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-34 text-xs">
                                  <DropdownMenuItem
                                    onClick={() => onDuplicateRole(role)}
                                    className="gap-2 cursor-pointer"
                                  >
                                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                                    Nhân bản
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => onDeleteRole(role)}
                                    className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Xóa quyền
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </aside>
  )
}
