import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ApiError, api } from '@/api/client'
import type { Payment, PaymentStatus } from '@/api/types'
import { usePaymentsStore } from '@/hooks/usePaymentsStore'
import { useToast } from '@/hooks/useToasts'
import { PageHeader } from '@/components/PageHeader'
import { StatusBadge } from '@/components/StatusBadge'
import { CopyableId } from '@/components/CopyableId'
import { CreatePaymentPanel } from '@/components/CreatePaymentPanel'
import {
  AlertIcon,
  ArrowRightIcon,
  CardIcon,
  PlusIcon,
  RefreshIcon,
  SearchIcon,
} from '@/components/Icons'
import { formatDateTime, formatMinor, relativeTime, shortId } from '@/lib/format'
import { STATUS_META } from '@/lib/status'
import { cn } from '@/lib/utils'

const FILTERS: Array<PaymentStatus | 'ALL'> = ['ALL', 'CREATED', 'PROCESSING', 'SUCCESS', 'FAILED', 'REFUNDED']

export function Payments() {
  const { payments, add } = usePaymentsStore()
  const { push } = useToast()
  const [panelOpen, setPanelOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<PaymentStatus | 'ALL'>('ALL')
  const [refreshId, setRefreshId] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return payments.filter((p) => {
      const matchesFilter = filter === 'ALL' || p.status === filter
      const matchesQuery =
        !q ||
        p.orderId.toLowerCase().includes(q) ||
        p.merchantId.toLowerCase().includes(q)
      return matchesFilter && matchesQuery
    })
  }, [payments, query, filter])

  async function refreshOne(orderId: string) {
    if (!orderId.trim()) return
    setRefreshing(true)
    try {
      const payment = await api.getPayment(orderId.trim())
      add(payment)
      push({ tone: 'success', title: 'Refreshed', description: `${payment.orderId} · ${payment.status}` })
      setRefreshId('')
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to refresh'
      push({ tone: 'error', title: 'Lookup failed', description: message })
    } finally {
      setRefreshing(false)
    }
  }

  const counts = useMemo(() => {
    const map = new Map<PaymentStatus | 'ALL', number>()
    map.set('ALL', payments.length)
    for (const s of FILTERS) {
      if (s === 'ALL') continue
      map.set(s, payments.filter((p) => p.status === s).length)
    }
    return map
  }, [payments])

  return (
    <div>
      <PageHeader
        eyebrow="Payments"
        title="Orders"
        description="Create orders and track them through the orchestration lifecycle. Look up any order by ID from the engine."
        actions={
          <button onClick={() => setPanelOpen(true)} className="btn-primary">
            <PlusIcon className="h-4 w-4" />
            Create payment
          </button>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="card mb-4 flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-600" />
          <input
            className="input pl-10"
            placeholder="Search by order ID or merchant…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <input
              className="input font-mono text-xs"
              placeholder="ord_… lookup"
              value={refreshId}
              onChange={(e) => setRefreshId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && refreshOne(refreshId)}
            />
          </div>
          <button
            onClick={() => refreshOne(refreshId)}
            disabled={refreshing || !refreshId.trim()}
            className="btn-ghost !px-3"
            title="Fetch from backend"
          >
            <RefreshIcon className={cn('h-4 w-4', refreshing && 'animate-spin')} />
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-4 flex flex-wrap items-center gap-2"
      >
        {FILTERS.map((f) => {
          const isActive = filter === f
          const label = f === 'ALL' ? 'All' : STATUS_META[f].label
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'relative rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
                isActive
                  ? 'border-brand-400/50 text-mist-100'
                  : 'border-ink-700 text-mist-400 hover:border-ink-600 hover:text-mist-200',
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="filter-active"
                  className="absolute inset-0 rounded-full bg-brand-500/15"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">
                {label}
                <span className="ml-1.5 text-mist-600">{counts.get(f) ?? 0}</span>
              </span>
            </button>
          )
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15 }}
        className="card overflow-hidden"
      >
        <div className="hidden grid-cols-[1.6fr_1fr_1fr_0.9fr_1.1fr_40px] gap-4 border-b border-ink-800 px-5 py-3 text-2xs font-medium uppercase tracking-wider text-mist-600 md:grid">
          <span>Order</span>
          <span>Merchant</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Created</span>
          <span />
        </div>

        {filtered.length === 0 ? (
          <EmptyState hasAny={payments.length > 0} onCreate={() => setPanelOpen(true)} />
        ) : (
          <ul className="divide-y divide-ink-800/70">
            <AnimatePresence initial={false}>
              {filtered.map((p, i) => (
                <motion.li
                  key={p.orderId}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.25) }}
                >
                  <Link
                    to={`/payments/${p.orderId}`}
                    className="grid grid-cols-2 gap-3 px-5 py-4 transition-colors hover:bg-ink-850/60 md:grid-cols-[1.6fr_1fr_1fr_0.9fr_1.1fr_40px] md:items-center md:gap-4"
                  >
                    <div className="col-span-2 md:col-span-1">
                      <CopyableId value={p.orderId} display={shortId(p.orderId, 16)} />
                    </div>
                    <div className="truncate text-xs text-mist-300">{p.merchantId}</div>
                    <div className="font-mono text-sm text-mist-100">
                      {formatMinor(p.amount, p.currency)}
                    </div>
                    <div>
                      <StatusBadge status={p.status} />
                    </div>
                    <div className="text-2xs text-mist-500">
                      <span className="md:hidden">{relativeTime(p.createdAt)}</span>
                      <span className="hidden md:inline">{formatDateTime(p.createdAt)}</span>
                    </div>
                    <div className="hidden justify-end text-mist-600 md:flex">
                      <ArrowRightIcon className="h-4 w-4" />
                    </div>
                  </Link>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </motion.div>

      <p className="mt-3 flex items-center gap-1.5 px-1 text-2xs text-mist-600">
        <AlertIcon className="h-3.5 w-3.5" />
        This list reflects orders created in this browser session. A global list endpoint is pending —
        see the Developer page.
      </p>

      <CreatePaymentPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onCreated={(payment: Payment) => add(payment)}
      />
    </div>
  )
}

function EmptyState({ hasAny, onCreate }: { hasAny: boolean; onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-ink-700 bg-ink-850 text-mist-500">
        <CardIcon className="h-6 w-6" />
      </div>
      <p className="mt-4 text-sm font-medium text-mist-200">
        {hasAny ? 'No matching payments' : 'No payments yet'}
      </p>
      <p className="mt-1 max-w-sm text-xs text-mist-500">
        {hasAny
          ? 'Try a different search term or status filter.'
          : 'Create an order to watch it move through idempotent, lock-protected orchestration.'}
      </p>
      {!hasAny && (
        <button onClick={onCreate} className="btn-primary mt-5">
          <PlusIcon className="h-4 w-4" />
          Create payment
        </button>
      )}
    </div>
  )
}
