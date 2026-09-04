'use client'

import { User, MoreVertical, Plus, Edit2, Trash2, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { PermissionTopic, PermissionRole } from './permissionsTypes'

interface PermissionsTopicCardProps {
  topic: PermissionTopic
  roles: PermissionRole[]
  onSelectRole: (role: PermissionRole) => void
  onAddNewRoleInTopic: (topicId: string) => void
  onOpenRolesModal: (topic: PermissionTopic) => void
  onEditTopic: (topic: PermissionTopic) => void
  onDeleteTopic: (topic: PermissionTopic) => void
  onDeleteRole: (role: PermissionRole) => void
}

export function PermissionsTopicCard({
  topic,
  roles,
  onSelectRole,
  onAddNewRoleInTopic,
  onOpenRolesModal,
  onEditTopic,
  onDeleteTopic,
  onDeleteRole,
}: PermissionsTopicCardProps) {
  const visibleRoles = roles.slice(0, 2)
  const hasMore = roles.length > 2

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card shadow-xs transition-all hover:shadow-md hover:border-border/80 overflow-hidden">
      {/* Card Header: Topic Name + Counter on Left, [Thêm quyền + ...] on Right */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 dark:bg-muted/20 border-b border-border/60">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-bold text-sm text-foreground truncate" title={topic.name}>
            {topic.name}
          </span>
          <span className="text-xs font-semibold text-muted-foreground bg-background px-1.5 py-0.5 rounded-full border border-border">
            {roles.length}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => onAddNewRoleInTopic(topic.id)}
            className="h-7 px-2 text-xs font-semibold text-muted-foreground hover:text-primary hover:bg-muted/80 rounded-md gap-1"
            title="Thêm nhóm quyền mới vào topic này"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Thêm quyền</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-md"
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                onClick={() => onAddNewRoleInTopic(topic.id)}
                className="cursor-pointer text-xs flex items-center gap-2"
              >
                <Plus className="h-3.5 w-3.5 text-primary" />
                Thêm quyền mới
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onOpenRolesModal(topic)}
                className="cursor-pointer text-xs flex items-center gap-2"
              >
                <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                Xem toàn bộ quyền
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onEditTopic(topic)}
                className="cursor-pointer text-xs flex items-center gap-2"
              >
                <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                Sửa tên Topic
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteTopic(topic)}
                className="cursor-pointer text-xs flex items-center gap-2 text-rose-600 focus:text-rose-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Xóa Topic
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Roles List */}
      <div className="p-3 space-y-2 min-h-[96px]">
        {roles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-20 text-center text-muted-foreground">
            <Shield className="h-5 w-5 mb-1 opacity-40" />
            <span className="text-xs italic">Chưa có nhóm quyền nào</span>
            <Button
              variant="link"
              size="xs"
              onClick={() => onAddNewRoleInTopic(topic.id)}
              className="text-xs text-primary p-0 h-auto mt-1"
            >
              + Tạo quyền đầu tiên
            </Button>
          </div>
        ) : (
          <>
            {visibleRoles.map((role) => (
              <div
                key={role.id}
                onClick={() => onSelectRole(role)}
                className="group flex items-center justify-between px-3 py-2 rounded-lg border border-border/50 bg-background hover:bg-muted/50 hover:border-primary/40 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <User className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
                  <span
                    className="text-xs font-semibold text-foreground group-hover:text-primary truncate"
                    title={role.name}
                  >
                    {role.name}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10.5px] text-muted-foreground hidden sm:inline">
                    {role.userCount} nhân sự
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteRole(role)
                    }}
                    className="opacity-0 group-hover:opacity-100 h-6 w-6 text-muted-foreground hover:text-rose-600 rounded"
                    title="Xóa quyền này"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}

            {hasMore && (
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => onOpenRolesModal(topic)}
                  className="text-[11.5px] font-medium text-muted-foreground hover:text-primary italic cursor-pointer transition-colors"
                >
                  Xem thêm
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
