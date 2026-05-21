/**
 * Shared formatting helpers — used across list/detail screens.
 * Keep this file pure: no React, no DOM.
 */

const VND_FORMAT = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
})

const COMPACT_VND = new Intl.NumberFormat('vi-VN', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

const DATE_FORMAT = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const DATETIME_FORMAT = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

/** Format an amount in VND. Returns "-" for `null/undefined/NaN`. */
export function formatCurrency(amount?: number | null): string {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return '-'
  return VND_FORMAT.format(amount)
}

/** Compact VND for tight tiles, e.g. `1,2 Tr ₫`. */
export function formatCurrencyCompact(amount?: number | null): string {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return '-'
  return `${COMPACT_VND.format(amount)} ₫`
}

/** Format ISO date string (yyyy-mm-dd) as dd/mm/yyyy. Returns "-" if unparseable. */
export function formatDate(value?: string | null): string {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return DATE_FORMAT.format(date)
}

/** Format ISO datetime as dd/mm/yyyy HH:mm. */
export function formatDateTime(value?: string | null): string {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return DATETIME_FORMAT.format(date)
}

/** Initials from a full name — max 2 chars. */
export function getInitials(name?: string | null): string {
  const parts = String(name ?? '').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

/** Mask a phone number: keep first 3 and last 3 digits, asterisk the middle. */
export function maskPhone(phone?: string | null): string {
  if (!phone) return '-'
  const trimmed = phone.trim()
  if (trimmed.length < 6) return trimmed
  return `${trimmed.slice(0, 3)}${'*'.repeat(trimmed.length - 6)}${trimmed.slice(-3)}`
}

/** Humanize a snake_case status: `started_assessment` → `Started Assessment`. */
export function humanizeStatus(value?: string | null): string {
  if (!value) return '-'
  return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
