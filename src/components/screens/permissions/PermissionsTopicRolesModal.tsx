'use client'

import { useState } from 'react'
import { User, Plus, Trash2, Search, Shield } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { PermissionTopic, PermissionRole } from './permissionsTypes'

interface PermissionsTopicRolesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  topic: PermissionTopic | null
  roles: PermissionRole[]
  onSelectRole: (role: PermissionRole) => void
  onAddNewRole: (topicId: string) => void
  onDeleteRole: (role: PermissionRole) => void
}

export function PermissionsTopicRolesModal({
  open,
  onOpenChange,
  topic,
  roles,
  onSelectRole,
  onAddNewRole,
  onDeleteRole,
}: PermissionsTopicRolesModalProps) {
  const [searchQuery, setSearchQuery] = useState('')

  if (!topic) return null

  const query = searchQuery.trim().toLowerCase()
  const filteredRoles = roles.filter(
    (r) =>
      !query ||
      r.name.toLowerCase().includes(query) ||
      r.description.toLowerCase().includes(query)
  )

  const handleRoleClick = (role: PermissionRole) => {
    onOpenChange(false)
    onSelectRole(role)
  }

  const handleAddClick = () => {
    onOpenChange(false)
    onAddNewRole(topic.id)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[85vh] flex flex-col p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between pr-6">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <DialogTitle className="text-base font-bold text-foreground">
                Danh sách quyền — {topic.name}
              </DialogTitle>
            </div>
            <span className="text-xs font-semibold text-muted-foreground bg-background px-2 py-0.5 rounded-full border border-border">
              {roles.length} nhóm quyền
            </span>
          </div>
          {topic.description && (
            <p className="text-xs text-muted-foreground mt-1 text-left">
              {topic.description}
            </p>
          )}
        </DialogHeader>

        {/* Toolbar in Modal: Search & Add */}
        <div className="px-5 py-3 border-b border-border/60 flex items-center justify-between gap-2 bg-background">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm nhóm quyền trong topic..."
              className="h-8 pl-8 text-xs bg-muted/30"
            />
          </div>

          <Button
            type="button"
            size="sm"
            onClick={handleAddClick}
            className="h-8 text-xs font-bold gap-1 shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Thêm quyền
          </Button>
        </div>

        {/* Roles List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-2 max-h-[380px]">
          {filteredRoles.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <span className="text-xs italic">Không tìm thấy nhóm quyền phù hợp</span>
            </div>
          ) : (
            filteredRoles.map((role) => (
              <div
                key={role.id}
                onClick={() => handleRoleClick(role)}
                className="group flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-border/60 bg-card hover:bg-muted/50 hover:border-primary/40 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <User className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-foreground group-hover:text-primary truncate">
                      {role.name}
                    </span>
                    {role.description && (
                      <span className="text-xs text-muted-foreground truncate max-w-[340px]">
                        {role.description}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
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
                    title="Xóa nhóm quyền này"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
