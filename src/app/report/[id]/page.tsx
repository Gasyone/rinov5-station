import { use } from 'react'
import { MonthlyReportLandingScreen } from '@/components/screens/report/MonthlyReportLandingScreen'

interface ReportPageProps {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ month?: string; student?: string }>
}

export default function ReportPage({ params, searchParams }: ReportPageProps) {
  const resolvedParams = use(params)
  const resolvedSearchParams = searchParams ? use(searchParams) : undefined

  return (
    <MonthlyReportLandingScreen
      reportIdOrStudentId={resolvedParams.id}
      initialMonthOption={resolvedSearchParams?.month}
    />
  )
}
