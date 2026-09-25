import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { LoomPayLogo } from '@/brand/Logo'
import { useBackendHealth } from '@/hooks/useBackendHealth'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import {
  BookIcon,
  CardIcon,
  GridIcon,
  TerminalIcon,
  ArrowRightIcon,
  CheckIcon,
} from './Icons'

const NAV = [
  { to: '/dashboard', label: 'Overview', icon: GridIcon },
  { to: '/payments', label: 'Payments', icon: CardIcon },
  { to: '/ledger', label: 'Ledger', icon: BookIcon },
  { to: '/developer', label: 'Developer', icon: TerminalIcon },
]

function HealthPill() {
  const { health } = useBackendHealth()
  const online = health?.online
  const known = health !== null

  return (
    <div className="chip border-ink-600 bg-ink-750 text-mist-400">
      <span className="relative flex h-2 w-2">
        {online && (
          <span className="absolute inline-flex h-2 w-2 animate-pulse-ring rounded-full bg-mint-400 opacity-60" />
        )}
        <span
          className={cn(
            'relative inline-flex h-2 w-2 rounded-full',
            !known ? 'bg-mist-500' : online ? 'bg-mint-400' : 'bg-rosex-400',
          )}
        />
      </span>
      <span className="font-mono text-2xs">
        {!known ? 'checking' : online ? `api ${health?.latencyMs}ms` : 'offline'}
      </span>
    </div>
  )
}

function AccountMenu() {
  const { session, signOut } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const initials = (session?.name ?? 'Operator')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 rounded-full border border-ink-700 bg-ink-850 py-1 pl-1 pr-3 transition-colors hover:border-ink-600"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-cyanx-400 text-2xs font-bold text-white">
          {initials || 'LP'}
        </span>
        <span className="hidden text-xs font-medium text-mist-300 sm:block">
          {session?.name ?? 'Operator'}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.16 }}
              className="card absolute right-0 z-20 mt-2 w-60 overflow-hidden p-1.5 shadow-lift"
            >
              <div className="px-3 py-2.5">
                <p className="truncate text-sm font-semibold text-mist-100">{session?.name}</p>
                <p className="truncate text-xs text-mist-500">{session?.email}</p>
              </div>
              <div className="divider my-1" />
              <div className="flex items-center justify-between px-3 py-2 text-2xs text-mist-500">
                <span>Merchant</span>
                <span className="font-mono text-mist-300">{session?.merchantId}</span>
              </div>
              <div className="divider my-1" />
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-mist-300 transition-colors hover:bg-ink-750"
              >
                <ArrowRightIcon className="h-3.5 w-3.5 rotate-180" />
                Back to site
              </Link>
              <button
                onClick={() => {
                  signOut()
                  navigate('/', { replace: true })
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-rosex-500 transition-colors hover:bg-rosex-500/10"
              >
                <CheckIcon className="h-3.5 w-3.5 rotate-90" />
                Sign out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-ink-700 bg-ink-900 px-4 py-6 lg:flex">
      <Link to="/" className="px-2">
        <LoomPayLogo />
      </Link>

      <nav className="mt-9 flex flex-1 flex-col gap-1">
        <p className="label px-3 pb-2">Console</p>
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className="relative">
            {({ isActive }) => (
              <span
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive ? 'text-mist-100' : 'text-mist-400 hover:text-mist-100',
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-xl border border-brand-500/30 bg-brand-500/10"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon className="relative h-[18px] w-[18px]" />
                <span className="relative">{label}</span>
                {isActive && (
                  <span className="relative ml-auto h-1.5 w-1.5 rounded-full bg-brand-500" />
                )}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 rounded-2xl border border-brand-500/20 bg-brand-soft p-4">
        <p className="text-xs font-semibold text-mist-100">Orchestration engine</p>
        <p className="mt-1 text-2xs leading-relaxed text-mist-500">
          Idempotent writes, distributed locks, and a double-entry ledger.
        </p>
        <div className="mt-3 flex items-center gap-1.5 text-2xs text-mist-500">
          <span className="h-1.5 w-1.5 rounded-full bg-mint-400" />
          v0.1.0 · Spring Boot 3.4
        </div>
      </div>
    </aside>
  )
}

function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-ink-700 bg-ink-850/95 px-2 py-2 backdrop-blur-xl lg:hidden">
      {NAV.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} className="flex-1">
          {({ isActive }) => (
            <span
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg py-1.5 text-2xs font-medium transition-colors',
                isActive ? 'text-brand-500' : 'text-mist-500',
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 bg-grid-fade" />
      <div className="relative flex">
        <Sidebar />
        <div className="flex min-h-screen w-full flex-col">
          <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-ink-700/80 bg-ink-850/80 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="lg:hidden">
              <Link to="/">
                <LoomPayLogo size={30} />
              </Link>
            </div>
            <div className="hidden items-baseline gap-2 lg:flex">
              <span className="text-sm font-medium text-mist-300">
                Payment Orchestration Console
              </span>
            </div>
            <div className="flex items-center gap-3">
              <HealthPill />
              <AccountMenu />
            </div>
          </header>
          <main className="flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10">
            <div className="mx-auto w-full max-w-[1240px]">{children}</div>
          </main>
        </div>
      </div>
      <MobileNav />
    </div>
  )
}
