'use client'

import { useEffect } from 'react'
import { ErrorState } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { RotateCw } from 'lucide-react'

export default function MenuErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('MenuPage error:', error)
  }, [error])

  const isChunkError =
    error.name === 'ChunkLoadError' ||
    error.message?.includes('Loading chunk') ||
    error.message?.includes('failed')

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 gap-4">
      <ErrorState
        title={isChunkError ? 'Phiên làm việc đã thay đổi (ChunkLoadError)' : 'Đã có lỗi xảy ra khi tải màn hình'}
        description={
          isChunkError
            ? 'Tệp mã nguồn trên máy chủ đã được cập nhật hoặc làm mới. Vui lòng ấn tải lại trang để cập nhật giao diện mới nhất.'
            : error.message || 'Không thể tải dữ liệu màn hình này.'
        }
        onRetry={() => {
          if (isChunkError) {
            window.location.reload()
          } else {
            reset()
          }
        }}
      />
      {isChunkError ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            window.location.reload()
          }}
        >
          <RotateCw className="mr-2 h-4 w-4" />
          Tải lại trang
        </Button>
      ) : null}
    </div>
  )
}

