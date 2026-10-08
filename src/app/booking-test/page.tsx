'use client'

import { Suspense, useEffect } from 'react'
import { HeaderBar } from '@/components/layout/HeaderBar'
import { BookingTestCreateScreen } from '@/components/screens/booking-test/BookingTestCreateScreen'
import { UserProfileDialog } from '@/components/shared'
import { useUIStore } from '@/stores/useUIStore'

export default function BookingTestLandingPage() {
  const setCurrentMenuId = useUIStore((s) => s.setCurrentMenuId)
  const theme = useUIStore((s) => s.theme)

  // Đảm bảo đồng bộ theme dark/light với hệ thống
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
  }, [theme])

  // Thiết lập menuId chuẩn hệ thống cho HeaderBar
  useEffect(() => {
    setCurrentMenuId('booking_test')
    return () => {
      setCurrentMenuId(null)
    }
  }, [setCurrentMenuId])

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Header chuẩn hệ thống RinoEdu với logo chính thức, breadcrumb và controls người dùng */}
      <HeaderBar onOpenMobileSidebar={() => {}} />

      {/* Nội dung form đặt lịch test */}
      <main className="flex-1 min-h-0 py-2">
        <Suspense fallback={null}>
          <BookingTestCreateScreen />
        </Suspense>
      </main>

      <UserProfileDialog />
    </div>
  )
}
