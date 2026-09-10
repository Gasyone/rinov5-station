'use client'

import React from 'react'
import { DataPoolConfig } from './leadLifecycleTypes'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Plus,
  Edit2,
  Trash2,
  Globe,
  ExternalLink,
  Database,
  Copy,
} from 'lucide-react'
import { toast } from 'sonner'

interface LeadLifecyclePoolModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pools: DataPoolConfig[]
  onAddNewPool: () => void
  onEditPool: (pool: DataPoolConfig) => void
  onDeletePool: (poolId: string) => void
}

export const LeadLifecyclePoolModal: React.FC<LeadLifecyclePoolModalProps> = ({
  open,
  onOpenChange,
  pools,
  onAddNewPool,
  onEditPool,
  onDeletePool,
}) => {
  const handleCopyUrl = (url?: string, poolName?: string) => {
    if (!url) return
    navigator.clipboard.writeText(url)
    toast.success(`Đã sao chép link ${poolName || ''}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-6 gap-5">
        <DialogHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/80 pr-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300 shrink-0">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-foreground">
                Quản lý Kho Dữ liệu &amp; Tiếp nhận Lead
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Danh sách các kho dữ liệu tiếp nhận lead ban đầu ({pools.length} kho)
              </DialogDescription>
            </div>
          </div>

          <Button
            onClick={onAddNewPool}
            size="sm"
            className="h-8 text-xs gap-1.5 bg-[#ec4899] hover:bg-[#db2777] text-white font-medium cursor-pointer shrink-0 shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Thêm mới</span>
          </Button>
        </DialogHeader>

        {/* Bảng Danh sách Kho trong Modal - Không cuộn ngang, vừa khít 100%, thao tác luôn hiển thị */}
        <div className="border border-border/80 bg-card rounded-lg overflow-hidden">
          <Table className="w-full table-fixed" containerClassName="overflow-x-hidden min-h-0">
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border text-xs">
                <TableHead className="w-[180px] font-semibold text-foreground pl-4">
                  Tên kho
                </TableHead>
                <TableHead className="w-[75px] text-center font-semibold text-foreground">
                  Mã kho
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Link Url
                </TableHead>
                <TableHead className="w-[75px] text-right pr-4 font-semibold text-foreground">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pools.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-28 text-center text-xs text-muted-foreground">
                    Không có kho dữ liệu nào.
                  </TableCell>
                </TableRow>
              ) : (
                pools.map((pool) => {
                  return (
                    <TableRow
                      key={pool.id}
                      className="hover:bg-muted/20 border-b border-border/60 text-xs transition-colors"
                    >
                      {/* Tên kho */}
                      <TableCell className="font-medium text-foreground py-3 pl-4">
                        <span className="font-medium text-foreground truncate block" title={pool.name}>
                          {pool.name}
                        </span>
                      </TableCell>

                      {/* Mã kho */}
                      <TableCell className="text-center py-3">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-muted text-muted-foreground">
                          {pool.code}
                        </span>
                      </TableCell>

                      {/* Link Url */}
                      <TableCell className="py-3">
                        {pool.url ? (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0 pr-2">
                            <Globe className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                            <span
                              className="truncate text-foreground/80 hover:text-primary transition-colors cursor-pointer select-all"
                              title={pool.url}
                              onClick={() => handleCopyUrl(pool.url, pool.name)}
                            >
                              {pool.url}
                            </span>
                            <div className="flex items-center gap-0.5 shrink-0 ml-auto">
                              <button
                                type="button"
                                onClick={() => handleCopyUrl(pool.url, pool.name)}
                                className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                                title="Sao chép link"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                              <a
                                href={pool.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                                title="Mở liên kết"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground/40 italic text-xs">
                            Chưa gắn Link Url
                          </span>
                        )}
                      </TableCell>

                      {/* Thao tác: Sửa, Xóa */}
                      <TableCell className="text-right pr-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-950/30 cursor-pointer"
                            onClick={() => onEditPool(pool)}
                            title="Chỉnh sửa kho"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                            onClick={() => onDeletePool(pool.id)}
                            title="Xóa kho"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  )
}
