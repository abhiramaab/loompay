import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LoomPayLogo, LoomPayMark } from '@/brand/Logo'
import { useAuth } from '@/hooks/useAuth'
import { ArrowLeftIcon, ArrowRightIcon, BookIcon, LockIcon, ShieldIcon } from '@/components/Icons'

export function Login() {
  const { isAuthenticated, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [merchantId, setMerchantId] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard'

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter a valid work email address.')
      return
    }
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 650))
    signIn({ email, name, merchantId })
    navigate(from, { replace: true })
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <BrandPanel />

      <div className="flex flex-col bg-ink-850 px-6 py-8 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-mist-500 transition-colors hover:text-mist-200"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to home
          </Link>
          <div className="lg:hidden">
            <LoomPayLogo size={30} />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center py-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-sm"
          >
            <h1 className="font-display text-2xl font-bold tracking-tight text-mist-100">
              Sign in to LoomPay
            </h1>
            <p className="mt-1.5 text-sm text-mist-400">
              Access the orchestration console and ledger.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
              <Field label="Work email">
                <input
                  className="input"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>

              <Field label="Full name" hint="optional">
                <input
                  className="input"
                  autoComplete="name"
                  placeholder="Ada Lovelace"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>

              <Field label="Merchant ID" hint="optional">
                <input
                  className="input font-mono text-xs"
                  placeholder="merchant_123"
                  value={merchantId}
                  onChange={(e) => setMerchantId(e.target.value)}
                />
              </Field>

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="rounded-xl border border-rosex-500/40 bg-rosex-500/10 px-4 py-3 text-xs text-rosex-500"
                >
                  {error}
                </motion.div>
              )}

              <button type="submit" disabled={submitting} className="btn-primary mt-1 w-full">
                {submitting ? 'Signing in…' : 'Continue'}
                {!submitting && <ArrowRightIcon className="h-4 w-4" />}
              </button>
            </form>

            <p className="mt-5 flex items-center justify-center gap-1.5 text-2xs text-mist-500">
              <LockIcon className="h-3.5 w-3.5" />
              Demo environment — any valid email signs you in.
            </p>
          </motion.div>
        </div>

        <p className="text-center text-2xs text-mist-500">
          By continuing you agree to the Terms and Privacy Policy.
        </p>
      </div>
    </div>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label className="text-xs font-medium text-mist-300">{label}</label>
        {hint && <span className="text-2xs text-mist-500">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

function BrandPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-cyanx-400 lg:flex lg:flex-col lg:justify-between lg:p-14">
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)',
          backgroundSize: '26px 26px',
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <div className="flex items-center gap-2.5">
          <LoomPayMark size={36} />
          <span className="font-display text-[1.35rem] font-bold tracking-tight text-white">
            LoomPay
          </span>
        </div>
      </motion.div>

      <div className="relative">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-md font-display text-4xl font-bold leading-[1.1] tracking-tight text-white"
        >
          The ledger that always balances.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-4 max-w-sm text-base leading-relaxed text-white/80"
        >
          Idempotent writes, distributed locks, and immutable double-entry accounting in a
          single control plane.
        </motion.p>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 space-y-4"
        >
          {[
            { icon: ShieldIcon, text: 'Exactly-once charges under concurrency' },
            { icon: BookIcon, text: 'Debits and credits verified continuously' },
            { icon: LockIcon, text: 'Rate limits and locks backed by Redis' },
          ].map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-sm font-medium text-white/90">{text}</span>
            </li>
          ))}
        </motion.ul>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="relative"
      >
        <div className="flex items-center gap-2 text-xs text-white/70">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          All systems operational
        </div>
      </motion.div>
    </div>
  )
}
