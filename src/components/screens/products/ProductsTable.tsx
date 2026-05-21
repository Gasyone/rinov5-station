'use client'

import { Package, Tags } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DataTableActions,
  EmptyState,
  EntityCell,
  StatusBadge,
} from '@/components/shared'
import { formatCurrency, formatDate } from '@/lib/format'
import type { Product } from '@/mocks/products'
import { CATEGORY_LABELS } from './productsTypes'

interface ProductsTableProps {
  items: Product[]
  onRowClick: (item: Product) => void
  onView: (item: Product) => void
  onEdit: (item: Product) => void
  onDelete: (item: Product) => void
}

const COLUMNS: Array<{ label: string; className?: string }> = [
  { label: 'Product' },
  { label: 'Category', className: 'min-w-32' },
  { label: 'Branch', className: 'min-w-44' },
  { label: 'Duration', className: 'min-w-28' },
  { label: 'Price', className: 'min-w-36' },
  { label: 'Tags', className: 'min-w-40' },
  { label: 'Created', className: 'min-w-28' },
  { label: 'Status', className: 'min-w-28' },
  { label: 'Actions', className: 'w-28 text-right' },
]

export function ProductsTable({ items, onRowClick, onView, onEdit, onDelete }: ProductsTableProps) {
  if (items.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <EmptyState
          icon={<Package className="h-7 w-7 text-muted-foreground" />}
          title="No products match the filters"
          description="Adjust search, branch, category, or status filters."
        />
      </div>
    )
  }

  return (
    <Table containerClassName="min-w-full" className="min-w-[1200px]">
      <TableHeader>
        <TableRow className="bg-muted/50 hover:bg-muted/50">
          {COLUMNS.map((col) => (
            <TableHead key={col.label} className={col.className}>
              {col.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((product) => (
          <TableRow
            key={product.id}
            className="cursor-pointer"
            onClick={() => onRowClick(product)}
          >
            <TableCell>
              <EntityCell name={product.name} supporting={product.code} />
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="rounded-md text-[10px] capitalize">
                {CATEGORY_LABELS[product.category]}
              </Badge>
            </TableCell>
            <TableCell className="text-sm">{product.branch}</TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {product.duration ?? '—'}
            </TableCell>
            <TableCell className="font-mono text-sm">{formatCurrency(product.price)}</TableCell>
            <TableCell>
              {product.tags?.length ? (
                <div className="flex flex-wrap items-center gap-1">
                  <Tags className="h-3 w-3 text-muted-foreground" />
                  {product.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="rounded-md text-[10px]">
                      {tag}
                    </Badge>
                  ))}
                  {product.tags.length > 2 ? (
                    <span className="text-[10px] text-muted-foreground">
                      +{product.tags.length - 2}
                    </span>
                  ) : null}
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              )}
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {formatDate(product.createdAt)}
            </TableCell>
            <TableCell>
              <StatusBadge status={product.status} />
            </TableCell>
            <TableCell className="text-right">
              <DataTableActions
                onView={() => onView(product)}
                onEdit={() => onEdit(product)}
                onDelete={() => onDelete(product)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
