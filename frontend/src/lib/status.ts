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
    dot: 'bg-mist-400',
    text: 'text-mist-300',
    chip: 'border-ink-600 bg-ink-800 text-mist-300',
    description: 'Order accepted and persisted. Awaiting orchestration.',
  },
  PROCESSING: {
    label: 'Processing',
    tone: 'info',
    dot: 'bg-brand-400',
    text: 'text-brand-300',
    chip: 'border-brand-500/40 bg-brand-500/10 text-brand-200',
    description: 'Locked and awaiting gateway authorization.',
  },
  SUCCESS: {
    label: 'Success',
    tone: 'success',
    dot: 'bg-mint-400',
    text: 'text-mint-300',
    chip: 'border-mint-500/40 bg-mint-500/10 text-mint-300',
    description: 'Captured and settled. Ledger balanced.',
  },
  FAILED: {
    label: 'Failed',
    tone: 'danger',
    dot: 'bg-rosex-400',
    text: 'text-rosex-300',
    chip: 'border-rosex-500/40 bg-rosex-500/10 text-rosex-300',
    description: 'Terminal failure. Funds not moved.',
  },
  REFUNDED: {
    label: 'Refunded',
    tone: 'warning',
    dot: 'bg-amberx-400',
    text: 'text-amberx-300',
    chip: 'border-amberx-500/40 bg-amberx-500/10 text-amberx-300',
    description: 'Reversed. Compensating ledger entry posted.',
  },
}

export const STATUS_ORDER: PaymentStatus[] = ['CREATED', 'PROCESSING', 'SUCCESS']

export const TERMINAL_STATUSES: PaymentStatus[] = ['SUCCESS', 'FAILED', 'REFUNDED']

export function statusMeta(status: PaymentStatus): StatusMeta {
  return STATUS_META[status] ?? STATUS_META.CREATED
}
