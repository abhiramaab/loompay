import type { PaymentStatus } from '@/api/types'

export interface StatusMeta {
  label: string
  tone: 'neutral' | 'info' | 'success' | 'warning' | 'danger'
  dot: string
  text: string
  chip: string
  description: string
}

export const STATUS_META: Record<PaymentStatus, StatusMeta> = {
  CREATED: {
    label: 'Created',
    tone: 'neutral',
    dot: 'bg-mist-500',
    text: 'text-mist-400',
    chip: 'border-ink-600 bg-ink-750 text-mist-400',
    description: 'Order accepted and persisted. Awaiting orchestration.',
  },
  PROCESSING: {
    label: 'Processing',
    tone: 'info',
    dot: 'bg-brand-500',
    text: 'text-brand-600',
    chip: 'border-brand-500/30 bg-brand-500/10 text-brand-600',
    description: 'Locked and awaiting gateway authorization.',
  },
  SUCCESS: {
    label: 'Success',
    tone: 'success',
    dot: 'bg-mint-400',
    text: 'text-mint-500',
    chip: 'border-mint-500/30 bg-mint-500/10 text-mint-500',
    description: 'Captured and settled. Ledger balanced.',
  },
  FAILED: {
    label: 'Failed',
    tone: 'danger',
    dot: 'bg-rosex-400',
    text: 'text-rosex-500',
    chip: 'border-rosex-500/30 bg-rosex-500/10 text-rosex-500',
    description: 'Terminal failure. Funds not moved.',
  },
  REFUNDED: {
    label: 'Refunded',
    tone: 'warning',
    dot: 'bg-amberx-400',
    text: 'text-amberx-500',
    chip: 'border-amberx-500/30 bg-amberx-500/10 text-amberx-500',
    description: 'Reversed. Compensating ledger entry posted.',
  },
}

export const STATUS_ORDER: PaymentStatus[] = ['CREATED', 'PROCESSING', 'SUCCESS']

export const TERMINAL_STATUSES: PaymentStatus[] = ['SUCCESS', 'FAILED', 'REFUNDED']

export function statusMeta(status: PaymentStatus): StatusMeta {
  return STATUS_META[status] ?? STATUS_META.CREATED
}
