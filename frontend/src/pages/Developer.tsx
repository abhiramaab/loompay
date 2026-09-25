import { useState } from 'react'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/PageHeader'
import { CopyableId } from '@/components/CopyableId'
import { CheckIcon, CopyIcon, InfoIcon, TerminalIcon } from '@/components/Icons'
import { cn, copyToClipboard } from '@/lib/utils'

interface Endpoint {
  method: 'GET' | 'POST'
  path: string
  description: string
  status: 'available' | 'pending'
  body?: string
  headers?: Record<string, string>
}

const ENDPOINTS: Endpoint[] = [
  {
    method: 'POST',
    path: '/api/v1/payments',
    description: 'Create a payment order. Idempotent on the supplied key.',
    status: 'available',
    headers: { 'Content-Type': 'application/json', 'X-Merchant-Id': 'merchant_123' },
    body: JSON.stringify(
      {
        merchantId: 'merchant_123',
        amount: 150000,
        currency: 'INR',
        idempotencyKey: 'idem_9f2c1a7b3d4e5f60',
      },
      null,
      2,
    ),
  },
  {
    method: 'GET',
    path: '/api/v1/payments/{orderId}',
    description: 'Fetch a single order and its current lifecycle status.',
    status: 'available',
  },
  {
    method: 'GET',
    path: '/api/v1/payments?merchantId=&status=&page=&size=',
    description: 'List orders with pagination and filters.',
    status: 'pending',
  },
  {
    method: 'GET',
    path: '/api/v1/ledger?orderId=&account=',
    description: 'Query double-entry journal rows and running balances.',
    status: 'pending',
  },
  {
    method: 'GET',
    path: '/api/v1/metrics/summary',
    description: 'Aggregate volume, success rate, and processing counts.',
    status: 'pending',
  },
  {
    method: 'POST',
    path: '/api/v1/webhooks/payment',
    description: 'Gateway callback to transition an order (SUCCESS/FAILED/REFUNDED).',
    status: 'pending',
  },
]

const CURL = `curl -X POST http://localhost:8081/api/v1/payments \\
  -H "Content-Type: application/json" \\
  -H "X-Merchant-Id: merchant_123" \\
  -d '{
    "merchantId": "merchant_123",
    "amount": 150000,
    "currency": "INR",
    "idempotencyKey": "idem_9f2c1a7b3d4e5f60"
  }'`

const SNIPPET = `// frontend/src/api/client.ts
const res = await fetch('/api/v1/payments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Merchant-Id': merchantId,
  },
  body: JSON.stringify({
    merchantId,
    amount: amountInMinorUnits,
    currency: 'INR',
    idempotencyKey,
  }),
})
const payment = await res.json()
// payment: { orderId, merchantId, amount, currency, status, createdAt }`

export function Developer() {
  return (
    <div>
      <PageHeader
        eyebrow="Developer"
        title="API reference"
        description="Explore the LoomPay orchestration API. Requests run against the live backend at :8081."
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card mb-4 flex flex-col gap-3 border-brand-500/30 bg-brand-gradient/5 p-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg border border-brand-500/40 bg-brand-500/10 text-brand-300">
            <InfoIcon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-mist-100">Base URL</p>
            <p className="mt-0.5 font-mono text-xs text-mist-400">
              http://localhost:8081/api/v1 · proxied at /api/v1 in dev
            </p>
          </div>
        </div>
        <CopyableId value="http://localhost:8081/api/v1" display="Copy base URL" />
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="flex flex-col gap-3 lg:col-span-3">
          {ENDPOINTS.map((endpoint, i) => (
            <motion.div
              key={endpoint.path}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="card p-4"
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className={cn(
                    'chip font-mono',
                    endpoint.method === 'POST'
                      ? 'border-brand-500/40 bg-brand-500/10 text-brand-200'
                      : 'border-cyanx-500/40 bg-cyanx-500/10 text-cyanx-300',
                  )}
                >
                  {endpoint.method}
                </span>
                <code className="font-mono text-xs text-mist-100">{endpoint.path}</code>
                <span
                  className={cn(
                    'chip ml-auto',
                    endpoint.status === 'available'
                      ? 'border-mint-500/40 bg-mint-500/10 text-mint-300'
                      : 'border-ink-600 bg-ink-800 text-mist-500',
                  )}
                >
                  {endpoint.status === 'available' ? 'available' : 'pending'}
                </span>
              </div>
              <p className="mt-2.5 text-2xs leading-relaxed text-mist-500">
                {endpoint.description}
              </p>

              {endpoint.body && (
                <EndpointBody body={endpoint.body} headers={endpoint.headers} />
              )}
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col gap-4 lg:col-span-2">
          <CodeCard title="curl" code={CURL} />
          <CodeCard title="TypeScript" code={SNIPPET} />
        </div>
      </div>
    </div>
  )
}

function EndpointBody({ body, headers }: { body: string; headers?: Record<string, string> }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-2xs font-medium text-brand-300 transition-colors hover:text-brand-200"
      >
        {open ? 'Hide' : 'Show'} sample request
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-2 overflow-hidden rounded-xl border border-ink-700 bg-ink-950/60"
        >
          {headers && (
            <pre className="border-b border-ink-800 px-4 py-3 font-mono text-2xs text-mist-500">
              {Object.entries(headers)
                .map(([k, v]) => `${k}: ${v}`)
                .join('\n')}
            </pre>
          )}
          <pre className="overflow-x-auto px-4 py-3 font-mono text-2xs leading-relaxed text-mist-300">
            {body}
          </pre>
        </motion.div>
      )}
    </div>
  )
}

function CodeCard({ title, code }: { title: string; code: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="card overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-ink-800 px-4 py-3">
        <div className="flex items-center gap-2 text-mist-400">
          <TerminalIcon className="h-3.5 w-3.5" />
          <span className="font-mono text-2xs">{title}</span>
        </div>
        <button
          onClick={async () => {
            await copyToClipboard(code)
            setCopied(true)
            setTimeout(() => setCopied(false), 1400)
          }}
          className="text-mist-500 transition-colors hover:text-brand-300"
        >
          {copied ? <CheckIcon className="h-3.5 w-3.5" /> : <CopyIcon className="h-3.5 w-3.5" />}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-2xs leading-relaxed text-mist-300">
        {code}
      </pre>
    </motion.div>
  )
}
