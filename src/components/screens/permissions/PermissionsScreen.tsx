'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import {
  MOCK_PERMISSION_TOPICS,
  MOCK_PERMISSION_ROLES,
} from '@/mocks/permissions'
import { ConfirmDialog } from '@/components/shared'
import { PermissionRoleSidebar } from './PermissionRoleSidebar'
import { PermissionRoleDetailView } from './PermissionRoleDetailView'
import { PermissionTopicDialog } from './PermissionTopicDialog'
import { createDefaultRolePermissions } from './permissionsHelpers'
import type {
  PermissionTopic,
  PermissionRole,
  RolePermissionMatrixItem,
} from './permissionsTypes'

export function PermissionsScreen() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [topics, setTopics] = useState<PermissionTopic[]>(() => [...MOCK_PERMISSION_TOPICS])
  const [roles, setRoles] = useState<PermissionRole[]>(() => [...MOCK_PERMISSION_ROLES])

  const roleIdParam = searchParams?.get('roleId') || searchParams?.get('id')
  const actionParam = searchParams?.get('action')
  const topicIdParam = searchParams?.get('topicId')

  const isCreating = actionParam === 'create'

  // URL là single source of truth cho role được chọn, mặc định role đầu tiên nếu không có param
  const selectedRoleId = isCreating
    ? null
    : roleIdParam || (roles[0] ? roles[0].id : null)

  const selectedRole = roles.find((r) => r.id === selectedRoleId) || null

  // Topic Dialog State
  const [isTopicDialogOpen, setIsTopicDialogOpen] = useState(false)
  const [editingTopic, setEditingTopic] = useState<PermissionTopic | null>(null)

  // Confirm Delete Topic State
  const [deleteTopicConfirmOpen, setDeleteTopicConfirmOpen] = useState(false)
  const [topicToDelete, setTopicToDelete] = useState<PermissionTopic | null>(null)

  // 1. Navigation handlers
  const handleSelectRole = (role: PermissionRole) => {
    router.push(`/app/permissions?roleId=${encodeURIComponent(role.id)}`)
  }

  const handleCreateNewRole = (topicId: string) => {
    router.push(`/app/permissions?action=create&topicId=${encodeURIComponent(topicId)}`)
  }

  const handleCancel = () => {
    if (isCreating) {
      const fallbackId = roles[0]?.id || null
      if (fallbackId) {
        router.push(`/app/permissions?roleId=${encodeURIComponent(fallbackId)}`)
      } else {
        router.push('/app/permissions')
      }
    }
  }

  // 2. Save Role handler
  const handleSaveRole = (roleData: {
    id?: string
    name: string
    topicId: string
    code: string
    description: string
    permissions: RolePermissionMatrixItem[]
    userCount: number
  }) => {
    if (roleData.id) {
      // Cập nhật role hiện tại
      setRoles((prev) =>
        prev.map((r) =>
          r.id === roleData.id
            ? {
                ...r,
                name: roleData.name,
                topicId: roleData.topicId,
                code: roleData.code,
                description: roleData.description,
                permissions: roleData.permissions,
                userCount: roleData.userCount,
                updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
              }
            : r
        )
      )
      toast.success(`Đã cập nhật nhóm quyền "${roleData.name}"`)
    } else {
      // Tạo mới role
      const newRoleId = 'role_' + Date.now()
      const newRole: PermissionRole = {
        id: newRoleId,
        name: roleData.name,
        topicId: roleData.topicId,
        code: roleData.code,
        description: roleData.description,
        userCount: roleData.userCount || 0,
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        permissions: roleData.permissions || createDefaultRolePermissions(),
      }
      setRoles((prev) => [newRole, ...prev])
      router.push(`/app/permissions?roleId=${encodeURIComponent(newRoleId)}`)
      toast.success(`Đã tạo mới nhóm quyền "${roleData.name}"`)
    }
  }

  // 3. Delete Role handler
  const handleDeleteRole = (role: PermissionRole) => {
    setRoles((prev) => {
      const remaining = prev.filter((r) => r.id !== role.id)
      if (selectedRoleId === role.id) {
        const nextSelected = remaining[0]?.id || null
        if (nextSelected) {
          router.push(`/app/permissions?roleId=${encodeURIComponent(nextSelected)}`)
        } else {
          router.push('/app/permissions')
        }
      }
      return remaining
    })
    toast.success(`Đã xóa nhóm quyền "${role.name}"`)
  }

  // 4. Duplicate Role handler
  const handleDuplicateRole = (role: PermissionRole) => {
    const newRoleId = 'role_' + Date.now()
    const duplicatedRole: PermissionRole = {
      ...role,
      id: newRoleId,
      name: `${role.name} (Bản sao)`,
      code: `${role.code}_COPY`,
      userCount: 0,
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      permissions: role.permissions.map((p) => ({
        ...p,
        actions: { ...p.actions },
      })),
    }

    setRoles((prev) => [duplicatedRole, ...prev])
    router.push(`/app/permissions?roleId=${encodeURIComponent(newRoleId)}`)
    toast.success(`Đã nhân bản nhóm quyền thành "${duplicatedRole.name}"`)
  }

  // 5. Topic management handlers
  const handleOpenCreateTopic = () => {
    setEditingTopic(null)
    setIsTopicDialogOpen(true)
  }

  const handleEditTopic = (topic: PermissionTopic) => {
    setEditingTopic(topic)
    setIsTopicDialogOpen(true)
  }

  const handleSaveTopic = (topicData: { name: string; code: string; description?: string }) => {
    if (editingTopic) {
      setTopics((prev) =>
        prev.map((t) =>
          t.id === editingTopic.id
            ? { ...t, name: topicData.name, code: topicData.code, description: topicData.description }
            : t
        )
      )
      toast.success(`Đã cập nhật Topic "${topicData.name}"`)
    } else {
      const newTopic: PermissionTopic = {
        id: 'topic_' + Date.now(),
        name: topicData.name,
        code: topicData.code,
        description: topicData.description,
      }
      setTopics((prev) => [...prev, newTopic])
      toast.success(`Đã tạo Topic mới "${topicData.name}"`)
    }
  }

  const handleDeleteTopic = (topic: PermissionTopic) => {
    setTopicToDelete(topic)
    setDeleteTopicConfirmOpen(true)
  }

  const handleConfirmDeleteTopic = () => {
    if (!topicToDelete) return
    const topicId = topicToDelete.id
    setTopics((prev) => prev.filter((t) => t.id !== topicId))
    setRoles((prev) => prev.filter((r) => r.topicId !== topicId))
    toast.success(`Đã xóa Topic "${topicToDelete.name}" và các quyền trực thuộc`)
    setDeleteTopicConfirmOpen(false)
    setTopicToDelete(null)
  }

  return (
    <div className="flex h-full w-full min-h-0 overflow-hidden bg-background">
      {/* CỘT TRÁI (Master Sidebar): Danh sách nhóm quyền theo Topic */}
      <PermissionRoleSidebar
        topics={topics}
        roles={roles}
        selectedRoleId={selectedRoleId}
        isCreating={isCreating}
        creatingTopicId={topicIdParam || undefined}
        onSelectRole={handleSelectRole}
        onCreateNewRole={handleCreateNewRole}
        onOpenCreateTopic={handleOpenCreateTopic}
        onEditTopic={handleEditTopic}
        onDeleteTopic={handleDeleteTopic}
        onDeleteRole={handleDeleteRole}
        onDuplicateRole={handleDuplicateRole}
      />

      {/* CỘT PHẢI (Detail Workspace): Thông tin chi tiết, Ma trận quyền, Nhân sự & Lịch sử */}
      <PermissionRoleDetailView
        key={isCreating ? 'creating' : selectedRoleId || 'empty'}
        role={selectedRole}
        isCreating={isCreating}
        topics={topics}
        defaultTopicId={topicIdParam || topics[0]?.id}
        onSave={handleSaveRole}
        onCancel={handleCancel}
        onDeleteRole={handleDeleteRole}
        onDuplicateRole={handleDuplicateRole}
      />

      {/* Dialog Tạo/Sửa Topic */}
      <PermissionTopicDialog
        open={isTopicDialogOpen}
        onOpenChange={setIsTopicDialogOpen}
        topic={editingTopic}
        onSave={handleSaveTopic}
      />

      {/* Confirm Dialog Xóa Topic */}
      <ConfirmDialog
        open={deleteTopicConfirmOpen}
        onOpenChange={setDeleteTopicConfirmOpen}
        title={`Xác nhận xóa Topic "${topicToDelete?.name}"?`}
        description="Hành động này sẽ xóa vĩnh viễn Topic cùng toàn bộ các Nhóm quyền trực thuộc. Bạn có chắc chắn muốn tiếp tục?"
        confirmLabel="Xác nhận xóa"
        variant="destructive"
        onConfirm={handleConfirmDeleteTopic}
      />
    </div>
  )
}
