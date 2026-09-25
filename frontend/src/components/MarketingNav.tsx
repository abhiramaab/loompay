import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { Link } from 'react-router-dom'
import { LoomPayLogo } from '@/brand/Logo'
import { NAV_GROUPS, type NavGroup } from '@/lib/site'
import { cn } from '@/lib/utils'
import { ArrowRightIcon, ExternalIcon } from './Icons'

export function MarketingNav({ authed }: { authed: boolean }) {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string | null>(null)

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 16))

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled || active
          ? 'border-b border-ink-700/70 bg-ink-850/90 backdrop-blur-xl'
          : 'border-b border-transparent',
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-5 sm:px-8">
        <Link to="/" className="shrink-0">
          <LoomPayLogo />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" onMouseLeave={() => setActive(null)}>
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="relative" onMouseEnter={() => setActive(group.label)}>
              <button
                className={cn(
                  'rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
                  active === group.label
                    ? 'bg-ink-750 text-mist-100'
                    : 'text-mist-400 hover:text-mist-100',
                )}
              >
                {group.label}
              </button>
            </div>
          ))}
          <a
            href="#pricing"
            className="rounded-lg px-3.5 py-2 text-sm font-medium text-mist-400 transition-colors hover:text-mist-100"
          >
            Pricing
          </a>
          <a
            href="#developers"
            className="rounded-lg px-3.5 py-2 text-sm font-medium text-mist-400 transition-colors hover:text-mist-100"
          >
            Integrations
          </a>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link to="/login" className="btn-ghost !py-2 text-sm">
            Sign in
          </Link>
          <Link to={authed ? '/dashboard' : '/login'} className="btn-primary !py-2 text-sm">
            {authed ? 'Open console' : 'Get started'}
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink-700 text-mist-300 lg:hidden"
          aria-label="Menu"
        >
          <div className="flex flex-col gap-1.5">
            <motion.span
              animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block h-0.5 w-5 rounded-full bg-current"
            />
            <motion.span
              animate={open ? { opacity: 0 } : { opacity: 1 }}
              className="block h-0.5 w-5 rounded-full bg-current"
            />
            <motion.span
              animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="block h-0.5 w-5 rounded-full bg-current"
            />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {active && (
          <Dropdown group={NAV_GROUPS.find((g) => g.label === active)!} onClose={() => setActive(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && <MobileMenu onClose={() => setOpen(false)} authed={authed} />}
      </AnimatePresence>
    </motion.header>
  )
}

function Dropdown({ group, onClose }: { group: NavGroup; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.16 }}
      className="absolute inset-x-0 top-full hidden border-b border-ink-700/70 bg-ink-850/95 backdrop-blur-xl lg:block"
    >
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-[1fr_1fr_auto] gap-2 px-5 py-6 sm:px-8">
        <div className="grid grid-cols-2 gap-1.5">
          {group.items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={onClose}
              className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-ink-750"
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand-500/25 bg-brand-500/10 text-brand-500">
                <item.icon className="h-4 w-4" />
              </span>
              <span>
                <span className="flex items-center gap-1 text-sm font-semibold text-mist-100">
                  {item.label}
                  <ExternalIcon className="h-3 w-3 text-mist-600 opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-mist-500">
                  {item.description}
                </span>
              </span>
            </a>
          ))}
        </div>
        <div className="rounded-xl border border-ink-700 bg-ink-900 p-4">
          <p className="text-2xs font-semibold uppercase tracking-wider text-mist-500">
            More in {group.label}
          </p>
          <ul className="mt-3 space-y-2">
            {(group.footer ?? []).map((f) => (
              <li key={f.label}>
                <a
                  href={f.href}
                  onClick={onClose}
                  className="text-sm text-mist-300 transition-colors hover:text-brand-500"
                >
                  {f.label}
                </a>
              </li>
            ))}
            {!(group.footer ?? []).length && (
              <li className="text-xs text-mist-500">Explore the full {group.label} suite.</li>
            )}
          </ul>
        </div>
        <div className="flex w-52 flex-col justify-between rounded-xl border border-brand-500/20 bg-brand-soft p-4">
          <div>
            <p className="text-sm font-semibold text-mist-100">Start building</p>
            <p className="mt-1 text-xs leading-relaxed text-mist-500">
              Spin up the engine and send your first idempotent payment.
            </p>
          </div>
          <Link to="/login" onClick={onClose} className="btn-primary mt-4 !py-2 text-xs">
            Get started
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

function MobileMenu({ onClose, authed }: { onClose: () => void; authed: boolean }) {
  const [expanded, setExpanded] = useState<string | null>('Solutions')
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-ink-700 bg-ink-850 lg:hidden"
    >
      <div className="flex flex-col gap-1 px-5 py-4">
        {NAV_GROUPS.map((group) => {
          const isOpen = expanded === group.label
          return (
            <div key={group.label}>
              <button
                onClick={() => setExpanded(isOpen ? null : group.label)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-base font-medium text-mist-200"
              >
                {group.label}
                <ArrowRightIcon
                  className={cn('h-4 w-4 transition-transform', isOpen ? 'rotate-90' : '')}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden pl-2"
                  >
                    {group.items.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        onClick={onClose}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-mist-400"
                      >
                        <item.icon className="h-4 w-4 text-brand-500" />
                        {item.label}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
        <a href="#pricing" onClick={onClose} className="rounded-lg px-3 py-3 text-base font-medium text-mist-200">
          Pricing
        </a>
        <a
          href="#developers"
          onClick={onClose}
          className="rounded-lg px-3 py-3 text-base font-medium text-mist-200"
        >
          Integrations
        </a>
        <div className="mt-2 flex flex-col gap-2">
          <Link to="/login" className="btn-ghost w-full" onClick={onClose}>
            Sign in
          </Link>
          <Link to={authed ? '/dashboard' : '/login'} className="btn-primary w-full" onClick={onClose}>
            {authed ? 'Open console' : 'Get started'}
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
