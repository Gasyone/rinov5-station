'use client'

import { useState } from 'react'
import { Plus, ShieldCheck, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ExpandableSearch } from '@/components/controls'
import { EmptyState } from '@/components/shared'
import { PermissionsTopicCard } from './PermissionsTopicCard'
import type { PermissionTopic, PermissionRole } from './permissionsTypes'

interface PermissionsTopicGridProps {
  topics: PermissionTopic[]
  roles: PermissionRole[]
  onSelectRole: (role: PermissionRole) => void
  onCreateNewRole: (topicId?: string) => void
  onOpenCreateTopic: () => void
  onOpenRolesModal: (topic: PermissionTopic) => void
  onEditTopic: (topic: PermissionTopic) => void
  onDeleteTopic: (topic: PermissionTopic) => void
  onDeleteRole: (role: PermissionRole) => void
}

export function PermissionsTopicGrid({
  topics,
  roles,
  onSelectRole,
  onCreateNewRole,
  onOpenCreateTopic,
  onOpenRolesModal,
  onEditTopic,
  onDeleteTopic,
  onDeleteRole,
}: PermissionsTopicGridProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const query = searchQuery.trim().toLowerCase()

  // Filter topics and roles by query
  const filteredTopics = topics.filter((topic) => {
    if (!query) return true
    const topicMatch = topic.name.toLowerCase().includes(query)
    const hasMatchingRole = roles.some(
      (r) =>
        r.topicId === topic.id &&
        (r.name.toLowerCase().includes(query) || r.description.toLowerCase().includes(query))
    )
    return topicMatch || hasMatchingRole
  })

  return (
    <div className="flex-1 min-h-0 overflow-y-auto w-full">
      <div className="flex flex-col gap-4 p-4 lg:p-6 max-w-7xl mx-auto w-full pb-16">
        {/* Top Header Bar: Clean Toolbar with ExpandableSearch + Action Buttons (No big title/subtitle) */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-border/70 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
              v2026.08.07.01.prod
            </span>
          </div>

          {/* Action Buttons: Expandable Search on click, Add Topic, Create Role */}
          <div className="flex items-center gap-2">
            <ExpandableSearch
              value={searchQuery}
              onValueChange={setSearchQuery}
              placeholder="Tìm kiếm Topic / Nhóm quyền..."
              label="Tìm kiếm nhóm quyền"
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenCreateTopic}
              className="h-8 text-xs font-bold gap-1.5 border-border shadow-xs hover:bg-muted"
            >
              <Layers className="h-3.5 w-3.5 text-primary" />
              THÊM TOPIC +
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={() => onCreateNewRole()}
              className="h-8 text-xs font-bold gap-1.5 shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              TẠO NHÓM QUYỀN
            </Button>
          </div>
        </div>

        {/* Topics Grid */}
        {filteredTopics.length === 0 ? (
          <EmptyState
            icon={<ShieldCheck className="h-8 w-8 text-muted-foreground" />}
            title="Không tìm thấy Topic hoặc Nhóm quyền nào"
            description="Thử thay đổi từ khóa tìm kiếm hoặc bấm '+ THÊM TOPIC' để tạo mới."
            action={{
              label: '+ Tạo Topic Mới',
              onClick: onOpenCreateTopic,
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
            {filteredTopics.map((topic) => {
              const topicRoles = roles.filter((r) => r.topicId === topic.id)
              return (
                <PermissionsTopicCard
                  key={topic.id}
                  topic={topic}
                  roles={topicRoles}
                  onSelectRole={onSelectRole}
                  onAddNewRoleInTopic={(tId) => onCreateNewRole(tId)}
                  onOpenRolesModal={onOpenRolesModal}
                  onEditTopic={onEditTopic}
                  onDeleteTopic={onDeleteTopic}
                  onDeleteRole={onDeleteRole}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
