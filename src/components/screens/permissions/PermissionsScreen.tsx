'use client'

import { useState } from 'react'
import {
  MOCK_PERMISSION_TOPICS,
  MOCK_PERMISSION_ROLES,
} from '@/mocks/permissions'
import { ConfirmDialog } from '@/components/shared'
import { PermissionsTopicGrid } from './PermissionsTopicGrid'
import { PermissionRoleEditForm } from './PermissionRoleEditForm'
import { PermissionTopicDialog } from './PermissionTopicDialog'
import { PermissionsTopicRolesModal } from './PermissionsTopicRolesModal'
import { createDefaultRolePermissions } from './permissionsHelpers'
import type {
  PermissionTopic,
  PermissionRole,
  RolePermissionMatrixItem,
} from './permissionsTypes'

export function PermissionsScreen() {
  const [topics, setTopics] = useState<PermissionTopic[]>(() => [...MOCK_PERMISSION_TOPICS])
  const [roles, setRoles] = useState<PermissionRole[]>(() => [...MOCK_PERMISSION_ROLES])

  // View state: 'grid' (Danh sách) vs 'edit' (Chỉnh sửa / Tạo mới)
  const [viewMode, setViewMode] = useState<'grid' | 'edit'>('grid')
  const [selectedRole, setSelectedRole] = useState<PermissionRole | null>(null)
  const [targetTopicId, setTargetTopicId] = useState<string | undefined>()

  // Topic Dialog State
  const [isTopicDialogOpen, setIsTopicDialogOpen] = useState(false)
  const [editingTopic, setEditingTopic] = useState<PermissionTopic | null>(null)

  // Roles List Modal State (When clicking "Xem thêm" in topic card)
  const [isRolesModalOpen, setIsRolesModalOpen] = useState(false)
  const [selectedTopicForRolesModal, setSelectedTopicForRolesModal] = useState<PermissionTopic | null>(null)

  // Confirm Delete Dialog State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'topic' | 'role'
    topic?: PermissionTopic
    role?: PermissionRole
  } | null>(null)

  // 1. Navigation handlers
  const handleSelectRole = (role: PermissionRole) => {
    setSelectedRole(role)
    setTargetTopicId(role.topicId)
    setViewMode('edit')
  }

  const handleCreateNewRole = (topicId?: string) => {
    setSelectedRole(null)
    setTargetTopicId(topicId || topics[0]?.id)
    setViewMode('edit')
  }

  const handleCancelEdit = () => {
    setSelectedRole(null)
    setViewMode('grid')
  }

  // 2. Open Roles Modal handler
  const handleOpenRolesModal = (topic: PermissionTopic) => {
    setSelectedTopicForRolesModal(topic)
    setIsRolesModalOpen(true)
  }

  // 3. Save Role handler
  const handleSaveRole = (roleData: {
    id?: string
    name: string
    topicId: string
    code: string
    description: string
    permissions: RolePermissionMatrixItem[]
  }) => {
    if (roleData.id) {
      // Update existing role
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
                updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
              }
            : r
        )
      )
    } else {
      // Create new role
      const newRole: PermissionRole = {
        id: 'role_' + Date.now(),
        name: roleData.name,
        topicId: roleData.topicId,
        code: roleData.code,
        description: roleData.description,
        userCount: 0,
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        permissions: roleData.permissions || createDefaultRolePermissions(),
      }
      setRoles((prev) => [newRole, ...prev])
    }

    setViewMode('grid')
    setSelectedRole(null)
  }

  // 4. Topic management handlers
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
    } else {
      const newTopic: PermissionTopic = {
        id: 'topic_' + Date.now(),
        name: topicData.name,
        code: topicData.code,
        description: topicData.description,
      }
      setTopics((prev) => [...prev, newTopic])
    }
  }

  // 5. Delete handlers with ConfirmDialog
  const handleDeleteTopic = (topic: PermissionTopic) => {
    setDeleteTarget({ type: 'topic', topic })
    setDeleteConfirmOpen(true)
  }

  const handleDeleteRole = (role: PermissionRole) => {
    setDeleteTarget({ type: 'role', role })
    setDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return

    if (deleteTarget.type === 'topic' && deleteTarget.topic) {
      const topicId = deleteTarget.topic.id
      setTopics((prev) => prev.filter((t) => t.id !== topicId))
      setRoles((prev) => prev.filter((r) => r.topicId !== topicId))
    } else if (deleteTarget.type === 'role' && deleteTarget.role) {
      const roleId = deleteTarget.role.id
      setRoles((prev) => prev.filter((r) => r.id !== roleId))
    }

    setDeleteConfirmOpen(false)
    setDeleteTarget(null)
  }

  const modalRoles = selectedTopicForRolesModal
    ? roles.filter((r) => r.topicId === selectedTopicForRolesModal.id)
    : []

  return (
    <div className="flex flex-col h-full w-full min-h-0 overflow-hidden bg-background">
      {viewMode === 'grid' ? (
        <PermissionsTopicGrid
          topics={topics}
          roles={roles}
          onSelectRole={handleSelectRole}
          onCreateNewRole={handleCreateNewRole}
          onOpenCreateTopic={handleOpenCreateTopic}
          onOpenRolesModal={handleOpenRolesModal}
          onEditTopic={handleEditTopic}
          onDeleteTopic={handleDeleteTopic}
          onDeleteRole={handleDeleteRole}
        />
      ) : (
        <PermissionRoleEditForm
          role={selectedRole}
          defaultTopicId={targetTopicId}
          topics={topics}
          onSave={handleSaveRole}
          onCancel={handleCancelEdit}
        />
      )}

      {/* Modal Thêm/Sửa Topic */}
      <PermissionTopicDialog
        open={isTopicDialogOpen}
        onOpenChange={setIsTopicDialogOpen}
        topic={editingTopic}
        onSave={handleSaveTopic}
      />

      {/* Modal Xem toàn bộ danh sách Nhóm quyền trong 1 Topic khi bấm Xem thêm */}
      <PermissionsTopicRolesModal
        open={isRolesModalOpen}
        onOpenChange={setIsRolesModalOpen}
        topic={selectedTopicForRolesModal}
        roles={modalRoles}
        onSelectRole={handleSelectRole}
        onAddNewRole={(tId) => {
          setIsRolesModalOpen(false)
          handleCreateNewRole(tId)
        }}
        onDeleteRole={handleDeleteRole}
      />

      {/* Dialog Xác nhận Xóa */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title={
          deleteTarget?.type === 'topic'
            ? `Xác nhận xóa Topic "${deleteTarget.topic?.name}"?`
            : `Xác nhận xóa Nhóm quyền "${deleteTarget?.role?.name}"?`
        }
        description={
          deleteTarget?.type === 'topic'
            ? 'Hành động này sẽ xóa vĩnh viễn Topic cùng toàn bộ các Nhóm quyền trực thuộc. Bạn có chắc chắn muốn tiếp tục?'
            : 'Hành động này sẽ xóa vĩnh viễn Nhóm quyền khỏi hệ thống. Bạn có chắc chắn muốn tiếp tục?'
        }
        confirmLabel="Xác nhận xóa"
        variant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
