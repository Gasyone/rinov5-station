'use client'

import React from 'react'
import { MediaPreviewModal, type MediaPreviewItem } from '@/components/shared'

interface ClassesSessionCardMediaModalProps {
  previewMedia: MediaPreviewItem | null
  onClose: () => void
}

export function ClassesSessionCardMediaModal({
  previewMedia,
  onClose,
}: ClassesSessionCardMediaModalProps) {
  return (
    <MediaPreviewModal
      previewMedia={previewMedia}
      onClose={onClose}
    />
  )
}
