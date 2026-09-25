import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { LoomPayLogo } from '@/brand/Logo'
import { useBackendHealth } from '@/hooks/useBackendHealth'
import { cn } from '@/lib/utils'
import { BookIcon, CardIcon, GridIcon, TerminalIcon } from './Icons'

const NAV = [
  { to: '/', label: 'Overview', icon: GridIcon, end: true },
  { to: '/payments', label: 'Payments', icon: CardIcon },
  { to: '/ledger', label: 'Ledger', icon: BookIcon },
  { to: '/developer', label: 'Developer', icon: TerminalIcon },
]

function HealthPill() {
  const { health } = useBackendHealth()
  const online = health?.online
  const known = health !== null

  return (
    <div className="chip border-ink-600 bg-ink-850/80 text-mist-300">
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

function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-ink-800 bg-ink-900/40 px-4 py-6 backdrop-blur-xl lg:flex">
      <div className="px-2">
        <LoomPayLogo />
      </div>

      <nav className="mt-9 flex flex-1 flex-col gap-1">
        <p className="label px-3 pb-2">Console</p>
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className="relative">
            {({ isActive }) => (
              <span
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive ? 'text-mist-100' : 'text-mist-400 hover:text-mist-200',
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
                {isActive && <span className="relative ml-auto h-1.5 w-1.5 rounded-full bg-brand-400" />}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 rounded-2xl border border-ink-700/80 bg-gradient-to-br from-brand-500/10 to-cyanx-500/5 p-4">
        <p className="text-xs font-semibold text-mist-200">Orchestration engine</p>
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-ink-800 bg-ink-900/95 px-2 py-2 backdrop-blur-xl lg:hidden">
      {NAV.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} className="flex-1">
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
          <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-ink-800/80 bg-ink-950/70 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="lg:hidden">
              <LoomPayLogo size={30} />
            </div>
            <div className="hidden items-baseline gap-2 lg:flex">
              <span className="text-sm font-medium text-mist-300">Payment Orchestration Console</span>
              <span className="mono text-mist-600">/core</span>
            </div>
            <div className="flex items-center gap-3">
              <HealthPill />
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
