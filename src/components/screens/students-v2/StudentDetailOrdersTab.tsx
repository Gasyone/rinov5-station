'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Panel } from '@/components/shared'
import { getStatusBadgeClass } from '@/lib/statusColors'

export function StudentDetailOrdersTab() {
  const orders = [
    {
      id: 'ORD-84920',
      courseName: 'Khóa học IELTS Master 6.5+ (6 tháng)',
      amount: '12,500,000 đ',
      paymentStatus: 'paid',
      paymentLabel: 'Đã thanh toán',
      createdDate: '2025-01-15',
    },
    {
      id: 'ORD-81203',
      courseName: 'Lớp bổ trợ Speaking Advanced (1 tháng)',
      amount: '2,500,000 đ',
      paymentStatus: 'pending',
      paymentLabel: 'Chờ thanh toán',
      createdDate: '2025-05-18',
    },
  ]

  return (
    <div className="space-y-6">
      <Panel title="Danh sách gói đăng ký & Đơn hàng">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-semibold">Mã đơn hàng</TableHead>
              <TableHead className="font-semibold">Gói đăng ký / Sản phẩm</TableHead>
              <TableHead className="font-semibold">Tổng số tiền</TableHead>
              <TableHead className="font-semibold">Ngày tạo</TableHead>
              <TableHead className="font-semibold">Thanh toán</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((ord) => (
              <TableRow key={ord.id}>
                <TableCell className="font-mono text-xs font-semibold">{ord.id}</TableCell>
                <TableCell className="text-sm font-medium">{ord.courseName}</TableCell>
                <TableCell className="text-sm font-semibold">{ord.amount}</TableCell>
                <TableCell className="text-sm">{new Date(ord.createdDate).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusBadgeClass(ord.paymentStatus)}>
                    {ord.paymentLabel}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>
    </div>
  )
}
