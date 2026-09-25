import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { usePaymentsStore } from '@/hooks/usePaymentsStore'
import { PageHeader } from '@/components/PageHeader'
import { MetricCard } from '@/components/MetricCard'
import { CopyableId } from '@/components/CopyableId'
import { AnimatedNumber } from '@/components/AnimatedNumber'
import { Skeleton } from '@/components/Skeleton'
import { BookIcon, LayersIcon, ShieldIcon } from '@/components/Icons'
import { formatDateTime, formatMinor, shortId } from '@/lib/format'
import { cn } from '@/lib/utils'

interface LedgerRow {
  orderId: string
  account: string
  entryType: 'DEBIT' | 'CREDIT'
  amount: number
  currency: 'INR' | 'USD' | 'EUR'
  createdAt: string
}

export function Ledger() {
  const { payments } = usePaymentsStore()

  const rows = useMemo<LedgerRow[]>(() => {
    const out: LedgerRow[] = []
    for (const p of payments) {
      const settled = p.status === 'SUCCESS' || p.status === 'REFUNDED'
      if (settled) {
        out.push(
          { orderId: p.orderId, account: 'gateway_clearing', entryType: 'DEBIT', amount: p.amount, currency: p.currency, createdAt: p.createdAt },
          { orderId: p.orderId, account: 'merchant_payable', entryType: 'CREDIT', amount: p.amount, currency: p.currency, createdAt: p.createdAt },
        )
      } else {
        out.push(
          { orderId: p.orderId, account: 'merchant_receivable', entryType: 'DEBIT', amount: p.amount, currency: p.currency, createdAt: p.createdAt },
          { orderId: p.orderId, account: 'gateway_clearing', entryType: 'CREDIT', amount: p.amount, currency: p.currency, createdAt: p.createdAt },
        )
      }
    }
    return out
  }, [payments])

  const totals = useMemo(() => {
    let debit = 0
    let credit = 0
    for (const r of rows) {
      if (r.entryType === 'DEBIT') debit += r.amount
      else credit += r.amount
    }
    return { debit, credit, balanced: debit === credit }
  }, [rows])

  const currency = payments[0]?.currency ?? 'INR'

  return (
    <div>
      <PageHeader
        eyebrow="Ledger"
        title="Double-entry ledger"
        description="Every financial movement produces matched debit and credit rows. Totals must always reconcile."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <MetricCard
          label="Total debits"
          icon={<LayersIcon className="h-4 w-4" />}
          tone="rose"
          value={<AnimatedNumber value={totals.debit} format={(v) => formatMinor(Math.round(v), currency)} />}
          hint={`${rows.filter((r) => r.entryType === 'DEBIT').length} entries`}
        />
        <MetricCard
          label="Total credits"
          icon={<LayersIcon className="h-4 w-4" />}
          tone="mint"
          value={<AnimatedNumber value={totals.credit} format={(v) => formatMinor(Math.round(v), currency)} />}
          hint={`${rows.filter((r) => r.entryType === 'CREDIT').length} entries`}
          delay={0.05}
        />
        <MetricCard
          label="Balance check"
          icon={<ShieldIcon className="h-4 w-4" />}
          tone={totals.balanced ? 'mint' : 'rose'}
          value={<span className="text-lg">{totals.balanced ? 'Reconciled' : 'Drift detected'}</span>}
          hint={totals.balanced ? 'Debits equal credits' : 'Investigate ledger'}
          delay={0.1}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15 }}
        className="card mt-4 overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-ink-800 px-5 py-4">
          <div className="flex items-center gap-2">
            <BookIcon className="h-4 w-4 text-cyanx-500" />
            <p className="text-sm font-semibold text-mist-100">Journal</p>
          </div>
          <span className="text-2xs text-mist-500">Projected from session orders</span>
        </div>

        {rows.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Skeleton className="mx-auto h-3 w-40" />
            <p className="mt-4 text-sm font-medium text-mist-300">No ledger entries yet</p>
            <p className="mt-1 text-xs text-mist-500">
              Create and settle a payment to populate the journal.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-ink-800 text-2xs uppercase tracking-wider text-mist-600">
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Account</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 text-right font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Posted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-800/60">
                {rows.map((row, i) => (
                  <motion.tr
                    key={`${row.orderId}-${row.account}-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(i * 0.02, 0.3) }}
                    className="transition-colors hover:bg-ink-850/50"
                  >
                    <td className="px-5 py-3">
                      <Link
                        to={`/payments/${row.orderId}`}
                        className="text-brand-500 transition-colors hover:text-brand-600"
                      >
                        <CopyableId value={row.orderId} display={shortId(row.orderId, 12)} />
                      </Link>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-mist-200">{row.account}</td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          'chip',
                          row.entryType === 'DEBIT'
                            ? 'border-rosex-500/40 bg-rosex-500/10 text-rosex-500'
                            : 'border-mint-500/40 bg-mint-500/10 text-mint-500',
                        )}
                      >
                        {row.entryType}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-xs text-mist-100">
                      {formatMinor(row.amount, row.currency)}
                    </td>
                    <td className="px-5 py-3 text-2xs text-mist-500">{formatDateTime(row.createdAt)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <p className="mt-3 px-1 text-2xs text-mist-600">
        Live ledger rows will be served by <span className="mono">GET /api/v1/ledger</span> once the
        backend journal endpoint is available. See the Developer page.
      </p>
    </div>
  )
}
